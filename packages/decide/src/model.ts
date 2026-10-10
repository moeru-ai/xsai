import type { Promisable } from '@xsai/shared'

export interface DecideResult<Q extends DecisionQuestions> extends Omit<DecisionModelResult, 'answers'> {
  answers: { readonly [K in keyof Q]: DecisionAnswerFor<Q[K]> }
}

export type DecisionAnswer = DecisionBooleanAnswer | DecisionChoiceAnswer | DecisionScoreAnswer

export type DecisionAnswerFor<Q extends DecisionQuestion>
  = Q extends { type: 'choice' }
    ? DecisionChoiceAnswer<Q['choices'][number]['value']>
    : Q extends { type: 'score' }
      ? DecisionScoreAnswer
      : DecisionBooleanAnswer

export interface DecisionBooleanAnswer {
  /** The probability of true. */
  probability: number
  type: 'boolean'
}

export interface DecisionChoice {
  description?: string
  value: string
}

export interface DecisionChoiceAnswer<V extends string = string> {
  choice: V
  confidence?: number
  probabilities?: readonly { probability: number, value: V }[]
  type: 'choice'
}

export type DecisionContent = Record<string, unknown> | string

export type DecisionModel = (options: DecisionModelOptions) => Promisable<DecisionModelResult>

export interface DecisionModelOptions {
  input: DecisionContent
  providerOptions?: DecisionModelProviderOptions
  questions: DecisionQuestions
  signal?: AbortSignal
}

export interface DecisionModelProviderOptions {}

export interface DecisionModelResult {
  answers: Readonly<Record<string, DecisionAnswer | DecisionRefusal>>
  usage: DecisionUsage
}

export type DecisionQuestion
  = | {
    readonly choices: readonly DecisionChoice[]
    readonly instructions: DecisionContent
    readonly type: 'choice'
  }
  | {
    readonly instructions: DecisionContent
    readonly levels: readonly DecisionScoreLevel[]
    readonly type: 'score'
  }
  | {
    readonly instructions: DecisionContent
    readonly type: 'boolean'
  }

export type DecisionQuestions = Readonly<Record<string, DecisionQuestion>>

export interface DecisionRefusal {
  type: 'refusal'
}

export interface DecisionScoreAnswer {
  confidence?: number
  probabilities?: Readonly<Record<string, number>>
  score: number
  type: 'score'
}

export interface DecisionScoreLevel {
  readonly description?: DecisionContent
  readonly label: string
}

export interface DecisionUsage {
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
}
