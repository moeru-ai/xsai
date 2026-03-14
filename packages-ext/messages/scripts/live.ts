import type { StreamingEvent } from '../src/types/streaming-event'

import process from 'node:process'

import { z } from 'zod'

import { countTokens, messages, tool } from '../src'

interface CheckResult {
  details: Record<string, unknown>
  name: string
  ok: boolean
}

interface LiveConfig {
  apiKey: string
  baseURL: string
  model: string
}

const abortSignal = AbortSignal.timeout(60_000)

process.on('unhandledRejection', (error) => {
  console.error('\n[UNHANDLED_REJECTION]')
  console.error(error)
})

const normalizeAnthropicBaseURL = (baseURL: string): string => {
  const url = new URL(baseURL)

  if (!url.pathname.endsWith('/v1/') && !url.pathname.endsWith('/v1')) {
    url.pathname = `${url.pathname.replace(/\/$/, '')}/v1/`
  }

  return url.toString()
}

const getConfig = (): LiveConfig => {
  const baseURL = process.env.ANTHROPIC_BASE_URL
  const apiKey = process.env.ANTHROPIC_AUTH_TOKEN
  const model = process.env.ANTHROPIC_MODEL

  if (baseURL == null || apiKey == null || model == null) {
    throw new Error('Missing required environment variables: ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN, ANTHROPIC_MODEL.')
  }

  return {
    apiKey,
    baseURL: normalizeAnthropicBaseURL(baseURL),
    model,
  }
}

const collectText = async (stream: ReadableStream<string>): Promise<string> => {
  let text = ''

  for await (const chunk of stream) {
    text += chunk
  }

  return text
}

const collectEvents = async (stream: ReadableStream<StreamingEvent>): Promise<StreamingEvent[]> => {
  const events: StreamingEvent[] = []

  for await (const event of stream) {
    events.push(event)
  }

  return events
}

const printResult = ({ details, name, ok }: CheckResult): void => {
  const status = ok ? 'PASS' : 'FAIL'
  console.log(`\n[${status}] ${name}`)
  console.log(JSON.stringify(details, null, 2))
}

const runCountTokensCheck = async (config: LiveConfig): Promise<CheckResult> => {
  const result = await countTokens({
    abortSignal,
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    messages: [{ content: 'Count tokens for this sentence.', role: 'user' }],
    model: config.model,
  })

  return {
    details: result,
    name: 'countTokens',
    ok: Number.isFinite(result.input_tokens) && result.input_tokens > 0,
  }
}

const runBasicStreamCheck = async (config: LiveConfig): Promise<CheckResult> => {
  const result = messages({
    abortSignal,
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    max_tokens: 128,
    messages: [{ content: 'Reply with exactly BASIC_OK and nothing else.', role: 'user' }],
    model: config.model,
    temperature: 1,
  })

  const [text, reasoningText, events, steps, usage, totalUsage] = await Promise.all([
    collectText(result.textStream),
    collectText(result.reasoningTextStream),
    collectEvents(result.eventStream),
    result.steps,
    result.usage,
    result.totalUsage,
  ])

  return {
    details: {
      eventTypes: events.map(event => event.type),
      reasoningText,
      stepCount: steps.length,
      stopReason: steps.at(-1)?.stopReason,
      text,
      totalUsage,
      usage,
    },
    name: 'messages basic stream',
    ok: text.trim() === 'BASIC_OK' && steps.length === 1,
  }
}

const runThinkingCheck = async (config: LiveConfig): Promise<CheckResult> => {
  const result = messages({
    abortSignal,
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    max_tokens: 1_024,
    messages: [{ content: 'Think briefly, then answer with exactly THINKING_OK.', role: 'user' }],
    model: config.model,
    temperature: 1,
    thinking: {
      budget_tokens: 512,
      type: 'enabled',
    },
  })

  const [text, reasoningText, events, steps, usage] = await Promise.all([
    collectText(result.textStream),
    collectText(result.reasoningTextStream),
    collectEvents(result.eventStream),
    result.steps,
    result.usage,
  ])

  return {
    details: {
      eventTypes: events.map(event => event.type),
      reasoningLength: reasoningText.length,
      reasoningPreview: reasoningText.slice(0, 200),
      stepCount: steps.length,
      text,
      usage,
    },
    name: 'messages thinking stream',
    ok: text.includes('THINKING_OK') && reasoningText.length > 0,
  }
}

const runToolLoopCheck = async (config: LiveConfig): Promise<CheckResult> => {
  const add = tool({
    description: 'Add two integers and return their sum as plain text.',
    execute: ({ a, b }) => (a + b).toString(),
    inputSchema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    name: 'add',
  })

  const result = messages({
    abortSignal,
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    max_tokens: 256,
    messages: [{ content: 'You must use the add tool with a=19 and b=23. Do not compute mentally. After using the tool, answer with exactly TOOL_OK 42.', role: 'user' }],
    model: config.model,
    temperature: 1,
    tools: [add],
  })

  const [text, events, steps, usage, totalUsage] = await Promise.all([
    collectText(result.textStream),
    collectEvents(result.eventStream),
    result.steps,
    result.usage,
    result.totalUsage,
  ])

  const eventTypes = events.map(event => event.type)
  const firstMessageStopIndex = eventTypes.indexOf('message_stop')
  const secondMessageStartIndex = eventTypes.indexOf('message_start', firstMessageStopIndex + 1)

  return {
    details: {
      eventTypes,
      firstStepFinishReason: steps[0]?.finishReason,
      stepCount: steps.length,
      terminalOrderingOk: firstMessageStopIndex !== -1 && secondMessageStartIndex > firstMessageStopIndex,
      text,
      toolResults: steps[0]?.toolResults,
      toolUses: steps[0]?.toolUses,
      totalUsage,
      usage,
    },
    name: 'messages tool loop',
    ok: text.includes('TOOL_OK 42') && steps.length >= 2 && steps[0]?.toolUses.length === 1,
  }
}

const main = async (): Promise<void> => {
  const config = getConfig()
  const checks = [
    runCountTokensCheck,
    runBasicStreamCheck,
    runThinkingCheck,
    runToolLoopCheck,
  ]
  const results: CheckResult[] = []

  console.log(`Running live checks against ${config.baseURL} with model ${config.model}`)

  for (const check of checks) {
    try {
      const result = await check(config)
      results.push(result)
      printResult(result)
    }
    catch (error) {
      const result: CheckResult = {
        details: {
          error: error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : { value: error },
        },
        name: check.name,
        ok: false,
      }
      results.push(result)
      printResult(result)
    }
  }

  const failedChecks = results.filter(result => !result.ok)

  console.log(`\nSummary: ${results.length - failedChecks.length}/${results.length} passed`)

  if (failedChecks.length > 0) {
    process.exitCode = 1
  }
}

await main()
