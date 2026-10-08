# xsAI

<!-- automd:badges name="xsai" provider="badgen" color="gray" license bundlephobia packagephobia -->

[![npm version](https://flat.badgen.net/npm/v/xsai?color=gray)](https://npmjs.com/package/xsai)
[![npm downloads](https://flat.badgen.net/npm/dm/xsai?color=gray)](https://npm.chart.dev/xsai)
[![bundle size](https://flat.badgen.net/bundlephobia/minzip/xsai?color=gray)](https://bundlephobia.com/package/xsai)
[![install size](https://flat.badgen.net/packagephobia/install/xsai?color=gray)](https://packagephobia.com/result?p=xsai)
[![license](https://flat.badgen.net/github/license/moeru-ai/xsai?color=gray)](https://github.com/moeru-ai/xsai/blob/main/LICENSE)

<!-- /automd -->

extra-small AI SDK.

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

Read the [documentation](https://xsai.js.org/getting-started). See [documentation maintenance](docs/CONTRIBUTING.md) to edit or build the docs.

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
