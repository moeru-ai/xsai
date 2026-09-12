import type { Tool } from '@xsai/text-primitives'

import type { MessagesTool } from '../types'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): MessagesTool[] | undefined => tools?.map(tool => ({
  ...(tool.description == null ? {} : { description: tool.description }),
  input_schema: tool.inputSchema,
  name: tool.name,
}))
