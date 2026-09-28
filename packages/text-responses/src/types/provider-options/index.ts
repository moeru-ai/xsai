export interface ResponsesProviderOptions {
  include?: readonly string[]
  tools?: readonly ResponsesProviderTool[]
}

export interface ResponsesProviderTool {
  [key: string]: unknown
  type: string
}
