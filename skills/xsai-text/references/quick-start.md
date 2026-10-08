# Generate text with Chat Completions

Set `AI_BASE_URL` to an API root that supports Chat Completions.
Include the API path prefix, such as `/v1/`, in this URL.
Set `AI_MODEL` to a model ID that the endpoint accepts.
If the service requires authentication, set `AI_API_KEY` to its API key.

```sh
pnpm add @xsai/text @xsai/text-chat
```

Save this code as `example.ts`:

```ts
import { generateText } from '@xsai/text'
import { chat } from '@xsai/text-chat'

const model = chat({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL!,
  model: process.env.AI_MODEL!,
})

const result = await generateText(model, {
  input: 'Say hello in one sentence.',
})

console.log(result.text)
```

Run `node example.ts`.
The program prints a greeting.
If the request fails, read [Troubleshooting](https://xsai.js.org/text/troubleshooting).
For inputs and return values, read the [text API reference](https://xsai.js.org/text/api).
