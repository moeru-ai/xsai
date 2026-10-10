# Stream a transcript {#transcription}

Read transcript text as the provider sends it.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.
Use Node.js with `openAsBlob` support. Supply an audio file at the example path.

```sh
npm i @xsai/stream-transcription@0.5.1
```

## Examples

Make sure that the provider supports `"stream": true` before you use this package.

### Basic

```ts
const { textStream } = streamTranscription({
  apiKey: '',
  baseURL: 'https://api.openai.com/v1/',
  file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
  fileName: 'basic.wav',
  language: 'en',
  model: 'gpt-4o-transcribe',
})
```

## Result

Consume textStream to receive transcript fragments.
