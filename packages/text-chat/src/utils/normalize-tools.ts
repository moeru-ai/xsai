import type { Tool } from '@xsai/text-primitives'

import type { ChatTool } from '../types'

import { strictJsonSchema } from 'xsschema'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): ChatTool[] | undefined => tools?.map(tool => ({
  function: {
    ...(tool.description == null ? {} : { description: tool.description }),
    name: tool.name,
    parameters: strictJsonSchema(tool.inputSchema) as Record<string, unknown>,
    strict: true,
  },
  type: 'function',
}))
