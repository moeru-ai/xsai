import type { TextEvent } from '@xsai/text-primitives'

export type StreamTextEvent = StreamTextEventMap[keyof StreamTextEventMap]
export type StreamTextEventMap = {
  [K in Exclude<TextEvent['type'], 'raw'>]: CustomEvent<Omit<Extract<TextEvent, { type: K }>, 'type'>>
} & { raw: CustomEvent<unknown> }
