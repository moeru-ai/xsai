export interface ToolCall {
  function: ToolCallFunction | ToolCallFunctionWithoutArguments | ToolCallFunctionWithoutName
  id: string
  type: 'function'
}

interface ToolCallFunction {
  arguments: string
  name: string
}

interface ToolCallFunctionWithoutArguments {
  arguments?: never
  name: string
}

interface ToolCallFunctionWithoutName {
  arguments: string
  name?: never
}
