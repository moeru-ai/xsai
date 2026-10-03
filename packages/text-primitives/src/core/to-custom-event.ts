import type { TextEventTargetMap } from './text-event-target'
import type { TextEvent } from './types/text-event'

export const toCustomEvent = <E extends TextEvent>(event: E): TextEventTargetMap[E['type']] => {
  const { type, ...detail } = event
  return new CustomEvent(type, {
    detail: event.type === 'raw' ? event.detail : detail,
  }) as TextEventTargetMap[E['type']]
}
