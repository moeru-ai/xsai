import type { Tool, ToolChoice } from '@xsai/text-primitives'

import type { ChatTool, ChatToolChoice } from '../types'

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

/** @internal */
export const normalizeToolChoice = (toolChoice: ToolChoice | undefined, extras?: Record<string, unknown>): ChatToolChoice | undefined =>
  toolChoice === undefined
    ? undefined
    : typeof toolChoice === 'string'
      ? toolChoice
      : { ...extras, function: { name: toolChoice.name }, type: 'function' }
