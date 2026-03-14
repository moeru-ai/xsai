import type { EventSourceMessage } from 'eventsource-parser/stream'

import { describe, expect, it } from 'vitest'

import { StreamingEventParserStream } from '../src/utils/streaming-event-parser-stream'

const collect = async (stream: ReadableStream<EventSourceMessage>) => {
  const events: unknown[] = []

  for await (const event of stream.pipeThrough(new StreamingEventParserStream())) {
    events.push(event)
  }

  return events
}

const createEventSourceMessageStream = (messages: EventSourceMessage[]): ReadableStream<EventSourceMessage> => new ReadableStream<EventSourceMessage>({
  start: (controller) => {
    for (const message of messages) {
      controller.enqueue(message)
    }

    controller.close()
  },
})

describe('@xsai-ext/messages StreamingEventParserStream', async () => {
  it('ignores [DONE] sentinels', async () => {
    const stream = createEventSourceMessageStream([
      { data: '{"type":"ping"}', event: '', id: undefined },
      { data: '[DONE]', event: '', id: undefined },
    ])

    await expect(collect(stream)).resolves.toEqual([{ type: 'ping' }])
  })
})
