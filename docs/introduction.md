# Introduction

xsAI is an extra-small TypeScript toolkit for building AI applications and agents.
It is a set of small packages, and each package does one job.
You install only the packages that you use.

The packages run on any runtime that provides `fetch` and web streams.
This includes Node.js, Deno, Bun, Cloudflare Workers, and browsers.

## Why use xsAI?

AI services speak a few different HTTP protocols, and each protocol has its own request and response shapes.
Code that calls one service directly is hard to move to another.

xsAI hides these differences behind one shape.
You create a model, then pass it to an operation:

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { generateText } from '@xsai/text'

const { text } = await generateText(model, { input: 'Say hello.' })
```

- **The model comes first.** Every operation takes a model first and the request options second.
- **A model belongs to a protocol, not to a provider.** One adapter covers every service that speaks the same protocol, so you can change service without changing your code.
- **Web standards.** xsAI uses `fetch`, `Request`, `Response`, `ReadableStream`, `Blob`, `FormData`, and `AbortSignal`, and its source does not import any Node.js module. Streams are `ReadableStream`s, you cancel a request with an `AbortSignal`, and you can replace `fetch` to add a proxy, a test double, or your own retry logic. Schemas follow [Standard Schema](https://standardschema.dev), so you can use the validation library that you already have.
- **Small parts.** Each package does one job, and the packages work with each other without extra setup. Every package is an ES module that is free of side effects, so a bundler removes the code that you do not use.
- **Typed from end to end.** Options, results, events, and tool inputs have TypeScript types.

## What is in xsAI?

| You want to | Use | Read |
| --- | --- | --- |
| Generate or stream text, call tools, and get structured output | `@xsai/text` | [Generate text](/text/generating) |
| Talk to OpenAI Responses, Chat Completions, or Anthropic Messages | `@xsai/text-responses`, `@xsai/text-chat`, `@xsai/text-messages` | [Choose an adapter](/text/adapters) |
| Generate speech or transcribe audio | `@xsai/audio` | [Audio](/audio) |
| Get typed answers to yes-or-no, choice, and score questions | `@xsai/decide` | [Decisions](/decide) |
| Embed text | `@xsai/embed` | [Embeddings](/embed) |
| Generate images | `@xsai/image` | [Images](/image) |
| List the models of a service | `@xsai/model` | [Models](/model) |
| Convert and validate schemas | `xsschema` | [xsschema](/xsschema) |

[Choose packages](/packages) describes every package, including `xsai`, the single package that re-exports the others.

## Model providers

xsAI does not ship one package for each provider.
It ships one adapter for each protocol.
A service works with xsAI when it implements one of these protocols:

- **OpenAI Responses**, with `responses()`.
- **Chat Completions**, with `chat()`.
- **Anthropic Messages**, with `messages()`.

Many services and gateways accept at least one of them.
If yours speaks another protocol, you can [write a custom model](/advanced/custom-models).

## Where to go next

- [Getting started](/getting-started) installs a package and sends your first request.
- [Choose packages](/packages) lists every package and what it provides.
- [Working with AI](/ai) explains the agent skills and `llms.txt` that help AI tools write xsAI code.

## Community

Ask questions and report bugs in the [GitHub repository](https://github.com/moeru-ai/xsai).
