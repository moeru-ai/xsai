import type { ModelOptions, Provider } from './types'

import { chat } from '@xsai/text-chat'
import { messages } from '@xsai/text-messages'
import { responses } from '@xsai/text-responses'

import { connect } from './utils/connect'

/** Prefers Responses, then Messages, then Chat Completions. */
export const languageModel = <TModel extends string>(
  provider: Provider<TModel>,
  model: (string & {}) | TModel,
  options: ModelOptions<'chat' | 'messages' | 'responses'> = {},
): ReturnType<typeof chat> => connect({ chat, messages, responses }, ['responses', 'messages', 'chat'], provider, model, options)
