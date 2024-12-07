import { objCamelToSnake } from './case'
import { clean } from './clean'

export const requestBody = (body: Record<string, unknown>) => JSON.stringify(objCamelToSnake(clean({
  ...body,
  abortSignal: undefined,
  apiKey: undefined,
  baseURL: undefined,
  headers: undefined,
})))
