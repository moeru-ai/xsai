import { XSAIError } from '../error'

export const responseJSON = async <T>(res: Response): Promise<T> => {
  const text = await res.text()

  try {
    return JSON.parse(text) as T
  }
  catch (cause) {
    throw new XSAIError(`Failed to parse response, response body: ${text}`, res, cause)
  }
}
