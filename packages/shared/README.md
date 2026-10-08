# @xsai/shared

<!-- automd:file src="/docs/shared/quick-start.md" lines="3:" -->

This example replaces `fetch` with a local response. It needs no service or API key.

```sh
pnpm add @xsai/shared
```

Save this code as `example.ts`:

```ts
import { HttpError, sendRequest } from '@xsai/shared'

try {
  await sendRequest({ method: 'GET', path: 'models' }, {
    baseURL: 'https://example.com/v1/',
    fetch: async () => new Response('Try again later', { status: 429 }),
  })
}
catch (error) {
  if (HttpError.isInstance(error))
    console.log(error.status, error.body)
  else
    throw error
}
```

Run `node example.ts`.
The program prints `429 Try again later`.
For request configuration and error codes, read the [shared API reference](https://xsai.js.org/shared/api).

<!-- /automd -->
