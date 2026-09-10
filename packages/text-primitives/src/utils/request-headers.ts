export const requestHeaders = (apiKey?: string, extraHeaders?: Record<string, string>): Record<string, string> => ({
  'Content-Type': 'application/json',
  ...(apiKey !== undefined ? { Authorization: `Bearer ${apiKey}` } : {}),
  ...extraHeaders,
})
