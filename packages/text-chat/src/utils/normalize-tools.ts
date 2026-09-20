import type { Tool, ToolChoice } from '@xsai/text-primitives'

import type { ChatTool, ChatToolChoice } from '../types'

import { normalizeSchema } from './normalize-schema'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): ChatTool[] | undefined => tools?.map(tool => ({
  function: {
    description: tool.description,
    name: tool.name,
    parameters: normalizeSchema(tool.inputSchema) as Record<string, unknown>,
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
