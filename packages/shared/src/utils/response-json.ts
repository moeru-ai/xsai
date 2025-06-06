import { responseCatch } from './response-catch'

export const responseJSON = async <T>(res: Response): Promise<T> =>
  responseCatch(res)
    .then(async (res) => {
      const text = await res.text()

      try {
        // eslint-disable-next-line @masknet/type-prefer-return-type-annotation
        return JSON.parse(text) as T
      }
      catch {
        throw new Error(`Failed to parse response, response body: ${text}`)
      }
    })
