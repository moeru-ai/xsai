import { responseCatch } from './response-catch'

export const responseBlobAsDataURL = async (res: Response): Promise<string> =>
  responseCatch(res)
    .then(async (res) => {
      const blob = await res.blob()

      try {
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }
      catch {
        throw new Error(`Failed to parse response blob, response URL: ${res.url}`)
      }
    })
