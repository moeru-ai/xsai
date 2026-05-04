import type { CompletionToolCall, CompletionToolResult, FinishReason, Usage } from '@xsai/shared-chat'

export type StreamTextEvent
  = | (CompletionToolCall & { type: 'tool-call' })
    | (CompletionToolResult & { type: 'tool-result' })
    | { argsTextDelta: string, toolCallId: string, toolName: string, type: 'tool-call-delta' }
    | { error: unknown, type: 'error' }
    | { finishReason: FinishReason, type: 'finish', usage?: Usage }
    | { text: string, type: 'reasoning-delta' }
    | { text: string, type: 'text-delta' }
    | { toolCallId: string, toolName: string, type: 'tool-call-streaming-start' }
