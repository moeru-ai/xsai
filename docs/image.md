# Images

`@xsai/image` generates images from a prompt.
It needs a service with an `images/generations` endpoint that returns base64 data.

<!-- @include: ./snippets/image.md -->

`generateImage` returns `{ image, images }`.
`image` is a `Blob` with the first picture, and its `type` is the detected media type, for example `image/png`.
The adapter reads PNG, JPEG, GIF, WebP, and AVIF.

## Reference

| Option | Description |
| --- | --- |
| `input` | Required. The prompt. |
| `n` | The number of images. The endpoint decides the default and the limit. |
| `size` | A string like `1024x1024`. The endpoint decides which sizes it accepts. |
| `providerOptions.generations` | `background`, `outputCompression`, `outputFormat`, and `quality`. |
| `signal` | An `AbortSignal`. |

| `providerOptions.generations` field | Values |
| --- | --- |
| `background` | `auto`, `opaque`, or `transparent`. |
| `outputCompression` | A number that the provider accepts. |
| `outputFormat` | `jpeg`, `png`, or `webp`. |
| `quality` | `auto`, `high`, `low`, `max`, `medium`, or `xhigh`. |

`generations({ baseURL, model, apiKey?, headers?, fetch? })` sends `POST images/generations`.
The adapter does not download image URLs from a response.
If the service returns revised prompts, they are in `providerMetadata.generations.images`, in the order of the images.

An empty image list, invalid base64, or an unknown image format throws `invalid-response`.
HTTP failures throw `HttpError`, and network failures throw `network-error`.
