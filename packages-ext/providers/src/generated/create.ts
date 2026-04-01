/* eslint-disable perfectionist/sort-union-types */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/use-type-alias */

import { createChatProvider, createEmbedProvider, createImageProvider, createModelProvider, createSpeechProvider, createTranscriptionProvider, merge } from '../utils'

/**
 * Create a Abacus Provider
 * @see {@link https://abacus.ai/help/api}
 */
export const createAbacus = (apiKey: string, baseURL = 'https://routellm.abacus.ai/v1') => merge(
  createChatProvider<'gpt-5.2-codex' | 'llama-3.3-70b-versatile' | 'claude-opus-4-5-20251101' | 'o3-mini' | 'gpt-5.2-chat-latest' | 'gpt-5' | 'claude-opus-4-20250514' | 'gemini-3.1-pro-preview' | 'claude-3-7-sonnet-20250219' | 'kimi-k2.5' | 'grok-4-fast-non-reasoning' | 'grok-code-fast-1' | 'gpt-5.3-codex' | 'gpt-5-mini' | 'claude-opus-4-6' | 'claude-sonnet-4-5-20250929' | 'gpt-4o-mini' | 'gpt-5.1-codex-max' | 'claude-sonnet-4-6' | 'gpt-4.1' | 'gpt-5.1-chat-latest' | 'gpt-5.3-codex-xhigh' | 'gpt-5.4' | 'o3' | 'grok-4-1-fast-non-reasoning' | 'gpt-5.3-chat-latest' | 'claude-sonnet-4-20250514' | 'grok-4-0709' | 'gemini-3-flash-preview' | 'gemini-2.5-pro' | 'claude-opus-4-1-20250805' | 'kimi-k2-turbo-preview' | 'gemini-2.5-flash' | 'gpt-4o-2024-11-20' | 'gpt-5.2' | 'gpt-5.1' | 'gpt-4.1-mini' | 'qwen-2.5-coder-32b' | 'gpt-5-nano' | 'gemini-3.1-flash-lite-preview' | 'claude-haiku-4-5-20251001' | 'qwen3-max' | 'o3-pro' | 'gpt-4.1-nano' | 'gpt-5-codex' | 'o4-mini' | 'route-llm' | 'gpt-5.1-codex' | 'openai/gpt-oss-120b' | 'deepseek/deepseek-v3.1' | 'zai-org/glm-4.5' | 'zai-org/glm-4.6' | 'zai-org/glm-5' | 'zai-org/glm-4.7' | 'meta-llama/Meta-Llama-3.1-8B-Instruct' | 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-V3.2' | 'Qwen/Qwen3-32B' | 'Qwen/qwen3-coder-480b-a35b-instruct' | 'Qwen/QwQ-32B' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 */
export const createAlibaba = (apiKey: string, baseURL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1') => merge(
  createChatProvider<'qwen2-5-72b-instruct' | 'qwen3-coder-30b-a3b-instruct' | 'qwen3-8b' | 'qwen-mt-plus' | 'qwen3.5-plus' | 'qwen2-5-omni-7b' | 'qwen-turbo' | 'qwen-vl-max' | 'qwen-omni-turbo-realtime' | 'qwen-vl-plus' | 'qwen-max' | 'qvq-max' | 'qwen-plus-character-ja' | 'qwq-plus' | 'qwen3-omni-flash' | 'qwen3-14b' | 'qwen-plus' | 'qwen2-5-7b-instruct' | 'qwen2-5-32b-instruct' | 'qwen3-omni-flash-realtime' | 'qwen3-coder-480b-a35b-instruct' | 'qwen3-next-80b-a3b-thinking' | 'qwen3-vl-30b-a3b' | 'qwen3-next-80b-a3b-instruct' | 'qwen-mt-turbo' | 'qwen3-vl-plus' | 'qwen3-235b-a22b' | 'qwen2-5-vl-7b-instruct' | 'qwen-vl-ocr' | 'qwen-omni-turbo' | 'qwen3.5-397b-a17b' | 'qwen3-livetranslate-flash-realtime' | 'qwen3-coder-plus' | 'qwen-flash' | 'qwen3-max' | 'qwen2-5-vl-72b-instruct' | 'qwen3-32b' | 'qwen3-asr-flash' | 'qwen3-coder-flash' | 'qwen2-5-14b-instruct' | 'qwen3-vl-235b-a22b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba (China) Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 */
export const createAlibabaCn = (apiKey: string, baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1') => merge(
  createChatProvider<'qwen-math-plus' | 'qwen2-5-72b-instruct' | 'qwen3-coder-30b-a3b-instruct' | 'qwen3-8b' | 'qwen-mt-plus' | 'qwen3.5-plus' | 'deepseek-v3-2-exp' | 'deepseek-r1-distill-llama-70b' | 'qwen2-5-omni-7b' | 'qwen-plus-character' | 'qwen-turbo' | 'qwen-vl-max' | 'qwen-doc-turbo' | 'qwq-32b' | 'kimi-k2-thinking' | 'qwen-omni-turbo-realtime' | 'deepseek-r1' | 'qwen-vl-plus' | 'qwen-max' | 'qvq-max' | 'qwen-long' | 'qwen-deep-research' | 'moonshot-kimi-k2-instruct' | 'kimi-k2.5' | 'qwen2-5-coder-32b-instruct' | 'deepseek-v3' | 'qwq-plus' | 'qwen3-omni-flash' | 'qwen2-5-coder-7b-instruct' | 'deepseek-r1-distill-qwen-1-5b' | 'deepseek-r1-distill-qwen-14b' | 'qwen3-14b' | 'qwen-plus' | 'deepseek-r1-distill-qwen-7b' | 'qwen2-5-7b-instruct' | 'qwen2-5-32b-instruct' | 'qwen3-omni-flash-realtime' | 'qwen-math-turbo' | 'tongyi-intent-detect-v3' | 'qwen3-coder-480b-a35b-instruct' | 'qwen3-next-80b-a3b-thinking' | 'MiniMax-M2.5' | 'qwen3-vl-30b-a3b' | 'qwen3-next-80b-a3b-instruct' | 'deepseek-r1-distill-qwen-32b' | 'qwen-mt-turbo' | 'qwen3-vl-plus' | 'deepseek-v3-1' | 'qwen3-235b-a22b' | 'qwen2-5-vl-7b-instruct' | 'glm-5' | 'qwen-vl-ocr' | 'qwen-omni-turbo' | 'qwen3.5-397b-a17b' | 'qwen-flash' | 'qwen2-5-math-7b-instruct' | 'deepseek-r1-0528' | 'qwen3-max' | 'qwen2-5-vl-72b-instruct' | 'qwen3-32b' | 'qwen2-5-math-72b-instruct' | 'deepseek-r1-distill-llama-8b' | 'qwen3-asr-flash' | 'qwen3-coder-flash' | 'qwen2-5-14b-instruct' | 'qwen3-vl-235b-a22b' | 'qwen3.5-flash' | 'qwen3-coder-plus' | 'MiniMax/MiniMax-M2.5' | 'kimi/kimi-k2.5' | 'siliconflow/deepseek-v3.1-terminus' | 'siliconflow/deepseek-v3-0324' | 'siliconflow/deepseek-r1-0528' | 'siliconflow/deepseek-v3.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Coding Plan Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/coding-plan}
 */
export const createAlibabaCodingPlan = (apiKey: string, baseURL = 'https://coding-intl.dashscope.aliyuncs.com/v1') => merge(
  createChatProvider<'qwen3.5-plus' | 'qwen3-coder-next' | 'kimi-k2.5' | 'MiniMax-M2.5' | 'glm-5' | 'qwen3-coder-plus' | 'glm-4.7' | 'qwen3-max-2026-01-23'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Coding Plan (China) Provider
 * @see {@link https://help.aliyun.com/zh/model-studio/coding-plan}
 */
export const createAlibabaCodingPlanCn = (apiKey: string, baseURL = 'https://coding.dashscope.aliyuncs.com/v1') => merge(
  createChatProvider<'qwen3.5-plus' | 'qwen3-coder-next' | 'kimi-k2.5' | 'MiniMax-M2.5' | 'glm-5' | 'qwen3-coder-plus' | 'glm-4.7' | 'qwen3-max-2026-01-23'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Bailing Provider
 * @see {@link https://alipaytbox.yuque.com/sxs0ba/ling/intro}
 */
export const createBailing = (apiKey: string, baseURL = 'https://api.tbox.cn/api/llm/v1/chat/completions') => merge(
  createChatProvider<'Ling-1T' | 'Ring-1T'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Baseten Provider
 * @see {@link https://docs.baseten.co/development/model-apis/overview}
 */
export const createBaseten = (apiKey: string, baseURL = 'https://inference.baseten.co/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'zai-org/GLM-4.7' | 'zai-org/GLM-5' | 'zai-org/GLM-4.6' | 'nvidia/Nemotron-120B-A12B' | 'MiniMaxAI/MiniMax-M2.5' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324' | 'deepseek-ai/DeepSeek-V3.2' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Berget.AI Provider
 * @see {@link https://api.berget.ai}
 */
export const createBerget = (apiKey: string, baseURL = 'https://api.berget.ai/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'zai-org/GLM-4.7' | 'meta-llama/Llama-3.3-70B-Instruct' | 'intfloat/multilingual-e5-large-instruct' | 'intfloat/multilingual-e5-large' | 'KBLab/kb-whisper-large' | 'BAAI/bge-reranker-v2-m3' | 'mistralai/Mistral-Small-3.2-24B-Instruct-2506'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cerebras Provider
 * @see {@link https://inference-docs.cerebras.ai/models/overview}
 */
export const createCerebras = (apiKey: string, baseURL = 'https://api.cerebras.ai/v1/') => merge(
  createChatProvider<'gpt-oss-120b' | 'llama3.1-8b' | 'zai-glm-4.7' | 'qwen-3-235b-a22b-instruct-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Chutes Provider
 * @see {@link https://llm.chutes.ai/v1/models}
 */
export const createChutes = (apiKey: string, baseURL = 'https://llm.chutes.ai/v1') => merge(
  createChatProvider<'unsloth/gemma-3-27b-it' | 'unsloth/gemma-3-4b-it' | 'unsloth/Mistral-Nemo-Instruct-2407' | 'unsloth/Llama-3.2-3B-Instruct' | 'unsloth/Llama-3.2-1B-Instruct' | 'unsloth/Mistral-Small-24B-Instruct-2501' | 'unsloth/gemma-3-12b-it' | 'openai/gpt-oss-120b-TEE' | 'openai/gpt-oss-20b' | 'NousResearch/Hermes-4-405B-FP8-TEE' | 'NousResearch/Hermes-4-14B' | 'NousResearch/Hermes-4.3-36B' | 'NousResearch/DeepHermes-3-Mistral-24B-Preview' | 'NousResearch/Hermes-4-70B' | 'zai-org/GLM-4.6-TEE' | 'zai-org/GLM-4.5-Air' | 'zai-org/GLM-4.6V' | 'zai-org/GLM-4.7-TEE' | 'zai-org/GLM-4.6-FP8' | 'zai-org/GLM-4.7-Flash' | 'zai-org/GLM-4.5-TEE' | 'zai-org/GLM-4.5-FP8' | 'zai-org/GLM-5-TEE' | 'zai-org/GLM-5-Turbo' | 'zai-org/GLM-4.7-FP8' | 'nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16' | 'rednote-hilab/dots.ocr' | 'miromind-ai/MiroThinker-v1.5-235B' | 'MiniMaxAI/MiniMax-M2.5-TEE' | 'MiniMaxAI/MiniMax-M2.1-TEE' | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B' | 'deepseek-ai/DeepSeek-V3.1-Terminus-TEE' | 'deepseek-ai/DeepSeek-R1-0528-TEE' | 'deepseek-ai/DeepSeek-V3-0324-TEE' | 'deepseek-ai/DeepSeek-V3.2-TEE' | 'deepseek-ai/DeepSeek-V3.2-Speciale-TEE' | 'deepseek-ai/DeepSeek-R1-TEE' | 'deepseek-ai/DeepSeek-V3.1-TEE' | 'deepseek-ai/DeepSeek-V3' | 'Qwen/Qwen3-30B-A3B' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'Qwen/Qwen2.5-VL-72B-Instruct-TEE' | 'Qwen/Qwen3Guard-Gen-0.6B' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen3-Coder-Next' | 'Qwen/Qwen3-235B-A22B' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3.5-397B-A17B-TEE' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8-TEE' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-235B-A22B-Instruct-2507-TEE' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct' | 'chutesai/Mistral-Small-3.2-24B-Instruct-2506' | 'chutesai/Mistral-Small-3.1-24B-Instruct-2503' | 'moonshotai/Kimi-K2-Thinking-TEE' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2.5-TEE' | 'OpenGVLab/InternVL3-78B-TEE' | 'XiaomiMiMo/MiMo-V2-Flash' | 'tngtech/TNG-R1T-Chimera-TEE' | 'tngtech/TNG-R1T-Chimera-Turbo' | 'tngtech/DeepSeek-R1T-Chimera' | 'tngtech/DeepSeek-TNG-R1T2-Chimera' | 'mistralai/Devstral-2-123B-Instruct-2512-TEE'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a CloudFerro Sherlock Provider
 * @see {@link https://docs.sherlock.cloudferro.com/}
 */
export const createCloudferroSherlock = (apiKey: string, baseURL = 'https://api-sherlock.cloudferro.com/openai/v1/') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'meta-llama/Llama-3.3-70B-Instruct' | 'MiniMaxAI/MiniMax-M2.5' | 'speakleash/Bielik-11B-v3.0-Instruct' | 'speakleash/Bielik-11B-v2.6-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cohere Provider
 * @see {@link https://docs.cohere.com/docs/models}
 */
export const createCohere = (apiKey: string, baseURL = 'https://api.cohere.ai/compatibility/v1/') => merge(
  createChatProvider<'command-a-reasoning-08-2025' | 'command-r-08-2024' | 'command-a-translate-08-2025' | 'command-a-03-2025' | 'command-r-plus-08-2024' | 'c4ai-aya-expanse-32b' | 'command-a-vision-07-2025' | 'command-r7b-arabic-02-2025' | 'c4ai-aya-vision-8b' | 'command-r7b-12-2024' | 'c4ai-aya-expanse-8b' | 'c4ai-aya-vision-32b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Cortecs Provider
 * @see {@link https://api.cortecs.ai/v1/models}
 */
export const createCortecs = (apiKey: string, baseURL = 'https://api.cortecs.ai/v1') => merge(
  createChatProvider<'claude-4-6-sonnet' | 'deepseek-v3-0324' | 'kimi-k2-thinking' | 'devstral-2512' | 'kimi-k2.5' | 'llama-3.1-405b-instruct' | 'glm-4.7-flash' | 'gpt-4.1' | 'minimax-m2' | 'gpt-oss-120b' | 'glm-4.5' | 'minimax-m2.1' | 'qwen3-coder-480b-a35b-instruct' | 'qwen3-next-80b-a3b-thinking' | 'gemini-2.5-pro' | 'claude-opus4-5' | 'nova-pro-v1' | 'claude-sonnet-4' | 'intellect-3' | 'glm-4.5-air' | 'glm-4.7' | 'devstral-small-2512' | 'qwen3-32b' | 'claude-opus4-6' | 'claude-haiku-4-5' | 'minimax-m2.5' | 'kimi-k2-instruct' | 'claude-4-5-sonnet'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Deep Infra Provider
 * @see {@link https://deepinfra.com/models}
 */
export const createDeepinfra = (apiKey: string, baseURL = 'https://api.deepinfra.com/v1/openai/') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'anthropic/claude-4-opus' | 'anthropic/claude-3-7-sonnet-latest' | 'zai-org/GLM-4.7' | 'zai-org/GLM-4.6V' | 'zai-org/GLM-4.7-Flash' | 'zai-org/GLM-4.5' | 'zai-org/GLM-5' | 'zai-org/GLM-4.6' | 'meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'meta-llama/Llama-3.1-8B-Instruct' | 'meta-llama/Llama-3.1-8B-Instruct-Turbo' | 'meta-llama/Llama-3.1-70B-Instruct-Turbo' | 'meta-llama/Llama-3.1-70B-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct-Turbo' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2.5' | 'MiniMaxAI/MiniMax-M2' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.2' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a DeepSeek Provider
 * @see {@link https://api-docs.deepseek.com/quick_start/pricing}
 */
export const createDeepSeek = (apiKey: string, baseURL = 'https://api.deepseek.com') => merge(
  createChatProvider<'deepseek-chat' | 'deepseek-reasoner'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a DInference Provider
 * @see {@link https://dinference.com}
 */
export const createDinference = (apiKey: string, baseURL = 'https://api.dinference.com/v1') => merge(
  createChatProvider<'gpt-oss-120b' | 'glm-5' | 'glm-4.7'>({ apiKey, baseURL }),
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
  createChatProvider<'openai/gpt-oss-120b' | 'openai/whisper-large-v3' | 'microsoft/Phi-4-multimodal-instruct' | 'nvidia/Llama-3.3-70B-Instruct-FP8' | 'intfloat/multilingual-e5-large-instruct' | 'KBLab/kb-whisper-large' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8' | 'Qwen/Qwen3-Embedding-8B' | 'moonshotai/Kimi-K2.5' | 'mistralai/devstral-small-2-24b-instruct-2512' | 'mistralai/Magistral-Small-2509' | 'mistralai/Voxtral-Small-24B-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a FastRouter Provider
 * @see {@link https://fastrouter.ai/models}
 */
export const createFastrouter = (apiKey: string, baseURL = 'https://go.fastrouter.ai/api/v1') => merge(
  createChatProvider<'openai/gpt-5' | 'openai/gpt-5-mini' | 'openai/gpt-4.1' | 'openai/gpt-oss-120b' | 'openai/gpt-5-nano' | 'openai/gpt-oss-20b' | 'x-ai/grok-4' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-4' | 'z-ai/glm-5' | 'google/gemini-2.5-pro' | 'google/gemini-2.5-flash' | 'deepseek-ai/deepseek-r1-distill-llama-70b' | 'qwen/qwen3-coder' | 'moonshotai/kimi-k2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Fireworks AI Provider
 * @see {@link https://fireworks.ai/docs/}
 */
export const createFireworks = (apiKey: string, baseURL = 'https://api.fireworks.ai/inference/v1/') => merge(
  createChatProvider<'accounts/fireworks/routers/kimi-k2p5-turbo' | 'accounts/fireworks/models/kimi-k2p5' | 'accounts/fireworks/models/kimi-k2-thinking' | 'accounts/fireworks/models/deepseek-v3p1' | 'accounts/fireworks/models/minimax-m2p1' | 'accounts/fireworks/models/minimax-m2p5' | 'accounts/fireworks/models/gpt-oss-120b' | 'accounts/fireworks/models/glm-4p7' | 'accounts/fireworks/models/deepseek-v3p2' | 'accounts/fireworks/models/glm-4p5' | 'accounts/fireworks/models/glm-5' | 'accounts/fireworks/models/glm-4p5-air' | 'accounts/fireworks/models/gpt-oss-20b' | 'accounts/fireworks/models/kimi-k2-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Firmware Provider
 * @see {@link https://docs.frogbot.ai}
 */
export const createFirmware = (apiKey: string, baseURL = 'https://app.frogbot.ai/api/v1') => merge(
  createChatProvider<'claude-opus-4-5' | 'kimi-k2.5' | 'gemini-3-pro-preview' | 'gpt-4o' | 'grok-code-fast-1' | 'zai-glm-5' | 'gpt-5-mini' | 'claude-opus-4-6' | 'deepseek-v3-2' | 'claude-sonnet-4-6' | 'gpt-oss-120b' | 'minimax-m2-5' | 'grok-4-1-fast-non-reasoning' | 'gpt-5-4' | 'gemini-3-flash-preview' | 'gemini-3-1-pro-preview' | 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'grok-4-1-fast-reasoning' | 'gpt-5-nano' | 'gpt-5-3-codex' | 'gpt-oss-20b' | 'claude-sonnet-4-5' | 'claude-haiku-4-5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Friendli Provider
 * @see {@link https://friendli.ai/docs/guides/serverless_endpoints/introduction}
 */
export const createFriendli = (apiKey: string, baseURL = 'https://api.friendli.ai/serverless/v1') => merge(
  createChatProvider<'zai-org/GLM-4.7' | 'zai-org/GLM-5' | 'meta-llama/Llama-3.1-8B-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2.5' | 'Qwen/Qwen3-235B-A22B-Instruct-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a GitHub Copilot Provider
 * @see {@link https://docs.github.com/en/copilot}
 */
export const createGithubCopilot = (apiKey: string, baseURL = 'https://api.githubcopilot.com') => merge(
  createChatProvider<'gpt-5.2-codex' | 'gpt-5.1-codex-mini' | 'claude-opus-4.6' | 'gpt-5.4-mini' | 'gpt-5' | 'claude-haiku-4.5' | 'gemini-3.1-pro-preview' | 'gemini-3-pro-preview' | 'gpt-4o' | 'grok-code-fast-1' | 'gpt-5.3-codex' | 'gpt-5-mini' | 'gpt-5.1-codex-max' | 'gpt-4.1' | 'gpt-5.4' | 'gemini-3-flash-preview' | 'claude-sonnet-4.6' | 'gemini-2.5-pro' | 'claude-sonnet-4' | 'gpt-5.2' | 'gpt-5.1' | 'claude-opus-4.5' | 'claude-opus-41' | 'claude-sonnet-4.5' | 'gpt-5.1-codex'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a GitHub Models Provider
 * @see {@link https://docs.github.com/en/github-models}
 */
export const createGithubModels = (apiKey: string, baseURL = 'https://models.github.ai/inference') => merge(
  createChatProvider<'mistral-ai/codestral-2501' | 'mistral-ai/mistral-large-2411' | 'mistral-ai/mistral-small-2503' | 'mistral-ai/mistral-medium-2505' | 'mistral-ai/ministral-3b' | 'mistral-ai/mistral-nemo' | 'ai21-labs/ai21-jamba-1.5-mini' | 'ai21-labs/ai21-jamba-1.5-large' | 'openai/o3-mini' | 'openai/gpt-4o' | 'openai/gpt-4o-mini' | 'openai/gpt-4.1' | 'openai/o1' | 'openai/o3' | 'openai/gpt-4.1-mini' | 'openai/gpt-4.1-nano' | 'openai/o1-preview' | 'openai/o4-mini' | 'openai/o1-mini' | 'microsoft/phi-3-mini-128k-instruct' | 'microsoft/phi-3-small-8k-instruct' | 'microsoft/phi-4-reasoning' | 'microsoft/phi-4-mini-reasoning' | 'microsoft/phi-3-mini-4k-instruct' | 'microsoft/phi-3-medium-4k-instruct' | 'microsoft/phi-3.5-vision-instruct' | 'microsoft/mai-ds-r1' | 'microsoft/phi-3.5-mini-instruct' | 'microsoft/phi-4' | 'microsoft/phi-3-medium-128k-instruct' | 'microsoft/phi-3.5-moe-instruct' | 'microsoft/phi-4-multimodal-instruct' | 'microsoft/phi-3-small-128k-instruct' | 'microsoft/phi-4-mini-instruct' | 'cohere/cohere-command-r-plus-08-2024' | 'cohere/cohere-command-r' | 'cohere/cohere-command-r-08-2024' | 'cohere/cohere-command-r-plus' | 'cohere/cohere-command-a' | 'deepseek/deepseek-v3-0324' | 'deepseek/deepseek-r1' | 'deepseek/deepseek-r1-0528' | 'xai/grok-3-mini' | 'xai/grok-3' | 'core42/jais-30b-chat' | 'meta/meta-llama-3.1-8b-instruct' | 'meta/llama-3.3-70b-instruct' | 'meta/llama-4-scout-17b-16e-instruct' | 'meta/llama-3.2-11b-vision-instruct' | 'meta/meta-llama-3-70b-instruct' | 'meta/meta-llama-3-8b-instruct' | 'meta/llama-3.2-90b-vision-instruct' | 'meta/meta-llama-3.1-405b-instruct' | 'meta/llama-4-maverick-17b-128e-instruct-fp8' | 'meta/meta-llama-3.1-70b-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Google Provider
 * @see {@link https://ai.google.dev/gemini-api/docs/pricing}
 */
export const createGoogleGenerativeAI = (apiKey: string, baseURL = 'https://generativelanguage.googleapis.com/v1beta/openai/') => merge(
  createChatProvider<'gemini-2.5-flash-lite' | 'gemini-2.5-flash-lite-preview-09-2025' | 'gemini-2.5-flash-preview-04-17' | 'gemini-3.1-pro-preview' | 'gemma-3n-e2b-it' | 'gemini-2.5-flash-preview-05-20' | 'gemini-3-pro-preview' | 'gemma-3-27b-it' | 'gemma-3-4b-it' | 'gemma-3n-e4b-it' | 'gemini-2.5-pro-preview-06-05' | 'gemini-2.5-pro-preview-05-06' | 'gemini-2.0-flash-lite' | 'gemini-1.5-flash-8b' | 'gemini-1.5-flash' | 'gemini-2.5-pro-preview-tts' | 'gemini-3-flash-preview' | 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-3.1-pro-preview-customtools' | 'gemini-2.5-flash-preview-09-2025' | 'gemini-2.0-flash' | 'gemini-1.5-pro' | 'gemini-2.5-flash-lite-preview-06-17' | 'gemini-2.5-flash-preview-tts' | 'gemini-3.1-flash-lite-preview' | 'gemini-flash-lite-latest' | 'gemini-3.1-flash-image-preview' | 'gemini-2.5-flash-image' | 'gemini-flash-latest' | 'gemma-3-12b-it' | 'gemini-live-2.5-flash-preview-native-audio' | 'gemini-embedding-001' | 'gemini-live-2.5-flash' | 'gemini-2.5-flash-image-preview'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Groq Provider
 * @see {@link https://console.groq.com/docs/models}
 */
export const createGroq = (apiKey: string, baseURL = 'https://api.groq.com/openai/v1/') => merge(
  createChatProvider<'llama3-70b-8192' | 'llama-3.3-70b-versatile' | 'deepseek-r1-distill-llama-70b' | 'gemma2-9b-it' | 'llama-3.1-8b-instant' | 'qwen-qwq-32b' | 'llama-guard-3-8b' | 'mistral-saba-24b' | 'whisper-large-v3' | 'whisper-large-v3-turbo' | 'llama3-8b-8192' | 'allam-2-7b' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-safeguard-20b' | 'openai/gpt-oss-20b' | 'canopylabs/orpheus-arabic-saudi' | 'canopylabs/orpheus-v1-english' | 'meta-llama/llama-guard-4-12b' | 'meta-llama/llama-4-scout-17b-16e-instruct' | 'meta-llama/llama-prompt-guard-2-22m' | 'meta-llama/llama-4-maverick-17b-128e-instruct' | 'meta-llama/llama-prompt-guard-2-86m' | 'qwen/qwen3-32b' | 'groq/compound-mini' | 'groq/compound' | 'moonshotai/kimi-k2-instruct-0905' | 'moonshotai/kimi-k2-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Helicone Provider
 * @see {@link https://helicone.ai/models}
 */
export const createHelicone = (apiKey: string, baseURL = 'https://ai-gateway.helicone.ai/v1') => merge(
  createChatProvider<'qwen3-coder-30b-a3b-instruct' | 'gemini-2.5-flash-lite' | 'gpt-5.1-codex-mini' | 'llama-3.3-70b-versatile' | 'claude-4.5-opus' | 'hermes-2-pro-llama-3-8b' | 'o3-mini' | 'deepseek-v3.1-terminus' | 'deepseek-r1-distill-llama-70b' | 'sonar-reasoning' | 'gpt-5-pro' | 'qwen3-vl-235b-a22b-instruct' | 'kimi-k2-thinking' | 'kimi-k2-0711' | 'gpt-5' | 'llama-3.3-70b-instruct' | 'chatgpt-4o-latest' | 'deepseek-v3' | 'gemma2-9b-it' | 'gemini-3-pro-preview' | 'gpt-4o' | 'grok-4-fast-non-reasoning' | 'grok-4' | 'grok-code-fast-1' | 'kimi-k2-0905' | 'gpt-5-mini' | 'mistral-large-2411' | 'ernie-4.5-21b-a3b-thinking' | 'llama-guard-4' | 'claude-sonnet-4-5-20250929' | 'gpt-4o-mini' | 'qwen2.5-coder-7b-fast' | 'qwen3-30b-a3b' | 'gpt-4.1' | 'llama-3.1-8b-instruct' | 'gpt-5.1-chat-latest' | 'sonar-deep-research' | 'sonar' | 'gpt-oss-120b' | 'llama-4-scout' | 'llama-prompt-guard-2-22m' | 'qwen3-coder' | 'o1' | 'codex-mini-latest' | 'o3' | 'grok-4-1-fast-non-reasoning' | 'sonar-reasoning-pro' | 'claude-3-haiku-20240307' | 'llama-3.1-8b-instant' | 'deepseek-reasoner' | 'claude-3.5-sonnet-v2' | 'llama-4-maverick' | 'grok-3-mini' | 'gpt-4.1-mini-2025-04-14' | 'claude-opus-4-1' | 'glm-4.6' | 'llama-3.1-8b-instruct-turbo' | 'claude-3.7-sonnet' | 'gemini-2.5-pro' | 'qwen3-235b-a22b-thinking' | 'claude-opus-4-1-20250805' | 'claude-sonnet-4' | 'gemini-2.5-flash' | 'sonar-pro' | 'mistral-nemo' | 'qwen3-next-80b-a3b-instruct' | 'grok-4-1-fast-reasoning' | 'gpt-5.1' | 'claude-3.5-haiku' | 'mistral-small' | 'gpt-4.1-mini' | 'gpt-5-chat-latest' | 'grok-4-fast-reasoning' | 'gpt-5-nano' | 'grok-3' | 'deepseek-tng-r1t2-chimera' | 'claude-haiku-4-5-20251001' | 'claude-4.5-sonnet' | 'o3-pro' | 'gpt-oss-20b' | 'qwen3-32b' | 'gpt-4.1-nano' | 'gemma-3-12b-it' | 'claude-4.5-haiku' | 'deepseek-v3.2' | 'llama-prompt-guard-2-86m' | 'gpt-5-codex' | 'o4-mini' | 'gpt-5.1-codex' | 'o1-mini' | 'claude-opus-4'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Hugging Face Provider
 * @see {@link https://huggingface.co/docs/inference-providers}
 */
export const createHuggingface = (apiKey: string, baseURL = 'https://router.huggingface.co/v1') => merge(
  createChatProvider<'zai-org/GLM-4.7' | 'zai-org/GLM-4.7-Flash' | 'zai-org/GLM-5' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2.5' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.2' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen3-Coder-Next' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3-Embedding-4B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-Embedding-8B' | 'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'XiaomiMiMo/MiMo-V2-Flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a iFlow Provider
 * @see {@link https://platform.iflow.cn/en/docs}
 */
export const createIflowcn = (apiKey: string, baseURL = 'https://apis.iflow.cn/v1') => merge(
  createChatProvider<'deepseek-r1' | 'qwen3-max-preview' | 'deepseek-v3' | 'kimi-k2-0905' | 'kimi-k2' | 'qwen3-235b' | 'glm-4.6' | 'qwen3-235b-a22b-instruct' | 'qwen3-235b-a22b-thinking-2507' | 'qwen3-vl-plus' | 'qwen3-coder-plus' | 'qwen3-max' | 'qwen3-32b' | 'deepseek-v3.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Inception Provider
 * @see {@link https://platform.inceptionlabs.ai/docs}
 */
export const createInception = (apiKey: string, baseURL = 'https://api.inceptionlabs.ai/v1/') => merge(
  createChatProvider<'mercury-edit' | 'mercury-2' | 'mercury-coder' | 'mercury'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Inference Provider
 * @see {@link https://inference.net/models}
 */
export const createInference = (apiKey: string, baseURL = 'https://inference.net/v1') => merge(
  createChatProvider<'google/gemma-3' | 'qwen/qwen3-embedding-4b' | 'qwen/qwen-2.5-7b-vision-instruct' | 'mistral/mistral-nemo-12b-instruct' | 'meta/llama-3.2-1b-instruct' | 'meta/llama-3.1-8b-instruct' | 'meta/llama-3.2-11b-vision-instruct' | 'meta/llama-3.2-3b-instruct' | 'osmosis/osmosis-structure-0.6b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a IO.NET Provider
 * @see {@link https://io.net/docs/guides/intelligence/io-intelligence}
 */
export const createIoNet = (apiKey: string, baseURL = 'https://api.intelligence.io.solutions/api/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'zai-org/GLM-4.6' | 'Intel/Qwen3-Coder-480B-A35B-Instruct-int4-mixed-ar' | 'meta-llama/Llama-3.3-70B-Instruct' | 'meta-llama/Llama-3.2-90B-Vision-Instruct' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'deepseek-ai/DeepSeek-R1-0528' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'mistralai/Devstral-Small-2505' | 'mistralai/Mistral-Large-Instruct-2411' | 'mistralai/Mistral-Nemo-Instruct-2407' | 'mistralai/Magistral-Small-2506'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Jiekou.AI Provider
 * @see {@link https://docs.jiekou.ai/docs/support/quickstart?utm_source=github_models.dev}
 */
export const createJiekou = (apiKey: string, baseURL = 'https://api.jiekou.ai/openai') => merge(
  createChatProvider<'gpt-5.2-codex' | 'gemini-2.5-flash-lite' | 'gpt-5.1-codex-mini' | 'claude-opus-4-5-20251101' | 'o3-mini' | 'gpt-5-pro' | 'gemini-2.5-flash-lite-preview-09-2025' | 'claude-opus-4-20250514' | 'gemini-2.5-flash-preview-05-20' | 'gemini-3-pro-preview' | 'grok-4-fast-non-reasoning' | 'grok-code-fast-1' | 'gpt-5-mini' | 'claude-opus-4-6' | 'claude-sonnet-4-5-20250929' | 'gpt-5.1-codex-max' | 'gemini-2.5-pro-preview-06-05' | 'o3' | 'grok-4-1-fast-non-reasoning' | 'claude-sonnet-4-20250514' | 'grok-4-0709' | 'gemini-3-flash-preview' | 'gemini-2.5-pro' | 'claude-opus-4-1-20250805' | 'gemini-2.5-flash' | 'gpt-5.2' | 'grok-4-1-fast-reasoning' | 'gpt-5.1' | 'gpt-5-chat-latest' | 'grok-4-fast-reasoning' | 'gpt-5-nano' | 'gemini-2.5-flash-lite-preview-06-17' | 'claude-haiku-4-5-20251001' | 'gpt-5-codex' | 'o4-mini' | 'gpt-5.1-codex' | 'gpt-5.2-pro' | 'deepseek/deepseek-v3-0324' | 'deepseek/deepseek-v3.1' | 'deepseek/deepseek-r1-0528' | 'zai-org/glm-4.7-flash' | 'zai-org/glm-4.5' | 'zai-org/glm-4.5v' | 'zai-org/glm-4.7' | 'baidu/ernie-4.5-300b-a47b-paddle' | 'baidu/ernie-4.5-vl-424b-a47b' | 'minimaxai/minimax-m1-80k' | 'minimax/minimax-m2.1' | 'qwen/qwen3-235b-a22b-instruct-2507' | 'qwen/qwen3-coder-next' | 'qwen/qwen3-30b-a3b-fp8' | 'qwen/qwen3-235b-a22b-fp8' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3-32b-fp8' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-instruct' | 'xiaomimimo/mimo-v2-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Kilo Gateway Provider
 * @see {@link https://kilo.ai}
 */
export const createKilo = (apiKey: string, baseURL = 'https://api.kilo.ai/api/gateway') => merge(
  createChatProvider<'giga-potato' | 'corethink:free' | 'giga-potato-thinking' | 'morph-warp-grep-v2' | 'eleutherai/llemma_7b' | 'meituan/longcat-flash-chat' | 'openai/gpt-5.2-codex' | 'openai/o1-pro' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.4-pro' | 'openai/gpt-3.5-turbo-16k' | 'openai/gpt-4o:extended' | 'openai/o3-mini' | 'openai/gpt-4-1106-preview' | 'openai/gpt-5-pro' | 'openai/gpt-3.5-turbo-0613' | 'openai/gpt-5-image-mini' | 'openai/gpt-5' | 'openai/gpt-4-0314' | 'openai/gpt-audio' | 'openai/gpt-4-turbo' | 'openai/gpt-4o' | 'openai/gpt-5.3-codex' | 'openai/o3-mini-high' | 'openai/gpt-5-mini' | 'openai/gpt-4-turbo-preview' | 'openai/gpt-4o-mini' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-4.1' | 'openai/gpt-3.5-turbo' | 'openai/gpt-3.5-turbo-instruct' | 'openai/gpt-oss-120b' | 'openai/gpt-5.1-chat' | 'openai/gpt-5.4' | 'openai/o1' | 'openai/gpt-4o-audio-preview' | 'openai/o3' | 'openai/gpt-5-chat' | 'openai/gpt-4o-search-preview' | 'openai/o4-mini-high' | 'openai/gpt-4o-2024-05-13' | 'openai/gpt-4' | 'openai/gpt-5.3-chat' | 'openai/gpt-4o-2024-11-20' | 'openai/gpt-5.2-chat' | 'openai/gpt-5.2' | 'openai/o4-mini-deep-research' | 'openai/gpt-audio-mini' | 'openai/gpt-5.1' | 'openai/gpt-4o-mini-search-preview' | 'openai/gpt-4.1-mini' | 'openai/gpt-4o-mini-2024-07-18' | 'openai/gpt-5-nano' | 'openai/gpt-oss-safeguard-20b' | 'openai/o3-pro' | 'openai/gpt-oss-20b' | 'openai/gpt-4o-2024-08-06' | 'openai/gpt-4.1-nano' | 'openai/gpt-5-image' | 'openai/gpt-5-codex' | 'openai/o4-mini' | 'openai/o3-deep-research' | 'openai/gpt-5.1-codex' | 'openai/gpt-5.2-pro' | 'prime-intellect/intellect-3' | 'microsoft/phi-4' | 'microsoft/wizardlm-2-8x22b' | 'cohere/command-r-08-2024' | 'cohere/command-r-plus-08-2024' | 'cohere/command-r7b-12-2024' | 'cohere/command-a' | 'kwaipilot/kat-coder-pro' | 'switchpoint/router' | 'morph/morph-v3-large' | 'morph/morph-v3-fast' | 'x-ai/grok-4-fast' | 'x-ai/grok-4.20-beta' | 'x-ai/grok-4.1-fast' | 'x-ai/grok-4' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4.20-multi-agent-beta' | 'x-ai/grok-3-mini' | 'x-ai/grok-3-beta' | 'x-ai/grok-code-fast-1:optimized:free' | 'x-ai/grok-3' | 'x-ai/grok-3-mini-beta' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-3.7-sonnet:thinking' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-3.7-sonnet' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-3.5-haiku' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-3.5-sonnet' | 'anthropic/claude-3-haiku' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-opus-4' | 'alpindale/goliath-120b' | 'relace/relace-search' | 'relace/relace-apply-3' | 'sao10k/l3.1-70b-hanami-x1' | 'sao10k/l3-lunaris-8b' | 'sao10k/l3.3-euryale-70b' | 'sao10k/l3.1-euryale-70b' | 'sao10k/l3-euryale-70b' | 'upstage/solar-pro-3' | 'mancer/weaver' | 'deepseek/deepseek-v3.1-terminus' | 'deepseek/deepseek-r1-distill-llama-70b' | 'deepseek/deepseek-r1' | 'deepseek/deepseek-chat' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-chat-v3.1' | 'deepseek/deepseek-v3.2-speciale' | 'deepseek/deepseek-r1-distill-qwen-32b' | 'deepseek/deepseek-chat-v3-0324' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-v3.2' | 'nvidia/llama-3.1-nemotron-70b-instruct' | 'nvidia/llama-3.3-nemotron-super-49b-v1.5' | 'nvidia/nemotron-nano-12b-v2-vl' | 'nvidia/nemotron-nano-9b-v2' | 'nvidia/nemotron-3-super-120b-a12b:free' | 'nvidia/nemotron-3-nano-30b-a3b' | 'gryphe/mythomax-l2-13b' | 'z-ai/glm-4.7-flash' | 'z-ai/glm-4.5' | 'z-ai/glm-4.6' | 'z-ai/glm-4.6v' | 'z-ai/glm-5' | 'z-ai/glm-4.5-air' | 'z-ai/glm-4.5v' | 'z-ai/glm-4.7' | 'z-ai/glm-4-32b' | 'nex-agi/deepseek-v3.1-nex-n1' | 'allenai/olmo-3.1-32b-instruct' | 'allenai/olmo-2-0325-32b-instruct' | 'allenai/olmo-3-32b-think' | 'allenai/olmo-3-7b-think' | 'allenai/olmo-3.1-32b-think' | 'allenai/olmo-3-7b-instruct' | 'allenai/molmo-2-8b' | 'google/gemini-2.5-flash-lite' | 'google/gemini-2.5-flash-lite-preview-09-2025' | 'google/gemma-2-9b-it' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3-pro-preview' | 'google/gemma-3-27b-it' | 'google/gemma-3-4b-it' | 'google/gemma-3n-e4b-it' | 'google/gemini-2.5-pro-preview-05-06' | 'google/gemini-2.0-flash-001' | 'google/gemini-2.0-flash-lite-001' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-pro-preview' | 'google/gemini-2.5-pro' | 'google/gemini-2.5-flash' | 'google/gemini-3.1-pro-preview-customtools' | 'google/gemma-2-27b-it' | 'google/gemini-3.1-flash-lite-preview' | 'google/gemini-3.1-flash-image-preview' | 'google/gemini-2.5-flash-image' | 'google/gemma-3-12b-it' | 'google/gemini-3-pro-image-preview' | 'undi95/remm-slerp-l2-13b' | 'amazon/nova-lite-v1' | 'amazon/nova-2-lite-v1' | 'amazon/nova-micro-v1' | 'amazon/nova-pro-v1' | 'amazon/nova-premier-v1' | 'baidu/ernie-4.5-21b-a3b' | 'baidu/ernie-4.5-300b-a47b' | 'baidu/ernie-4.5-21b-a3b-thinking' | 'baidu/ernie-4.5-vl-28b-a3b' | 'baidu/ernie-4.5-vl-424b-a47b' | 'ibm-granite/granite-4.0-h-micro' | 'kilo/auto' | 'kilo/auto-free' | 'kilo/auto-small' | 'meta-llama/llama-3.3-70b-instruct' | 'meta-llama/llama-3.2-1b-instruct' | 'meta-llama/llama-guard-4-12b' | 'meta-llama/llama-3.1-405b-instruct' | 'meta-llama/llama-3.1-8b-instruct' | 'meta-llama/llama-3.2-11b-vision-instruct' | 'meta-llama/llama-4-scout' | 'meta-llama/llama-3-8b-instruct' | 'meta-llama/llama-3-70b-instruct' | 'meta-llama/llama-4-maverick' | 'meta-llama/llama-guard-3-8b' | 'meta-llama/llama-3.2-3b-instruct' | 'meta-llama/llama-3.1-70b-instruct' | 'meta-llama/llama-3.1-405b' | 'openrouter/hunter-alpha' | 'openrouter/free' | 'openrouter/bodybuilder' | 'openrouter/auto' | 'openrouter/healer-alpha' | 'perplexity/sonar-deep-research' | 'perplexity/sonar' | 'perplexity/sonar-reasoning-pro' | 'perplexity/sonar-pro' | 'perplexity/sonar-pro-search' | 'essentialai/rnj-1-instruct' | 'arcee-ai/coder-large' | 'arcee-ai/trinity-large-preview:free' | 'arcee-ai/virtuoso-large' | 'arcee-ai/trinity-mini' | 'arcee-ai/spotlight' | 'arcee-ai/maestro-reasoning' | 'bytedance/ui-tars-1.5-7b' | 'kilo-auto/free' | 'kilo-auto/balanced' | 'kilo-auto/small' | 'kilo-auto/frontier' | 'nousresearch/hermes-2-pro-llama-3-8b' | 'nousresearch/hermes-4-70b' | 'nousresearch/hermes-3-llama-3.1-70b' | 'nousresearch/hermes-4-405b' | 'nousresearch/hermes-3-llama-3.1-405b' | 'minimax/minimax-m2-her' | 'minimax/minimax-01' | 'minimax/minimax-m2' | 'minimax/minimax-m2.1' | 'minimax/minimax-m2.5' | 'minimax/minimax-m1' | 'minimax/minimax-m2.5:free' | 'qwen/qwen3-coder-30b-a3b-instruct' | 'qwen/qwen3-8b' | 'qwen/qwen3.5-9b' | 'qwen/qwen-turbo' | 'qwen/qwen-vl-max' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'qwen/qwq-32b' | 'qwen/qwen3-coder-next' | 'qwen/qwen-vl-plus' | 'qwen/qwen-max' | 'qwen/qwen3.5-flash-02-23' | 'qwen/qwen3-vl-32b-instruct' | 'qwen/qwen2.5-coder-7b-instruct' | 'qwen/qwen3-14b' | 'qwen/qwen3-30b-a3b-thinking-2507' | 'qwen/qwen3.5-plus-02-15' | 'qwen/qwen3.5-35b-a3b' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen3-30b-a3b' | 'qwen/qwen-plus' | 'qwen/qwen3-vl-8b-thinking' | 'qwen/qwen3-coder' | 'qwen/qwen3.5-27b' | 'qwen/qwen2.5-vl-32b-instruct' | 'qwen/qwen-2.5-7b-instruct' | 'qwen/qwen-plus-2025-07-28:thinking' | 'qwen/qwen2.5-vl-72b-instruct' | 'qwen/qwen3-235b-a22b-2507' | 'qwen/qwen3-vl-8b-instruct' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-vl-30b-a3b-instruct' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen3-max-thinking' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3-235b-a22b' | 'qwen/qwen3-vl-30b-a3b-thinking' | 'qwen/qwen-plus-2025-07-28' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen3-coder-plus' | 'qwen/qwen3-max' | 'qwen/qwen3-32b' | 'qwen/qwen3-vl-235b-a22b-thinking' | 'qwen/qwen-2.5-72b-instruct' | 'qwen/qwen3-coder-flash' | 'qwen/qwen-2.5-vl-7b-instruct' | 'qwen/qwen-2.5-coder-32b-instruct' | 'qwen/qwen3-30b-a3b-instruct-2507' | 'xiaomi/mimo-v2-flash' | 'stepfun/step-3.5-flash' | 'stepfun/step-3.5-flash:free' | 'alfredpros/codellama-7b-instruct-solidity' | 'ai21/jamba-large-1.7' | 'liquid/lfm-2.2-6b' | 'liquid/lfm2-8b-a1b' | 'liquid/lfm-2-24b-a2b' | 'aion-labs/aion-2.0' | 'aion-labs/aion-rp-llama-3.1-8b' | 'aion-labs/aion-1.0-mini' | 'aion-labs/aion-1.0' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2' | 'tencent/hunyuan-a13b-instruct' | 'alibaba/tongyi-deepresearch-30b-a3b' | 'bytedance-seed/seed-2.0-mini' | 'bytedance-seed/seed-1.6-flash' | 'bytedance-seed/seed-1.6' | 'bytedance-seed/seed-2.0-lite' | 'inflection/inflection-3-pi' | 'inflection/inflection-3-productivity' | 'writer/palmyra-x5' | 'inception/mercury-2' | 'inception/mercury-coder' | 'inception/mercury' | 'anthracite-org/magnum-v4-72b' | 'thedrummer/skyfall-36b-v2' | 'thedrummer/rocinante-12b' | 'thedrummer/cydonia-24b-v4.1' | 'thedrummer/unslopnemo-12b' | 'tngtech/deepseek-r1t2-chimera' | 'deepcogito/cogito-v2.1-671b' | 'mistralai/mistral-medium-3.1' | 'mistralai/mixtral-8x22b-instruct' | 'mistralai/devstral-medium' | 'mistralai/mistral-7b-instruct-v0.1' | 'mistralai/mistral-medium-3' | 'mistralai/devstral-2512' | 'mistralai/mixtral-8x7b-instruct' | 'mistralai/mistral-small-24b-instruct-2501' | 'mistralai/ministral-8b-2512' | 'mistralai/ministral-14b-2512' | 'mistralai/mistral-large-2411' | 'mistralai/codestral-2508' | 'mistralai/mistral-large-2407' | 'mistralai/devstral-small' | 'mistralai/mistral-small-creative' | 'mistralai/voxtral-small-24b-2507' | 'mistralai/mistral-nemo' | 'mistralai/mistral-large' | 'mistralai/ministral-3b-2512' | 'mistralai/mistral-small-3.2-24b-instruct' | 'mistralai/pixtral-large-2411' | 'mistralai/mistral-saba' | 'mistralai/mistral-small-3.1-24b-instruct' | 'mistralai/mistral-large-2512'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Kimi For Coding Provider
 * @see {@link https://www.kimi.com/coding/docs/en/third-party-agents.html}
 */
export const createKimiForCoding = (apiKey: string, baseURL = 'https://api.kimi.com/coding/v1') => merge(
  createChatProvider<'kimi-k2-thinking' | 'k2p5'>({ apiKey, baseURL }),
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
 * Create a Llama Provider
 * @see {@link https://llama.developer.meta.com/docs/models}
 */
export const createLlama = (apiKey: string, baseURL = 'https://api.llama.com/compat/v1/') => merge(
  createChatProvider<'cerebras-llama-4-scout-17b-16e-instruct' | 'llama-3.3-70b-instruct' | 'cerebras-llama-4-maverick-17b-128e-instruct' | 'groq-llama-4-maverick-17b-128e-instruct' | 'llama-4-scout-17b-16e-instruct-fp8' | 'llama-3.3-8b-instruct' | 'llama-4-maverick-17b-128e-instruct-fp8'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a LLM Gateway Provider
 * @see {@link https://llmgateway.io/docs}
 */
export const createLlmgateway = (apiKey: string, baseURL = 'https://api.llmgateway.io/v1') => merge(
  createChatProvider<'gpt-5.2-codex' | 'qwen3-coder-30b-a3b-instruct' | 'gemini-2.5-flash-lite' | 'grok-4-20-multi-agent-beta-0309' | 'grok-imagine-image' | 'gpt-5.1-codex-mini' | 'qwen3-235b-a22b-instruct-2507' | 'gpt-5.4-pro' | 'claude-opus-4-5-20251101' | 'qwen-image' | 'hermes-2-pro-llama-3-8b' | 'pixtral-large-latest' | 'o3-mini' | 'gpt-5.4-mini' | 'gpt-5-pro' | 'grok-4-fast' | 'qwen-turbo' | 'llama-3.1-nemotron-ultra-253b' | 'gemini-2.5-flash-lite-preview-09-2025' | 'qwen-vl-max' | 'qwen3-vl-235b-a22b-instruct' | 'claude-3-opus' | 'kimi-k2-thinking' | 'qwen3-coder-next' | 'qwen-max-latest' | 'gpt-5.2-chat-latest' | 'qwen-vl-plus' | 'qwen-max' | 'glm-image' | 'gpt-5' | 'llama-3.3-70b-instruct' | 'gemma-3-1b-it' | 'claude-opus-4-20250514' | 'gemini-3.1-pro-preview' | 'devstral-2512' | 'seedream-4-0' | 'claude-3-7-sonnet-20250219' | 'kimi-k2.5' | 'gemma-3n-e2b-it' | 'llama-guard-4-12b' | 'gpt-4-turbo' | 'qwen-image-max' | 'mistral-large-latest' | 'qwq-plus' | 'gpt-4o' | 'grok-4-fast-non-reasoning' | 'glm-4.7-flash' | 'grok-4' | 'grok-code-fast-1' | 'grok-4-20-beta-0309-non-reasoning' | 'gpt-5.3-codex' | 'qwen-plus-latest' | 'gemma-3-4b-it' | 'ministral-8b-2512' | 'kimi-k2-thinking-turbo' | 'ministral-14b-2512' | 'gpt-5-mini' | 'seed-1-6-250615' | 'qwen3-30b-a3b-thinking-2507' | 'kimi-k2' | 'claude-opus-4-6' | 'qwen-image-edit-plus' | 'claude-sonnet-4-5-20250929' | 'gpt-4o-mini' | 'mistral-small-2506' | 'qwen35-397b-a17b' | 'gemma-3n-e4b-it' | 'qwen-plus' | 'codestral-2508' | 'claude-sonnet-4-6' | 'gpt-4.1' | 'llama-3.1-8b-instruct' | 'qwen-image-plus' | 'glm-4.5-airx' | 'minimax-m2' | 'seed-1-6-flash-250715' | 'gpt-3.5-turbo' | 'qwen3-vl-flash' | 'sonar' | 'qwen3-30b-a3b-fp8' | 'gpt-oss-120b' | 'minimax-text-01' | 'llama-4-scout' | 'gemini-2.0-flash-lite' | 'gpt-5.4' | 'o1' | 'o3' | 'qwen2-5-vl-32b-instruct' | 'llama-3-8b-instruct' | 'grok-4-1-fast-non-reasoning' | 'llama-3-70b-instruct' | 'gpt-5.3-chat-latest' | 'glm-4.5' | 'minimax-m2.1' | 'glm-4.7-flashx' | 'sonar-reasoning-pro' | 'gemini-pro-latest' | 'veo-3.1-fast-generate-preview' | 'claude-3-haiku-20240307' | 'gpt-4o-search-preview' | 'llama-4-scout-17b-instruct' | 'qwen3-235b-a22b-fp8' | 'claude-sonnet-4-20250514' | 'grok-4-0709' | 'glm-4.6v-flashx' | 'glm-4.6' | 'gemini-3-flash-preview' | 'gpt-5.4-nano' | 'claude-3-5-sonnet' | 'glm-4.6v' | 'qwen3-vl-8b-instruct' | 'gpt-4' | 'minimax-m2.7' | 'qwen3-coder-480b-a35b-instruct' | 'auto' | 'qwen3-next-80b-a3b-thinking' | 'qwen3-vl-30b-a3b-instruct' | 'gemini-2.5-pro' | 'claude-opus-4-1-20250805' | 'gemini-2.5-flash' | 'sonar-pro' | 'qwen3-235b-a22b-thinking-2507' | 'qwen-image-edit-max' | 'glm-4-32b-0414-128k' | 'gpt-5.2' | 'qwen3-next-80b-a3b-instruct' | 'grok-4-1-fast-reasoning' | 'gpt-5.1' | 'gpt-4o-mini-search-preview' | 'qwen3-vl-plus' | 'deepseek-v3.1' | 'gemini-2.0-flash' | 'custom' | 'glm-4.5-flash' | 'llama-3.2-3b-instruct' | 'gpt-4.1-mini' | 'qwen-image-max-2025-12-30' | 'cogview-4' | 'llama-3.2-11b-instruct' | 'glm-5' | 'veo-3.1-generate-preview' | 'qwen3-vl-30b-a3b-thinking' | 'llama-3.1-70b-instruct' | 'qwen-omni-turbo' | 'gpt-5-chat-latest' | 'minimax-m2.1-lightning' | 'grok-4-fast-reasoning' | 'gpt-5-nano' | 'seed-1-6-250915' | 'qwen3-32b-fp8' | 'claude-3-5-haiku' | 'mixtral-8x7b-instruct-together' | 'qwen-coder-plus' | 'glm-4.5-air' | 'gemini-3.1-flash-lite-preview' | 'grok-3' | 'gemini-3.1-flash-image-preview' | 'gemini-2.5-flash-image' | 'glm-4.5v' | 'minimax-m2.7-highspeed' | 'seedream-4-5' | 'qwen3-coder-plus' | 'claude-haiku-4-5-20251001' | 'glm-4.7' | 'qwen3-max-2026-01-23' | 'grok-imagine-image-pro' | 'qwen-flash' | 'deepseek-r1-0528' | 'qwen3-max' | 'gpt-oss-20b' | 'qwen2-5-vl-72b-instruct' | 'gemma-3-27b' | 'grok-4-20-beta-0309-reasoning' | 'qwen3-32b' | 'gpt-4.1-nano' | 'gemma-3-12b-it' | 'claude-sonnet-4-5' | 'devstral-small-2507' | 'ministral-3b-2512' | 'deepseek-v3.2' | 'gemma-2-27b-it-together' | 'qwen3-4b-fp8' | 'qwen3-vl-235b-a22b-thinking' | 'llama-4-maverick-17b-instruct' | 'qwen3-coder-flash' | 'claude-3-haiku' | 'gemini-2.5-flash-image-preview' | 'o4-mini' | 'glm-4.5-x' | 'gemini-3-pro-image-preview' | 'claude-haiku-4-5' | 'qwen25-coder-7b' | 'seed-1-8-251228' | 'gpt-5.1-codex' | 'claude-3-5-sonnet-20241022' | 'minimax-m2.5' | 'mistral-large-2512' | 'minimax-m2.5-highspeed' | 'glm-4.6v-flash' | 'qwen3-30b-a3b-instruct-2507' | 'grok-4-1-fast' | 'gpt-5.2-pro' | 'claude-3-7-sonnet'>({ apiKey, baseURL }),
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
  createChatProvider<'zai-org/GLM-4.7' | 'zai-org/GLM-5' | 'zai-org/GLM-4.6' | 'meta-llama/Llama-3.3-70B-Instruct' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2.5' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3.2-Exp' | 'deepseek-ai/DeepSeek-V3-0324' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.2' | 'Qwen/Qwen3.5-Plus' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2-Thinking' | 'XiaomiMiMo/MiMo-V2-Flash' | 'mistralai/Mistral-Nemo-Instruct-2407' | 'mistralai/Mistral-Small-3.2-24B-Instruct-2506'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax (minimax.io) Provider
 * @see {@link https://platform.minimax.io/docs/guides/quickstart}
 */
export const createMinimax = (apiKey: string, baseURL = 'https://api.minimax.io/v1/') => merge(
  createChatProvider<'MiniMax-M2.7' | 'MiniMax-M2.1' | 'MiniMax-M2.5' | 'MiniMax-M2' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M2.7-highspeed'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax (minimaxi.com) Provider
 * @see {@link https://platform.minimaxi.com/docs/guides/quickstart}
 */
export const createMinimaxCn = (apiKey: string, baseURL = 'https://api.minimaxi.com/v1/') => merge(
  createChatProvider<'MiniMax-M2.7' | 'MiniMax-M2.1' | 'MiniMax-M2.5' | 'MiniMax-M2' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M2.7-highspeed'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax Coding Plan (minimaxi.com) Provider
 * @see {@link https://platform.minimaxi.com/docs/coding-plan/intro}
 */
export const createMinimaxCnCodingPlan = (apiKey: string, baseURL = 'https://api.minimaxi.com/anthropic/v1') => merge(
  createChatProvider<'MiniMax-M2.7' | 'MiniMax-M2.1' | 'MiniMax-M2.5' | 'MiniMax-M2' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M2.7-highspeed'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax Coding Plan (minimax.io) Provider
 * @see {@link https://platform.minimax.io/docs/coding-plan/intro}
 */
export const createMinimaxCodingPlan = (apiKey: string, baseURL = 'https://api.minimax.io/anthropic/v1') => merge(
  createChatProvider<'MiniMax-M2.7' | 'MiniMax-M2.1' | 'MiniMax-M2.5' | 'MiniMax-M2' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M2.7-highspeed'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Mistral Provider
 * @see {@link https://docs.mistral.ai/getting-started/models/}
 */
export const createMistral = (apiKey: string, baseURL = 'https://api.mistral.ai/v1/') => merge(
  createChatProvider<'devstral-small-2505' | 'pixtral-large-latest' | 'mistral-small-2603' | 'ministral-3b-latest' | 'magistral-small' | 'devstral-2512' | 'codestral-latest' | 'mistral-large-latest' | 'devstral-medium-latest' | 'mistral-embed' | 'mistral-large-2411' | 'mistral-small-2506' | 'devstral-medium-2507' | 'magistral-medium-latest' | 'labs-devstral-small-2512' | 'mistral-medium-latest' | 'mistral-medium-2505' | 'mistral-nemo' | 'open-mixtral-8x22b' | 'ministral-8b-latest' | 'open-mixtral-8x7b' | 'pixtral-12b' | 'mistral-small-latest' | 'open-mistral-7b' | 'devstral-small-2507' | 'mistral-medium-2508' | 'mistral-large-2512'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Moark Provider
 * @see {@link https://moark.com/docs/openapi/v1#tag/%E6%96%87%E6%9C%AC%E7%94%9F%E6%88%90}
 */
export const createMoark = (apiKey: string, baseURL = 'https://moark.com/v1') => merge(
  createChatProvider<'GLM-4.7' | 'MiniMax-M2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a ModelScope Provider
 * @see {@link https://modelscope.cn/docs/model-service/API-Inference/intro}
 */
export const createModelscope = (apiKey: string, baseURL = 'https://api-inference.modelscope.cn/v1') => merge(
  createChatProvider<'ZhipuAI/GLM-4.5' | 'ZhipuAI/GLM-4.6' | 'Qwen/Qwen3-30B-A3B-Thinking-2507' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-235B-A22B-Instruct-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Moonshot AI Provider
 * @see {@link https://platform.moonshot.ai/docs/api/chat}
 */
export const createMoonshotai = (apiKey: string, baseURL = 'https://api.moonshot.ai/v1') => merge(
  createChatProvider<'kimi-k2-thinking' | 'kimi-k2.5' | 'kimi-k2-thinking-turbo' | 'kimi-k2-0905-preview' | 'kimi-k2-turbo-preview' | 'kimi-k2-0711-preview'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Moonshot AI (China) Provider
 * @see {@link https://platform.moonshot.cn/docs/api/chat}
 */
export const createMoonshotaiCn = (apiKey: string, baseURL = 'https://api.moonshot.cn/v1') => merge(
  createChatProvider<'kimi-k2-0711-preview' | 'kimi-k2-turbo-preview' | 'kimi-k2-0905-preview' | 'kimi-k2-thinking-turbo' | 'kimi-k2.5' | 'kimi-k2-thinking'>({ apiKey, baseURL }),
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
  createChatProvider<'claude-opus-4-thinking' | 'qwen3-coder-30b-a3b-instruct' | 'brave-research' | 'jamba-large-1.7' | 'gemini-2.5-flash-lite' | 'azure-o3-mini' | 'claude-sonnet-4-thinking:8192' | 'ernie-x1-32k' | 'exa-answer' | 'KAT-Coder-Pro-V1' | 'ernie-4.5-turbo-128k' | 'claude-opus-4-5-20251101' | 'deepclaude' | 'Llama-3.3-70B-Forgotten-Abomination-v5.0' | 'qwen-image' | 'gemini-2.5-pro-exp-03-25' | 'mistral-small-31-24b-instruct' | 'claude-sonnet-4-thinking:1024' | 'claude-opus-4-1-thinking' | 'jamba-large-1.6' | 'universal-summarizer' | 'Llama-3.3-70B-Bigger-Body' | 'doubao-seed-2-0-pro-260215' | 'Llama-3.3-70B-Progenitor-V3.3' | 'claude-opus-4-1-thinking:32768' | 'doubao-seed-1-6-thinking-250615' | 'Llama-3.3-70B-Fallen-v1' | 'glm-zero-preview' | 'Llama-3.3-70B-MS-Nevoria' | 'qwen-turbo' | 'glm-z1-air' | 'deepseek-v3-0324' | 'gemini-2.5-flash-lite-preview-09-2025' | 'qwq-32b' | 'command-a-reasoning-08-2025' | 'GLM-4.5-Air-Derestricted-Iceblink-ReExtract' | 'Llama-3.3-70B-Mokume-Gane-R1' | 'doubao-1-5-thinking-vision-pro-250428' | 'Llama-3.3+(3v3.3)-70B-TenyxChat-DaybreakStorywriter' | 'deepseek-r1' | 'QwQ-32B-ArliAI-RpR-v1' | 'GLM-4.6-Derestricted-v5' | 'qwen-max' | 'glm-4' | 'qvq-max' | 'claude-opus-4-20250514' | 'gemini-2.5-flash-preview-04-17' | 'claude-opus-4-thinking:32000' | 'qwen-long' | 'Llama-3.3-70B-GeneticLemonade-Opus' | 'doubao-1.5-pro-32k' | 'Llama-3.3-70B-Forgotten-Safeword-3.6' | 'grok-3-mini-fast-beta' | 'claude-3-7-sonnet-20250219' | 'Llama-3.3-70B-ArliAI-RPMax-v3' | 'gemini-2.0-flash-thinking-exp-1219' | 'gemini-2.5-flash-preview-05-20' | 'gemini-3-pro-preview' | 'MiniMax-M1' | 'chroma' | 'azure-o1' | 'claude-3-7-sonnet-thinking:128000' | 'venice-uncensored:web' | 'deepseek-r1-sambanova' | 'qwen25-vl-72b-instruct' | 'brave-pro' | 'glm-4-airx' | 'deepseek-chat' | 'Llama-3.3-70B-Cu-Mai-R1' | 'deepseek-chat-cheaper' | 'ernie-5.0-thinking-latest' | 'claude-sonnet-4-5-20250929' | 'claude-opus-4-1-thinking:1024' | 'qwen-plus' | 'ernie-x1-32k-preview' | 'Llama-3.3-70B-The-Omega-Directive-Unslop-v2.1' | 'gemini-2.5-pro-preview-06-05' | 'claude-sonnet-4-thinking:64000' | 'glm-z1-airx' | 'qwen3-vl-235b-a22b-instruct-original' | 'yi-lightning' | 'sonar-deep-research' | 'Llama-3.3-70B-Ignition-v0.1' | 'kimi-k2-instruct-fast' | 'gemini-2.5-pro-preview-05-06' | 'gemini-2.5-flash-preview-05-20:thinking' | 'auto-model-premium' | 'glm-4.1v-thinking-flash' | 'claude-3-5-haiku-20241022' | 'sonar' | 'auto-model' | 'gemini-2.0-flash-001' | 'Llama-3.3-70B-Mhnnn-x1' | 'step-2-16k-exp' | 'Llama-3.3-70B-Legion-V2.1' | 'Llama-3.3+(3.1v3.3)-70B-New-Dawn-v1.1' | 'doubao-1-5-thinking-pro-vision-250415' | 'gemini-2.0-flash-lite' | 'claude-sonnet-4-5-20250929-thinking' | 'yi-large' | 'Gemma-3-27B-Nidum-Uncensored' | 'claude-opus-4-thinking:32768' | 'Llama-3.3-70B-Cirrus-x1' | 'Gemma-3-27B-CardProjector-v4' | 'Qwen2.5-32B-EVA-v0.2' | 'sonar-reasoning-pro' | 'v0-1.5-lg' | 'gemini-2.5-flash-preview-09-2025-thinking' | 'azure-gpt-4-turbo' | 'deepseek-reasoner' | 'gemini-2.5-flash-nothinking' | 'Gemma-3-27B-ArliAI-RPMax-v3' | 'v0-1.0-md' | 'step-3' | 'brave' | 'ernie-x1-turbo-32k' | 'glm-4-air' | 'GLM-4.5-Air-Derestricted' | 'grok-3-fast-beta' | 'claude-sonnet-4-20250514' | 'claude-3-7-sonnet-thinking:1024' | 'doubao-seed-code-preview-latest' | 'grok-3-beta' | 'claude-3-7-sonnet-reasoner' | 'gemini-2.0-pro-exp-02-05' | 'glm-4-long' | 'venice-uncensored' | 'Gemma-3-27B-Big-Tiger-v3' | 'doubao-seed-2-0-mini-260215' | 'gemini-2.0-flash-thinking-exp-01-21' | 'Llama-3.3-70B-Damascus-R1' | 'doubao-1-5-thinking-pro-250415' | 'asi1-mini' | 'doubao-seed-2-0-code-preview-260215' | 'exa-research-pro' | 'GLM-4.5-Air-Derestricted-Iceblink-v2' | 'gemini-2.5-pro' | 'Llama-3.3-70B-Nova' | 'Gemma-3-27B-it' | 'claude-opus-4-thinking:8192' | 'claude-3-5-sonnet-20240620' | 'claude-opus-4-1-20250805' | 'gemini-2.5-flash' | 'sonar-pro' | 'sarvan-medium' | 'hunyuan-t1-latest' | 'Llama-3.3-70B-RAWMAW' | 'kimi-thinking-preview' | 'claude-sonnet-4-thinking:32768' | 'gemini-2.5-pro-preview-03-25' | 'gemini-2.5-flash-preview-09-2025' | 'Llama-3.3-70B-Electra-R1' | 'Llama-3.3-70B-ArliAI-RPMax-v2' | 'GLM-4.5-Air-Derestricted-Steam' | 'doubao-seed-1-8-251215' | 'Llama-3.3-70B-The-Omega-Directive-Unslop-v2.0' | 'GLM-4.5-Air-Derestricted-Steam-ReExtract' | 'exa-research' | 'azure-gpt-4o' | 'study_gpt-chatgpt-4o-latest' | 'Llama-3.3-70B-Aurora-Borealis' | 'Baichuan4-Turbo' | 'Baichuan4-Air' | 'KAT-Coder-Exp-72B-1010' | 'gemini-2.0-flash-exp-image-generation' | 'Llama-3.3-70B-Dark-Ages-v0.1' | 'claude-opus-4-1-thinking:8192' | 'Magistral-Small-2506' | 'Llama-3.3-70B-MiraiFanfare' | 'glm-4-flash' | 'Llama-3.3-70B-Shakudo' | 'gemini-2.0-pro-reasoner' | 'Llama-3.3-70B-Fallen-R1-v1' | 'gemini-2.5-flash-lite-preview-06-17' | 'doubao-seed-1-6-flash-250615' | 'claude-opus-4-5-20251101:thinking' | 'Llama-3.3-70B-Strawberrylemonade-v1.2' | 'Llama-3.3-70B-Magnum-v4-SE' | 'MiniMax-M2' | 'doubao-seed-1-6-250615' | 'Llama-3.3-70B-StrawberryLemonade-v1.0' | 'Meta-Llama-3-1-8B-Instruct-FP8' | 'claude-opus-4-1-thinking:32000' | 'GLM-4.5-Air-Derestricted-Iceblink-v2-ReExtract' | 'gemini-3-pro-preview-thinking' | 'gemini-2.5-flash-lite-preview-09-2025-thinking' | 'Llama-3.3-70B-Vulpecula-R1' | 'doubao-1.5-vision-pro-32k' | 'deepseek-reasoner-cheaper' | 'ernie-x1.1-preview' | 'KAT-Coder-Air-V1' | 'mercury-coder-small' | 'doubao-1.5-pro-256k' | 'glm-4-plus' | 'Baichuan-M2' | 'auto-model-standard' | 'Gemma-3-27B-it-Abliterated' | 'learnlm-1.5-pro-experimental' | 'claude-opus-4-thinking:1024' | 'gemini-2.5-flash-preview-04-17:thinking' | 'v0-1.5-md' | 'Llama-3.3-70B-Electranova-v1.0' | 'Llama-3.3+(3.1v3.3)-70B-Hanami-x1' | 'phi-4-multimodal-instruct' | 'claude-haiku-4-5-20251001' | 'ernie-4.5-8k-preview' | 'claude-3-7-sonnet-thinking:32768' | 'qwen3-max-2026-01-23' | 'claude-3-7-sonnet-thinking:8192' | 'Llama-3.3-70B-Incandescent-Malevolence' | 'step-2-mini' | 'auto-model-basic' | 'claude-sonnet-4-thinking' | 'Llama-3.3-70B-GeneticLemonade-Unleashed-v3' | 'step-r1-v-mini' | 'glm-4-plus-0111' | 'z-image-turbo' | 'Llama-3.3-70B-Sapphira-0.2' | 'deepseek-math-v2' | 'azure-gpt-4o-mini' | 'Mistral-Nemo-12B-Instruct-2407' | 'jamba-mini-1.6' | 'qwen3-vl-235b-a22b-thinking' | 'Llama-3.3-70B-ArliAI-RPMax-v1.4' | 'Llama-3.3-70B-Anthrobomination' | 'glm-4-air-0111' | 'jamba-mini' | 'ernie-5.0-thinking-preview' | 'Gemma-3-27B-Glitter' | 'hidream' | 'glm-4.1v-thinking-flashx' | 'phi-4-mini-instruct' | 'Llama-3.3-70B-Sapphira-0.1' | 'yi-medium-200k' | 'jamba-mini-1.7' | 'gemini-3-pro-image-preview' | 'fastgpt' | 'GLM-4.5-Air-Derestricted-Iceblink' | 'Llama-3.3-70B-Predatorial-Extasy' | 'claude-3-7-sonnet-thinking' | 'Llama-3.3-70B-Magnum-v4-SE-Cirrus-x1-SLERP' | 'claude-3-5-sonnet-20241022' | 'gemini-exp-1206' | 'doubao-seed-2-0-lite-260215' | 'jamba-large' | 'hunyuan-turbos-20250226' | 'ernie-4.5-turbo-vl-32k' | 'grok-3-mini-beta' | 'qwen3-30b-a3b-instruct-2507' | 'Llama-3.3-70B-Argunaut-1-SFT' | 'abacusai/Dracarys-72B-Instruct' | 'THUDM/GLM-Z1-32B-0414' | 'THUDM/GLM-Z1-9B-0414' | 'THUDM/GLM-4-32B-0414' | 'THUDM/GLM-Z1-Rumination-32B-0414' | 'THUDM/GLM-4-9B-0414' | 'unsloth/gemma-3-1b-it' | 'unsloth/gemma-3-27b-it' | 'unsloth/gemma-3-4b-it' | 'unsloth/gemma-3-12b-it' | 'shisa-ai/shisa-v2-llama3.3-70b' | 'shisa-ai/shisa-v2.1-llama3.3-70b' | 'openai/gpt-5.2-codex' | 'openai/o1-pro' | 'openai/o3-mini-low' | 'openai/gpt-5.1-codex-mini' | 'openai/o3-mini' | 'openai/gpt-5-pro' | 'openai/gpt-5' | 'openai/chatgpt-4o-latest' | 'openai/gpt-4-turbo' | 'openai/gpt-4o' | 'openai/o3-mini-high' | 'openai/gpt-5-mini' | 'openai/gpt-4-turbo-preview' | 'openai/gpt-4o-mini' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-4.1' | 'openai/gpt-5.1-chat-latest' | 'openai/gpt-3.5-turbo' | 'openai/gpt-oss-120b' | 'openai/gpt-5.1-chat' | 'openai/o1' | 'openai/o3' | 'openai/gpt-4o-search-preview' | 'openai/o4-mini-high' | 'openai/gpt-4o-2024-11-20' | 'openai/gpt-5.2-chat' | 'openai/gpt-5.2' | 'openai/o4-mini-deep-research' | 'openai/gpt-5.1' | 'openai/gpt-4o-mini-search-preview' | 'openai/gpt-4.1-mini' | 'openai/o3-pro-2025-06-10' | 'openai/gpt-5-chat-latest' | 'openai/gpt-5-nano' | 'openai/gpt-oss-safeguard-20b' | 'openai/gpt-oss-20b' | 'openai/gpt-5.1-2025-11-13' | 'openai/gpt-4o-2024-08-06' | 'openai/gpt-4.1-nano' | 'openai/o1-preview' | 'openai/gpt-5-codex' | 'openai/o4-mini' | 'openai/o3-deep-research' | 'openai/gpt-5.1-codex' | 'openai/gpt-5.2-pro' | 'CrucibleLab/L3.3-70B-Loki-V2.0' | 'microsoft/MAI-DS-R1-FP8' | 'microsoft/wizardlm-2-8x22b' | 'cohere/command-r-plus-08-2024' | 'cohere/command-r' | 'x-ai/grok-4-fast' | 'x-ai/grok-4-fast:thinking' | 'x-ai/grok-4.1-fast' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4.1-fast-reasoning' | 'x-ai/grok-4-07-09' | 'anthropic/claude-opus-4.6:thinking:max' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-sonnet-4.6:thinking' | 'anthropic/claude-opus-4.6:thinking:medium' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-opus-4.6:thinking' | 'anthropic/claude-opus-4.6:thinking:low' | 'raifle/sorcererlm-8x22b' | 'nothingiisreal/L3.1-70B-Celeste-V0.1-BF16' | 'NousResearch 2/hermes-4-70b' | 'NousResearch 2/hermes-4-405b:thinking' | 'NousResearch 2/hermes-3-llama-3.1-70b' | 'NousResearch 2/Hermes-4-70B:thinking' | 'NousResearch 2/hermes-4-405b' | 'NousResearch 2/DeepHermes-3-Mistral-24B-Preview' | 'deepseek/deepseek-v3.2:thinking' | 'deepseek/deepseek-prover-v2-671b' | 'deepseek/deepseek-v3.2-speciale' | 'deepseek/deepseek-v3.2' | 'zai-org/glm-4.7-flash' | 'zai-org/glm-5.1:thinking' | 'zai-org/glm-5:thinking' | 'zai-org/glm-5' | 'zai-org/glm-5.1' | 'zai-org/glm-4.7' | 'NeverSleep/Llama-3-Lumimaid-70B-v0.1' | 'NeverSleep/Lumimaid-v0.2-70B' | 'nvidia/Llama-3.1-Nemotron-Ultra-253B-v1' | 'nvidia/nvidia-nemotron-nano-9b-v2' | 'nvidia/Llama-3_3-Nemotron-Super-49B-v1_5' | 'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF' | 'nvidia/Llama-3.3-Nemotron-Super-49B-v1' | 'nvidia/nemotron-3-nano-30b-a3b' | 'z-ai/glm-4.6:thinking' | 'z-ai/glm-4.5v:thinking' | 'z-ai/glm-4.6' | 'z-ai/glm-4.5v' | 'nex-agi/deepseek-v3.1-nex-n1' | 'stepfun-ai/step-3.5-flash:thinking' | 'stepfun-ai/step-3.5-flash' | 'cognitivecomputations/dolphin-2.9.2-qwen2-72b' | 'allenai/olmo-3.1-32b-instruct' | 'allenai/olmo-3-32b-think' | 'allenai/olmo-3.1-32b-think' | 'allenai/molmo-2-8b' | 'TheDrummer 2/Cydonia-24B-v4.1' | 'TheDrummer 2/UnslopNemo-12B-v4.1' | 'TheDrummer 2/Cydonia-24B-v4.3' | 'TheDrummer 2/skyfall-36b-v2' | 'TheDrummer 2/Anubis-70B-v1' | 'TheDrummer 2/Cydonia-24B-v2' | 'TheDrummer 2/Cydonia-24B-v4' | 'TheDrummer 2/Anubis-70B-v1.1' | 'TheDrummer 2/Magidonia-24B-v4.3' | 'TheDrummer 2/Rocinante-12B-v1.1' | 'google/gemini-3-flash-preview-thinking' | 'google/gemini-3-flash-preview' | 'google/gemini-flash-1.5' | 'undi95/remm-slerp-l2-13b' | 'amazon/nova-lite-v1' | 'amazon/nova-2-lite-v1' | 'amazon/nova-micro-v1' | 'amazon/nova-pro-v1' | 'baidu/ernie-4.5-300b-a47b' | 'baidu/ernie-4.5-vl-28b-a3b' | 'meta-llama/llama-3.3-70b-instruct' | 'meta-llama/llama-3.1-8b-instruct' | 'meta-llama/llama-4-scout' | 'meta-llama/llama-4-maverick' | 'meta-llama/llama-3.2-90b-vision-instruct' | 'meta-llama/llama-3.2-3b-instruct' | 'ReadyArt/MS3.2-The-Omega-Directive-24B-Unslop-v2.0' | 'ReadyArt/The-Omega-Abomination-L-70B-v1.0' | 'miromind-ai/mirothinker-v1.5-235b' | 'Doctor-Shotgun/MS3.2-24B-Magnum-Diamond' | 'LLM360/K2-Think' | 'MiniMaxAI/MiniMax-M1-80k' | 'failspy/Meta-Llama-3-70B-Instruct-abliterated-v3.5' | 'essentialai/rnj-1-instruct' | 'pamanseau/OpenReasoning-Nemotron-32B' | 'arcee-ai/trinity-mini' | 'arcee-ai/trinity-large' | 'deepseek-ai/DeepSeek-V3.1-Terminus:thinking' | 'deepseek-ai/DeepSeek-V3.1:thinking' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/deepseek-v3.2-exp-thinking' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/deepseek-v3.2-exp' | 'deepseek-ai/DeepSeek-R1-0528' | 'inflatebot/MN-12B-Mag-Mell-R1' | 'MarinaraSpaghetti/NemoMix-Unleashed-12B' | 'Alibaba-NLP/Tongyi-DeepResearch-30B-A3B' | 'soob3123/GrayLine-Qwen3-8B' | 'soob3123/amoral-gemma3-27B-v2' | 'soob3123/Veiled-Calla-12B' | 'minimax/minimax-m2-her' | 'minimax/minimax-01' | 'minimax/minimax-m2.1' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2.5' | 'qwen/qwen3.5-397b-a17b' | 'dmind/dmind-1' | 'dmind/dmind-1-mini' | 'VongolaChouko/Starcannon-Unleashed-12B-v1.0' | 'xiaomi/mimo-v2-flash-thinking' | 'xiaomi/mimo-v2-flash-thinking-original' | 'xiaomi/mimo-v2-flash-original' | 'xiaomi/mimo-v2-flash' | 'Salesforce/Llama-xLAM-2-70b-fc-r' | 'Gryphe/MythoMax-L2-13b' | 'baseten/Kimi-K2-Instruct-FP4' | 'Steelskull/L3.3-Nevoria-R1-70b' | 'Steelskull/L3.3-Electra-R1-70b' | 'Steelskull/L3.3-Cu-Mai-R1-70b' | 'Steelskull/L3.3-MS-Evalebis-70b' | 'Steelskull/L3.3-MS-Nevoria-70b' | 'Steelskull/L3.3-MS-Evayale-70B' | 'meganova-ai/manta-mini-1.0' | 'meganova-ai/manta-pro-1.0' | 'meganova-ai/manta-flash-1.0' | 'meituan-longcat/LongCat-Flash-Chat-FP8' | 'TEE/kimi-k2-thinking' | 'TEE/kimi-k2.5' | 'TEE/glm-4.7-flash' | 'TEE/gemma-3-27b-it' | 'TEE/kimi-k2.5-thinking' | 'TEE/gpt-oss-120b' | 'TEE/qwen3-coder' | 'TEE/minimax-m2.1' | 'TEE/qwen2.5-vl-72b-instruct' | 'TEE/glm-4.6' | 'TEE/deepseek-v3.1' | 'TEE/llama3-3-70b' | 'TEE/glm-5' | 'TEE/qwen3.5-397b-a17b' | 'TEE/glm-4.7' | 'TEE/deepseek-r1-0528' | 'TEE/gpt-oss-20b' | 'TEE/deepseek-v3.2' | 'TEE/qwen3-30b-a3b-instruct-2507' | 'chutesai/Mistral-Small-3.2-24B-Instruct-2506' | 'Infermatic/MN-12B-Inferor-v0.0' | 'aion-labs/aion-rp-llama-3.1-8b' | 'aion-labs/aion-1.0-mini' | 'aion-labs/aion-1.0' | 'mlabonne/NeuralDaredevil-8B-abliterated' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2.5:thinking' | 'moonshotai/kimi-k2-thinking-turbo-original' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/kimi-k2-thinking-original' | 'moonshotai/kimi-k2-instruct-0711' | 'moonshotai/Kimi-Dev-72B' | 'moonshotai/kimi-k2-instruct' | 'tencent/Hunyuan-MT-7B' | 'Envoid/Llama-3.05-NT-Storybreaker-Ministral-70B' | 'Envoid/Llama-3.05-Nemotron-Tenyxchat-Storybreaker-70B' | 'Tongyi-Zhiwen/QwenLong-L1-32B' | 'featherless-ai/Qwerky-72B' | 'Sao10K/L3.3-70B-Euryale-v2.3' | 'Sao10K/L3.1-70B-Hanami-x1' | 'Sao10K/L3.1-70B-Euryale-v2.2' | 'Sao10K/L3-8B-Stheno-v3.2' | 'inflection/inflection-3-pi' | 'inflection/inflection-3-productivity' | 'GalrionSoftworks/MN-LooseCannon-12B-v1' | 'LatitudeGames/Wayfarer-Large-70B-Llama-3.3' | 'anthracite-org/magnum-v4-72b' | 'anthracite-org/magnum-v2-72b' | 'tngtech/tng-r1t-chimera' | 'tngtech/DeepSeek-TNG-R1T2-Chimera' | 'deepcogito/cogito-v2.1-671b' | 'deepcogito/cogito-v1-preview-qwen-32B' | 'huihui-ai/DeepSeek-R1-Distill-Llama-70B-abliterated' | 'huihui-ai/Llama-3.3-70B-Instruct-abliterated' | 'huihui-ai/Qwen2.5-32B-Instruct-abliterated' | 'huihui-ai/DeepSeek-R1-Distill-Qwen-32B-abliterated' | 'huihui-ai/Llama-3.1-Nemotron-70B-Instruct-HF-abliterated' | 'mistralai/mistral-medium-3.1' | 'mistralai/mistral-7b-instruct' | 'mistralai/devstral-2-123b-instruct-2512' | 'mistralai/mixtral-8x22b-instruct-v0.1' | 'mistralai/mistral-large-3-675b-instruct-2512' | 'mistralai/Devstral-Small-2505' | 'mistralai/mistral-medium-3' | 'mistralai/ministral-8b-2512' | 'mistralai/ministral-14b-2512' | 'mistralai/Mistral-Nemo-Instruct-2407' | 'mistralai/codestral-2508' | 'mistralai/mistral-small-creative' | 'mistralai/ministral-14b-instruct-2512' | 'mistralai/mistral-large' | 'mistralai/ministral-3b-2512' | 'mistralai/mistral-tiny' | 'mistralai/mixtral-8x7b-instruct-v0.1' | 'mistralai/mistral-saba' | 'EVA-UNIT-01/EVA-Qwen2.5-72B-v0.2' | 'EVA-UNIT-01/EVA-LLaMA-3.33-70B-v0.1' | 'EVA-UNIT-01/EVA-Qwen2.5-32B-v0.2' | 'EVA-UNIT-01/EVA-LLaMA-3.33-70B-v0.0'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Nebius Token Factory Provider
 * @see {@link https://docs.tokenfactory.nebius.com/}
 */
export const createNebius = (apiKey: string, baseURL = 'https://api.tokenfactory.nebius.com/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'NousResearch/Hermes-4-405B' | 'NousResearch/Hermes-4-70B' | 'zai-org/GLM-4.5-Air' | 'zai-org/GLM-4.5' | 'zai-org/GLM-5' | 'zai-org/GLM-4.7-FP8' | 'nvidia/Nemotron-Nano-V2-12b' | 'nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B' | 'nvidia/nemotron-3-super-120b-a12b' | 'nvidia/Llama-3_1-Nemotron-Ultra-253B-v1' | 'google/gemma-3-27b-it' | 'google/gemma-3-27b-it-fast' | 'google/gemma-2-2b-it' | 'google/gemma-2-9b-it-fast' | 'PrimeIntellect/INTELLECT-3' | 'meta-llama/Llama-Guard-3-8B' | 'meta-llama/Llama-3.3-70B-Instruct' | 'meta-llama/Meta-Llama-3.1-8B-Instruct' | 'meta-llama/Meta-Llama-3.1-8B-Instruct-fast' | 'meta-llama/Llama-3.3-70B-Instruct-fast' | 'MiniMaxAI/MiniMax-M2.1' | 'deepseek-ai/DeepSeek-V3-0324' | 'deepseek-ai/DeepSeek-R1-0528-fast' | 'deepseek-ai/DeepSeek-V3-0324-fast' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.2' | 'intfloat/e5-mistral-7b-instruct' | 'black-forest-labs/flux-dev' | 'black-forest-labs/flux-schnell' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen3-30B-A3B-Thinking-2507' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen2.5-Coder-7B-fast' | 'Qwen/Qwen2.5-VL-72B-Instruct' | 'Qwen/Qwen3-32B-fast' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Embedding-8B' | 'BAAI/bge-en-icl' | 'BAAI/bge-multilingual-gemma2' | 'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2.5-fast' | 'moonshotai/Kimi-K2-Thinking'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Nova Provider
 * @see {@link https://nova.amazon.com/dev/documentation}
 */
export const createNova = (apiKey: string, baseURL = 'https://api.nova.amazon.com/v1') => merge(
  createChatProvider<'nova-2-lite-v1' | 'nova-2-pro-v1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a NovitaAI Provider
 * @see {@link https://novita.ai/docs/guides/introduction}
 */
export const createNovitaAi = (apiKey: string, baseURL = 'https://api.novita.ai/openai') => merge(
  createChatProvider<'paddlepaddle/paddleocr-vl' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'microsoft/wizardlm-2-8x22b' | 'kwaipilot/kat-coder' | 'kwaipilot/kat-coder-pro' | 'sao10k/l3-8b-lunaris' | 'sao10k/l3-70b-euryale-v2.1' | 'sao10k/l31-70b-euryale-v2.2' | 'sao10k/L3-8B-Stheno-v3.2' | 'deepseek/deepseek-r1-turbo' | 'deepseek/deepseek-v3.1-terminus' | 'deepseek/deepseek-r1-distill-llama-70b' | 'deepseek/deepseek-v3-0324' | 'deepseek/deepseek-prover-v2-671b' | 'deepseek/deepseek-r1-0528-qwen3-8b' | 'deepseek/deepseek-ocr-2' | 'deepseek/deepseek-v3-turbo' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-ocr' | 'deepseek/deepseek-v3.1' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-v3.2' | 'zai-org/glm-4.7-flash' | 'zai-org/autoglm-phone-9b-multilingual' | 'zai-org/glm-4.5' | 'zai-org/glm-4.6' | 'zai-org/glm-4.6v' | 'zai-org/glm-5' | 'zai-org/glm-4.5-air' | 'zai-org/glm-4.5v' | 'zai-org/glm-4.7' | 'gryphe/mythomax-l2-13b' | 'google/gemma-3-27b-it' | 'skywork/r1v4-lite' | 'baidu/ernie-4.5-21B-a3b-thinking' | 'baidu/ernie-4.5-vl-28b-a3b-thinking' | 'baidu/ernie-4.5-vl-28b-a3b' | 'baidu/ernie-4.5-21B-a3b' | 'baidu/ernie-4.5-300b-a47b-paddle' | 'baidu/ernie-4.5-vl-424b-a47b' | 'minimaxai/minimax-m1-80k' | 'meta-llama/llama-3.3-70b-instruct' | 'meta-llama/llama-3.1-8b-instruct' | 'meta-llama/llama-4-scout-17b-16e-instruct' | 'meta-llama/llama-3-8b-instruct' | 'meta-llama/llama-3-70b-instruct' | 'meta-llama/llama-4-maverick-17b-128e-instruct-fp8' | 'nousresearch/hermes-2-pro-llama-3-8b' | 'minimax/minimax-m2' | 'minimax/minimax-m2.1' | 'minimax/minimax-m2.5' | 'qwen/qwen3-coder-30b-a3b-instruct' | 'qwen/qwen3-235b-a22b-instruct-2507' | 'qwen/qwen-mt-plus' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'qwen/qwen3-coder-next' | 'qwen/qwen3-8b-fp8' | 'qwen/qwen3-omni-30b-a3b-instruct' | 'qwen/qwen2.5-7b-instruct' | 'qwen/qwen3-30b-a3b-fp8' | 'qwen/qwen3-235b-a22b-fp8' | 'qwen/qwen2.5-vl-72b-instruct' | 'qwen/qwen3-vl-8b-instruct' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-vl-30b-a3b-instruct' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3-omni-30b-a3b-thinking' | 'qwen/qwen3-vl-30b-a3b-thinking' | 'qwen/qwen3-32b-fp8' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen3-max' | 'qwen/qwen3-4b-fp8' | 'qwen/qwen3-vl-235b-a22b-thinking' | 'qwen/qwen-2.5-72b-instruct' | 'baichuan/baichuan-m2-32b' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-instruct' | 'xiaomimimo/mimo-v2-flash' | 'mistralai/mistral-nemo'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Nvidia Provider
 * @see {@link https://docs.api.nvidia.com/nim/}
 */
export const createNvidia = (apiKey: string, baseURL = 'https://integrate.api.nvidia.com/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'openai/whisper-large-v3' | 'microsoft/phi-3-small-8k-instruct' | 'microsoft/phi-3-vision-128k-instruct' | 'microsoft/phi-3-medium-4k-instruct' | 'microsoft/phi-3.5-vision-instruct' | 'microsoft/phi-3-medium-128k-instruct' | 'microsoft/phi-3.5-moe-instruct' | 'microsoft/phi-3-small-128k-instruct' | 'microsoft/phi-4-mini-instruct' | 'nvidia/llama3-chatqa-1.5-70b' | 'nvidia/llama-3.1-nemotron-70b-instruct' | 'nvidia/llama-3.3-nemotron-super-49b-v1.5' | 'nvidia/nemotron-4-340b-instruct' | 'nvidia/cosmos-nemotron-34b' | 'nvidia/nemotron-3-super-120b-a12b' | 'nvidia/nvidia-nemotron-nano-9b-v2' | 'nvidia/llama-3.1-nemotron-51b-instruct' | 'nvidia/nemoretriever-ocr-v1' | 'nvidia/llama-embed-nemotron-8b' | 'nvidia/llama-3.3-nemotron-super-49b-v1' | 'nvidia/parakeet-tdt-0.6b-v2' | 'nvidia/nemotron-3-nano-30b-a3b' | 'nvidia/llama-3.1-nemotron-ultra-253b-v1' | 'z-ai/glm5' | 'z-ai/glm4.7' | 'stepfun-ai/step-3.5-flash' | 'google/gemma-3-1b-it' | 'google/gemma-3n-e2b-it' | 'google/gemma-3-27b-it' | 'google/gemma-3n-e4b-it' | 'google/codegemma-1.1-7b' | 'google/codegemma-7b' | 'google/gemma-2-2b-it' | 'google/gemma-2-27b-it' | 'google/gemma-3-12b-it' | 'minimaxai/minimax-m2.1' | 'minimaxai/minimax-m2.5' | 'deepseek-ai/deepseek-v3.1-terminus' | 'deepseek-ai/deepseek-r1' | 'deepseek-ai/deepseek-coder-6.7b-instruct' | 'deepseek-ai/deepseek-v3.1' | 'deepseek-ai/deepseek-r1-0528' | 'deepseek-ai/deepseek-v3.2' | 'qwen/qwq-32b' | 'qwen/qwen2.5-coder-7b-instruct' | 'qwen/qwen2.5-coder-32b-instruct' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3-235b-a22b' | 'qwen/qwen3.5-397b-a17b' | 'black-forest-labs/flux.1-dev' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-instruct-0905' | 'moonshotai/kimi-k2-instruct' | 'meta/codellama-70b' | 'meta/llama-3.3-70b-instruct' | 'meta/llama-3.2-1b-instruct' | 'meta/llama-3.1-405b-instruct' | 'meta/llama3-8b-instruct' | 'meta/llama-4-scout-17b-16e-instruct' | 'meta/llama-3.2-11b-vision-instruct' | 'meta/llama3-70b-instruct' | 'meta/llama-4-maverick-17b-128e-instruct' | 'meta/llama-3.1-70b-instruct' | 'mistralai/devstral-2-123b-instruct-2512' | 'mistralai/mistral-large-3-675b-instruct-2512' | 'mistralai/mistral-large-2-instruct' | 'mistralai/ministral-14b-instruct-2512' | 'mistralai/mamba-codestral-7b-v0.1' | 'mistralai/codestral-22b-instruct-v0.1' | 'mistralai/mistral-small-3.1-24b-instruct-2503'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Ollama Cloud Provider
 * @see {@link https://docs.ollama.com/cloud}
 */
export const createOllamaCloud = (apiKey: string, baseURL = 'https://ollama.com/v1') => merge(
  createChatProvider<'mistral-large-3:675b' | 'kimi-k2-thinking' | 'qwen3-coder-next' | 'qwen3-vl:235b-instruct' | 'gpt-oss:120b' | 'kimi-k2.5' | 'cogito-2.1:671b' | 'nemotron-3-nano:30b' | 'ministral-3:14b' | 'devstral-small-2:24b' | 'minimax-m2' | 'qwen3-next:80b' | 'qwen3-vl:235b' | 'minimax-m2.1' | 'gemma3:12b' | 'gemma3:27b' | 'qwen3-coder:480b' | 'glm-4.6' | 'gemini-3-flash-preview' | 'minimax-m2.7' | 'gpt-oss:20b' | 'ministral-3:8b' | 'gemma3:4b' | 'qwen3.5:397b' | 'nemotron-3-super' | 'glm-5' | 'devstral-2:123b' | 'glm-4.7' | 'rnj-1:8b' | 'deepseek-v3.2' | 'deepseek-v3.1:671b' | 'ministral-3:3b' | 'kimi-k2:1t' | 'minimax-m2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenAI Provider
 * @see {@link https://platform.openai.com/docs/models}
 */
export const createOpenAI = (apiKey: string, baseURL = 'https://api.openai.com/v1/') => merge(
  createChatProvider<'gpt-5.2-codex' | 'o1-pro' | 'text-embedding-3-large' | 'gpt-5.1-codex-mini' | 'gpt-5.4-pro' | 'o3-mini' | 'gpt-5.4-mini' | 'gpt-5-pro' | 'gpt-5.2-chat-latest' | 'gpt-5' | 'gpt-4-turbo' | 'gpt-4o' | 'gpt-5.3-codex' | 'gpt-5-mini' | 'gpt-5.3-codex-spark' | 'gpt-4o-mini' | 'gpt-5.1-codex-max' | 'gpt-4.1' | 'gpt-5.1-chat-latest' | 'gpt-3.5-turbo' | 'gpt-5.4' | 'o1' | 'codex-mini-latest' | 'o3' | 'gpt-5.3-chat-latest' | 'gpt-5.4-nano' | 'gpt-4o-2024-05-13' | 'gpt-4' | 'gpt-4o-2024-11-20' | 'text-embedding-ada-002' | 'gpt-5.2' | 'o4-mini-deep-research' | 'gpt-5.1' | 'gpt-4.1-mini' | 'gpt-5-chat-latest' | 'gpt-5-nano' | 'o3-pro' | 'gpt-4o-2024-08-06' | 'gpt-4.1-nano' | 'o1-preview' | 'text-embedding-3-small' | 'gpt-5-codex' | 'o4-mini' | 'o3-deep-research' | 'gpt-5.1-codex' | 'o1-mini' | 'gpt-5.2-pro'>({ apiKey, baseURL }),
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
  createChatProvider<'gpt-5.2-codex' | 'mimo-v2-flash-free' | 'gpt-5.1-codex-mini' | 'gpt-5.4-pro' | 'big-pickle' | 'gpt-5.4-mini' | 'kimi-k2-thinking' | 'minimax-m2.1-free' | 'gpt-5' | 'claude-opus-4-5' | 'kimi-k2.5' | 'mimo-v2-omni-free' | 'gpt-5.3-codex' | 'qwen3.6-plus-free' | 'gpt-5.3-codex-spark' | 'kimi-k2' | 'claude-opus-4-6' | 'gpt-5.1-codex-max' | 'claude-sonnet-4-6' | 'grok-code' | 'gpt-5.4' | 'qwen3-coder' | 'minimax-m2.1' | 'kimi-k2.5-free' | 'glm-5-free' | 'claude-opus-4-1' | 'glm-4.6' | 'gpt-5.4-nano' | 'claude-sonnet-4' | 'gpt-5.2' | 'gpt-5.1' | 'gemini-3-pro' | 'glm-5' | 'gpt-5-nano' | 'nemotron-3-super-free' | 'claude-3-5-haiku' | 'minimax-m2.5-free' | 'trinity-large-preview-free' | 'glm-4.7' | 'gemini-3.1-pro' | 'claude-sonnet-4-5' | 'glm-4.7-free' | 'gpt-5-codex' | 'claude-haiku-4-5' | 'gpt-5.1-codex' | 'minimax-m2.5' | 'gemini-3-flash' | 'mimo-v2-pro-free'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenCode Go Provider
 * @see {@link https://opencode.ai/docs/zen}
 */
export const createOpencodeGo = (apiKey: string, baseURL = 'https://opencode.ai/zen/go/v1') => merge(
  createChatProvider<'kimi-k2.5' | 'minimax-m2.7' | 'glm-5' | 'minimax-m2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OVHcloud AI Endpoints Provider
 * @see {@link https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog//}
 */
export const createOvhcloud = (apiKey: string, baseURL = 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1') => merge(
  createChatProvider<'qwen3-coder-30b-a3b-instruct' | 'mistral-nemo-instruct-2407' | 'deepseek-r1-distill-llama-70b' | 'llama-3.1-8b-instruct' | 'gpt-oss-120b' | 'qwen2.5-coder-32b-instruct' | 'qwen2.5-vl-72b-instruct' | 'mistral-7b-instruct-v0.3' | 'gpt-oss-20b' | 'qwen3-32b' | 'mistral-small-3.2-24b-instruct-2506' | 'mixtral-8x7b-instruct-v0.1' | 'meta-llama-3_3-70b-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Perplexity Provider
 * @see {@link https://docs.perplexity.ai}
 */
export const createPerplexity = (apiKey: string, baseURL = 'https://api.perplexity.ai/') => merge(
  createChatProvider<'sonar-deep-research' | 'sonar' | 'sonar-reasoning-pro' | 'sonar-pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Perplexity Agent Provider
 * @see {@link https://docs.perplexity.ai/docs/agent-api/models}
 */
export const createPerplexityAgent = (apiKey: string, baseURL = 'https://api.perplexity.ai/v1') => merge(
  createChatProvider<'openai/gpt-5-mini' | 'openai/gpt-5.4' | 'openai/gpt-5.2' | 'openai/gpt-5.1' | 'anthropic/claude-opus-4-5' | 'anthropic/claude-opus-4-6' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-haiku-4-5' | 'xai/grok-4-1-fast-non-reasoning' | 'nvidia/nemotron-3-super-120b-a12b' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-pro' | 'google/gemini-2.5-flash' | 'perplexity/sonar'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Poe Provider
 * @see {@link https://creator.poe.com/docs/external-applications/openai-compatible-api}
 */
export const createPoe = (apiKey: string, baseURL = 'https://api.poe.com/v1') => merge(
  createChatProvider<'runwayml/runway' | 'runwayml/runway-gen-4-turbo' | 'openai/gpt-5.2-codex' | 'openai/o1-pro' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.4-pro' | 'openai/sora-2' | 'openai/o3-mini' | 'openai/gpt-5.4-mini' | 'openai/gpt-5-pro' | 'openai/gpt-5' | 'openai/chatgpt-4o-latest' | 'openai/gpt-4-turbo' | 'openai/gpt-4o' | 'openai/gpt-5.3-codex' | 'openai/o3-mini-high' | 'openai/gpt-5-mini' | 'openai/gpt-image-1.5' | 'openai/gpt-4o-mini' | 'openai/gpt-image-1-mini' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-4.1' | 'openai/gpt-3.5-turbo' | 'openai/gpt-3.5-turbo-instruct' | 'openai/dall-e-3' | 'openai/gpt-4-classic' | 'openai/gpt-5.4' | 'openai/o1' | 'openai/gpt-4o-aug' | 'openai/o3' | 'openai/gpt-5-chat' | 'openai/gpt-4o-mini-search' | 'openai/gpt-3.5-turbo-raw' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.2' | 'openai/o4-mini-deep-research' | 'openai/gpt-5.1' | 'openai/gpt-4.1-mini' | 'openai/gpt-5-nano' | 'openai/gpt-5.1-instant' | 'openai/gpt-5.2-instant' | 'openai/gpt-4-classic-0314' | 'openai/gpt-4o-search' | 'openai/gpt-image-1' | 'openai/o3-pro' | 'openai/gpt-4.1-nano' | 'openai/gpt-5.3-instant' | 'openai/gpt-5-codex' | 'openai/o4-mini' | 'openai/o3-deep-research' | 'openai/gpt-5.1-codex' | 'openai/sora-2-pro' | 'openai/gpt-5.2-pro' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-haiku-3.5' | 'anthropic/claude-haiku-3' | 'anthropic/claude-sonnet-3.7' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-sonnet-3.5-june' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-sonnet-3.5' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-opus-4' | 'xai/grok-4-fast-non-reasoning' | 'xai/grok-4' | 'xai/grok-code-fast-1' | 'xai/grok-4.1-fast-non-reasoning' | 'xai/grok-4.1-fast-reasoning' | 'xai/grok-3-mini' | 'xai/grok-4.20-multi-agent' | 'xai/grok-4-fast-reasoning' | 'xai/grok-3' | 'stabilityai/stablediffusionxl' | 'trytako/tako' | 'google/gemini-2.5-flash-lite' | 'google/lyria' | 'google/imagen-4-ultra' | 'google/nano-banana-pro' | 'google/imagen-3-fast' | 'google/imagen-3' | 'google/gemini-2.0-flash-lite' | 'google/veo-3.1-fast' | 'google/veo-3-fast' | 'google/imagen-4-fast' | 'google/veo-3.1' | 'google/imagen-4' | 'google/veo-3' | 'google/gemini-2.5-pro' | 'google/gemini-2.5-flash' | 'google/gemini-2.0-flash' | 'google/gemini-3-pro' | 'google/gemini-deep-research' | 'google/veo-2' | 'google/gemini-3.1-pro' | 'google/nano-banana' | 'google/gemini-3-flash' | 'google/gemini-3.1-flash-lite' | 'poetools/claude-code' | 'novita/glm-4.7-n' | 'novita/kimi-k2-thinking' | 'novita/kimi-k2.5' | 'novita/glm-4.7-flash' | 'novita/minimax-m2.1' | 'novita/glm-4.6' | 'novita/glm-4.6v' | 'novita/glm-4.7' | 'novita/deepseek-v3.2' | 'topazlabs-co/topazlabs' | 'elevenlabs/elevenlabs-v3' | 'elevenlabs/elevenlabs-music' | 'elevenlabs/elevenlabs-v2.5-turbo' | 'lumalabs/ray2' | 'cerebras/gpt-oss-120b-cs' | 'cerebras/llama-3.3-70b-cs' | 'cerebras/qwen3-235b-2507-cs' | 'cerebras/llama-3.1-8b-cs' | 'cerebras/qwen3-32b-cs' | 'ideogramai/ideogram-v2' | 'ideogramai/ideogram-v2a' | 'ideogramai/ideogram-v2a-turbo' | 'ideogramai/ideogram'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Privatemode AI Provider
 * @see {@link https://docs.privatemode.ai/api/overview}
 */
export const createPrivatemodeAi = (apiKey: string, baseURL = 'http://localhost:8080/v1') => merge(
  createChatProvider<'gpt-oss-120b' | 'qwen3-embedding-4b' | 'whisper-large-v3' | 'gemma-3-27b' | 'qwen3-coder-30b-a3b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a QiHang Provider
 * @see {@link https://www.qhaigc.net/docs}
 */
export const createQihangAi = (apiKey: string, baseURL = 'https://api.qhaigc.net/v1') => merge(
  createChatProvider<'gpt-5.2-codex' | 'claude-opus-4-5-20251101' | 'gemini-3-pro-preview' | 'gpt-5-mini' | 'claude-sonnet-4-5-20250929' | 'gemini-3-flash-preview' | 'gemini-2.5-flash' | 'gpt-5.2' | 'claude-haiku-4-5-20251001'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Qiniu Provider
 * @see {@link https://developer.qiniu.com/aitokenapi}
 */
export const createQiniuAi = (apiKey: string, baseURL = 'https://api.qnaigc.com/v1') => merge(
  createChatProvider<'gemini-2.5-flash-lite' | 'qwen3-235b-a22b-instruct-2507' | 'claude-4.5-opus' | 'doubao-1.5-vision-pro' | 'qwen-turbo' | 'deepseek-v3-0324' | 'deepseek-r1' | 'qwen3-max-preview' | 'claude-4.0-sonnet' | 'doubao-1.5-pro-32k' | 'gemini-3.0-flash-preview' | 'deepseek-v3' | 'MiniMax-M1' | 'gemini-3.0-pro-image-preview' | 'doubao-seed-2.0-lite' | 'doubao-seed-2.0-mini' | 'qwen3-30b-a3b-thinking-2507' | 'kimi-k2' | 'qwen3-30b-a3b' | 'doubao-seed-2.0-pro' | 'gpt-oss-120b' | 'gemini-2.0-flash-lite' | 'doubao-seed-2.0-code' | 'doubao-seed-1.6' | 'glm-4.5' | 'qwen2.5-vl-72b-instruct' | 'claude-3.7-sonnet' | 'doubao-seed-1.6-flash' | 'gemini-3.0-pro-preview' | 'qwen3-coder-480b-a35b-instruct' | 'qwen3-next-80b-a3b-thinking' | 'gemini-2.5-pro' | 'qwen-max-2025-01-25' | 'claude-4.0-opus' | 'gemini-2.5-flash' | 'qwen3-235b-a22b-thinking-2507' | 'qwen-vl-max-2025-01-25' | 'qwen3-next-80b-a3b-instruct' | 'claude-3.5-haiku' | 'kling-v2-6' | 'deepseek-v3.1' | 'gemini-2.0-flash' | 'doubao-seed-1.6-thinking' | 'qwen3-235b-a22b' | 'qwen3-vl-30b-a3b-thinking' | 'doubao-1.5-thinking-pro' | 'claude-4.1-opus' | 'glm-4.5-air' | 'qwen3.5-397b-a17b' | 'gemini-2.5-flash-image' | 'claude-4.5-sonnet' | 'deepseek-r1-0528' | 'qwen3-max' | 'gpt-oss-20b' | 'qwen3-32b' | 'claude-4.5-haiku' | 'qwen2.5-vl-7b-instruct' | 'claude-3.5-sonnet' | 'mimo-v2-flash' | 'qwen3-30b-a3b-instruct-2507' | 'meituan/longcat-flash-lite' | 'meituan/longcat-flash-chat' | 'openai/gpt-5' | 'openai/gpt-5.2' | 'x-ai/grok-4-fast' | 'x-ai/grok-4.1-fast' | 'x-ai/grok-4-fast-non-reasoning' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4.1-fast-non-reasoning' | 'x-ai/grok-4.1-fast-reasoning' | 'x-ai/grok-4-fast-reasoning' | 'deepseek/deepseek-v3.1-terminus-thinking' | 'deepseek/deepseek-v3.1-terminus' | 'deepseek/deepseek-v3.2-exp-thinking' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-math-v2' | 'deepseek/deepseek-v3.2-251201' | 'z-ai/glm-4.6' | 'z-ai/glm-5' | 'z-ai/autoglm-phone-9b' | 'z-ai/glm-4.7' | 'stepfun-ai/gelab-zero-4b-preview' | 'minimax/minimax-m2' | 'minimax/minimax-m2.1' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.5-highspeed' | 'xiaomi/mimo-v2-flash' | 'stepfun/step-3.5-flash' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Requesty Provider
 * @see {@link https://requesty.ai/solution/llm-routing/models}
 */
export const createRequesty = (apiKey: string, baseURL = 'https://router.requesty.ai/v1') => merge(
  createChatProvider<'openai/gpt-5.2-codex' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.4-pro' | 'openai/gpt-5-pro' | 'openai/gpt-5' | 'openai/gpt-5.3-codex' | 'openai/gpt-5-mini' | 'openai/gpt-4o-mini' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-4.1' | 'openai/gpt-5.1-chat' | 'openai/gpt-5.4' | 'openai/gpt-5-chat' | 'openai/gpt-5.2-chat' | 'openai/gpt-5.2' | 'openai/gpt-5.1' | 'openai/gpt-4.1-mini' | 'openai/gpt-5-nano' | 'openai/gpt-5-image' | 'openai/gpt-5-codex' | 'openai/o4-mini' | 'openai/gpt-5.1-codex' | 'openai/gpt-5.2-pro' | 'anthropic/claude-opus-4-5' | 'anthropic/claude-opus-4-6' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-opus-4-1' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-opus-4' | 'anthropic/claude-3-7-sonnet' | 'xai/grok-4-fast' | 'xai/grok-4' | 'google/gemini-3-pro-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-pro' | 'google/gemini-2.5-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Scaleway Provider
 * @see {@link https://www.scaleway.com/en/docs/generative-apis/}
 */
export const createScaleway = (apiKey: string, baseURL = 'https://api.scaleway.ai/v1') => merge(
  createChatProvider<'qwen3-coder-30b-a3b-instruct' | 'qwen3-235b-a22b-instruct-2507' | 'qwen3-embedding-8b' | 'mistral-nemo-instruct-2407' | 'deepseek-r1-distill-llama-70b' | 'devstral-2-123b-instruct-2512' | 'llama-3.3-70b-instruct' | 'gemma-3-27b-it' | 'llama-3.1-8b-instruct' | 'gpt-oss-120b' | 'bge-multilingual-gemma2' | 'pixtral-12b-2409' | 'voxtral-small-24b-2507' | 'whisper-large-v3' | 'qwen3.5-397b-a17b' | 'mistral-small-3.2-24b-instruct-2506'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a SiliconFlow Provider
 * @see {@link https://cloud.siliconflow.com/models}
 */
export const createSiliconFlow = (apiKey: string, baseURL = 'https://api.siliconflow.com/v1') => merge(
  createChatProvider<'THUDM/GLM-Z1-32B-0414' | 'THUDM/GLM-Z1-9B-0414' | 'THUDM/GLM-4-32B-0414' | 'THUDM/GLM-4-9B-0414' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'zai-org/GLM-4.5-Air' | 'zai-org/GLM-4.7' | 'zai-org/GLM-4.6V' | 'zai-org/GLM-4.5V' | 'zai-org/GLM-4.5' | 'zai-org/GLM-5' | 'zai-org/GLM-4.6' | 'nex-agi/DeepSeek-V3.1-Nex-N1' | 'stepfun-ai/Step-3.5-Flash' | 'baidu/ERNIE-4.5-300B-A47B' | 'meta-llama/Meta-Llama-3.1-8B-Instruct' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2.5' | 'deepseek-ai/deepseek-vl2' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3.2-Exp' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-V3' | 'ByteDance-Seed/Seed-OSS-36B-Instruct' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'Qwen/Qwen3-Omni-30B-A3B-Thinking' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Thinking' | 'Qwen/Qwen3-30B-A3B-Thinking-2507' | 'Qwen/Qwen2.5-14B-Instruct' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen3-235B-A22B' | 'Qwen/Qwen2.5-72B-Instruct-128K' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen2.5-VL-72B-Instruct' | 'Qwen/Qwen3-VL-8B-Thinking' | 'Qwen/Qwen3-Omni-30B-A3B-Captioner' | 'Qwen/Qwen3-VL-30B-A3B-Thinking' | 'Qwen/Qwen2.5-VL-7B-Instruct' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3-VL-8B-Instruct' | 'Qwen/Qwen3-8B' | 'Qwen/QwQ-32B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-VL-32B-Instruct' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-Omni-30B-A3B-Instruct' | 'Qwen/Qwen2.5-7B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen3-VL-32B-Thinking' | 'Qwen/Qwen2.5-32B-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'inclusionAI/Ling-flash-2.0' | 'inclusionAI/Ring-flash-2.0' | 'inclusionAI/Ling-mini-2.0' | 'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'tencent/Hunyuan-MT-7B' | 'tencent/Hunyuan-A13B-Instruct'>({ apiKey, baseURL }),
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
  createChatProvider<'THUDM/GLM-4-9B-0414' | 'THUDM/GLM-4-32B-0414' | 'THUDM/GLM-Z1-9B-0414' | 'THUDM/GLM-Z1-32B-0414' | 'zai-org/GLM-4.6' | 'zai-org/GLM-4.5V' | 'zai-org/GLM-4.6V' | 'zai-org/GLM-4.5-Air' | 'stepfun-ai/Step-3.5-Flash' | 'Pro/zai-org/GLM-4.7' | 'Pro/zai-org/GLM-5' | 'Pro/MiniMaxAI/MiniMax-M2.1' | 'Pro/MiniMaxAI/MiniMax-M2.5' | 'Pro/deepseek-ai/DeepSeek-R1' | 'Pro/deepseek-ai/DeepSeek-V3.1-Terminus' | 'Pro/deepseek-ai/DeepSeek-V3.2' | 'Pro/deepseek-ai/DeepSeek-V3' | 'Pro/moonshotai/Kimi-K2.5' | 'Pro/moonshotai/Kimi-K2-Instruct-0905' | 'Pro/moonshotai/Kimi-K2-Thinking' | 'baidu/ERNIE-4.5-300B-A47B' | 'PaddlePaddle/PaddleOCR-VL-1.5' | 'PaddlePaddle/PaddleOCR-VL' | 'deepseek-ai/DeepSeek-OCR' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B' | 'deepseek-ai/deepseek-vl2' | 'ByteDance-Seed/Seed-OSS-36B-Instruct' | 'Qwen/Qwen3.5-35B-A3B' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3.5-122B-A10B' | 'Qwen/Qwen3.5-9B' | 'Qwen/Qwen3.5-27B' | 'Qwen/Qwen3.5-4B' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen2.5-32B-Instruct' | 'Qwen/Qwen3-VL-32B-Thinking' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen2.5-7B-Instruct' | 'Qwen/Qwen3-Omni-30B-A3B-Instruct' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-VL-32B-Instruct' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/QwQ-32B' | 'Qwen/Qwen3-8B' | 'Qwen/Qwen3-VL-8B-Instruct' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-VL-30B-A3B-Thinking' | 'Qwen/Qwen3-Omni-30B-A3B-Captioner' | 'Qwen/Qwen3-VL-8B-Thinking' | 'Qwen/Qwen2.5-VL-72B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen2.5-72B-Instruct-128K' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen2.5-14B-Instruct' | 'Qwen/Qwen3-30B-A3B-Thinking-2507' | 'Qwen/Qwen3-VL-235B-A22B-Thinking' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen3-Omni-30B-A3B-Thinking' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'ascend-tribe/pangu-pro-moe' | 'inclusionAI/Ling-mini-2.0' | 'inclusionAI/Ring-flash-2.0' | 'inclusionAI/Ling-flash-2.0' | 'moonshotai/Kimi-K2-Thinking' | 'moonshotai/Kimi-K2-Instruct-0905' | 'tencent/Hunyuan-A13B-Instruct' | 'tencent/Hunyuan-MT-7B' | 'Kwaipilot/KAT-Dev'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a STACKIT Provider
 * @see {@link https://docs.stackit.cloud/products/data-and-ai/ai-model-serving/basics/available-shared-models}
 */
export const createStackit = (apiKey: string, baseURL = 'https://api.openai-compat.model-serving.eu01.onstackit.cloud/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'google/gemma-3-27b-it' | 'cortecs/Llama-3.3-70B-Instruct-FP8-Dynamic' | 'neuralmagic/Mistral-Nemo-Instruct-2407-FP8' | 'neuralmagic/Meta-Llama-3.1-8B-Instruct-FP8' | 'intfloat/e5-mistral-7b-instruct' | 'Qwen/Qwen3-VL-235B-A22B-Instruct-FP8' | 'Qwen/Qwen3-VL-Embedding-8B'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a StepFun Provider
 * @see {@link https://platform.stepfun.com/docs/zh/overview/concept}
 */
export const createStepfun = (apiKey: string, baseURL = 'https://api.stepfun.com/v1') => merge(
  createChatProvider<'step-1-32k' | 'step-3.5-flash' | 'step-2-16k'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createSpeechProvider({ apiKey, baseURL }),
  createTranscriptionProvider({ apiKey, baseURL }),
)

/**
 * Create a submodel Provider
 * @see {@link https://submodel.gitbook.io}
 */
export const createSubmodel = (apiKey: string, baseURL = 'https://llm.submodel.ai/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'zai-org/GLM-4.5-Air' | 'zai-org/GLM-4.5-FP8' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324' | 'deepseek-ai/DeepSeek-R1-0528' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Synthetic Provider
 * @see {@link https://synthetic.new/pricing}
 */
export const createSynthetic = (apiKey: string, baseURL = 'https://api.synthetic.new/openai/v1') => merge(
  createChatProvider<'hf:moonshotai/Kimi-K2.5' | 'hf:moonshotai/Kimi-K2-Instruct-0905' | 'hf:moonshotai/Kimi-K2-Thinking' | 'hf:meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'hf:meta-llama/Llama-3.1-8B-Instruct' | 'hf:meta-llama/Llama-3.3-70B-Instruct' | 'hf:meta-llama/Llama-3.1-405B-Instruct' | 'hf:meta-llama/Llama-3.1-70B-Instruct' | 'hf:meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'hf:zai-org/GLM-4.7' | 'hf:zai-org/GLM-4.7-Flash' | 'hf:zai-org/GLM-4.6' | 'hf:deepseek-ai/DeepSeek-V3.1' | 'hf:deepseek-ai/DeepSeek-V3-0324' | 'hf:deepseek-ai/DeepSeek-R1' | 'hf:deepseek-ai/DeepSeek-V3.1-Terminus' | 'hf:deepseek-ai/DeepSeek-R1-0528' | 'hf:deepseek-ai/DeepSeek-V3.2' | 'hf:deepseek-ai/DeepSeek-V3' | 'hf:nvidia/Kimi-K2.5-NVFP4' | 'hf:MiniMaxAI/MiniMax-M2.1' | 'hf:MiniMaxAI/MiniMax-M2.5' | 'hf:MiniMaxAI/MiniMax-M2' | 'hf:openai/gpt-oss-120b' | 'hf:Qwen/Qwen2.5-Coder-32B-Instruct' | 'hf:Qwen/Qwen3.5-397B-A17B' | 'hf:Qwen/Qwen3-235B-A22B-Thinking-2507' | 'hf:Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'hf:Qwen/Qwen3-235B-A22B-Instruct-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Tencent Coding Plan (China) Provider
 * @see {@link https://cloud.tencent.com/document/product/1772/128947}
 */
export const createTencentCodingPlan = (apiKey: string, baseURL = 'https://api.lkeap.cloud.tencent.com/coding/v3') => merge(
  createChatProvider<'hunyuan-2.0-instruct' | 'kimi-k2.5' | 'hunyuan-t1' | 'hunyuan-2.0-thinking' | 'tc-code-latest' | 'glm-5' | 'hunyuan-turbos' | 'minimax-m2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Upstage Provider
 * @see {@link https://developers.upstage.ai/docs/apis/chat}
 */
export const createUpstage = (apiKey: string, baseURL = 'https://api.upstage.ai/v1/solar') => merge(
  createChatProvider<'solar-pro3' | 'solar-pro2' | 'solar-mini'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Venice AI Provider
 * @see {@link https://docs.venice.ai}
 */
export const createVenice = (apiKey: string, baseURL = 'https://api.venice.ai/api/v1') => merge(
  createChatProvider<'qwen3-235b-a22b-instruct-2507' | 'qwen3-coder-480b-a35b-instruct-turbo' | 'aion-labs.aion-2-0' | 'qwen3-next-80b' | 'kimi-k2-thinking' | 'zai-org-glm-4.7' | 'openai-gpt-53-codex' | 'qwen3-5-35b-a3b' | 'olafangensan-glm-4.7-flash-heretic' | 'grok-code-fast-1' | 'openai-gpt-4o-2024-11-20' | 'grok-4-20-beta' | 'grok-4-20-multi-agent-beta' | 'openai-gpt-54-mini' | 'claude-opus-4-6' | 'claude-sonnet-4-6' | 'openai-gpt-54-pro' | 'kimi-k2-5' | 'claude-opus-45' | 'llama-3.2-3b' | 'qwen3-5-9b' | 'minimax-m27' | 'venice-uncensored' | 'openai-gpt-oss-120b' | 'gemini-3-flash-preview' | 'openai-gpt-52' | 'gemini-3-1-pro-preview' | 'qwen3-coder-480b-a35b-instruct' | 'zai-org-glm-4.6' | 'qwen3-235b-a22b-thinking-2507' | 'google-gemma-3-27b-it' | 'hermes-3-llama-3.1-405b' | 'claude-sonnet-45' | 'llama-3.3-70b' | 'zai-org-glm-5' | 'minimax-m25' | 'openai-gpt-54' | 'nvidia-nemotron-3-nano-30b-a3b' | 'deepseek-v3.2' | 'venice-uncensored-role-play' | 'qwen3-vl-235b-a22b' | 'grok-41-fast' | 'openai-gpt-4o-mini-2024-07-18' | 'zai-org-glm-4.7-flash' | 'mistral-small-3-2-24b-instruct' | 'openai-gpt-52-codex' | 'minimax-m21'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Vivgrid Provider
 * @see {@link https://docs.vivgrid.com/models}
 */
export const createVivgrid = (apiKey: string, baseURL = 'https://api.vivgrid.com/v1') => merge(
  createChatProvider<'gpt-5.2-codex' | 'gemini-3.1-pro-preview' | 'gpt-5-mini' | 'gpt-5.1-codex-max' | 'gpt-5.4' | 'glm-5' | 'gemini-3.1-flash-lite-preview' | 'deepseek-v3.2' | 'gpt-5.1-codex'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Vultr Provider
 * @see {@link https://api.vultrinference.com/}
 */
export const createVultr = (apiKey: string, baseURL = 'https://api.vultrinference.com/v1') => merge(
  createChatProvider<'Kimi-K2.5' | 'MiniMax-M2.5' | 'GLM-5-FP8' | 'DeepSeek-V3.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Weights & Biases Provider
 * @see {@link https://docs.wandb.ai/guides/integrations/inference/}
 */
export const createWandb = (apiKey: string, baseURL = 'https://api.inference.wandb.ai/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'microsoft/Phi-4-mini-instruct' | 'zai-org/GLM-5-FP8' | 'nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-FP8' | 'OpenPipe/Qwen3-14B-Instruct' | 'meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'meta-llama/Llama-3.1-8B-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct' | 'meta-llama/Llama-3.1-70B-Instruct' | 'MiniMaxAI/MiniMax-M2.5' | 'deepseek-ai/DeepSeek-V3.1' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'moonshotai/Kimi-K2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a xAI Provider
 * @see {@link https://docs.x.ai/docs/models}
 */
export const createXai = (apiKey: string, baseURL = 'https://api.x.ai/v1/') => merge(
  createChatProvider<'grok-2-vision-1212' | 'grok-4-fast' | 'grok-2-latest' | 'grok-4-fast-non-reasoning' | 'grok-4' | 'grok-code-fast-1' | 'grok-3-mini-fast' | 'grok-beta' | 'grok-2-vision-latest' | 'grok-4-1-fast-non-reasoning' | 'grok-2' | 'grok-3-fast-latest' | 'grok-2-1212' | 'grok-3-mini' | 'grok-2-vision' | 'grok-3-latest' | 'grok-4.20-multi-agent-0309' | 'grok-3-fast' | 'grok-3-mini-fast-latest' | 'grok-3' | 'grok-3-mini-latest' | 'grok-4.20-0309-reasoning' | 'grok-4.20-0309-non-reasoning' | 'grok-vision-beta' | 'grok-4-1-fast'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xiaomi Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 */
export const createXiaomi = (apiKey: string, baseURL = 'https://api.xiaomimimo.com/v1') => merge(
  createChatProvider<'mimo-v2-pro' | 'mimo-v2-omni' | 'mimo-v2-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Z.AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 */
export const createZai = (apiKey: string, baseURL = 'https://api.z.ai/api/paas/v4') => merge(
  createChatProvider<'glm-4.7-flash' | 'glm-5-turbo' | 'glm-4.5' | 'glm-4.7-flashx' | 'glm-4.6' | 'glm-4.6v' | 'glm-4.5-flash' | 'glm-5' | 'glm-4.5-air' | 'glm-4.5v' | 'glm-4.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Z.AI Coding Plan Provider
 * @see {@link https://docs.z.ai/devpack/overview}
 */
export const createZaiCodingPlan = (apiKey: string, baseURL = 'https://api.z.ai/api/coding/paas/v4') => merge(
  createChatProvider<'glm-4.7-flash' | 'glm-5-turbo' | 'glm-4.5' | 'glm-4.7-flashx' | 'glm-4.6' | 'glm-4.6v' | 'glm-4.5-flash' | 'glm-5' | 'glm-4.5-air' | 'glm-4.5v' | 'glm-5.1' | 'glm-4.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a ZenMux Provider
 * @see {@link https://docs.zenmux.ai}
 */
export const createZenmux = (apiKey: string, baseURL = 'https://zenmux.ai/api/v1') => merge(
  createChatProvider<'openai/gpt-5.2-codex' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.4-pro' | 'openai/gpt-5.4-mini' | 'openai/gpt-5' | 'openai/gpt-5.3-codex' | 'openai/gpt-5.1-chat' | 'openai/gpt-5.4' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.3-chat' | 'openai/gpt-5.2' | 'openai/gpt-5.1' | 'openai/gpt-5-codex' | 'openai/gpt-5.1-codex' | 'openai/gpt-5.2-pro' | 'x-ai/grok-4-fast' | 'x-ai/grok-4.1-fast' | 'x-ai/grok-4' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4.1-fast-non-reasoning' | 'x-ai/grok-4.2-fast' | 'x-ai/grok-4.2-fast-non-reasoning' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-3.7-sonnet' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-3.5-haiku' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-opus-4' | 'volcengine/doubao-seed-2.0-lite' | 'volcengine/doubao-seed-2.0-mini' | 'volcengine/doubao-seed-2.0-pro' | 'volcengine/doubao-seed-2.0-code' | 'volcengine/doubao-seed-1.8' | 'volcengine/doubao-seed-code' | 'deepseek/deepseek-chat' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-v3.2' | 'z-ai/glm-4.7-flash-free' | 'z-ai/glm-5-turbo' | 'z-ai/glm-4.5' | 'z-ai/glm-4.7-flashx' | 'z-ai/glm-4.6' | 'z-ai/glm-4.6v' | 'z-ai/glm-5' | 'z-ai/glm-4.5-air' | 'z-ai/glm-4.7' | 'z-ai/glm-4.6v-flash-free' | 'z-ai/glm-4.6v-flash' | 'inclusionai/ring-1t' | 'inclusionai/ling-1t' | 'google/gemini-2.5-flash-lite' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3-pro-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-pro' | 'google/gemini-2.5-flash' | 'google/gemini-3.1-flash-lite-preview' | 'baidu/ernie-5.0-thinking-preview' | 'minimax/minimax-m2.5-lightning' | 'minimax/minimax-m2' | 'minimax/minimax-m2.1' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2.7-highspeed' | 'minimax/minimax-m2.5' | 'qwen/qwen3.5-plus' | 'qwen/qwen3-coder-plus' | 'qwen/qwen3-max' | 'qwen/qwen3.5-flash' | 'xiaomi/mimo-v2-flash-free' | 'xiaomi/mimo-v2-pro' | 'xiaomi/mimo-v2-omni' | 'xiaomi/mimo-v2-flash' | 'stepfun/step-3.5-flash-free' | 'stepfun/step-3' | 'stepfun/step-3.5-flash' | 'kuaishou/kat-coder-pro-v1-free' | 'kuaishou/kat-coder-pro-v1' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking-turbo'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Zhipu AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 */
export const createZhipuai = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/paas/v4') => merge(
  createChatProvider<'glm-5' | 'glm-4.7' | 'glm-4.5v' | 'glm-4.5-air' | 'glm-4.5-flash' | 'glm-4.6v' | 'glm-4.6' | 'glm-4.7-flashx' | 'glm-4.5' | 'glm-4.7-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Zhipu AI Coding Plan Provider
 * @see {@link https://docs.bigmodel.cn/cn/coding-plan/overview}
 */
export const createZhipuaiCodingPlan = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/coding/paas/v4') => merge(
  createChatProvider<'glm-5.1' | 'glm-4.6v-flash' | 'glm-4.7' | 'glm-4.5v' | 'glm-4.5-air' | 'glm-5' | 'glm-4.5-flash' | 'glm-4.6v' | 'glm-4.6' | 'glm-4.7-flashx' | 'glm-4.5' | 'glm-5-turbo' | 'glm-4.7-flash'>({ apiKey, baseURL }),
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
