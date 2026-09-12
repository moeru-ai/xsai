import type { ToolChoice } from '@xsai/text-primitives'

import type { ToolChoiceParam } from '../generated'

/** @internal */
export const normalizeToolChoice = (toolChoice: ToolChoice): ToolChoiceParam =>
  typeof toolChoice === 'string'
    ? toolChoice
    : { name: toolChoice.name, type: 'function' }
