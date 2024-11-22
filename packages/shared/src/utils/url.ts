export const requestUrl = (path: string, base: string | URL = 'http://localhost:11434/v1/') => new URL(path, base)
