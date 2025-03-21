import { type } from 'arktype'
import { Schema } from 'effect'
import * as v from 'valibot'
import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { toJsonSchema } from '../src'

describe('toJsonSchema', () => {
  it('arktype', async () => {
    const schema = type({
      myString: 'string',
      myUnion: 'number | boolean',
    }).describe('My neat object schema')

    const jsonSchema = await toJsonSchema(schema)
    expect(jsonSchema).toMatchSnapshot()
  })

  it('effect', async () => {
    const schema = Schema.Struct({
      myString: Schema.String,
      myUnion: Schema.Union(Schema.Number, Schema.Boolean),
    }).annotations({ description: 'My neat object schema' })

    // https://github.com/Effect-TS/effect/issues/4494
    const jsonSchema = await toJsonSchema(Object.assign(schema, Schema.standardSchemaV1(schema)))
    expect(jsonSchema).toMatchSnapshot()
  })

  it('valibot', async () => {
    const schema = v.pipe(
      v.object({
        myString: v.string(),
        myUnion: v.union([v.number(), v.boolean()]),
      }),
      v.description('My neat object schema'),
    )

    const jsonSchema = await toJsonSchema(schema)
    expect(jsonSchema).toMatchSnapshot()
  })

  it('zod', async () => {
    const schema = z.object({
      myString: z.string(),
      myUnion: z.union([z.number(), z.boolean()]),
    }).describe('My neat object schema')

    const jsonSchema = await toJsonSchema(schema)
    expect(jsonSchema).toMatchSnapshot()
  })
})
