# @xsai/text-responses

<!-- automd:file src="/skills/xsai-text/references/responses-quick-start.md" lines="3:" -->

Set `AI_BASE_URL` to an API root that supports OpenAI Responses.
Include the API path prefix, such as `/v1/`, in this URL.
Set `AI_MODEL` to a model ID that the endpoint accepts.
If the service requires authentication, set `AI_API_KEY` to its API key.

```sh
pnpm add @xsai/text @xsai/text-responses
```

Save this code as `example.ts`:

```ts
import { generateText } from '@xsai/text'
import { responses } from '@xsai/text-responses'

const model = responses({
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

<!-- /automd -->
