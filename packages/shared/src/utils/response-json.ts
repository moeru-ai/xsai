import { JSONParseError } from '../error'

export const responseJSON = async <T>(res: Response): Promise<T> => {
  const text = await res.text()

  try {
    return JSON.parse(text) as T
  }
  catch (cause) {
    throw new JSONParseError(`Failed to parse response, response body: ${text}`, {
      cause,
      text,
    })
  }
}
