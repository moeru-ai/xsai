export type Message = AssistantMessage | SystemMessage | ToolMessage | UserMessage

export interface CommonMessage<T extends string> {
  content: string
  name?: string
  role: T
}

export interface SystemMessage extends CommonMessage<'system'> {}

export interface UserMessage extends CommonMessage<'user'> {}

export interface AssistantMessage extends CommonMessage<'assistant'> {
  refusal?: string
  tool_calls?: {
    function: {
      arguments: string
      name: string
    }
    id: string
    type: 'function'
  }[]
  // TODO: audio
}

export interface ToolMessage extends Omit<CommonMessage<'tool'>, 'name'> {
  tool_call_id: string
}
