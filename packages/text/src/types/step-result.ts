import type { ToolCallPart, ToolResultPart } from './content'
import type { StepEndDoneEvent } from './text-event'

export interface StepResult extends Omit<StepEndDoneEvent, 'error' | 'type'> {
  text: string
  toolCalls: ToolCallPart[]
  toolResults: ToolResultPart[]
}
