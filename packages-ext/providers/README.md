# @xsai-ext/providers

Provider routes, model capabilities, and costs from [models.dev](https://models.dev), normalized for xsAI.

```sh
pnpm add @xsai-ext/providers
```

```ts
import { deepseek } from '@xsai-ext/providers/deepseek'

console.log(deepseek.models['deepseek-v4-pro'].routes.chat?.baseURL)
```

Each provider is its own subpath, so an import bundles only that provider's data.
`@xsai-ext/providers/full` exports all providers as `providers`, keyed by provider ID.

## Sync

`pnpm sync` downloads the models.dev v2 catalog and regenerates `src/providers/*.ts` and `src/full.ts`.
Pass a local catalog path to skip the download: `pnpm sync ./api.json`.

- Put corrections in `scripts/overrides.ts`, with a comment that gives the reason. Prefer fixing models.dev upstream.
- Put providers that models.dev does not list in `scripts/extra.ts`.
