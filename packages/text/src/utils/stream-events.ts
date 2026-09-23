import type { TextEvent } from '@xsai/text-primitives'

export type StreamTextEvent = StreamTextEventMap[keyof StreamTextEventMap]
export type StreamTextEventMap = {
  [K in NonDeltaTextEventType]: CustomEvent<Omit<Extract<TextEvent, { type: K }>, 'type'>>
} & { raw: CustomEvent<unknown> }

type NonDeltaTextEvent = Exclude<TextEvent, { type: 'raw' | `${string}.delta` }>
type NonDeltaTextEventType = NonDeltaTextEvent['type']

const toCustomEvent = (event: NonDeltaTextEvent): StreamTextEvent => {
  const { type, ...detail } = event
  return new CustomEvent(type, { detail })
}

export const toStreamTextEvent = (event: TextEvent): StreamTextEvent | undefined => {
  switch (event.type) {
    case 'content.end':
    case 'content.start':
      return toCustomEvent(event)
    case 'raw':
      return new CustomEvent('raw', { detail: event.detail })
    case 'reasoning.delta':
    case 'refusal.delta':
      return undefined
    case 'step.end':
    case 'step.start':
      return toCustomEvent(event)
    case 'text.delta':
    case 'tool-call.delta':
      return undefined
  }
}
