import type { Tool, ToolChoice } from '@xsai/text'

import type { ChatTool, ChatToolChoice } from '../types'


/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): ChatTool[] | undefined => tools?.map(tool => ({
  function: {
    description: tool.description,
    name: tool.name,
    parameters: tool.inputSchema.schema as Record<string, unknown>,
    strict: tool.strict ?? false,
  },
  type: 'function',
}))

/** @internal */
export const normalizeToolChoice = (toolChoice: ToolChoice | undefined): ChatToolChoice | undefined =>
  toolChoice == null
    ? undefined
    : typeof toolChoice === 'string'
      ? toolChoice
      : { function: { name: toolChoice.name }, type: 'function' }
