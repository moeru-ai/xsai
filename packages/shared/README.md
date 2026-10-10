# @xsai/shared

<!-- automd:file src="/docs/snippets/shared.md" -->

```sh
pnpm add @xsai/shared
```

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

<!-- /automd -->

Read the [documentation](https://xsai.js.org/shared).
