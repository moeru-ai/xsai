import type { Tool, ToolChoice } from '@xsai/text-primitives'

import type { MessagesTool, MessagesToolChoice } from '../types'
import type { MessagesToolInput } from '../types/provider-options'

import { normalizeSchema } from './normalize-schema'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): MessagesTool[] | undefined => tools?.map(tool => ({
  description: tool.description,
  input_schema: normalizeSchema(tool.inputSchema.schema) as Record<string, unknown>,
  name: tool.name,
}))

export const mergeTools = (
  providerTools?: readonly MessagesToolInput[],
  tools?: readonly Tool[],
): (MessagesTool | MessagesToolInput)[] | undefined => {
  const merged = [
    ...(providerTools ?? []),
    ...(normalizeTools(tools) ?? []),
  ]
  return merged.length === 0 ? undefined : merged
}

/** @internal */
export const normalizeToolChoice = (toolChoice: ToolChoice | undefined): MessagesToolChoice | undefined =>
  toolChoice == null
    ? undefined
    : typeof toolChoice === 'string'
      ? { type: toolChoice === 'required' ? 'any' : toolChoice }
      : { name: toolChoice.name, type: 'tool' }
