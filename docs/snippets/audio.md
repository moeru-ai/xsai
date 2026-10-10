```sh
pnpm add @xsai/audio
```

```ts
import { writeFile } from 'node:fs/promises'

import { generateSpeech, speech } from '@xsai/audio'

const model = speech({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'YOUR_SPEECH_MODEL_ID',
})

const audio = await generateSpeech(model, { input: 'Welcome to the forest.', voice: 'alloy' })
await writeFile('speech.mp3', new Uint8Array(await audio.arrayBuffer()))
```
