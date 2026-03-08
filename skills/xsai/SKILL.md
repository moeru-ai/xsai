---
name: xsai
description: >-
  Guide for using xsAI — an extra-small AI SDK for OpenAI and OpenAI-compatible APIs.
  Use this skill whenever the user imports from 'xsai' or any '@xsai/*' package,
  mentions xsai, needs to call OpenAI-compatible APIs with minimal bundle size,
  wants generateText/streamText/generateObject/streamObject/tool calling, needs
  embeddings, speech synthesis, image generation, or transcription via OpenAI API,
  or asks about lightweight alternatives to the Vercel AI SDK (ai package). Also use
  when the user needs structured output with Standard Schema (Zod, Valibot, ArkType)
  via OpenAI-compatible endpoints.
license: MIT
metadata:
  author: moeru-ai
  version: "0.4.0"
---

# xsAI

Extra-small AI SDK — a Fetch API wrapper for OpenAI and OpenAI-compatible APIs.

142KB install size vs 5740KB for `ai` (40x smaller). Runtime-agnostic: Browser, Node.js, Deno, Bun, Edge.

## Packages

| Package | Description |
|---------|-------------|
| `xsai` | Umbrella — re-exports everything below |
| `@xsai/generate-text` | Text generation (unary) |
| `@xsai/stream-text` | Text generation (streaming) |
| `@xsai/generate-object` | Structured output (unary) |
| `@xsai/stream-object` | Structured output (streaming) |
| `@xsai/tool` | Tool/function calling helpers |
| `@xsai/embed` | Embeddings |
| `@xsai/generate-image` | Image generation |
| `@xsai/generate-speech` | Text-to-speech |
| `@xsai/generate-transcription` | Speech-to-text (unary) |
| `@xsai/stream-transcription` | Speech-to-text (streaming) |
| `@xsai/utils-chat` | Chat message utilities |
| `@xsai/utils-stream` | Stream utilities |
| `@xsai/utils-reasoning` | Reasoning/thinking utilities |
| `xsschema` | Standard Schema → JSON Schema conversion |

## Common Options

All chat functions share these base options:

```ts
{
  model: string              // required — model ID
  baseURL: string | URL      // required — API endpoint (e.g. 'https://api.openai.com/v1/')
  apiKey?: string            // API key
  messages: Message[]        // chat history
  temperature?: number       // 0-2 (default: 1)
  topP?: number              // (default: 1)
  frequencyPenalty?: number  // -2.0 to 2.0
  presencePenalty?: number   // -2.0 to 2.0
  seed?: number
  stop?: string | string[]
  tools?: Tool[]
  toolChoice?: 'auto' | 'none' | 'required'
  maxSteps?: number          // agentic loop steps (default: 1)
  abortSignal?: AbortSignal
  headers?: Record<string, string>
  fetch?: typeof fetch       // custom fetch implementation
}
```

## generateText

```ts
import { generateText } from '@xsai/generate-text'

const { text, finishReason, usage, toolCalls, toolResults, steps } = await generateText({
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' },
  ],
})
```

**Result**: `{ text, finishReason, usage, messages, steps, toolCalls, toolResults, reasoningText }`

## streamText

```ts
import { streamText } from '@xsai/stream-text'

const { textStream, fullStream, messages, usage } = streamText({
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  onStepFinish: step => console.log('step done', step),
  onFinish: step => console.log('all done'),
})

// Text-only stream
for await (const chunk of textStream) {
  process.stdout.write(chunk)
}

// Or full event stream (text-delta, tool-call, tool-result, finish, error)
for await (const event of fullStream) {
  if (event.type === 'text-delta') process.stdout.write(event.text)
}
```

**Result**: `{ textStream, fullStream, reasoningTextStream, messages (Promise), steps (Promise), usage (Promise), totalUsage (Promise) }`

## generateObject (Structured Output)

Uses Standard Schema (Zod, Valibot, ArkType, Effect, Sury) for type-safe structured output:

```ts
import { generateObject } from '@xsai/generate-object'
import { object, string, number } from 'valibot'

const { object: recipe } = await generateObject({
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Give me a cookie recipe' }],
  schema: object({ name: string(), ingredients: array(string()), cookTime: number() }),
  schemaName: 'recipe',
  schemaDescription: 'A cooking recipe',
})
```

Array mode:

