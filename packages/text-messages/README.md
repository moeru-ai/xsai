# @xsai/text-messages

<!-- automd:file src="/docs/snippets/text-messages.md" -->

```sh
pnpm add @xsai/text @xsai/text-messages
```

```ts
import { generateText } from '@xsai/text'
import { messages } from '@xsai/text-messages'

const model = messages({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.anthropic.com/v1/',
  model: 'claude-haiku-5.5',
})

const { text } = await generateText(model, {
  input: 'Say hello.',
  maxOutputTokens: 128,
})
console.log(text)
```

<!-- /automd -->

Read the [documentation](https://xsai.js.org/text/adapters).
