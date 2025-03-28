import { responseCatch } from './response-catch'

export const responseJSON = async <T>(res: Response) =>
  responseCatch(res)
    .then(async (res) => {
      const text = await res.text()

      try {
        return JSON.parse(text) as T
      }
      catch {
        throw new Error(`Failed to parse response, response body: ${text}`)
      }
    })
