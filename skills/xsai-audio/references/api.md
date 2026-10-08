# Audio API reference

Import speech and transcription APIs from `@xsai/audio`.
A speech model returns an HTTP Response with audio bytes.
A transcription model returns a stream of transcript events.

## Speech operations

`generateSpeech(model, options)` returns `Promise<Blob>` and consumes the response body.
`streamSpeech(model, options)` returns `Promise<Response>` without collecting the body.
Read `response.body` to consume audio chunks.
A custom `SpeechModel` returns a Response directly or through a promise.

`SpeechModelOptions` requires `input: string` and `voice: string`.
Optional fields are `providerOptions` and `signal`.

`speech({ baseURL, model, apiKey?, headers?, fetch? })` sends `POST audio/speech`.
`providerOptions.speech` accepts `instructions`, `speed`, and `outputFormat`.
`outputFormat` accepts `aac`, `flac`, `mp3`, `opus`, or `wav` and defaults to `mp3`.
The endpoint determines valid voices, speed ranges, and instruction support.

If the response omits its media type or uses `application/octet-stream`, the adapter supplies the requested audio type.
A conflicting media type cancels the response body and throws `invalid-response`.
Use `signal` to abort the request. Cancel the response reader when you stop consuming audio.

## Transcription operations

`generateTranscription(model, options)` collects events and returns `Promise<TranscriptionResult>`.
It rejects with `truncated-stream` if no `transcription.end` event arrives.
`streamTranscription(model, options)` returns `Promise<ReadableStream<TranscriptionEvent>>`.
A custom `TranscriptionModel` returns the stream directly or through a promise.

| Model field | Contract |
| --- | --- |
| `audio` | Required Blob with audio bytes. |
| `fileName` | Optional file name for the multipart upload. |
| `language` | Optional language code accepted by the endpoint. |
| `providerOptions` | Optional adapter-specific configuration. |
| `signal` | Optional request cancellation signal. |

`transcriptions(httpOptions)` requests SSE from `POST audio/transcriptions`.
SSE is a stream of server-sent events.
A different response media type throws `invalid-response`.
`transcriptionsNonStreaming(httpOptions)` requests JSON from the same endpoint and adapts it into the shared event contract.
Use the nonstreaming factory when the endpoint does not support SSE.
Both factories require `baseURL` and `model`. They also accept `apiKey`, `headers`, and `fetch`.

`providerOptions.transcriptions` accepts `chunkingStrategy: 'auto'`, `prompt`, `temperature`, `responseFormat`, and `timestampGranularities`.
`responseFormat` accepts `json`, `verbose_json`, or `diarized_json` and defaults to `json`.
`timestampGranularities` accepts an array of `segment` and `word`.
With `verbose_json` and no explicit granularities, the adapter requests segments.
Other formats have no default granularities.

## Transcript events and results

| Event | Fields |
| --- | --- |
| `transcription.start` | Starts the transcript. |
| `transcription.text.delta` | `delta` and optional `segmentId`. |
| `transcription.text.segment` | A complete segment with text and timestamps. |
| `transcription.end` | The complete transcript result. |

`TranscriptionResult` requires `text` and can contain `durationInSeconds`, `language`, `segments`, and `words`.
Each segment contains `text`, `startSecond`, `endSecond`, optional `id`, and optional `providerMetadata`.
Each word contains `text`, `startSecond`, `endSecond`, and optional `providerMetadata`.

The adapter maps segment metadata under `transcriptions`.
Its fields are `avgLogprob`, `compressionRatio`, `noSpeechProb`, `seek`, `speaker`, `temperature`, and `tokens`.
Word metadata can contain `transcriptions.probability`.
The provider determines which result fields it supplies.

A streaming provider error throws `invalid-response`.
A stream without `transcript.text.done` throws `truncated-stream`.
`signal` cancels the HTTP request and stream processing.
HTTP failures throw `HttpError`. Network failures use `network-error`.
For shared errors, read the [shared reference](https://xsai.js.org/shared/api).
