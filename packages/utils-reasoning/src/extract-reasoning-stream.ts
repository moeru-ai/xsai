import type { ExtractReasoningOptions } from './extract-reasoning'

import { getPartialMatchIndex } from './_get-partial-match-index'

export interface ExtractReasoningStreamResult {
  reasoningStream: ReadableStream<string>
  textStream: ReadableStream<string>
}

export const extractReasoningStream = (stream: ReadableStream<string>, options: ExtractReasoningOptions = {
  tagName: 'think',
}): ExtractReasoningStreamResult => {
  const startTag = `<${options.tagName}>`
  const endTag = `</${options.tagName}>`
  const separator = options.separator ?? '\n'

  let reasoningStreamController: ReadableStreamDefaultController<string>
  let textStreamController: ReadableStreamDefaultController<string>
  const reasoningStream = new ReadableStream<string>({
    start(controller) {
      reasoningStreamController = controller
    },
  })
  const textStream = new ReadableStream<string>({
    start(controller) {
      textStreamController = controller
    },
  })

  // state for the stream parsing
  let buffer = ''
  let isFirstTextMode = true
  let isFirstReasoningMode = true
  let isReasoning = options.startWithReasoning
  let switchBlock = false

  const enqueueStream = (chunk: string) => {
    if (chunk.length === 0) {
      return
    }
    const prefix = switchBlock
      // eslint-disable-next-line sonarjs/no-nested-conditional
      && (isReasoning ? !isFirstReasoningMode : !isFirstTextMode)
      ? separator
      : ''
    if (isReasoning) {
      reasoningStreamController?.enqueue(prefix + chunk)
      isFirstReasoningMode = false
    }
    else {
      textStreamController?.enqueue(prefix + chunk)
      isFirstTextMode = false
    }
    switchBlock = false
  }

  stream.pipeTo(
    new WritableStream({
      close() {
        if (buffer.length > 0) {
          if (isReasoning) {
            reasoningStreamController?.enqueue(buffer)
          }
          else {
            textStreamController?.enqueue(buffer)
          }
        }
        reasoningStreamController?.close()
        textStreamController?.close()
      },
      write(chunk) {
        buffer += chunk

        while (true) {
          const checkTag = isReasoning ? endTag : startTag
          const idx = getPartialMatchIndex(buffer, checkTag) // Check if the buffer contains the start or end tag

          // no boundary found, enqueue the current buffer
          if (idx === -1) {
            enqueueStream(buffer)
            buffer = ''
            break
          }

          // found a boundary, enqueue the text before the tag
          enqueueStream(buffer.slice(0, idx))

          const isFullMatch = idx + checkTag.length <= buffer.length
          if (isFullMatch) {
            isReasoning = !isReasoning
            buffer = buffer.slice(idx + checkTag.length)
            switchBlock = true
          }
          else {
            // partial match, keep the buffer for more data
            buffer = buffer.slice(idx)
            break
          }
        }
      },
    }),
  ).catch((error) => {
    // handle errors
    reasoningStreamController?.error(error)
    textStreamController?.error(error)
  })

  return {
    reasoningStream,
    textStream,
  }
}
