# @xsai/image

<!-- automd:file src="/skills/xsai-image/references/quick-start.md" lines="3:" -->

Use Node.js with TypeScript and `tsx`.

Set `AI_BASE_URL` to the service API root, including its path prefix.
Set `AI_MODEL` to a model ID that supports the task.
If the service requires authentication, set `AI_API_KEY` on the server.

The service must support base64 image data from `images/generations`.

```sh
pnpm add @xsai/image
pnpm add -D tsx typescript
```

Save this code as `example.ts`:

```ts
import { writeFile } from 'node:fs/promises'

import { generateImage, generations } from '@xsai/image'

const model = generations({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL!,
  model: process.env.AI_MODEL!,
})
const result = await generateImage(model, { input: 'A small cabin in a quiet forest.' })
const extension = result.image.type.split('/')[1]
await writeFile(`image.${extension}`, new Uint8Array(await result.image.arrayBuffer()))
console.log(result.image.type, result.image.size)
```

Run `pnpm exec tsx example.ts`.
The program saves an image and prints its media type and size in bytes.
The generated image varies between requests.
For formats and image counts, read the [image API reference](https://xsai.js.org/image/api).

<!-- /automd -->
