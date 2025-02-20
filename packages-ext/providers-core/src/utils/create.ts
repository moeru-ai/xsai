import { ChatProvider, EmbedProvider, ModelProvider, SpeechProvider, SpeechProviderWithExtraOptions, TranscriptionProvider } from "../types/provider";
import { ProviderOptions } from '../types/provider-options'

export const createChatProvider = <T extends string = string>(options: ProviderOptions): ChatProvider<T> => ({
  chat: (model) => Object.assign(options, { model })
})

export const createEmbedProvider = <T extends string = string>(options: ProviderOptions): EmbedProvider<T> => ({
  embed: (model) => Object.assign(options, { model })
})

export const createModelProvider = (options: ProviderOptions): ModelProvider => ({
  model: () => options
})

export const createSpeechProvider = <T extends string = string>(options: ProviderOptions): SpeechProvider<T> => ({
  speech: (model) => Object.assign(options, { model })
})

export const createSpeechProviderWithExtraOptions = <T extends string = string, T2 = undefined>(options: ProviderOptions): SpeechProviderWithExtraOptions<T, T2> => ({
  speech: (model, extraOptions) => Object.assign(options, { model }, extraOptions)
})

export const createTranscriptionProvider = <T extends string = string>(options: ProviderOptions): TranscriptionProvider<T> => ({
  transcription: model => Object.assign(options, { model })
})
