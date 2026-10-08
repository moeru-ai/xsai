# Choose packages

Install only the packages that you use.
Every package takes a model as its first argument, so you can mix them freely.

| Package | Provides |
| --- | --- |
| `@xsai/text` | `generateText`, `streamText`, `loop`, `collect`, and `tool`. |
| `@xsai/text-responses` | `responses()`, an adapter for OpenAI Responses. |
| `@xsai/text-chat` | `chat()`, an adapter for Chat Completions. |
| `@xsai/text-messages` | `messages()`, an adapter for Anthropic Messages. |
| `@xsai/audio` | Speech generation and transcription. |
| `@xsai/embed` | Text embeddings. |
| `@xsai/image` | Image generation. |
| `@xsai/model` | Model lists from a service. |
| `@xsai/shared` | HTTP options, `sendRequest`, and error types. The other packages depend on it. |
| `xsschema` | Schema conversion and validation. It is a separate package. |
| `xsai` | One package that re-exports everything above except `xsschema`. |

## One dependency

Use `xsai` when you prefer a single import path.
It exports the same functions as the individual packages.

<!-- @include: ./snippets/xsai.md -->
