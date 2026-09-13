import { HttpError, XSAIError } from '@xsai/shared'

/** Rejection handler for the fetch call: caller aborts keep their reason, everything else becomes a `network-error`. */
export const requestCatch = (url: URL, signal?: AbortSignal): ((cause: unknown) => never) =>
  (cause) => {
    if (signal?.aborted)
      throw cause
    throw new XSAIError('network-error', `request to ${url.toString()} failed`, { cause })
  }

export const responseCatch = async (res: Response): Promise<Response & { body: NonNullable<Response['body']> }> => {
  if (!res.ok)
    throw new HttpError(res.status, await res.text())

  if (res.body === null)
    throw new XSAIError('invalid-response', 'Response body is empty')

  if (!(res.body instanceof ReadableStream))
    throw new XSAIError('invalid-response', `Expected Response body to be a ReadableStream, but got ${typeof res.body}`)

  return res as Response & { body: NonNullable<Response['body']> }
}
