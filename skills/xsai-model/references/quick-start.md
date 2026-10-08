# List available models

Use Node.js with TypeScript and `tsx`.

Set `AI_BASE_URL` to a service API root that supports `GET models`.
If the service requires authentication, set `AI_API_KEY` on the server.
This task does not require a model ID.

```sh
pnpm add @xsai/model
pnpm add -D tsx typescript
```

Save this code as `example.ts`:

```ts
import { listModels, models } from '@xsai/model'

const catalog = models({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL!,
})
const entries = await listModels(catalog)
console.log(entries.map(entry => entry.id))
```

Run `pnpm exec tsx example.ts`.
The program prints the model IDs that the service exposes.
For retrieval and metadata, read the [model API reference](https://xsai.js.org/model/api).
