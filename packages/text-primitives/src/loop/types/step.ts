import type { CollectResult, ToolCallPart, ToolResultPart } from '../../core'

export interface StepResult extends CollectResult {
  toolCalls: ToolCallPart[]
  toolResults: ToolResultPart[]
}
