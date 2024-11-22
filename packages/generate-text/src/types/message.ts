export interface Message {
  content: string
  role: 'assistant' | 'system' | 'tool' | 'user' | ({} & string)
  // TODO: FIXME: new type ToolMessage
  tool_call_id?: string
  tool_calls?: {
    function: {
      arguments: string
      name: string
    }
    id: string
    type: 'function'
  }
}
