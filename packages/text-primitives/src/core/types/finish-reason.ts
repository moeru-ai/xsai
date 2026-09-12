export type FinishReason
  = | 'content-filter'
    | 'error'
    | 'max-output-tokens'
    | 'other'
    | 'stop'
    | 'tool-calls'
    | (string & {})
