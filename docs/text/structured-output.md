# Generate structured output

`outputFormat` asks the service to return JSON that matches a schema.
xsAI always sends the schema in strict mode.

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { generateText } from '@xsai/text'

import * as z from 'zod'

const Color = z.object({ color: z.string(), hex: z.string() })

const result = await generateText(model, {
  input: 'Describe the color of a clear sky.',
  outputFormat: Color,
})

const color = Color.parse(JSON.parse(result.text))
```

`generateText` returns text, not a parsed object.
Parse and validate it yourself, as in the last line.
Parsing can fail when `result.status` is `incomplete` or when the model refuses.
Check `status` and `message.content` before you parse.

`outputFormat` accepts the same schemas as [tools](/text/tools): a JSON Schema, or a schema library with Standard JSON Schema support.
Each adapter keeps only the schema features that its protocol supports, so a schema that works with one adapter can fail with another.
