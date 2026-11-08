export interface Cost {
  cacheRead?: number
  cacheWrite?: number
  input?: number
  output?: number
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

export interface ModelCapabilities {
  cache?: { explicit?: boolean, implicit?: boolean }
  reasoning: ReasoningCapabilities
  serviceTiers?: string[]
  structuredOutput?: boolean
  temperature?: boolean
  tools: { supported: boolean }
  topK?: boolean
  topP?: boolean
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
}

export interface ProviderOptions {
  apiKey?: string
  fetch?: (request: Request) => Promise<Response>
  headers?: Record<string, string | undefined>
  variables?: Record<string, string>
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
  tools?: { choice?: string[], strict?: boolean }
}

export interface RouteCompatibility {
  maxTokensField?: string
  mediaInput?: string
  reasoningField?: string
}

export interface RouteOptions {
  variables?: Record<string, string>
}

export interface RouteTarget {
  baseURL: string
  model: string
  path?: string
  protocol: Protocol
}
