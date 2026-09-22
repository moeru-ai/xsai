import type { AssistantMessage, TextPart, ToolCallPart } from './types'
import type { StepResult } from './types/step-result'
import type { StepEndDoneEvent } from './types/text-event'

const getText = (message: AssistantMessage): string =>
  typeof message.content === 'string'
    ? message.content
    : message.content
        .filter((part): part is TextPart => part.type === 'text')
        .map(part => part.text)
        .join('')

const getToolCalls = (message: AssistantMessage): ToolCallPart[] =>
  typeof message.content === 'string'
    ? []
    : message.content.filter((part): part is ToolCallPart => part.type === 'tool-call')

export const toStepResult = (event: StepEndDoneEvent): StepResult => {
  const { type, ...result } = event
  void type

  return {
    ...result,
    text: getText(event.message),
    toolCalls: getToolCalls(event.message),
    toolResults: [],
  }
}
