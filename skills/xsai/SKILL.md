---
name: xsai
description: Guide for using xsAI — an extra-small AI SDK for OpenAI and OpenAI-compatible APIs. Use this skill whenever the user imports from 'xsai' or any '@xsai/*' package, mentions xsai, needs to call OpenAI-compatible APIs with minimal bundle size, wants generateText/streamText/generateObject/streamObject/tool calling, needs embeddings, speech synthesis, image generation, or transcription via OpenAI API, or asks about lightweight alternatives to the Vercel AI SDK (ai package). Also use when the user needs structured output with Standard Schema (Zod, Valibot, ArkType) via OpenAI-compatible endpoints.
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
interface BaseOptions {
  abortSignal?: AbortSignal
  apiKey?: string // API key
  baseURL: string | URL // required — API endpoint (e.g. 'https://api.openai.com/v1/')
  fetch?: typeof fetch // custom fetch implementation
  frequencyPenalty?: number // -2.0 to 2.0
  headers?: Record<string, string>
  maxSteps?: number // agentic loop steps (default: 1)
  messages: Message[] // chat history
  model: string // required — model ID
  presencePenalty?: number // -2.0 to 2.0
  seed?: number
  stop?: string | string[]
  temperature?: number // 0-2 (default: 1)
  toolChoice?: 'auto' | 'none' | 'required'
  tools?: Tool[]
  topP?: number // (default: 1)
}
```

## generateText

```ts
import { generateText } from '@xsai/generate-text'

const { finishReason, steps, text, toolCalls, toolResults, usage } = await generateText({
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    { content: 'You are a helpful assistant.', role: 'system' },
    { content: 'Hello!', role: 'user' },
  ],
  model: 'gpt-4o',
})
```

**Result**: `{ text, finishReason, usage, messages, steps, toolCalls, toolResults, reasoningText }`

## streamText

```ts
import { streamText } from '@xsai/stream-text'

const { fullStream, messages, textStream, usage } = streamText({
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  messages: [{ content: 'Tell me a story', role: 'user' }],
  model: 'gpt-4o',
  onFinish: step => console.log('all done'),
  onStepFinish: step => console.log('step done', step),
})

// Text-only stream
for await (const chunk of textStream) {
  process.stdout.write(chunk)
}

// Or full event stream (text-delta, tool-call, tool-result, finish, error)
for await (const event of fullStream) {
  if (event.type === 'text-delta')
    process.stdout.write(event.text)
}
```

**Result**: `{ textStream, fullStream, reasoningTextStream, messages (Promise), steps (Promise), usage (Promise), totalUsage (Promise) }`

## generateObject (Structured Output)

Uses Standard Schema (Zod, Valibot, ArkType, Effect, Sury) for type-safe structured output:

```ts
import { generateObject } from '@xsai/generate-object'
import { array, number, object, string } from 'valibot'

const { object: recipe } = await generateObject({
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  messages: [{ content: 'Give me a cookie recipe', role: 'user' }],
  model: 'gpt-4o',
  schema: object({ cookTime: number(), ingredients: array(string()), name: string() }),
  schemaDescription: 'A cooking recipe',
  schemaName: 'recipe',
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

const { partialObjectStream } = await streamObject({
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
  description: 'Get the weather in a location',
  execute: ({ location }) => JSON.stringify({ location, temperature: 42 }),
  name: 'weather',
  parameters: object({
    location: pipe(string(), description('City name')),
  }),
})

const { text } = await generateText({
  ...options,
  maxSteps: 3, // allow multi-turn tool use
  toolChoice: 'required',
  tools: [weather],
})
```

Raw JSON Schema tools (no schema lib needed):

```ts
import { rawTool } from '@xsai/tool'

const myTool = rawTool({
  description: 'Look up a value',
  execute: ({ key }) => `value for ${key}`,
  name: 'lookup',
  parameters: { properties: { key: { type: 'string' } }, required: ['key'], type: 'object' },
})
```

**execute** receives `(input, { messages, toolCallId, abortSignal })`.

## Embeddings

```ts
import { embed, embedMany } from '@xsai/embed'

const { embedding } = await embed({
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  dimensions: 512,
  input: 'Hello world',
  model: 'text-embedding-3-small',
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
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'dall-e-3',
  n: 1,
  prompt: 'A cat on a skateboard',
  size: '1024x1024',
})
// image.base64 — data URL
// image.mimeType — 'image/png' etc.
```

## Speech / Transcription

```ts
import { generateSpeech } from '@xsai/generate-speech'

const audioBuffer = await generateSpeech({
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  input: 'Hello world',
  model: 'tts-1',
  responseFormat: 'mp3',
  voice: 'alloy',
})
```

```ts
import { generateTranscription } from '@xsai/generate-transcription'

// Streaming transcription
import { streamTranscription } from '@xsai/stream-transcription'

const { text } = await generateTranscription({
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  file: audioBlob,
  model: 'whisper-1',
})

const { textStream } = streamTranscription({ ...options, file: audioBlob })
for await (const chunk of textStream) {
  process.stdout.write(chunk)
}
```

## Message Types

```ts
type Message
  = | { content: ContentPart[] | string, role: 'user' }
    | { content: string, role: 'developer' }
    | { content: string, role: 'system' }
    | { content: string, role: 'tool', tool_call_id: string }
    | { content?: string, reasoning?: string, role: 'assistant', tool_calls?: ToolCall[] }
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
