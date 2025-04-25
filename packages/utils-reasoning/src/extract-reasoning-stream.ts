import type { ExtractReasoningOptions } from './extract-reasoning'

export interface ExtractReasoningStreamOptions extends ExtractReasoningOptions {}

export interface ExtractReasoningStreamResult {
  reasoningStream: ReadableStream<string>
  textStream: ReadableStream<string>
}

export const extractReasoningStream = (stream: ReadableStream<string>, options: ExtractReasoningOptions = {
  tagName: 'think',
}): ExtractReasoningStreamResult => {
  const tagName = options.tagName
  const startTag = `<${tagName}>`
  const endTag = `</${tagName}>`
  const startWithReasoning = options.startWithReasoning ?? false

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
  let state: 'initial' | 'reasoning' | 'text' = 'initial'
  let initialChecked = false

  // process the input stream
  const reader = stream.getReader()

  const endTagPrefixStrings = Array.from({ length: endTag.length }, (_, i) => endTag.substring(0, i + 1))

  const processStream = () => {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    reader.read().then(({ done, value }) => {
      if (done) {
        // Handle any remaining buffer when stream ends
        if (buffer.length > 0) {
          if (state === 'reasoning') {
            reasoningStreamController?.enqueue(buffer)
          }
          else {
            textStreamController?.enqueue(buffer)
          }
        }

        // Close both streams
        reasoningStreamController?.close()
        textStreamController?.close()
        return
      }

      buffer += value

      while (buffer.length > 0) {
        // initial state: determine if we're starting with reasoning or text
        if (state === 'initial') {
          if (!initialChecked) {
            if (startWithReasoning) {
              // If startWithReasoning is true, we assume everything before endTag is reasoning
              state = 'reasoning'
              initialChecked = true
              // Continue to reasoning state processing
            }
            else {
              // Trim non-regular characters until we find content
              const trimmedBuffer = buffer.trimStart()

              if (trimmedBuffer.length === 0) {
                // Only non-regular characters so far, wait for more data
                break
              }

              // Check if there's a start tag in the trimmed buffer
              const hasStartTag = trimmedBuffer.includes(startTag)

              if (!hasStartTag && trimmedBuffer.length >= startTag.length) {
                // No start tag found and buffer is large enough
                // This means there's no reasoning block, so treat everything as text
                state = 'text'
                initialChecked = true
                // Continue to text state processing (will output the entire buffer)
              }
              else if (hasStartTag) {
                // We need to find the first occurrence of the start tag
                const startTagIndex = trimmedBuffer.indexOf(startTag)
                if (startTagIndex !== -1) {
                  // text after the start tag is reasoning
                  buffer = trimmedBuffer.substring(startTagIndex + startTag.length)
                  state = 'reasoning'
                  initialChecked = true
                }
                else {
                  // should not happen
                }
              }
              else {
                // No start tag yet, but buffer isn't large enough to decide
                // Wait for more data
                break
              }
            }
          }
          else {
            // Already checked initial state, should not happen
            state = 'text' // Default to text mode
          }
        }

        // Process reasoning state
        if (state === 'reasoning') {
          if (buffer.includes(endTag)) {
            // found the end tag, extract reasoning
            const start = buffer.indexOf(endTag)
            start > 0 && reasoningStreamController?.enqueue(buffer.substring(0, start))
            buffer.length > endTag.length && textStreamController?.enqueue(buffer.substring(start + endTag.length))

            buffer = ''
            state = 'text' // Switch to text state
          }
          else {
            const length = endTagPrefixStrings.findIndex(s => buffer.endsWith(s)) + 1 // Check if the buffer ends with any prefix of the end tag

            if (length === 0) {
              reasoningStreamController?.enqueue(buffer)
              buffer = ''
            }
            else {
              const nextStartIndex = buffer.length - length
              nextStartIndex > 0 && reasoningStreamController?.enqueue(buffer.substring(0, nextStartIndex))
              buffer = buffer.substring(nextStartIndex)
            }
          }
          break
        }

        // process text state
        if (state === 'text') {
          // in text state, all content is text
          textStreamController?.enqueue(buffer)
          buffer = ''
          break
        }
      }

      // continue processing the stream
      processStream()
    }).catch((error) => {
      // handle errors
      reasoningStreamController?.error(error)
      textStreamController?.error(error)
    })
  }

  // start processing the stream
  processStream()

  return {
    reasoningStream,
    textStream,
  }
}
