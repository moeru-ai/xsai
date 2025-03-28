import { responseCatch } from './response-catch'

export const responseJSON = async <T>(res: Response) =>
  responseCatch(res)
    .then(async (res): Promise<T> => {
      const text = await res.text()

      try {
        const json = JSON.parse(text) as T
        return json
      }
      catch {
        const error = new Error('Failed to parse response')
        error.cause = text
        throw error
      }
    })
