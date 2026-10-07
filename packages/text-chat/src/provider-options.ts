export interface ChatProviderOptions {
  frequencyPenalty?: number
  parallelToolCalls?: boolean
  presencePenalty?: number
  seed?: number
  stopSequences?: readonly string[]
  topK?: number
}
