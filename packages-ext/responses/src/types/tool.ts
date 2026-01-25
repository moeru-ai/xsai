/** @see {@link https://www.openresponses.org/reference#object-AllowedToolsParam} */
export interface AllowedTools {
  /** How to select a tool from the allowed set. */
  mode?: ToolChoiceValue
  /** The list of tools that are permitted for this request. */
  tools: SpecificFunction[]
  type: 'allowed_tools'
}

/** @see {@link https://www.openresponses.org/reference#object-FunctionToolParam} */
export interface FunctionTool {
  description?: string
  name: string
  parameters?: Record<string, unknown>
  strict?: boolean
  type: 'function'
}

/** @see {@link https://www.openresponses.org/reference#object-SpecificFunctionParam} */
export interface SpecificFunction extends Pick<FunctionTool, 'name' | 'type'> {}

export type ToolChoice = AllowedTools | SpecificFunction | ToolChoiceValue

/** @see {@link https://www.openresponses.org/reference#enum-ToolChoiceValueEnum} */
export type ToolChoiceValue = 'auto' | 'none' | 'required'
