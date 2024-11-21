import type { FinishReason } from './types/finish-reason'
import type { Message } from './types/message'
import type { GenerationModel } from './types/model'

import { clean } from '../utils/clean'
import { base, type CommonRequestOptions } from './common'

export interface GenerateTextOptions extends CommonRequestOptions {
  [key: string]: unknown
  messages: Message[]
  model: GenerationModel
  /** @default `chat/completions` */
  path?: 'chat/completions' | ({} & string)
}

export interface GenerateTextResponse {
  choices: {
    finish_reason: FinishReason
    index: number
    message: Message
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion'
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
  const request = new Request(new URL(options.path ?? 'chat/completions', options.base ?? base), {
    body: JSON.stringify(clean({
      ...options,
      base: undefined,
      headers: undefined,
      path: undefined,
      stream: false,
    })),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: 'POST',
  })

  const response = await fetch(request)

  const json = await response.json() as GenerateTextResponse

  return {
    finishReason: json.choices[0].finish_reason,
    request,
    response,
    text: json.choices[0].message.content,
    usage: json.usage,
  }
}
