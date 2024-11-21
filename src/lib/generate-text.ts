import type { Message } from './types/message'
import type { GenerationModel } from './types/model'

import { clean } from '../utils/clean'
import { base, type CommonRequestOptions } from './common'

export interface GenerateTextOptions extends CommonRequestOptions {
  messages?: Message[]
  model: GenerationModel
  /** @default `completions` */
  path?: 'completions' | ({} & string)
  prompt: string
}

export interface GenerateTextResponse {
  choices: {
    finish_reason: 'content_filter' | 'length' | 'stop'
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
  request: Request
  response: Response
  text: string
  usage: GenerateTextResponseUsage
}

export const generateText = async (options: GenerateTextOptions): Promise<GenerateTextResult> => {
  const request = new Request(new URL(options.path ?? 'completions', options.base ?? base), {
    body: JSON.stringify(clean({
      stream: false,
      ...options,
      base: undefined,
      path: undefined,
    })),
    method: 'POST',
  })

  const response = await fetch(request)

  const json = await response.json() as GenerateTextResponse

  return {
    request,
    response,
    text: json.choices[0].text,
    usage: json.usage,
  }
}
