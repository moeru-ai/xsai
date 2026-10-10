# @xsai/image

<!-- automd:file src="/docs/snippets/image.md" -->

```sh
pnpm add @xsai/image
```

```ts
import { writeFile } from 'node:fs/promises'

import { generateImage, generations } from '@xsai/image'

const model = generations({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'YOUR_IMAGE_MODEL_ID',
})

const { image } = await generateImage(model, { input: 'A small cabin in a quiet forest.' })
await writeFile('cabin.png', new Uint8Array(await image.arrayBuffer()))
```

<!-- /automd -->

Read the [documentation](https://xsai.js.org/image).
