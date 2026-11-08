export interface CachePrices {
  cacheRead?: number
  cacheWrite?: number | Record<string, number>
}

export interface Cost extends CachePrices {
  explicit?: CachePrices
  input?: number
  output?: number
}

export interface ExplicitCache {
  maxBreakpoints?: number
  minTokens?: number
  targets?: string[]
  ttl?: string[]
}

export interface ImplicitCache {
  minTokens?: number
  ttl?: string[]
}

export interface Model {
  capabilities: ModelCapabilities
  cost?: Cost
  id: string
  limit: ModelLimit
  modalities: ModelModalities
  name: string
  routes: Partial<Record<Protocol, Route>>
  status?: ModelStatus
  type: ModelType
}

export interface ModelCache {
  explicit: ExplicitCache | false
  implicit: false | ImplicitCache
}

export interface ModelCapabilities {
  cache?: ModelCache
  reasoning: ReasoningCapabilities
  serviceTiers?: string[]
  supportedParams?: SupportedParams
  tools: { supported: boolean }
}

export interface ModelLimit {
  context?: number
  input?: number
  output?: number
}

export interface ModelModalities {
  input: string[]
  output: string[]
}

export type ModelStatus = 'alpha' | 'beta' | 'deprecated'

export type ModelType = 'chat' | 'decision' | 'embedding' | 'image' | 'speech' | 'transcription'

export type Protocol = 'chat' | 'decisions' | 'embeddings' | 'generations' | 'messages' | 'responses' | 'speech' | 'systemone' | 'transcriptions'

export interface Provider<TModel extends string = string> {
  apiKeyEnv?: string[]
  defaults?: Partial<Record<Protocol, { baseURL: string }>>
  doc: string
  env: string[]
  id: string
  models: Record<TModel, Model>
  name: string
  protocols?: Protocol[]
}

export interface ProviderOptions extends RouteOptions {
  apiKey?: string
  fetch?: (request: Request) => Promise<Response>
  headers?: Record<string, string | undefined>
}

export interface ReasoningCapabilities {
  budget?: { max?: number, min?: number }
  default?: { type: string, value: boolean | string }
  efforts?: ReasoningEffort[]
  supported: boolean
  toggle?: boolean
}

export type ReasoningEffort = 'high' | 'low' | 'max' | 'medium' | 'minimal' | 'none' | 'xhigh' | (string & {})

export interface Route {
  baseURL: string
  capabilities?: RouteCapabilities
  compatibility?: RouteCompatibility
  path?: string
  protocol: Protocol
  variables?: string[]
}

export interface RouteCapabilities {
  tools?: { choice?: string[], search?: boolean, strict?: boolean }
}

export interface RouteCompatibility {
  maxTokensField?: string
  mediaInput?: string
  reasoningField?: string
}

export interface RouteOptions {
  baseURL?: string
  variables?: Record<string, string>
}

export interface RouteTarget {
  baseURL: string
  model: string
  path?: string
  protocol: Protocol
}

export interface RuntimeModel extends Model {
  description?: string
}

export interface RuntimeProvider extends Provider {
  models: Record<string, RuntimeModel>
}

export interface SupportedParams {
  outputFormat?: boolean
  temperature?: boolean
  topK?: boolean
  topP?: boolean
}
