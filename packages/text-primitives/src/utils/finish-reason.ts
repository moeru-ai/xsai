import type { AssistantMessageContent, FinishReason } from '../core/types'

/**
 * Some wires report a plain stop on turns that emitted tool calls;
 * reconcile the finish reason with the assembled content.
 */
export const reconcileFinishReason = (
  content: readonly AssistantMessageContent[],
  reason: FinishReason,
): FinishReason =>
  reason === 'stop' && content.some(part => part.type === 'tool-call') ? 'tool-calls' : reason
