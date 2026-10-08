# @xsai/embed

<!-- automd:file src="/skills/xsai-embed/references/quick-start.md" lines="3:" -->

An embedding is a numeric vector that represents text.
Use Node.js with TypeScript and `tsx`.

Set `AI_BASE_URL` to the service API root, including its path prefix.
Set `AI_MODEL` to a model ID that supports the task.
If the service requires authentication, set `AI_API_KEY` on the server.

The service must support the `embeddings` endpoint.

```sh
pnpm add @xsai/embed
pnpm add -D tsx typescript
```

Save this code as `example.ts`:

```ts
import { embed, embeddings } from '@xsai/embed'

const model = embeddings({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL!,
  model: process.env.AI_MODEL!,
})
const result = await embed(model, { input: 'A quiet forest.' })
console.log(result.embedding)
```

Run `pnpm exec tsx example.ts`.
The program prints an array of numbers. The model determines its length and values.
For batches and usage, read the [embedding API reference](https://xsai.js.org/embed/api).

<!-- /automd -->
