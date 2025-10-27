import process from 'node:process'

import { createAnthropic, createCerebras, createGoogleGenerativeAI, createOpenRouter } from './create'

/**
 * Create a Anthropic Provider
 * @see {@link https://docs.claude.com/en/api/openai-sdk}
 * @remarks
 * - baseURL - `https://api.anthropic.com/v1/`
 * - apiKey - `ANTHROPIC_API_KEY`
 */
export const anthropic = createAnthropic(process.env.ANTHROPIC_API_KEY!)

/**
 * Create a Cerebras Provider
 * @see {@link https://inference-docs.cerebras.ai/resources/openai}
 * @remarks
 * - baseURL - `https://api.cerebras.ai/v1/`
 * - apiKey - `CEREBRAS_API_KEY`
 */
export const cerebras = createCerebras(process.env.CEREBRAS_KEY!)

/**
 * Create a Google Provider
 * @see {@link https://ai.google.dev/gemini-api/docs/pricing}
 * @remarks
 * - baseURL - `https://generativelanguage.googleapis.com/v1beta/openai/`
 * - apiKey - `GOOGLE_GENERATIVE_AI_API_KEY` or `GEMINI_API_KEY`
 */
export const google = createGoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY!)

/**
 * OpenRouter Provider
 * @see {@link https://openrouter.ai/models}
 * @remarks
 * - baseURL - `https://openrouter.ai/api/v1`
 * - apiKey - `OPENROUTER_API_KEY`
 */
export const openrouter = createOpenRouter(process.env.OPENROUTER_API_KEY!)
