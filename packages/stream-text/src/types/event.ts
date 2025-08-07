import type { CompletionToolCall, CompletionToolResult, FinishReason, Usage } from '@xsai/shared-chat'

// TODO: source, file, tool-error
export type StreamTextEvent
  = | (CompletionToolCall & { type: 'tool-call' })
    | (CompletionToolResult & { type: 'tool-result' })
    // TODO: tool-call-delta => tool-input-delta
    | { argsTextDelta: string, toolCallId: string, toolName: string, type: 'tool-call-delta' }
    | { error: unknown, type: 'error' }
    | { finishReason: FinishReason, type: 'finish', usage?: Usage }
    | { text: string, type: 'reasoning-delta' }
    | { text: string, type: 'text-delta' }
    | { toolCallId: string, toolName: string, type: 'tool-call-streaming-start' }
