export interface TypedEventTarget<M extends Record<keyof M, Event>> {
  addEventListener: <K extends keyof M & string>(
    type: K,
    listener: null | TypedEventListener<M[K]>,
    options?: AddEventListenerOptions | boolean,
  ) => void

  dispatchEvent: (event: Event) => boolean

  removeEventListener: <K extends keyof M & string>(
    type: K,
    listener: null | TypedEventListener<M[K]>,
    options?: boolean | EventListenerOptions,
  ) => void
}

type TypedEventListener<E extends Event>
  = | ((this: EventTarget, event: E) => unknown)
    | { handleEvent: (event: E) => unknown }

// The type declaration and the constructor intentionally share a name.
// eslint-disable-next-line ts/no-redeclare -- merge the typed interface with the native constructor
export const TypedEventTarget = EventTarget as unknown as {
  new<M extends Record<keyof M, Event>>(): TypedEventTarget<M>
}
