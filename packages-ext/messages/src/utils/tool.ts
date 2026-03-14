import type { StandardJSONSchemaV1 } from '@standard-schema/spec'

import type { ExecutableTool, ToolOptions } from '../types/anthropic-tool'

/** @experimental */
export const tool = <T extends StandardJSONSchemaV1>({ description, execute, inputSchema, name, strict }: ToolOptions<T>): ExecutableTool => ({
  description,
  execute,
  input_schema: inputSchema['~standard'].jsonSchema.input({ target: 'draft-07' }),
  name,
  strict,
})
