# Call tools

A tool is a function that the model can ask your code to run.
`tool()` pairs a function with an input schema, and `generateText` runs the loop for you: it calls the model, runs the requested tools, sends the results back, and repeats.

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { generateText, maxSteps, tool } from '@xsai/text'

import * as z from 'zod'

const weather = tool({
  description: 'Get the current temperature for a city.',
  execute: ({ city }) => `It is 21 degrees in ${city}.`,
  inputSchema: z.object({ city: z.string() }),
  name: 'get_weather',
})

const result = await generateText(model, {
  input: 'Is it warm in Lisbon?',
  stopWhen: maxSteps(5),
  tools: [weather],
})

console.log(result.text)
console.log(result.steps.length)
```

`inputSchema` accepts a plain JSON Schema or a schema library that supports Standard JSON Schema, such as Zod 4.
With a library, `execute` receives validated and typed input.
A plain JSON Schema describes the input to the model but does not validate it.
To use a library without native support, convert its schema with [xsschema](/xsschema).

## Loop behavior

The loop stops when the model replies without a tool call, or when `stopWhen` matches.
The default is `maxSteps(10)`.
`hasToolCall(name?)` stops after a matching call, and `and`, `or`, and `not` combine conditions.

Tool calls from one step run at the same time.
A missing tool, invalid JSON arguments, failed validation, or a thrown error becomes a tool result with `isError: true`, and the loop continues, so the model can retry or explain.
If the step stopped because of `length`, the calls are incomplete, so the loop sends error results instead of running them.
An abort still rejects the whole operation.

A tool without `execute` only describes itself to the model.
If the model calls it, the loop sends an error result, unless a `preToolCall` hook returns a result for that call.

## Control the loop

`generateText`, `streamText`, and `loop` accept three hooks that run around each step.
Use them to change the request between steps, to guard tools, or to rewrite their results.

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { generateText, hasToolCall, maxSteps, or } from '@xsai/text'

await generateText(model, {
  input: 'Look up the order and cancel it.',
  prepareStep: ({ stepNumber }) => stepNumber >= 3 ? { toolChoice: 'none' } : undefined,
  preToolCall: (call) => {
    if (call.name === 'cancel_order')
      return { callId: call.callId, isError: true, output: 'Cancellation needs approval.', type: 'tool-result' }
  },
  stopWhen: or(maxSteps(5), hasToolCall('cancel_order')),
})
```

`prepareStep` runs before each request.
It receives `stepNumber`, `steps`, the current `input`, and `signal`.
Return request fields to override for that step, such as `toolChoice` or `input`, or return a different `model`.

`preToolCall(call, { signal })` runs before a tool.
Return a replacement call to change the input, a tool result to skip execution, or nothing to continue.

`postToolCall(result, { signal })` runs after a tool.
Return a replacement result, or nothing to keep the original.
It does not run when `preToolCall` returns a result, or when the tool is missing, not executable, or given invalid input.

Both tool hooks must keep the original `callId`.
A different ID throws an error.
