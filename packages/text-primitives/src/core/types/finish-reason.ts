export type FinishReason
  = | 'content-filter'
    | 'error'
    | 'max-output-tokens'
    | 'other'
    | 'refusal'
    | 'stop'
    | 'tool-calls'
    | (string & {})
