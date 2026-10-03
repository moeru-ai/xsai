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

export type TextEventTargetMap = {
  [K in Exclude<TextEvent['type'], 'raw'>]: CustomEvent<Omit<Extract<TextEvent, { type: K }>, 'type'>>
} & { raw: CustomEvent<unknown> }

type TextEventListener<E extends Event>
  = | ((this: EventTarget, event: E) => unknown)
    | { handleEvent: (event: E) => unknown }

// The type declaration and the constructor intentionally share a name.
// eslint-disable-next-line ts/no-redeclare -- merge the typed interface with the native constructor
export const TextEventTarget = EventTarget as unknown as {
  new(): TextEventTarget
}
