import { z as zm } from '@zod/mini'
import { type } from 'arktype'
import { Schema } from 'effect'
import * as v from 'valibot'
import { describe, expect, it } from 'vitest'
import { z as z4 } from 'zod4'
import { z } from 'zod'

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
    const zod4Schema = z4.object({
      myString: z4.string(),
      myUnion: z4.union([z4.number(), z4.boolean()]),
    }).describe('My neat object schema')

    const zod4JsonSchema = await toJsonSchema(zod4Schema)
    expect(zod4JsonSchema).toMatchSnapshot()

    const zod3Schema = z.object({
      myString: z.string(),
      myUnion: z.union([z.number(), z.boolean()]),
    }).describe('My neat object schema')

    const zod3JsonSchema = await toJsonSchema(zod3Schema)
    expect(zod3JsonSchema).toMatchSnapshot()

    const zodMiniSchema = zm.object({
      myString: zm.string(),
      myUnion: zm.union([zm.number(), zm.boolean()]),
    })

    const zodMiniJsonSchema = await toJsonSchema(zodMiniSchema)
    expect(zodMiniJsonSchema).toMatchSnapshot()
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
    await initToJsonSchemaSyncVendor('zod')

    const zod4Schema = z4.object({
      myString: z4.string(),
      myUnion: z4.union([z4.number(), z4.boolean()]),
    }).describe('My neat object schema')

    const zod4JsonSchema = await toJsonSchema(zod4Schema)
    expect(zod4JsonSchema).toMatchSnapshot()

    const zod3Schema = z.object({
      myString: z.string(),
      myUnion: z.union([z.number(), z.boolean()]),
    }).describe('My neat object schema')

    const zod3JsonSchema = await toJsonSchema(zod3Schema)
    expect(zod3JsonSchema).toMatchSnapshot()

    const zodMiniSchema = zm.object({
      myString: zm.string(),
      myUnion: zm.union([zm.number(), zm.boolean()]),
    })

    const zodMiniJsonSchema = await toJsonSchema(zodMiniSchema)
    expect(zodMiniJsonSchema).toMatchSnapshot()
  })
})
