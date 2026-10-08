# Embeddings

`@xsai/embed` turns text into vectors.
It needs a service with an `embeddings` endpoint.

<!-- @include: ./snippets/embed.md -->

`embed` takes one string and returns `{ embedding, usage? }`.
`embedMany` takes an array of strings and returns `{ embeddings, usage? }`, with one vector for each input in the same order.

```ts
import type { EmbeddingModel } from '@xsai/embed'

declare const model: EmbeddingModel
// ---cut---
import { embedMany } from '@xsai/embed'

const { embeddings } = await embedMany(model, {
  input: ['A quiet forest.', 'A busy city.'],
})
```

`embedMany` sends all inputs in one request.
It does not split large batches or retry, so batch the input yourself when the service limits it.

## Reference

| Option | Description |
| --- | --- |
| `input` | A string for `embed`, or a string array for `embedMany`. |
| `providerOptions.embeddings.dimensions` | The number of output dimensions. The endpoint decides the support and the limits. |
| `signal` | An `AbortSignal`. |

`embeddings({ baseURL, model, apiKey?, headers?, fetch? })` sends `POST embeddings`.
The adapter sorts response entries by `index` before it returns the vectors.
`usage` has `inputTokens` and `totalTokens`, and it is absent when the service reports none.
`embed` throws `invalid-response` if the model returns no embeddings.
HTTP failures throw `HttpError`, and network failures throw `network-error`.
