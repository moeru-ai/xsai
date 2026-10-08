# xsai

<!-- automd:file src="/skills/xsai-text/references/umbrella-quick-start.md" lines="3:" -->

The `xsai` package exports the public text, audio, image, embedding, model, and shared APIs.
Use it when you want one dependency for several tasks.
Use individual `@xsai/*` packages when you want explicit dependencies.
Install `xsschema` separately for schema utilities.

Use Node.js with TypeScript and `tsx` for this example.
Set `AI_BASE_URL` to a Chat Completions API root, including its API path prefix.
Set `AI_MODEL` to an available model ID.
If the service requires authentication, set `AI_API_KEY` on the server.

```sh
pnpm add xsai
pnpm add -D tsx typescript
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

Run `pnpm exec tsx example.ts`.
The program prints a greeting. The exact wording varies.
For package-specific tasks, open the [documentation](https://xsai.js.org/).

<!-- /automd -->
