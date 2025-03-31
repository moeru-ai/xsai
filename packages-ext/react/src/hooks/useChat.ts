import type { UIMessage } from '@xsai-ext/shared-ui'
import type { Message } from '@xsai/shared-chat'
import type { StreamTextOptions } from '@xsai/stream-text'

import { accumulateDataChunk, dateNumberIDGenerate, extractUIMessageParts } from '@xsai-ext/shared-ui'
import { streamText } from '@xsai/stream-text'
import { useCallback, useMemo, useRef, useState } from 'react'

import { useStableValue } from './utils/use-stable-state'

declare global {
  interface ReadableStream<R = any> {
    // eslint-disable-next-line ts/method-signature-style
    [Symbol.asyncIterator](): AsyncIterableIterator<R>
  }
}

/**
 * you can either use { content: string } or { parts: [{ text:'', type:'text' }] }
 */
export type InputMessage = Omit<Message, 'id' | 'role'>

export type UseChatOptions = Omit<StreamTextOptions, 'messages' | 'onChunk' | 'onFinish'> & {
  id?: string
  idGenerator?: () => string
  initialMessages?: Message[]
  onFinish?: (message: Message) => Promise<void> | void
  preventDefault?: boolean
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
    preventDefault = false,
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

  const [UIMessages, setUIMessages] = useState<UIMessage[]>(initialUIMessages)
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
      userMessage.parts = extractUIMessageParts(userMessage)

      setUIMessages(messages => [...messages, userMessage])

      setStatus('loading')
      setError(null)

      try {
        abortControllerRef.current = new AbortController()

        const { dataChunkStream } = await streamText({
          ...streamTextOptions as StreamTextOptions,
          messages: [...UIMessages, userMessage],
          onDataChunk: (chunk) => {
            if (!lastUIMessage.current) {
              lastUIMessage.current = {
                id: idGenerator(),
                parts: [],
                role: 'assistant',
              }
            }
            accumulateDataChunk(lastUIMessage.current, chunk)

            const lastMessage = lastUIMessage.current
            // maybe we should throttle this
            setUIMessages(messages => [
              ...messages.at(-1)?.role === 'assistant' ? messages.slice(0, messages.length - 1) : messages,
              lastMessage,
            ])
          },
          onFinish: () => {
            setStatus('idle')
            // eslint-disable-next-line ts/no-floating-promises
            onFinish?.(UIMessages[UIMessages.length - 1])
            lastUIMessage.current = null
          },
          signal: abortControllerRef.current.signal,
        })

        await dataChunkStream.pipeTo(new WritableStream({ write() {} }))
      }
      catch (error) {
        setStatus('error')
        const actualError = error instanceof Error ? error : new Error(String(error))
        setError(actualError)
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
      UIMessages,
      status,
    ],
  )

  const handleSubmit = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    preventDefault && e?.preventDefault?.()

    if (!input) {
      return
    }

    // TODO: support more input types
    await submitMessage({
      content: [
        {
          text: input,
          type: 'text',
        },
      ],
    })

    setInput('')
  }, [
    preventDefault,
    input,
    submitMessage,
  ])

  const stop = useCallback(() => {
    if (!(abortControllerRef.current))
      return
    abortControllerRef.current.abort()
    setStatus('idle')
  }, [])

  const reload = useCallback(() => {

  }, [chatID, UIMessages, submitMessage])

  const reset = useCallback(() => {
    stop()
    setUIMessages(initialUIMessages)
    setInput('')
    setError(null)
    setStatus('idle')
  }, [stop, initialUIMessages])

  return {
    error,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.currentTarget.value)
    },
    handleSubmit,
    input,
    messages: UIMessages,
    reload,
    reset,
    setInput,
    status,
    stop,
    submitMessage,
  }
}

export default useChat
