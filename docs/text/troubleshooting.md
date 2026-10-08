# Troubleshoot text requests

Find the failed step from the error, then use the matching section.
Do not retry a request that runs tools unless your tools are safe to run twice.

## HTTP error

A `HttpError` means that the service answered with a failure status.
Read `error.status` and `error.body`.

- `404`: `baseURL` is missing its prefix, such as `/v1/`, or the endpoint does not speak the protocol of the adapter. Compare [the adapters](/text/adapters).
- `401` or `403`: the API key is missing or wrong.
- `429`: wait for the time in the `retry-after` header.
- `400`: the service rejected a field. Remove `providerOptions` and optional fields, then add them back one by one.

## Network error

`network-error` means that `fetch` failed before any response arrived.
Read `error.cause`.
Typical causes are DNS, a blocked host, or a TLS certificate that the runtime does not trust.
An aborted request rejects with its abort reason instead.

## Incomplete or failed output

An `incomplete` result still holds the text that arrived.
Read `reason`.
If it is `length`, raise `maxOutputTokens` when the service allows it.

A `failed` step carries an `error`.
`generateText` and the `result` of `streamText` reject with it.
When you read a stream, also await `result`, because the stream itself ends without throwing.

## Truncated stream

`truncated-stream` means that the response ended without `step.end`.
The connection probably dropped.
Set `includeRawEvents: true` to see the last provider events.
If you wrote a custom model, make sure that it emits exactly one `step.end` for each request.

## Protocol error

`protocol-error` means that one request produced several terminal events.
A loop with tools legitimately produces several `step.end` events, one for each step.
The error points to a custom model or adapter that emits twice in a single request.
