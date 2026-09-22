import type { Tool } from '@xsai/text-primitives'

import type { FunctionToolParam } from '../generated'
import type { ResponsesToolInput } from '../types/provider-options'

import { normalizeSchema } from './normalize-schema'

/** @internal */
export const normalizeTools = (tools?: readonly Tool[]): FunctionToolParam[] | undefined => tools?.map(tool => ({
  description: tool.description,
  name: tool.name,
  parameters: normalizeSchema(tool.inputSchema.schema) as Record<string, unknown>,
  strict: true,
  type: 'function',
}))

/** Combines provider-managed Responses tools with locally executable function tools. */
export const mergeTools = (
  providerTools?: readonly ResponsesToolInput[],
  tools?: readonly Tool[],
): (FunctionToolParam | ResponsesToolInput)[] | undefined => {
  const merged = [
    ...(providerTools ?? []),
    ...(normalizeTools(tools) ?? []),
  ]
  return merged.length === 0 ? undefined : merged
}
