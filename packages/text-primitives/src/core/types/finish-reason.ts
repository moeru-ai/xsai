/** Why the model stopped generating, when the wire reports a reason. */
export type StopReason
  = | 'content-filter'
    | 'length'
    | 'refusal'
    | 'stop'
    | 'tool-calls'
    | (string & {})
