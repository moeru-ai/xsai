import type { StreamObjectOptions } from '@xsai/stream-object'

import { streamObject } from '@xsai/stream-object'
import { useCallback, useRef, useState } from 'react'

export type ObjectOptions<T> = Omit<StreamObjectOptions<T>, 'onPart'> & {
  initialObject?: Partial<T>
  messages?: Array<{ content: string, role: string }>
  onError?: (error: Error) => Promise<void> | void
  onFinish?: (data: T) => Promise<void> | void
}

export function useObject<T = any>(options: ObjectOptions<T> = {}) {
  const {
    initialObject,
    messages,
    onError,
    onFinish,
    ...streamOptions
  } = options

  const [object, setObject] = useState<T | undefined>(undefined)
  const [partialObject, setPartialObject] = useState<Partial<T> | undefined>(initialObject || {})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const generate = useCallback(
    async (prompt: string) => {
      setIsLoading(true)
      setError(null)
      setPartialObject(initialObject || {})
      setObject(undefined)

      try {
        abortControllerRef.current = new AbortController()

        const result = await streamObject<T>({
          ...streamOptions,
          messages,
          onPart: (part) => {
            setPartialObject(current => ({
              ...current,
              ...part,
            }))
          },
          prompt,
          signal: abortControllerRef.current.signal,
        })

        setObject(result)

        if (onFinish) {
          await onFinish(result)
        }
      }
      catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err)
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          if (onError) {
            await onError(error)
          }
        }
      }
      finally {
        setIsLoading(false)
      }
    },
    [streamOptions, initialObject, messages, onFinish, onError],
  )

  const stop = useCallback(() => {
    if (!(abortControllerRef.current))
      return
    abortControllerRef.current.abort()
    setIsLoading(false)
  }, [])

  const reset = useCallback(() => {
    setObject(undefined)
    setPartialObject(initialObject || {})
    setError(null)
  }, [initialObject])

  return {
    error,
    // Main method to generate an object from a prompt
    generate,
    // Status indicators
    isLoading,
    // Complete object (only available when generation is complete)
    object,
    // Partial object that updates incrementally during streaming
    partialObject,
    // Utility methods
    reset,
    // Allow manual updates if needed
    setPartialObject,
    stop,
  }
}

export default useObject
