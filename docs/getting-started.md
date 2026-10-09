# Getting started

xsAI is a set of small TypeScript packages for AI services.
Each package does one job: text, audio, decisions, images, embeddings, or model lists.
You create a model once, then pass it to an operation such as `generateText`.

The packages run on any runtime that provides `fetch` and web streams.
The example below reads an OpenAI API key from `OPENAI_API_KEY`.
It works with any service that implements the OpenAI Responses API.

## Generate text

<!-- @include: ./snippets/text-responses.md -->

`responses()` creates a language model that speaks the Responses protocol.
`generateText` sends one request, waits for the complete reply, and returns a result.
Every xsAI operation has the same shape: the model comes first, and the request options come second.

## Use another service

A model belongs to a protocol, not to a provider.
To call a service that supports Chat Completions or Anthropic Messages, replace `responses()` with `chat()` or `messages()`.
[Choose an adapter](/text/adapters) lists the options for each one.

## Next steps

- [Stream text](/text/streaming) to show output while it arrives.
- [Call tools](/text/tools) to let the model run your functions.
- [Choose packages](/packages) to install only what you use.
