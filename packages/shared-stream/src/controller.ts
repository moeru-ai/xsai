export interface ReadableStreamControllerRef<T> {
  current: ReadableStreamDefaultController<T> | undefined
}

export const createControlledStream = <T>() => {
  const controller: ReadableStreamControllerRef<T> = {
    current: undefined,
  }

  const stream = new ReadableStream<T>({
    start: currentController => controller.current = currentController,
  })

  return {
    controller,
    stream,
  }
}

export const closeControllers = (...controllers: ReadableStreamControllerRef<unknown>[]) => {
  for (const controller of controllers)
    controller.current?.close()
}

export const errorControllers = (reason: unknown, ...controllers: ReadableStreamControllerRef<unknown>[]) => {
  for (const controller of controllers)
    controller.current?.error(reason)
}
