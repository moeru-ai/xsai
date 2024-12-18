export const requestURL = (path: string, baseURL: string | URL) => {
  const base = baseURL.toString()

  return new URL(path, base.endsWith('/') ? base : `${base}/`)
}
