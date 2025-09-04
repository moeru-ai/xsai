export const now = (): number => globalThis?.performance?.now() ?? Date.now()
