import type { FinishReason, Message, ToolCall, Usage } from '@xsai/shared-chat'

// eslint-disable-next-line @masknet/string-no-data-url
export const chunkHeaderPrefix = 'data:'

export interface Step {
  choices: Step.Choice[]
  messages: Message[]
  usage?: Usage
}

// TODO: improve chunk type
export interface StreamTextChunkResult {
  choices: {
    delta: {
      content?: string
      refusal?: string
      role: 'assistant'
      tool_calls?: ToolCall[]
    }
    finish_reason?: FinishReason
    index: number
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion.chunk'
  system_fingerprint: string
  usage?: Usage
}

// eslint-disable-next-line ts/no-namespace
export namespace Step {
  export interface Choice {
    finish_reason?: FinishReason | null

    index: number

    // as known as `choice.delta`
    message: Choice.Message
  }

  // eslint-disable-next-line ts/no-namespace
  export namespace Choice {
    export interface Message {
      /**
       * The content of the message.
       * It can be a string or null.
       */
      content: null | string

      /**
       * The refusal message, if any.
       * It can be a string or null.
       */
      refusal: null | string

      /**
       * The role of the message sender.
       * It is always 'assistant'.
       */
      role: 'assistant'

      /**
       * An Set of tool calls associated with the message.
       */
      tool_calls?: { [id: string]: Message.ToolCall }
    }

    /**
     * Namespace containing message-related interfaces.
     */
    // eslint-disable-next-line ts/no-namespace
    export namespace Message {
      /**
       * Interface representing a tool call message.
       */
      export interface ToolCall {
        /**
         * Object containing function details.
         */
        function: ToolCall.Function

        /**
         * Unique identifier for the tool call.
         */
        id: string

        /**
         * Type of the message, which is always 'function' for tool calls.
         */
        type: 'function'
      }

      // eslint-disable-next-line ts/no-namespace
      export namespace ToolCall {
        export interface Function {

          /**
           * Arguments for the function.
           */
          arguments: string

          /**
           * Name of the function.
           */
          name: string

          /**
           *
           */
          parsed_arguments: Record<string, unknown>
        }
      }
    }
  }
}

export interface ChoiceState {
  calledToolCallIDs: Set<string>
  currentToolID: null | string
  endedToolCallIDs: Set<string>
  index: number
  toolCallErrors: { [id: string]: Error }
  toolCallResults: { [id: string]: string }
}
