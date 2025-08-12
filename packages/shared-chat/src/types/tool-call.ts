export interface ToolCall {
  function: {
    arguments: string
    name: string
  }
  id: string
  type: 'function'
}
