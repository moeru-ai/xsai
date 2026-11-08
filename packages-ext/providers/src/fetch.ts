import type { RuntimeProvider } from './types'

import { applyCorrections } from './corrections'
import { extra } from './corrections/extra'
import { overrides } from './corrections/overrides'
import { normalizeCatalog } from './normalize'

export const CATALOG_URL = 'https://models.dev/experimental/v2.0/api.json?type=chat,decision,embedding,image,speech,transcription'

export interface FetchProvidersOptions {
  etag?: string
  fetch?: (request: Request) => Promise<Response>
  signal?: AbortSignal
  url?: string | URL
}

export type FetchProvidersResult
  = | { etag?: string, notModified: false, providers: Record<string, RuntimeProvider> }
    | { notModified: true }

/**
 * Fetches the models.dev catalog and normalizes it like the generated provider modules, with model descriptions.
 * Pass the `etag` of a previous result to get `{ notModified: true }` when the catalog has not changed.
 */
export const fetchProviders = async (options: FetchProvidersOptions = {}): Promise<FetchProvidersResult> => {
  const url = options.url ?? CATALOG_URL
  const request = new Request(url, {
    headers: options.etag === undefined ? undefined : { 'If-None-Match': options.etag },
    signal: options.signal,
  })
  const response = await (options.fetch ?? globalThis.fetch)(request)

  if (response.status === 304)
    return { notModified: true }
  if (!response.ok)
    throw new Error(`Failed to fetch ${url.toString()}: HTTP ${response.status}`)

  const providers = applyCorrections(normalizeCatalog(await response.json(), { description: true }), { extra, overrides })
  return { etag: response.headers.get('etag') ?? undefined, notModified: false, providers }
}
