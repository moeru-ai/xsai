import { responseCatch } from './response-catch'

export const responseJSON = async <T>(res: Response) =>
  // eslint-disable-next-line @masknet/no-then
  responseCatch(res)
    .then(async res => res.json() as Promise<T>)
