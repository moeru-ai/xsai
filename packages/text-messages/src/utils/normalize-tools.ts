import type { Tool, ToolChoice } from '@xsai/text-primitives'

import type { MessagesTool, MessagesToolChoice } from '../types'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): MessagesTool[] | undefined => tools?.map(tool => ({
  ...(tool.description == null ? {} : { description: tool.description }),
  input_schema: tool.inputSchema,
  name: tool.name,
}))

/** @internal */
export const normalizeToolChoice = (toolChoice: ToolChoice | undefined, extras?: Record<string, unknown>): MessagesToolChoice | undefined =>
  toolChoice === undefined
    ? undefined
    : typeof toolChoice === 'string'
      ? { ...extras, type: toolChoice === 'required' ? 'any' : toolChoice }
      : { ...extras, name: toolChoice.name, type: 'tool' }
