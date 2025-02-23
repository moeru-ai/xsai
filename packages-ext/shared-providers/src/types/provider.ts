import type { UnionToIntersection } from 'type-fest'

import type {
  ChatProvider,
  ChatProviderWithExtraOptions,
  EmbedProvider,
  ModelProvider,
  SpeechProvider,
  SpeechProviderWithExtraOptions,
  TranscriptionProvider,
} from './feature-providers'
import type { Metadata } from './metadata'

export type DefineProvider = <ID extends string, Features extends object[]> (metadata: Metadata<ID>, ...features: Features) => Provider<ID, Features>

export type FeatureProvider =
  | ChatProvider
  | ChatProviderWithExtraOptions
  | EmbedProvider
  | ModelProvider
  | SpeechProvider
  | SpeechProviderWithExtraOptions
  | TranscriptionProvider

export type Provider<ID extends string, Features extends object[]> = UnionToIntersection<Features[number]> & { metadata: Metadata<ID> }
