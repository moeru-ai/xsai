<div align="center">

<img src="https://github.com/moeru-ai.png" width="96" height="96" alt="Moeru AI logo">

# xsAI

**AI SDK, extra small.**

One shape for every model. Web standards, nothing else.

<!-- automd:badges name="xsai" provider="badgen" color="gray" license bundlephobia packagephobia -->

[![npm version](https://flat.badgen.net/npm/v/xsai?color=gray)](https://npmjs.com/package/xsai)
[![npm downloads](https://flat.badgen.net/npm/dm/xsai?color=gray)](https://npm.chart.dev/xsai)
[![bundle size](https://flat.badgen.net/bundlephobia/minzip/xsai?color=gray)](https://bundlephobia.com/package/xsai)
[![install size](https://flat.badgen.net/packagephobia/install/xsai?color=gray)](https://packagephobia.com/result?p=xsai)
[![license](https://flat.badgen.net/github/license/moeru-ai/xsai?color=gray)](https://github.com/moeru-ai/xsai/blob/main/LICENSE)

<!-- /automd -->

[Documentation](https://xsai.js.org) | [Getting started](https://xsai.js.org/getting-started) | [Choose packages](https://xsai.js.org/packages)

</div>

## Quick start

<!-- automd:file src="/docs/snippets/xsai.md" -->

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

<!-- /automd -->

Streaming uses the same model. Each event is a typed `TextEvent` in a standard `ReadableStream`:

```ts
import { streamText } from 'xsai'

const { result, stream } = streamText(model, { input: 'Describe a quiet forest.' })

for await (const event of stream) {
  if (event.type === 'text.delta')
    process.stdout.write(event.delta)
}

await result
```

## Why xsAI

- **Small parts.** Each package does one job. Every package is an ES module with no side effects, so your bundler removes the code that you do not use.
- **A model belongs to a protocol, not to a provider.** One adapter covers every service that speaks the same protocol. Change the service, keep your code.
- **Web standards.** `fetch`, `ReadableStream`, `AbortSignal`, and `FormData`. The source imports no Node.js module. Replace `fetch` to add a proxy, a test double, or your own retries.
- **Typed from end to end.** Options, results, events, and tool inputs have TypeScript types. Schemas follow [Standard Schema](https://standardschema.dev), so you can keep the validation library that you already use.

## One adapter per protocol

xsAI does not ship a package for each provider. It ships an adapter for each protocol, and many services and gateways speak at least one of them.

| Protocol | Package | Factory |
| --- | --- | --- |
| OpenAI Responses | `@xsai/text-responses` | `responses()` |
| Chat Completions | `@xsai/text-chat` | `chat()` |
| Anthropic Messages | `@xsai/text-messages` | `messages()` |

Every factory returns a `LanguageModel`, so `generateText`, `streamText`, and tool calls work the same with all three. If your service speaks another protocol, you can [write a custom model](https://xsai.js.org/advanced/custom-models).

## Packages

Install `xsai` for everything, or only the packages that you use.

| Package | Provides |
| --- | --- |
| [`@xsai/text`](https://xsai.js.org/text/generating) | `generateText`, `streamText`, `loop`, `collect`, and `tool` |
| [`@xsai/audio`](https://xsai.js.org/audio) | Speech generation and transcription |
| [`@xsai/decide`](https://xsai.js.org/decide) | Typed answers to yes-or-no, choice, and score questions |
| [`@xsai/embed`](https://xsai.js.org/embed) | Text embeddings |
| [`@xsai/image`](https://xsai.js.org/image) | Image generation |
| [`@xsai/model`](https://xsai.js.org/model) | Model lists from a service |
| [`@xsai/shared`](https://xsai.js.org/shared) | HTTP options, `sendRequest`, and error types |
| [`xsschema`](https://xsai.js.org/xsschema) | Schema conversion and validation, as a separate package |
| `xsai` | One package that re-exports everything above except `xsschema` |

## Runs anywhere

xsAI runs on any runtime with `fetch` and web streams: Node.js, Deno, Bun, Cloudflare Workers, and browsers.

## Community projects

xsAI is used in community and in-house projects, including:

- [moeru-ai/airi](https://github.com/moeru-ai/airi)
- [moeru-ai/arpk](https://github.com/moeru-ai/arpk)
- [lingticio/neuri-js](https://github.com/lingticio/neuri-js)
- [GramSearch/telegram-search](https://github.com/GramSearch/telegram-search)
- [yusixian/moe-copy-ai](https://github.com/yusixian/moe-copy-ai)
- [LemonNekoGH/flow-chat](https://github.com/LemonNekoGH/flow-chat)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). To edit or build the docs, see [documentation maintenance](docs/CONTRIBUTING.md).

## License

[MIT](LICENSE.md)

## Sponsors

![sponsors](https://github.com/kwaa/sponsors/blob/main/public/sponsors.svg?raw=true)
