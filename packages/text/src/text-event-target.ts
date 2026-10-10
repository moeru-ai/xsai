import type { TextEvent } from './types/text-event'

export interface TextEventTarget {
  addEventListener: <K extends keyof TextEventTargetMap>(
    type: K,
    listener: null | TextEventListener<TextEventTargetMap[K]>,
    options?: AddEventListenerOptions | boolean,
  ) => void

  dispatchEvent: (event: Event) => boolean

  removeEventListener: <K extends keyof TextEventTargetMap>(
    type: K,
    listener: null | TextEventListener<TextEventTargetMap[K]>,
    options?: boolean | EventListenerOptions,
  ) => void
}

type TextEventListener<E extends Event>
  = | ((this: EventTarget, event: E) => unknown)
    | { handleEvent: (event: E) => unknown }

type TextEventTargetMap = {
  [K in Exclude<TextEvent['type'], 'raw'>]: CustomEvent<Omit<Extract<TextEvent, { type: K }>, 'type'>>
} & { raw: CustomEvent<unknown> }

// eslint-disable-next-line ts/no-redeclare -- merge the typed interface with the native constructor
export const TextEventTarget = EventTarget as {
  new(): TextEventTarget
}

export const toCustomEvent = <E extends TextEvent>(event: E): TextEventTargetMap[E['type']] => {
  const { type, ...detail } = event
  return new CustomEvent(type, {
    detail: event.type === 'raw' ? event.detail : detail,
  }) as TextEventTargetMap[E['type']]
}

export const withEventTarget = (events: EventTarget): TransformStream<TextEvent, TextEvent> => new TransformStream({
  transform: (event, controller) => {
    events.dispatchEvent(toCustomEvent(event))
    controller.enqueue(event)
  },
})
