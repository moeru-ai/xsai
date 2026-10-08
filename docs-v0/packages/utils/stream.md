# Create and smooth streams {#stream}

## Description

Create a stream from known chunks or change the timing of text chunks.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i @xsai/utils-stream@0.5.1
```

## Examples

### simulateReadableStream

```ts
const stream = simulateReadableStream<number>({
  chunkDelay: 100,
  chunks: [1, 2, 3],
  initialDelay: 0,
})
```

### smoothStream

```ts
const { textStream } = streamText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    {
      content: 'You are a helpful assistant.',
      role: 'system',
    },
    {
      content: 'This is a test, so please answer'
        + '\'The quick brown fox jumps over the lazy dog.\''
        + 'and nothing else.',
      role: 'user',
    },
  ],
  model: 'gpt-4o',
})

const smoothTextStream = textStream.pipeThrough(smoothStream({
  chunking: 'line',
  delay: 20,
}))
```

## Result

The simulated stream emits 1, 2, and 3. The smoothing transform emits text in lines.
