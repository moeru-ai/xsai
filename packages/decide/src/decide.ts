import type { DecideResult, DecisionModel, DecisionModelOptions, DecisionQuestions } from './model'

import { XSAIError } from '@xsai/shared'

declare module '@xsai/shared' {
  interface XSAIErrorCauseMap {
    'decision-refusal': undefined
  }
}

export class DecisionRefusalError extends XSAIError<'decision-refusal'> {
  readonly questionIds: readonly string[]

  constructor(questionIds: readonly string[]) {
    super('decision-refusal', `Model refused questions: ${JSON.stringify(questionIds)}`)
    this.questionIds = questionIds
  }
}

export const decide = async <const Q extends DecisionQuestions>(
  model: DecisionModel,
  options: Omit<DecisionModelOptions, 'questions'> & { questions: Q },
): Promise<DecideResult<Q>> => {
  const result = await model(options)
  const refused = Object.keys(options.questions).filter(id => result.answers[id]?.type === 'refusal')
  if (refused.length > 0)
    throw new DecisionRefusalError(refused)
  return result as DecideResult<Q>
}
