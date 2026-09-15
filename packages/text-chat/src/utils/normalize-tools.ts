import type { Tool, ToolChoice } from '@xsai/text-primitives'

import type { ChatTool, ChatToolChoice } from '../types'

import { strictSchema } from '@xsai/text-primitives'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): ChatTool[] | undefined => tools?.map(tool => ({
  function: {
    ...(tool.description == null ? {} : { description: tool.description }),
    name: tool.name,
    parameters: strictSchema(tool.inputSchema),
    strict: true,
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
