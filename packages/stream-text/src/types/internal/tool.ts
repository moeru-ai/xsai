export interface Tool {
  execute: (input: unknown) => Promise<string> | string
  function: {
    description?: string
    name: string
    parameters: Record<string, unknown>
    strict?: boolean
  }
  type: 'function'
}
