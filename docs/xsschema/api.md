# Schema API reference

Import these exports from `xsschema`.
Validation and JSON Schema conversion are separate operations.
Validation works with any Standard Schema implementation.
Conversion requires a supported vendor or native Standard JSON Schema support.

## Functions

`toJsonSchema(schema)` returns `Promise<JsonSchema>`.
If the schema exposes `~standard.jsonSchema`, the function requests its input schema with target `draft-07`.
Otherwise, it loads the converter for `~standard.vendor`.
Conversion can reject if a dependency is absent or the vendor cannot represent the schema.

`validate(schema, input)` returns a Promise of the schema output type.
It calls `schema['~standard'].validate(input)` and awaits asynchronous results.
If validation returns issues, it throws Error with the issues formatted as JSON.
It returns transformed output when the validator transforms the input.

`jsonSchema(schema)` returns the supplied JSON Schema object unchanged.
It does not validate data or the schema itself.

`strictJsonSchema(schema)` returns a copy with `additionalProperties: false`.
It applies that change recursively to directly nested properties with `type: 'object'`.
It does not traverse array items, unions, or schema references.
It does not make every property required.

## Vendor conversion

| Vendor | Required packages |
| --- | --- |
| Native Standard JSON Schema | The schema library itself. |
| Zod v4 and Mini | `zod`. |
| Zod v3 | `zod` and `zod-to-json-schema`. |
| Valibot | `valibot` and `@valibot/to-json-schema`. |
| ArkType | `arktype`. |
| Effect Schema | `effect`. |
| Sury | `sury`. |

Use the package peer dependency ranges for supported versions.
Converter support does not guarantee that every vendor feature has a JSON Schema representation.
No function in this package sends a network request or accepts an AbortSignal.

## Types

`Schema` exports `StandardSchemaV1`.
`SchemaWithJson` exports `StandardJSONSchemaV1`.
`JsonSchema` exports `JSONSchema7`.
`Infer<T>` is a deprecated alias of `Schema.InferOutput<T>`.
`InferIn<T>` is a deprecated alias of `Schema.InferInput<T>`.
Use the Standard Schema inference types in new code.

## Missing dependencies

If conversion reports a missing package, install the converter from the table above.
For Zod v3, install `zod-to-json-schema`.
For Valibot, install `@valibot/to-json-schema`.
Retry the conversion after the dependency is available to your runtime.

## Unsupported schema vendor

If the schema lacks native JSON Schema support and its vendor has no converter, conversion rejects.
Use a supported vendor or supply a JSON Schema directly to an API that accepts it.
Validation still works when the schema follows Standard Schema.
