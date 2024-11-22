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

## Install

```sh
# without pre-compile
npm i xsai
# pre-compile
npm i -D xsai
```

## License

[MIT](LICENSE.md)
