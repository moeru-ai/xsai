# xsAI

<!-- automd:badges name="xsai" provider="badgen" color="gray" license bundlephobia packagephobia -->

[![npm version](https://flat.badgen.net/npm/v/xsai?color=gray)](https://npmjs.com/package/xsai)
[![npm downloads](https://flat.badgen.net/npm/dm/xsai?color=gray)](https://npm.chart.dev/xsai)
[![bundle size](https://flat.badgen.net/bundlephobia/minzip/xsai?color=gray)](https://bundlephobia.com/package/xsai)
[![install size](https://flat.badgen.net/packagephobia/install/xsai?color=gray)](https://packagephobia.com/result?p=xsai)
[![license](https://flat.badgen.net/github/license/moeru-ai/xsai?color=gray)](https://github.com/moeru-ai/xsai/blob/main/LICENSE)

<!-- /automd -->

extra-small AI SDK.

<!-- automd:file src="/skills/xsai-text/references/umbrella-quick-start.md" lines="3:" -->

The `xsai` package exports the public text, audio, image, embedding, model, and shared APIs.
Use it when you want one dependency for several tasks.
Use individual `@xsai/*` packages when you want explicit dependencies.
Install `xsschema` separately for schema utilities.

Set `AI_BASE_URL` to a Chat Completions API root, including its API path prefix.
Set `AI_MODEL` to an available model ID.
If the service requires authentication, set `AI_API_KEY`.

```sh
pnpm add xsai
```

Save this code as `example.ts`:

```ts
import { chat, generateText } from 'xsai'

const model = chat({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL!,
  model: process.env.AI_MODEL!,
})

const result = await generateText(model, { input: 'Say hello in one sentence.' })
console.log(result.text)
```

Run `node example.ts`.
The program prints a greeting.
For package-specific tasks, open the [documentation](https://xsai.js.org/).

<!-- /automd -->

See [documentation maintenance](docs/CONTRIBUTING.md) to edit or build the docs.

## Community Projects

xsAI is used in community and in-house projects including:

- [moeru-ai/airi](https://github.com/moeru-ai/airi)
- [moeru-ai/arpk](https://github.com/moeru-ai/arpk)
- [lingticio/neuri-js](https://github.com/lingticio/neuri-js)
- [GramSearch/telegram-search](https://github.com/GramSearch/telegram-search)
- [yusixian/moe-copy-ai](https://github.com/yusixian/moe-copy-ai)
- [LemonNekoGH/flow-chat](https://github.com/LemonNekoGH/flow-chat)

## License

[MIT](LICENSE.md)

## Sponsors

![sponsors](https://github.com/kwaa/sponsors/blob/main/public/sponsors.svg?raw=true)
