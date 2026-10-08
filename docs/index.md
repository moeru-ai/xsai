# xsAI

Build AI applications with small packages for text, audio, images, embeddings, and model catalogs.
Start with one model request, then add the features that your application needs.

This site documents the v1 API.
For the previous API, read the [v0 archive](/v0/){target="_self"}.

## Getting Started

Follow the [quick start](./text/quick-start.md) to install xsAI and generate your first response.
It explains the runtime, endpoint, model, and credentials that you need.
Then [choose an adapter](./text/adapters.md) for your service's protocol.

Use [individual packages or the xsai package](./guide/xsai.md) for your application.
Install the [agent skills](./guide/ai.md) when an agent helps you write xsAI code.

## Guides

Use a guide to complete a task after your first request:

- [Stream text](./text/streaming.md) as the model sends it.
- [Call tools](./text/tools.md) from a model request.
- [Generate structured output](./text/structured-output.md) with a schema.
- [Use Anthropic Messages](./text/messages-quick-start.md) or [OpenAI Responses](./text/responses-quick-start.md).
- [Create speech and transcribe audio](./audio/quick-start.md).
- [Create embeddings](./embed/quick-start.md) for text.
- [Generate images](./image/quick-start.md) from prompts.
- [List models](./model/quick-start.md) from a service.
- [Convert and validate schemas](./xsschema/quick-start.md) with xsschema.

## Advanced

Use these pages when you need more control over requests and streams:

- [Cancel requests](./text/cancellation.md) with an abort signal.
- [Control tool loop steps](./text/loop-control.md) with overrides and hooks.
- [Use event listeners](./text/event-target.md) with a text stream.
- [Write a custom model](./text/custom-models.md) that follows the text event contract.
- [Handle HTTP errors](./shared/quick-start.md) from a service.
- [Troubleshoot requests](./text/troubleshooting.md) and incomplete streams.

## References

Look up inputs, outputs, defaults, and failures in the API references:

| API | Reference |
| --- | --- |
| Text operations, messages, and tools | [Text](./text/api.md) |
| Incremental events and terminal status | [Text events](./text/events.md) |
| Speech and transcription | [Audio](./audio/api.md) |
| Embedding vectors | [Embeddings](./embed/api.md) |
| Image generation | [Images](./image/api.md) |
| Model catalogs | [Models](./model/api.md) |
| HTTP configuration and errors | [Shared HTTP helpers](./shared/api.md) |
| Schema conversion and validation | [xsschema](./xsschema/api.md) |

The [LLM index](/llms.txt){target="_self"} and [full text](/llms-full.txt){target="_self"} contain this version only.
