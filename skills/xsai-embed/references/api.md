# Embedding API reference

Import these exports from `@xsai/embed`.
An `EmbeddingModel` maps input text to numeric vectors.
Use `embeddings(httpOptions)` for a compatible HTTP service.

## Operations

`embed(model, { input, providerOptions?, signal? })` accepts one string.
It returns `Promise<{ embedding: number[], usage? }>`.
It throws `XSAIError('invalid-response', ...)` if the model returns no embeddings.

`embedMany(model, { input, providerOptions?, signal? })` accepts a string array.
It returns `Promise<EmbeddingModelResult>` with `embeddings: number[][]` and optional `usage`.
It passes the input to the model in one call. It does not split batches or retry them.

`EmbeddingModelOptions.input` accepts a string or a string array.
A custom `EmbeddingModel` returns its result directly or through a promise.
Optional usage contains `inputTokens` and `totalTokens`.
Omitted usage means that the provider did not supply it.

## HTTP adapter

`embeddings({ baseURL, model, apiKey?, headers?, fetch? })` sends `POST embeddings`.
`baseURL` and `model` are required.
It sends the input as `input` and the selected ID as `model`.
It sorts response entries by their `index` before it returns the vectors.

`providerOptions.embeddings.dimensions` requests an output dimension count.
There is no shared dimension default. The endpoint determines support and limits.
`signal` cancels the request.
HTTP failures throw `HttpError`. Network failures use `network-error`.
Malformed JSON or response data can reject the operation.

For shared HTTP configuration and errors, read the [shared reference](https://xsai.js.org/shared/api).
