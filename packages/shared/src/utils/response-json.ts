import { responseCatch } from './response-catch'

export const responseJSON = async <T>(res: Response) =>
  responseCatch(res)
    .then(res => res.json() as Promise<T>)
