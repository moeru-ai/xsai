# Extract tagged reasoning {#reasoning}

## Description

Extract XML-tagged reasoning from text or a text stream.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Start a compatible service at the local address shown in the example, or replace that address with your service root.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i @xsai/utils-reasoning@0.5.1
```

This package is deprecated.

## Examples

### extractReasoning

Extract XML-tagged reasoning from a string.

```ts
const { text: rawText } = await generateText({
  baseURL: 'http://localhost:11434/v1/',
  messages: [
    {
      content: 'You\'re a helpful assistant.',
      role: 'system'
    },
    {
      content: 'Why is the sky blue?',
      role: 'user'
    },
  ],
  model: 'qwen3',
})

const { reasoning, text } = extractReasoning(rawText!) // [!code ++]
```

### extractReasoningStream

Extract XML-tagged reasoning from a text stream.

```ts
const { textStream: rawTextStream } = streamText({
  baseURL: 'http://localhost:11434/v1/',
  messages: [
    {
      content: 'You\'re a helpful assistant.',
      role: 'system'
    },
    {
      content: 'Why is the sky blue?',
      role: 'user'
    },
  ],
  model: 'qwen3',
})

const { reasoningStream, textStream } = extractReasoningStream(rawTextStream) // [!code ++]
```

## Result

The functions separate tagged reasoning from the remaining text. This package is deprecated.
