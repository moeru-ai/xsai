# Shared API reference

Import these exports from `@xsai/shared`.
The helpers supply the HTTP and error contracts used by the adapters.
Use them when you build an adapter or customize request handling.

## HTTP configuration

`HttpOptions` requires `baseURL: string | URL` and `model: string`.
Optional fields are `apiKey`, `headers`, and `fetch`.
Model catalogs and `sendRequest` use `Omit<HttpOptions, 'model'>`.

`apiKey` supplies a Bearer token for the shared request helper.
An adapter can use its own authentication headers.
`headers` is a record of strings or undefined values.
Undefined values are omitted from the request.
`fetch` has the signature `(request: Request) => Promise<Response>`.
It receives a complete Request, rather than a URL and separate configuration.

`requestURL(path, baseURL)` appends a path to the API root.
It adds a trailing slash to the root before URL resolution.
Absolute paths and absolute URLs follow the standard URL resolution rules.

## sendRequest

`sendRequest(options, httpOptions)` returns a Promise of a Response with a non-null body.
It performs one request and does not retry it.

| Request field | Contract |
| --- | --- |
| `path` | Required request path or URL. |
| `method` | `GET` or `POST`. Defaults to `POST`. |
| `body` | Optional FormData or object. Objects are serialized as JSON. |
| `headers` | Optional complete override for the shared header construction. |
| `signal` | Optional request cancellation signal. |

Without request header overrides, the helper merges `httpOptions.headers`, authentication, and the content type.
An object body uses `application/json`.
FormData removes any explicit Content-Type so the runtime can supply its multipart boundary.

A non-success status throws `HttpError` after it reads the error body.
A successful response with a null body throws `invalid-response`.
A fetch rejection throws `network-error` with the original rejection in `cause`.
If the signal is aborted, the helper throws its abort reason instead.
JSON parsing and later stream errors occur outside this helper.

## Errors

`XSAIError(code, message, options?)` extends Error with a typed `code`.
`XSAIError.isInstance(error)` narrows an unknown value.
Packages augment `XSAIErrorCauseMap` to add codes and their cause requirements.
`XSAIErrorCode`, `XSAIErrorCause`, and `XSAIErrorOptions` expose those type contracts.

| Code | Meaning |
| --- | --- |
| `http-error` | A non-success HTTP status. |
| `network-error` | Fetch rejected. A non-null cause is required. |
| `invalid-input` | The operation cannot accept the input. |
| `invalid-response` | The response violates the operation contract. An unknown cause is optional. |
| `truncated-stream` | A required terminal event is absent. |
| `model-error` | A text adapter reports a model failure. |
| `protocol-error` | A text stream violates its protocol contract. |

`HttpError({ status, body, headers })` extends `XSAIError<'http-error'>`.
Its message has the form `HTTP {status}: {body}`.
Its fields expose the response status, text body, and Headers.
Read request IDs and retry headers from `headers` when you diagnose a failure.

## SSE and utility types

`EventSourceParserStream` and `EventSourceMessage` are re-exports from `eventsource-parser/stream`.
Pipe decoded SSE text through this transform to receive parsed messages.
The parser does not translate provider events into xsAI model events.

`Promisable<T>` means a value of type T or a Promise of T.
Use it in custom model contracts that can return synchronously or asynchronously.
