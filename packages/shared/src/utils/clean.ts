export const clean = (record: Record<string, undefined | unknown>) => Object.fromEntries(Object.entries(record).filter(([, v]) => !!v))
