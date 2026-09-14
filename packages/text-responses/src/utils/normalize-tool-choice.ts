import type { ToolChoice } from '@xsai/text-primitives'

import type { ToolChoiceParam } from '../generated'

/** @internal */
export const normalizeToolChoice = (toolChoice: ToolChoice | undefined): ToolChoiceParam | undefined =>
  toolChoice === undefined
    ? undefined
    : typeof toolChoice === 'string'
      ? toolChoice
      : { name: toolChoice.name, type: 'function' }
