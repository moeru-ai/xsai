import type { TextEvent } from '@xsai/text-primitives'

export type StreamTextEvent = StreamTextEventMap[keyof StreamTextEventMap]
export type StreamTextEventMap = {
  [K in NonDeltaTextEventType]: CustomEvent<Omit<Extract<TextEvent, { type: K }>, 'type'>>
}

type NonDeltaTextEvent = Exclude<TextEvent, { type: `${string}.delta` }>
type NonDeltaTextEventType = NonDeltaTextEvent['type']

const toCustomEvent = (event: NonDeltaTextEvent): StreamTextEvent => {
  const { type, ...detail } = event
  return new CustomEvent(type, { detail })
}

export const toStreamTextEvent = (event: TextEvent): StreamTextEvent | undefined => {
  switch (event.type) {
    case 'content.end':
    case 'content.start':
    case 'step.end':
    case 'step.start':
      return toCustomEvent(event)
    case 'reasoning.delta':
    case 'refusal.delta':
    case 'text.delta':
    case 'tool-call.delta':
      return undefined
  }
}
