type TypedEventListener<E extends Event>
  = | ((this: EventTarget, event: E) => unknown)
    | { handleEvent: (event: E) => unknown }

export class TypedEventTarget<M extends Record<keyof M, Event>> extends EventTarget {
  override addEventListener<K extends keyof M & string>(
    type: K,
    listener: null | TypedEventListener<M[K]>,
    options?: AddEventListenerOptions | boolean,
  ): void
  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void
  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    super.addEventListener(type, listener, options)
  }

  override removeEventListener<K extends keyof M & string>(
    type: K,
    listener: null | TypedEventListener<M[K]>,
    options?: boolean | EventListenerOptions,
  ): void
  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void
  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void {
    super.removeEventListener(type, listener, options)
  }
}
