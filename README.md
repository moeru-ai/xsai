# xsAI

Extra-small AI SDK for any OpenAI-compatible API.

<!-- automd:badges name="xsai" provider="badgen" color="cyan" license bundlephobia -->

[![npm version](https://flat.badgen.net/npm/v/xsai?color=cyan)](https://npmjs.com/package/xsai)
[![npm downloads](https://flat.badgen.net/npm/dm/xsai?color=cyan)](https://npm.chart.dev/xsai)
[![bundle size](https://flat.badgen.net/bundlephobia/minzip/xsai?color=cyan)](https://bundlephobia.com/package/xsai)
[![license](https://flat.badgen.net/github/license/moeru-ai/xsai?color=cyan)](https://github.com/moeru-ai/xsai/blob/main/LICENSE)

<!-- /automd -->

## Why?

I'm working on a tiny local-LLM translator - [ARPK](https://github.com/moeru-ai/arpk), which is currently (v0.2.4) 449KB, of which 26% is `ollama-js` (the other 13% is the pointless `whatwg-fetch` that comes with `ollama-js`!)

I wanted to make every byte count, so I started writing a lightweight library - xsAI.

It provides an interface similar to the Vercel AI SDK, ESM-only and zero dependencies for minimal installation size.

### Why OpenAI-compatible API?

As mentioned above, I made this library mainly to make it easy to call native LLMs, which all provide more or less OpenAI-compatible APIs.

### How xsAI small?

You can [try install it with pkg-size.dev](https://pkg-size.dev/xsai):

`xsai@0.0.12` is 97KB install size and 8.9KB bundle size (2.3KB gzipped).

Notably, this contains dependencies introduced to support tool calls and structured output.

At xsai you can install only the packages you need.

If you only need the basic `generateText`, `@xsai/generate-text@0.0.12` is only 12KB install size and 1.1KB bundle size (606B gzipped). ([try install it with pkg-size.dev](https://pkg-size.dev/@xsai/generate-text))

## Getting Started

Read the [documentation](https://xsai.js.org/docs) to get started.

## License

[MIT](LICENSE.md)
