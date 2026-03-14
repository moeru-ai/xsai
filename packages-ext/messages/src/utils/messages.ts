import type { AnthropicContentBlock, AnthropicMessage, AnthropicMessageParam, AnthropicTextBlock, AnthropicThinkingBlock, AnthropicToolResultBlockParam, AnthropicToolUseBlock } from '../types/anthropic-message'
import type { MessagesOptions } from '../types/messages-options'
import type { Step } from '../types/step'
import type { ContentBlockDelta, ContentBlockDeltaEvent, ContentBlockStartEvent, MessageDeltaEvent, MessageStartEvent, StreamingEvent } from '../types/streaming-event'
import type { DeltaUsage, Usage } from '../types/usage'

import { clean, DelayedPromise, requestURL, responseCatch } from '@xsai/shared'
import { EventSourceParserStream } from 'eventsource-parser/stream'

import { executeTool } from './execute-tool'
import { getReasoningText, getText, getToolUses } from './extract-message-parts'
import { mapStopReason } from './map-stop-reason'
import { requestHeaders } from './request-headers'
import { StreamingEventParserStream } from './streaming-event-parser-stream'

export interface MessagesResult {
  eventStream: ReadableStream<StreamingEvent>
  reasoningTextStream: ReadableStream<string>
  steps: Promise<Step[]>
  textStream: ReadableStream<string>
  totalUsage: Promise<undefined | Usage>
  usage: Promise<undefined | Usage>
}

type ContentBlockState = AnthropicContentBlock | ToolUseBlockState

interface StepState {
  contentBlocks: Array<ContentBlockState | undefined>
  message: AnthropicMessage
  stopReason: AnthropicMessage['stop_reason']
  stopSequence: AnthropicMessage['stop_sequence']
  usage?: Usage
}

interface ToolUseBlockState extends AnthropicToolUseBlock {
  inputText: string
}

const mergeUsage = (prev: undefined | Usage, next: DeltaUsage | undefined | Usage): undefined | Usage => {
  if (next == null)
    return prev

  return {
    ...(prev?.cache_creation_input_tokens != null || next.cache_creation_input_tokens != null
      ? { cache_creation_input_tokens: next.cache_creation_input_tokens ?? prev?.cache_creation_input_tokens ?? 0 }
      : {}),
    ...(prev?.cache_read_input_tokens != null || next.cache_read_input_tokens != null
      ? { cache_read_input_tokens: next.cache_read_input_tokens ?? prev?.cache_read_input_tokens ?? 0 }
      : {}),
    input_tokens: next.input_tokens ?? prev?.input_tokens ?? 0,
    output_tokens: next.output_tokens ?? prev?.output_tokens ?? 0,
  }
}

const addUsage = (total: undefined | Usage, next: undefined | Usage): undefined | Usage => {
  if (next == null)
    return total

  return total == null
    ? next
    : {
        ...(total.cache_creation_input_tokens != null || next.cache_creation_input_tokens != null
          ? { cache_creation_input_tokens: (total.cache_creation_input_tokens ?? 0) + (next.cache_creation_input_tokens ?? 0) }
          : {}),
        ...(total.cache_read_input_tokens != null || next.cache_read_input_tokens != null
          ? { cache_read_input_tokens: (total.cache_read_input_tokens ?? 0) + (next.cache_read_input_tokens ?? 0) }
          : {}),
        input_tokens: total.input_tokens + next.input_tokens,
        output_tokens: total.output_tokens + next.output_tokens,
      }
}

const isTextBlock = (content: AnthropicContentBlock): content is AnthropicTextBlock => content.type === 'text'
const isThinkingBlock = (content: AnthropicContentBlock): content is AnthropicThinkingBlock => content.type === 'thinking'
const isToolUseBlockState = (content: ContentBlockState | undefined): content is ToolUseBlockState => content?.type === 'tool_use' && 'inputText' in content

const requireCurrentStep = (currentStep: StepState | undefined, eventType: StreamingEvent['type']): StepState => {
  if (currentStep == null)
    throw new Error(`Received ${eventType} before message_start.`)

  return currentStep
}

const createContentBlockState = (contentBlock: AnthropicContentBlock): ContentBlockState => contentBlock.type === 'tool_use'
  ? {
      ...contentBlock,
      inputText: Object.keys(contentBlock.input).length > 0 ? JSON.stringify(contentBlock.input) : '',
    }
  : contentBlock

const applyContentBlockDelta = (contentBlock: ContentBlockState, delta: ContentBlockDelta): void => {
  if (delta.type === 'text_delta') {
    if (isTextBlock(contentBlock))
      contentBlock.text += delta.text

    return
  }

  if (delta.type === 'thinking_delta') {
    if (isThinkingBlock(contentBlock))
      contentBlock.thinking += delta.thinking

    return
  }

  if (delta.type === 'signature_delta') {
    if (isThinkingBlock(contentBlock))
      contentBlock.signature = delta.signature

    return
  }

  if (delta.type === 'input_json_delta' && isToolUseBlockState(contentBlock))
    contentBlock.inputText += delta.partial_json
}

