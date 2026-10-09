import type { HttpOptions } from '@xsai/shared'

import type { DecisionAnswer, DecisionModel, DecisionRefusal } from './model'

import { sendRequest } from '@xsai/shared'

import { toDecisionUsage, toText } from './utils'

export type OpenAIDecisionsInput = readonly {
  content: readonly (
    | { detail?: 'auto' | 'high' | 'low' | 'original' | null, image_url: string, type: 'input_image' }
    | { text: string, type: 'input_text' }
  )[] | string
  role: 'user'
  type?: 'message'
}[] | string

declare module '@xsai/decide' {
  interface DecisionModelProviderOptions {
    decisions?: { overrideInput?: OpenAIDecisionsInput }
  }
}

type OpenAIDecisionsAnswer
  = | (DecisionRefusal & { name: null | string })
    | { choice: string, confidence?: null | number, name: string, probabilities: { probability: number, value: string }[], type: 'choice' }
    | { confidence?: null | number, name: string, probabilities: { probability: number, value: number }[], score: number, type: 'score' }
    | { name: string, probability: number, type: 'predicate' }

interface OpenAIDecisionsResponse {
  answers: OpenAIDecisionsAnswer[]
  usage: { input_tokens?: null | number, output_tokens?: null | number, total_tokens?: null | number }
}

export const decisions = (options: HttpOptions): DecisionModel => async (modelOptions) => {
  const response = await sendRequest({
    body: {
      input: modelOptions.providerOptions?.decisions?.overrideInput ?? toText(modelOptions.input),
      model: options.model,
      questions: Object.entries(modelOptions.questions).map(([name, question]) => ({
        choices: question.type === 'choice' ? question.choices : undefined,
        instructions: toText(question.instructions),
        levels: question.type === 'score'
          ? question.levels.map(level => ({
              description: level.description === undefined ? undefined : toText(level.description),
              label: level.label,
            }))
          : undefined,
        name,
        type: question.type === 'boolean' ? 'predicate' : question.type,
      })),
    },
    path: 'decisions',
    signal: modelOptions.signal,
  }, options)
  const json = await response.json() as OpenAIDecisionsResponse
  return {
    answers: Object.fromEntries(json.answers.flatMap((answer): [string, DecisionAnswer | DecisionRefusal][] => {
      if (answer.type === 'refusal')
        return (answer.name === null ? Object.keys(modelOptions.questions) : [answer.name]).map(id => [id, { type: 'refusal' }])
      if (answer.type === 'predicate')
        return [[answer.name, { probability: answer.probability, type: 'boolean' }]]
      if (answer.type === 'score') {
        return [[answer.name, {
          confidence: answer.confidence ?? undefined,
          probabilities: Object.fromEntries(answer.probabilities.map(entry => [entry.value, entry.probability])),
          score: answer.score,
          type: 'score',
        }]]
      }
      return [[answer.name, { choice: answer.choice, confidence: answer.confidence ?? undefined, probabilities: answer.probabilities, type: 'choice' }]]
    })),
    usage: toDecisionUsage(json.usage),
  }
}
