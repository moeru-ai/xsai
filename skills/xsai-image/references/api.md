# Image API reference

Import these exports from `@xsai/image`.
An `ImageModel` maps a text prompt to an array of image Blobs.
A Blob stores bytes and their media type.

## Operation and model

`generateImage(model, options)` returns `Promise<ImageModelResult & { image: Blob }>`.
`image` is the first entry in `images`.
An empty image array throws `XSAIError` with code `invalid-response`.

| Model field | Contract |
| --- | --- |
| `input` | Required prompt string. |
| `n` | Optional image count. The endpoint supplies its default and limits. |
| `size` | Optional string in the form `${number}x${number}`. The endpoint determines accepted dimensions. |
| `providerOptions` | Optional adapter-specific configuration. |
| `signal` | Optional request cancellation signal. |

A custom model returns `{ images: Blob[], providerMetadata? }` directly or through a promise.
There is no shared image size or count default.

## Generations adapter

`generations({ baseURL, model, apiKey?, headers?, fetch? })` sends `POST images/generations`.
`baseURL` and `model` are required.
The response must contain base64 data in `data[].b64_json`.
The adapter does not fetch image URLs returned by a provider.

`providerOptions.generations` accepts these fields:

| Field | Values |
| --- | --- |
| `background` | `auto`, `opaque`, or `transparent`. |
| `outputCompression` | A number that the provider accepts. |
| `outputFormat` | `jpeg`, `png`, or `webp`. |
| `quality` | `auto`, `high`, `low`, `max`, `medium`, or `xhigh`. |

The adapter detects PNG, JPEG, GIF, WebP, and AVIF bytes.
An unrecognized format throws `invalid-response`.
When the service supplies revised prompts, the result exposes them in `providerMetadata.generations.images`.
The array follows the response image order.

`signal` cancels the request.
HTTP failures throw `HttpError`. Network failures use `network-error`.
Invalid base64, malformed JSON, or malformed response data can reject the operation.
For shared HTTP configuration, read the [shared reference](https://xsai.js.org/shared/api).
