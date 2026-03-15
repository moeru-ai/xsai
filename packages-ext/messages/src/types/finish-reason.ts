export type AnthropicStopReason = 'end_turn' | 'max_tokens' | 'model_context_window_exceeded' | 'pause_turn' | 'refusal' | 'stop_sequence' | 'tool_use' | (string & {})

export type FinishReason = 'content_filter' | 'length' | 'other' | 'stop' | 'tool-calls' | (string & {})
