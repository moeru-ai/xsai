# Generate structured output

Use the model from the [text quick start](https://xsai.js.org/text/quick-start).
The endpoint and model must support the feature that you request.

`outputFormat` sends a strict schema to the adapter.
This example requests an object with one string field:

```ts
import { generateText } from '@xsai/text'

const result = await generateText(model, {
  input: 'Name one color.',
  outputFormat: {
    additionalProperties: false,
    properties: { color: { type: 'string' } },
    required: ['color'],
    type: 'object',
  },
})
console.log(JSON.parse(result.text))
```

`generateText` returns text. It does not return a parsed object.
Parse and validate the output before your application uses it.
A provider can refuse the request or stop before it completes the object.
Inspect the result status and message content when parsing fails.

For schema inputs, read the [text API reference](https://xsai.js.org/text/api#model-configuration).
For schema conversion, read the [xsschema guide](https://xsai.js.org/xsschema/quick-start).
