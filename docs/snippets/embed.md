```sh
pnpm add @xsai/embed
```

```ts
import { embed, embeddings } from '@xsai/embed'

const model = embeddings({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'YOUR_EMBEDDING_MODEL_ID',
})

const { embedding } = await embed(model, { input: 'A quiet forest.' })
console.log(embedding.length)
```