const handleContentBlockStart = (currentStep: StepState | undefined, event: ContentBlockStartEvent): void => {
  const step = requireCurrentStep(currentStep, event.type)
  step.contentBlocks[event.index] = createContentBlockState(structuredClone(event.content_block))
}

const handleContentBlockDelta = (currentStep: StepState | undefined, event: ContentBlockDeltaEvent): void => {
  const step = requireCurrentStep(currentStep, event.type)
  const contentBlock = step.contentBlocks[event.index]

  if (contentBlock == null)
    throw new Error(`Missing content block for index ${event.index}.`)

  applyContentBlockDelta(contentBlock, event.delta)
}

const handleMessageStart = (event: MessageStartEvent): StepState => ({
  contentBlocks: [],
  message: structuredClone(event.message),
  stopReason: event.message.stop_reason,
  stopSequence: event.message.stop_sequence,
  usage: mergeUsage(undefined, event.message.usage),
})

const handleMessageDelta = (currentStep: StepState | undefined, event: MessageDeltaEvent): void => {
  const step = requireCurrentStep(currentStep, event.type)
  step.stopReason = event.delta.stop_reason
  step.stopSequence = event.delta.stop_sequence
  step.usage = mergeUsage(step.usage, event.usage)
}

const parseToolUseInput = (toolUse: ToolUseBlockState): AnthropicToolUseBlock => {
  const inputText = toolUse.inputText.trim()

  try {
    return {
      id: toolUse.id,
      input: JSON.parse(inputText.length > 0 ? inputText : '{}') as Record<string, unknown>,
      name: toolUse.name,
      type: 'tool_use',
    }
  }
  catch (error) {
    throw new Error(`Failed to parse tool input as JSON for tool "${toolUse.name}". Input: ${toolUse.inputText}`, {
      cause: error,
    })
  }
}

const createAssistantMessageParam = (message: AnthropicMessage): AnthropicMessageParam => ({
  content: message.content,
  role: 'assistant',
})

const finalizeCurrentMessage = (currentStep: StepState | undefined): AnthropicMessage => {
  const step = requireCurrentStep(currentStep, 'message_stop')
  const content = step.contentBlocks
    .filter((block): block is ContentBlockState => block != null)
    .map((block): AnthropicContentBlock => isToolUseBlockState(block) ? parseToolUseInput(block) : block)

  return {
    ...step.message,
    content,
    stop_reason: step.stopReason,
    stop_sequence: step.stopSequence,
    usage: step.usage ?? step.message.usage,
  }
}

const createStep = (message: AnthropicMessage, toolResults: AnthropicToolResultBlockParam[]): Step => ({
  finishReason: mapStopReason(message.stop_reason),
  message,
  reasoningText: getReasoningText(message),
  stopReason: message.stop_reason,
  text: getText(message),
  toolResults,
  toolUses: getToolUses(message),
  usage: message.usage,
})

interface HandleMessageStopOptions {
  conversation: AnthropicMessageParam[]
  currentStep: StepState | undefined
  steps: Step[]
  tools: MessagesOptions['tools']
  totalUsage: undefined | Usage
}

interface ProcessEventResult {
  currentStep: StepState | undefined
  shouldContinue: boolean
  totalUsage: undefined | Usage
  usage: undefined | Usage
}

const handleMessageStop = async ({ conversation, currentStep, steps, tools, totalUsage }: HandleMessageStopOptions): Promise<ProcessEventResult> => {
  const message = finalizeCurrentMessage(currentStep)
  const stepUsage = message.usage
  const nextUsage = stepUsage
  const nextTotalUsage = addUsage(totalUsage, stepUsage)
  const step = createStep(message, [])

  conversation.push(createAssistantMessageParam(message))
  steps.push(step)

  const shouldContinue = message.stop_reason === 'tool_use' && step.toolUses.length > 0

  if (shouldContinue) {
    const results = await Promise.all(
      step.toolUses.map(async toolUse => executeTool({ tools, toolUse })),
    )

    for (const { toolResult } of results) {
      step.toolResults.push(toolResult)
    }

    conversation.push({
      content: step.toolResults,
      role: 'user',
    })
  }

  return {
    currentStep: undefined,
    shouldContinue,
    totalUsage: nextTotalUsage,
    usage: nextUsage,
  }
}

interface ProcessEventOptions {
  conversation: AnthropicMessageParam[]
  currentStep: StepState | undefined
  event: StreamingEvent
  steps: Step[]
  tools: MessagesOptions['tools']
  totalUsage: undefined | Usage
  usage: undefined | Usage
}

