import type { ExtractReasoningOptions } from './extract-reasoning'

export interface ExtractReasoningStreamOptions extends ExtractReasoningOptions {}

export interface ExtractReasoningStreamResult {
  reasoningStream: ReadableStream<string>
  textStream: ReadableStream<string>
}

export const extractReasoningStream = (stream: ReadableStream<string>, _options: ExtractReasoningOptions = {
  tagName: 'think',
}) => {
  const [reasoningStream, textStream] = stream.tee()

  return {
    reasoningStream,
    textStream,
  }
}
