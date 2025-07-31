import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import { strictJsonSchema, toJsonSchema } from '../src'

describe('strictJsonSchema', () => {
  it('basic', async () => {
    const schema = v.pipe(
      v.object({
        myString: v.string(),
        myUnion: v.union([v.number(), v.boolean()]),
      }),
      v.description('My neat object schema'),
    )

    expect(strictJsonSchema(await toJsonSchema(schema))).toMatchSnapshot()
  })

  it('nested', async () => {
    const schema = v.object({
      foo: v.object({
        bar: v.string(),
        baz: v.object({
          qux: v.string(),
        }),
      }),
    })

    expect(strictJsonSchema(await toJsonSchema(schema))).toMatchSnapshot()
  })
})
