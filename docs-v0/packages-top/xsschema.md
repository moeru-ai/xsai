# Convert and validate schemas {#xsschema}

Use Standard Schema values for validation and JSON Schema conversion.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Install `valibot` and `@valibot/to-json-schema` for the schema examples.

```sh
npm i xsschema@0.5.1
```

## Why xsSchema?

xsschema uses the Standard Schema contract for validation.
It also converts supported schema vendors to JSON Schema.

### Compare

The original page compared three packages at specific historical releases.
Those releases were `xsschema` 0.4.0-beta.3, `@standard-community/standard-json` 0.3.1, and `@typeschema/main` 0.14.1.
The comparison is historical. It does not describe their current releases.

#### xsschema 0.4.0-beta.3 {#xsschema-040-beta3-17kb}

The historical comparison listed 17 KB and ESM-only output.

#### @standard-community/standard-json 0.3.1 {#standard-communitystandard-json-031-96kb}

The historical comparison listed 96 KB and CommonJS support.

#### @typeschema/main 0.14.1 {#typeschemamain-0141-68kb}

The historical comparison listed 68 KB and an interface outside Standard Schema.

## Coverage

`validate` works with any Standard Schema-compatible library. Conversion support is a separate contract.

`toJsonSchema` supports these historical vendor versions:

| Implementer | Version(s) | Status |
|---|---|---|
| Zod (`zod/v4`, `zod/v4/mini`) | v3.25+ | Supported |
| Zod (`zod/v3`, with `zod-to-json-schema`) | v3.25+ | Supported |
| Valibot (with `@valibot/to-json-schema`) | v1.0+ | Supported |
| ArkType | v2.1+ | Supported |
| Effect Schema | v3.16+ | Supported |
| Sury | v10.0+ | Supported |

## Usage

Some xsAI packages depend on xsschema. If your application imports xsschema directly, declare it as a direct dependency.

### toJsonSchema

```ts
const arktypeSchema = type({
  myString: 'string',
  myUnion: 'number | boolean',
}).describe('My neat object schema')

const arktypeJsonSchema = await toJsonSchema(arktypeSchema)

const effectSchema = Schema.standardSchemaV1( // [!code highlight]
  Schema.Struct({
    myString: Schema.String,
    myUnion: Schema.Union(Schema.Number, Schema.Boolean),
  }).annotations({ description: 'My neat object schema' })
)

const effectJsonSchema = await toJsonSchema(effectSchema)

const surySchema = S.schema({
  myString: S.string,
  myUnion: S.union([S.number, S.boolean]),
}).with(S.meta, { description: 'My neat object schema' })

const suryJsonSchema = await toJsonSchema(surySchema)

const valibotSchema = v.pipe(
  v.object({
    myString: v.string(),
    myUnion: v.union([v.number(), v.boolean()]),
  }),
  v.description('My neat object schema'),
)

const valibotJsonSchema = await toJsonSchema(valibotSchema)

const zodSchema = z.object({
  myString: z.string(),
  myUnion: z.union([z.number(), z.boolean()]),
}).describe('My neat object schema')

const zodJsonSchema = await toJsonSchema(zodSchema)
```

### validate

```ts
const arktypeSchema = type('string')
const effectSchema = Schema.standardSchemaV1(Schema.String)
const surySchema = S.string
const valibotSchema = v.string()
const zodSchema = z.string()

const arktypeResult = await validate(arktypeSchema, '123')
const effectResult = await validate(effectSchema, '123')
const suryResult = await validate(surySchema, '123')
const valibotResult = await validate(valibotSchema, '123')
const zodResult = await validate(zodSchema, '123')
```

### jsonSchema

Define a JSON Schema.

```ts
const schema = jsonSchema({
  properties: {
    productId: {
      description: 'The unique identifier for a product',
      type: 'integer'
    }
  },
  type: 'object'
})
```

### strictJsonSchema

Define a JSON Schema with `additionalProperties: false`.

```ts
const schema = strictJsonSchema({
  properties: {
    productId: {
      description: 'The unique identifier for a product',
      type: 'integer'
    }
  },
  type: 'object'
})

// false
console.log(schema.additionalProperties)
```

## Types

### Schema

A type export of `StandardSchemaV1` from `@standard-schema/spec`.

### SchemaWithJson

A type export of `StandardJSONSchemaV1` from `@standard-schema/spec`. Use it for schemas that provide JSON Schema directly.

### JsonSchema

A type export of `JSONSchema7` from `@types/json-schema`.

### Infer (deprecated)

Alias for `StandardSchemaV1.Infer`.

### InferIn (deprecated)

Alias for `StandardSchemaV1.InferInput`.

## Errors

### Missing dependencies

Some vendors require an additional package for JSON Schema conversion.

Install the converter for the vendor that you use:

```sh
npm i zod-to-json-schema # Zod v3
npm i @valibot/to-json-schema # Valibot
```

All optional peer dependencies are noted in [Coverage](/packages-top/xsschema#coverage).

### Unsupported schema vendor

The converter does not support this schema vendor.

The historical contribution policy requires one of these conditions:

- The library has more than 100 GitHub stars.
- The npm package has more than 1,000 weekly downloads.

## Result

The examples convert schemas, validate values, and define JSON Schema objects.
