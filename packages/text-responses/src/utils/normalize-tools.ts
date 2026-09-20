import type { Tool } from '@xsai/text-primitives'

import type { FunctionToolParam } from '../generated'

import { normalizeSchema } from './normalize-schema'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): FunctionToolParam[] | undefined => tools?.map(tool => ({
  description: tool.description,
  name: tool.name,
  parameters: normalizeSchema(tool.inputSchema.schema) as Record<string, unknown>,
  strict: true,
  type: 'function',
}))
