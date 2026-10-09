# Shared

`@xsai/shared` holds the HTTP options, request helper, and error types that every xsAI package uses.
Adapters send requests through `sendRequest`, so every package fails in the same way.
A non-success status throws `HttpError` with `status`, `body`, and `headers`.
A rejected `fetch` throws an `XSAIError` with the code `network-error`, and the original error is in `cause`.

## Handle an HTTP error

<!-- @include: ./snippets/shared.md -->

This example replaces `fetch` with a local response, so it needs no service.
It prints `429 Try again later`.

Use `HttpError.isInstance(error)` and `XSAIError.isInstance(error)` to narrow an unknown error.
xsAI does not retry requests.
For a rate limit, read `retry-after` from `error.headers` and wait before you call again.
Read request IDs from `error.headers` too, because your service support team needs them to trace a failure.

## Reference

Import these exports from `@xsai/shared`.
The adapters use them, and you need them when you write an adapter or customize requests.

### HTTP options

`HttpOptions` requires `baseURL: string | URL` and `model: string`.
It has the optional fields `apiKey`, `headers`, and `fetch`.
Model catalogs and `sendRequest` use `Omit<HttpOptions, 'model'>`.

`apiKey` becomes a bearer token in `sendRequest`, and an adapter can use another header instead.
`headers` is a record of strings, and undefined values are left out.
`fetch` has the type `(request: Request) => Promise<Response>`.
It receives a complete `Request`.

`requestURL(path, baseURL)` adds a trailing slash to the root and then resolves the path.
Absolute paths and absolute URLs follow the normal URL rules.

### sendRequest

`sendRequest(options, httpOptions)` makes one request and returns a `Response` with a body.
It does not retry.

| Field | Description |
| --- | --- |
| `path` | Required. A path or URL. |
| `method` | `GET` or `POST`. Defaults to `POST`. |
| `body` | `FormData` or an object. Objects are sent as JSON. |
| `headers` | Replaces all headers that the helper builds. |
| `signal` | An `AbortSignal`. |

Without `headers`, the helper merges `httpOptions.headers`, the authentication header, and the content type.
For `FormData`, it removes `Content-Type` so the runtime can add the multipart boundary.

| Condition | Result |
| --- | --- |
| Non-success status | Throws `HttpError` after it reads the body. |
| Success with no body | Throws `invalid-response`. |
| `fetch` rejects | Throws `network-error`, with the original error in `cause`. |
| Signal aborted | Throws the abort reason. |

JSON parsing and later stream errors happen outside this helper.

### Errors

`XSAIError(code, message, options?)` extends `Error` with a typed `code`.
`XSAIError.isInstance(error)` narrows an unknown value.
Packages add their own codes by extending `XSAIErrorCauseMap`.

| Code | Meaning |
| --- | --- |
| `http-error` | A non-success HTTP status. |
| `network-error` | `fetch` rejected. A cause is required. |
| `invalid-input` | The operation cannot accept the input. |
| `invalid-response` | The response breaks the contract of the operation. |
| `truncated-stream` | A required terminal event is missing. |
| `decision-refusal` | A decision model refused a question. `@xsai/decide` adds this code. |
| `model-error` | A text adapter reports a model failure. |
| `protocol-error` | A text stream breaks its protocol. |

`HttpError({ status, body, headers })` extends `XSAIError<'http-error'>`.
Its message is `HTTP {status}: {body}`, and its fields hold the status, the text body, and the `Headers`.

### SSE and utility types

`EventSourceParserStream` and `EventSourceMessage` are re-exported from `eventsource-parser/stream`.
Pipe decoded SSE text through the stream to get parsed messages.
It does not translate provider events into xsAI events.

`Promisable<T>` is `T | Promise<T>`.
Custom models use it for functions that return synchronously or asynchronously.
