```sh
pnpm add @xsai/text @xsai/text-chat
```

```ts
import { generateText } from '@xsai/text'
import { chat } from '@xsai/text-chat'

const model = chat({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-6-luna',
})

const { text } = await generateText(model, { input: 'Say hello.' })
console.log(text)
```
