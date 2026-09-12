import type { ToolChoice } from '@xsai/text-primitives'

import type { ToolChoiceParam } from '../generated'

/** @internal */
export const normalizeToolChoice = (toolChoice: ToolChoice, extras?: Record<string, unknown>): ToolChoiceParam =>
  typeof toolChoice === 'string'
    ? toolChoice
    : { ...extras, name: toolChoice.name, type: 'function' }
