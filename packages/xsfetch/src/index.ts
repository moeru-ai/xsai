interface CreateFetchOptions {
  retry: number
  /** @internal */
  retryCount: number
  retryDelay: number
  retryStatusCodes: number[]
}

/** @experimental WIP */
export const createFetch = (userOptions: Partial<CreateFetchOptions>) => {
  const options: CreateFetchOptions = {
    retry: 3,
    retryCount: 0,
    retryDelay: 500,
    // https://github.com/unjs/ofetch#%EF%B8%8F-auto-retry
    retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504],
    ...userOptions,
  }

  const xsfetch = async (input: Request | string | URL, init: RequestInit, options: CreateFetchOptions) => {
    const res = await fetch(input, init)

    if (!res.ok && options.retryStatusCodes.includes(res.status) && options.retry < options.retryCount) {
      return async () => xsfetch(input, init, {
        ...options,
        retryCount: options.retryCount + 1,
      })
    }
    else {
      return res
    }
  }

  return async (input: Request | string | URL, init: RequestInit) => {
    let res = await xsfetch(input, init, options)

    while (typeof res === 'function')
      res = await res()

    return res
  }
}
