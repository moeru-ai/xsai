import { XSAIError } from '../error'

export const responseCatch = async (res: Response) => {
  if (!res.ok) {
    const error = new XSAIError(`Remote sent ${res.status} response`, res)
    error.cause = new Error(await res.text())
    throw error
  }
  if (!res.body) {
    throw new XSAIError('Response body is empty from remote server', res)
  }
  if (!(res.body instanceof ReadableStream)) {
    const error = new XSAIError(`Expected Response body to be a ReadableStream, but got ${String(res.body)}`, res)
    error.cause = new Error(`Content-Type is ${res.headers.get('Content-Type')}`)
    throw error
  }

  return res
}
