# Call a local tool

Use the model from the [text quick start](https://xsai.js.org/text/quick-start).
The endpoint and model must support the feature that you request.

A tool lets the model request an action by name.
This example declares a tool that returns the current UTC time:

```ts
import { generateText, maxSteps, tool } from '@xsai/text'

const clock = tool({
  description: 'Return the current UTC time.',
  execute: () => new Date().toISOString(),
  inputSchema: { additionalProperties: false, properties: {}, type: 'object' },
  name: 'current_time',
})

const result = await generateText(model, {
  input: 'What time is it in UTC? Use the current_time tool.',
  stopWhen: maxSteps(3),
  tools: [clock],
})
console.log(result.text)
```

The loop executes the tool if the model requests it.
It sends the tool result back to the model on the next step.
The model can still stop before the step limit.
Use a runtime validator for tool inputs that cross a trust boundary.
A raw JSON Schema describes the input but does not validate it locally.

For the tool contract, read the [text API reference](https://xsai.js.org/text/api#tools).
For step limits and hooks, read [Control tool loop steps](https://xsai.js.org/text/loop-control).
