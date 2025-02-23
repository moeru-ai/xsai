import { type } from 'arktype'
import { describe, expect, it } from 'vitest'

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
})
