import type { JSONSchema7, LanguageModel, LanguageModelOptions } from '@xsai/text'

import type { DecisionAnswer, DecisionModel } from './model'

import { XSAIError } from '@xsai/shared'
import { collect } from '@xsai/text'

import { DecisionRefusalError } from './decide'
import { toText } from './utils'

export type ToDecisionModelOptions = Pick<LanguageModelOptions, 'maxOutputTokens' | 'providerOptions' | 'reasoningEffort' | 'temperature' | 'topP'>

export const toDecisionModel = (model: LanguageModel, options: ToDecisionModelOptions = {}): DecisionModel => async (modelOptions) => {
  const questions = Object.entries(modelOptions.questions)
  const properties = Object.fromEntries(questions.map(([id, question]): [string, JSONSchema7] => [id, question.type === 'choice'
    ? { enum: question.choices.map(choice => choice.value), type: 'string' }
    : { maximum: question.type === 'score' ? question.levels.length - 1 : 1, minimum: 0, type: 'number' }]))
  const result = await collect(await model({
    ...options,
    input: toText(modelOptions.input),
    instructions: `Answer every question using the supplied input. For choice questions, return the selected value. For score questions, return a numeric rating from 0 to levels.length - 1, allowing fractions. For boolean questions, estimate P(true) between 0 and 1. Return only the JSON object required by the output schema.\nQuestions:\n${JSON.stringify(modelOptions.questions)}`,
    outputFormat: { additionalProperties: false, properties, required: questions.map(([id]) => id), type: 'object' },
    signal: modelOptions.signal,
  }))
  if (result.reason === 'refusal' || (typeof result.message.content !== 'string' && result.message.content.some(part => part.type === 'refusal')))
    throw new DecisionRefusalError(questions.map(([id]) => id))
  if (result.status !== 'completed' || result.toolCalls.length > 0)
    throw new XSAIError('invalid-response', 'LanguageModel did not complete a structured decision output')

  const output = JSON.parse(result.text) as Record<string, number | string>
  return {
    answers: Object.fromEntries(questions.map(([id, question]): [string, DecisionAnswer] => [id, question.type === 'choice'
      ? { choice: output[id] as string, type: 'choice' }
      : question.type === 'score'
        ? { score: output[id] as number, type: 'score' }
        : { probability: output[id] as number, type: 'boolean' }])),
    usage: result.usage ?? {},
  }
}
