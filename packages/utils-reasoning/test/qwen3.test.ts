import { generateText } from '@xsai/generate-text'
import { streamText } from '@xsai/stream-text'
import { describe, expect, it } from 'vitest'

import { extractReasoning, extractReasoningStream } from '../src'

describe('extractReasoning', () => {
  it('should extract reasoning with default option', () => {
    const text = '<think>reasoning</think> text.'
    const result = extractReasoning(text)
    expect(result).toEqual({
      reasoning: 'reasoning',
      text: ' text.',
    })
  })

  it('should extract reasoning from text', () => {
    const text = '<think>reasoning</think> text.'
    const result = extractReasoning(text, { tagName: 'think' })
    expect(result).toEqual({
      reasoning: 'reasoning',
      text: ' text.',
    })
  })

  it('should return the original text if no reasoning is found', () => {
    const text = 'This is a test text.'
    const result = extractReasoning(text, { tagName: 'think' })
    expect(result).toEqual({
      reasoning: undefined,
      text: 'This is a test text.',
    })
  })

  it('should handle empty strings', () => {
    const text = ''
    const result = extractReasoning(text, { tagName: 'think' })
    expect(result).toEqual({
      reasoning: undefined,
      text: '',
    })
  })

  it('should handle reasoning only', () => {
    const text = '<think>reasoning</think>'
    const result = extractReasoning(text, { tagName: 'think' })
    expect(result).toEqual({
      reasoning: 'reasoning',
      text: '',
    })
  })

  it('should handle multiple reasoning blocks', () => {
    const text = '<think>reasoning1</think> text1 <think>reasoning2</think> text2'
    const result = extractReasoning(text, { tagName: 'think' })
    expect(result).toEqual({
      reasoning: 'reasoning1\nreasoning2',
      text: ' text1 \n text2',
    })
  })

  it('should handle startWithReasoning option', () => {
    const text = 'reasoning</think> This is a test.'
    const result = extractReasoning(text, { startWithReasoning: true, tagName: 'think' })
    expect(result).toEqual({
      reasoning: 'reasoning',
      text: ' This is a test.',
    })
  })

  it('should pass real qwen3 test', async () => {
    const { text } = await generateText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'YES\' and nothing else.',
          role: 'user',
        },
      ],
      model: 'qwen3:0.6b',
    })

    const {
      reasoning,
      text: textResult,
    } = extractReasoning(text!, { tagName: 'think' })

    expect(reasoning).not.toEqual(undefined)
    expect(textResult.length).to.greaterThan(0)
  })
})

const randomSplitTextToStream = (text: string): ReadableStream<string> => new ReadableStream<string>({
  start: (controller) => {
    let index = 0
    while (index < text.length) {
      // eslint-disable-next-line sonarjs/pseudo-random
      const chunk = text.slice(index, index + Math.random() * 5 + 1)
      controller.enqueue(chunk)
      index += chunk.length
    }
    controller.close()
  },
})

describe('extractReasoningStream', () => {
  it('should extract reasoning with default options', async () => {
    const text = '<think>reasoning</think> text.'
    const stream = randomSplitTextToStream(text)

    const {
      reasoningStream,
      textStream,
    } = extractReasoningStream(stream)

    let reasoningResult = ''
    for await (const chunk of reasoningStream) {
      reasoningResult += chunk
    }

    let textResult = ''
    for await (const chunk of textStream) {
      textResult += chunk
    }

    expect(reasoningResult).toEqual('reasoning')
    expect(textResult).toEqual(' text.')
  })

  it('should extract reasoning from a stream', async () => {
    const text = '<think>reasoning</think> text.'
    const stream = randomSplitTextToStream(text)

    const {
      reasoningStream,
      textStream,
    } = extractReasoningStream(stream, { tagName: 'think' })

    let reasoningResult = ''
    for await (const chunk of reasoningStream) {
      reasoningResult += chunk
    }

    let textResult = ''
    for await (const chunk of textStream) {
      textResult += chunk
    }

    expect(reasoningResult).toEqual('reasoning')
    expect(textResult).toEqual(' text.')
  })

  it('should return the original text if no reasoning is found', async () => {
    const text = 'This is a test text.'
    const stream = randomSplitTextToStream(text)

    const {
      reasoningStream,
      textStream,
    } = extractReasoningStream(stream, { tagName: 'think' })

    let reasoningResult = ''
    for await (const chunk of reasoningStream) {
      reasoningResult += chunk
    }

    let textResult = ''
    for await (const chunk of textStream) {
      textResult += chunk
    }

    expect(reasoningResult).toEqual('')
    expect(textResult).toEqual('This is a test text.')
  })

  it('should handle empty strings', async () => {
    const text = ''
    const stream = randomSplitTextToStream(text)

    const {
      reasoningStream,
      textStream,
    } = extractReasoningStream(stream, { tagName: 'think' })

    let reasoningResult = ''
    for await (const chunk of reasoningStream) {
      reasoningResult += chunk
    }

    let textResult = ''
    for await (const chunk of textStream) {
      textResult += chunk
    }

    expect(reasoningResult).toEqual('')
    expect(textResult).toEqual('')
  })

  it('should handle reasoning only', async () => {
    const text = '<think>reasoning</think>'
    const stream = randomSplitTextToStream(text)

    const {
      reasoningStream,
      textStream,
    } = extractReasoningStream(stream, { tagName: 'think' })

    let reasoningResult = ''
    for await (const chunk of reasoningStream) {
      reasoningResult += chunk
    }

    let textResult = ''
    for await (const chunk of textStream) {
      textResult += chunk
    }

    expect(reasoningResult).toEqual('reasoning')
    expect(textResult).toEqual('')
  })

  it('should handle multiple reasoning tags', async () => {
    const text = '<think>reasoning1</think>text1<think>reasoning2</think>text2'
    const stream = randomSplitTextToStream(text)

    const {
      reasoningStream,
      textStream,
    } = extractReasoningStream(stream, { tagName: 'think' })

    let reasoningResult = ''
    for await (const chunk of reasoningStream) {
      reasoningResult += chunk
    }

    let textResult = ''
    for await (const chunk of textStream) {
      textResult += chunk
    }

    expect(reasoningResult).toEqual('reasoning1\nreasoning2')
    expect(textResult).toEqual('text1\ntext2')
  })

  it('should handle startWithReasoning option', async () => {
    const text = 'reasoning</think> This is a test.'
    const stream = randomSplitTextToStream(text)

    const {
      reasoningStream,
      textStream,
    } = extractReasoningStream(stream, { startWithReasoning: true, tagName: 'think' })

    let reasoningResult = ''
    for await (const chunk of reasoningStream) {
      reasoningResult += chunk
    }

    let textResult = ''
    for await (const chunk of textStream) {
      textResult += chunk
    }

    expect(reasoningResult).toEqual('reasoning')
    expect(textResult).toEqual(' This is a test.')
  })

  it('real qwen3 test', async () => {
    const { textStream } = await streamText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'YES\' and nothing else.',
          role: 'user',
        },
      ],
      model: 'qwen3:0.6b',
    })

    const {
      reasoningStream,
      textStream: textStreamResult,
    } = extractReasoningStream(textStream, { tagName: 'think' })

    let reasoningResult = ''
    for await (const chunk of reasoningStream) {
      reasoningResult += chunk
    }

    let textResult = ''
    for await (const chunk of textStreamResult) {
      textResult += chunk
    }

    expect(reasoningResult.length).to.greaterThan(0)
    expect(textResult.length).to.greaterThan(0)
  })
})
