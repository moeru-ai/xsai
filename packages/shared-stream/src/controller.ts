export interface ReadableStreamControllerRef<T> {
  current: ReadableStreamDefaultController<T> | undefined
}

export const createControlledStream = <T>() => {
  const controller: ReadableStreamControllerRef<T> = {
    current: undefined,
  }

  const stream = new ReadableStream<T>({
    cancel: () => controller.current = undefined,
    start: currentController => controller.current = currentController,
  })

  return [stream, controller] as const
}

export const closeControllers = (...controllers: ReadableStreamControllerRef<unknown>[]) => {
  for (const controller of controllers) {
    const current = controller.current
    controller.current = undefined
    current?.close()
  }
}

export const errorControllers = (reason: unknown, ...controllers: ReadableStreamControllerRef<unknown>[]) => {
  for (const controller of controllers) {
    const current = controller.current
    controller.current = undefined
    current?.error(reason)
  }
}
