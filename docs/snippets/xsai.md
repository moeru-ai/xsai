```sh
pnpm add xsai
```

```ts
import { generateText, responses } from 'xsai'

const model = responses({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-6-luna',
})

const { text } = await generateText(model, { input: 'Say hello.' })
console.log(text)
```
