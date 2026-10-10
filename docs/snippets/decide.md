```sh
pnpm add @xsai/decide
```

```ts
import { decide, decisions } from '@xsai/decide'

const model = decisions({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-6-luna',
})

const { answers } = await decide(model, {
  input: 'The package arrived with a broken screen.',
  questions: {
    damaged: { instructions: 'Does the customer report a damaged item?', type: 'boolean' },
  },
})
console.log(answers.damaged.probability)
```
