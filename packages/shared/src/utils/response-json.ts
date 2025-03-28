import { responseCatch } from './response-catch'

export const responseJSON = async <T>(res: Response) =>
  responseCatch(res)
    .then(async (res) => {
      try {
        return res.json() as Promise<T>
      }
      catch {
        throw new Error(`Failed to parse response, response body: ${await res.text()}`)
      }
    })
