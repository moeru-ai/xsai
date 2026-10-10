# Audio

`@xsai/audio` generates speech from text and transcribes recordings.
It needs a service with `audio/speech` for speech, and `audio/transcriptions` for transcription.

## Generate speech

<!-- @include: ./snippets/audio.md -->

`speech()` creates a speech model, and `generateSpeech` returns the audio as a `Blob`.
The adapter requests MP3 unless you set `providerOptions.speech.outputFormat` to `aac`, `flac`, `opus`, or `wav`.
Use `streamSpeech` to get the `Response` before its body is read, so you can pipe the audio as it arrives.

## Transcribe audio

```ts
import { openAsBlob } from 'node:fs'

import { generateTranscription, transcriptionsNonStreaming } from '@xsai/audio'

const model = transcriptionsNonStreaming({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'YOUR_TRANSCRIPTION_MODEL_ID',
})

const { text } = await generateTranscription(model, {
  audio: await openAsBlob('recording.wav'),
  fileName: 'recording.wav',
})
```

Two factories cover the endpoint.
`transcriptions()` asks for server-sent events (SSE) and emits transcript events as they arrive.
`transcriptionsNonStreaming()` asks for one JSON reply and adapts it to the same events.
Use the second one when the service does not support SSE.

`streamTranscription(model, options)` returns the events as a stream.

## Reference

### Speech

`generateSpeech(model, options)` returns `Promise<Blob>`.
`streamSpeech(model, options)` returns `Promise<Response>`.
Both take `SpeechModelOptions`.

| Option | Description |
| --- | --- |
| `input` | Required. The text to speak. |
| `voice` | Required. A voice ID that the model accepts. |
| `providerOptions.speech` | `instructions`, `speed`, and `outputFormat`. `outputFormat` defaults to `mp3`. |
| `signal` | An `AbortSignal`. |

The endpoint decides which voices, speeds, and instructions are valid.
If the response has no media type or `application/octet-stream`, the adapter fills in the type of the requested format.
A different media type cancels the body and throws `invalid-response`.

### Transcription

`generateTranscription(model, options)` collects events and returns `Promise<TranscriptionResult>`.
It rejects with `truncated-stream` if no `transcription.end` event arrives.

| Option | Description |
| --- | --- |
| `audio` | Required. A `Blob` with the audio bytes. |
| `fileName` | The file name for the multipart upload. |
| `language` | A language code that the endpoint accepts. |
| `providerOptions.transcriptions` | `chunkingStrategy: 'auto'`, `prompt`, `temperature`, `responseFormat`, and `timestampGranularities`. |
| `signal` | An `AbortSignal`. |

`responseFormat` is `json`, `verbose_json`, or `diarized_json`, and defaults to `json`.
`timestampGranularities` is an array of `segment` and `word`.
With `verbose_json` and no granularities, the adapter requests segments.

| Event | Fields |
| --- | --- |
| `transcription.start` | None. |
| `transcription.text.delta` | `delta`, and optional `segmentId`. |
| `transcription.text.segment` | A complete segment with text and timestamps. |
| `transcription.end` | The complete `TranscriptionResult`. |

`TranscriptionResult` has `text`, and it can also have `durationInSeconds`, `language`, `segments`, and `words`.
A segment has `text`, `startSecond`, `endSecond`, and optional `id` and `providerMetadata`.
A word has `text`, `startSecond`, `endSecond`, and optional `providerMetadata`.
The service decides which fields it fills.
The adapter stores extra segment data under `providerMetadata.transcriptions`: `avgLogprob`, `compressionRatio`, `noSpeechProb`, `seek`, `speaker`, `temperature`, and `tokens`.
Words can carry `probability`.

### Errors

A provider error inside an SSE stream throws `invalid-response`.
A stream that ends without `transcript.text.done` throws `truncated-stream`.
HTTP failures throw `HttpError`, and network failures throw `network-error`.
See [shared](/shared).
