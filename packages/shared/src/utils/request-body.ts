import { clean } from './clean'

export const requestBody = (body: Record<string, unknown>) => JSON.stringify(clean({
  ...body,
  abortSignal: undefined,
  apiKey: undefined,
  headers: undefined,
  url: undefined,
}))
