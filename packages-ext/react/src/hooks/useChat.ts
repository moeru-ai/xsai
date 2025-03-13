import type { UIMessage } from '@xsai-ext/shared-ui'
import type { Message } from '@xsai/shared-chat'
import type { StreamTextOptions } from '@xsai/stream-text'

import { accumulateDataChunk, dateNumberIDGenerate, extractUIMessageParts } from '@xsai-ext/shared-ui'
import { streamText } from '@xsai/stream-text'
import { useCallback, useMemo, useRef, useState } from 'react'

import { useStableValue } from './utils/use-stable-state'

/**
 * you can either use { content: string } or { parts: [{ text:'', type:'text' }] }
 */
export type InputMessage = Omit<Message, 'id' | 'role'>

export type UseChatOptions = Omit<StreamTextOptions, 'messages' | 'onChunk' | 'onFinish'> & {
  id?: string
  idGenerator?: () => string
  initialMessages?: Message[]
  onError?: (error: Error) => Promise<void> | void
  onFinish?: (message: Message) => Promise<void> | void
}

export type UseChatStatus = 'error' | 'idle' | 'loading'

const DEFAULT_ID_GENERATOR = () => dateNumberIDGenerate().toString()

export function useChat(options: UseChatOptions) {
  const {
    id,
    idGenerator = DEFAULT_ID_GENERATOR,
    initialMessages = [],
    onError,
    onFinish,
    ...streamTextOptions
  } = options

  const [chatID] = useState(id ?? idGenerator())

  const stableInitialMessages = useStableValue(initialMessages ?? [])
  const initialUIMessages = useMemo(() => stableInitialMessages.map((m) => {
    return {
      ...m,
      id: idGenerator(),
      parts: extractUIMessageParts(m),
    }
  }), [stableInitialMessages])

  const [messages, setMessages] = useState<UIMessage[]>(initialUIMessages)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<UseChatStatus>('idle')
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const lastUIMessage = useRef<null | UIMessage>(null)

  const submitMessage = useCallback(
    async (message: InputMessage) => {
      if (status !== 'idle') {
        return
      }

      if (
        // check content array
        (Array.isArray(message.content) && message.content.length === 0)
        // compatibility with inputs
        || (typeof message.content === 'string' && message.content.trim() === '')
      ) {
        return
      }

      const userMessage = {
        ...message,
        id: idGenerator(),
        role: 'user',
      } as UIMessage

      setMessages(messages => [...messages, userMessage])

      setStatus('loading')
      setError(null)
      setInput('')

      try {
        abortControllerRef.current = new AbortController()

        await streamText({
          ...streamTextOptions as StreamTextOptions,
          messages: [...messages, userMessage],
          onDataChunk: (chunk) => {
            if (!lastUIMessage.current) {
              lastUIMessage.current = {
                id: idGenerator(),
                parts: [],
                role: 'assistant',
              }
            }
            accumulateDataChunk(lastUIMessage.current, chunk)

            // maybe we should throttle this
            setMessages(messages => [
              ...messages.slice(0, messages.length - 1),
              lastUIMessage.current!,
            ])
          },
          signal: abortControllerRef.current.signal,
        })

        setStatus('idle')

        if (onFinish) {
          // eslint-disable-next-line ts/no-floating-promises
          onFinish(messages[messages.length - 1])
        }
      }
      catch (error) {
        setStatus('error')
        const actualError = error instanceof Error ? error : new Error(String(error))
        setError(actualError)
        if (onError) {
          // eslint-disable-next-line ts/no-floating-promises
          onError(actualError)
        }
      }
      finally {
        abortControllerRef.current = null
        lastUIMessage.current = null
      }
    },
    [
      // props
      chatID,
      initialMessages,
      onFinish,
      onError,
      // state
      messages,
      status,
    ],
  )

  const stop = useCallback(() => {
    if (!(abortControllerRef.current))
      return
    abortControllerRef.current.abort()
    setStatus('idle')
  }, [])

  const reload = useCallback(() => {

  }, [chatID, messages, submitMessage])

  const reset = useCallback(() => {
    stop()
    setMessages(initialUIMessages)
    setInput('')
    setError(null)
    setStatus('idle')
  }, [stop, initialUIMessages])

  return {
    error,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault()
      submitMessage(input)
    },
    input,
    messages,
    reload,
    reset,
    setInput,
    setMessages,
    status,
    stop,
    submitMessage,
  }
}

export default useChat
