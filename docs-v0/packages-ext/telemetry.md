# Record telemetry {#telemetry}

Use the v0 telemetry extension to record text operation data.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i @xsai-ext/telemetry@0.5.1
```

## Usage

> `@xsai-ext/telemetry` exports the core APIs from `xsai`.
>
> In v0, telemetry supports `generateText` and `streamText`.

Replace the import as shown below.

```diff
- import { generateText, streamText } from 'xsai'
+ import { generateText, streamText } from '@xsai-ext/telemetry'
```

Pass telemetry configuration to add attributes:

```ts
const instructions = 'You\'re a helpful assistant.' // [!code highlight]

const { text } = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    {
      content: instructions, // [!code highlight]
      role: 'system'
    },
    {
      content: 'Why is the sky blue?',
      role: 'user'
    }
  ],
  model: 'gpt-4o',
  telemetry: { // [!code highlight]
    attributes: { // [!code highlight]
      'gen_ai.agent.description': instructions, // [!code highlight]
      'gen_ai.agent.name': 'weather-assistant', // [!code highlight]
    }, // [!code highlight]
  }, // [!code highlight]
})
```

xsAI Telemetry is based on [GenAI Attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/).

## Result

The extension records OpenTelemetry GenAI attributes for supported text operations.
