import { XSAIError } from '../error'

export const responseJSON = async <T>(res: Response): Promise<T> => {
  const text = await res.text()

  try {
    // eslint-disable-next-line @masknet/type-prefer-return-type-annotation
    return JSON.parse(text) as T
  }
  catch (cause) {
    throw new XSAIError(`Failed to parse response, response body: ${text}`, res, cause)
  }
}
