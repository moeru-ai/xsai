import type { Tool } from '@xsai/text-primitives'

import type { FunctionToolParam } from '../generated'

import { strictJsonSchema } from 'xsschema'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): FunctionToolParam[] | undefined => tools?.map(tool => ({
  ...(tool.description == null ? {} : { description: tool.description }),
  name: tool.name,
  parameters: strictJsonSchema(tool.inputSchema) as Record<string, unknown>,
  strict: true,
  type: 'function',
}))
