export interface RetrieveModel {
  list: (options?: RetrieveModelOptions) => Promise<RetrieveModelResult[]>
  retrieve: (options: RetrieveModelOptions & { model: string }) => Promise<RetrieveModelResult>
}

export interface RetrieveModelOptions {
  providerOptions?: RetrieveModelProviderOptions
  signal?: AbortSignal
}

export interface RetrieveModelProviderMetadata {}

export interface RetrieveModelProviderOptions {}

export interface RetrieveModelResult {
  id: string
  providerMetadata?: RetrieveModelProviderMetadata
}
