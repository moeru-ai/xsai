import type { EventSourceMessage } from '../src'

import { JSONParseError, RemoteAPIError } from '@xsai/shared'
import { describe, expect, it } from 'vitest'

import {
  closeControllers,
  createControlledStream,
  errorControllers,
  JsonMessageTransformStream,
  parseJsonSSEMessage,
} from '../src'

const createMessage = (data: string): EventSourceMessage => ({
  data,
  event: 'message',
  id: '',
})

describe('@xsai/shared-stream', () => {
  it('skips empty payloads and done markers', () => {
    expect(parseJsonSSEMessage(createMessage(''))).toBeUndefined()
    expect(parseJsonSSEMessage(createMessage('[DONE]'))).toBeUndefined()
  })

  it('throws remote api errors', () => {
    expect(() => parseJsonSSEMessage(createMessage('{"error":{"message":"denied"}}'))).toThrow(RemoteAPIError)
  })

  it('throws json parse errors', () => {
    expect(() => parseJsonSSEMessage(createMessage('{"value":'))).toThrow(JSONParseError)
  })

  it('transforms valid json messages', async () => {
    const stream = new ReadableStream<EventSourceMessage>({
      start: (controller) => {
        controller.enqueue(createMessage('{"value":1}'))
        controller.enqueue(createMessage('[DONE]'))
        controller.close()
      },
    })

    const chunks: number[] = []

    await stream
      .pipeThrough(new JsonMessageTransformStream<{ value: number }>())
      .pipeTo(new WritableStream({
        write: (chunk) => {
          chunks.push(chunk.value)
        },
      }))

    expect(chunks).toEqual([1])
  })

  it('propagates parse errors through the transform stream', async () => {
    const stream = new ReadableStream<EventSourceMessage>({
      start: (controller) => {
        controller.enqueue(createMessage('{"value":'))
        controller.close()
      },
    })

    await expect(stream
      .pipeThrough(new JsonMessageTransformStream<{ value: number }>())
      .pipeTo(new WritableStream({
        write: () => {},
      }))).rejects.toBeInstanceOf(JSONParseError)
  })

  it('propagates remote api errors through the transform stream', async () => {
    const stream = new ReadableStream<EventSourceMessage>({
      start: (controller) => {
        controller.enqueue(createMessage('{"error":{"message":"denied"}}'))
        controller.close()
      },
    })

    await expect(stream
      .pipeThrough(new JsonMessageTransformStream<{ value: number }>())
      .pipeTo(new WritableStream({
        write: () => {},
      }))).rejects.toBeInstanceOf(RemoteAPIError)
  })

  it('closes and errors controllers', async () => {
    const first = createControlledStream<string>()
    const second = createControlledStream<string>()
    const firstReader = first.stream.getReader()
    const secondReader = second.stream.getReader()

    first.controller.current?.enqueue('first')
    closeControllers(first.controller, second.controller)

    await expect(firstReader.read()).resolves.toMatchObject({ done: false, value: 'first' })
    await expect(firstReader.read()).resolves.toMatchObject({ done: true })
    await expect(secondReader.read()).resolves.toMatchObject({ done: true })

    const third = createControlledStream<string>()
    const fourth = createControlledStream<string>()
    const thirdReader = third.stream.getReader()
    const fourthReader = fourth.stream.getReader()
    const error = new Error('boom')

    errorControllers(error, third.controller, fourth.controller)

    await expect(thirdReader.read()).rejects.toThrow('boom')
    await expect(fourthReader.read()).rejects.toThrow('boom')
  })
})
