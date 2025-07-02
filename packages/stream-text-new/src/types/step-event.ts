import type { FinishReason, Usage } from '@xsai/shared-chat'

// TODO: reasoning, reasoning-signature, redacted-reasoning, source, file, step-start, step-finish
export type StreamTextStepEvent =
  | { args: unknown, result: unknown, toolCallId: string, toolName: string, type: 'tool-result' }
  | { args: unknown, toolCallId: string, toolName: string, type: 'tool-call' }
  | { argsTextDelta: string, toolCallId: string, toolName: string, type: 'tool-call-delta' }
  // | { refusal: string, type: 'refusal' }
  | { error: unknown, type: 'error' }
  | { finishReason: FinishReason, type: 'finish', usage?: Usage }
  | { text: string, type: 'text-delta' }
  | { toolCallId: string, toolName: string, type: 'tool-call-streaming-start' }
