export type ToolChoice = AllowedTools | ToolChoiceMode | ToolChoiceTool

interface AllowedTools {
  mode: 'auto' | 'required'
  tools: ToolChoiceTool[]
  type: 'allowed_tools'
}

type ToolChoiceMode = 'auto' | 'none' | 'required'

interface ToolChoiceTool {
  function: {
    name: string
  }
  type: 'function'
}
