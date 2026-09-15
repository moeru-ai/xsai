import type { Tool } from '@xsai/text-primitives'

import type { FunctionToolParam } from '../generated'

import { strictSchema } from '@xsai/text-primitives'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): FunctionToolParam[] | undefined => tools?.map(tool => ({
  ...(tool.description == null ? {} : { description: tool.description }),
  name: tool.name,
  parameters: strictSchema(tool.inputSchema),
  strict: true,
  type: 'function',
}))
