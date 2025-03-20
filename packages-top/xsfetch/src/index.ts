import { sleep } from '../../../packages/utils-stream/src/_sleep'

export interface CreateFetchOptions {
  debug: boolean
  retry: number
  retryDelay: number
  retryStatusCodes: number[]
}

const defaults: CreateFetchOptions = {
  debug: false,
  retry: 3,
  retryDelay: 500,
  // https://github.com/unjs/ofetch#%EF%B8%8F-auto-retry
  retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504],
}

export const createFetch = (userOptions: Partial<CreateFetchOptions> = {}): typeof globalThis.fetch => {
  const options: Readonly<CreateFetchOptions> = Object.assign({}, defaults, userOptions)

  const xsfetch = async (retriesLeft: number, input: Request | string | URL, init?: RequestInit) => {
    const res = await fetch(input, init)

    if (res.ok || retriesLeft === 0 || !options.retryStatusCodes.includes(res.status))
      return res

    options.debug && console.warn('[xsfetch] Failed, retrying... Times left:', retriesLeft)
    await sleep(options.retryDelay)
    return async () => xsfetch(retriesLeft - 1, input, init)
  }

  return async (input: Request | string | URL, init?: RequestInit) => {
    let res = await xsfetch(options.retry, input, init)

    while (typeof res === 'function')
      res = await res()

    return res
  }
}
