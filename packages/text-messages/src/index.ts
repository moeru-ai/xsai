import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text'

import type { MessagesPartMetadata } from './types/provider-metadata'
import type { MessagesProviderOptions } from './types/provider-options'

import { requestURL, XSAIError } from '@xsai/shared'
import { wireRequest } from '@xsai/text/internal'

import { mergeTools, MessagesEventStream, normalizeFormat, normalizeInput, normalizeToolChoice } from './utils'

export type * from './types/provider-metadata'
export type * from './types/provider-options'

declare module '@xsai/text' {
  interface LanguageModelProviderOptions {
    messages?: MessagesProviderOptions
  }

  interface PartProviderMetadata {
    messages?: MessagesPartMetadata
  }
}

const ANTHROPIC_VERSION = '2023-06-01'

export const messages = (options: HttpOptions): LanguageModel => async (modelOptions) => {
  const source = requestURL('messages', options.baseURL).toString()
  const { messages: inputMessages, system } = normalizeInput(modelOptions, source)
  const maxTokens = modelOptions.maxOutputTokens
  const outputFormat = normalizeFormat(modelOptions.outputFormat)
  const providerOptions = modelOptions.providerOptions?.messages

  if (typeof maxTokens !== 'number')
    throw new XSAIError('invalid-input', 'maxOutputTokens is required for the Messages API')

  return wireRequest({
    body: {
      cache_control: providerOptions?.cacheControl,
      max_tokens: maxTokens,
      mcp_servers: providerOptions?.mcpServers,
      messages: inputMessages,
      model: options.model,
      output_config: modelOptions.reasoningEffort == null && outputFormat == null
        ? undefined
        : { effort: modelOptions.reasoningEffort, format: outputFormat },
      stop_sequences: providerOptions?.stopSequences,
      stream: true,
      system,
      temperature: modelOptions.temperature,
      thinking: providerOptions?.thinking,
      tool_choice: normalizeToolChoice(modelOptions.toolChoice),
      tools: mergeTools(providerOptions?.tools, modelOptions.tools),
      top_p: modelOptions.topP,
    },
    headers: {
      ...options.headers,
      'anthropic-beta': providerOptions?.betas !== undefined && providerOptions.betas.length > 0
        ? providerOptions.betas.join(',')
        : options.headers?.['anthropic-beta'],
      'anthropic-version': ANTHROPIC_VERSION,
      'Content-Type': 'application/json',
      'x-api-key': options.apiKey ?? options.headers?.['x-api-key'],
    },
    path: source,
  }, options, modelOptions, new MessagesEventStream(source, modelOptions.includeRawEvents))
}
