# xsAI

extra-small AI SDK.

<!-- automd:badges name="xsai" provider="badgen" color="cyan" license bundlephobia -->

[![npm version](https://flat.badgen.net/npm/v/xsai?color=cyan)](https://npmjs.com/package/xsai)
[![npm downloads](https://flat.badgen.net/npm/dm/xsai?color=cyan)](https://npm.chart.dev/xsai)
[![bundle size](https://flat.badgen.net/bundlephobia/minzip/xsai?color=cyan)](https://bundlephobia.com/package/xsai)
[![license](https://flat.badgen.net/github/license/moeru-ai/xsai?color=cyan)](https://github.com/moeru-ai/xsai/blob/main/LICENSE.md)

<!-- /automd -->

xsAI is a series of utils to help you use OpenAI or OpenAI-compatible API.

```ts
import { generateText } from '@xsai/generate-text'
import { env } from 'node:process'

const { text } = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
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
  model: 'gpt-4o',
})

// "YES"
console.log(text)
```

## Features

### <small><ruby>extra<rp>(</rp><rt>x</rt><rp>)</rp>-small<rp>(</rp><rt>s</rt><rp>)</rp></ruby></small>

xsAI uses a variety of methods to make itself smaller.

It's just a wrapper for [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), ESM Only, adding additional dependencies only when absolutely necessary.

How xsAI small? you can [try install it with pkg-size.dev](https://pkg-size.dev/xsai):

| Package | Installed size | Bundled size | Gzipped size |
|---|---|---|---|
| xsai@0.3.3 | 131KB | 20KB | 6.9KB |
| ai@4.3.19 | 13581KB | 242KB | 62KB |

xsAI reduces the installation size **100x** and the bundle size **12x**.

Notably, this contains dependencies introduced to support tool calls and structured output.

If you only need the basic `generateText`, `@xsai/generate-text@0.3.3` is only 21KB install size and 3.5KB bundle size (1.6KB gzipped). ([try install it with pkg-size.dev](https://pkg-size.dev/@xsai/generate-text))

### Runtime-agnostic

xsAI doesn't depend on Node.js Built-in Modules, it works well in Browsers, Deno, Bun and even the Edge Runtime.

## Usage

### Install

> You can also install only some of the utils of xsAI, such as `@xsai/generate-text` and `@xsai/stream-text`.

<!-- automd:pm-install name="xsai" auto=false -->

```sh
# npm
npm install xsai

# yarn
yarn add xsai

# pnpm
pnpm install xsai

# bun
bun install xsai

# deno
deno install xsai
```

<!-- /automd -->

### Getting Started

Read the [documentation](https://xsai.js.org/docs) to get started.

### Examples

###### Generating Text [(see above)](#xsai)

###### Streaming Text

```ts
import { streamText } from '@xsai/stream-text'
import { env } from 'node:process'

const { textStream } = streamText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    {
      content: 'You are a helpful assistant.',
      role: 'system',
    },
    {
      content: 'This is a test, so please answer \'The quick brown fox jumps over the lazy dog.\' and nothing else.',
      role: 'user',
    },
  ],
  model: 'gpt-4o',
})

const text: string[] = []

for await (const textPart of textStream) {
  text.push(textPart)
}

// "The quick brown fox jumps over the lazy dog."
console.log(text)
```

###### Generating Text w/ Tool Calling

```ts
import { generateText } from '@xsai/generate-text'
import { tool } from '@xsai/tool'
import { env } from 'node:process'
import { description, object, pipe, string } from 'valibot'

const weather = await tool({
  description: 'Get the weather in a location',
  execute: ({ location }) => JSON.stringify({
    location,
    temperature: 42,
  }),
  name: 'weather',
  parameters: object({
    location: pipe(
      string(),
      description('The location to get the weather for'),
    ),
  }),
})

const { text } = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  maxSteps: 2,
  messages: [
    {
      content: 'You are a helpful assistant.',
      role: 'system',
    },
    {
      content: 'What is the weather in San Francisco? do not answer anything else.',
      role: 'user',
    },
  ],
  model: 'gpt-4o',
  toolChoice: 'required',
  tools: [weather],
})

// "In San Francisco, it's currently 42°F."
console.log(text)
```

#### Community Projects

- [moeru-ai/airi](https://github.com/moeru-ai/airi)
- [moeru-ai/arpk](https://github.com/moeru-ai/arpk)
- [lingticio/neuri-js](https://github.com/lingticio/neuri-js)
- [GramSearch/telegram-search](https://github.com/GramSearch/telegram-search)
- [yusixian/moe-copy-ai](https://github.com/yusixian/moe-copy-ai)
- [LemonNekoGH/flow-chat](https://github.com/LemonNekoGH/flow-chat)

### Status

xsAI is currently in an early stage of development and may introduce breaking changes at any time.

## License

[MIT](LICENSE.md)

Moeru AI / xsAI is not affiliated with OpenAI.
