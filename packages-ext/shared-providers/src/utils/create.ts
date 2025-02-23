import type { CreateProviderOptions } from '../types/create-provider-options'
import type { ProviderMetadata } from '../types/metadata'
import type { ChatProvider, ChatProviderWithExtraOptions, EmbedProvider, MetadataProviders, ModelProvider, SpeechProvider, SpeechProviderWithExtraOptions, TranscriptionProvider } from '../types/providers'

export const createChatProvider = <T extends string = string>(options: CreateProviderOptions): ChatProvider<T> => ({
  chat: model => Object.assign(options, { model }),
})

export const createChatProviderWithExtraOptions = <T extends string = string, T2 = undefined>(options: CreateProviderOptions): ChatProviderWithExtraOptions<T, T2> => ({
  chat: (model, extraOptions) => Object.assign(options, { model }, extraOptions),
})

export const createEmbedProvider = <T extends string = string>(options: CreateProviderOptions): EmbedProvider<T> => ({
  embed: model => Object.assign(options, { model }),
})

export const createModelProvider = (options: CreateProviderOptions): ModelProvider => ({
  model: () => options,
})

export const createSpeechProvider = <T extends string = string>(options: CreateProviderOptions): SpeechProvider<T> => ({
  speech: model => Object.assign(options, { model }),
})

export const createSpeechProviderWithExtraOptions = <T extends string = string, T2 = undefined>(options: CreateProviderOptions): SpeechProviderWithExtraOptions<T, T2> => ({
  speech: (model, extraOptions) => Object.assign(options, { model }, extraOptions),
})

export const createTranscriptionProvider = <T extends string = string>(options: CreateProviderOptions): TranscriptionProvider<T> => ({
  transcription: model => Object.assign(options, { model }),
})

export const createMetadataProvider = (id: string, otherMeta?: Omit<ProviderMetadata, 'id'>): MetadataProviders => ({
  metadata: { id, ...otherMeta },
})
