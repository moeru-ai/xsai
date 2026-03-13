export const createEventStreamResponse = (events: unknown[]): Response => {
  const encoder = new TextEncoder()

  return new Response(new ReadableStream<Uint8Array>({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }

      controller.close()
    },
  }), {
    headers: {
      'Content-Type': 'text/event-stream',
    },
    status: 200,
  })
}
