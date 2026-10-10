import type { HttpOptions } from '@xsai/shared'

import type { DecisionAnswer, DecisionModel, DecisionQuestion } from './model'

import { sendRequest } from '@xsai/shared'

import { toDecisionUsage, toText } from './utils'

declare module '@xsai/decide' {
  interface DecisionModelProviderOptions {
    systemone?: { images?: readonly (string | { base64: string, content_type: 'image/jpeg' | 'image/png' | 'image/webp' })[] }
  }
}

type SystemOneAnswer
  = | { choice: string, confidence: number, probabilities: Record<string, number>, type: 'choice' }
    | { confidence: number, probabilities: Record<string, number>, score: number, type: 'score' }
    | { noul: number, type: 'noul' }

interface SystemOneResponse {
  answers: Record<string, SystemOneAnswer>
  usage: { input_tokens: number, output_tokens: number }
}

export const systemone = (options: HttpOptions): DecisionModel => async (modelOptions) => {
  const response = await sendRequest({
    body: {
      images: modelOptions.providerOptions?.systemone?.images,
      model: options.model,
      questions: Object.fromEntries(Object.entries(modelOptions.questions).map(([id, question]) => [id, {
        criteria: question.type === 'choice'
          ? Object.fromEntries(question.choices.map(choice => [choice.value, choice.description ?? null]))
          : question.type === 'score'
            ? question.levels.map(level => level.description === undefined ? level.label : `${level.label}: ${toText(level.description)}`)
            : undefined,
        instructions: question.instructions,
        type: question.type === 'boolean' ? 'noul' : question.type,
      }])),
      state: modelOptions.input,
    },
    path: 'systemone',
    signal: modelOptions.signal,
  }, options)
  const json = await response.json() as SystemOneResponse
  return {
    answers: Object.fromEntries(Object.entries(json.answers).map(([id, answer]): [string, DecisionAnswer] => {
      if (answer.type === 'noul')
        return [id, { probability: answer.noul, type: 'boolean' }]
      if (answer.type === 'choice') {
        const question = modelOptions.questions[id] as Extract<DecisionQuestion, { type: 'choice' }>
        return [id, {
          choice: answer.choice,
          confidence: answer.confidence,
          probabilities: question.choices.map(choice => ({ probability: answer.probabilities[choice.value], value: choice.value })),
          type: 'choice',
        }]
      }
      return [id, { confidence: answer.confidence, probabilities: answer.probabilities, score: answer.score, type: 'score' }]
    })),
    usage: toDecisionUsage(json.usage),
  }
}
