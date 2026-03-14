export interface DeltaUsage {
  cache_creation_input_tokens?: null | number
  cache_read_input_tokens?: null | number
  input_tokens?: null | number
  output_tokens: number
}

export interface Usage {
  cache_creation_input_tokens?: number
  cache_read_input_tokens?: number
  input_tokens: number
  output_tokens: number
}
