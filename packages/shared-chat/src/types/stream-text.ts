import type { FinishReason } from './finish-reason'
import type { ToolCall, ToolMessagePart } from './message'
import type { Usage } from './usage'

export type StreamTextDataChunk =
  | { error: unknown, type: 'error' }
  | { error?: unknown, id: string, result?: string | ToolMessagePart[], type: 'tool-call-result' }
  | { finishReason?: FinishReason, type: 'finish', usage?: Usage }
  | { reasoning: string, type: 'reasoning' }
  | { refusal: string, type: 'refusal' }
  | { text: string, type: 'text-delta' }
  | { toolCall: ToolCall, type: 'tool-call' }
  | { toolCall: ToolCall, type: 'tool-call-delta' }
