# xsAI

extra-small AI SDK for Browser, Node.js, Deno, Bun or Edge Runtime.

<!-- automd:badges name="xsai" provider="badgen" color="cyan" license bundlephobia -->

[![npm version](https://flat.badgen.net/npm/v/xsai?color=cyan)](https://npmjs.com/package/xsai)
[![npm downloads](https://flat.badgen.net/npm/dm/xsai?color=cyan)](https://npm.chart.dev/xsai)
[![bundle size](https://flat.badgen.net/bundlephobia/minzip/xsai?color=cyan)](https://bundlephobia.com/package/xsai)
[![license](https://flat.badgen.net/github/license/moeru-ai/xsai?color=cyan)](https://github.com/moeru-ai/xsai/blob/main/LICENSE)

<!-- /automd -->

xsAI is a series of utils to help you use OpenAI or OpenAI-compatible API.

```ts
import { generateText } from '@xsai/generate-text'
import { createOpenAI } from '@xsai/providers'
import { env } from 'node:process'

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY
})

const { text } = await generateText({
  ...openai.chat('gpt-4o'),
  messages: [
    {
      content: 'You are a helpful assistant.',
      role: 'system',
    },
    {
      content: 'This is a test, so please answer \'YES\' and nothing else.',
      role: 'user',
    },
  ],
})

// YES
console.log(text)
```

## Features

### <small><ruby>extra<rp>(</rp><rt>x</rt><rp>)</rp>-small<rp>(</rp><rt>s</rt><rp>)</rp></ruby></small>

xsAI uses a variety of methods to make itself smaller.

It's just a wrapper for [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), introducing additional dependencies only when absolutely necessary and ESM Only.

How xsAI small? you can [try install it with pkg-size.dev](https://pkg-size.dev/xsai):

`xsai@0.0.18` is 111KB install size and 11KB bundle size (3KB gzipped).

Notably, this contains dependencies introduced to support tool calls and structured output.

At xsAI you can install only the packages you need:

If you only need the basic `generateText`, `@xsai/generate-text@0.0.18` is only 12KB install size and 1.2KB bundle size (678B gzipped). ([try install it with pkg-size.dev](https://pkg-size.dev/@xsai/generate-text))

### Runtime-agnostic

xsAI doesn't depend on Node.js Built-in Modules, it works well in Browsers, Deno, Bun and even the Edge Runtime.

## Getting Started

Read the [documentation](https://xsai.js.org/docs) to get started.

## Status

xsAI is currently in an early stage of development and may introduce breaking changes at any time.

## License

[MIT](LICENSE.md)

Moeru AI / xsAI is not affiliated with OpenAI.
