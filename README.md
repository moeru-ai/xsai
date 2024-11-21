# xsAI

Extra-small AI SDK for any OpenAI-compatible API.

<!-- automd:badges color="lime" license bundlephobia -->

[![npm version](https://img.shields.io/npm/v/xsai?color=lime)](https://npmjs.com/package/xsai)
[![npm downloads](https://img.shields.io/npm/dm/xsai?color=lime)](https://npm.chart.dev/xsai)
[![bundle size](https://img.shields.io/bundlephobia/minzip/xsai?color=lime)](https://bundlephobia.com/package/xsai)
[![license](https://img.shields.io/github/license/moeru-ai/xsai?color=lime)](https://github.com/moeru-ai/xsai/blob/main/LICENSE)

<!-- /automd -->

## Why?

I'm working on a tiny local-LLM translator - [ARPK](https://github.com/moeru-ai/arpk), which is currently (v0.2.4) 449KB, of which 26% is `ollama-js` (the other 13% is the pointless `whatwg-fetch` that comes with `ollama-js`!)

I wanted to make every byte count, so I started writing a lightweight library - xsAI.

It provides an interface similar to the Vercel AI SDK, ESM-only and zero dependencies for minimal installation size.

## Install

<!-- automd:pm-install auto=false -->

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

## License

[MIT](LICENSE.md)
