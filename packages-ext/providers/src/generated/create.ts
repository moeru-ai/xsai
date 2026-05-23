/* eslint-disable perfectionist/sort-union-types */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/use-type-alias */

import { createChatProvider, createEmbedProvider, createImageProvider, createModelProvider, createSpeechProvider, createTranscriptionProvider, merge } from '../utils'

/**
 * Create a Abacus Provider
 * @see {@link https://abacus.ai/help/api}
 */
export const createAbacus = (apiKey: string, baseURL = 'https://routellm.abacus.ai/v1') => merge(
  createChatProvider<'claude-opus-4-1-20250805' | 'kimi-k2.5' | 'gpt-5.2' | 'o3-pro' | 'claude-haiku-4-5-20251001' | 'route-llm' | 'gemini-2.5-pro' | 'grok-4-1-fast-non-reasoning' | 'grok-code-fast-1' | 'gpt-5-codex' | 'qwen3-max' | 'grok-4-0709' | 'gpt-5.1-chat-latest' | 'gpt-4.1' | 'llama-3.3-70b-versatile' | 'claude-sonnet-4-6' | 'gpt-4.1-mini' | 'gpt-5.1' | 'gpt-5-nano' | 'gpt-5.4' | 'gpt-4o-mini' | 'claude-opus-4-5-20251101' | 'gpt-5.3-codex-xhigh' | 'claude-opus-4-20250514' | 'claude-sonnet-4-5-20250929' | 'qwen-2.5-coder-32b' | 'gemini-3.1-flash-lite-preview' | 'gemini-3.1-pro-preview' | 'gpt-5.1-codex-max' | 'gemini-3-flash-preview' | 'gpt-5.2-chat-latest' | 'gpt-4.1-nano' | 'o4-mini' | 'gpt-5.1-codex' | 'gpt-4o-2024-11-20' | 'gpt-5.2-codex' | 'gemini-2.5-flash' | 'gpt-5-mini' | 'o3-mini' | 'gpt-5.3-codex' | 'claude-opus-4-6' | 'claude-3-7-sonnet-20250219' | 'o3' | 'claude-sonnet-4-20250514' | 'grok-4-fast-non-reasoning' | 'kimi-k2-turbo-preview' | 'gpt-5' | 'gpt-5.3-chat-latest' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-V3.2' | 'openai/gpt-oss-120b' | 'zai-org/glm-4.6' | 'zai-org/glm-4.5' | 'zai-org/glm-4.7' | 'zai-org/glm-5' | 'deepseek/deepseek-v3.1' | 'meta-llama/Meta-Llama-3.1-8B-Instruct' | 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/QwQ-32B' | 'Qwen/qwen3-coder-480b-a35b-instruct' | 'Qwen/Qwen2.5-72B-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a abliteration.ai Provider
 * @see {@link https://docs.abliteration.ai/models}
 */
export const createAbliterationAi = (apiKey: string, baseURL = 'https://api.abliteration.ai/v1') => merge(
  createChatProvider<'abliterated-model'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 */
export const createAlibaba = (apiKey: string, baseURL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1') => merge(
  createChatProvider<'qwen2-5-7b-instruct' | 'qwen3-livetranslate-flash-realtime' | 'qwen2-5-vl-72b-instruct' | 'qwen3.5-plus' | 'qwen3-vl-plus' | 'qwen3-vl-235b-a22b' | 'qwen3.6-27b' | 'qwq-plus' | 'qwen3-8b' | 'qwen3.5-122b-a10b' | 'qwen3.7-max' | 'qwen3-max' | 'qwen3-235b-a22b' | 'qwen3.5-397b-a17b' | 'qwen-flash' | 'qwen-omni-turbo-realtime' | 'qwen-mt-turbo' | 'qwen-turbo' | 'qwen-max' | 'qwen2-5-vl-7b-instruct' | 'qwen2-5-32b-instruct' | 'qwen3-asr-flash' | 'qwen3.6-plus' | 'qwen3-coder-flash' | 'qwen3-32b' | 'qwen3-next-80b-a3b-thinking' | 'qwen-mt-plus' | 'qwen-vl-plus' | 'qwen-omni-turbo' | 'qwen3-vl-30b-a3b' | 'qwen3.5-35b-a3b' | 'qwen-vl-ocr' | 'qwen3.6-35b-a3b' | 'qwen3-omni-flash' | 'qwen2-5-14b-instruct' | 'qwen2-5-72b-instruct' | 'qwen3-coder-480b-a35b-instruct' | 'qvq-max' | 'qwen3.6-max-preview' | 'qwen3-coder-30b-a3b-instruct' | 'qwen3-omni-flash-realtime' | 'qwen3-next-80b-a3b-instruct' | 'qwen3.5-27b' | 'qwen-vl-max' | 'qwen-plus-character-ja' | 'qwen2-5-omni-7b' | 'qwen-plus' | 'qwen3-coder-plus' | 'qwen3-14b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba (China) Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 */
export const createAlibabaCn = (apiKey: string, baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1') => merge(
  createChatProvider<'qwen2-5-math-7b-instruct' | 'qwen2-5-7b-instruct' | 'qwen2-5-vl-72b-instruct' | 'kimi-k2.5' | 'qwen3.5-plus' | 'qwen-math-turbo' | 'glm-5.1' | 'qwen3-vl-plus' | 'qwen2-5-math-72b-instruct' | 'qwen3-vl-235b-a22b' | 'deepseek-r1-distill-llama-8b' | 'deepseek-r1' | 'qwq-32b' | 'qwq-plus' | 'qwen3-8b' | 'deepseek-r1-0528' | 'deepseek-r1-distill-qwen-1-5b' | 'qwen2-5-coder-32b-instruct' | 'tongyi-intent-detect-v3' | 'deepseek-v3' | 'qwen3-max' | 'qwen3-235b-a22b' | 'qwen3.5-397b-a17b' | 'qwen-doc-turbo' | 'qwen-flash' | 'qwen-omni-turbo-realtime' | 'qwen-mt-turbo' | 'qwen-turbo' | 'moonshot-kimi-k2-instruct' | 'qwen-max' | 'qwen2-5-vl-7b-instruct' | 'qwen2-5-32b-instruct' | 'qwen3-asr-flash' | 'qwen-math-plus' | 'qwen3.6-plus' | 'qwen3-coder-flash' | 'qwen-plus-character' | 'qwen3-32b' | 'qwen3-next-80b-a3b-thinking' | 'kimi-k2-thinking' | 'deepseek-r1-distill-qwen-14b' | 'qwen-deep-research' | 'qwen-mt-plus' | 'MiniMax-M2.5' | 'qwen-vl-plus' | 'qwen-omni-turbo' | 'qwen3-vl-30b-a3b' | 'deepseek-r1-distill-llama-70b' | 'deepseek-v3-1' | 'qwen3.5-flash' | 'qwen-vl-ocr' | 'qwen-long' | 'deepseek-r1-distill-qwen-32b' | 'qwen3-omni-flash' | 'qwen2-5-14b-instruct' | 'qwen2-5-72b-instruct' | 'qwen3-coder-480b-a35b-instruct' | 'qvq-max' | 'qwen3.6-max-preview' | 'qwen3-coder-30b-a3b-instruct' | 'qwen3-omni-flash-realtime' | 'qwen3-next-80b-a3b-instruct' | 'deepseek-r1-distill-qwen-7b' | 'qwen-vl-max' | 'qwen2-5-omni-7b' | 'qwen-plus' | 'glm-5' | 'kimi-k2.6' | 'qwen2-5-coder-7b-instruct' | 'qwen3-14b' | 'deepseek-v3-2-exp' | 'qwen3-coder-plus' | 'kimi/kimi-k2.5' | 'siliconflow/deepseek-r1-0528' | 'siliconflow/deepseek-v3-0324' | 'siliconflow/deepseek-v3.2' | 'siliconflow/deepseek-v3.1-terminus' | 'MiniMax/MiniMax-M2.7' | 'deepseek-v4-pro' | 'deepseek-v4-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Coding Plan Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/coding-plan}
 */
export const createAlibabaCodingPlan = (apiKey: string, baseURL = 'https://coding-intl.dashscope.aliyuncs.com/v1') => merge(
  createChatProvider<'kimi-k2.5' | 'qwen3.5-plus' | 'qwen3-coder-next' | 'qwen3.6-plus' | 'MiniMax-M2.5' | 'qwen3-max-2026-01-23' | 'glm-4.7' | 'glm-5' | 'qwen3-coder-plus'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Coding Plan (China) Provider
 * @see {@link https://help.aliyun.com/zh/model-studio/coding-plan}
 */
export const createAlibabaCodingPlanCn = (apiKey: string, baseURL = 'https://coding.dashscope.aliyuncs.com/v1') => merge(
  createChatProvider<'kimi-k2.5' | 'qwen3.5-plus' | 'qwen3-coder-next' | 'qwen3.6-plus' | 'MiniMax-M2.5' | 'qwen3-max-2026-01-23' | 'glm-4.7' | 'glm-5' | 'qwen3-coder-plus'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Ambient Provider
 * @see {@link https://ambient.xyz}
 */
export const createAmbient = (apiKey: string, baseURL = 'https://api.ambient.xyz/v1') => merge(
  createChatProvider<'moonshotai/kimi-k2.6' | 'zai-org/GLM-5.1-FP8'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Atomic Chat Provider
 * @see {@link https://atomic.chat}
 */
export const createAtomicChat = (apiKey: string, baseURL = 'http://127.0.0.1:1337/v1') => merge(
  createChatProvider<'gemma-4-E4B-it-IQ4_XS' | 'gemma-4-E4B-it-MLX-4bit' | 'Qwen3_5-9B-Q4_K_M' | 'Meta-Llama-3_1-8B-Instruct-GGUF' | 'Qwen3_5-9B-MLX-4bit'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Auriko Provider
 * @see {@link https://docs.auriko.ai}
 */
export const createAuriko = (apiKey: string, baseURL = 'https://api.auriko.ai/v1') => merge(
  createChatProvider<'kimi-k2.5' | 'glm-5.1' | 'gemini-2.5-pro' | 'deepseek-v4-pro' | 'minimax-m2-7' | 'claude-sonnet-4-6' | 'qwen-3.6-plus' | 'claude-opus-4-7' | 'deepseek-v4-flash' | 'gemini-3.1-pro-preview' | 'grok-4.3' | 'gemini-2.5-flash' | 'claude-opus-4-6' | 'minimax-m2-7-highspeed' | 'kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Bailing Provider
 * @see {@link https://alipaytbox.yuque.com/sxs0ba/ling/intro}
 */
export const createBailing = (apiKey: string, baseURL = 'https://api.tbox.cn/api/llm/v1/chat/completions') => merge(
  createChatProvider<'Ring-1T' | 'Ling-1T'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Baseten Provider
 * @see {@link https://docs.baseten.co/development/model-apis/overview}
 */
export const createBaseten = (apiKey: string, baseURL = 'https://inference.baseten.co/v1') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324' | 'deepseek-ai/DeepSeek-V3.2' | 'moonshotai/Kimi-K2-Thinking' | 'moonshotai/Kimi-K2.6' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2-Instruct-0905' | 'openai/gpt-oss-120b' | 'zai-org/GLM-4.7' | 'zai-org/GLM-5' | 'zai-org/GLM-4.6' | 'nvidia/Nemotron-120B-A12B' | 'MiniMaxAI/MiniMax-M2.5' | 'deepseek-ai/DeepSeek-V4-Pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Berget.AI Provider
 * @see {@link https://api.berget.ai}
 */
export const createBerget = (apiKey: string, baseURL = 'https://api.berget.ai/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'zai-org/GLM-4.7' | 'mistralai/Mistral-Medium-3.5-128B' | 'mistralai/Mistral-Small-3.2-24B-Instruct-2506' | 'google/gemma-4-31B-it' | 'meta-llama/Llama-3.3-70B-Instruct' | 'moonshotai/Kimi-K2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cerebras Provider
 * @see {@link https://inference-docs.cerebras.ai/models/overview}
 */
export const createCerebras = (apiKey: string, baseURL = 'https://api.cerebras.ai/v1/') => merge(
  createChatProvider<'zai-glm-4.7' | 'qwen-3-235b-a22b-instruct-2507' | 'gpt-oss-120b' | 'llama3.1-8b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Chutes Provider
 * @see {@link https://llm.chutes.ai/v1/models}
 */
export const createChutes = (apiKey: string, baseURL = 'https://llm.chutes.ai/v1') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-R1-0528-TEE' | 'deepseek-ai/DeepSeek-V3.1-TEE' | 'deepseek-ai/DeepSeek-V3-0324-TEE' | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B' | 'deepseek-ai/DeepSeek-V3.2-TEE' | 'moonshotai/Kimi-K2.5-TEE' | 'moonshotai/Kimi-K2.6-TEE' | 'openai/gpt-oss-120b-TEE' | 'zai-org/GLM-5-TEE' | 'zai-org/GLM-4.7-TEE' | 'zai-org/GLM-4.7-FP8' | 'zai-org/GLM-5.1-TEE' | 'zai-org/GLM-5-Turbo' | 'zai-org/GLM-4.6V' | 'unsloth/gemma-3-27b-it' | 'unsloth/Mistral-Nemo-Instruct-2407' | 'unsloth/Llama-3.2-3B-Instruct' | 'unsloth/gemma-3-12b-it' | 'unsloth/Llama-3.2-1B-Instruct' | 'unsloth/gemma-3-4b-it' | 'NousResearch/Hermes-4-14B' | 'NousResearch/DeepHermes-3-Mistral-24B-Preview' | 'rednote-hilab/dots.ocr' | 'google/gemma-4-31B-turbo-TEE' | 'XiaomiMiMo/MiMo-V2-Flash-TEE' | 'MiniMaxAI/MiniMax-M2.5-TEE' | 'Qwen/Qwen3.5-397B-A17B-TEE' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507-TEE' | 'Qwen/Qwen3Guard-Gen-0.6B' | 'Qwen/Qwen3-30B-A3B' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-32B-TEE' | 'Qwen/Qwen3-Coder-Next-TEE' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'Qwen/Qwen3.6-27B-TEE' | 'Qwen/Qwen2.5-72B-Instruct' | 'tngtech/DeepSeek-TNG-R1T2-Chimera-TEE'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Claudinio Provider
 * @see {@link https://claudin.io}
 */
export const createClaudinio = (apiKey: string, baseURL = 'https://api.claudin.io/v1') => merge(
  createChatProvider<'claudinio'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a CloudFerro Sherlock Provider
 * @see {@link https://docs.sherlock.cloudferro.com/}
 */
export const createCloudferroSherlock = (apiKey: string, baseURL = 'https://api-sherlock.cloudferro.com/openai/v1/') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'meta-llama/Llama-3.3-70B-Instruct' | 'MiniMaxAI/MiniMax-M2.5' | 'speakleash/Bielik-11B-v2.6-Instruct' | 'speakleash/Bielik-11B-v3.0-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cohere Provider
 * @see {@link https://docs.cohere.com/docs/models}
 */
export const createCohere = (apiKey: string, baseURL = 'https://api.cohere.ai/compatibility/v1/') => merge(
  createChatProvider<'c4ai-aya-expanse-32b' | 'command-a-reasoning-08-2025' | 'c4ai-aya-vision-8b' | 'command-r-08-2024' | 'command-a-03-2025' | 'c4ai-aya-expanse-8b' | 'command-a-vision-07-2025' | 'command-r-plus-08-2024' | 'command-r7b-12-2024' | 'c4ai-aya-vision-32b' | 'command-r7b-arabic-02-2025' | 'command-a-translate-08-2025'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Cortecs Provider
 * @see {@link https://api.cortecs.ai/v1/models}
 */
export const createCortecs = (apiKey: string, baseURL = 'https://api.cortecs.ai/v1') => merge(
  createChatProvider<'minimax-m2.1' | 'kimi-k2.5' | 'claude-haiku-4-5' | 'glm-5.1' | 'claude-opus4-7' | 'gemini-2.5-pro' | 'minimax-m2' | 'kimi-k2-instruct' | 'deepseek-r1-0528' | 'deepseek-v3-0324' | 'codestral-2508' | 'qwen-2.5-72b-instruct' | 'deepseek-v3.2' | 'hermes-4-70b' | 'devstral-2512' | 'claude-opus4-5' | 'glm-4.5-air' | 'minimax-m2.5' | 'glm-4.7-flash' | 'devstral-small-2512' | 'gpt-4.1' | 'glm-4.5' | 'qwen3-coder-next' | 'minimax-m2.7' | 'intellect-3' | 'qwen3-32b' | 'qwen3-next-80b-a3b-thinking' | 'kimi-k2-thinking' | 'nemotron-3-super-120b-a12b' | 'nova-pro-v1' | 'claude-4-5-sonnet' | 'qwen3-235b-a22b-instruct-2507' | 'claude-sonnet-4' | 'claude-opus4-6' | 'qwen3-coder-480b-a35b-instruct' | 'llama-3.1-405b-instruct' | 'glm-4.7' | 'gpt-oss-120b' | 'mixtral-8x7B-instruct-v0.1' | 'glm-5' | 'kimi-k2.6' | 'claude-4-6-sonnet' | 'mistral-large-2512' | 'deepseek-v4-pro' | 'qwen3.5-122b-a10b' | 'qwen3.5-397b-a17b' | 'deepseek-v4-flash' | 'qwen3-coder-30b-a3b-instruct' | 'llama-3.3-70b-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a CrofAI Provider
 * @see {@link https://crof.ai/docs}
 */
export const createCrof = (apiKey: string, baseURL = 'https://crof.ai/v1') => merge(
  createChatProvider<'deepseek-v4-pro-precision' | 'deepseek-v3.2' | 'qwen3.5-9b' | 'mimo-v2.5-pro-precision' | 'kimi-k2.5-lightning' | 'greg' | 'glm-5.1-precision' | 'kimi-k2.6-precision' | 'kimi-k2.5' | 'glm-5.1' | 'qwen3.6-27b' | 'deepseek-v4-pro' | 'mimo-v2.5-pro' | 'minimax-m2.5' | 'gemma-4-31b-it' | 'qwen3.5-397b-a17b' | 'glm-4.7-flash' | 'deepseek-v4-flash' | 'glm-4.7' | 'glm-5' | 'kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Deep Infra Provider
 * @see {@link https://deepinfra.com/models}
 */
export const createDeepinfra = (apiKey: string, baseURL = 'https://api.deepinfra.com/v1/openai/') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.2' | 'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-K2-Thinking' | 'moonshotai/Kimi-K2.6' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2-Instruct-0905' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'zai-org/GLM-4.5' | 'zai-org/GLM-4.7' | 'zai-org/GLM-4.7-Flash' | 'zai-org/GLM-5' | 'zai-org/GLM-5.1' | 'zai-org/GLM-4.6' | 'zai-org/GLM-4.6V' | 'anthropic/claude-3-7-sonnet-latest' | 'anthropic/claude-4-opus' | 'meta-llama/Llama-3.1-8B-Instruct' | 'meta-llama/Llama-3.1-70B-Instruct-Turbo' | 'meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'meta-llama/Llama-3.1-70B-Instruct' | 'meta-llama/Llama-3.1-8B-Instruct-Turbo' | 'meta-llama/Llama-3.3-70B-Instruct-Turbo' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2.5' | 'MiniMaxAI/MiniMax-M2' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3.5-35B-A3B' | 'Qwen/Qwen3.6-35B-A3B' | 'deepseek-ai/DeepSeek-V4-Flash' | 'deepseek-ai/DeepSeek-V4-Pro' | 'google/gemma-4-26B-A4B-it' | 'google/gemma-4-31B-it' | 'xiaomi/mimo-v2.5-pro' | 'xiaomi/mimo-v2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a DeepSeek Provider
 * @see {@link https://api-docs.deepseek.com/quick_start/pricing}
 */
export const createDeepSeek = (apiKey: string, baseURL = 'https://api.deepseek.com') => merge(
  createChatProvider<'deepseek-chat' | 'deepseek-v4-pro' | 'deepseek-reasoner' | 'deepseek-v4-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a DigitalOcean Provider
 * @see {@link https://docs.digitalocean.com/products/gradient-ai-platform/details/models/}
 */
export const createDigitalocean = (apiKey: string, baseURL = 'https://inference.do-ai.run/v1') => merge(
  createChatProvider<'openai-gpt-5.5' | 'openai-o3-mini' | 'bge-reranker-v2-m3' | 'openai-gpt-5-mini' | 'openai-o3' | 'kimi-k2.5' | 'anthropic-claude-4.5-haiku' | 'openai-gpt-4o-mini' | 'llama3.3-70b-instruct' | 'nemotron-3-nano-omni' | 'nemotron-nano-12b-v2-vl' | 'mistral-7b-instruct-v0.3' | 'nemotron-3-nano-30b' | 'anthropic-claude-haiku-4.5' | 'all-mini-lm-l6-v2' | 'openai-gpt-image-1' | 'qwen3-tts-voicedesign' | 'openai-gpt-5.2' | 'anthropic-claude-4.5-sonnet' | 'deepseek-v4-pro' | 'anthropic-claude-4.1-opus' | 'openai-gpt-4.1' | 'openai-gpt-5.1-codex-max' | 'mistral-nemo-instruct-2407' | 'nvidia-nemotron-3-super-120b' | 'arcee-trinity-large-thinking' | 'anthropic-claude-3.5-sonnet' | 'openai-gpt-5.2-pro' | 'openai-gpt-5.4-nano' | 'openai-gpt-5.3-codex' | 'deepseek-v3' | 'minimax-m2.5' | 'qwen3.5-397b-a17b' | 'ministral-3-8b-instruct-2512' | 'openai-gpt-image-2' | 'stable-diffusion-3.5-large' | 'qwen3-embedding-0.6b' | 'openai-gpt-5-nano' | 'openai-gpt-5' | 'deepseek-3.2' | 'openai-gpt-5.4-pro' | 'qwen3-coder-flash' | 'openai-gpt-oss-20b' | 'openai-gpt-5.4-mini' | 'anthropic-claude-opus-4.6' | 'alibaba-qwen3-32b' | 'gemma-4-31B-it' | 'anthropic-claude-3.7-sonnet' | 'llama3-8b-instruct' | 'anthropic-claude-opus-4.7' | 'gte-large-en-v1.5' | 'anthropic-claude-4.6-sonnet' | 'deepseek-r1-distill-llama-70b' | 'anthropic-claude-opus-4.5' | 'multi-qa-mpnet-base-dot-v1' | 'qwen-2.5-14b-instruct' | 'e5-large-v2' | 'anthropic-claude-opus-4' | 'openai-gpt-image-1.5' | 'llama-4-maverick' | 'openai-gpt-5.4' | 'anthropic-claude-sonnet-4' | 'openai-o1' | 'wan2-2-t2v-a14b' | 'anthropic-claude-3.5-haiku' | 'bge-m3' | 'mistral-3-14B' | 'openai-gpt-4o' | 'anthropic-claude-3-opus' | 'glm-5' | 'kimi-k2.6' | 'openai-gpt-oss-120b' | 'fal-ai/fast-sdxl' | 'fal-ai/flux/schnell' | 'fal-ai/elevenlabs/tts/multilingual-v2' | 'fal-ai/stable-audio-25/text-to-audio'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a DInference Provider
 * @see {@link https://dinference.com}
 */
export const createDinference = (apiKey: string, baseURL = 'https://api.dinference.com/v1') => merge(
  createChatProvider<'gpt-oss-120b' | 'glm-5.1' | 'minimax-m2.5' | 'glm-4.7' | 'glm-5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a D.Run (China) Provider
 * @see {@link https://www.d.run}
 */
export const createDrun = (apiKey: string, baseURL = 'https://chat.d.run/v1') => merge(
  createChatProvider<'public/deepseek-r1' | 'public/deepseek-v3' | 'public/minimax-m25'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a evroc Provider
 * @see {@link https://docs.evroc.com/products/think/overview.html}
 */
export const createEvroc = (apiKey: string, baseURL = 'https://models.think.evroc.com/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K2.5' | 'openai/whisper-large-v3' | 'openai/gpt-oss-120b' | 'KBLab/kb-whisper-large' | 'nvidia/Llama-3.3-70B-Instruct-FP8' | 'mistralai/Voxtral-Small-24B-2507' | 'mistralai/devstral-small-2-24b-instruct-2512' | 'mistralai/Magistral-Small-2509' | 'microsoft/Phi-4-multimodal-instruct' | 'intfloat/multilingual-e5-large-instruct' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8' | 'Qwen/Qwen3-Embedding-8B'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a FastRouter Provider
 * @see {@link https://fastrouter.ai/models}
 */
export const createFastrouter = (apiKey: string, baseURL = 'https://go.fastrouter.ai/api/v1') => merge(
  createChatProvider<'deepseek-ai/deepseek-r1-distill-llama-70b' | 'moonshotai/kimi-k2' | 'z-ai/glm-5' | 'openai/gpt-oss-20b' | 'openai/gpt-5-nano' | 'openai/gpt-5-mini' | 'openai/gpt-oss-120b' | 'openai/gpt-5' | 'x-ai/grok-4' | 'qwen/qwen3-coder' | 'google/gemini-2.5-pro' | 'google/gemini-2.5-flash' | 'openai/gpt-4.1' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-4'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Fireworks (Firepass) Provider
 * @see {@link https://docs.fireworks.ai/firepass}
 */
export const createFirepass = (apiKey: string, baseURL = 'https://api.fireworks.ai/inference/v1/') => merge(
  createChatProvider<'accounts/fireworks/routers/kimi-k2p6-turbo'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Fireworks AI Provider
 * @see {@link https://fireworks.ai/docs/}
 */
export const createFireworks = (apiKey: string, baseURL = 'https://api.fireworks.ai/inference/v1/') => merge(
  createChatProvider<'accounts/fireworks/models/minimax-m2p7' | 'accounts/fireworks/models/glm-4p7' | 'accounts/fireworks/models/qwen3p6-plus' | 'accounts/fireworks/models/kimi-k2-instruct' | 'accounts/fireworks/models/kimi-k2p6' | 'accounts/fireworks/models/gpt-oss-20b' | 'accounts/fireworks/models/deepseek-v3p2' | 'accounts/fireworks/models/kimi-k2-thinking' | 'accounts/fireworks/models/glm-4p5' | 'accounts/fireworks/models/minimax-m2p5' | 'accounts/fireworks/models/kimi-k2p5' | 'accounts/fireworks/models/minimax-m2p1' | 'accounts/fireworks/models/deepseek-v3p1' | 'accounts/fireworks/models/gpt-oss-120b' | 'accounts/fireworks/models/glm-4p5-air' | 'accounts/fireworks/models/glm-5' | 'accounts/fireworks/models/glm-5p1' | 'accounts/fireworks/routers/kimi-k2p5-turbo' | 'accounts/fireworks/models/deepseek-v4-pro' | 'accounts/fireworks/models/deepseek-v4-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Friendli Provider
 * @see {@link https://friendli.ai/docs/guides/serverless_endpoints/introduction}
 */
export const createFriendli = (apiKey: string, baseURL = 'https://api.friendli.ai/serverless/v1') => merge(
  createChatProvider<'zai-org/GLM-5' | 'zai-org/GLM-5.1' | 'meta-llama/Llama-3.1-8B-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct' | 'MiniMaxAI/MiniMax-M2.5' | 'Qwen/Qwen3-235B-A22B-Instruct-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a FrogBot Provider
 * @see {@link https://docs.frogbot.ai}
 */
export const createFrogbot = (apiKey: string, baseURL = 'https://app.frogbot.ai/api/v1') => merge(
  createChatProvider<'kimi-k2.5' | 'claude-haiku-4-5' | 'gpt-4o' | 'grok-4-3' | 'gemini-2.5-pro' | 'grok-4-1-fast-reasoning' | 'deepseek-v4-pro' | 'gpt-5-5' | 'grok-4-1-fast-non-reasoning' | 'grok-code-fast-1' | 'minimax-m2-7' | 'gpt-oss-20b' | 'claude-sonnet-4-6' | 'kimi-k2-6' | 'gpt-5-3-codex' | 'claude-opus-4-7' | 'qwen-3-6-plus' | 'gpt-5-4-nano' | 'gemini-3-flash-preview' | 'gpt-5-4-mini' | 'gemini-2.5-flash' | 'claude-opus-4-6' | 'zai-glm-5-1' | 'minimax-m2-5' | 'gpt-oss-120b' | 'gemini-3-1-pro-preview'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a GitHub Copilot Provider
 * @see {@link https://docs.github.com/en/copilot}
 */
export const createGithubCopilot = (apiKey: string, baseURL = 'https://api.githubcopilot.com') => merge(
  createChatProvider<'claude-opus-41' | 'gpt-4o' | 'claude-sonnet-4.6' | 'gpt-5.2' | 'claude-sonnet-4.5' | 'gemini-2.5-pro' | 'gpt-5.1-codex-mini' | 'grok-code-fast-1' | 'claude-opus-4.6' | 'gpt-4.1' | 'gemini-3-pro-preview' | 'gpt-5.1' | 'gpt-5.4' | 'gpt-5.4-mini' | 'claude-haiku-4.5' | 'gemini-3.1-pro-preview' | 'gpt-5.1-codex-max' | 'gpt-5.5' | 'gemini-3-flash-preview' | 'claude-opus-4.5' | 'claude-sonnet-4' | 'gpt-5.1-codex' | 'gpt-5.2-codex' | 'gpt-5-mini' | 'gpt-5.3-codex' | 'claude-opus-4.7' | 'gpt-5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a GitHub Models Provider
 * @see {@link https://docs.github.com/en/github-models}
 */
export const createGithubModels = (apiKey: string, baseURL = 'https://models.github.ai/inference') => merge(
  createChatProvider<'cohere/cohere-command-r-plus' | 'cohere/cohere-command-r-plus-08-2024' | 'cohere/cohere-command-r' | 'cohere/cohere-command-r-08-2024' | 'cohere/cohere-command-a' | 'openai/gpt-4o' | 'openai/o1-preview' | 'openai/gpt-4.1' | 'openai/gpt-4.1-mini' | 'openai/gpt-4o-mini' | 'openai/o1' | 'openai/gpt-4.1-nano' | 'openai/o4-mini' | 'openai/o3-mini' | 'openai/o3' | 'openai/o1-mini' | 'ai21-labs/ai21-jamba-1.5-mini' | 'ai21-labs/ai21-jamba-1.5-large' | 'core42/jais-30b-chat' | 'microsoft/phi-3-medium-128k-instruct' | 'microsoft/phi-3-medium-4k-instruct' | 'microsoft/phi-4' | 'microsoft/phi-3-mini-128k-instruct' | 'microsoft/phi-4-reasoning' | 'microsoft/phi-3-small-128k-instruct' | 'microsoft/phi-3.5-vision-instruct' | 'microsoft/phi-3-small-8k-instruct' | 'microsoft/phi-3.5-moe-instruct' | 'microsoft/phi-3.5-mini-instruct' | 'microsoft/mai-ds-r1' | 'microsoft/phi-3-mini-4k-instruct' | 'microsoft/phi-4-mini-instruct' | 'microsoft/phi-4-mini-reasoning' | 'microsoft/phi-4-multimodal-instruct' | 'mistral-ai/mistral-large-2411' | 'mistral-ai/codestral-2501' | 'mistral-ai/mistral-nemo' | 'mistral-ai/mistral-small-2503' | 'mistral-ai/mistral-medium-2505' | 'mistral-ai/ministral-3b' | 'deepseek/deepseek-r1' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-v3-0324' | 'xai/grok-3-mini' | 'xai/grok-3' | 'meta/meta-llama-3.1-405b-instruct' | 'meta/meta-llama-3.1-70b-instruct' | 'meta/llama-4-maverick-17b-128e-instruct-fp8' | 'meta/llama-4-scout-17b-16e-instruct' | 'meta/meta-llama-3-70b-instruct' | 'meta/llama-3.2-90b-vision-instruct' | 'meta/meta-llama-3-8b-instruct' | 'meta/llama-3.2-11b-vision-instruct' | 'meta/meta-llama-3.1-8b-instruct' | 'meta/llama-3.3-70b-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a GMI Cloud Provider
 * @see {@link https://docs.gmicloud.ai/inference-engine/api-reference/llm-api-reference}
 */
export const createGmicloud = (apiKey: string, baseURL = 'https://api.gmi-serving.com/v1') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-V4-Flash' | 'deepseek-ai/DeepSeek-V4-Pro' | 'moonshotai/Kimi-K2.6' | 'zai-org/GLM-5.1-FP8' | 'zai-org/GLM-5-FP8' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-opus-4.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Google Provider
 * @see {@link https://ai.google.dev/gemini-api/docs/models}
 */
export const createGoogleGenerativeAI = (apiKey: string, baseURL = 'https://generativelanguage.googleapis.com/v1beta/openai/') => merge(
  createChatProvider<'gemini-flash-latest' | 'gemma-4-26b-a4b-it' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-2.5-pro' | 'gemma-4-31b-it' | 'gemini-2.5-pro-preview-tts' | 'gemini-3.1-flash-image-preview' | 'gemini-2.5-flash-lite' | 'gemini-flash-lite-latest' | 'gemini-3-pro-preview' | 'gemini-2.0-flash-lite' | 'gemini-3.1-pro-preview-customtools' | 'gemini-2.5-flash-preview-tts' | 'gemini-3.1-flash-lite-preview' | 'gemini-3.1-pro-preview' | 'gemini-3-flash-preview' | 'gemini-2.5-flash' | 'gemini-2.5-flash-image' | 'gemini-2.0-flash' | 'gemini-embedding-001'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Groq Provider
 * @see {@link https://console.groq.com/docs/models}
 */
export const createGroq = (apiKey: string, baseURL = 'https://api.groq.com/openai/v1/') => merge(
  createChatProvider<'gemma2-9b-it' | 'llama-3.1-8b-instant' | 'llama3-8b-8192' | 'allam-2-7b' | 'mistral-saba-24b' | 'qwen-qwq-32b' | 'llama-3.3-70b-versatile' | 'whisper-large-v3' | 'deepseek-r1-distill-llama-70b' | 'llama-guard-3-8b' | 'llama3-70b-8192' | 'whisper-large-v3-turbo' | 'moonshotai/kimi-k2-instruct-0905' | 'moonshotai/kimi-k2-instruct' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-safeguard-20b' | 'openai/gpt-oss-120b' | 'groq/compound' | 'groq/compound-mini' | 'canopylabs/orpheus-arabic-saudi' | 'canopylabs/orpheus-v1-english' | 'qwen/qwen3-32b' | 'meta-llama/llama-prompt-guard-2-22m' | 'meta-llama/llama-4-scout-17b-16e-instruct' | 'meta-llama/llama-prompt-guard-2-86m' | 'meta-llama/llama-4-maverick-17b-128e-instruct' | 'meta-llama/llama-guard-4-12b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Helicone Provider
 * @see {@link https://helicone.ai/models}
 */
export const createHelicone = (apiKey: string, baseURL = 'https://ai-gateway.helicone.ai/v1') => merge(
  createChatProvider<'claude-opus-4-1-20250805' | 'claude-3.7-sonnet' | 'mistral-small' | 'chatgpt-4o-latest' | 'kimi-k2-0905' | 'gemma2-9b-it' | 'llama-3.1-8b-instant' | 'mistral-large-2411' | 'gpt-4o' | 'qwen3-vl-235b-a22b-instruct' | 'claude-3-haiku-20240307' | 'sonar-reasoning' | 'llama-prompt-guard-2-22m' | 'o3-pro' | 'claude-haiku-4-5-20251001' | 'gpt-4.1-mini-2025-04-14' | 'gemini-2.5-pro' | 'gpt-5-chat-latest' | 'grok-3-mini' | 'gpt-5.1-codex-mini' | 'grok-4-1-fast-reasoning' | 'kimi-k2-0711' | 'deepseek-v3.2' | 'grok-4-1-fast-non-reasoning' | 'qwen2.5-coder-7b-fast' | 'grok-4' | 'sonar' | 'mistral-nemo' | 'grok-code-fast-1' | 'deepseek-v3' | 'gpt-5-codex' | 'gpt-5.1-chat-latest' | 'claude-4.5-haiku' | 'gpt-4.1' | 'glm-4.6' | 'llama-3.3-70b-versatile' | 'claude-opus-4' | 'gpt-oss-20b' | 'claude-4.5-sonnet' | 'gpt-5-pro' | 'deepseek-reasoner' | 'gpt-4.1-mini' | 'qwen3-coder' | 'llama-3.1-8b-instruct-turbo' | 'claude-opus-4-1' | 'claude-4.5-opus' | 'sonar-deep-research' | 'gemini-2.5-flash-lite' | 'gemini-3-pro-preview' | 'gpt-5.1' | 'gpt-5-nano' | 'gpt-4o-mini' | 'qwen3-32b' | 'kimi-k2-thinking' | 'llama-4-scout' | 'llama-prompt-guard-2-86m' | 'claude-sonnet-4-5-20250929' | 'claude-3.5-sonnet-v2' | 'qwen3-30b-a3b' | 'o1' | 'ernie-4.5-21b-a3b-thinking' | 'deepseek-r1-distill-llama-70b' | 'claude-sonnet-4' | 'sonar-reasoning-pro' | 'deepseek-tng-r1t2-chimera' | 'gpt-4.1-nano' | 'gemma-3-12b-it' | 'o4-mini' | 'gpt-5.1-codex' | 'gemini-2.5-flash' | 'gpt-5-mini' | 'o3-mini' | 'llama-4-maverick' | 'qwen3-coder-30b-a3b-instruct' | 'llama-3.3-70b-instruct' | 'qwen3-next-80b-a3b-instruct' | 'claude-3.5-haiku' | 'gpt-oss-120b' | 'qwen3-235b-a22b-thinking' | 'hermes-2-pro-llama-3-8b' | 'o3' | 'o1-mini' | 'grok-3' | 'grok-4-fast-non-reasoning' | 'grok-4-fast-reasoning' | 'sonar-pro' | 'llama-3.1-8b-instruct' | 'gpt-5' | 'llama-guard-4' | 'deepseek-v3.1-terminus'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a HPC-AI Provider
 * @see {@link https://www.hpc-ai.com/doc/docs/quickstart/}
 */
export const createHpcAi = (apiKey: string, baseURL = 'https://api.hpc-ai.com/inference/v1') => merge(
  createChatProvider<'moonshotai/kimi-k2.5' | 'zai-org/glm-5.1' | 'minimax/minimax-m2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Hugging Face Provider
 * @see {@link https://huggingface.co/docs/inference-providers}
 */
export const createHuggingface = (apiKey: string, baseURL = 'https://router.huggingface.co/v1') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.2' | 'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-K2-Thinking' | 'moonshotai/Kimi-K2.6' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2-Instruct-0905' | 'zai-org/GLM-4.7' | 'zai-org/GLM-4.7-Flash' | 'zai-org/GLM-5' | 'zai-org/GLM-5.1' | 'XiaomiMiMo/MiMo-V2-Flash' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2.7' | 'MiniMaxAI/MiniMax-M2.5' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3-Embedding-4B' | 'Qwen/Qwen3-Coder-Next' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-Embedding-8B' | 'deepseek-ai/DeepSeek-V4-Pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a iFlow Provider
 * @see {@link https://platform.iflow.cn/en/docs}
 */
export const createIflowcn = (apiKey: string, baseURL = 'https://apis.iflow.cn/v1') => merge(
  createChatProvider<'qwen3-max-preview' | 'kimi-k2-0905' | 'qwen3-vl-plus' | 'qwen3-235b' | 'deepseek-r1' | 'deepseek-v3.2' | 'deepseek-v3' | 'qwen3-max' | 'glm-4.6' | 'qwen3-32b' | 'qwen3-235b-a22b-thinking-2507' | 'kimi-k2' | 'qwen3-coder-plus' | 'qwen3-235b-a22b-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Inception Provider
 * @see {@link https://platform.inceptionlabs.ai/docs}
 */
export const createInception = (apiKey: string, baseURL = 'https://api.inceptionlabs.ai/v1/') => merge(
  createChatProvider<'mercury-edit-2' | 'mercury-2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Inceptron Provider
 * @see {@link https://docs.inceptron.io}
 */
export const createInceptron = (apiKey: string, baseURL = 'https://api.inceptron.io/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K2.6' | 'zai-org/GLM-5.1-FP8' | 'nvidia/llama-3.3-70b-instruct-fp8' | 'MiniMaxAI/MiniMax-M2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Inference Provider
 * @see {@link https://inference.net/models}
 */
export const createInference = (apiKey: string, baseURL = 'https://inference.net/v1') => merge(
  createChatProvider<'osmosis/osmosis-structure-0.6b' | 'mistral/mistral-nemo-12b-instruct' | 'qwen/qwen-2.5-7b-vision-instruct' | 'qwen/qwen3-embedding-4b' | 'google/gemma-3' | 'meta/llama-3.2-1b-instruct' | 'meta/llama-3.2-11b-vision-instruct' | 'meta/llama-3.2-3b-instruct' | 'meta/llama-3.1-8b-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a IO.NET Provider
 * @see {@link https://io.net/docs/guides/intelligence/io-intelligence}
 */
export const createIoNet = (apiKey: string, baseURL = 'https://api.intelligence.io.solutions/api/v1') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-R1-0528' | 'moonshotai/Kimi-K2-Thinking' | 'moonshotai/Kimi-K2-Instruct-0905' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'zai-org/GLM-4.6' | 'Intel/Qwen3-Coder-480B-A35B-Instruct-int4-mixed-ar' | 'mistralai/Devstral-Small-2505' | 'mistralai/Mistral-Large-Instruct-2411' | 'mistralai/Mistral-Nemo-Instruct-2407' | 'mistralai/Magistral-Small-2506' | 'meta-llama/Llama-3.2-90B-Vision-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen2.5-VL-32B-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Jiekou.AI Provider
 * @see {@link https://docs.jiekou.ai/docs/support/quickstart?utm_source=github_models.dev}
 */
export const createJiekou = (apiKey: string, baseURL = 'https://api.jiekou.ai/openai') => merge(
  createChatProvider<'claude-opus-4-1-20250805' | 'gpt-5.2' | 'claude-haiku-4-5-20251001' | 'gemini-2.5-pro' | 'gpt-5-chat-latest' | 'gpt-5.1-codex-mini' | 'grok-4-1-fast-reasoning' | 'gpt-5.2-pro' | 'grok-4-1-fast-non-reasoning' | 'grok-code-fast-1' | 'gpt-5-codex' | 'grok-4-0709' | 'gemini-2.5-flash-preview-05-20' | 'gemini-2.5-pro-preview-06-05' | 'gpt-5-pro' | 'gemini-2.5-flash-lite-preview-09-2025' | 'gemini-2.5-flash-lite' | 'gemini-3-pro-preview' | 'gpt-5.1' | 'gpt-5-nano' | 'claude-opus-4-5-20251101' | 'claude-opus-4-20250514' | 'claude-sonnet-4-5-20250929' | 'gemini-2.5-flash-lite-preview-06-17' | 'gpt-5.1-codex-max' | 'gemini-3-flash-preview' | 'o4-mini' | 'gpt-5.1-codex' | 'gpt-5.2-codex' | 'gemini-2.5-flash' | 'gpt-5-mini' | 'o3-mini' | 'claude-opus-4-6' | 'o3' | 'claude-sonnet-4-20250514' | 'grok-4-fast-non-reasoning' | 'grok-4-fast-reasoning' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-instruct' | 'zai-org/glm-4.5v' | 'zai-org/glm-4.7-flash' | 'zai-org/glm-4.5' | 'zai-org/glm-4.7' | 'minimax/minimax-m2.1' | 'qwen/qwen3-30b-a3b-fp8' | 'qwen/qwen3-coder-next' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-235b-a22b-fp8' | 'qwen/qwen3-32b-fp8' | 'qwen/qwen3-235b-a22b-instruct-2507' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen3-next-80b-a3b-instruct' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-v3-0324' | 'deepseek/deepseek-v3.1' | 'minimaxai/minimax-m1-80k' | 'xiaomimimo/mimo-v2-flash' | 'baidu/ernie-4.5-vl-424b-a47b' | 'baidu/ernie-4.5-300b-a47b-paddle'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Kilo Gateway Provider
 * @see {@link https://kilo.ai}
 */
export const createKilo = (apiKey: string, baseURL = 'https://api.kilo.ai/api/gateway') => merge(
  createChatProvider<'prime-intellect/intellect-3' | 'liquid/lfm-2-24b-a2b' | '~anthropic/claude-haiku-latest' | '~anthropic/claude-opus-latest' | '~anthropic/claude-sonnet-latest' | 'undi95/remm-slerp-l2-13b' | 'inception/mercury-2' | 'sao10k/l3.1-70b-hanami-x1' | 'sao10k/l3.1-euryale-70b' | 'sao10k/l3-lunaris-8b' | 'sao10k/l3-euryale-70b' | 'sao10k/l3.3-euryale-70b' | 'ibm-granite/granite-4.0-h-micro' | 'ibm-granite/granite-4.1-8b' | 'cohere/command-r-08-2024' | 'cohere/command-r-plus-08-2024' | 'cohere/command-r7b-12-2024' | 'cohere/command-a' | 'thedrummer/unslopnemo-12b' | 'thedrummer/cydonia-24b-v4.1' | 'thedrummer/rocinante-12b' | 'thedrummer/skyfall-36b-v2' | 'bytedance/ui-tars-1.5-7b' | 'alfredpros/codellama-7b-instruct-solidity' | 'deepcogito/cogito-v2.1-671b' | '~openai/gpt-mini-latest' | '~openai/gpt-latest' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2' | 'moonshotai/kimi-k2.6' | 'morph/morph-v3-large' | 'morph/morph-v3-fast' | 'bytedance-seed/seed-1.6-flash' | 'bytedance-seed/seed-1.6' | 'bytedance-seed/seed-2.0-mini' | 'bytedance-seed/seed-2.0-lite' | 'z-ai/glm-5.1' | 'z-ai/glm-5v-turbo' | 'z-ai/glm-4.5-air' | 'z-ai/glm-4.5v' | 'z-ai/glm-4.7-flash' | 'z-ai/glm-4.6' | 'z-ai/glm-4.5' | 'z-ai/glm-5-turbo' | 'z-ai/glm-4.7' | 'z-ai/glm-4-32b' | 'z-ai/glm-5' | 'z-ai/glm-4.6v' | 'openai/gpt-4o' | 'openai/gpt-4o-mini-search-preview' | 'openai/gpt-5.2' | 'openai/gpt-3.5-turbo' | 'openai/o3-pro' | 'openai/gpt-3.5-turbo-16k' | 'openai/gpt-5.4-nano' | 'openai/gpt-5-image-mini' | 'openai/gpt-5.5-pro' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.2-pro' | 'openai/gpt-4o-2024-05-13' | 'openai/gpt-4-0314' | 'openai/gpt-5.4-image-2' | 'openai/gpt-3.5-turbo-instruct' | 'openai/gpt-5-codex' | 'openai/gpt-5.1-chat' | 'openai/gpt-4.1' | 'openai/gpt-audio' | 'openai/gpt-4o-search-preview' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-safeguard-20b' | 'openai/gpt-5-pro' | 'openai/gpt-4.1-mini' | 'openai/gpt-4-turbo-preview' | 'openai/gpt-4o-audio-preview' | 'openai/gpt-5-image' | 'openai/gpt-5.1' | 'openai/gpt-5-nano' | 'openai/gpt-5.4' | 'openai/gpt-4-1106-preview' | 'openai/gpt-4o-mini' | 'openai/o1-pro' | 'openai/gpt-4-turbo' | 'openai/gpt-5.4-mini' | 'openai/o1' | 'openai/gpt-3.5-turbo-0613' | 'openai/o3-mini-high' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-5.5' | 'openai/gpt-5.4-pro' | 'openai/o4-mini-high' | 'openai/o4-mini-deep-research' | 'openai/gpt-4.1-nano' | 'openai/gpt-4' | 'openai/o4-mini' | 'openai/gpt-5.1-codex' | 'openai/gpt-4o-2024-11-20' | 'openai/gpt-5.2-codex' | 'openai/gpt-5-chat' | 'openai/gpt-4o-mini-2024-07-18' | 'openai/gpt-5-mini' | 'openai/o3-mini' | 'openai/gpt-5.3-codex' | 'openai/gpt-5.2-chat' | 'openai/gpt-4o-2024-08-06' | 'openai/gpt-chat-latest' | 'openai/gpt-oss-120b' | 'openai/gpt-audio-mini' | 'openai/o3' | 'openai/o3-deep-research' | 'openai/gpt-5.3-chat' | 'openai/gpt-5' | 'relace/relace-apply-3' | 'relace/relace-search' | 'aion-labs/aion-1.0' | 'aion-labs/aion-rp-llama-3.1-8b' | 'aion-labs/aion-2.0' | 'aion-labs/aion-1.0-mini' | 'openrouter/pareto-code' | 'openrouter/free' | 'openrouter/owl-alpha' | 'openrouter/bodybuilder' | 'openrouter/auto' | 'switchpoint/router' | 'mancer/weaver' | 'amazon/nova-pro-v1' | 'amazon/nova-2-lite-v1' | 'amazon/nova-lite-v1' | 'amazon/nova-premier-v1' | 'amazon/nova-micro-v1' | 'writer/palmyra-x5' | 'inflection/inflection-3-productivity' | 'inflection/inflection-3-pi' | 'minimax/minimax-m2.1' | 'minimax/minimax-m2' | 'minimax/minimax-m1' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2-her' | 'minimax/minimax-m2.7' | 'minimax/minimax-01' | 'x-ai/grok-4.20' | 'x-ai/grok-code-fast-1:optimized:free' | 'x-ai/grok-4.20-multi-agent' | 'x-ai/grok-4.3' | 'kwaipilot/kat-coder-pro-v2' | 'nousresearch/hermes-4-405b' | 'nousresearch/hermes-3-llama-3.1-405b' | 'nousresearch/hermes-4-70b' | 'nousresearch/hermes-3-llama-3.1-70b' | 'nousresearch/hermes-2-pro-llama-3-8b' | 'nvidia/llama-3.3-nemotron-super-49b-v1.5' | 'nvidia/nemotron-3-super-120b-a12b:free' | 'nvidia/nemotron-3-super-120b-a12b' | 'nvidia/nemotron-nano-9b-v2' | 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free' | 'nvidia/nemotron-3-nano-30b-a3b' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-opus-4.6-fast' | 'anthropic/claude-3-haiku' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-opus-4.7-fast' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-opus-4' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-3.5-haiku' | 'anthropic/claude-opus-4.7' | 'inclusionai/ring-2.6-1t' | 'inclusionai/ling-2.6-1t' | 'inclusionai/ling-2.6-flash' | 'mistralai/mistral-large-2512' | 'mistralai/mistral-7b-instruct-v0.1' | 'mistralai/mistral-large-2411' | 'mistralai/mistral-saba' | 'mistralai/codestral-2508' | 'mistralai/mistral-small-3.2-24b-instruct' | 'mistralai/mistral-small-2603' | 'mistralai/mistral-nemo' | 'mistralai/devstral-2512' | 'mistralai/mistral-medium-3-5' | 'mistralai/ministral-14b-2512' | 'mistralai/mixtral-8x22b-instruct' | 'mistralai/voxtral-small-24b-2507' | 'mistralai/devstral-medium' | 'mistralai/pixtral-large-2411' | 'mistralai/mistral-large-2407' | 'mistralai/mistral-large' | 'mistralai/ministral-3b-2512' | 'mistralai/mistral-medium-3' | 'mistralai/mistral-small-24b-instruct-2501' | 'mistralai/devstral-small' | 'mistralai/ministral-8b-2512' | 'mistralai/mistral-medium-3.1' | 'mistralai/mistral-small-3.1-24b-instruct' | 'qwen/qwen3-vl-8b-thinking' | 'qwen/qwen3-30b-a3b-instruct-2507' | 'qwen/qwen3.5-plus-20260420' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'qwen/qwen3.6-27b' | 'qwen/qwen2.5-vl-72b-instruct' | 'qwen/qwen3.5-plus-02-15' | 'qwen/qwen3-vl-235b-a22b-thinking' | 'qwen/qwen3-8b' | 'qwen/qwen-2.5-72b-instruct' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen-plus-2025-07-28:thinking' | 'qwen/qwen3-max-thinking' | 'qwen/qwen3-max' | 'qwen/qwen3-235b-a22b-2507' | 'qwen/qwen3-235b-a22b' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen-2.5-coder-32b-instruct' | 'qwen/qwen3.5-9b' | 'qwen/qwen3-coder-next' | 'qwen/qwen3-coder' | 'qwen/qwen3.6-plus' | 'qwen/qwen3-coder-flash' | 'qwen/qwen3-30b-a3b-thinking-2507' | 'qwen/qwen3-32b' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3.5-flash-02-23' | 'qwen/qwen3-30b-a3b' | 'qwen/qwen3-vl-30b-a3b-thinking' | 'qwen/qwen3.5-35b-a3b' | 'qwen/qwen3.6-35b-a3b' | 'qwen/qwen-plus-2025-07-28' | 'qwen/qwen3-vl-8b-instruct' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen3.6-max-preview' | 'qwen/qwen3-coder-30b-a3b-instruct' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3.5-27b' | 'qwen/qwen3.6-flash' | 'qwen/qwen3-vl-30b-a3b-instruct' | 'qwen/qwen-plus' | 'qwen/qwen3-coder-plus' | 'qwen/qwen-2.5-7b-instruct' | 'qwen/qwen3-14b' | 'qwen/qwen3-vl-32b-instruct' | 'tencent/hy3-preview' | 'tencent/hunyuan-a13b-instruct' | 'google/gemini-3-pro-image-preview' | 'google/gemma-4-26b-a4b-it' | 'google/gemini-3.1-flash-lite' | 'google/gemini-2.5-pro' | 'google/gemma-3-27b-it' | 'google/gemma-4-31b-it' | 'google/gemini-3.1-flash-image-preview' | 'google/gemini-2.5-pro-preview' | 'google/gemma-3n-e4b-it' | 'google/gemini-2.5-pro-preview-05-06' | 'google/gemini-2.5-flash-lite-preview-09-2025' | 'google/gemini-2.5-flash-lite' | 'google/lyria-3-clip-preview' | 'google/gemini-3.1-pro-preview-customtools' | 'google/gemini-2.0-flash-lite-001' | 'google/gemini-2.0-flash-001' | 'google/gemini-3.1-flash-lite-preview' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3-flash-preview' | 'google/gemma-2-27b-it' | 'google/lyria-3-pro-preview' | 'google/gemma-3-12b-it' | 'google/gemini-2.5-flash' | 'google/gemini-2.5-flash-image' | 'google/gemma-3-4b-it' | 'microsoft/phi-4' | 'microsoft/wizardlm-2-8x22b' | 'microsoft/phi-4-mini-instruct' | '~google/gemini-flash-latest' | '~google/gemini-pro-latest' | 'gryphe/mythomax-l2-13b' | 'nex-agi/deepseek-v3.1-nex-n1' | 'upstage/solar-pro-3' | 'anthracite-org/magnum-v4-72b' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-chat' | 'deepseek/deepseek-r1' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-v3.2-speciale' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-v4-flash:free' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-chat-v3-0324' | 'deepseek/deepseek-r1-distill-llama-70b' | 'deepseek/deepseek-r1-distill-qwen-32b' | 'deepseek/deepseek-chat-v3.1' | 'deepseek/deepseek-v3.1-terminus' | 'perplexity/sonar' | 'perplexity/sonar-deep-research' | 'perplexity/sonar-reasoning-pro' | 'perplexity/sonar-pro-search' | 'perplexity/sonar-pro' | 'ai21/jamba-large-1.7' | 'meta-llama/llama-3.1-70b-instruct' | 'meta-llama/llama-4-scout' | 'meta-llama/llama-3.2-1b-instruct' | 'meta-llama/llama-guard-3-8b' | 'meta-llama/llama-3-70b-instruct' | 'meta-llama/llama-3.2-11b-vision-instruct' | 'meta-llama/llama-3-8b-instruct' | 'meta-llama/llama-4-maverick' | 'meta-llama/llama-3.3-70b-instruct' | 'meta-llama/llama-3.2-3b-instruct' | 'meta-llama/llama-guard-4-12b' | 'meta-llama/llama-3.1-8b-instruct' | 'arcee-ai/spotlight' | 'arcee-ai/trinity-mini' | 'arcee-ai/maestro-reasoning' | 'arcee-ai/coder-large' | 'arcee-ai/virtuoso-large' | 'arcee-ai/trinity-large-thinking' | 'arcee-ai/trinity-large-preview' | 'kilo-auto/frontier' | 'kilo-auto/balanced' | 'kilo-auto/small' | 'kilo-auto/free' | 'essentialai/rnj-1-instruct' | 'alibaba/tongyi-deepresearch-30b-a3b' | 'stepfun/step-3.5-flash' | 'stepfun/step-3.5-flash:free' | 'perceptron/perceptron-mk1' | 'allenai/olmo-3-32b-think' | 'rekaai/reka-flash-3' | 'rekaai/reka-edge' | 'baidu/qianfan-ocr-fast' | 'baidu/ernie-4.5-vl-424b-a47b' | 'baidu/ernie-4.5-21b-a3b' | 'baidu/ernie-4.5-300b-a47b' | 'baidu/ernie-4.5-21b-a3b-thinking' | 'baidu/cobuddy:free' | 'baidu/ernie-4.5-vl-28b-a3b' | '~moonshotai/kimi-latest' | 'poolside/laguna-xs.2:free' | 'poolside/laguna-m.1:free' | 'xiaomi/mimo-v2-omni' | 'xiaomi/mimo-v2.5-pro' | 'xiaomi/mimo-v2-flash' | 'xiaomi/mimo-v2-pro' | 'xiaomi/mimo-v2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Kimi For Coding Provider
 * @see {@link https://www.kimi.com/coding/docs/en/third-party-agents.html}
 */
export const createKimiForCoding = (apiKey: string, baseURL = 'https://api.kimi.com/coding/v1') => merge(
  createChatProvider<'kimi-k2-thinking' | 'k2p6' | 'k2p5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a KUAE Cloud Coding Plan Provider
 * @see {@link https://docs.mthreads.com/kuaecloud/kuaecloud-doc-online/coding_plan/}
 */
export const createKuaeCloudCodingPlan = (apiKey: string, baseURL = 'https://coding-plan-endpoint.kuaecloud.net/v1') => merge(
  createChatProvider<'GLM-4.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Lilac Provider
 * @see {@link https://docs.getlilac.com/inference/models}
 */
export const createLilac = (apiKey: string, baseURL = 'https://api.getlilac.com/v1') => merge(
  createChatProvider<'moonshotai/kimi-k2.6' | 'zai-org/glm-5.1' | 'google/gemma-4-31b-it' | 'minimaxai/minimax-m2.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Llama Provider
 * @see {@link https://llama.developer.meta.com/docs/models}
 */
export const createLlama = (apiKey: string, baseURL = 'https://api.llama.com/compat/v1/') => merge(
  createChatProvider<'llama-4-maverick-17b-128e-instruct-fp8' | 'cerebras-llama-4-scout-17b-16e-instruct' | 'llama-3.3-8b-instruct' | 'llama-4-scout-17b-16e-instruct-fp8' | 'cerebras-llama-4-maverick-17b-128e-instruct' | 'llama-3.3-70b-instruct' | 'groq-llama-4-maverick-17b-128e-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a LLM Gateway Provider
 * @see {@link https://llmgateway.io/docs}
 */
export const createLlmgateway = (apiKey: string, baseURL = 'https://api.llmgateway.io/v1') => merge(
  createChatProvider<'gemma-2-27b-it-together' | 'qwen3-30b-a3b-instruct-2507' | 'claude-3-7-sonnet' | 'qwen3-vl-235b-a22b-instruct' | 'seed-1-6-250615' | 'gpt-4o-mini-search-preview' | 'seed-1-6-flash-250715' | 'qwen2-5-vl-32b-instruct' | 'gemma-3-27b' | 'llama-3.1-70b-instruct' | 'qwen3-vl-235b-a22b-thinking' | 'grok-4-1-fast-reasoning' | 'seed-1-6-250915' | 'deepseek-r1-0528' | 'codestral-2508' | 'qwen3-vl-flash' | 'glm-4.6v-flash' | 'deepseek-v3.2' | 'gemini-pro-latest' | 'qwen3-30b-a3b-fp8' | 'qwen-coder-plus' | 'minimax-m2.1-lightning' | 'llama-3.1-nemotron-ultra-253b' | 'qwen-max-latest' | 'glm-4.5-airx' | 'llama-3.2-11b-instruct' | 'grok-4-0709' | 'ministral-14b-2512' | 'gpt-4o-search-preview' | 'gpt-oss-20b' | 'qwen3-coder-next' | 'qwen3-30b-a3b-thinking-2507' | 'llama-4-scout' | 'ministral-3b-2512' | 'qwen3-4b-fp8' | 'qwen3-235b-a22b-fp8' | 'qwen25-coder-7b' | 'qwen3-vl-30b-a3b-thinking' | 'deepseek-v3.1' | 'llama-4-scout-17b-instruct' | 'qwen3-32b-fp8' | 'claude-3-opus' | 'qwen3-235b-a22b-instruct-2507' | 'custom' | 'llama-3-70b-instruct' | 'qwen3-vl-8b-instruct' | 'qwen3-235b-a22b-thinking-2507' | 'kimi-k2' | 'claude-3-5-haiku' | 'llama-3-8b-instruct' | 'gemma-3-1b-it' | 'qwen3-max-2026-01-23' | 'glm-4.6v-flashx' | 'minimax-text-01' | 'llama-3.2-3b-instruct' | 'gpt-oss-120b' | 'hermes-2-pro-llama-3-8b' | 'ministral-8b-2512' | 'seed-1-8-251228' | 'qwen3-vl-30b-a3b-instruct' | 'llama-4-maverick-17b-instruct' | 'auto' | 'glm-4.5-x' | 'glm-4-32b-0414-128k' | 'grok-4-fast-reasoning' | 'qwen-plus-latest' | 'llama-3.1-8b-instruct' | 'qwen37-max' | 'claude-opus-4-1-20250805' | 'qwen2-5-vl-72b-instruct' | 'mistral-large-2512' | 'minimax-m2.1' | 'kimi-k2.5' | 'claude-haiku-4-5' | 'minimax-m2.7-highspeed' | 'glm-5.1' | 'gpt-4o' | 'qwen3-vl-plus' | 'gemini-3.5-flash' | 'gpt-5.2' | 'mimo-v2-omni' | 'gpt-3.5-turbo' | 'gemini-3.1-flash-lite' | 'claude-haiku-4-5-20251001' | 'grok-4-3' | 'gpt-5.4-nano' | 'gemini-2.5-pro' | 'gpt-5-chat-latest' | 'minimax-m2' | 'gpt-5.5-pro' | 'gpt-5.1-codex-mini' | 'qwq-plus' | 'gpt-5.2-pro' | 'deepseek-v4-pro' | 'sonar' | 'claude-sonnet-4-5' | 'qwen35-397b-a17b' | 'glm-4.7-flashx' | 'qwen3-max' | 'devstral-2512' | 'glm-4.5-air' | 'mimo-v2.5-pro' | 'minimax-m2.5' | 'glm-4.5v' | 'glm-4.7-flash' | 'qwen-flash' | 'devstral-small-2507' | 'gpt-4.1' | 'glm-4.6' | 'glm-4.5' | 'qwen-turbo' | 'qwen-max' | 'claude-sonnet-4-6' | 'gpt-5-pro' | 'minimax-m2.7' | 'gpt-4.1-mini' | 'gemini-2.5-flash-lite' | 'qwen3.6-plus' | 'gpt-5.1' | 'gpt-5-nano' | 'qwen3-coder-flash' | 'gpt-5.4' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'claude-3-5-sonnet-20241022' | 'qwen3-32b' | 'qwen3-next-80b-a3b-thinking' | 'claude-opus-4-5-20251101' | 'kimi-k2-thinking' | 'gemini-2.0-flash-lite' | 'claude-opus-4-20250514' | 'gpt-5.4-mini' | 'kimi-k2-thinking-turbo' | 'mimo-v2-flash' | 'claude-sonnet-4-5-20250929' | 'o1' | 'mimo-v2-pro' | 'qwen-vl-plus' | 'qwen-omni-turbo' | 'glm-4.5-flash' | 'claude-opus-4-7' | 'mimo-v2.5' | 'deepseek-v4-flash' | 'gemini-3.1-flash-lite-preview' | 'gemini-3.1-pro-preview' | 'grok-4-20-beta-0309-reasoning' | 'mistral-small-2506' | 'gpt-5.5' | 'gemini-3-flash-preview' | 'qwen3.6-35b-a3b' | 'gpt-5.4-pro' | 'gpt-5.2-chat-latest' | 'mistral-large-latest' | 'qwen3-coder-480b-a35b-instruct' | 'sonar-reasoning-pro' | 'gpt-4.1-nano' | 'gpt-4' | 'o4-mini' | 'gpt-5.1-codex' | 'gpt-5.2-codex' | 'qwen3.6-max-preview' | 'gemini-2.5-flash' | 'gpt-5-mini' | 'o3-mini' | 'gpt-5.3-codex' | 'grok-4-20-reasoning' | 'claude-opus-4-6' | 'qwen3-coder-30b-a3b-instruct' | 'llama-3.3-70b-instruct' | 'qwen3-next-80b-a3b-instruct' | 'grok-4-20-non-reasoning' | 'minimax-m2.5-highspeed' | 'glm-4.7' | 'gemini-2.0-flash' | 'claude-3-7-sonnet-20250219' | 'o3' | 'claude-sonnet-4-20250514' | 'qwen-vl-max' | 'qwen-plus' | 'glm-5' | 'grok-4-20-beta-0309-non-reasoning' | 'qwen3-coder-plus' | 'kimi-k2.6' | 'sonar-pro' | 'glm-4.6v' | 'pixtral-large-latest' | 'gpt-5' | 'gpt-5.3-chat-latest'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a LMStudio Provider
 * @see {@link https://lmstudio.ai/models}
 */
export const createLmstudio = (apiKey: string, baseURL = 'http://127.0.0.1:1234/v1') => merge(
  createChatProvider<'openai/gpt-oss-20b' | 'qwen/qwen3-coder-30b' | 'qwen/qwen3-30b-a3b-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a LucidQuery AI Provider
 * @see {@link https://lucidquery.com/api/docs}
 */
export const createLucidquery = (apiKey: string, baseURL = 'https://lucidquery.com/api/v1') => merge(
  createChatProvider<'lucidquery-nexus-coder' | 'lucidnova-rf1-100b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Meganova Provider
 * @see {@link https://docs.meganova.ai}
 */
export const createMeganova = (apiKey: string, baseURL = 'https://api.meganova.ai/v1') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324' | 'deepseek-ai/DeepSeek-V3.2-Exp' | 'deepseek-ai/DeepSeek-V3.2' | 'moonshotai/Kimi-K2-Thinking' | 'moonshotai/Kimi-K2.5' | 'zai-org/GLM-4.7' | 'zai-org/GLM-5' | 'zai-org/GLM-4.6' | 'mistralai/Mistral-Nemo-Instruct-2407' | 'mistralai/Mistral-Small-3.2-24B-Instruct-2506' | 'meta-llama/Llama-3.3-70B-Instruct' | 'XiaomiMiMo/MiMo-V2-Flash' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2.5' | 'Qwen/Qwen3.5-Plus' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen2.5-VL-32B-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax (minimax.io) Provider
 * @see {@link https://platform.minimax.io/docs/guides/quickstart}
 */
export const createMinimax = (apiKey: string, baseURL = 'https://api.minimax.io/v1/') => merge(
  createChatProvider<'MiniMax-M2.1' | 'MiniMax-M2.7' | 'MiniMax-M2.5' | 'MiniMax-M2.7-highspeed' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax (minimaxi.com) Provider
 * @see {@link https://platform.minimaxi.com/docs/guides/quickstart}
 */
export const createMinimaxCn = (apiKey: string, baseURL = 'https://api.minimaxi.com/v1/') => merge(
  createChatProvider<'MiniMax-M2.1' | 'MiniMax-M2.7' | 'MiniMax-M2.5' | 'MiniMax-M2.7-highspeed' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax Token Plan (minimaxi.com) Provider
 * @see {@link https://platform.minimaxi.com/docs/token-plan/intro}
 */
export const createMinimaxCnCodingPlan = (apiKey: string, baseURL = 'https://api.minimaxi.com/anthropic/v1') => merge(
  createChatProvider<'MiniMax-M2.1' | 'MiniMax-M2.7' | 'MiniMax-M2.5' | 'MiniMax-M2.7-highspeed' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax Token Plan (minimax.io) Provider
 * @see {@link https://platform.minimax.io/docs/token-plan/intro}
 */
export const createMinimaxCodingPlan = (apiKey: string, baseURL = 'https://api.minimax.io/anthropic/v1') => merge(
  createChatProvider<'MiniMax-M2.1' | 'MiniMax-M2.7' | 'MiniMax-M2.5' | 'MiniMax-M2.7-highspeed' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Mistral Provider
 * @see {@link https://docs.mistral.ai/getting-started/models/}
 */
export const createMistral = (apiKey: string, baseURL = 'https://api.mistral.ai/v1/') => merge(
  createChatProvider<'mistral-medium-2604' | 'mistral-large-2512' | 'ministral-3b-latest' | 'mistral-large-2411' | 'pixtral-12b' | 'codestral-latest' | 'open-mixtral-8x22b' | 'mistral-small-latest' | 'mistral-small-2603' | 'mistral-nemo' | 'open-mistral-7b' | 'mistral-medium-2508' | 'devstral-medium-2507' | 'devstral-small-2505' | 'devstral-2512' | 'magistral-medium-latest' | 'magistral-small' | 'devstral-small-2507' | 'mistral-medium-2505' | 'devstral-medium-latest' | 'mistral-small-2506' | 'mistral-large-latest' | 'labs-devstral-small-2512' | 'mistral-embed' | 'open-mixtral-8x7b' | 'ministral-8b-latest' | 'pixtral-large-latest' | 'mistral-medium-latest'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Mixlayer Provider
 * @see {@link https://docs.mixlayer.com}
 */
export const createMixlayer = (apiKey: string, baseURL = 'https://models.mixlayer.ai/v1') => merge(
  createChatProvider<'qwen/qwen3.5-122b-a10b' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen3.5-9b' | 'qwen/qwen3.5-35b-a3b' | 'qwen/qwen3.5-27b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Moark Provider
 * @see {@link https://moark.com/docs/openapi/v1#tag/%E6%96%87%E6%9C%AC%E7%94%9F%E6%88%90}
 */
export const createMoark = (apiKey: string, baseURL = 'https://moark.com/v1') => merge(
  createChatProvider<'MiniMax-M2.1' | 'GLM-4.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a ModelScope Provider
 * @see {@link https://modelscope.cn/docs/model-service/API-Inference/intro}
 */
export const createModelscope = (apiKey: string, baseURL = 'https://api-inference.modelscope.cn/v1') => merge(
  createChatProvider<'ZhipuAI/GLM-4.5' | 'ZhipuAI/GLM-4.6' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-30B-A3B-Thinking-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Moonshot AI Provider
 * @see {@link https://platform.moonshot.ai/docs/api/chat}
 */
export const createMoonshotai = (apiKey: string, baseURL = 'https://api.moonshot.ai/v1') => merge(
  createChatProvider<'kimi-k2.5' | 'kimi-k2-0905-preview' | 'kimi-k2-thinking' | 'kimi-k2-0711-preview' | 'kimi-k2-thinking-turbo' | 'kimi-k2.6' | 'kimi-k2-turbo-preview'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Moonshot AI (China) Provider
 * @see {@link https://platform.moonshot.cn/docs/api/chat}
 */
export const createMoonshotaiCn = (apiKey: string, baseURL = 'https://api.moonshot.cn/v1') => merge(
  createChatProvider<'kimi-k2-turbo-preview' | 'kimi-k2.6' | 'kimi-k2-thinking-turbo' | 'kimi-k2-0711-preview' | 'kimi-k2-thinking' | 'kimi-k2-0905-preview' | 'kimi-k2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Morph Provider
 * @see {@link https://docs.morphllm.com/api-reference/introduction}
 */
export const createMorph = (apiKey: string, baseURL = 'https://api.morphllm.com/v1') => merge(
  createChatProvider<'morph-v3-large' | 'auto' | 'morph-v3-fast'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a NanoGPT Provider
 * @see {@link https://docs.nano-gpt.com}
 */
export const createNanoGpt = (apiKey: string, baseURL = 'https://nano-gpt.com/api/v1') => merge(
  createChatProvider<'glm-zero-preview' | 'qwen3-30b-a3b-instruct-2507' | 'hunyuan-t1-latest' | 'claude-opus-4-thinking:32000' | 'Llama-3.3-70B-GeneticLemonade-Opus' | 'claude-opus-4-1-20250805' | 'command-a-reasoning-08-2025' | 'Llama-3.3-70B-Magnum-v4-SE' | 'Llama-3.3-70B-The-Omega-Directive-Unslop-v2.1' | 'Llama-3.3-70B-StrawberryLemonade-v1.0' | 'Llama-3.3+(3.1v3.3)-70B-Hanami-x1' | 'hidream' | 'glm-4.1v-thinking-flashx' | 'gemini-2.5-flash-preview-04-17:thinking' | 'auto-model-premium' | 'jamba-large-1.6' | 'gemini-exp-1206' | 'Gemma-3-27B-CardProjector-v4' | 'gemini-3-pro-image-preview' | 'claude-3-7-sonnet-thinking:8192' | 'doubao-seed-2-0-lite-260215' | 'claude-sonnet-4-thinking:32768' | 'doubao-seed-2-0-pro-260215' | 'Llama-3.3-70B-Progenitor-V3.3' | 'gemini-2.5-pro-exp-03-25' | 'ernie-4.5-turbo-vl-32k' | 'deepseek-chat' | 'step-3' | 'Llama-3.3-70B-RAWMAW' | 'GLM-4.5-Air-Derestricted-Iceblink-v2-ReExtract' | 'universal-summarizer' | 'GLM-4.5-Air-Derestricted-Steam-ReExtract' | 'Llama-3.3-70B-Shakudo' | 'Llama-3.3-70B-Predatorial-Extasy' | 'gemini-2.5-pro-preview-03-25' | 'Llama-3.3-70B-Cu-Mai-R1' | 'gemini-2.5-flash-preview-09-2025' | 'ernie-x1.1-preview' | 'deepseek-r1' | 'glm-z1-airx' | 'claude-haiku-4-5-20251001' | 'v0-1.5-md' | 'claude-3-5-sonnet-20240620' | 'qwen3-vl-235b-a22b-thinking' | 'glm-4-plus' | 'fastgpt' | 'Llama-3.3-70B-Anthrobomination' | 'Llama-3.3-70B-Ignition-v0.1' | 'gemini-2.5-pro' | 'exa-research' | 'gemini-2.0-pro-exp-02-05' | 'ernie-4.5-8k-preview' | 'auto-model-basic' | 'glm-4-long' | 'qwq-32b' | 'doubao-1-5-thinking-pro-250415' | 'Llama-3.3-70B-GeneticLemonade-Unleashed-v3' | 'exa-research-pro' | 'gemini-2.5-flash-preview-04-17' | 'doubao-seed-2-0-code-preview-260215' | 'Llama-3.3-70B-Bigger-Body' | 'Llama-3.3-70B-Fallen-v1' | 'Llama-3.3-70B-Electra-R1' | 'azure-o1' | 'deepseek-v3-0324' | 'chroma' | 'claude-sonnet-4-5-20250929-thinking' | 'jamba-large' | 'Llama-3.3-70B-Nova' | 'z-image-turbo' | 'jamba-mini-1.7' | 'Llama-3.3-70B-Strawberrylemonade-v1.2' | 'doubao-seed-2-0-mini-260215' | 'sonar' | 'jamba-large-1.7' | 'glm-4-flash' | 'claude-opus-4-1-thinking:8192' | 'step-2-16k-exp' | 'Llama-3.3-70B-Damascus-R1' | 'claude-opus-4-1-thinking:32000' | 'ernie-5.0-thinking-preview' | 'Llama-3.3-70B-Mokume-Gane-R1' | 'grok-3-beta' | 'GLM-4.5-Air-Derestricted-Iceblink' | 'glm-4' | 'ernie-x1-turbo-32k' | 'claude-opus-4-1-thinking:32768' | 'GLM-4.5-Air-Derestricted-Iceblink-v2' | 'Llama-3.3-70B-Legion-V2.1' | 'deepseek-math-v2' | 'step-r1-v-mini' | 'claude-opus-4-5-20251101:thinking' | 'grok-3-mini-beta' | 'brave-research' | 'claude-3-7-sonnet-thinking:1024' | 'venice-uncensored' | 'doubao-1.5-pro-256k' | 'gemini-2.5-flash-preview-05-20' | 'KAT-Coder-Exp-72B-1010' | 'claude-opus-4-thinking:32768' | 'claude-sonnet-4-thinking:1024' | 'qwen25-vl-72b-instruct' | 'brave' | 'azure-gpt-4-turbo' | 'ernie-5.0-thinking-latest' | 'claude-3-7-sonnet-thinking:32768' | 'doubao-seed-code-preview-latest' | 'Llama-3.3-70B-Cirrus-x1' | 'doubao-1-5-thinking-vision-pro-250428' | 'qwen-turbo' | 'gemini-2.0-flash-thinking-exp-01-21' | 'deepclaude' | 'deepseek-chat-cheaper' | 'gemini-2.5-pro-preview-06-05' | 'qwen-max' | 'step-2-mini' | 'Llama-3.3-70B-Electranova-v1.0' | 'claude-3-7-sonnet-reasoner' | 'QwQ-32B-ArliAI-RpR-v1' | 'ernie-4.5-turbo-128k' | 'deepseek-reasoner' | 'glm-4-plus-0111' | 'Llama-3.3-70B-Forgotten-Abomination-v5.0' | 'doubao-seed-1-8-251215' | 'gemini-2.5-pro-preview-05-06' | 'auto-model-standard' | 'gemini-2.5-flash-lite-preview-09-2025' | 'sonar-deep-research' | 'gemini-2.5-flash-lite' | 'Gemma-3-27B-Glitter' | 'Llama-3.3-70B-Vulpecula-R1' | 'Gemma-3-27B-it-Abliterated' | 'Llama-3.3-70B-Dark-Ages-v0.1' | 'gemini-3-pro-preview' | 'asi1-mini' | 'glm-4-air' | 'kimi-thinking-preview' | 'Meta-Llama-3-1-8B-Instruct-FP8' | 'Llama-3.3+(3.1v3.3)-70B-New-Dawn-v1.1' | 'Llama-3.3-70B-MiraiFanfare' | 'jamba-mini' | 'qwen3-vl-235b-a22b-instruct-original' | 'GLM-4.5-Air-Derestricted-Steam' | 'claude-3-5-haiku-20241022' | 'claude-3-5-sonnet-20241022' | 'KAT-Coder-Pro-V1' | 'venice-uncensored:web' | 'claude-opus-4-5-20251101' | 'deepseek-r1-sambanova' | 'doubao-1-5-thinking-pro-vision-250415' | 'sarvan-medium' | 'gemini-2.0-flash-lite' | 'claude-opus-4-20250514' | 'learnlm-1.5-pro-experimental' | 'qwen-3.6-plus' | 'yi-large' | 'Baichuan-M2' | 'Llama-3.3-70B-ArliAI-RPMax-v2' | 'glm-4-air-0111' | 'claude-sonnet-4-5-20250929' | 'mistral-small-31-24b-instruct' | 'grok-3-mini-fast-beta' | 'deepseek-reasoner-cheaper' | 'Llama-3.3-70B-Aurora-Borealis' | 'claude-opus-4-thinking' | 'gemini-2.0-flash-001' | 'Gemma-3-27B-ArliAI-RPMax-v3' | 'azure-gpt-4o' | 'gemini-3-pro-preview-thinking' | 'claude-3-7-sonnet-thinking' | 'claude-opus-4-1-thinking:1024' | 'gemini-2.5-flash-preview-05-20:thinking' | 'claude-opus-4-thinking:1024' | 'doubao-1.5-vision-pro-32k' | 'Llama-3.3-70B-Fallen-R1-v1' | 'glm-4.1v-thinking-flash' | 'gemini-2.0-flash-thinking-exp-1219' | 'Llama-3.3-70B-Magnum-v4-SE-Cirrus-x1-SLERP' | 'grok-3-fast-beta' | 'gemini-2.5-flash-lite-preview-06-17' | 'study_gpt-chatgpt-4o-latest' | 'Llama-3.3-70B-ArliAI-RPMax-v3' | 'qwen-long' | 'Baichuan4-Air' | 'gemini-2.0-flash-exp-image-generation' | 'v0-1.5-lg' | 'yi-medium-200k' | 'claude-opus-4-1-thinking' | 'Mistral-Nemo-12B-Instruct-2407' | 'yi-lightning' | 'sonar-reasoning-pro' | 'claude-sonnet-4-thinking:8192' | 'azure-o3-mini' | 'Llama-3.3-70B-Argunaut-1-SFT' | 'Llama-3.3-70B-Mhnnn-x1' | 'Llama-3.3-70B-ArliAI-RPMax-v1.4' | 'Gemma-3-27B-it' | 'GLM-4.5-Air-Derestricted' | 'Baichuan4-Turbo' | 'jamba-mini-1.6' | 'qvq-max' | 'MiniMax-M1' | 'qwen3.6-max-preview' | 'gemini-2.5-flash' | 'qwen3-max-2026-01-23' | 'Gemma-3-27B-Nidum-Uncensored' | 'GLM-4.6-Derestricted-v5' | 'glm-4-airx' | 'doubao-seed-1-6-flash-250615' | 'brave-pro' | 'Llama-3.3-70B-Sapphira-0.1' | 'Llama-3.3-70B-Incandescent-Malevolence' | 'gemini-2.0-pro-reasoner' | 'hunyuan-turbos-20250226' | 'doubao-1.5-pro-32k' | 'qwen3-coder-30b-a3b-instruct' | 'Llama-3.3-70B-MS-Nevoria' | 'ernie-x1-32k' | 'auto-model' | 'azure-gpt-4o-mini' | 'claude-3-7-sonnet-thinking:128000' | 'claude-opus-4-thinking:8192' | 'glm-z1-air' | 'claude-3-7-sonnet-20250219' | 'Gemma-3-27B-Big-Tiger-v3' | 'kimi-k2-instruct-fast' | 'gemini-2.5-flash-nothinking' | 'phi-4-mini-instruct' | 'gemini-2.5-flash-lite-preview-09-2025-thinking' | 'claude-sonnet-4-thinking:64000' | 'GLM-4.5-Air-Derestricted-Iceblink-ReExtract' | 'qwen-image' | 'doubao-seed-1-6-thinking-250615' | 'MiniMax-M2' | 'Llama-3.3+(3v3.3)-70B-TenyxChat-DaybreakStorywriter' | 'Llama-3.3-70B-The-Omega-Directive-Unslop-v2.0' | 'Llama-3.3-70B-Sapphira-0.2' | 'claude-sonnet-4-20250514' | 'claude-sonnet-4-thinking' | 'gemini-2.5-flash-preview-09-2025-thinking' | 'ernie-x1-32k-preview' | 'qwen-plus' | 'v0-1.0-md' | 'Magistral-Small-2506' | 'sonar-pro' | 'Qwen2.5-32B-EVA-v0.2' | 'exa-answer' | 'doubao-seed-1-6-250615' | 'Llama-3.3-70B-Forgotten-Safeword-3.6' | 'KAT-Coder-Air-V1' | 'phi-4-multimodal-instruct' | 'soob3123/GrayLine-Qwen3-8B' | 'soob3123/Veiled-Calla-12B' | 'soob3123/amoral-gemma3-27B-v2' | 'EVA-UNIT-01/EVA-Qwen2.5-72B-v0.2' | 'EVA-UNIT-01/EVA-LLaMA-3.33-70B-v0.1' | 'EVA-UNIT-01/EVA-Qwen2.5-32B-v0.2' | 'EVA-UNIT-01/EVA-LLaMA-3.33-70B-v0.0' | 'Gryphe/MythoMax-L2-13b' | 'undi95/remm-slerp-l2-13b' | 'nothingiisreal/L3.1-70B-Celeste-V0.1-BF16' | 'deepseek-ai/deepseek-v3.2-exp' | 'deepseek-ai/DeepSeek-V3.1:thinking' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3.1-Terminus:thinking' | 'deepseek-ai/deepseek-v3.2-exp-thinking' | 'cohere/command-r-plus-08-2024' | 'cohere/command-r' | 'raifle/sorcererlm-8x22b' | 'inflatebot/MN-12B-Mag-Mell-R1' | 'TEE/qwen3-30b-a3b-instruct-2507' | 'TEE/minimax-m2.1' | 'TEE/kimi-k2.5' | 'TEE/qwen2.5-vl-72b-instruct' | 'TEE/deepseek-r1-0528' | 'TEE/deepseek-v3.2' | 'TEE/kimi-k2.5-thinking' | 'TEE/gemma-3-27b-it' | 'TEE/qwen3.5-397b-a17b' | 'TEE/glm-4.7-flash' | 'TEE/glm-4.6' | 'TEE/gpt-oss-20b' | 'TEE/qwen3-coder' | 'TEE/kimi-k2-thinking' | 'TEE/deepseek-v3.1' | 'TEE/llama3-3-70b' | 'TEE/glm-4.7' | 'TEE/gpt-oss-120b' | 'TEE/glm-5' | 'mlabonne/NeuralDaredevil-8B-abliterated' | 'MarinaraSpaghetti/NemoMix-Unleashed-12B' | 'Alibaba-NLP/Tongyi-DeepResearch-30B-A3B' | 'baseten/Kimi-K2-Instruct-FP4' | 'deepcogito/cogito-v1-preview-qwen-32B' | 'deepcogito/cogito-v2.1-671b' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-thinking-turbo-original' | 'moonshotai/kimi-k2-instruct' | 'moonshotai/Kimi-Dev-72B' | 'moonshotai/kimi-k2.5:thinking' | 'moonshotai/kimi-k2-thinking-original' | 'moonshotai/kimi-k2-instruct-0711' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/kimi-k2.6:thinking' | 'moonshotai/kimi-k2.6' | 'Envoid/Llama-3.05-NT-Storybreaker-Ministral-70B' | 'Envoid/Llama-3.05-Nemotron-Tenyxchat-Storybreaker-70B' | 'z-ai/glm-4.6:thinking' | 'z-ai/glm-4.5v' | 'z-ai/glm-4.6' | 'z-ai/glm-4.5v:thinking' | 'openai/chatgpt-4o-latest' | 'openai/gpt-4o' | 'openai/gpt-4o-mini-search-preview' | 'openai/gpt-5.2' | 'openai/gpt-3.5-turbo' | 'openai/o3-pro-2025-06-10' | 'openai/o1-preview' | 'openai/gpt-5.1-2025-11-13' | 'openai/gpt-5-chat-latest' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.2-pro' | 'openai/gpt-5-codex' | 'openai/gpt-5.1-chat' | 'openai/gpt-5.1-chat-latest' | 'openai/gpt-4.1' | 'openai/gpt-4o-search-preview' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-safeguard-20b' | 'openai/gpt-5-pro' | 'openai/gpt-4.1-mini' | 'openai/gpt-4-turbo-preview' | 'openai/gpt-5.1' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/o1-pro' | 'openai/gpt-4-turbo' | 'openai/o3-mini-low' | 'openai/o1' | 'openai/o3-mini-high' | 'openai/gpt-5.1-codex-max' | 'openai/o4-mini-high' | 'openai/o4-mini-deep-research' | 'openai/gpt-4.1-nano' | 'openai/o4-mini' | 'openai/gpt-5.1-codex' | 'openai/gpt-4o-2024-11-20' | 'openai/gpt-5.2-codex' | 'openai/gpt-5-mini' | 'openai/o3-mini' | 'openai/gpt-5.2-chat' | 'openai/gpt-4o-2024-08-06' | 'openai/gpt-oss-120b' | 'openai/o3' | 'openai/o3-deep-research' | 'openai/gpt-5' | 'zai-org/glm-5.1' | 'zai-org/glm-5:thinking' | 'zai-org/glm-4.7-flash' | 'zai-org/glm-5.1:thinking' | 'zai-org/glm-4.7' | 'zai-org/glm-5' | 'TheDrummer 2/UnslopNemo-12B-v4.1' | 'TheDrummer 2/Rocinante-12B-v1.1' | 'TheDrummer 2/Cydonia-24B-v4' | 'TheDrummer 2/Cydonia-24B-v4.1' | 'TheDrummer 2/Cydonia-24B-v4.3' | 'TheDrummer 2/Cydonia-24B-v2' | 'TheDrummer 2/Anubis-70B-v1.1' | 'TheDrummer 2/Magidonia-24B-v4.3' | 'TheDrummer 2/skyfall-36b-v2' | 'TheDrummer 2/Anubis-70B-v1' | 'unsloth/gemma-3-27b-it' | 'unsloth/gemma-3-12b-it' | 'unsloth/gemma-3-1b-it' | 'unsloth/gemma-3-4b-it' | 'aion-labs/aion-1.0' | 'aion-labs/aion-rp-llama-3.1-8b' | 'aion-labs/aion-1.0-mini' | 'Doctor-Shotgun/MS3.2-24B-Magnum-Diamond' | 'chutesai/Mistral-Small-3.2-24B-Instruct-2506' | 'LLM360/K2-Think' | 'Sao10K/L3-8B-Stheno-v3.2' | 'Sao10K/L3.1-70B-Hanami-x1' | 'Sao10K/L3.3-70B-Euryale-v2.3' | 'Sao10K/L3.1-70B-Euryale-v2.2' | 'amazon/nova-pro-v1' | 'amazon/nova-2-lite-v1' | 'amazon/nova-lite-v1' | 'amazon/nova-micro-v1' | 'CrucibleLab/L3.3-70B-Loki-V2.0' | 'THUDM/GLM-4-32B-0414' | 'THUDM/GLM-Z1-32B-0414' | 'THUDM/GLM-Z1-Rumination-32B-0414' | 'THUDM/GLM-4-9B-0414' | 'THUDM/GLM-Z1-9B-0414' | 'inflection/inflection-3-productivity' | 'inflection/inflection-3-pi' | 'minimax/minimax-m2.1' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2-her' | 'minimax/minimax-m2.7' | 'minimax/minimax-01' | 'Tongyi-Zhiwen/QwenLong-L1-32B' | 'x-ai/grok-4-07-09' | 'x-ai/grok-4-fast:thinking' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4.1-fast-reasoning' | 'x-ai/grok-4-fast' | 'x-ai/grok-4.1-fast' | 'Salesforce/Llama-xLAM-2-70b-fc-r' | 'nvidia/nvidia-nemotron-nano-9b-v2' | 'nvidia/Llama-3_3-Nemotron-Super-49B-v1_5' | 'nvidia/Llama-3.3-Nemotron-Super-49B-v1' | 'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF' | 'nvidia/Llama-3.1-Nemotron-Ultra-253B-v1' | 'nvidia/nemotron-3-nano-30b-a3b' | 'anthropic/claude-sonnet-4.6:thinking' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-opus-4.6:thinking:low' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-opus-4.6:thinking:medium' | 'anthropic/claude-opus-4.6:thinking:max' | 'anthropic/claude-opus-4.6:thinking' | 'GalrionSoftworks/MN-LooseCannon-12B-v1' | 'shisa-ai/shisa-v2-llama3.3-70b' | 'shisa-ai/shisa-v2.1-llama3.3-70b' | 'mistralai/ministral-14b-instruct-2512' | 'mistralai/mistral-large-3-675b-instruct-2512' | 'mistralai/Devstral-Small-2505' | 'mistralai/mistral-saba' | 'mistralai/mistral-small-creative' | 'mistralai/codestral-2508' | 'mistralai/mixtral-8x22b-instruct-v0.1' | 'mistralai/ministral-14b-2512' | 'mistralai/mistral-large' | 'mistralai/ministral-3b-2512' | 'mistralai/Mistral-Nemo-Instruct-2407' | 'mistralai/mistral-medium-3' | 'mistralai/mistral-7b-instruct' | 'mistralai/mixtral-8x7b-instruct-v0.1' | 'mistralai/ministral-8b-2512' | 'mistralai/devstral-2-123b-instruct-2512' | 'mistralai/mistral-tiny' | 'mistralai/mistral-medium-3.1' | 'qwen/Qwen3.6-35B-A3B:thinking' | 'qwen/qwen3.5-397b-a17b' | 'qwen/Qwen3.6-35B-A3B' | 'tencent/Hunyuan-MT-7B' | 'google/gemini-flash-1.5' | 'google/gemini-3-flash-preview-thinking' | 'google/gemini-3-flash-preview' | 'microsoft/wizardlm-2-8x22b' | 'microsoft/MAI-DS-R1-FP8' | 'pamanseau/OpenReasoning-Nemotron-32B' | 'Infermatic/MN-12B-Inferor-v0.0' | 'NeverSleep/Lumimaid-v0.2-70B' | 'NeverSleep/Llama-3-Lumimaid-70B-v0.1' | 'nex-agi/deepseek-v3.1-nex-n1' | 'anthracite-org/magnum-v4-72b' | 'anthracite-org/magnum-v2-72b' | 'deepseek/deepseek-prover-v2-671b' | 'deepseek/deepseek-v3.2-speciale' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-v3.2:thinking' | 'huihui-ai/DeepSeek-R1-Distill-Llama-70B-abliterated' | 'huihui-ai/Llama-3.1-Nemotron-70B-Instruct-HF-abliterated' | 'huihui-ai/Qwen2.5-32B-Instruct-abliterated' | 'huihui-ai/DeepSeek-R1-Distill-Qwen-32B-abliterated' | 'huihui-ai/Llama-3.3-70B-Instruct-abliterated' | 'ReadyArt/MS3.2-The-Omega-Directive-24B-Unslop-v2.0' | 'ReadyArt/The-Omega-Abomination-L-70B-v1.0' | 'featherless-ai/Qwerky-72B' | 'meituan-longcat/LongCat-Flash-Chat-FP8' | 'failspy/Meta-Llama-3-70B-Instruct-abliterated-v3.5' | 'meta-llama/llama-4-scout' | 'meta-llama/llama-3.2-90b-vision-instruct' | 'meta-llama/llama-4-maverick' | 'meta-llama/llama-3.3-70b-instruct' | 'meta-llama/llama-3.2-3b-instruct' | 'meta-llama/llama-3.1-8b-instruct' | 'VongolaChouko/Starcannon-Unleashed-12B-v1.0' | 'arcee-ai/trinity-mini' | 'arcee-ai/trinity-large' | 'meganova-ai/manta-flash-1.0' | 'meganova-ai/manta-pro-1.0' | 'meganova-ai/manta-mini-1.0' | 'LatitudeGames/Wayfarer-Large-70B-Llama-3.3' | 'essentialai/rnj-1-instruct' | 'abacusai/Dracarys-72B-Instruct' | 'alibaba/qwen3.6-flash' | 'NousResearch 2/hermes-4-405b' | 'NousResearch 2/hermes-4-70b' | 'NousResearch 2/hermes-3-llama-3.1-70b' | 'NousResearch 2/Hermes-4-70B:thinking' | 'NousResearch 2/hermes-4-405b:thinking' | 'NousResearch 2/DeepHermes-3-Mistral-24B-Preview' | 'MiniMaxAI/MiniMax-M1-80k' | 'allenai/olmo-3.1-32b-instruct' | 'allenai/molmo-2-8b' | 'allenai/olmo-3.1-32b-think' | 'allenai/olmo-3-32b-think' | 'cognitivecomputations/dolphin-2.9.2-qwen2-72b' | 'Steelskull/L3.3-Electra-R1-70b' | 'Steelskull/L3.3-MS-Nevoria-70b' | 'Steelskull/L3.3-Nevoria-R1-70b' | 'Steelskull/L3.3-MS-Evayale-70B' | 'Steelskull/L3.3-MS-Evalebis-70b' | 'Steelskull/L3.3-Cu-Mai-R1-70b' | 'dmind/dmind-1' | 'dmind/dmind-1-mini' | 'xiaomi/mimo-v2-flash-thinking-original' | 'xiaomi/mimo-v2-flash' | 'xiaomi/mimo-v2-flash-thinking' | 'xiaomi/mimo-v2-flash-original' | 'baidu/ernie-4.5-300b-a47b' | 'baidu/ernie-4.5-vl-28b-a3b' | 'stepfun-ai/step-3.5-flash' | 'stepfun-ai/step-3.5-flash:thinking' | 'miromind-ai/mirothinker-v1.5-235b' | 'tngtech/tng-r1t-chimera' | 'tngtech/DeepSeek-TNG-R1T2-Chimera'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a NEAR AI Cloud Provider
 * @see {@link https://docs.near.ai/}
 */
export const createNearai = (apiKey: string, baseURL = 'https://cloud-api.near.ai/v1') => merge(
  createChatProvider<'openai/whisper-large-v3' | 'openai/gpt-oss-120b' | 'zai-org/GLM-5.1-FP8' | 'black-forest-labs/FLUX.2-klein-4B' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-Embedding-0.6B' | 'Qwen/Qwen3-Reranker-0.6B' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'openai/gpt-5.2' | 'openai/gpt-5.4-nano' | 'openai/gpt-4.1' | 'openai/gpt-4.1-mini' | 'openai/gpt-5.1' | 'openai/gpt-5-nano' | 'openai/gpt-5.4' | 'openai/gpt-5.4-mini' | 'openai/gpt-5.5' | 'openai/gpt-4.1-nano' | 'openai/o4-mini' | 'openai/gpt-5-mini' | 'openai/o3-mini' | 'openai/o3' | 'openai/gpt-5' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-opus-4-6' | 'google/gemini-3.1-flash-lite' | 'google/gemini-2.5-pro' | 'google/gemini-2.5-flash-lite' | 'google/gemini-2.5-flash' | 'Qwen/Qwen3.5-122B-A10B'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Nebius Token Factory Provider
 * @see {@link https://docs.tokenfactory.nebius.com/}
 */
export const createNebius = (apiKey: string, baseURL = 'https://api.tokenfactory.nebius.com/v1') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-V3.2-fast' | 'deepseek-ai/DeepSeek-V3.2' | 'moonshotai/Kimi-K2.5-fast' | 'moonshotai/Kimi-K2.5' | 'openai/gpt-oss-120b-fast' | 'openai/gpt-oss-120b' | 'zai-org/GLM-5' | 'NousResearch/Hermes-4-405B' | 'NousResearch/Hermes-4-70B' | 'nvidia/Nemotron-3-Nano-Omni' | 'nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B' | 'nvidia/nemotron-3-super-120b-a12b' | 'nvidia/Llama-3_1-Nemotron-Ultra-253B-v1' | 'google/gemma-3-27b-it' | 'google/gemma-2-2b-it' | 'meta-llama/Meta-Llama-3.1-8B-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct' | 'MiniMaxAI/MiniMax-M2.5-fast' | 'MiniMaxAI/MiniMax-M2.5' | 'PrimeIntellect/INTELLECT-3' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen2.5-VL-72B-Instruct' | 'Qwen/Qwen3.5-397B-A17B-fast' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Next-80B-A3B-Thinking-fast' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3-235B-A22B-Thinking-2507-fast' | 'Qwen/Qwen3-Embedding-8B' | 'deepseek-ai/DeepSeek-V4-Pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Neuralwatt Provider
 * @see {@link https://portal.neuralwatt.com/docs}
 */
export const createNeuralwatt = (apiKey: string, baseURL = 'https://api.neuralwatt.com/v1') => merge(
  createChatProvider<'qwen3.5-397b-fast' | 'glm-5-fast' | 'glm-5.1-fast' | 'kimi-k2.6-fast' | 'qwen3.6-35b-fast' | 'kimi-k2.5-fast' | 'moonshotai/Kimi-K2.6' | 'moonshotai/Kimi-K2.5' | 'openai/gpt-oss-20b' | 'zai-org/GLM-5.1-FP8' | 'mistralai/Devstral-Small-2-24B-Instruct-2512' | 'MiniMaxAI/MiniMax-M2.5' | 'Qwen/Qwen3.5-397B-A17B-FP8' | 'Qwen/Qwen3.6-35B-A3B'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Nova Provider
 * @see {@link https://nova.amazon.com/dev/documentation}
 */
export const createNova = (apiKey: string, baseURL = 'https://api.nova.amazon.com/v1') => merge(
  createChatProvider<'nova-2-pro-v1' | 'nova-2-lite-v1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a NovitaAI Provider
 * @see {@link https://novita.ai/docs/guides/introduction}
 */
export const createNovitaAi = (apiKey: string, baseURL = 'https://api.novita.ai/openai') => merge(
  createChatProvider<'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-instruct' | 'moonshotai/kimi-k2-thinking' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'zai-org/glm-5.1' | 'zai-org/glm-4.5-air' | 'zai-org/glm-4.5v' | 'zai-org/glm-4.7-flash' | 'zai-org/glm-4.6' | 'zai-org/glm-4.5' | 'zai-org/autoglm-phone-9b-multilingual' | 'zai-org/glm-4.7' | 'zai-org/glm-5' | 'zai-org/glm-4.6v' | 'baichuan/baichuan-m2-32b' | 'minimax/minimax-m2.1' | 'minimax/minimax-m2' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2.5-highspeed' | 'kwaipilot/kat-coder-pro' | 'nousresearch/hermes-2-pro-llama-3-8b' | 'sao10K/l3-8b-lunaris' | 'sao10K/l31-70b-euryale-v2.2' | 'sao10K/L3-8B-stheno-v3.2' | 'sao10K/l3-70b-euryale-v2.1' | 'paddlepaddle/paddleocr-vl' | 'inclusionai/ling-2.6-1t' | 'inclusionai/ling-2.6-flash' | 'mistralai/mistral-nemo' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'qwen/qwen2.5-vl-72b-instruct' | 'qwen/qwen2.5-7b-instruct' | 'qwen/qwen3-vl-235b-a22b-thinking' | 'qwen/qwen-2.5-72b-instruct' | 'qwen/qwen3-30b-a3b-fp8' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen3-omni-30b-a3b-instruct' | 'qwen/qwen3-max' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen3-coder-next' | 'qwen/qwen3-omni-30b-a3b-thinking' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-4b-fp8' | 'qwen/qwen3-235b-a22b-fp8' | 'qwen/qwen-mt-plus' | 'qwen/qwen3-vl-30b-a3b-thinking' | 'qwen/qwen3.5-35b-a3b' | 'qwen/qwen3-32b-fp8' | 'qwen/qwen3-235b-a22b-instruct-2507' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-vl-8b-instruct' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen3-coder-30b-a3b-instruct' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3.5-27b' | 'qwen/qwen3-vl-30b-a3b-instruct' | 'qwen/qwen3-8b-fp8' | 'google/gemma-4-26b-a4b-it' | 'google/gemma-3-27b-it' | 'google/gemma-4-31b-it' | 'google/gemma-3-12b-it' | 'microsoft/wizardlm-2-8x22b' | 'gryphe/mythomax-l2-13b' | 'deepseek/deepseek-r1-0528-qwen3-8b' | 'deepseek/deepseek-prover-v2-671b' | 'deepseek/deepseek-r1-turbo' | 'deepseek/deepseek-ocr-2' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-v3-0324' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-ocr' | 'deepseek/deepseek-v3-turbo' | 'deepseek/deepseek-r1-distill-qwen-14b' | 'deepseek/deepseek-v3.1' | 'deepseek/deepseek-r1-distill-llama-70b' | 'deepseek/deepseek-r1-distill-qwen-32b' | 'deepseek/deepseek-v3.1-terminus' | 'minimaxai/minimax-m1-80k' | 'meta-llama/llama-4-maverick-17b-128e-instruct-fp8' | 'meta-llama/llama-4-scout-17b-16e-instruct' | 'meta-llama/llama-3-70b-instruct' | 'meta-llama/llama-3-8b-instruct' | 'meta-llama/llama-3.3-70b-instruct' | 'meta-llama/llama-3.2-3b-instruct' | 'meta-llama/llama-3.1-8b-instruct' | 'xiaomimimo/mimo-v2-flash' | 'baidu/ernie-4.5-vl-28b-a3b-thinking' | 'baidu/ernie-4.5-vl-424b-a47b' | 'baidu/ernie-4.5-21B-a3b-thinking' | 'baidu/ernie-4.5-21B-a3b' | 'baidu/ernie-4.5-300b-a47b-paddle' | 'baidu/ernie-4.5-vl-28b-a3b' | 'moonshotai/kimi-k2.6' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v4-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Nvidia Provider
 * @see {@link https://docs.api.nvidia.com/nim/}
 */
export const createNvidia = (apiKey: string, baseURL = 'https://integrate.api.nvidia.com/v1') => merge(
  createChatProvider<'deepseek-ai/deepseek-v3.2' | 'deepseek-ai/deepseek-v3.1-terminus' | 'bytedance/seed-oss-36b-instruct' | 'moonshotai/kimi-k2-instruct-0905' | 'moonshotai/kimi-k2-instruct' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.6' | 'z-ai/glm-5.1' | 'z-ai/glm4.7' | 'openai/gpt-oss-20b' | 'openai/whisper-large-v3' | 'openai/gpt-oss-120b' | 'black-forest-labs/flux_1-kontext-dev' | 'black-forest-labs/flux_1-schnell' | 'black-forest-labs/flux.1-dev' | 'black-forest-labs/flux_2-klein-4b' | 'nvidia/usdvalidate' | 'nvidia/magpie-tts-zeroshot' | 'nvidia/gliner-pii' | 'nvidia/active-speaker-detection' | 'nvidia/sparsedrive' | 'nvidia/nemotron-content-safety-reasoning-4b' | 'nvidia/nv-embed-v1' | 'nvidia/cosmos-transfer1-7b' | 'nvidia/nv-embedcode-7b-v1' | 'nvidia/nvidia-nemotron-nano-9b-v2' | 'nvidia/cosmos-predict1-5b' | 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning' | 'nvidia/synthetic-video-detector' | 'nvidia/nemotron-3-super-120b-a12b' | 'nvidia/studiovoice' | 'nvidia/rerank-qa-mistral-4b' | 'nvidia/llama-3_1-nemotron-safety-guard-8b-v3' | 'nvidia/llama-3_3-nemotron-super-49b-v1_5' | 'nvidia/streampetr' | 'nvidia/cosmos-transfer2_5-2b' | 'nvidia/usdcode' | 'nvidia/nemotron-voicechat' | 'nvidia/llama-3_2-nemoretriever-300m-embed-v1' | 'nvidia/llama-nemotron-rerank-vl-1b-v2' | 'nvidia/bevformer' | 'nvidia/llama-3_3-nemotron-super-49b-v1' | 'nvidia/riva-translate-4b-instruct-v1_1' | 'nvidia/nemotron-3-content-safety' | 'nvidia/llama-nemotron-embed-vl-1b-v2' | 'nvidia/nemotron-3-nano-30b-a3b' | 'nvidia/nemotron-mini-4b-instruct' | 'mistralai/mixtral-8x7b-instruct' | 'mistralai/mistral-7b-instruct-v03' | 'mistralai/mistral-small-4-119b-2603' | 'mistralai/mistral-large-3-675b-instruct-2512' | 'mistralai/mixtral-8x22b-instruct' | 'mistralai/magistral-small-2506' | 'mistralai/mistral-medium-3-instruct' | 'mistralai/devstral-2-123b-instruct-2512' | 'mistralai/mistral-nemotron' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen-image-edit' | 'qwen/qwen2.5-coder-32b-instruct' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen-image' | 'google/gemma-3-27b-it' | 'google/gemma-4-31b-it' | 'google/gemma-3n-e2b-it' | 'google/gemma-3n-e4b-it' | 'google/gemma-2-2b-it' | 'google/google-paligemma' | 'microsoft/phi-4-mini-instruct' | 'microsoft/phi-4-multimodal-instruct' | 'upstage/solar-10_7b-instruct' | 'minimaxai/minimax-m2.5' | 'minimaxai/minimax-m2.7' | 'sarvamai/sarvam-m' | 'abacusai/dracarys-llama-3_1-70b-instruct' | 'baai/bge-m3' | 'meta/llama-3.1-70b-instruct' | 'meta/esm2-650m' | 'meta/llama-3.2-90b-vision-instruct' | 'meta/llama-3.2-1b-instruct' | 'meta/esmfold' | 'meta/llama-3.2-11b-vision-instruct' | 'meta/llama-4-maverick-17b-128e-instruct' | 'meta/llama-3.3-70b-instruct' | 'meta/llama-3.2-3b-instruct' | 'meta/llama-guard-4-12b' | 'meta/llama-3.1-8b-instruct' | 'stepfun-ai/step-3.5-flash' | 'deepseek-ai/deepseek-v4-pro' | 'deepseek-ai/deepseek-v4-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Ollama Cloud Provider
 * @see {@link https://docs.ollama.com/cloud}
 */
export const createOllamaCloud = (apiKey: string, baseURL = 'https://ollama.com/v1') => merge(
  createChatProvider<'minimax-m2.1' | 'kimi-k2.5' | 'glm-5.1' | 'qwen3-next:80b' | 'qwen3-vl:235b' | 'kimi-k2:1t' | 'minimax-m2' | 'deepseek-v4-pro' | 'deepseek-v3.2' | 'ministral-3:3b' | 'nemotron-3-nano:30b' | 'ministral-3:8b' | 'minimax-m2.5' | 'rnj-1:8b' | 'glm-4.6' | 'gpt-oss:120b' | 'nemotron-3-super' | 'qwen3-coder-next' | 'minimax-m2.7' | 'kimi-k2-thinking' | 'qwen3-coder:480b' | 'qwen3-vl:235b-instruct' | 'gemma3:27b' | 'devstral-small-2:24b' | 'qwen3.5:397b' | 'deepseek-v4-flash' | 'gemini-3-flash-preview' | 'gemma3:4b' | 'deepseek-v3.1:671b' | 'ministral-3:14b' | 'gemma4:31b' | 'glm-4.7' | 'cogito-2.1:671b' | 'glm-5' | 'kimi-k2.6' | 'mistral-large-3:675b' | 'gemma3:12b' | 'gpt-oss:20b' | 'devstral-2:123b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenAI Provider
 * @see {@link https://platform.openai.com/docs/models}
 */
export const createOpenAI = (apiKey: string, baseURL = 'https://api.openai.com/v1/') => merge(
  createChatProvider<'text-embedding-3-large' | 'gpt-4o' | 'gpt-image-1-mini' | 'gpt-5.2' | 'gpt-3.5-turbo' | 'o3-pro' | 'o1-preview' | 'gpt-5.4-nano' | 'gpt-5-chat-latest' | 'text-embedding-ada-002' | 'gpt-5.5-pro' | 'gpt-5.1-codex-mini' | 'gpt-5.2-pro' | 'gpt-4o-2024-05-13' | 'chatgpt-image-latest' | 'gpt-5.3-codex-spark' | 'gpt-5-codex' | 'gpt-5.1-chat-latest' | 'gpt-image-1.5' | 'gpt-4.1' | 'text-embedding-3-small' | 'gpt-5-pro' | 'gpt-4.1-mini' | 'gpt-5.1' | 'gpt-5-nano' | 'gpt-5.4' | 'gpt-4o-mini' | 'o1-pro' | 'gpt-4-turbo' | 'gpt-5.4-mini' | 'o1' | 'gpt-5.1-codex-max' | 'gpt-5.5' | 'gpt-5.4-pro' | 'gpt-5.2-chat-latest' | 'o4-mini-deep-research' | 'gpt-4.1-nano' | 'gpt-4' | 'o4-mini' | 'gpt-5.1-codex' | 'gpt-4o-2024-11-20' | 'gpt-5.2-codex' | 'gpt-image-1' | 'gpt-5-mini' | 'o3-mini' | 'gpt-5.3-codex' | 'gpt-4o-2024-08-06' | 'o3' | 'o1-mini' | 'o3-deep-research' | 'gpt-5' | 'gpt-5.3-chat-latest'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createImageProvider({ apiKey, baseURL }),
  createSpeechProvider({ apiKey, baseURL }),
  createTranscriptionProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenCode Zen Provider
 * @see {@link https://opencode.ai/docs/zen}
 */
export const createOpencode = (apiKey: string, baseURL = 'https://opencode.ai/zen/v1') => merge(
  createChatProvider<'minimax-m2.1' | 'kimi-k2.5' | 'qwen3.5-plus' | 'claude-haiku-4-5' | 'glm-5.1' | 'kimi-k2.5-free' | 'gemini-3-pro' | 'gemini-3.5-flash' | 'gpt-5.2' | 'glm-5-free' | 'gpt-5.4-nano' | 'minimax-m2.1-free' | 'gpt-5.5-pro' | 'gpt-5.1-codex-mini' | 'claude-sonnet-4-5' | 'mimo-v2-flash-free' | 'gpt-5.3-codex-spark' | 'grok-build-0.1' | 'trinity-large-preview-free' | 'deepseek-v4-flash-free' | 'gpt-5-codex' | 'minimax-m2.5' | 'mimo-v2-pro-free' | 'glm-4.6' | 'ling-2.6-flash-free' | 'claude-sonnet-4-6' | 'glm-4.7-free' | 'qwen3.6-plus-free' | 'minimax-m2.7' | 'qwen3-coder' | 'claude-opus-4-1' | 'qwen3.6-plus' | 'gpt-5.1' | 'gpt-5-nano' | 'kimi-k2-thinking' | 'gpt-5.4-mini' | 'hy3-preview-free' | 'claude-opus-4-7' | 'gemini-3-flash' | 'minimax-m2.5-free' | 'gpt-5.1-codex-max' | 'gpt-5.4-pro' | 'big-pickle' | 'claude-sonnet-4' | 'gpt-5.1-codex' | 'kimi-k2' | 'claude-3-5-haiku' | 'gpt-5.2-codex' | 'grok-code' | 'gpt-5.3-codex' | 'ring-2.6-1t-free' | 'nemotron-3-super-free' | 'glm-4.7' | 'glm-5' | 'gemini-3.1-pro' | 'kimi-k2.6' | 'mimo-v2-omni-free' | 'claude-opus-4-5' | 'gpt-5' | 'gpt-5.4' | 'gpt-5.5' | 'claude-opus-4-6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenCode Go Provider
 * @see {@link https://opencode.ai/docs/zen}
 */
export const createOpencodeGo = (apiKey: string, baseURL = 'https://opencode.ai/zen/go/v1') => merge(
  createChatProvider<'kimi-k2.5' | 'qwen3.5-plus' | 'glm-5.1' | 'mimo-v2-omni' | 'deepseek-v4-pro' | 'mimo-v2.5-pro' | 'minimax-m2.5' | 'minimax-m2.7' | 'qwen3.6-plus' | 'mimo-v2-pro' | 'mimo-v2.5' | 'deepseek-v4-flash' | 'glm-5' | 'kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OrcaRouter Provider
 * @see {@link https://docs.orcarouter.ai}
 */
export const createOrcarouter = (apiKey: string, baseURL = 'https://api.orcarouter.ai/v1') => merge(
  createChatProvider<'orcarouter/auto' | 'grok/grok-4.3' | 'z-ai/glm-5.1' | 'z-ai/glm-4.5-air' | 'z-ai/glm-4.6' | 'z-ai/glm-4.5' | 'z-ai/glm-4.7' | 'z-ai/glm-5' | 'openai/gpt-4o' | 'openai/gpt-5.2' | 'openai/gpt-3.5-turbo' | 'openai/gpt-5.4-nano' | 'openai/gpt-5-chat-latest' | 'openai/gpt-5.5-pro' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.2-pro' | 'openai/gpt-4o-2024-05-13' | 'openai/gpt-5-codex' | 'openai/gpt-5.1-chat-latest' | 'openai/gpt-4.1' | 'openai/gpt-5-pro' | 'openai/gpt-4.1-mini' | 'openai/gpt-5.1' | 'openai/gpt-5-nano' | 'openai/gpt-5.4' | 'openai/gpt-4o-mini' | 'openai/gpt-4-turbo' | 'openai/gpt-5.4-mini' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-5.5' | 'openai/gpt-5.4-pro' | 'openai/gpt-5.2-chat-latest' | 'openai/gpt-4.1-nano' | 'openai/gpt-4' | 'openai/gpt-5.1-codex' | 'openai/gpt-4o-2024-11-20' | 'openai/gpt-5.2-codex' | 'openai/gpt-5-mini' | 'openai/gpt-5.3-codex' | 'openai/gpt-4o-2024-08-06' | 'openai/gpt-5' | 'openai/gpt-5.3-chat-latest' | 'kimi/kimi-k2.5' | 'kimi/kimi-k2.6' | 'minimax/minimax-m2.7-highspeed' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2.5-highspeed' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-opus-4' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-opus-4.7' | 'qwen/qwen3.5-plus' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen3-max' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen3.6-plus' | 'qwen/qwen3.5-35b-a3b' | 'qwen/qwen3.6-35b-a3b' | 'qwen/qwen3.5-27b' | 'google/gemini-flash-latest' | 'google/gemma-4-26b-a4b-it' | 'google/gemini-2.5-pro' | 'google/gemma-4-31b-it' | 'google/gemini-2.5-flash-lite' | 'google/gemini-flash-lite-latest' | 'google/gemini-3-pro-preview' | 'google/gemini-3.1-pro-preview-customtools' | 'google/gemini-3.1-flash-lite-preview' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-flash' | 'deepseek/deepseek-chat' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-reasoner' | 'deepseek/deepseek-v4-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OVHcloud AI Endpoints Provider
 * @see {@link https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog//}
 */
export const createOvhcloud = (apiKey: string, baseURL = 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1') => merge(
  createChatProvider<'mistral-7b-instruct-v0.3' | 'qwen2.5-vl-72b-instruct' | 'mistral-small-3.2-24b-instruct-2506' | 'mistral-nemo-instruct-2407' | 'qwen3.5-9b' | 'gpt-oss-20b' | 'meta-llama-3_3-70b-instruct' | 'qwen3-32b' | 'qwen3-coder-30b-a3b-instruct' | 'gpt-oss-120b' | 'llama-3.1-8b-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Perplexity Provider
 * @see {@link https://docs.perplexity.ai}
 */
export const createPerplexity = (apiKey: string, baseURL = 'https://api.perplexity.ai/') => merge(
  createChatProvider<'sonar' | 'sonar-deep-research' | 'sonar-reasoning-pro' | 'sonar-pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Perplexity Agent Provider
 * @see {@link https://docs.perplexity.ai/docs/agent-api/models}
 */
export const createPerplexityAgent = (apiKey: string, baseURL = 'https://api.perplexity.ai/v1') => merge(
  createChatProvider<'openai/gpt-5.2' | 'openai/gpt-5.1' | 'openai/gpt-5.4' | 'openai/gpt-5.5' | 'openai/gpt-5-mini' | 'nvidia/nemotron-3-super-120b-a12b' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-opus-4-6' | 'anthropic/claude-opus-4-5' | 'google/gemini-2.5-pro' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-flash' | 'perplexity/sonar' | 'xai/grok-4-1-fast-non-reasoning'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Poe Provider
 * @see {@link https://creator.poe.com/docs/external-applications/openai-compatible-api}
 */
export const createPoe = (apiKey: string, baseURL = 'https://api.poe.com/v1') => merge(
  createChatProvider<'ideogramai/ideogram-v2a-turbo' | 'ideogramai/ideogram-v2' | 'ideogramai/ideogram' | 'ideogramai/ideogram-v2a' | 'openai/chatgpt-4o-latest' | 'openai/gpt-4o' | 'openai/gpt-image-1-mini' | 'openai/gpt-5.2' | 'openai/gpt-3.5-turbo' | 'openai/o3-pro' | 'openai/gpt-5.3-instant' | 'openai/sora-2-pro' | 'openai/gpt-5.4-nano' | 'openai/gpt-image-2' | 'openai/gpt-4o-mini-search' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.2-pro' | 'openai/gpt-4-classic-0314' | 'openai/sora-2' | 'openai/gpt-5.3-codex-spark' | 'openai/gpt-3.5-turbo-instruct' | 'openai/gpt-5-codex' | 'openai/gpt-image-1.5' | 'openai/gpt-4.1' | 'openai/gpt-5-pro' | 'openai/gpt-4.1-mini' | 'openai/gpt-3.5-turbo-raw' | 'openai/gpt-5.1' | 'openai/gpt-5-nano' | 'openai/gpt-5.4' | 'openai/gpt-4o-mini' | 'openai/o1-pro' | 'openai/gpt-4-turbo' | 'openai/dall-e-3' | 'openai/gpt-5.4-mini' | 'openai/gpt-5.1-instant' | 'openai/gpt-4o-aug' | 'openai/o1' | 'openai/o3-mini-high' | 'openai/gpt-4-classic' | 'openai/gpt-4o-search' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-5.4-pro' | 'openai/o4-mini-deep-research' | 'openai/gpt-4.1-nano' | 'openai/o4-mini' | 'openai/gpt-5.1-codex' | 'openai/gpt-5.2-codex' | 'openai/gpt-5-chat' | 'openai/gpt-image-1' | 'openai/gpt-5-mini' | 'openai/o3-mini' | 'openai/gpt-5.3-codex' | 'openai/o3' | 'openai/o3-deep-research' | 'openai/gpt-5.2-instant' | 'openai/gpt-5' | 'cerebras/llama-3.3-70b-cs' | 'cerebras/llama-3.1-8b-cs' | 'cerebras/gpt-oss-120b-cs' | 'cerebras/qwen3-235b-2507-cs' | 'cerebras/qwen3-32b-cs' | 'runwayml/runway-gen-4-turbo' | 'runwayml/runway' | 'stabilityai/stablediffusionxl' | 'empiriolabs/deepseek-v4-flash-el' | 'empiriolabs/deepseek-v4-pro-el' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-haiku-3' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-3.5-june' | 'anthropic/claude-opus-4' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-sonnet-3.7' | 'anthropic/claude-haiku-3.5' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-opus-4.7' | 'anthropic/claude-sonnet-3.5' | 'elevenlabs/elevenlabs-v3' | 'elevenlabs/elevenlabs-music' | 'elevenlabs/elevenlabs-v2.5-turbo' | 'novita/minimax-m2.1' | 'novita/kimi-k2.5' | 'novita/deepseek-v3.2' | 'novita/glm-4.7-n' | 'novita/glm-4.7-flash' | 'novita/glm-4.6' | 'novita/kimi-k2-thinking' | 'novita/glm-4.7' | 'novita/glm-5' | 'novita/kimi-k2.6' | 'novita/glm-4.6v' | 'google/veo-3.1-fast' | 'google/imagen-4-fast' | 'google/veo-3-fast' | 'google/nano-banana-pro' | 'google/gemini-3-pro' | 'google/gemini-3.1-flash-lite' | 'google/nano-banana' | 'google/gemini-2.5-pro' | 'google/veo-3.1' | 'google/imagen-3' | 'google/gemini-2.5-flash-lite' | 'google/gemini-2.0-flash-lite' | 'google/veo-3' | 'google/gemini-3-flash' | 'google/gemini-deep-research' | 'google/gemini-2.5-flash' | 'google/veo-2' | 'google/lyria' | 'google/imagen-4-ultra' | 'google/gemini-2.0-flash' | 'google/gemma-4-31b' | 'google/gemini-3.1-pro' | 'google/imagen-3-fast' | 'google/imagen-4' | 'trytako/tako' | 'poetools/claude-code' | 'fireworks-ai/kimi-k2.5-fw' | 'xai/grok-3-mini' | 'xai/grok-4' | 'xai/grok-code-fast-1' | 'xai/grok-4.1-fast-reasoning' | 'xai/grok-4.1-fast-non-reasoning' | 'xai/grok-4.20-multi-agent' | 'xai/grok-3' | 'xai/grok-4-fast-non-reasoning' | 'xai/grok-4-fast-reasoning' | 'lumalabs/ray2' | 'topazlabs-co/topazlabs' | 'openai/gpt-5.5-pro' | 'openai/gpt-5.5' | 'google/gemini-3.5-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Privatemode AI Provider
 * @see {@link https://docs.privatemode.ai/api/overview}
 */
export const createPrivatemodeAi = (apiKey: string, baseURL = 'http://localhost:8080/v1') => merge(
  createChatProvider<'gemma-3-27b' | 'whisper-large-v3' | 'qwen3-embedding-4b' | 'qwen3-coder-30b-a3b' | 'gpt-oss-120b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a QiHang Provider
 * @see {@link https://www.qhaigc.net/docs}
 */
export const createQihangAi = (apiKey: string, baseURL = 'https://api.qhaigc.net/v1') => merge(
  createChatProvider<'gpt-5.2' | 'claude-haiku-4-5-20251001' | 'gemini-3-pro-preview' | 'claude-opus-4-5-20251101' | 'claude-sonnet-4-5-20250929' | 'gemini-3-flash-preview' | 'gpt-5.2-codex' | 'gemini-2.5-flash' | 'gpt-5-mini'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Qiniu Provider
 * @see {@link https://developer.qiniu.com/aitokenapi}
 */
export const createQiniuAi = (apiKey: string, baseURL = 'https://api.qnaigc.com/v1') => merge(
  createChatProvider<'qwen3-30b-a3b-instruct-2507' | 'qwen3-max-preview' | 'doubao-seed-2.0-pro' | 'claude-3.7-sonnet' | 'doubao-seed-2.0-code' | 'qwen2.5-vl-72b-instruct' | 'deepseek-r1' | 'gemini-2.5-pro' | 'deepseek-r1-0528' | 'deepseek-v3-0324' | 'doubao-seed-2.0-mini' | 'claude-3.5-sonnet' | 'claude-4.0-sonnet' | 'doubao-seed-1.6-thinking' | 'deepseek-v3' | 'qwen3-max' | 'glm-4.5-air' | 'qwen3-235b-a22b' | 'qwen3.5-397b-a17b' | 'doubao-1.5-vision-pro' | 'claude-4.5-haiku' | 'qwen-max-2025-01-25' | 'doubao-1.5-thinking-pro' | 'glm-4.5' | 'qwen2.5-vl-7b-instruct' | 'qwen-turbo' | 'gpt-oss-20b' | 'claude-4.0-opus' | 'claude-4.5-sonnet' | 'claude-4.5-opus' | 'gemini-2.5-flash-lite' | 'claude-4.1-opus' | 'doubao-seed-1.6' | 'qwen3-30b-a3b-thinking-2507' | 'qwen3-32b' | 'qwen3-next-80b-a3b-thinking' | 'gemini-2.0-flash-lite' | 'qwen-vl-max-2025-01-25' | 'doubao-seed-2.0-lite' | 'qwen3-30b-a3b' | 'qwen3-vl-30b-a3b-thinking' | 'deepseek-v3.1' | 'gemini-3.0-pro-image-preview' | 'kling-v2-6' | 'qwen3-235b-a22b-instruct-2507' | 'qwen3-coder-480b-a35b-instruct' | 'gemini-3.0-pro-preview' | 'qwen3-235b-a22b-thinking-2507' | 'kimi-k2' | 'doubao-seed-1.6-flash' | 'MiniMax-M1' | 'gemini-2.5-flash' | 'gemini-2.5-flash-image' | 'doubao-1.5-pro-32k' | 'qwen3-next-80b-a3b-instruct' | 'claude-3.5-haiku' | 'gpt-oss-120b' | 'gemini-2.0-flash' | 'gemini-3.0-flash-preview' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking' | 'z-ai/autoglm-phone-9b' | 'z-ai/glm-4.6' | 'z-ai/glm-4.7' | 'z-ai/glm-5' | 'openai/gpt-5.2' | 'openai/gpt-5' | 'minimax/minimax-m2.1' | 'minimax/minimax-m2' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.5-highspeed' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4.1-fast-reasoning' | 'x-ai/grok-4.1-fast-non-reasoning' | 'x-ai/grok-4-fast' | 'x-ai/grok-4.1-fast' | 'x-ai/grok-4-fast-non-reasoning' | 'x-ai/grok-4-fast-reasoning' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-v3.1-terminus-thinking' | 'deepseek/deepseek-math-v2' | 'deepseek/deepseek-v3.2-251201' | 'deepseek/deepseek-v3.2-exp-thinking' | 'deepseek/deepseek-v3.1-terminus' | 'stepfun/step-3.5-flash' | 'meituan/longcat-flash-chat' | 'meituan/longcat-flash-lite' | 'stepfun-ai/gelab-zero-4b-preview' | 'mimo-v2-flash' | 'xiaomi/mimo-v2-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Regolo AI Provider
 * @see {@link https://docs.regolo.ai/}
 */
export const createRegoloAi = (apiKey: string, baseURL = 'https://api.regolo.ai/v1') => merge(
  createChatProvider<'qwen3.5-122b' | 'mistral-small3.2' | 'minimax-m2.5' | 'qwen3.5-9b' | 'gpt-oss-20b' | 'qwen3-coder-next' | 'qwen3-embedding-8b' | 'mistral-small-4-119b' | 'qwen3-reranker-4b' | 'llama-3.3-70b-instruct' | 'gpt-oss-120b' | 'qwen-image' | 'llama-3.1-8b-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Requesty Provider
 * @see {@link https://requesty.ai/solution/llm-routing/models}
 */
export const createRequesty = (apiKey: string, baseURL = 'https://router.requesty.ai/v1') => merge(
  createChatProvider<'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.2-pro' | 'openai/gpt-5-codex' | 'openai/gpt-5.1-chat' | 'openai/gpt-4.1-mini' | 'openai/gpt-5-image' | 'openai/gpt-5.1' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-5.4-pro' | 'openai/o4-mini' | 'openai/gpt-5.1-codex' | 'openai/gpt-5.2-codex' | 'openai/gpt-5-chat' | 'openai/gpt-5-mini' | 'openai/gpt-5.3-codex' | 'openai/gpt-5' | 'anthropic/claude-3-7-sonnet' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-opus-4' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-opus-4-6' | 'anthropic/claude-opus-4-5' | 'google/gemini-3-pro-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-flash' | 'xai/grok-4' | 'xai/grok-4-fast' | 'openai/gpt-5.2' | 'openai/gpt-4.1' | 'openai/gpt-5-pro' | 'openai/gpt-5.4' | 'openai/gpt-5.2-chat' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-opus-4-1' | 'anthropic/claude-sonnet-4' | 'google/gemini-2.5-pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a routing.run Provider
 * @see {@link https://docs.routing.run/api-reference/models}
 */
export const createRoutingRun = (apiKey: string, baseURL = 'https://api.routing.run/v1') => merge(
  createChatProvider<'route/deepseek-v3.2' | 'route/kimi-k2.5' | 'route/minimax-m2.7-highspeed' | 'route/glm-5.1' | 'route/qwen3.6-27b' | 'route/deepseek-v4-pro' | 'route/glm-5.1-6bit' | 'route/mimo-v2.5-pro' | 'route/minimax-m2.5' | 'route/gemma-4-31b-it' | 'route/kimi-k2.6-6bit' | 'route/minimax-m2.7' | 'route/mistral-small-2503' | 'route/stepfun-3.5-flash' | 'route/mistral-large-3' | 'route/step-3.5-flash-2603' | 'route/deepseek-v4-pro-6bit' | 'route/deepseek-v4-flash-6bit' | 'route/mistral-medium-2505' | 'route/deepseek-v4-flash' | 'route/mimo-v2.5-pro-6bit' | 'route/step-3.5-flash' | 'route/minimax-m2.5-highspeed' | 'route/kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Sarvam AI Provider
 * @see {@link https://docs.sarvam.ai/api-reference-docs/getting-started/models}
 */
export const createSarvam = (apiKey: string, baseURL = 'https://api.sarvam.ai/v1') => merge(
  createChatProvider<'sarvam-30b' | 'sarvam-105b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Scaleway Provider
 * @see {@link https://www.scaleway.com/en/docs/generative-apis/}
 */
export const createScaleway = (apiKey: string, baseURL = 'https://api.scaleway.ai/v1') => merge(
  createChatProvider<'pixtral-12b-2409' | 'mistral-small-3.2-24b-instruct-2506' | 'mistral-nemo-instruct-2407' | 'gemma-3-27b-it' | 'bge-multilingual-gemma2' | 'qwen3.5-397b-a17b' | 'voxtral-small-24b-2507' | 'qwen3-embedding-8b' | 'whisper-large-v3' | 'deepseek-r1-distill-llama-70b' | 'qwen3-235b-a22b-instruct-2507' | 'qwen3-coder-30b-a3b-instruct' | 'llama-3.3-70b-instruct' | 'gpt-oss-120b' | 'devstral-2-123b-instruct-2512' | 'llama-3.1-8b-instruct' | 'mistral-medium-3.5-128b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a SiliconFlow Provider
 * @see {@link https://cloud.siliconflow.com/models}
 */
export const createSiliconFlow = (apiKey: string, baseURL = 'https://api.siliconflow.com/v1') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B' | 'deepseek-ai/DeepSeek-V3.2-Exp' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/deepseek-vl2' | 'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-K2-Thinking' | 'moonshotai/Kimi-K2.6' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2-Instruct-0905' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'zai-org/GLM-4.5-Air' | 'zai-org/GLM-4.5' | 'zai-org/GLM-4.7' | 'zai-org/GLM-4.5V' | 'zai-org/GLM-5' | 'zai-org/GLM-5.1' | 'zai-org/GLM-4.6' | 'zai-org/GLM-5V-Turbo' | 'zai-org/GLM-4.6V' | 'THUDM/GLM-4-32B-0414' | 'THUDM/GLM-Z1-32B-0414' | 'THUDM/GLM-4-9B-0414' | 'THUDM/GLM-Z1-9B-0414' | 'tencent/Hunyuan-A13B-Instruct' | 'tencent/Hunyuan-MT-7B' | 'nex-agi/DeepSeek-V3.1-Nex-N1' | 'meta-llama/Meta-Llama-3.1-8B-Instruct' | 'ByteDance-Seed/Seed-OSS-36B-Instruct' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2.5' | 'baidu/ERNIE-4.5-300B-A47B' | 'stepfun-ai/Step-3.5-Flash' | 'Qwen/Qwen3-Omni-30B-A3B-Thinking' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-VL-235B-A22B-Thinking' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-8B' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen2.5-14B-Instruct' | 'Qwen/Qwen3-Omni-30B-A3B-Instruct' | 'Qwen/Qwen2.5-VL-72B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Omni-30B-A3B-Captioner' | 'Qwen/QwQ-32B' | 'Qwen/Qwen3-VL-32B-Instruct' | 'Qwen/Qwen3-VL-30B-A3B-Thinking' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct-128K' | 'Qwen/Qwen3-VL-8B-Instruct' | 'Qwen/Qwen2.5-7B-Instruct' | 'Qwen/Qwen2.5-VL-7B-Instruct' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen3-235B-A22B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-VL-8B-Thinking' | 'Qwen/Qwen3-30B-A3B-Thinking-2507' | 'Qwen/Qwen2.5-32B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen3-VL-32B-Thinking' | 'inclusionAI/Ring-flash-2.0' | 'inclusionAI/Ling-flash-2.0' | 'inclusionAI/Ling-mini-2.0' | 'deepseek-ai/deepseek-v4-pro' | 'deepseek-ai/deepseek-v4-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createSpeechProvider({ apiKey, baseURL }),
  createTranscriptionProvider({ apiKey, baseURL }),
)

/**
 * Create a SiliconFlow (China) Provider
 * @see {@link https://cloud.siliconflow.com/models}
 */
export const createSiliconflowCn = (apiKey: string, baseURL = 'https://api.siliconflow.cn/v1') => merge(
  createChatProvider<'Pro/deepseek-ai/DeepSeek-R1' | 'Pro/deepseek-ai/DeepSeek-V3.1-Terminus' | 'Pro/deepseek-ai/DeepSeek-V3.2' | 'Pro/deepseek-ai/DeepSeek-V3' | 'Pro/moonshotai/Kimi-K2-Thinking' | 'Pro/moonshotai/Kimi-K2.6' | 'Pro/moonshotai/Kimi-K2.5' | 'Pro/moonshotai/Kimi-K2-Instruct-0905' | 'Pro/zai-org/GLM-4.7' | 'Pro/zai-org/GLM-5' | 'Pro/zai-org/GLM-5.1' | 'Pro/MiniMaxAI/MiniMax-M2.1' | 'Pro/MiniMaxAI/MiniMax-M2.5' | 'deepseek-ai/DeepSeek-OCR' | 'deepseek-ai/deepseek-vl2' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-R1' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'zai-org/GLM-4.6V' | 'zai-org/GLM-4.6' | 'zai-org/GLM-4.5V' | 'zai-org/GLM-4.5-Air' | 'THUDM/GLM-Z1-9B-0414' | 'THUDM/GLM-4-9B-0414' | 'THUDM/GLM-Z1-32B-0414' | 'THUDM/GLM-4-32B-0414' | 'tencent/Hunyuan-MT-7B' | 'tencent/Hunyuan-A13B-Instruct' | 'PaddlePaddle/PaddleOCR-VL' | 'PaddlePaddle/PaddleOCR-VL-1.5' | 'ascend-tribe/pangu-pro-moe' | 'ByteDance-Seed/Seed-OSS-36B-Instruct' | 'Kwaipilot/KAT-Dev' | 'baidu/ERNIE-4.5-300B-A47B' | 'stepfun-ai/Step-3.5-Flash' | 'Qwen/Qwen3.5-9B' | 'Qwen/Qwen3.5-4B' | 'Qwen/Qwen3.5-122B-A10B' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3.5-27B' | 'Qwen/Qwen3.5-35B-A3B' | 'Qwen/Qwen3.6-35B-A3B' | 'Qwen/Qwen3-VL-32B-Thinking' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen2.5-32B-Instruct' | 'Qwen/Qwen3-30B-A3B-Thinking-2507' | 'Qwen/Qwen3-VL-8B-Thinking' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen2.5-7B-Instruct' | 'Qwen/Qwen3-VL-8B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct-128K' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-VL-30B-A3B-Thinking' | 'Qwen/Qwen3-VL-32B-Instruct' | 'Qwen/QwQ-32B' | 'Qwen/Qwen3-Omni-30B-A3B-Captioner' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen2.5-VL-72B-Instruct' | 'Qwen/Qwen3-Omni-30B-A3B-Instruct' | 'Qwen/Qwen2.5-14B-Instruct' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3-8B' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Thinking' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Omni-30B-A3B-Thinking' | 'inclusionAI/Ling-mini-2.0' | 'inclusionAI/Ling-flash-2.0' | 'inclusionAI/Ring-flash-2.0'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a STACKIT Provider
 * @see {@link https://docs.stackit.cloud/products/data-and-ai/ai-model-serving/basics/available-shared-models}
 */
export const createStackit = (apiKey: string, baseURL = 'https://api.openai-compat.model-serving.eu01.onstackit.cloud/v1') => merge(
  createChatProvider<'neuralmagic/Meta-Llama-3.1-8B-Instruct-FP8' | 'neuralmagic/Mistral-Nemo-Instruct-2407-FP8' | 'cortecs/Llama-3.3-70B-Instruct-FP8-Dynamic' | 'openai/gpt-oss-120b' | 'google/gemma-3-27b-it' | 'intfloat/e5-mistral-7b-instruct' | 'Qwen/Qwen3-VL-235B-A22B-Instruct-FP8' | 'Qwen/Qwen3-VL-Embedding-8B'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a StepFun Provider
 * @see {@link https://platform.stepfun.com/docs/zh/overview/concept}
 */
export const createStepfun = (apiKey: string, baseURL = 'https://api.stepfun.com/v1') => merge(
  createChatProvider<'step-1-32k' | 'step-2-16k' | 'step-3.5-flash-2603' | 'step-3.5-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createSpeechProvider({ apiKey, baseURL }),
  createTranscriptionProvider({ apiKey, baseURL }),
)

/**
 * Create a StepFun Provider
 * @see {@link https://platform.stepfun.ai/docs/en/step-plan/integrations/open-code}
 */
export const createStepfunAi = (apiKey: string, baseURL = 'https://api.stepfun.ai/step_plan/v1') => merge(
  createChatProvider<'step-3.5-flash' | 'step-3.5-flash-2603'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a submodel Provider
 * @see {@link https://submodel.gitbook.io}
 */
export const createSubmodel = (apiKey: string, baseURL = 'https://llm.submodel.ai/v1') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324' | 'openai/gpt-oss-120b' | 'zai-org/GLM-4.5-Air' | 'zai-org/GLM-4.5-FP8' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-235B-A22B-Instruct-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Synthetic Provider
 * @see {@link https://synthetic.new/pricing}
 */
export const createSynthetic = (apiKey: string, baseURL = 'https://api.synthetic.new/openai/v1') => merge(
  createChatProvider<'hf:deepseek-ai/DeepSeek-R1' | 'hf:deepseek-ai/DeepSeek-R1-0528' | 'hf:deepseek-ai/DeepSeek-V3.1-Terminus' | 'hf:deepseek-ai/DeepSeek-V3.1' | 'hf:deepseek-ai/DeepSeek-V3-0324' | 'hf:deepseek-ai/DeepSeek-V3.2' | 'hf:deepseek-ai/DeepSeek-V3' | 'hf:moonshotai/Kimi-K2-Thinking' | 'hf:moonshotai/Kimi-K2.5' | 'hf:moonshotai/Kimi-K2-Instruct-0905' | 'hf:Qwen/Qwen3-235B-A22B-Thinking-2507' | 'hf:Qwen/Qwen3-235B-A22B-Instruct-2507' | 'hf:Qwen/Qwen3.5-397B-A17B' | 'hf:Qwen/Qwen2.5-Coder-32B-Instruct' | 'hf:Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'hf:openai/gpt-oss-120b' | 'hf:zai-org/GLM-4.7' | 'hf:zai-org/GLM-4.7-Flash' | 'hf:zai-org/GLM-5' | 'hf:zai-org/GLM-5.1' | 'hf:zai-org/GLM-4.6' | 'hf:nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-NVFP4' | 'hf:nvidia/Kimi-K2.5-NVFP4' | 'hf:MiniMaxAI/MiniMax-M2.1' | 'hf:MiniMaxAI/MiniMax-M2.5' | 'hf:MiniMaxAI/MiniMax-M2' | 'hf:meta-llama/Llama-3.1-8B-Instruct' | 'hf:meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'hf:meta-llama/Llama-3.1-70B-Instruct' | 'hf:meta-llama/Llama-3.1-405B-Instruct' | 'hf:meta-llama/Llama-3.3-70B-Instruct' | 'hf:meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'hf:moonshotai/Kimi-K2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Tencent Coding Plan (China) Provider
 * @see {@link https://cloud.tencent.com/document/product/1772/128947}
 */
export const createTencentCodingPlan = (apiKey: string, baseURL = 'https://api.lkeap.cloud.tencent.com/coding/v3') => merge(
  createChatProvider<'kimi-k2.5' | 'hunyuan-turbos' | 'hunyuan-2.0-thinking' | 'hunyuan-2.0-instruct' | 'tc-code-latest' | 'minimax-m2.5' | 'hunyuan-t1' | 'glm-5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Tencent TokenHub Provider
 * @see {@link https://cloud.tencent.com/document/product/1823/130050}
 */
export const createTencentTokenhub = (apiKey: string, baseURL = 'https://tokenhub.tencentmaas.com/v1') => merge(
  createChatProvider<'hy3-preview'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a The Grid AI Provider
 * @see {@link https://thegrid.ai/docs}
 */
export const createTheGridAi = (apiKey: string, baseURL = 'https://api.thegrid.ai/v1') => merge(
  createChatProvider<'code-prime' | 'agent-max' | 'text-max' | 'agent-standard' | 'text-prime' | 'text-standard' | 'code-standard' | 'code-max' | 'agent-prime'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Umans AI Coding Plan Provider
 * @see {@link https://app.umans.ai/offers/code/docs}
 */
export const createUmansAiCodingPlan = (apiKey: string, baseURL = 'https://api.code.umans.ai/v1') => merge(
  createChatProvider<'umans-qwen3.6-35b-a3b' | 'umans-glm-5.1' | 'umans-coder' | 'umans-flash' | 'umans-kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Upstage Provider
 * @see {@link https://developers.upstage.ai/docs/apis/chat}
 */
export const createUpstage = (apiKey: string, baseURL = 'https://api.upstage.ai/v1/solar') => merge(
  createChatProvider<'solar-pro2' | 'solar-mini' | 'solar-pro3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Venice AI Provider
 * @see {@link https://docs.venice.ai}
 */
export const createVenice = (apiKey: string, baseURL = 'https://api.venice.ai/api/v1') => merge(
  createChatProvider<'z-ai-glm-5-turbo' | 'hermes-3-llama-3.1-405b' | 'qwen3-vl-235b-a22b' | 'google-gemma-3-27b-it' | 'grok-4-3' | 'deepseek-v4-pro' | 'zai-org-glm-5' | 'deepseek-v3.2' | 'mistral-small-2603' | 'zai-org-glm-4.7-flash' | 'claude-sonnet-4-5' | 'arcee-trinity-large-thinking' | 'venice-uncensored-1-2' | 'minimax-m27' | 'openai-gpt-55' | 'nvidia-nemotron-cascade-2-30b-a3b' | 'mistral-small-3-2-24b-instruct' | 'nvidia-nemotron-3-nano-30b-a3b' | 'openai-gpt-4o-mini-2024-07-18' | 'zai-org-glm-4.6' | 'llama-3.2-3b' | 'openai-gpt-52' | 'gemma-4-uncensored' | 'minimax-m25' | 'openai-gpt-55-pro' | 'claude-sonnet-4-6' | 'kimi-k2-6' | 'llama-3.3-70b' | 'claude-opus-4-6-fast' | 'qwen3-5-35b-a3b' | 'qwen3-5-397b-a17b' | 'grok-4-20-multi-agent' | 'openai-gpt-54-mini' | 'olafangensan-glm-4.7-flash-heretic' | 'grok-4-20' | 'claude-opus-4-7' | 'qwen-3-6-plus' | 'openai-gpt-54-pro' | 'deepseek-v4-flash' | 'qwen3-235b-a22b-instruct-2507' | 'gemini-3-flash-preview' | 'qwen3-6-27b' | 'qwen3-5-9b' | 'qwen3-coder-480b-a35b-instruct-turbo' | 'claude-opus-4-7-fast' | 'openai-gpt-52-codex' | 'qwen3-235b-a22b-thinking-2507' | 'google-gemma-4-26b-a4b-it' | 'openai-gpt-4o-2024-11-20' | 'openai-gpt-54' | 'claude-opus-4-6' | 'venice-uncensored-role-play' | 'zai-org-glm-5-1' | 'zai-org-glm-4.7' | 'gemini-3-1-pro-preview' | 'kimi-k2-5' | 'grok-build-0-1' | 'aion-labs-aion-2-0' | 'qwen3-next-80b' | 'z-ai-glm-5v-turbo' | 'openai-gpt-oss-120b' | 'claude-opus-4-5' | 'mercury-2' | 'openai-gpt-53-codex' | 'google-gemma-4-31b-it'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Vivgrid Provider
 * @see {@link https://docs.vivgrid.com/models}
 */
export const createVivgrid = (apiKey: string, baseURL = 'https://api.vivgrid.com/v1') => merge(
  createChatProvider<'gpt-5.4-nano' | 'deepseek-v3.2' | 'gpt-5.4' | 'gpt-5.4-mini' | 'gemini-3.1-flash-lite-preview' | 'gemini-3.1-pro-preview' | 'gpt-5.1-codex-max' | 'gpt-5.1-codex' | 'gpt-5.2-codex' | 'gpt-5-mini' | 'gpt-5.3-codex' | 'deepseek-v4-pro' | 'gpt-5.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Vultr Provider
 * @see {@link https://api.vultrinference.com/}
 */
export const createVultr = (apiKey: string, baseURL = 'https://api.vultrinference.com/v1') => merge(
  createChatProvider<'Kimi-K2.5' | 'DeepSeek-V3.2' | 'MiniMax-M2.5' | 'gpt-oss-120b' | 'GLM-5-FP8'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Wafer Provider
 * @see {@link https://docs.wafer.ai/wafer-pass}
 */
export const createWaferAi = (apiKey: string, baseURL = 'https://pass.wafer.ai/v1') => merge(
  createChatProvider<'Qwen3.5-397B-A17B' | 'GLM-5.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Weights & Biases Provider
 * @see {@link https://docs.wandb.ai/guides/integrations/inference/}
 */
export const createWandb = (apiKey: string, baseURL = 'https://api.inference.wandb.ai/v1') => merge(
  createChatProvider<'deepseek-ai/DeepSeek-V3.1' | 'moonshotai/Kimi-K2.5' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'zai-org/GLM-5-FP8' | 'nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-FP8' | 'microsoft/Phi-4-mini-instruct' | 'OpenPipe/Qwen3-14B-Instruct' | 'meta-llama/Llama-3.1-8B-Instruct' | 'meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'meta-llama/Llama-3.1-70B-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct' | 'MiniMaxAI/MiniMax-M2.5' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'zai-org/GLM-5.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a xAI Provider
 * @see {@link https://docs.x.ai/docs/models}
 */
export const createXai = (apiKey: string, baseURL = 'https://api.x.ai/v1/') => merge(
  createChatProvider<'grok-4.20-0309-non-reasoning' | 'grok-4.20-0309-reasoning' | 'grok-build-0.1' | 'grok-imagine-image-quality' | 'grok-imagine-video' | 'grok-imagine-image' | 'grok-4.3' | 'grok-4.20-multi-agent-0309'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xiaomi Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 */
export const createXiaomi = (apiKey: string, baseURL = 'https://api.xiaomimimo.com/v1') => merge(
  createChatProvider<'mimo-v2-omni' | 'mimo-v2.5-pro' | 'mimo-v2-flash' | 'mimo-v2-pro' | 'mimo-v2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xiaomi Token Plan (Europe) Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 */
export const createXiaomiTokenPlanAms = (apiKey: string, baseURL = 'https://token-plan-ams.xiaomimimo.com/v1') => merge(
  createChatProvider<'mimo-v2-tts' | 'mimo-v2.5' | 'mimo-v2-pro' | 'mimo-v2-flash' | 'mimo-v2.5-pro' | 'mimo-v2-omni'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xiaomi Token Plan (China) Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 */
export const createXiaomiTokenPlanCn = (apiKey: string, baseURL = 'https://token-plan-cn.xiaomimimo.com/v1') => merge(
  createChatProvider<'mimo-v2-tts' | 'mimo-v2-omni' | 'mimo-v2.5-pro' | 'mimo-v2-flash' | 'mimo-v2-pro' | 'mimo-v2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xiaomi Token Plan (Singapore) Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 */
export const createXiaomiTokenPlanSgp = (apiKey: string, baseURL = 'https://token-plan-sgp.xiaomimimo.com/v1') => merge(
  createChatProvider<'mimo-v2-tts' | 'mimo-v2.5' | 'mimo-v2-pro' | 'mimo-v2-flash' | 'mimo-v2.5-pro' | 'mimo-v2-omni'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xpersona Provider
 * @see {@link https://www.xpersona.co/docs}
 */
export const createXpersona = (apiKey: string, baseURL = 'https://www.xpersona.co/v1') => merge(
  createChatProvider<'xpersona-frieren-coder'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Z.AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 */
export const createZai = (apiKey: string, baseURL = 'https://api.z.ai/api/paas/v4') => merge(
  createChatProvider<'glm-5.1' | 'glm-5v-turbo' | 'glm-4.7-flashx' | 'glm-4.5-air' | 'glm-4.5v' | 'glm-4.7-flash' | 'glm-4.6' | 'glm-4.5' | 'glm-4.5-flash' | 'glm-5-turbo' | 'glm-4.7' | 'glm-5' | 'glm-4.6v'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Z.AI Coding Plan Provider
 * @see {@link https://docs.z.ai/devpack/overview}
 */
export const createZaiCodingPlan = (apiKey: string, baseURL = 'https://api.z.ai/api/coding/paas/v4') => merge(
  createChatProvider<'glm-5.1' | 'glm-4.5-air' | 'glm-5-turbo' | 'glm-4.7' | 'glm-5v-turbo'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a ZenMux Provider
 * @see {@link https://docs.zenmux.ai}
 */
export const createZenmux = (apiKey: string, baseURL = 'https://zenmux.ai/api/v1') => merge(
  createChatProvider<'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2-thinking-turbo' | 'moonshotai/kimi-k2.6' | 'z-ai/glm-5.1' | 'z-ai/glm-5v-turbo' | 'z-ai/glm-4.6v-flash-free' | 'z-ai/glm-4.6v-flash' | 'z-ai/glm-4.7-flash-free' | 'z-ai/glm-4.7-flashx' | 'z-ai/glm-4.5-air' | 'z-ai/glm-4.6' | 'z-ai/glm-4.5' | 'z-ai/glm-5-turbo' | 'z-ai/glm-4.7' | 'z-ai/glm-5' | 'z-ai/glm-4.6v' | 'openai/gpt-5.2' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.2-pro' | 'openai/gpt-5-codex' | 'openai/gpt-5.1-chat' | 'openai/gpt-5.1' | 'openai/gpt-5.4' | 'openai/gpt-5.4-mini' | 'openai/gpt-5.4-pro' | 'openai/gpt-5.1-codex' | 'openai/gpt-5.2-codex' | 'openai/gpt-5.3-codex' | 'openai/gpt-5.3-chat' | 'openai/gpt-5' | 'minimax/minimax-m2.1' | 'minimax/minimax-m2.7-highspeed' | 'minimax/minimax-m2' | 'minimax/minimax-m2.5-lightning' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.7' | 'x-ai/grok-4' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4.2-fast-non-reasoning' | 'x-ai/grok-4.2-fast' | 'x-ai/grok-4.1-fast-non-reasoning' | 'x-ai/grok-4-fast' | 'x-ai/grok-4.1-fast' | 'anthropic/claude-3.7-sonnet' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-opus-4' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-3.5-haiku' | 'anthropic/claude-opus-4.7' | 'inclusionai/ring-1t' | 'inclusionai/ling-1t' | 'qwen/qwen3.5-plus' | 'qwen/qwen3-max' | 'qwen/qwen3.6-plus' | 'qwen/qwen3.5-flash' | 'qwen/qwen3-coder-plus' | 'google/gemini-2.5-pro' | 'google/gemini-2.5-flash-lite' | 'google/gemini-3.1-flash-lite-preview' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-flash' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-chat' | 'deepseek/deepseek-v3.2' | 'kuaishou/kat-coder-pro-v2' | 'sapiens-ai/agnes-1.5-pro' | 'sapiens-ai/agnes-1.5-lite' | 'stepfun/step-3' | 'stepfun/step-3.5-flash-free' | 'stepfun/step-3.5-flash' | 'volcengine/doubao-seed-2.0-pro' | 'volcengine/doubao-seed-2.0-code' | 'volcengine/doubao-seed-1.8' | 'volcengine/doubao-seed-2.0-mini' | 'volcengine/doubao-seed-code' | 'volcengine/doubao-seed-2.0-lite' | 'baidu/ernie-5.0-thinking-preview' | 'openai/gpt-5.5-pro' | 'openai/gpt-5.5' | 'tencent/hy3-preview' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v4-flash' | 'xiaomi/mimo-v2-omni' | 'xiaomi/mimo-v2.5-pro' | 'xiaomi/mimo-v2-flash' | 'xiaomi/mimo-v2-pro' | 'xiaomi/mimo-v2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Zhipu AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 */
export const createZhipuai = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/paas/v4') => merge(
  createChatProvider<'glm-5.1' | 'glm-5v-turbo' | 'glm-5' | 'glm-4.6v' | 'glm-4.7' | 'glm-4.5-flash' | 'glm-4.5' | 'glm-4.6' | 'glm-4.7-flash' | 'glm-4.5v' | 'glm-4.5-air' | 'glm-4.7-flashx'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Zhipu AI Coding Plan Provider
 * @see {@link https://docs.bigmodel.cn/cn/coding-plan/overview}
 */
export const createZhipuaiCodingPlan = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/coding/paas/v4') => merge(
  createChatProvider<'glm-5.1' | 'glm-5v-turbo' | 'glm-4.7' | 'glm-5-turbo' | 'glm-4.5-air'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Baidu Qianfan Provider
 * @see {@link https://cloud.baidu.com/doc/qianfan/s/Hmh4suq26}
 */
export const createQianfan = (apiKey: string, baseURL = 'https://qianfan.baidubce.com/v2') => merge(
  createChatProvider({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Tencent Hunyuan Provider
 * @see {@link https://cloud.tencent.com/document/product/1729}
 */
export const createTencentHunyuan = (apiKey: string, baseURL = 'https://api.hunyuan.cloud.tencent.com/v1/') => merge(
  createChatProvider({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Ollama Provider
 * @see {@link https://docs.ollama.com}
 */
export const createOllama = (apiKey: string, baseURL = 'http://localhost:11434/v1/') => merge(
  createChatProvider({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a LiteLLM Provider
 * @see {@link https://docs.litellm.ai}
 */
export const createLitellm = (apiKey: string, baseURL = 'http://localhost:4000/v1/') => merge(
  createChatProvider({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createSpeechProvider({ apiKey, baseURL }),
  createTranscriptionProvider({ apiKey, baseURL }),
)
