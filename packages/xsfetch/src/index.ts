import { sleep } from '../../utils-stream/src/_sleep'

export interface CreateFetchOptions {
  retry: number
  /** @internal */
  retryCount: number
  retryDelay: number
  retryStatusCodes: number[]
}

export const createFetch = (userOptions: Partial<CreateFetchOptions>): typeof globalThis.fetch => {
  const options: CreateFetchOptions = {
    retry: 3,
    retryCount: 0,
    retryDelay: 500,
    // https://github.com/unjs/ofetch#%EF%B8%8F-auto-retry
    retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504],
    ...userOptions,
  }

  const xsfetch = async (options: CreateFetchOptions, input: Request | string | URL, init?: RequestInit) => {
    const res = await fetch(input, init)

    if (!res.ok && options.retryStatusCodes.includes(res.status) && options.retry < options.retryCount) {
      await sleep(options.retryDelay)

      return async () => xsfetch({
        ...options,
        retryCount: options.retryCount + 1,
      }, input, init)
    }
    else {
      return res
    }
  }

  return async (input: Request | string | URL, init?: RequestInit) => {
    let res = await xsfetch(options, input, init)

    while (typeof res === 'function')
      res = await res()

    return res
  }
}
