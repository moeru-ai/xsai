# @xsai/model

<!-- automd:file src="/docs/snippets/model.md" -->

```sh
pnpm add @xsai/model
```

```ts
import { listModels, models } from '@xsai/model'

const catalog = models({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
})

const entries = await listModels(catalog)
console.log(entries.map(entry => entry.id))
```

<!-- /automd -->

Read the [documentation](https://xsai.js.org/model).