```ts
const { object: recipes } = await generateObject({
  ...options,
  output: 'array',
  schema: object({ name: string() }),
})
// recipes: { name: string }[]
```

## streamObject

```ts
import { streamObject } from '@xsai/stream-object'

const { partialObjectStream, elementStream } = await streamObject({
  ...options,
  schema: mySchema,
})

// Object mode — partial objects as they build up
for await (const partial of partialObjectStream) {
  console.log(partial) // { name?: string, ... }
}

// Array mode — fully parsed elements one by one
const { elementStream } = await streamObject({ ...options, output: 'array', schema: itemSchema })
for await (const item of elementStream) {
  console.log(item)
}
```

## Tool Calling

```ts
import { tool } from '@xsai/tool'
import { description, object, pipe, string } from 'valibot'

const weather = await tool({
  name: 'weather',
  description: 'Get the weather in a location',
  parameters: object({
    location: pipe(string(), description('City name')),
  }),
  execute: ({ location }) => JSON.stringify({ location, temperature: 42 }),
})

const { text } = await generateText({
  ...options,
  tools: [weather],
  toolChoice: 'required',
  maxSteps: 3, // allow multi-turn tool use
})
```

Raw JSON Schema tools (no schema lib needed):

```ts
import { rawTool } from '@xsai/tool'

const myTool = rawTool({
  name: 'lookup',
  description: 'Look up a value',
  parameters: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] },
  execute: ({ key }) => `value for ${key}`,
})
```

**execute** receives `(input, { messages, toolCallId, abortSignal })`.

## Embeddings

```ts
import { embed, embedMany } from '@xsai/embed'

const { embedding } = await embed({
  model: 'text-embedding-3-small',
  baseURL: 'https://api.openai.com/v1/',
  apiKey: env.OPENAI_API_KEY,
  input: 'Hello world',
  dimensions: 512,
})

const { embeddings } = await embedMany({
  ...options,
  input: ['Hello', 'World'],
})
```

## Image Generation

```ts
import { generateImage } from '@xsai/generate-image'

const { image, images } = await generateImage({
  model: 'dall-e-3',
  baseURL: 'https://api.openai.com/v1/',
  apiKey: env.OPENAI_API_KEY,
  prompt: 'A cat on a skateboard',
  size: '1024x1024',
  n: 1,
})
// image.base64 — data URL
// image.mimeType — 'image/png' etc.
```

## Speech / Transcription

```ts
import { generateSpeech } from '@xsai/generate-speech'

const audioBuffer = await generateSpeech({
  model: 'tts-1',
  baseURL: 'https://api.openai.com/v1/',
  apiKey: env.OPENAI_API_KEY,
  input: 'Hello world',
  voice: 'alloy',
  responseFormat: 'mp3',
})
```

```ts
import { generateTranscription } from '@xsai/generate-transcription'

const { text } = await generateTranscription({
  model: 'whisper-1',
  baseURL: 'https://api.openai.com/v1/',
  apiKey: env.OPENAI_API_KEY,
  file: audioBlob,
})

// Streaming transcription
import { streamTranscription } from '@xsai/stream-transcription'

const { textStream } = streamTranscription({ ...options, file: audioBlob })
for await (const chunk of textStream) {
  process.stdout.write(chunk)
}
```

## Message Types

```ts
type Message =
  | { role: 'system', content: string }
  | { role: 'developer', content: string }
  | { role: 'user', content: string | ContentPart[] }
  | { role: 'assistant', content?: string, tool_calls?: ToolCall[], reasoning?: string }
  | { role: 'tool', tool_call_id: string, content: string }
```

## Key Rules

1. **`model` and `baseURL` are always required** — xsAI is provider-agnostic, no defaults
2. **Standard Schema for structured output** — Zod, Valibot, ArkType, Effect all work. Use `xsschema` for conversion
3. **`streamText` is synchronous** — it returns immediately, streams resolve lazily. `streamObject` is async (needs schema conversion)
4. **`maxSteps`** enables agentic tool-use loops — each step makes a new API call with tool results appended
5. **No Node.js deps** — pure Fetch API, works everywhere including Edge Runtime
6. **Install granularly** — `@xsai/generate-text` alone is 22.6KB; use the umbrella `xsai` package only if you need most features

## Documentation

Read the full docs at https://xsai.js.org/docs or use context7 to query `xsai` documentation.
