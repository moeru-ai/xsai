import process from 'node:process'

import { createOpenRouter } from './create'

/**
 * OpenRouter Provider
 * @see {@link https://openrouter.ai/models}
 * @remarks
 * baseURL - `https://openrouter.ai/api/v1`
 * apiKey - `import('node:process').env.OPENROUTER_API_KEY`
 */
export const openrouter = createOpenRouter(process.env.OPENROUTER_API_KEY!)
