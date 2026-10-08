# @xsai/audio

<!-- automd:file src="/skills/xsai-audio/references/quick-start.md" lines="3:" -->

Use Node.js with TypeScript and `tsx`.

Set `AI_BASE_URL` to the service API root, including its path prefix.
Set `AI_MODEL` to a model ID that supports the task.
If the service requires authentication, set `AI_API_KEY` on the server.

The first example requires an `audio/speech` endpoint and a speech model.
Set `AI_VOICE` to a voice that the model accepts.

```sh
pnpm add @xsai/audio
pnpm add -D tsx typescript
```

Save this code as `example.ts`:

```ts
import { writeFile } from 'node:fs/promises'

import { generateSpeech, speech } from '@xsai/audio'

const model = speech({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL!,
  model: process.env.AI_MODEL!,
})
const audio = await generateSpeech(model, {
  input: 'Welcome to the forest.',
  voice: process.env.AI_VOICE!,
})
await writeFile('speech.mp3', new Uint8Array(await audio.arrayBuffer()))
console.log(audio.type, audio.size)
```

Run `pnpm exec tsx example.ts`.
The program saves `speech.mp3` and prints its media type and size.
The speech adapter defaults to MP3 output.

## Transcribe a file

For this example, set `AI_MODEL` to a transcription model.
The service must support nonstreaming `audio/transcriptions` with a JSON result.
Supply `recording.wav` in the current directory.
Save this code as `transcribe.ts`:

```ts
import { openAsBlob } from 'node:fs'

import { generateTranscription, transcriptionsNonStreaming } from '@xsai/audio'

const model = transcriptionsNonStreaming({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL!,
  model: process.env.AI_MODEL!,
})
const result = await generateTranscription(model, {
  audio: await openAsBlob('recording.wav', { type: 'audio/wav' }),
  fileName: 'recording.wav',
})
console.log(result.text)
```

Run `pnpm exec tsx transcribe.ts`.
The program prints the transcript.
For streaming and timestamps, read the [audio API reference](https://xsai.js.org/audio/api).

<!-- /automd -->
