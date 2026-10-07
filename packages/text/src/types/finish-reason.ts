export type FinishReason
  = | 'content-filter'
    | 'length'
    | 'refusal'
    | 'stop'
    | 'tool-calls'
    | (string & {})
