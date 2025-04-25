import { XSAIError } from '../error'

export const responseCatch = async (res: Response) => {
  if (!res.ok)
    throw new XSAIError(`Remote sent ${res.status} response: ${await res.text()}`, res)
  if (!res.body)
    throw new XSAIError('Response body is empty from remote server', res)
  if (!(res.body instanceof ReadableStream))
    throw new XSAIError(`Expected Response body to be a ReadableStream, but got ${String(res.body)}; Content Type is ${res.headers.get('Content-Type')}`, res)

  return res
}
