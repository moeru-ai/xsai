# Troubleshoot text requests

Use the error code and response status to find the failed boundary.
Do not retry a tool action unless your application can repeat it safely.

## HTTP failure

A non-success response throws `HttpError` with `status`, `body`, and `headers`.
Make sure that `baseURL` includes the correct API prefix.
Make sure that the endpoint accepts the selected adapter and model ID.
For authentication errors, replace or supply the server API key.
For rate limits, follow the service retry policy and its `retry-after` header.
The library does not retry the request automatically.

## Network failure

`network-error` means that `fetch` rejected before an HTTP response arrived.
Read `error.cause` for the underlying failure.
Make sure that the runtime can reach the host and trust its TLS certificate.
Retry only after the network condition changes or your retry policy permits another attempt.
An aborted request uses its abort reason instead of `network-error`.

## Incomplete or failed output

An `incomplete` result contains the output that arrived before the provider stopped.
Inspect `reason` and the output token limit.
Increase the limit only if the endpoint supports it and your application permits the added cost.

A `failed` terminal event carries an error.
`generateText` and the `streamText` result promise reject with that error.
Handle the result promise even when you also read the stream.

## Missing or repeated terminal events

`truncated-stream` means that a required terminal event did not arrive.
Inspect the provider connection and captured raw events.
Make sure that a custom model emits exactly one `step.end` for each request.

`protocol-error` can mean that one request emitted several terminal events.
A loop can contain several steps, each with its own terminal event.
Fix the custom model or adapter at the request boundary.
Do not remove valid terminal events from separate loop steps.
