import type { UnionToIntersection } from 'type-fest'

import type { ProviderMetadata } from './metadata'
import type {
  ChatProvider,
  ChatProviderWithExtraOptions,
  EmbedProvider,
  ModelProvider,
  SpeechProvider,
  SpeechProviderWithExtraOptions,
  TranscriptionProvider,
} from './providers'

export type DefineProvider = <Features extends object[]> (metadata: ProviderMetadata, ...features: Features) => Provider<Features>

export type FeatureProvider =
  | ChatProvider
  | ChatProviderWithExtraOptions
  | EmbedProvider
  | ModelProvider
  | SpeechProvider
  | SpeechProviderWithExtraOptions
  | TranscriptionProvider

export type Provider<Features extends object[]> = UnionToIntersection<Features[number]> & { metadata: ProviderMetadata }
