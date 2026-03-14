import type { AnthropicStopReason, FinishReason } from '../types/finish-reason'

const stopReasonMap = new Map<string, FinishReason>([
  ['end_turn', 'stop'],
  ['max_tokens', 'length'],
  ['model_context_window_exceeded', 'length'],
  ['pause_turn', 'stop'],
  ['refusal', 'content_filter'],
  ['stop_sequence', 'stop'],
  ['tool_use', 'tool-calls'],
])

// eslint-disable-next-line sonarjs/function-return-type
export const mapStopReason = (stopReason?: AnthropicStopReason | null): FinishReason => {
  if (stopReason == null)
    return 'other'

  return stopReasonMap.get(stopReason) ?? 'other'
}
