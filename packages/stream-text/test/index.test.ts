import { clean } from '@xsai/shared'
import { tool } from '@xsai/tool'
import { description, object, pipe, string } from 'valibot'
import { describe, expect, it } from 'vitest'

import { streamText } from '../src'

// make TS happy
// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#browser_compatibility
declare global {
  interface ReadableStream<R = any> {
    // eslint-disable-next-line ts/method-signature-style
    [Symbol.asyncIterator](): AsyncIterableIterator<R>
  }
}

describe('@xsai/stream-text', async () => {
  const add = await tool({
    description: 'Adds two numbers',
    execute: ({ a, b }) => (Number.parseInt(a) + Number.parseInt(b)).toString(),
    name: 'add',
    parameters: object({
      a: pipe(
        string(),
        description('First number'),
      ),
      b: pipe(
        string(),
        description('Second number'),
      ),
    }),
  })

  it('basic tool calls', async () => {
    const { fullStream, messages, steps, textStream, usage } = await streamText({
      baseURL: 'http://localhost:11434/v1/',
      maxSteps: 2,
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'How many times does 114514 plus 1919810 equal? Please try to call the `add` tool to solve the problem.',
          role: 'user',
        },
      ],
      model: 'qwen3:0.6b',
      seed: 114514,
      toolChoice: 'required',
      tools: [add],
    })

    const eventResult = []
    for await (const event of fullStream) {
      eventResult.push(clean({
        ...event,
        toolCallId: undefined,
      }))
    }

    let textResult = ''
    for await (const text of textStream) {
      textResult += text
    }

    expect(eventResult).toMatchSnapshot()
    expect(textResult).toMatchSnapshot()

    const cleanedMessages = (await messages)
      .map(message => clean({
        ...message,
        tool_call_id: undefined,
      }))

    expect(cleanedMessages).toMatchSnapshot()

    const cleanedSteps = (await steps)
      .map(({ toolCalls, toolResults, ...rest }) => ({
        ...rest,
        toolCalls: toolCalls.map(toolCall => clean({
          ...toolCall,
          toolCallId: undefined,
        })),
        toolResults: toolResults.map(toolResult => clean({
          ...toolResult,
          toolCallId: undefined,
        })),
      }))

    expect(cleanedSteps).toMatchSnapshot()

    expect(await usage).toMatchSnapshot()
  })
})
