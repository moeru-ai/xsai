import type { Input } from './input'
import type { FunctionTool, ToolChoice } from './tool'

/** @see {@link https://www.openresponses.org/reference#body} */
export interface OpenResponsesOptions {
  /** TODO: Whether to run the request in the background and return immediately. */
  background?: boolean
  /** Penalizes new tokens based on their frequency in the text so far. */
  frequencyPenalty?: number
  include?: ('message.output_text.logprobs' | 'reasoning.encrypted_content' | string & {})[]
  /** Context to provide to the model for the scope of this request. May either be a string or an array of input items. If a string is provided, it is interpreted as a user message. */
  input: Input[] | string
  /** Additional instructions to guide the model for this request. */
  instructions?: string
  /** The maximum number of tokens the model may generate for this response. */
  maxOutputTokens?: number
  /** The maximum number of tool calls the model may make while generating the response. */
  maxToolCalls?: number
  /** Set of 16 key-value pairs that can be attached to an object. */
  metadata?: Record<string, string>
  /** The model to use for this request, e.g. 'gpt-5.2'. */
  model: string
  /** TODO: Whether the model may call multiple tools in parallel. */
  parallelToolCalls?: boolean
  /** Penalizes new tokens based on whether they appear in the text so far. */
  presencePenalty?: number
  /** The ID of the response to use as the prior turn for this request. */
  previousResponseId?: string
  /** A key to use when reading from or writing to the prompt cache. */
  promptCacheKey?: string
  /** Configuration options for reasoning behavior. */
  reasoning?: {
    /** Controls the level of reasoning effort the model should apply. Higher effort may increase latency and cost. */
    effort?: 'high' | 'low' | 'medium' | 'none' | 'xhigh'
    /** Controls whether the response includes a reasoning summary. */
    summary?: 'auto' | 'concise' | 'detailed'
  }
  /** A stable identifier used for safety monitoring and abuse detection. */
  safetyIdentifier?: string
  /** The service tier to use for this request. */
  serviceTier?: 'auto' | 'default' | 'flex' | 'priority'
  /** Whether to store the response so it can be retrieved later. */
  store?: boolean
  /** TODO: Whether to stream response events as server-sent events. */
  stream?: boolean
  /** Options that control streamed response behavior. */
  streamOptions?: {
    /** Whether to obfuscate sensitive information in streamed output. Defaults to `true`. */
    include_obfuscation: boolean
  }
  /** Sampling temperature to use, between 0 and 2. Higher values make the output more random. */
  temperature?: number
  /** TODO: Configuration options for text output. */
  text?: unknown
  toolChoice?: ToolChoice
  /** A list of tools that the model may call while generating the response. */
  tools?: FunctionTool[]
  /** The number of most likely tokens to return at each position, along with their log probabilities. */
  topLogprobs?: number
  /** Nucleus sampling parameter, between 0 and 1. The model considers only the tokens with the top cumulative probability. */
  topP?: number
  /** Controls how the service truncates the input when it exceeds the model context window. */
  truncation?: 'auto' | 'disabled'
}