const processEvent = async ({ conversation, currentStep, event, steps, tools, totalUsage, usage }: ProcessEventOptions): Promise<ProcessEventResult> => {
  switch (event.type) {
    case 'content_block_delta': {
      handleContentBlockDelta(currentStep, event)
      return { currentStep, shouldContinue: false, totalUsage, usage }
    }
    case 'content_block_start': {
      handleContentBlockStart(currentStep, event)
      return { currentStep, shouldContinue: false, totalUsage, usage }
    }
    case 'content_block_stop':
    case 'ping': {
      return { currentStep, shouldContinue: false, totalUsage, usage }
    }
    case 'error': {
      throw new Error(`Anthropic stream error: ${event.error.message}`)
    }
    case 'message_start': {
      return {
        currentStep: handleMessageStart(event),
        shouldContinue: false,
        totalUsage,
        usage,
      }
    }
    case 'message_delta': {
      handleMessageDelta(currentStep, event)
      return { currentStep, shouldContinue: false, totalUsage, usage }
    }
    case 'message_stop': {
      return handleMessageStop({
        conversation,
        currentStep,
        steps,
        tools,
        totalUsage,
      })
    }
  }
}

export const messages = (options: MessagesOptions): MessagesResult => {
  const { abortSignal, anthropicBeta, anthropicVersion, apiKey, baseURL = 'https://api.anthropic.com/v1/', fetch, headers, tools, ...body } = options

  const conversation = structuredClone(options.messages)
  const steps: Step[] = []
  let usage: undefined | Usage
  let totalUsage: undefined | Usage

  const resultSteps = new DelayedPromise<Step[]>()
  const resultUsage = new DelayedPromise<undefined | Usage>()
  const resultTotalUsage = new DelayedPromise<undefined | Usage>()

  let currentStep: StepState | undefined

  const createReader = async () => {
    const res = await (fetch ?? globalThis.fetch)(requestURL('messages', baseURL), {
      body: JSON.stringify(clean({
        ...body,
        messages: conversation,
        stream: true,
        tools: tools?.map(({ execute, ...tool }) => tool),
      })),
      headers: requestHeaders(headers, apiKey, anthropicVersion, anthropicBeta),
      method: 'POST',
      signal: abortSignal,
    }).then(responseCatch)

    return res.body!
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new StreamingEventParserStream())
      .getReader()
  }

  let reader: ReadableStreamDefaultReader<StreamingEvent> | undefined

  const mainStream = new ReadableStream<StreamingEvent>({
    cancel: async () => {
      await reader?.cancel()
      resultSteps.resolve(steps)
      resultUsage.resolve(usage)
      resultTotalUsage.resolve(totalUsage)
    },
    pull: async (controller) => {
      if (reader == null)
        return controller.close()

      try {
        const { done, value: event } = await reader.read()

        if (done) {
          resultSteps.resolve(steps)
          resultUsage.resolve(usage)
          resultTotalUsage.resolve(totalUsage)
          return controller.close()
        }

        const result = await processEvent({
          conversation,
          currentStep,
          event,
          steps,
          tools,
          totalUsage,
          usage,
        })

        currentStep = result.currentStep
        usage = result.usage
        totalUsage = result.totalUsage

        controller.enqueue(event)

        if (result.shouldContinue) {
          reader.releaseLock()
          reader = await createReader()
        }
      }
      catch (err) {
        resultSteps.reject(err)
        resultUsage.reject(err)
        resultTotalUsage.reject(err)
        controller.error(err)
      }
    },
    start: async (controller) => {
      try {
        reader = await createReader()
      }
      catch (err) {
        resultSteps.reject(err)
        resultUsage.reject(err)
        resultTotalUsage.reject(err)
        controller.error(err)
      }
    },
  })

  const [eventStream, streamA] = mainStream.tee()
  const [streamB, streamC] = streamA.tee()

  const textStream = streamB.pipeThrough(new TransformStream<StreamingEvent, string>({
    transform: (event, controller) => {
      if (event.type !== 'content_block_delta' || event.delta.type !== 'text_delta')
        return

      controller.enqueue(event.delta.text)
    },
  }))

  const reasoningTextStream = streamC.pipeThrough(new TransformStream<StreamingEvent, string>({
    transform: (event, controller) => {
      if (event.type !== 'content_block_delta' || event.delta.type !== 'thinking_delta')
        return

      controller.enqueue(event.delta.thinking)
    },
  }))

  return {
    eventStream,
    reasoningTextStream,
    steps: resultSteps.promise,
    textStream,
    totalUsage: resultTotalUsage.promise,
    usage: resultUsage.promise,
  }
}
