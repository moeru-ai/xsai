# xsschema

`xsschema` converts schemas to JSON Schema and validates data with them.
The two jobs are separate.
Validation works with any library that implements [Standard Schema](https://standardschema.dev).
Conversion needs native Standard JSON Schema support or a converter for the library.

<!-- @include: ./snippets/xsschema.md -->

xsAI accepts schemas from libraries with native Standard JSON Schema support directly, for example in [`tool()`](/text/tools).
Use xsschema for libraries without it.

```ts
import { toJsonSchema } from 'xsschema'

import * as z from 'zod'

const inputSchema = await toJsonSchema(z.object({ city: z.string() }))
```

## Reference

`toJsonSchema(schema)` returns `Promise<JsonSchema>`.
If the schema exposes `~standard.jsonSchema`, the function asks it for the input schema with target `draft-07`.
Otherwise, it loads the converter for `~standard.vendor`.
It rejects when the converter package is missing or the library cannot express the schema.

`validate(schema, input)` returns a promise for the output type of the schema.
If validation reports issues, it throws an `Error` with the issues as JSON.
It returns the transformed value when the schema transforms its input.

`jsonSchema(schema)` returns the JSON Schema object that you pass in, unchanged.
It validates neither data nor the schema.

`strictJsonSchema(schema)` returns a copy with `additionalProperties: false`, applied recursively to directly nested object properties.
It does not visit array items, unions, or references, and it does not make properties required.

| Library | Required packages |
| --- | --- |
| Native Standard JSON Schema | The library itself. |
| Zod 4 and Zod Mini | `zod`. |
| Zod 3 | `zod` and `zod-to-json-schema`. |
| Valibot | `valibot` and `@valibot/to-json-schema`. |
| ArkType | `arktype`. |
| Effect Schema | `effect`. |
| Sury | `sury`. |

Support for a library does not mean that JSON Schema can express all of its features.
No function in this package sends a request or takes an `AbortSignal`.

The types are `Schema` (`StandardSchemaV1`), `SchemaWithJson` (`StandardJSONSchemaV1`), and `JsonSchema` (`JSONSchema7`).
`Infer` and `InferIn` are deprecated aliases of the Standard Schema inference types.

### Errors

If conversion reports a missing package, install the converter from the table and run it again.
If the library has no native support and no converter, conversion rejects.
Use a supported library, or pass a JSON Schema directly.
Validation still works with any Standard Schema library.
