export const requestHeaders = (apiKey?: string, extraHeaders?: Record<string, string>): Record<string, string> => ({
  ...(apiKey !== undefined ? { Authorization: `Bearer ${apiKey}` } : {}),
  ...extraHeaders,
})
