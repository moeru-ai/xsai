# Generating Text

[![npm version](https://flat.badgen.net/npm/v/@xsai/generate-text?color=cyan)](https://npmjs.com/package/@xsai/generate-text)
[![npm downloads](https://flat.badgen.net/npm/dm/@xsai/generate-text?color=cyan)](https://npm.chart.dev/@xsai/generate-text)
[![bundle size](https://flat.badgen.net/bundlephobia/minzip/@xsai/generate-text?color=cyan)](https://bundlephobia.com/package/@xsai/generate-text)
[![license](https://flat.badgen.net/github/license/moeru-ai/xsai?color=cyan)](https://github.com/moeru-ai/xsai/blob/main/LICENSE)

## generateText

You can generate text using the `generateText` function.

It does not support streaming, so it is suitable for non-interactive use cases.

```ts
import { generateText } from '@xsai/generate-text'

const { text } = await generateText({
  messages: [
    {
      content: 'You\'re a helpful assistant.',
      role: 'system'
    },
    {
      content: 'Why is the sky blue?',
      role: 'user'
    }
  ],
  model: 'llama3.2',
})
```
