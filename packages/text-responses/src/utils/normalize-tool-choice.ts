import type { ToolChoice } from '@xsai/text-primitives'

import type { ToolChoiceParam } from '../generated'

/** @internal */
export const normalizeToolChoice = (toolChoice: ToolChoice | undefined, extras?: Record<string, unknown>): ToolChoiceParam | undefined =>
  toolChoice === undefined
    ? undefined
    : typeof toolChoice === 'string'
      ? toolChoice
      : { ...extras, name: toolChoice.name, type: 'function' }
