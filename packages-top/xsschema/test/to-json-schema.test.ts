import { type } from 'arktype'
import { Schema } from 'effect'
import * as v from 'valibot'
import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { initToJsonSchemaSyncVendor, toJsonSchema, toJsonSchemaSync } from '../src'

describe('toJsonSchema', () => {
  // This test is marked as sequential because it should be run before all the other tests have
  // had a chance to register their vendors.
  it.sequential('toJsonSchemaSync should throw if the vendor is not registered', async () => {
    const schema = z.object({
      myString: z.string(),
      myUnion: z.union([z.number(), z.boolean()]),
    }).describe('My neat object schema')

    expect(() => toJsonSchemaSync(schema)).toThrow()
  })

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

    const jsonSchema = await toJsonSchema(Schema.standardSchemaV1(schema))
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

  it('arktype sync', async () => {
    const schema = type({
      myString: 'string',
      myUnion: 'number | boolean',
    }).describe('My neat object schema')

    await initToJsonSchemaSyncVendor('arktype')
    const jsonSchema = toJsonSchemaSync(schema)
    expect(jsonSchema).toMatchSnapshot()
  })

  it('effect sync', async () => {
    const schema = Schema.Struct({
      myString: Schema.String,
      myUnion: Schema.Union(Schema.Number, Schema.Boolean),
    }).annotations({ description: 'My neat object schema' })

    await initToJsonSchemaSyncVendor('effect')
    const jsonSchema = toJsonSchemaSync(Schema.standardSchemaV1(schema))
    expect(jsonSchema).toMatchSnapshot()
  })

  it('valibot sync', async () => {
    const schema = v.pipe(
      v.object({
        myString: v.string(),
        myUnion: v.union([v.number(), v.boolean()]),
      }),
      v.description('My neat object schema'),
    )

    await initToJsonSchemaSyncVendor('valibot')
    const jsonSchema = toJsonSchemaSync(schema)
    expect(jsonSchema).toMatchSnapshot()
  })

  it('zod sync', async () => {
    const schema = z.object({
      myString: z.string(),
      myUnion: z.union([z.number(), z.boolean()]),
    }).describe('My neat object schema')

    await initToJsonSchemaSyncVendor('zod')
    const jsonSchema = toJsonSchemaSync(schema)
    expect(jsonSchema).toMatchSnapshot()
  })
})
