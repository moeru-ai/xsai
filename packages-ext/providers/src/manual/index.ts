import process from 'node:process'

import { novitaAi } from '../generated'
import { createAnthropic, createFeatherless, createOpenRouter, createTogetherAI } from './create'

/**
 * Anthropic Provider
 * @see {@link https://docs.claude.com/en/api/openai-sdk}
 * @remarks
 * - baseURL - `https://api.anthropic.com/v1/`
 * - apiKey - `ANTHROPIC_API_KEY`
 */
export const anthropic = createAnthropic(process.env.ANTHROPIC_API_KEY ?? '')

/**
 * Featherless AI Provider
 * @see {@link https://featherless.ai/models}
 * @remarks
 * - baseURL - `https://api.featherless.ai/v1/`
 * - apiKey - `FEATHERLESS_API_KEY`
 */
export const featherless = createFeatherless(process.env.FEATHERLESS_API_KEY ?? '')

/**
 * OpenRouter Provider
 * @see {@link https://openrouter.ai/models}
 * @remarks
 * - baseURL - `https://openrouter.ai/api/v1/`
 * - apiKey - `OPENROUTER_API_KEY`
 */
export const openrouter = createOpenRouter(process.env.OPENROUTER_API_KEY ?? '')

/**
 * Together AI Provider
 * @see {@link https://docs.together.ai/docs/serverless-models}
 * @remarks
 * - baseURL - `https://api.together.xyz/v1/`
 * - apiKey - `TOGETHER_API_KEY`
 */
export const togetherai = createTogetherAI(process.env.TOGETHER_API_KEY ?? '')

/** @deprecated use `novitaAi` instead. */
export const novita = novitaAi
