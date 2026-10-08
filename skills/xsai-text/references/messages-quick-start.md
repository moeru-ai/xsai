# Generate text with Anthropic Messages

Use a JavaScript runtime with `fetch`, `ReadableStream`, and `AbortSignal`.
The examples use Node.js with TypeScript and `tsx`.

Set `AI_BASE_URL` to an API root that supports Anthropic Messages.
Include the API path prefix, such as `/v1/`, in this URL.
Set `AI_MODEL` to a model ID that the endpoint accepts.
If the service requires authentication, set `AI_API_KEY` to its API key.
Keep the key on the server.
The Messages API requires `maxOutputTokens` for each request.

Install the packages:

```sh
pnpm add @xsai/text @xsai/text-messages
pnpm add -D tsx typescript
```

Save this code as `example.ts`:

```ts
import { generateText } from '@xsai/text'
import { messages } from '@xsai/text-messages'

const model = messages({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL!,
  model: process.env.AI_MODEL!,
})

const result = await generateText(model, {
  input: 'Say hello in one sentence.',
  maxOutputTokens: 128,
})

console.log(result.text)
```

Run `pnpm exec tsx example.ts`.
The program prints a greeting. The exact text varies between requests.
If the request fails, read [Troubleshooting](https://xsai.js.org/text/troubleshooting).
For inputs and return values, read the [text API reference](https://xsai.js.org/text/api).
