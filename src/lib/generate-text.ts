import type { FinishReason } from './types/finish-reason'
import type { GenerationModel } from './types/model'

import { clean } from '../utils/clean'
import { base, type CommonRequestOptions } from './common'

export interface GenerateTextOptions extends CommonRequestOptions {
  [key: string]: unknown
  model: GenerationModel
  /** @default `completions` */
  path?: 'completions' | ({} & string)
  prompt: string
}

export interface GenerateTextResponse {
  choices: {
    finish_reason: FinishReason
    index: number
    text: string
  }[]
  created: number
  id: string
  model: string
  object: 'text_completion'
  system_fingerprint: string
  usage: GenerateTextResponseUsage
}

export interface GenerateTextResponseUsage {
  completion_tokens: number
  prompt_tokens: number
  total_tokens: number
}

export interface GenerateTextResult {
  finishReason: FinishReason
  request: Request
  response: Response
  text: string
  usage: GenerateTextResponseUsage
}

export const generateText = async (options: GenerateTextOptions): Promise<GenerateTextResult> => {
  const request = new Request(new URL(options.path ?? 'completions', options.base ?? base), {
    body: JSON.stringify(clean({
      ...options,
      base: undefined,
      headers: undefined,
      path: undefined,
      stream: false,
    })),
    headers: options.headers,
    method: 'POST',
  })

  const response = await fetch(request)

  const json = await response.json() as GenerateTextResponse

  return {
    finishReason: json.choices[0].finish_reason,
    request,
    response,
    text: json.choices[0].text,
    usage: json.usage,
  }
}
