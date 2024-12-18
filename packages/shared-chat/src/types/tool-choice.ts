export type ToolChoice = 'auto' | 'none' | 'required' | {
  function: { name: string }
  type: 'function'
}
