import { responseCatch } from './response-catch'

export const responseJSON = async <T>(res: Response) =>
  responseCatch(res)
    .then(async res => res.json() as Promise<T>)
