import type { Tool } from '@xsai/text-primitives'

import type { FunctionToolParam } from '../generated'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): FunctionToolParam[] | undefined => tools?.map(tool => ({
  ...(tool.description == null ? {} : { description: tool.description }),
  name: tool.name,
  parameters: tool.inputSchema,
  strict: true,
  type: 'function',
}))
