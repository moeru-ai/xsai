import { createNovitaAi } from '../create'

export { createAnthropic } from './providers/anthropic'
export { createFeatherless } from './providers/featherless'
export { createOpenRouter } from './providers/openrouter'
export { createTogetherAI } from './providers/together-ai'

/** @deprecated use `createNovitaAi` instead. */
export const createNovita = createNovitaAi
