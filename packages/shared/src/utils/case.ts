export const strCamelToSnake = (str: string) =>
  str.replace(/[A-Z]/g, s => `_${s.toLowerCase()}`)

export const objCamelToSnake = (obj: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [strCamelToSnake(k), v]))
