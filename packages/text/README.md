# @xsai/text

<!-- automd:file src="/docs/snippets/text-responses.md" -->

```sh
pnpm add @xsai/text @xsai/text-responses
```

```ts
import { generateText } from '@xsai/text'
import { responses } from '@xsai/text-responses'

const model = responses({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-6-luna',
})

const { text } = await generateText(model, { input: 'Say hello.' })
console.log(text)
```

<!-- /automd -->

Read the [documentation](https://xsai.js.org/getting-started).
