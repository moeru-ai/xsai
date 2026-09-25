import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import type { MessagesPartMetadata } from './types/provider-metadata'
import type { MessagesProviderOptions } from './types/provider-options'

import { XSAIError } from '@xsai/shared'
import { wireRequest } from '@xsai/text-primitives/internal'

import { mergeTools, MessagesEventStream, normalizeFormat, normalizeInput, normalizeToolChoice } from './utils'

export type * from './types/provider-metadata'
export type * from './types/provider-options'

declare module '@xsai/text-primitives' {
  interface ProviderOptions {
    messages?: MessagesProviderOptions
  }

  interface ProviderPartMetadata {
    messages?: MessagesPartMetadata
  }
}

const ANTHROPIC_VERSION = '2023-06-01'

export const messages = (options: HttpOptions): LanguageModel => async (modelOptions) => {
  const { messages: inputMessages, system } = normalizeInput(modelOptions)
  const maxTokens = modelOptions.maxOutputTokens
  const outputFormat = normalizeFormat(modelOptions.outputFormat)
  const providerOptions = modelOptions.providerOptions?.messages

  if (typeof maxTokens !== 'number')
    throw new XSAIError('invalid-input', 'maxOutputTokens is required for the Messages API')

  return wireRequest(options, modelOptions, {
    body: {
      max_tokens: maxTokens,
      mcp_servers: providerOptions?.mcpServers,
      messages: inputMessages,
      model: options.model,
      output_config: modelOptions.reasoningEffort == null && outputFormat == null
        ? undefined
        : { effort: modelOptions.reasoningEffort, format: outputFormat },
      stream: true,
      system,
      temperature: modelOptions.temperature,
      tool_choice: normalizeToolChoice(modelOptions.toolChoice),
      tools: mergeTools(providerOptions?.tools, modelOptions.tools),
      top_p: modelOptions.topP,
    },
    headers: {
      ...options.headers,
      ...(providerOptions?.betas !== undefined && providerOptions.betas.length > 0
        ? { 'anthropic-beta': providerOptions.betas.join(',') }
        : {}),
      'anthropic-version': ANTHROPIC_VERSION,
      'Content-Type': 'application/json',
      ...(options.apiKey == null ? {} : { 'x-api-key': options.apiKey }),
    },
    path: 'messages',
  }, new MessagesEventStream(modelOptions.includeRawEvents))
}
