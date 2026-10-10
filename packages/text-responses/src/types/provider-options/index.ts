export interface ResponsesProviderOptions {
  frequencyPenalty?: number
  include?: readonly string[]
  parallelToolCalls?: boolean
  presencePenalty?: number
  /** @default `false` */
  store?: boolean
  tools?: readonly ResponsesProviderTool[]
}

export interface ResponsesProviderTool {
  [key: string]: unknown
  type: string
}
