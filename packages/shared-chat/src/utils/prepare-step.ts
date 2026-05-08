import type { CompletionStep, Message, PrepareStep, PrepareStepResult, ToolChoice } from '../types'

export interface ResolvePrepareStepOptions<TInput = Message[], TToolChoice = ToolChoice> {
  input: TInput
  model: string
  prepareStep?: PrepareStep<TInput, TToolChoice>
  stepNumber: number
  steps: CompletionStep[]
  toolChoice?: TToolChoice
}

export type ResolvePrepareStepResult<TInput = Message[], TToolChoice = ToolChoice> = Pick<PrepareStepResult<TInput, TToolChoice>, 'toolChoice'> & Required<Omit<PrepareStepResult<TInput, TToolChoice>, 'toolChoice'>>

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
