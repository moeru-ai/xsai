import type { CompletionStep, Message, PrepareStep, ToolChoice } from '../types'

export interface ResolvePrepareStepOptions<TInput = Message[], TToolChoice = ToolChoice> {
  input: TInput
  model: string
  prepareStep?: PrepareStep<TInput, TToolChoice>
  stepNumber: number
  steps: CompletionStep[]
  toolChoice?: TToolChoice
}

export interface ResolvePrepareStepResult<TInput = Message[], TToolChoice = ToolChoice> {
  input: TInput
  model: string
  toolChoice?: TToolChoice
}

export const resolvePrepareStep = async <TInput, TToolChoice>({ input, model, prepareStep, stepNumber, steps, toolChoice }: ResolvePrepareStepOptions<TInput, TToolChoice>): Promise<ResolvePrepareStepResult<TInput, TToolChoice>> => {
  const prepared = prepareStep == null
    ? undefined
    : await prepareStep({
        input: structuredClone(input),
        model,
        stepNumber,
        steps: structuredClone(steps),
      })

  return {
    input: prepared?.input != null ? structuredClone(prepared.input) : input,
    model: prepared?.model ?? model,
    toolChoice: prepared?.toolChoice ?? toolChoice,
  }
}
