import { HttpError, XSAIError } from '@xsai/shared'

export const responseCatch = async (res: Response): Promise<Response & { body: NonNullable<Response['body']> }> => {
  if (!res.ok)
    throw new HttpError(res.status, await res.text())

  if (res.body === null)
    throw new XSAIError('invalid-response', 'Response body is empty')

  if (!(res.body instanceof ReadableStream))
    throw new XSAIError('invalid-response', `Expected Response body to be a ReadableStream, but got ${typeof res.body}`)

  return res as Response & { body: NonNullable<Response['body']> }
}
