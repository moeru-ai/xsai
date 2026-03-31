import { APICallError, InvalidResponseError } from '../error'

export const responseCatch = async (res: Response) => {
  if (!res.ok) {
    const responseBody = await res.text()
    throw new APICallError(`Remote sent ${res.status} response: ${responseBody}`, {
      response: res,
      responseBody,
    })
  }
  if (!res.body)
    throw new InvalidResponseError('Response body is empty from remote server', {
      reason: 'empty_body',
      response: res,
    })
  if (!(res.body instanceof ReadableStream)) {
    const contentType = res.headers.get('Content-Type')
    throw new InvalidResponseError(`Expected Response body to be a ReadableStream, but got ${String(res.body)}; Content Type is ${contentType}`, {
      body: res.body,
      contentType,
      reason: 'invalid_body',
      response: res,
    })
  }

  return res
}
