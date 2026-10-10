# Transcribe audio {#transcription}

Send an audio file and collect its transcript.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Start a compatible service at the local address shown in the example, or replace that address with your service root.
Make sure that the service accepts the model ID and request protocol shown below.
Use Node.js with `openAsBlob` support. Supply an audio file at the example path.

```sh
npm i @xsai/generate-transcription@0.5.1
```

## Examples

### Basic

```ts
const { text } = await generateTranscription({
  apiKey: '',
  baseURL: 'http://localhost:8000/v1/',
  file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
  fileName: 'basic.wav',
  language: 'en',
  model: 'deepdml/faster-whisper-large-v3-turbo-ct2',
})
```

### Verbose + Segments

```ts
const { duration, language, segments, text } = await generateTranscription({ // [!code highlight]
  apiKey: '',
  baseURL: 'http://localhost:8000/v1/',
  file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
  fileName: 'basic.wav',
  language: 'en',
  model: 'deepdml/faster-whisper-large-v3-turbo-ct2',
  responseFormat: 'verbose_json', // [!code highlight]
})
```

### Verbose + Words

```ts
const { duration, language, text, words } = await generateTranscription({ // [!code highlight]
  apiKey: '',
  baseURL: 'http://localhost:8000/v1/',
  file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
  fileName: 'basic.wav',
  language: 'en',
  model: 'deepdml/faster-whisper-large-v3-turbo-ct2',
  responseFormat: 'verbose_json', // [!code highlight]
  timestampGranularities: 'word', // [!code highlight]
})
```

## Result

The basic result contains text. Verbose results can also contain duration, language, segments, or words.
