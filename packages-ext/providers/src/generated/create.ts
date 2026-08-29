/* eslint-disable perfectionist/sort-union-types */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/use-type-alias */

import { createChatProvider, createEmbedProvider, createImageProvider, createModelProvider, createSpeechProvider, createTranscriptionProvider, merge } from '../utils'

/**
 * Create a Abacus Provider
 * @see {@link https://abacus.ai/help/api}
 */
export const createAbacus = (apiKey: string, baseURL = 'https://routellm.abacus.ai/v1') => merge(
  createChatProvider<'claude-opus-4-20250514' | 'claude-opus-4-7' | 'gpt-4o' | 'gemini-3-pro-image' | 'qwen3.7-max' | 'claude-opus-4-1-20250805' | 'gpt-5.3-chat-latest' | 'gemini-3-pro-image-preview' | 'gpt-5-nano' | 'gpt-4o-mini' | 'qwen-2.5-coder-32b' | 'claude-opus-4-8' | 'gemini-3.5-flash-lite' | 'gpt-5.6-sol' | 'o3-pro' | 'grok-4.6' | 'gemini-3.1-pro-preview' | 'grok-4.5' | 'gpt-5' | 'claude-sonnet-5' | 'gpt-5.3-codex-xhigh' | 'gpt-5-codex' | 'grok-code-fast-1' | 'gpt-5-mini' | 'gpt-5.6-luna' | 'claude-3-7-sonnet-20250219' | 'gpt-5.3-codex' | 'qwen3.8-max' | 'claude-sonnet-4-5-20250929' | 'mimo-v2-pro' | 'gpt-4.1-nano' | 'gpt-5.2' | 'gemini-3.5-flash' | 'gpt-5.4-mini' | 'o3' | 'claude-sonnet-4-6' | 'gemini-3.1-flash-lite' | 'muse-spark-1.2' | 'gpt-5.5' | 'route-llm' | 'gemini-2.5-flash' | 'grok-4-1-fast-non-reasoning' | 'llama-3.3-70b-versatile' | 'kimi-k2.5' | 'gpt-5.2-codex' | 'qwen3-max' | 'claude-haiku-4-5-20251001' | 'muse-spark-1.1' | 'gpt-4.1' | 'gemini-3.6-flash' | 'gpt-5.6-terra' | 'gemini-3.1-flash-image' | 'o4-mini' | 'gpt-5.4' | 'gemini-3.1-flash-image-preview' | 'o3-mini' | 'gpt-4o-2024-11-20' | 'gpt-5.2-chat-latest' | 'grok-4-fast-non-reasoning' | 'claude-opus-4-5-20251101' | 'claude-fable-5' | 'grok-4-0709' | 'gemini-3.1-flash-lite-preview' | 'kimi-k2-turbo-preview' | 'claude-sonnet-4-20250514' | 'gpt-5.1-chat-latest' | 'gemini-3-flash-preview' | 'gpt-5.1-codex-max' | 'gemini-2.5-flash-image' | 'claude-opus-4-6' | 'gpt-5.1-codex' | 'claude-opus-5' | 'gemini-2.5-pro' | 'gpt-4.1-mini' | 'gemini-3.7-flash' | 'gpt-5.4-nano' | 'grok-4.3' | 'gpt-5.1' | 'MiniMaxAI/MiniMax-M2.7' | 'MiniMaxAI/MiniMax-M3' | 'deepseek/deepseek-v3.1' | 'google/gemma-4-31b-it' | 'moonshotai/Kimi-K2.7-Code' | 'moonshotai/Kimi-K3' | 'moonshotai/Kimi-K2.6' | 'openai/gpt-oss-120b' | 'deepseek-ai/DeepSeek-V4-Pro' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-V4-Flash' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3.6-27B' | 'Qwen/Qwen3-32B' | 'Qwen/QwQ-32B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct' | 'zai-org/GLM-5.1' | 'zai-org/GLM-4.5' | 'zai-org/GLM-4.6' | 'zai-org/GLM-5' | 'zai-org/GLM-4.7' | 'zai-org/GLM-5.2' | 'thinkingmachines/Inkling' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo' | 'meta-llama/Meta-Llama-3.3-70B-Instruct' | 'meta-llama/Meta-Llama-3.1-8B-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a abliteration.ai Provider
 * @see {@link https://docs.abliteration.ai/models}
 */
export const createAbliterationAi = (apiKey: string, baseURL = 'https://api.abliteration.ai/v1') => merge(
  createChatProvider<'abliterated-model-large' | 'abliterated-model'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a AgentRouter Provider
 * @see {@link https://agentrouter.org/docs/opencode.html}
 */
export const createAgentrouter = (apiKey: string, baseURL = 'https://agentrouter.org/v1') => merge(
  createChatProvider<'claude-opus-4-8' | 'gpt-5.6-sol' | 'claude-opus-5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Agnes AI Provider
 * @see {@link https://agnes-ai.com/doc}
 */
export const createAgnes = (apiKey: string, baseURL = 'https://apihub.agnes-ai.com/v1') => merge(
  createChatProvider<'agnes-2.0-flash' | 'agnes-2.5-pro-alpha' | 'agnes-2.5-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a AI-ROUTER Provider
 * @see {@link https://ai-router.dev/openai-compatible-api-gateway/}
 */
export const createAiRouter = (apiKey: string, baseURL = 'https://api.ai-router.dev/v1') => merge(
  createChatProvider<'gpt-5.6-sol' | 'gpt-5.6-luna' | 'gpt-5.5' | 'gpt-5.6-terra' | 'gpt-5.4'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a ai& Provider
 * @see {@link https://docs.aiand.com/}
 */
export const createAiand = (apiKey: string, baseURL = 'https://api.aiand.com/v1') => merge(
  createChatProvider<'google/gemma-4-31b-it' | 'moonshotai/kimi-k2.7-code' | 'moonshotai/kimi-k3' | 'openai/gpt-oss-120b' | 'deepseek-ai/deepseek-v4-flash' | 'deepseek-ai/deepseek-v4-pro' | 'qwen/qwen3.6-27b' | 'zai-org/glm-5.2' | 'motif-technologies/motif-3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Aixy Provider
 * @see {@link https://docs.aixy-gateway.com/integrations/overview}
 */
export const createAixy = (apiKey: string, baseURL = 'https://api.aixy-gateway.com/v1') => merge(
  createChatProvider<'openai/gpt-4.1-mini'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a AKI.IO Provider
 * @see {@link https://aki.io/docs/}
 */
export const createAkiIo = (apiKey: string, baseURL = 'https://aki.io/v1') => merge(
  createChatProvider<'deepseek-v4-flash-0731-284b' | 'gemma4-26b' | 'gpt-oss-120b' | 'qwen3.6-35b' | 'mistral4-119b' | 'qwen3.8-27b' | 'kimi-k2.7-code-1100b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 */
export const createAlibaba = (apiKey: string, baseURL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1') => merge(
  createChatProvider<'qwen2-5-vl-7b-instruct' | 'qwen3-vl-plus' | 'qwen3-coder-30b-a3b-instruct' | 'qwen3.7-max' | 'qwen-turbo' | 'qwen-omni-turbo' | 'qwen-vl-max' | 'qwen3-32b' | 'qwen3-vl-30b-a3b' | 'qwen3-235b-a22b' | 'qwen-max' | 'qwen3.5-35b-a3b' | 'qwen3.5-397b-a17b' | 'qwen-plus' | 'qwen3.5-plus' | 'qwen2-5-vl-72b-instruct' | 'qwen3-livetranslate-flash-realtime' | 'qwen3-coder-flash' | 'qwen3.6-max-preview' | 'qwen3.8-max' | 'qwen3.7-plus' | 'qwen3-vl-235b-a22b' | 'qwen-vl-ocr' | 'qwen2-5-72b-instruct' | 'qwen3-14b' | 'qwen3.8-flash' | 'qwen-mt-turbo' | 'qwen3-next-80b-a3b-thinking' | 'qwen3-coder-480b-a35b-instruct' | 'qwen3-omni-flash' | 'qwen-flash' | 'qwen3-8b' | 'qwen3-max' | 'glm-5.2' | 'qwen2-5-omni-7b' | 'qwen3.6-35b-a3b' | 'qvq-max' | 'qwen3.6-27b' | 'qwen3-next-80b-a3b-instruct' | 'qwen3-omni-flash-realtime' | 'qwen3.6-plus' | 'qwen2-5-14b-instruct' | 'qwen-mt-plus' | 'qwen-plus-character-ja' | 'qwen2-5-7b-instruct' | 'qwen3.5-27b' | 'qwq-plus' | 'qwen3.5-122b-a10b' | 'qwen3-coder-plus' | 'qwen-omni-turbo-realtime' | 'deepseek-v4-flash-0731' | 'qwen3-asr-flash' | 'qwen2-5-32b-instruct' | 'qwen-vl-plus' | 'qwen3.6-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba (China) Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 */
export const createAlibabaCn = (apiKey: string, baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1') => merge(
  createChatProvider<'qwen2-5-vl-7b-instruct' | 'deepseek-r1-distill-qwen-32b' | 'qwen3-vl-plus' | 'qwen3-coder-30b-a3b-instruct' | 'qwen3.7-max' | 'deepseek-r1' | 'tongyi-intent-detect-v3' | 'deepseek-v3-1' | 'qwen-turbo' | 'qwen-omni-turbo' | 'qwen-vl-max' | 'qwen3-32b' | 'deepseek-v3-2-exp' | 'deepseek-v4-flash' | 'qwen3-vl-30b-a3b' | 'deepseek-r1-distill-qwen-1-5b' | 'qwen-math-plus' | 'qwen3-235b-a22b' | 'deepseek-r1-distill-llama-8b' | 'qwen-max' | 'qwen3.5-397b-a17b' | 'qwen3.5-flash' | 'qwen-plus' | 'deepseek-v4-pro' | 'deepseek-v3' | 'qwen2-5-coder-7b-instruct' | 'qwen3.5-plus' | 'qwen2-5-vl-72b-instruct' | 'deepseek-r1-0528' | 'qwen3-coder-flash' | 'glm-5' | 'qwen3.6-max-preview' | 'qwen3.8-max' | 'qwen3.7-plus' | 'qwq-32b' | 'qwen3.7-flash' | 'qwen2-5-coder-32b-instruct' | 'qwen-math-turbo' | 'qwen3-vl-235b-a22b' | 'qwen-vl-ocr' | 'qwen2-5-72b-instruct' | 'qwen3-14b' | 'qwen-plus-character' | 'qwen3.8-flash' | 'qwen-mt-turbo' | 'qwen3-next-80b-a3b-thinking' | 'qwen3-coder-480b-a35b-instruct' | 'qwen3-omni-flash' | 'kimi-k2.5' | 'qwen-deep-research' | 'qwen-flash' | 'moonshot-kimi-k2-instruct' | 'qwen3-8b' | 'qwen3-max' | 'glm-5.2' | 'deepseek-r1-distill-llama-70b' | 'deepseek-r1-distill-qwen-7b' | 'qwen2-5-omni-7b' | 'qvq-max' | 'qwen-doc-turbo' | 'qwen3-next-80b-a3b-instruct' | 'qwen-long' | 'qwen3-omni-flash-realtime' | 'qwen3.6-plus' | 'qwen2-5-14b-instruct' | 'qwen-mt-plus' | 'qwen2-5-math-72b-instruct' | 'qwen2-5-7b-instruct' | 'qwq-plus' | 'glm-5.1' | 'MiniMax-M2.5' | 'deepseek-r1-distill-qwen-14b' | 'qwen2-5-math-7b-instruct' | 'qwen-omni-turbo-realtime' | 'qwen3-asr-flash' | 'qwen2-5-32b-instruct' | 'qwen-vl-plus' | 'kimi-k2-thinking' | 'qwen3.6-flash' | 'kimi-k2.6' | 'qwen3-coder-plus' | 'kimi/kimi-k2.5' | 'MiniMax/MiniMax-M2.7' | 'siliconflow/deepseek-v3.1-terminus' | 'siliconflow/deepseek-v3-0324' | 'siliconflow/deepseek-v3.2' | 'siliconflow/deepseek-r1-0528'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Coding Plan Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/coding-plan}
 */
export const createAlibabaCodingPlan = (apiKey: string, baseURL = 'https://coding-intl.dashscope.aliyuncs.com/v1') => merge(
  createChatProvider<'qwen3.7-max' | 'glm-4.7' | 'qwen3-coder-next' | 'qwen3.5-plus' | 'glm-5' | 'qwen3.7-plus' | 'kimi-k2.5' | 'qwen3.6-plus' | 'qwen3-max-2026-01-23' | 'MiniMax-M2.5' | 'qwen3-coder-plus' | 'qwen3.6-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Coding Plan (China) Provider
 * @see {@link https://help.aliyun.com/zh/model-studio/coding-plan}
 */
export const createAlibabaCodingPlanCn = (apiKey: string, baseURL = 'https://coding.dashscope.aliyuncs.com/v1') => merge(
  createChatProvider<'qwen3.7-max' | 'glm-4.7' | 'qwen3-coder-next' | 'qwen3.5-plus' | 'glm-5' | 'qwen3.7-plus' | 'kimi-k2.5' | 'qwen3.6-plus' | 'qwen3-max-2026-01-23' | 'MiniMax-M2.5' | 'qwen3-coder-plus' | 'qwen3.6-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Token Plan Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/token-plan-overview}
 */
export const createAlibabaTokenPlan = (apiKey: string, baseURL = 'https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1') => merge(
  createChatProvider<'kimi-k2.7-code' | 'qwen3.8-max-preview' | 'qwen3.7-max' | 'deepseek-v4-flash' | 'wan2.7-image' | 'deepseek-v4-pro-0813' | 'deepseek-v4-pro' | 'deepseek-v3.2' | 'glm-5' | 'happyhorse-1.1-i2v' | 'qwen3.8-max' | 'qwen3.7-plus' | 'happyhorse-1.1-r2v' | 'qwen3.8-flash' | 'kimi-k2.5' | 'glm-5.2' | 'qwen-image-2.0' | 'qwen3.6-plus' | 'glm-5.1' | 'qwen-image-2.0-pro' | 'wan2.7-image-pro' | 'MiniMax-M2.5' | 'deepseek-v4-flash-0731' | 'happyhorse-1.1-t2v' | 'qwen3.6-flash' | 'kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Token Plan (China) Provider
 * @see {@link https://www.alibabacloud.com/help/zh/model-studio/token-plan-overview}
 */
export const createAlibabaTokenPlanCn = (apiKey: string, baseURL = 'https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1') => merge(
  createChatProvider<'kimi-k2.7-code' | 'qwen3.8-max-preview' | 'qwen3.7-max' | 'deepseek-v4-flash' | 'wan2.7-image' | 'deepseek-v4-pro-0813' | 'deepseek-v4-pro' | 'deepseek-v3.2' | 'glm-5' | 'happyhorse-1.1-i2v' | 'qwen3.8-max' | 'qwen3.7-plus' | 'happyhorse-1.1-r2v' | 'qwen3.8-flash' | 'kimi-k2.5' | 'glm-5.2' | 'qwen-image-2.0' | 'qwen3.6-plus' | 'glm-5.1' | 'qwen-image-2.0-pro' | 'wan2.7-image-pro' | 'MiniMax-M2.5' | 'deepseek-v4-flash-0731' | 'happyhorse-1.1-t2v' | 'qwen3.6-flash' | 'kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Ambient Provider
 * @see {@link https://ambient.xyz}
 */
export const createAmbient = (apiKey: string, baseURL = 'https://api.ambient.xyz/v1') => merge(
  createChatProvider<'z-ai/glm-5.2' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-flash-0731' | 'moonshotai/kimi-k2.7-code' | 'moonshotai/kimi-k2.6' | 'ambient/large' | 'stepfun/step-3.7-flash' | 'xiaomi/mimo-v2.5' | 'zai-org/GLM-5.2-FP8' | 'zai-org/GLM-5.1-FP8'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a AMD Provider
 * @see {@link https://developer.amd.com.cn/radeon/tokenfactory}
 */
export const createAmd = (apiKey: string, baseURL = 'https://developer.amd.com.cn/radeon/api/v1') => merge(
  createChatProvider<'DeepSeek-V4-Flash' | 'Qwen3.8-Flash-Next'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a AnyAPI Provider
 * @see {@link https://docs.anyapi.ai}
 */
export const createAnyapi = (apiKey: string, baseURL = 'https://api.anyapi.ai/v1') => merge(
  createChatProvider<'deepseek/deepseek-r1' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-chat' | 'google/gemini-2.5-flash-lite' | 'google/gemini-2.5-flash' | 'google/gemini-3-pro-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-pro' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-opus-4-6' | 'cohere/command-r-plus-08-2024' | 'openai/gpt-5' | 'openai/gpt-5-mini' | 'openai/gpt-5.2' | 'openai/o3' | 'openai/gpt-4.1' | 'openai/o4-mini' | 'openai/gpt-5.4' | 'openai/o3-mini' | 'openai/gpt-4.1-mini' | 'openai/gpt-5.1' | 'xai/grok-4.3' | 'perplexity/sonar-reasoning-pro' | 'perplexity/sonar-pro' | 'mistralai/devstral-2512' | 'mistralai/mistral-large-2512'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Arcee Provider
 * @see {@link https://docs.arcee.ai}
 */
export const createArcee = (apiKey: string, baseURL = 'https://api.arcee.ai/api/v1') => merge(
  createChatProvider<'trinity-large-thinking' | 'deepseek/deepseek-v4-pro-0813' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v4-flash-latest' | 'moonshotai/kimi-k3' | 'zai-org/glm-5.2' | 'thinkingmachines/inkling-small'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Atomic Chat Provider
 * @see {@link https://atomic.chat}
 */
export const createAtomicChat = (apiKey: string, baseURL = 'http://127.0.0.1:1337/v1') => merge(
  createChatProvider<'Meta-Llama-3_1-8B-Instruct-GGUF' | 'Qwen3_5-9B-Q4_K_M' | 'gemma-4-E4B-it-IQ4_XS' | 'gemma-4-E4B-it-MLX-4bit' | 'Qwen3_5-9B-MLX-4bit'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Auriko Provider
 * @see {@link https://docs.auriko.ai}
 */
export const createAuriko = (apiKey: string, baseURL = 'https://api.auriko.ai/v1') => merge(
  createChatProvider<'minimax-m2-7' | 'claude-opus-4-7' | 'deepseek-v4-flash' | 'gemini-3.1-pro-preview' | 'deepseek-v4-pro' | 'claude-sonnet-4-6' | 'gemini-2.5-flash' | 'kimi-k2.5' | 'minimax-m2-7-highspeed' | 'glm-5.1' | 'qwen-3.6-plus' | 'claude-opus-4-6' | 'gemini-2.5-pro' | 'grok-4.3' | 'kimi-k2.6'>({ apiKey, baseURL }),
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
 * @see {@link https://docs.baseten.co/inference/model-apis/overview}
 */
export const createBaseten = (apiKey: string, baseURL = 'https://inference.baseten.co/v1') => merge(
  createChatProvider<'MiniMaxAI/MiniMax-M2.5' | 'nvidia/Nemotron-120B-A12B' | 'nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2.7-Code' | 'moonshotai/Kimi-K3' | 'moonshotai/Kimi-K2.6' | 'openai/gpt-oss-120b' | 'deepseek-ai/DeepSeek-V4-Pro' | 'deepseek-ai/DeepSeek-V4-Flash-0731' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V4-Pro-0813' | 'zai-org/GLM-5.3-Flash' | 'zai-org/GLM-5.1' | 'zai-org/GLM-5.3' | 'zai-org/GLM-5.2-Fast' | 'zai-org/GLM-5' | 'zai-org/GLM-4.7' | 'zai-org/GLM-5.2' | 'thinkingmachines/inkling-small' | 'thinkingmachines/inkling'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Berget.AI Provider
 * @see {@link https://api.berget.ai}
 */
export const createBerget = (apiKey: string, baseURL = 'https://api.berget.ai/v1') => merge(
  createChatProvider<'google/gemma-4-31B-it' | 'moonshotai/Kimi-K3' | 'moonshotai/Kimi-K2.6' | 'openai/gpt-oss-120b' | 'zai-org/GLM-4.7' | 'zai-org/GLM-5.2' | 'meta-llama/Llama-3.3-70B-Instruct' | 'mistralai/Mistral-Small-3.2-24B-Instruct-2506' | 'mistralai/Mistral-Medium-3.5-128B'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Blue Claw Provider
 * @see {@link https://blueclaw.network}
 */
export const createBlueclaw = (apiKey: string, baseURL = 'https://openai.blueclaw.network/v1') => merge(
  createChatProvider<'Qwen3.6-27B' | 'Qwen/Qwen3.6-35B-A3B-FP8'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cerebras Provider
 * @see {@link https://inference-docs.cerebras.ai/models/overview}
 */
export const createCerebras = (apiKey: string, baseURL = 'https://api.cerebras.ai/v1/') => merge(
  createChatProvider<'gpt-oss-120b' | 'gemma-4-31b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Chutes Provider
 * @see {@link https://llm.chutes.ai/v1/models}
 */
export const createChutes = (apiKey: string, baseURL = 'https://llm.chutes.ai/v1') => merge(
  createChatProvider<'Nemotron-3-Nano-Omni-30B-TEE' | 'google/gemma-4-31B-turbo-TEE' | 'moonshotai/Kimi-K2.6-TEE' | 'moonshotai/Kimi-K3-TEE' | 'unsloth/Mistral-Nemo-Instruct-2407-TEE' | 'deepseek-ai/DeepSeek-V4-Flash-0731-TEE' | 'deepseek-ai/DeepSeek-V3.2-TEE' | 'Qwen/Qwen3.6-27B-TEE' | 'Qwen/Qwen3.5-397B-A17B-TEE' | 'Qwen/Qwen3-235B-A22B-Thinking-2507-TEE' | 'Qwen/Qwen3-32B-TEE' | 'Qwen/Qwen3.8-27B-TEE' | 'zai-org/GLM-5.2-TEE' | 'zai-org/GLM-5.1-TEE'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Claudinio Provider
 * @see {@link https://claudin.io}
 */
export const createClaudinio = (apiKey: string, baseURL = 'https://api.claudin.io/v1') => merge(
  createChatProvider<'claudius' | 'claudinio'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a ClinePass Provider
 * @see {@link https://docs.cline.bot/getting-started/clinepass}
 */
export const createClinePass = (apiKey: string, baseURL = 'https://api.cline.bot/api/v1') => merge(
  createChatProvider<'cline-pass/kimi-k2.7-code' | 'cline-pass/qwen3.7-max' | 'cline-pass/kimi-k3' | 'cline-pass/deepseek-v4-flash' | 'cline-pass/mimo-v2.5' | 'cline-pass/deepseek-v4-pro' | 'cline-pass/minimax-m3' | 'cline-pass/qwen3.8-max' | 'cline-pass/qwen3.7-plus' | 'cline-pass/glm-5.3' | 'cline-pass/glm-5.2' | 'cline-pass/mimo-v2.5-pro' | 'cline-pass/kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a CloudFerro Sherlock Provider
 * @see {@link https://docs.sherlock.cloudferro.com/}
 */
export const createCloudferroSherlock = (apiKey: string, baseURL = 'https://api-sherlock.cloudferro.com/openai/v1/') => merge(
  createChatProvider<'MiniMaxAI/MiniMax-M2.5' | 'speakleash/Bielik-11B-v3.0-Instruct' | 'speakleash/Bielik-11B-v2.6-Instruct' | 'openai/gpt-oss-120b' | 'meta-llama/Llama-3.3-70B-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cohere Provider
 * @see {@link https://docs.cohere.com/docs/models}
 */
export const createCohere = (apiKey: string, baseURL = 'https://api.cohere.ai/compatibility/v1/') => merge(
  createChatProvider<'c4ai-aya-expanse-32b' | 'command-a-reasoning-08-2025' | 'c4ai-aya-vision-32b' | 'command-r-plus-08-2024' | 'command-a-translate-08-2025' | 'command-r7b-arabic-02-2025' | 'c4ai-aya-expanse-8b' | 'command-a-vision-07-2025' | 'command-a-plus-05-2026' | 'command-a-03-2025' | 'command-r7b-12-2024' | 'command-r-08-2024' | 'north-mini-code-1-0' | 'c4ai-aya-vision-8b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a CoralBricks Provider
 * @see {@link https://www.coralbricks.ai/docs}
 */
export const createCoralbricks = (apiKey: string, baseURL = 'https://inference.coralbricks.ai/v1') => merge(
  createChatProvider<'kimi-k3' | 'gpt-oss-120b' | 'glm-5.2-fp4'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cortecs Provider
 * @see {@link https://api.cortecs.ai/v1/models}
 */
export const createCortecs = (apiKey: string, baseURL = 'https://api.cortecs.ai/v1') => merge(
  createChatProvider<'claude-4-6-sonnet' | 'nova-pro-v1' | 'claude-opus4-8' | 'gpt-4o' | 'qwen2.5-vl-72b-instruct' | 'kimi-k2.7-code' | 'gemma-4-26b-a4b-it' | 'qwen3guard-gen-8b' | 'qwen3-coder-30b-a3b-instruct' | 'gpt-5-nano' | 'gpt-4o-mini' | 'kimi-k3' | 'claude-opus4-5' | 'qwen3guard-gen-0.6b' | 'glm-5v-turbo' | 'glm-4.7' | 'mistral-medium-2508' | 'qwen3-32b' | 'mistral-small-3.2-24b-instruct-2506' | 'gemini-3.5-flash-lite' | 'voxtral-small-2507' | 'gpt-5.6-sol' | 'llama-3.3-70b-instruct' | 'qwen3.5-397b-a17b' | 'llama-3.1-405b-instruct' | 'gpt-5' | 'ministral-8b-2512' | 'deepseek-v4-pro' | 'qwen3-coder-next' | 'claude-sonnet-5' | 'nova-2-lite' | 'mistral-nemo-instruct-2407' | 'deepseek-v3.2' | 'gpt-5-mini' | 'deepseek-r1-0528' | 'gpt-5.6-luna' | 'nova-micro-v1' | 'nvidia-nemotron-3-nano-omni' | 'gemma-4-31b-it' | 'glm-5' | 'minimax-m3' | 'cosmos3-super-reasoner' | 'apertus-70b' | 'minimax-m2.7' | 'claude-sonnet-4' | 'qwen3-30b-a3b-instruct-2507' | 'devstral-2512' | 'gpt-oss-120b' | 'gpt-4.1-nano' | 'mistral-7b-instruct-v0.3' | 'llama-3.1-8b-instruct' | 'mistral-small-2603' | 'hermes-4-70b' | 'gemini-3.5-flash' | 'glm-5-turbo' | 'gemini-3.1-flash-lite' | 'gemma-3-27b-it' | 'qwen3-vl-235b-a22b' | 'minicpm-v-4.5' | 'gemini-2.5-flash' | 'qwen3-next-80b-a3b-thinking' | 'glm-5.3' | 'hermes-4-405b' | 'mistral-large-2512' | 'kimi-k2.5' | 'qwen3.8-flash-next' | 'minimax-m2' | 'glm-5.2' | 'claude-opus4-6' | 'llama-3.1-nemotron-ultra-253b-v1' | 'gpt-4.1' | 'minimax-m2.5' | 'gemini-3.6-flash' | 'gpt-5.6-terra' | 'ministral-3b-2512' | 'claude-4-5-sonnet' | 'qwen3.6-35b-a3b' | 'qwen3-235b-a22b-instruct-2507' | 'qwen3.6-27b' | 'gpt-5.4' | 'qwen3.8-27b' | 'gpt-oss-safeguard-120b' | 'claude-opus4-7' | 'qwen3.5-9b' | 'nova-lite-v1' | 'ministral-14b-2512' | 'glm-5.1' | 'mixtral-8x7B-instruct-v0.1' | 'nemotron-nano-v2-12b' | 'claude-haiku-4-5' | 'codestral-2508' | 'qwen3.5-122b-a10b' | 'pixtral-12b-2409' | 'mistral-medium-3.5' | 'mistral-7b-instruct-v0.2' | 'claude-opus-5' | 'gemini-2.5-pro' | 'pixtral-large-2502' | 'mistral-large-2402' | 'mistral-small-2503' | 'nvidia-nemotron-3-nano-30b-a3b' | 'deepseek-v4-flash-0731' | 'gpt-4.1-mini' | 'glm-4.7-flash' | 'gpt-oss-20b' | 'minimax-m2.1' | 'gemini-3.7-flash' | 'kimi-k2.6' | 'glm-5.3-flash' | 'qwen3.8-2.4t-a95b' | 'gpt-5.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a CrofAI Provider
 * @see {@link https://crof.ai/docs}
 */
export const createCrof = (apiKey: string, baseURL = 'https://crof.ai/v1') => merge(
  createChatProvider<'kimi-k2.7-code' | 'kimi-k3' | 'deepseek-v4-flash' | 'greg-2-ultra' | 'qwen3.5-397b-a17b' | 'deepseek-v4-pro-0813' | 'deepseek-v4-pro' | 'deepseek-v3.2' | 'gemma-4-31b-it' | 'greg-2-super' | 'greg-rp' | 'greg-1-mini' | 'glm-5.2' | 'kimi-k3-eco' | 'qwen3.6-27b' | 'qwen3.8-27b' | 'qwen3.5-9b' | 'glm-5.1' | 'mimo-v2.5-pro' | 'deepseek-v4-flash-0731' | 'kimi-k2.6' | 'glm-5.3-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a CrossModel Provider
 * @see {@link https://www.crossmodel.ai/docs}
 */
export const createCrossmodel = (apiKey: string, baseURL = 'https://api.crossmodel.ai/v1') => merge(
  createChatProvider<'tencent/hy3' | 'z-ai/glm-4.7' | 'z-ai/glm-5' | 'z-ai/glm-5-turbo' | 'z-ai/glm-5.3' | 'z-ai/glm-5.2' | 'z-ai/glm-5.1' | 'z-ai/glm-5.3-flash' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v4-flash-vision-exp' | 'x-ai/grok-4.6' | 'x-ai/grok-4.5' | 'x-ai/grok-build-0.1' | 'x-ai/grok-4.3' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-opus-4-8' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-fable-5' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-opus-5' | 'openai/gpt-4o-mini' | 'openai/gpt-5.5-pro' | 'openai/gpt-5.6-sol' | 'openai/gpt-5.6-luna' | 'openai/gpt-5.4-mini' | 'openai/gpt-5.5' | 'openai/gpt-5.6-terra' | 'openai/gpt-5.4' | 'openai/gpt-5.4-nano' | 'qwen/qwen3.7-max' | 'qwen/qwen3.8-max' | 'qwen/qwen3.7-plus' | 'qwen/qwen3.7-flash' | 'qwen/qwen3.8-flash' | 'qwen/qwen3.6-plus' | 'qwen/qwen3.6-flash' | 'xiaomi/mimo-v2.5' | 'xiaomi/mimo-v2.5-pro' | 'moonshot/kimi-k2.7-code' | 'moonshot/kimi-k3' | 'moonshot/kimi-k2.5' | 'moonshot/kimi-k2.6' | 'gemini/gemini-3.5-flash-lite' | 'gemini/gemini-3.1-pro-preview' | 'gemini/gemini-2.5-flash-lite' | 'gemini/gemini-3.5-flash' | 'gemini/gemini-2.5-flash' | 'gemini/gemini-3.6-flash' | 'gemini/gemini-3-flash-preview' | 'gemini/gemini-2.5-pro' | 'gemini/gemini-3.7-flash' | 'minimax/minimax-m3' | 'minimax/minimax-m2.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Crusoe Provider
 * @see {@link https://docs.crusoecloud.com/managed-inference/overview}
 */
export const createCrusoe = (apiKey: string, baseURL = 'https://api.inference.crusoecloud.com/v1') => merge(
  createChatProvider<'nvidia/Nemotron-3-Nano-Omni-Reasoning-30B-A3B' | 'google/gemma-4-31b-it' | 'moonshotai/Kimi-K2.6' | 'zai/GLM-5.1' | 'zai/GLM-5.2' | 'openai/gpt-oss-120b' | 'deepseek-ai/DeepSeek-V3-0324' | 'meta-llama/Llama-3.3-70B-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a DaoXE Provider
 * @see {@link https://daoxe.com/pricing}
 */
export const createDaoxe = (apiKey: string, baseURL = 'https://daoxe.com/v1') => merge(
  createChatProvider<'claude-opus-4-8' | 'gemini-3.1-pro-preview' | 'grok-4.5' | 'claude-sonnet-4-6' | 'gpt-5.5' | 'kimi-k2.5' | 'claude-haiku-4-5-20251001' | 'gpt-5.4' | 'grok-4.3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Deep Infra Provider
 * @see {@link https://deepinfra.com/models}
 */
export const createDeepinfra = (apiKey: string, baseURL = 'https://api.deepinfra.com/v1/openai/') => merge(
  createChatProvider<'tencent/Hy3' | 'XiaomiMiMo/MiMo-V2.5' | 'XiaomiMiMo/MiMo-V2.5-Pro' | 'MiniMaxAI/MiniMax-M2.7' | 'MiniMaxAI/MiniMax-M3' | 'MiniMaxAI/MiniMax-M2.5' | 'nvidia/Llama-3.3-Nemotron-Super-49B-v1.5' | 'nvidia/Nemotron-3-Nano-30B-A3B' | 'nvidia/Nemotron-3-Nano-Omni-30B-A3B-Reasoning' | 'google/gemma-4-26B-A4B-it' | 'google/gemma-4-E4B-it' | 'google/gemma-4-31B-it' | 'ByteDance/Seed-2.0-code' | 'ByteDance/Seed-2.0-pro' | 'ByteDance/Seed-2.0-mini' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2.7-Code' | 'moonshotai/Kimi-K3' | 'moonshotai/Kimi-K2.6' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'deepseek-ai/DeepSeek-V4-Pro' | 'deepseek-ai/DeepSeek-V4-Flash-0731' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324' | 'deepseek-ai/DeepSeek-V4-Pro-0813' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/DeepSeek-V4-Flash' | 'stepfun-ai/Step-3.7-Flash' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen3.6-27B' | 'Qwen/Qwen3.5-9B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo' | 'Qwen/Qwen3.5-122B-A10B' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3.8-Max' | 'Qwen/Qwen3.7-Max' | 'Qwen/Qwen3.5-27B' | 'Qwen/Qwen3.5-35B-A3B' | 'Qwen/Qwen3-Max' | 'Qwen/Qwen3-30B-A3B' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3.6-35B-A3B' | 'Qwen/Qwen3.8-2.4T-A95B' | 'Qwen/Qwen3.8-27B' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'zai-org/GLM-5.3-Flash' | 'zai-org/GLM-5.1' | 'zai-org/GLM-5.3' | 'zai-org/GLM-4.6' | 'zai-org/GLM-5' | 'zai-org/GLM-4.7' | 'zai-org/GLM-5.2' | 'zai-org/GLM-4.7-Flash' | 'thinkingmachines/Inkling' | 'thinkingmachines/Inkling-Small' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'meta-llama/Llama-3.3-70B-Instruct-Turbo' | 'meta-llama/Llama-4-Scout-17B-16E-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a DeepSeek Provider
 * @see {@link https://api-docs.deepseek.com/quick_start/pricing}
 */
export const createDeepSeek = (apiKey: string, baseURL = 'https://api.deepseek.com') => merge(
  createChatProvider<'deepseek-v4-flash' | 'deepseek-v4-pro' | 'deepseek-v4-flash-vision-exp'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a DigitalOcean Provider
 * @see {@link https://docs.digitalocean.com/products/gradient-ai-platform/details/models/}
 */
export const createDigitalocean = (apiKey: string, baseURL = 'https://inference.do-ai.run/v1') => merge(
  createChatProvider<'openai-gpt-5.2-pro' | 'openai-gpt-5.6-luna' | 'gte-large-en-v1.5' | 'anthropic-claude-4.6-sonnet' | 'openai-o3' | 'anthropic-claude-opus-5' | 'nvidia-nemotron-3-super-120b' | 'kimi-k3' | 'openai-gpt-5.2' | 'openai-gpt-5.6-terra' | 'arcee-trinity-large-thinking' | 'qwen3-embedding-0.6b' | 'anthropic-claude-opus-4.5' | 'openai-gpt-5.4-pro' | 'deepseek-3.2' | 'anthropic-claude-opus-4.8' | 'wan2-2-t2v-a14b' | 'nemotron-nano-12b-v2-vl' | 'openai-gpt-image-2' | 'openai-gpt-4.1' | 'mistral-3-14B' | 'qwen3.5-397b-a17b' | 'nemotron-3-nano-30b' | 'bge-m3' | 'deepseek-4-flash' | 'openai-gpt-4o' | 'openai-gpt-5' | 'deepseek-v4-pro-0813' | 'nemotron-3-ultra-550b' | 'deepseek-v4-pro' | 'deepseek-v3' | 'mistral-nemo-instruct-2407' | 'openai-gpt-5.5' | 'anthropic-claude-4.5-sonnet' | 'stable-diffusion-3.5-large' | 'anthropic-claude-sonnet-4' | 'qwen3-coder-flash' | 'glm-5' | 'all-mini-lm-l6-v2' | 'qwen3.8-max' | 'anthropic-claude-3.5-haiku' | 'alibaba-qwen3-32b' | 'mistral-7b-instruct-v0.3' | 'openai-gpt-5.4' | 'anthropic-claude-opus-4.7' | 'llama-4-maverick' | 'openai-gpt-5.4-mini' | 'ministral-3-8b-instruct-2512' | 'anthropic-claude-4.1-opus' | 'llama3.3-70b-instruct' | 'openai-o1' | 'openai-o3-mini' | 'kimi-k2.5' | 'openai-gpt-5-mini' | 'glm-5.2' | 'qwen3-tts-voicedesign' | 'anthropic-claude-fable-5' | 'deepseek-r1-distill-llama-70b' | 'anthropic-claude-5-sonnet' | 'openai-gpt-5.3-codex' | 'minimax-m2.5' | 'anthropic-claude-opus-4.6' | 'anthropic-claude-haiku-4.5' | 'anthropic-claude-4.5-haiku' | 'multi-qa-mpnet-base-dot-v1' | 'nemotron-3-nano-omni' | 'openai-gpt-4o-mini' | 'anthropic-claude-3.5-sonnet' | 'anthropic-claude-3.7-sonnet' | 'glm-5.1' | 'llama3-8b-instruct' | 'anthropic-claude-3-opus' | 'openai-gpt-image-1.5' | 'openai-gpt-oss-120b' | 'mimo-v2.5-pro' | 'openai-gpt-5.1-codex-max' | 'qwen-2.5-14b-instruct' | 'openai-gpt-5-nano' | 'bge-reranker-v2-m3' | 'openai-gpt-5.4-nano' | 'e5-large-v2' | 'gemma-4-31B-it' | 'deepseek-v4-flash-0731' | 'openai-gpt-5.6-sol' | 'openai-gpt-oss-20b' | 'anthropic-claude-opus-4' | 'openai-gpt-image-1' | 'kimi-k2.6' | 'glm-5.3-flash' | 'fal-ai/fast-sdxl' | 'fal-ai/elevenlabs/tts/multilingual-v2' | 'fal-ai/stable-audio-25/text-to-audio' | 'fal-ai/flux/schnell'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a DInference Provider
 * @see {@link https://dinference.com}
 */
export const createDinference = (apiKey: string, baseURL = 'https://api.dinference.com/v1') => merge(
  createChatProvider<'glm-4.7' | 'glm-5' | 'gpt-oss-120b' | 'glm-5.2' | 'minimax-m2.5' | 'glm-5.1'>({ apiKey, baseURL }),
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
 * Create a EBCloud Provider
 * @see {@link https://docs.ebtech.com/ai/model-api.html}
 */
export const createEbcloud = (apiKey: string, baseURL = 'https://maas-api.ebcloud.com/v1') => merge(
  createChatProvider<'DeepSeek-V4-Pro' | 'GLM-5.1' | 'Kimi-K2.6' | 'DeepSeek-V4-Flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Echo Provider
 * @see {@link https://echo.tracerml.ai/docs/api}
 */
export const createEcho = (apiKey: string, baseURL = 'https://echo.tracerml.ai/v1') => merge(
  createChatProvider<'echo'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Eden AI Provider
 * @see {@link https://docs.edenai.co}
 */
export const createEdenai = (apiKey: string, baseURL = 'https://api.edenai.run/v3') => merge(
  createChatProvider<'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-chat' | 'deepseek/deepseek-v4-flash-vision-exp' | 'google/gemini-3-pro-image' | 'google/gemini-3-pro-image-preview' | 'google/gemini-3.5-flash-lite' | 'google/gemini-3.1-flash-lite-image' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3.1-pro-preview-customtools' | 'google/gemini-flash-latest' | 'google/gemini-3.5-flash' | 'google/gemini-3.1-flash-lite' | 'google/gemini-3.6-flash' | 'google/gemini-3.1-flash-image' | 'google/gemini-pro-latest' | 'google/gemini-3.1-flash-image-preview' | 'google/gemini-3.1-flash-lite-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-flash-image' | 'google/gemini-3.7-flash' | 'deepinfra/nemotron-3-ultra-550b-a55b' | 'deepinfra/tencent/Hy3' | 'deepinfra/nvidia/Nemotron-3-Nano-30B-A3B' | 'deepinfra/nvidia/Llama-3.1-Nemotron-70B-Instruct' | 'deepinfra/ByteDance/Seed-2.0-code' | 'deepinfra/ByteDance/Seed-2.0-mini' | 'deepinfra/moonshotai/Kimi-K2.5' | 'deepinfra/openai/gpt-oss-120b' | 'deepinfra/openai/gpt-oss-20b' | 'deepinfra/deepseek-ai/DeepSeek-V4-Flash-0731' | 'deepinfra/deepseek-ai/DeepSeek-R1' | 'deepinfra/deepseek-ai/DeepSeek-V3-0324' | 'deepinfra/deepseek-ai/DeepSeek-V4-Pro-0813' | 'deepinfra/deepseek-ai/DeepSeek-V3' | 'deepinfra/stepfun-ai/Step-3.5-Flash' | 'deepinfra/stepfun-ai/Step-3.7-Flash' | 'deepinfra/zai-org/GLM-4.7-Flash' | 'deepinfra/thinkingmachines/Inkling' | 'deepinfra/thinkingmachines/Inkling-Small' | 'deepinfra/meta-llama/Llama-Guard-3-8B' | 'deepinfra/meta-llama/Llama-3.2-11B-Vision-Instruct' | 'deepinfra/meta-llama/Llama-3.3-70B-Instruct' | 'deepinfra/meta-models/Muse-Glimmer-30B' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-opus-4-8' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-opus-latest' | 'anthropic/claude-opus-4-5' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-sonnet-latest' | 'anthropic/claude-fable-latest' | 'anthropic/claude-opus-4-5-20251101' | 'anthropic/claude-fable-5' | 'anthropic/claude-opus-4-6' | 'anthropic/claude-opus-5' | 'cohere/command-r-plus-08-2024' | 'cohere/command-a-03-2025' | 'cohere/command-r7b-12-2024' | 'cohere/command-r-08-2024' | 'zai/glm-4.6' | 'zai/glm-5v-turbo' | 'zai/glm-4.7' | 'zai/glm-5' | 'zai/glm-5-turbo' | 'zai/glm-5.3' | 'zai/glm-5.2' | 'zai/glm-4.6v' | 'zai/glm-5.1' | 'zai/glm-5.3-flash' | 'databricks/databricks-gpt-oss-120b@eu' | 'databricks/databricks-gpt-oss-20b' | 'databricks/databricks-gpt-oss-120b' | 'databricks/databricks-gpt-oss-20b@eu' | 'together_ai/openai/gpt-oss-120b' | 'together_ai/openai/gpt-oss-20b' | 'together_ai/deepseek-ai/DeepSeek-V4-Flash-0731' | 'together_ai/deepseek-ai/DeepSeek-V4-Pro-0813' | 'together_ai/thinkingmachines/Inkling' | 'together_ai/thinkingmachines/Inkling-Small' | 'together_ai/meta-models/Muse-Glimmer-30B' | 'openai/gpt-4o' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/gpt-3.5-turbo' | 'openai/o1-pro' | 'openai/gpt-5.5-pro' | 'openai/gpt-4-turbo' | 'openai/gpt-4' | 'openai/gpt-5.6-sol' | 'openai/o3-pro' | 'openai/gpt-5.4-pro' | 'openai/gpt-5' | 'openai/gpt-5-mini' | 'openai/gpt-5.6-luna' | 'openai/gpt-5.3-codex' | 'openai/gpt-4.1-nano' | 'openai/o1' | 'openai/gpt-5.2' | 'openai/gpt-5.4-mini' | 'openai/o3' | 'openai/gpt-5-pro' | 'openai/gpt-5.5' | 'openai/gpt-latest' | 'openai/gpt-4.1' | 'openai/gpt-4o-2024-08-06' | 'openai/gpt-mini-latest' | 'openai/gpt-5.6-terra' | 'openai/o4-mini' | 'openai/gpt-5.4' | 'openai/o3-mini' | 'openai/gpt-4o-2024-11-20' | 'openai/gpt-pro-latest' | 'openai/gpt-5.2-pro' | 'openai/gpt-4.1-mini' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'xai/grok-4.6' | 'xai/grok-4.5' | 'xai/grok-4.20-0309-non-reasoning' | 'xai/grok-latest' | 'xai/grok-4.20-0309-reasoning' | 'xai/grok-build-0.1' | 'xai/grok-4.3' | 'nebius/nvidia/nemotron-3-super-120b-a12b' | 'nebius/nvidia/Nemotron-3-Ultra-550b-a55b' | 'nebius/openai/gpt-oss-120b' | 'nebius/deepseek-ai/DeepSeek-V4-Flash-0731' | 'nebius/meta-llama/Llama-3.3-70B-Instruct' | 'vertex/gemini-3-pro-image' | 'vertex/gemini-3.5-flash-lite' | 'vertex/gemini-3.1-flash-lite@eu' | 'vertex/gemini-3.1-flash-lite-image' | 'vertex/gemini-3.1-pro-preview' | 'vertex/gemini-3.7-flash@us' | 'vertex/gemini-3.5-flash@eu' | 'vertex/gemini-flash-latest' | 'vertex/gemini-3.5-flash' | 'vertex/gemini-3.1-flash-lite' | 'vertex/gemini-3.6-flash@eu' | 'vertex/gemini-3.1-flash-lite@us' | 'vertex/gemini-3.6-flash' | 'vertex/gemini-3.1-flash-image' | 'vertex/gemini-pro-latest' | 'vertex/gemini-3.5-flash@us' | 'vertex/gemini-3.5-flash-lite@us' | 'vertex/gemini-3.6-flash@us' | 'vertex/gemini-3.7-flash@eu' | 'vertex/gemini-3-flash-preview' | 'vertex/gemini-3.5-flash-lite@eu' | 'vertex/gemini-2.5-flash-image' | 'vertex/gemini-3.7-flash' | 'ovhcloud/gpt-oss-120b' | 'ovhcloud/gpt-oss-20b' | 'qwen/qwen3-coder-30b-a3b-instruct' | 'qwen/qwen-vl-max' | 'qwen/qwen-max' | 'qwen/qwen3-vl-235b-a22b-thinking' | 'qwen/deepseek-v4-pro-0813' | 'qwen/qwen3-coder-next' | 'qwen/qwen3-coder-flash' | 'qwen/qwen3-coder-next@eu' | 'qwen/qwen3.8-max' | 'qwen/qwen3-max@eu' | 'qwen/qwen3.8-flash' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-max' | 'qwen/qwen3-235b-a22b-instruct-2507' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3.8-27b' | 'qwen/qwq-plus' | 'qwen/qwen3-coder-plus' | 'qwen/deepseek-v4-flash-0731' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'qwen/qwen-vl-plus' | 'qwen/qwen3.8-2.4t-a95b' | 'moonshot/kimi-k2.7-code' | 'moonshot/kimi-k3' | 'moonshot/kimi-k2.6' | 'azure/gpt-5.1-codex-mini' | 'azure/gpt-5.2-codex' | 'azure/gpt-5.1-codex-max' | 'azure/gpt-5.1-codex' | 'ionos/openai/gpt-oss-120b' | 'ionos/meta-llama/Llama-3.3-70B-Instruct' | 'scaleway/llama-3.3-70b-instruct' | 'scaleway/gpt-oss-120b' | 'scaleway/deepseek-v4-flash-0731' | 'mistral/mistral-small-latest' | 'mistral/mistral-large-latest' | 'mistral/devstral-2512' | 'mistral/mistral-small-2603' | 'mistral/mistral-large-2512' | 'mistral/mistral-medium-2604' | 'mistral/mistral-medium-2505' | 'mistral/devstral-medium-latest' | 'mistral/voxtral-small-latest' | 'mistral/codestral-latest' | 'mistral/magistral-medium-latest' | 'mistral/mistral-medium-latest' | 'amazon/moonshot.kimi-k2-thinking' | 'amazon/zai.glm-4.7-flash@us' | 'amazon/moonshotai.kimi-k2.5' | 'amazon/zai.glm-4.7-flash' | 'cerebras/gpt-oss-120b' | 'cloudflare/@cf/aisingapore/gemma-sea-lion-v4-27b-it' | 'cloudflare/@cf/meta/llama-guard-3-8b' | 'cloudflare/@cf/openai/gpt-oss-120b' | 'cloudflare/@cf/openai/gpt-oss-20b' | 'cloudflare/@cf/deepseek-ai/deepseek-v4-pro-0813' | 'cloudflare/@cf/deepseek-ai/deepseek-v4-flash-0731' | 'cloudflare/@cf/qwen/qwen2.5-coder-32b-instruct' | 'cloudflare/@cf/zai-org/glm-4.7-flash' | 'fireworks_ai/gpt-oss-120b' | 'fireworks_ai/accounts/fireworks/models/deepseek-v4-pro-0813' | 'fireworks_ai/accounts/fireworks/models/muse-glimmer-30b' | 'fireworks_ai/accounts/fireworks/models/gpt-oss-120b' | 'fireworks_ai/accounts/fireworks/models/deepseek-v4-flash-0731' | 'perplexityai/sonar-deep-research' | 'perplexityai/sonar' | 'perplexityai/sonar-reasoning-pro' | 'perplexityai/sonar-pro' | 'groq/openai/gpt-oss-120b' | 'groq/openai/gpt-oss-20b' | 'tensorx/deepseek/deepseek-v4-pro-0813' | 'tensorx/deepseek/deepseek-v4-flash-0731' | 'tensorx/moonshotai/kimi-k2.5' | 'flexai/Muse-Glimmer-30B' | 'flexai/gpt-oss-120b' | 'flexai/Nemotron-3-Super-120B-A12B' | 'flexai/deepseek-v4-flash-0731' | 'flexai/gpt-oss-20b' | 'minimax/MiniMax-M2.7' | 'minimax/MiniMax-M2.1' | 'minimax/MiniMax-M2' | 'minimax/MiniMax-M3' | 'minimax/MiniMax-M2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a EmpirioLabs AI Provider
 * @see {@link https://docs.empiriolabs.ai}
 */
export const createEmpiriolabs = (apiKey: string, baseURL = 'https://api.empiriolabs.ai/v1') => merge(
  createChatProvider<'minimax-m2-7' | 'qwen3-8-max' | 'qwen3-5-35b-a3b' | 'glm-4-5-flash' | 'kimi-k3' | 'step-3-5-flash' | 'deepseek-v4-flash' | 'glm-4-7-flash' | 'qwen3-8-27b' | 'qwen3-6-flash' | 'fugu-ultra-v1-0' | 'deepseek-v4-pro-0813' | 'deepseek-v4-pro' | 'glm-5-2' | 'glm-4-6v-flash' | 'qwen3-5-27b' | 'qwen3-7-flash' | 'mistral-small-4' | 'minimax-m3' | 'qwen3-7-max' | 'kimi-k2-7-code' | 'qwen3-5-9b' | 'fugu-ultra-v1-1' | 'muse-glimmer-30b' | 'glm-5-3' | 'qwen3-6-27b' | 'step-3-7-flash' | 'seed-2-0-pro' | 'qwen3-5-122b-a10b' | 'kimi-k2-7-code-highspeed' | 'qwen3-6-max-preview' | 'muse-spark-1-2' | 'qwen3-5-397b-a17b' | 'qwen3-5-flash' | 'qwen3-max' | 'qwen3-5-4b' | 'deepseek-v3-2' | 'step-3-5-flash-2603' | 'glm-5-1' | 'seed-2-0-code' | 'qwen3-7-plus' | 'kimi-k2-6' | 'mistral-medium-3' | 'qwen3-5-plus' | 'gemma-4-26b-a4b' | 'seed-2-0-lite' | 'minimax-m2-7-highspeed' | 'muse-spark-1-1' | 'qwen3-6-plus' | 'glm-5-3-flash' | 'mimo-v2-5-pro' | 'mimo-v2-5' | 'deepseek-v4-flash-0731' | 'qwen3-8-flash' | 'seed-2-0-mini' | 'seed-2-1-turbo' | 'qwen3-6-35b-a3b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a evroc Provider
 * @see {@link https://docs.evroc.com/products/think/overview.html}
 */
export const createEvroc = (apiKey: string, baseURL = 'https://models.think.evroc.com/v1') => merge(
  createChatProvider<'nvidia/Llama-3.3-70B-Instruct-FP8' | 'KBLab/kb-whisper-large' | 'google/gemma-4-26B-A4B-it' | 'intfloat/multilingual-e5-large-instruct' | 'moonshotai/Kimi-K2.6' | 'openai/whisper-large-v3' | 'openai/gpt-oss-120b' | 'openai/whisper-large-v3-turbo' | 'Qwen/Qwen3-Reranker-4B' | 'Qwen/Qwen3.6-35B-A3B' | 'Qwen/Qwen3-Embedding-8B' | 'Qwen/Qwen3.8-27B' | 'zai-org/GLM-5.2' | 'evroc/roc' | 'mistralai/Voxtral-Small-24B-2507' | 'mistralai/Mistral-Medium-3.5-128B'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a FastRouter Provider
 * @see {@link https://fastrouter.ai/models}
 */
export const createFastrouter = (apiKey: string, baseURL = 'https://go.fastrouter.ai/api/v1') => merge(
  createChatProvider<'z-ai/glm-5' | 'z-ai/glm-5.1' | 'deepseek/deepseek-v4-pro' | 'google/imagen-4.0-fast' | 'google/gemini-3-pro-image-preview' | 'google/gemini-3.1-pro-preview' | 'google/gemma-4-31b-it' | 'google/veo3.1-lite' | 'google/veo3.1-fast' | 'google/gemini-3.5-flash' | 'google/gemini-2.5-flash' | 'google/gemini-3.1-flash-image-preview' | 'google/gemini-2.5-pro' | 'google/veo3.1' | 'google/imagen-4.0-ultra' | 'leonardo-ai/lucid-realism' | 'leonardo-ai/lucid-origin' | 'x-ai/grok-4' | 'x-ai/grok-build-0.1' | 'x-ai/grok-4.3' | 'moonshotai/kimi-k2' | 'moonshotai/kimi-k2.6' | 'anthropic/claude-opus-4.8' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-sonnet-4' | 'bytedance/seedance-2' | 'openai/gpt-5-nano' | 'openai/gpt-realtime-1.5' | 'openai/gpt-5.5-pro' | 'openai/gpt-5' | 'openai/gpt-5-mini' | 'openai/gpt-5.3-codex' | 'openai/gpt-oss-120b' | 'openai/gpt-5.4-mini' | 'openai/gpt-5.5' | 'openai/gpt-4.1' | 'openai/gpt-image-2' | 'openai/gpt-oss-20b' | 'openai/gpt-5.4-nano' | 'deepseek-ai/deepseek-r1-distill-llama-70b' | 'sarvam/sarvam-105b' | 'sarvam/sarvam-30b' | 'qwen/qwen3-coder' | 'wanx/wan-v2-6' | 'minimax/minimax-m2.7-highspeed' | 'minimax/minimax-m2.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Fireworks AI Provider
 * @see {@link https://fireworks.ai/docs/}
 */
export const createFireworks = (apiKey: string, baseURL = 'https://api.fireworks.ai/inference/v1/') => merge(
  createChatProvider<'accounts/fireworks/routers/kimi-k3-fast' | 'accounts/fireworks/routers/glm-5p2-fast' | 'accounts/fireworks/models/kimi-k3' | 'accounts/fireworks/models/qwen3p8-max' | 'accounts/fireworks/models/nemotron-3-ultra-nvfp4' | 'accounts/fireworks/models/deepseek-v4-pro-0813' | 'accounts/fireworks/models/nemotron-lightning-3p5-30b-a3b' | 'accounts/fireworks/models/minimax-m3' | 'accounts/fireworks/models/muse-glimmer-30b' | 'accounts/fireworks/models/gpt-oss-120b' | 'accounts/fireworks/models/kimi-k2p7-code' | 'accounts/fireworks/models/inkling' | 'accounts/fireworks/models/glm-5p2' | 'accounts/fireworks/models/qwen3p7-plus' | 'accounts/fireworks/models/glm-5p3' | 'accounts/fireworks/models/kimi-k2p6' | 'accounts/fireworks/models/deepseek-v4-flash-0731'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a FreeModel Provider
 * @see {@link https://freemodel.dev}
 */
export const createFreemodel = (apiKey: string, baseURL = 'https://cc.freemodel.dev/v1') => merge(
  createChatProvider<'claude-opus-4-7' | 'claude-opus-4-8' | 'gpt-5.3-codex' | 'gpt-5.4-mini' | 'claude-sonnet-4-6' | 'gpt-5.5' | 'claude-haiku-4-5-20251001' | 'gpt-5.4' | 'claude-fable-5' | 'claude-opus-4-6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Friendli Provider
 * @see {@link https://friendli.ai/docs/guides/serverless_endpoints/introduction}
 */
export const createFriendli = (apiKey: string, baseURL = 'https://api.friendli.ai/serverless/v1') => merge(
  createChatProvider<'MiniMaxAI/MiniMax-M2.5' | 'google/gemma-4-31B-it' | 'deepseek-ai/DeepSeek-V3.2' | 'zai-org/GLM-5.1' | 'zai-org/GLM-5.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a FrogBot Provider
 * @see {@link https://docs.frogbot.ai}
 */
export const createFrogbot = (apiKey: string, baseURL = 'https://app.frogbot.ai/api/v1') => merge(
  createChatProvider<'minimax-m2-5' | 'minimax-m2-7' | 'claude-opus-4-7' | 'gpt-4o' | 'grok-4-3' | 'deepseek-v4-pro' | 'grok-code-fast-1' | 'grok-4-1-fast-reasoning' | 'gpt-5-5' | 'gpt-oss-120b' | 'claude-sonnet-4-6' | 'gemini-2.5-flash' | 'gpt-5-3-codex' | 'grok-4-1-fast-non-reasoning' | 'kimi-k2.5' | 'gemini-3-1-pro-preview' | 'kimi-k2-6' | 'claude-haiku-4-5' | 'gemini-3-flash-preview' | 'claude-opus-4-6' | 'gemini-2.5-pro' | 'zai-glm-5-1' | 'gpt-5-4-nano' | 'gpt-5-4-mini' | 'gpt-oss-20b' | 'qwen-3-6-plus'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a GitHub Copilot Provider
 * @see {@link https://docs.github.com/en/copilot}
 */
export const createGithubCopilot = (apiKey: string, baseURL = 'https://api.githubcopilot.com') => merge(
  createChatProvider<'kimi-k2.7-code' | 'claude-opus-4.8' | 'kimi-k3' | 'mai-code-1-flash-picker' | 'gpt-5.6-sol' | 'grok-4.6' | 'claude-sonnet-4.6' | 'gemini-3.1-pro-preview' | 'grok-4.5' | 'claude-sonnet-5' | 'claude-haiku-4.5' | 'gpt-5-mini' | 'gpt-5.6-luna' | 'claude-opus-4.7' | 'claude-opus-4.5' | 'gpt-5.3-codex' | 'claude-sonnet-4' | 'gpt-5.2' | 'gemini-3.5-flash' | 'gpt-5.4-mini' | 'gpt-5.5' | 'claude-opus-4.6' | 'gpt-5.2-codex' | 'gpt-4.1' | 'gemini-3.6-flash' | 'gpt-5.6-terra' | 'gpt-5.4' | 'claude-sonnet-4.5' | 'claude-fable-5' | 'claude-opus-5' | 'mai-code-1.1-flash' | 'gemini-3.7-flash' | 'gpt-5.4-nano'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a GMI Cloud Provider
 * @see {@link https://docs.gmicloud.ai/inference-engine/api-reference/llm-api-reference}
 */
export const createGmicloud = (apiKey: string, baseURL = 'https://api.gmi-serving.com/v1') => merge(
  createChatProvider<'MiniMaxAI/MiniMax-M2.7' | 'MiniMaxAI/MiniMax-M3' | 'moonshotai/Kimi-K2.6' | 'moonshotai/kimi-k2.7-code-highspeed' | 'anthropic/claude-opus-4.8' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-opus-4.7' | 'anthropic/claude-opus-4.6' | 'openai/gpt-5.5' | 'deepseek-ai/DeepSeek-V4-Pro' | 'deepseek-ai/DeepSeek-V4-Flash' | 'Qwen/Qwen3.7-Max' | 'zai-org/GLM-5.2-FP8' | 'zai-org/GLM-5-FP8' | 'zai-org/GLM-5.1-FP8'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Google Provider
 * @see {@link https://ai.google.dev/gemini-api/docs/models}
 */
export const createGoogleGenerativeAI = (apiKey: string, baseURL = 'https://generativelanguage.googleapis.com/v1beta/openai/') => merge(
  createChatProvider<'gemini-3.1-flash-tts-preview' | 'gemma-4-26b-a4b-it' | 'gemini-3-pro-image' | 'gemini-3-pro-image-preview' | 'gemini-flash-lite-latest' | 'gemini-3.5-flash-lite' | 'gemini-3.1-flash-lite-image' | 'gemini-3.1-pro-preview' | 'gemini-3.1-pro-preview-customtools' | 'deep-research-preview-04-2026' | 'gemini-2.5-flash-lite' | 'gemini-robotics-er-1.6-preview' | 'gemma-4-31b-it' | 'gemini-2.5-computer-use-preview-10-2025' | 'lyria-3-clip-preview' | 'veo-3.1-fast-generate-preview' | 'gemini-embedding-001' | 'gemini-2.5-pro-preview-tts' | 'gemini-flash-latest' | 'gemini-3.5-flash' | 'gemini-3.5-live-translate-preview' | 'veo-3.1-lite-generate-preview' | 'gemini-omni-flash-preview' | 'gemini-3.1-flash-lite' | 'gemini-2.5-flash' | 'gemini-2.5-flash-preview-tts' | 'veo-3.1-generate-preview' | 'gemini-embedding-2' | 'gemini-3.6-flash' | 'gemini-3.1-flash-image' | 'gemini-3.1-flash-image-preview' | 'lyria-3-pro-preview' | 'gemini-3.1-flash-lite-preview' | 'gemini-3-flash-preview' | 'gemini-2.5-flash-image' | 'gemini-2.5-pro' | 'deep-research-max-preview-04-2026' | 'gemini-3.1-flash-live-preview' | 'gemini-3.7-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a GreenPT Provider
 * @see {@link https://docs.greenpt.ai}
 */
export const createGreenpt = (apiKey: string, baseURL = 'https://api.greenpt.ai/v1') => merge(
  createChatProvider<'green-r-raw' | 'kimi-k2.7-code' | 'qwen3-coder-30b-a3b-instruct' | 'kimi-k3' | 'mistral-small-3.2-24b-instruct-2506' | 'glm-5.2-ponytail-lite' | 'glm-5.2-ponytail-ultra' | 'llama-3.3-70b-instruct' | 'qwen3.5-397b-a17b' | 'holo2-30b-a3b' | 'green-s' | 'devstral-2-123b-instruct-2512' | 'green-l-raw' | 'glm-5.2-caveman-ultra' | 'gpt-oss-120b' | 'glm-5.2-caveman-lite' | 'green-s-pro' | 'green-r' | 'glm-5.2-caveman' | 'gemma-3-27b-it' | 'glm-5.2' | 'mistral-medium-3.5-128b' | 'gemma4' | 'voxtral-small-24b-2507' | 'minimax-m2.5' | 'qwen3.6-35b-a3b' | 'qwen3-235b-a22b-instruct-2507' | 'glm-5.2-honey-lite' | 'green-l' | 'kimi-k2.6-fast' | 'glm-5.2-ponytail' | 'glm-5.2-honey-ultra' | 'glm-5.1' | 'glm-5.2-honey' | 'pixtral-12b-2409' | 'deepseek-v4-flash-0731' | 'kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Groq Provider
 * @see {@link https://console.groq.com/docs/models}
 */
export const createGroq = (apiKey: string, baseURL = 'https://api.groq.com/openai/v1/') => merge(
  createChatProvider<'whisper-large-v3' | 'llama-3.3-70b-versatile' | 'allam-2-7b' | 'llama-3.1-8b-instant' | 'whisper-large-v3-turbo' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-safeguard-20b' | 'openai/gpt-oss-20b' | 'qwen/qwen3.6-27b' | 'meta-llama/llama-prompt-guard-2-86m' | 'meta-llama/llama-prompt-guard-2-22m' | 'groq/compound-mini' | 'groq/compound' | 'canopylabs/orpheus-arabic-saudi' | 'canopylabs/orpheus-v1-english'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Helicone Provider
 * @see {@link https://helicone.ai/models}
 */
export const createHelicone = (apiKey: string, baseURL = 'https://ai-gateway.helicone.ai/v1') => merge(
  createChatProvider<'qwen3-235b-a22b-thinking' | 'deepseek-v3.1-terminus' | 'glm-4.6' | 'grok-4-fast-reasoning' | 'gpt-4o' | 'chatgpt-4o-latest' | 'qwen3-coder-30b-a3b-instruct' | 'llama-3.1-8b-instruct-turbo' | 'claude-opus-4-1-20250805' | 'gpt-5-nano' | 'gpt-4o-mini' | 'grok-3' | 'qwen3-32b' | 'llama-prompt-guard-2-86m' | 'claude-3.5-sonnet-v2' | 'sonar-deep-research' | 'qwen2.5-coder-7b-fast' | 'llama-prompt-guard-2-22m' | 'gpt-5-chat-latest' | 'o3-pro' | 'sonar-reasoning' | 'llama-3.3-70b-instruct' | 'sonar' | 'qwen3-30b-a3b' | 'gpt-5' | 'claude-opus-4-1' | 'deepseek-v3' | 'deepseek-v3.2' | 'kimi-k2-0711' | 'gpt-5.1-codex-mini' | 'gemini-2.5-flash-lite' | 'gpt-5-codex' | 'grok-code-fast-1' | 'grok-4-1-fast-reasoning' | 'gpt-5-mini' | 'mistral-large-2411' | 'claude-3.7-sonnet' | 'mistral-nemo' | 'grok-3-mini' | 'hermes-2-pro-llama-3-8b' | 'claude-sonnet-4-5-20250929' | 'claude-sonnet-4' | 'llama-guard-4' | 'gpt-oss-120b' | 'o1-mini' | 'gpt-4.1-nano' | 'llama-3.1-8b-instruct' | 'o1' | 'llama-4-maverick' | 'o3' | 'qwen3-coder' | 'gemma2-9b-it' | 'grok-4' | 'gpt-5-pro' | 'sonar-reasoning-pro' | 'claude-4.5-opus' | 'gemini-2.5-flash' | 'gemma-3-12b-it' | 'gemini-3-pro-preview' | 'grok-4-1-fast-non-reasoning' | 'llama-3.3-70b-versatile' | 'claude-haiku-4-5-20251001' | 'sonar-pro' | 'llama-4-scout' | 'gpt-4.1-mini-2025-04-14' | 'claude-opus-4' | 'claude-4.5-haiku' | 'deepseek-r1-distill-llama-70b' | 'gpt-4.1' | 'deepseek-reasoner' | 'o4-mini' | 'qwen3-next-80b-a3b-instruct' | 'o3-mini' | 'kimi-k2-0905' | 'grok-4-fast-non-reasoning' | 'gpt-5.1-chat-latest' | 'llama-3.1-8b-instant' | 'claude-3.5-haiku' | 'claude-3-haiku-20240307' | 'gpt-5.1-codex' | 'gemini-2.5-pro' | 'deepseek-tng-r1t2-chimera' | 'claude-4.5-sonnet' | 'qwen3-vl-235b-a22b-instruct' | 'gpt-4.1-mini' | 'gpt-oss-20b' | 'kimi-k2-thinking' | 'mistral-small' | 'ernie-4.5-21b-a3b-thinking' | 'gpt-5.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Hetzner Provider
 * @see {@link https://experiments.hetzner.com/docs/inference}
 */
export const createHetzner = (apiKey: string, baseURL = 'https://inference.hetzner.com/api/v1') => merge(
  createChatProvider<'Qwen3.8-27B' | 'Qwen/Qwen3.6-35B-A3B-FP8'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a HPC-AI Provider
 * @see {@link https://www.hpc-ai.com/doc/docs/quickstart/}
 */
export const createHpcAi = (apiKey: string, baseURL = 'https://api.hpc-ai.com/inference/v1') => merge(
  createChatProvider<'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro' | 'moonshotai/kimi-k2.7-code' | 'moonshotai/kimi-k2.5' | 'anthropic/claude-opus-4.7' | 'openai/gpt-5.5' | 'zai-org/glm-5.2' | 'zai-org/glm-5.1' | 'minimax/minimax-m2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Hugging Face Provider
 * @see {@link https://huggingface.co/docs/inference-providers}
 */
export const createHuggingface = (apiKey: string, baseURL = 'https://router.huggingface.co/v1') => merge(
  createChatProvider<'tencent/Hy3' | 'XiaomiMiMo/MiMo-V2-Flash' | 'XiaomiMiMo/MiMo-V2.5' | 'XiaomiMiMo/MiMo-V2.5-Pro' | 'MiniMaxAI/MiniMax-M2.7' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2' | 'MiniMaxAI/MiniMax-M3' | 'MiniMaxAI/MiniMax-M2.5' | 'google/gemma-4-26B-A4B-it' | 'google/gemma-4-31B-it' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2.7-Code' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'moonshotai/Kimi-K3' | 'moonshotai/Kimi-K2.6' | 'moonshotai/Kimi-K2-Instruct' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'deepseek-ai/DeepSeek-V4-Pro' | 'deepseek-ai/DeepSeek-V4-Flash-0731' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324' | 'deepseek-ai/DeepSeek-V4-Pro-0813' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/DeepSeek-V4-Flash' | 'stepfun-ai/Step-3.5-Flash' | 'stepfun-ai/Step-3.7-Flash' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-VL-235B-A22B-Thinking' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen3.6-27B' | 'Qwen/Qwen3.5-9B' | 'Qwen/Qwen3.5-122B-A10B' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-235B-A22B' | 'Qwen/Qwen3-Coder-Next' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3.5-27B' | 'Qwen/Qwen3.5-35B-A3B' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen3-30B-A3B' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3.6-35B-A3B' | 'Qwen/Qwen3-Embedding-8B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3.8-2.4T-A95B' | 'Qwen/Qwen3.8-27B' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3-Embedding-4B' | 'zai-org/GLM-4.6V-Flash' | 'zai-org/GLM-5.3-Flash' | 'zai-org/GLM-4.5V' | 'zai-org/GLM-4.5-Air' | 'zai-org/GLM-5.1' | 'zai-org/GLM-4.5' | 'zai-org/GLM-5.3' | 'zai-org/GLM-4.6' | 'zai-org/GLM-5' | 'zai-org/GLM-4.7' | 'zai-org/GLM-5.2' | 'zai-org/GLM-4.7-Flash' | 'thinkingmachines/Inkling' | 'thinkingmachines/Inkling-Small' | 'meta-llama/Llama-3.3-70B-Instruct' | 'meta-llama/Llama-3.1-8B-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Charm Hyper Provider
 * @see {@link https://hyper.charm.land}
 */
export const createHyper = (apiKey: string, baseURL = 'https://hyper.charm.land/v1') => merge(
  createChatProvider<'kimi-k2.7-code' | 'gemma-4-26b-a4b-it' | 'qwen3.7-max' | 'kimi-k3' | 'deepseek-v4-flash' | 'llama-3.3-70b-instruct' | 'deepseek-v4-pro-0813' | 'deepseek-v4-pro' | 'qwen3.6-max' | 'glm-5' | 'minimax-m3' | 'minimax-m2.7' | 'qwen3.8-max' | 'qwen3.7-plus' | 'gpt-oss-120b' | 'qwen3.7-flash' | 'llama-4-maverick-17b-128e-instruct-fp8' | 'qwen3.8-flash' | 'kimi-k2.5' | 'glm-5.2' | 'qwen3-next-80b-a3b-instruct' | 'qwen3.8-27b' | 'qwen3.6-plus' | 'qwen3-coder-480b-a35b-instruct-int4-mixed-ar' | 'glm-5.1' | 'deepseek-v4-flash-0731' | 'qwen3.6-flash' | 'kimi-k2.6' | 'qwen3.8-2.4t-a95b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a iFlow Provider
 * @see {@link https://platform.iflow.cn/en/docs}
 */
export const createIflowcn = (apiKey: string, baseURL = 'https://apis.iflow.cn/v1') => merge(
  createChatProvider<'glm-4.6' | 'qwen3-max-preview' | 'qwen3-vl-plus' | 'deepseek-r1' | 'qwen3-32b' | 'qwen3-235b-a22b-thinking-2507' | 'deepseek-v3' | 'deepseek-v3.2' | 'kimi-k2' | 'qwen3-235b' | 'qwen3-235b-a22b-instruct' | 'qwen3-max' | 'kimi-k2-0905' | 'qwen3-coder-plus'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Impossibl Provider
 * @see {@link https://impossibl.com/docs/models}
 */
export const createImpossibl = (apiKey: string, baseURL = 'https://api.impossibl.com/v1') => merge(
  createChatProvider<'fireworks/gpt-oss-120b' | 'fireworks/glm-5.2' | 'fireworks/gpt-oss-20b' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro' | 'google/gemini-3.5-flash-lite' | 'google/gemini-3.1-pro-preview' | 'google/gemini-2.5-flash-lite' | 'google/gemini-3.5-flash' | 'google/gemini-3.1-flash-lite' | 'google/gemini-2.5-flash' | 'google/gemini-3.6-flash' | 'google/gemini-2.5-pro' | 'moonshotai/kimi-k3' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-opus-4-8' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-opus-4-5' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-fable-5' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-opus-4-6' | 'zai/glm-4.6' | 'zai/glm-4.7' | 'zai/glm-5' | 'zai/glm-5-turbo' | 'zai/glm-5.2' | 'zai/glm-4.5-air' | 'zai/glm-5.1' | 'zai/glm-4.5' | 'openai/gpt-4o' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/gpt-3.5-turbo' | 'openai/gpt-5.5-pro' | 'openai/gpt-4-turbo' | 'openai/gpt-5.6-sol' | 'openai/gpt-5.4-pro' | 'openai/gpt-5' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5-codex' | 'openai/gpt-5-mini' | 'openai/gpt-5.6-luna' | 'openai/gpt-5.3-codex' | 'openai/gpt-4.1-nano' | 'openai/o1' | 'openai/gpt-5.2' | 'openai/gpt-5.4-mini' | 'openai/o3' | 'openai/gpt-5-pro' | 'openai/gpt-5.5' | 'openai/gpt-5.2-codex' | 'openai/gpt-4.1' | 'openai/gpt-5.6-terra' | 'openai/o4-mini' | 'openai/gpt-5.4' | 'openai/o3-mini' | 'openai/gpt-5.1-codex' | 'openai/gpt-4.1-mini' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'xai/grok-4.5' | 'xai/grok-4.20-0309-non-reasoning' | 'xai/grok-4.20-0309-reasoning' | 'xai/grok-build-0.1' | 'xai/grok-4.3' | 'qwen/qwen3.8-max-preview' | 'qwen/qwen3.7-max' | 'qwen/qwen3.7-plus' | 'qwen/qwen3.6-flash' | 'xiaomi/mimo-v2.5' | 'thinkingmachines/inkling' | 'cerebras/gpt-oss-120b' | 'groq/gpt-oss-120b' | 'groq/gpt-oss-20b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Inception Provider
 * @see {@link https://platform.inceptionlabs.ai/docs}
 */
export const createInception = (apiKey: string, baseURL = 'https://api.inceptionlabs.ai/v1/') => merge(
  createChatProvider<'mercury-2' | 'mercury-edit-2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Inceptron Provider
 * @see {@link https://docs.inceptron.io}
 */
export const createInceptron = (apiKey: string, baseURL = 'https://api.inceptron.io/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K2.7-Code' | 'moonshotai/Kimi-K2.6' | 'deepseek-ai/DeepSeek-V4-Flash-0731' | 'zai-org/GLM-5.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Inference Provider
 * @see {@link https://inference.net/models}
 */
export const createInference = (apiKey: string, baseURL = 'https://inference.net/v1') => merge(
  createChatProvider<'google/gemma-3' | 'meta/llama-3.2-3b-instruct' | 'meta/llama-3.2-1b-instruct' | 'meta/llama-3.1-8b-instruct' | 'meta/llama-3.2-11b-vision-instruct' | 'osmosis/osmosis-structure-0.6b' | 'qwen/qwen-2.5-7b-vision-instruct' | 'qwen/qwen3-embedding-4b' | 'mistral/mistral-nemo-12b-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a InferX Provider
 * @see {@link https://model.inferx.net/endpoints}
 */
export const createInferx = (apiKey: string, baseURL = 'https://model.inferx.net/endpoints/v1') => merge(
  createChatProvider<'deepseek-v4-flash' | 'Agents-A1' | 'Qwen3-Coder-Next-FP8' | 'Qwen3-Coder-Next-FP8-no-thinking' | 'Qwen3.6-27B-FP8' | 'Qwen3.6-35B-A3B-FP8' | 'Ornith-1.0-35B-FP8' | 'Qwen3.6-35B-A3B-fp8-no-thinking' | 'Qwen3-Embedding-8B' | 'gemma-4-31B-it-fp8' | 'mimo-v25' | 'Devstral-2-123B-Instruct-2512-int4-AutoRound'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a IO.NET Provider
 * @see {@link https://io.net/docs/guides/intelligence/io-intelligence}
 */
export const createIoNet = (apiKey: string, baseURL = 'https://api.intelligence.io.solutions/api/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'deepseek-ai/DeepSeek-R1-0528' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'zai-org/GLM-4.6' | 'meta-llama/Llama-3.2-90B-Vision-Instruct' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'meta-llama/Llama-3.3-70B-Instruct' | 'mistralai/Mistral-Large-Instruct-2411' | 'mistralai/Magistral-Small-2506' | 'mistralai/Devstral-Small-2505' | 'mistralai/Mistral-Nemo-Instruct-2407' | 'Intel/Qwen3-Coder-480B-A35B-Instruct-int4-mixed-ar'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a IteraCompute Provider
 * @see {@link https://iteracompute.com/docs.html}
 */
export const createIteracompute = (apiKey: string, baseURL = 'https://api.iteracompute.com/v1') => merge(
  createChatProvider<'iteracompute/qwen3.8-27b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Jalapeno Cloud Provider
 * @see {@link https://www.jalapeno-cloud.ai/docs/}
 */
export const createJalapeno = (apiKey: string, baseURL = 'https://api.jalapeno-cloud.ai/v1') => merge(
  createChatProvider<'DeepSeek-V4-Pro' | 'Kimi-K2.5' | 'Qwen3-VL-235B-A22B-Thinking' | 'Qwen3-VL-235B-A22B-Instruct' | 'Qwen3.5-122B-A10B' | 'MiniMax-M3' | 'GLM-5.1' | 'Kimi-K2.7-Code' | 'Qwen3.5-27B' | 'Qwen3.5-35B-A3B' | 'Qwen3-Next-80B-A3B-Thinking' | 'Qwen3.5-397B-A17B' | 'Kimi-K3' | 'Hy3' | 'GLM-5.2' | 'DeepSeek-V4-Flash' | 'Qwen3-Next-80B-A3B-Instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Jiekou.AI Provider
 * @see {@link https://docs.jiekou.ai/docs/support/quickstart?utm_source=github_models.dev}
 */
export const createJiekou = (apiKey: string, baseURL = 'https://api.jiekou.ai/openai') => merge(
  createChatProvider<'gemini-2.5-flash-lite-preview-06-17' | 'claude-opus-4-20250514' | 'grok-4-fast-reasoning' | 'claude-opus-4-1-20250805' | 'gpt-5-nano' | 'gemini-2.5-flash-lite-preview-09-2025' | 'gpt-5-chat-latest' | 'gemini-2.5-flash-preview-05-20' | 'gpt-5.1-codex-mini' | 'gemini-2.5-flash-lite' | 'gpt-5-codex' | 'grok-code-fast-1' | 'grok-4-1-fast-reasoning' | 'gpt-5-mini' | 'gemini-2.5-pro-preview-06-05' | 'claude-sonnet-4-5-20250929' | 'gpt-5.2' | 'o3' | 'gpt-5-pro' | 'gemini-2.5-flash' | 'gemini-3-pro-preview' | 'grok-4-1-fast-non-reasoning' | 'gpt-5.2-codex' | 'claude-haiku-4-5-20251001' | 'o4-mini' | 'o3-mini' | 'grok-4-fast-non-reasoning' | 'claude-opus-4-5-20251101' | 'grok-4-0709' | 'gpt-5.2-pro' | 'claude-sonnet-4-20250514' | 'gemini-3-flash-preview' | 'gpt-5.1-codex-max' | 'claude-opus-4-6' | 'gpt-5.1-codex' | 'gemini-2.5-pro' | 'gpt-5.1' | 'deepseek/deepseek-v3-0324' | 'deepseek/deepseek-v3.1' | 'deepseek/deepseek-r1-0528' | 'moonshotai/kimi-k2-instruct' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'qwen/qwen3-235b-a22b-fp8' | 'qwen/qwen3-32b-fp8' | 'qwen/qwen3-30b-a3b-fp8' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen3-coder-next' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-235b-a22b-instruct-2507' | 'qwen/qwen3-next-80b-a3b-instruct' | 'xiaomimimo/mimo-v2-flash' | 'zai-org/glm-4.7' | 'zai-org/glm-4.5v' | 'zai-org/glm-4.7-flash' | 'zai-org/glm-4.5' | 'minimaxai/minimax-m1-80k' | 'baidu/ernie-4.5-vl-424b-a47b' | 'baidu/ernie-4.5-300b-a47b-paddle' | 'minimax/minimax-m2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Kenari Provider
 * @see {@link https://kenari.id/docs}
 */
export const createKenari = (apiKey: string, baseURL = 'https://kenari.id/v1') => merge(
  createChatProvider<'gemini-3-1-pro' | 'minimax-m2-7' | 'claude-opus-4-7' | 'nemotron-3-super-120b-a12b:free' | 'glm-4-7-flash:free' | 'nemotron-3-nano-30b-a3b' | 'gemini-3-7-flash' | 'qwen3-8-max' | 'kimi-k3' | 'gpt-5-6-luna' | 'deepseek-v4-flash' | 'gpt-5-6-terra' | 'gemini-2-5-flash-lite' | 'claude-opus-4-8' | 'deepseek-v4-pro' | 'nemotron-3-super-120b-a12b' | 'mimo-v2-5:free' | 'claude-sonnet-5' | 'glm-5-2' | 'gemini-3-6-flash' | 'gemma-4-31b-it' | 'grok-4-6' | 'gemini-3-1-flash-lite' | 'minimax-m3' | 'kimi-k2-7-code' | 'gpt-5-5' | 'gpt-oss-120b' | 'glm-5-3' | 'step-3-7-flash' | 'nemotron-3-ultra-550b-a55b' | 'kimi-k2-7-code:free' | 'step-3-7-flash:free' | 'claude-sonnet-4-6' | 'gemini-3-1-flash-tts' | 'gemini-2-5-flash' | 'mistral-medium-3-5:free' | 'grok-imagine-image-2-0' | 'deepseek-v4-flash:free' | 'glm-5-1' | 'qwen3-7-plus' | 'kimi-k2-6' | 'claude-fable-5' | 'minimax-m2-7-highspeed' | 'gpt-5-6-sol' | 'gpt-image-2' | 'hy3' | 'glm-5-3-flash' | 'claude-opus-5' | 'grok-4-5' | 'mimo-v2-5-pro' | 'mimo-v2-5' | 'grok-build-0-1' | 'gpt-5-4-mini' | 'hy3:free' | 'gpt-oss-20b' | 'mistral-large:free' | 'gemini-3-5-flash' | 'whisper-large-v3-turbo' | 'kimi-k2-6:free'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Kilo Gateway Provider
 * @see {@link https://kilo.ai}
 */
export const createKilo = (apiKey: string, baseURL = 'https://api.kilo.ai/api/gateway') => merge(
  createChatProvider<'tencent/hy-mt2-30b-a3b' | 'tencent/hy-mt2-1.8b' | 'tencent/hy3-preview' | 'tencent/hy4-preview' | 'tencent/hunyuan-a13b-instruct' | 'tencent/hy3' | 'tencent/hy3:free' | 'tencent/hy-mt2-7b' | '~anthropic/claude-haiku-latest' | '~anthropic/claude-opus-latest' | '~anthropic/claude-sonnet-latest' | '~anthropic/claude-fable-latest' | '~x-ai/grok-latest' | 'nvidia/nemotron-3-super-120b-a12b:free' | 'nvidia/nemotron-3-nano-30b-a3b' | 'nvidia/nemotron-3-super-120b-a12b' | 'nvidia/nemotron-3.5-lightning' | 'nvidia/nemotron-3-ultra-550b-a55b' | 'nvidia/nemotron-3.5-lightning:free' | 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free' | 'nvidia/nemotron-3.5-content-safety:free' | 'nvidia/nemotron-3-ultra-550b-a55b:free' | '~openai/gpt-latest' | '~openai/gpt-mini-latest' | 'aion-labs/aion-3.0' | 'aion-labs/aion-rp-llama-3.1-8b' | 'aion-labs/aion-2.0' | 'aion-labs/aion-3.0-mini' | 'undi95/remm-slerp-l2-13b' | 'microsoft/wizardlm-2-8x22b' | 'microsoft/phi-4' | 'z-ai/glm-4.6' | 'z-ai/glm-5v-turbo' | 'z-ai/glm-4.7' | 'z-ai/glm-4.5v' | 'z-ai/glm-5' | 'z-ai/glm-5-turbo' | 'z-ai/glm-5.3' | 'z-ai/glm-5.2' | 'z-ai/glm-4.6v' | 'z-ai/glm-4.5-air' | 'z-ai/glm-5.1' | 'z-ai/glm-4.7-flash' | 'z-ai/glm-4.5' | 'z-ai/glm-5.3-flash' | 'deepseek/deepseek-v3.1-terminus' | 'deepseek/deepseek-r1' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro-0813' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-chat-v3.1' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-chat' | 'deepseek/deepseek-chat-v3-0324' | 'deepseek/deepseek-r1-distill-llama-70b' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-v4-flash-0731' | 'deepseek/deepseek-v4-flash-vision-exp' | 'arcee-ai/trinity-large-thinking' | 'google/gemini-2.5-pro-preview-05-06' | 'google/gemma-2-27b-it' | 'google/gemma-4-26b-a4b-it' | 'google/gemini-3-pro-image' | 'google/gemini-3-pro-image-preview' | 'google/gemini-3.5-flash-lite' | 'google/gemini-3.1-flash-lite-image' | 'google/gemma-3-4b-it' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3.1-pro-preview-customtools' | 'google/gemini-2.5-flash-lite' | 'google/gemma-4-31b-it' | 'google/lyria-3-clip-preview' | 'google/gemini-3.5-flash' | 'google/gemini-3.1-flash-lite' | 'google/gemma-3-27b-it' | 'google/gemini-2.5-flash' | 'google/gemma-3-12b-it' | 'google/gemini-2.5-pro-preview' | 'google/gemini-3.6-flash' | 'google/gemini-3.1-flash-image' | 'google/gemini-3.1-flash-image-preview' | 'google/lyria-3-pro-preview' | 'google/gemini-3.1-flash-lite-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-flash-image' | 'google/gemini-2.5-pro' | 'google/gemini-3.7-flash' | 'meta/muse-glimmer-30b' | 'meta/muse-spark-1.2' | 'meta/muse-spark-1.1' | 'meta/muse-spark-1.2-contributor' | 'cognitivecomputations/dolphin-mistral-24b-venice-edition' | 'gryphe/mythomax-l2-13b' | 'inception/mercury-2' | 'openrouter/auto' | 'openrouter/bodybuilder' | 'openrouter/pareto-code' | 'openrouter/free' | 'poolside/laguna-xs-2.1:free' | 'poolside/laguna-s-2.1' | 'poolside/laguna-xs-2.1' | 'poolside/laguna-s-2.1:free' | 'x-ai/grok-4.20' | 'x-ai/grok-4.6' | 'x-ai/grok-4.5' | 'x-ai/grok-4.20-multi-agent' | 'x-ai/grok-build-0.1' | 'x-ai/grok-4.3' | 'perceptron/perceptron-mk1' | 'bytedance-seed/seed-2.0-code' | 'bytedance-seed/seed-1.6-flash' | 'bytedance-seed/seed-1.6' | 'bytedance-seed/seed-2.0-mini' | 'bytedance-seed/seed-2.0-lite' | 'bytedance-seed/seed-2-1-turbo' | 'moonshotai/kimi-k2.7-code' | 'moonshotai/kimi-k3' | 'moonshotai/kimi-k2' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.6' | 'anthropic/claude-opus-4.8' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-3-haiku' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.7' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-opus-4.7-fast' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-opus-4.8-fast' | 'anthropic/claude-opus-4' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-fable-5' | 'anthropic/claude-opus-5-fast' | 'anthropic/claude-opus-5' | 'cohere/command-r-plus-08-2024' | 'cohere/command-a' | 'cohere/north-mini-code:free' | 'cohere/command-r7b-12-2024' | 'cohere/command-r-08-2024' | 'bytedance/ui-tars-1.5-7b' | '~google/gemini-flash-latest' | '~google/gemini-pro-latest' | 'openai/gpt-audio' | 'openai/gpt-3.5-turbo-16k' | 'openai/gpt-4o' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/gpt-3.5-turbo' | 'openai/o1-pro' | 'openai/gpt-4-turbo-preview' | 'openai/gpt-5.5-pro' | 'openai/gpt-4-turbo' | 'openai/gpt-4' | 'openai/gpt-3.5-turbo-instruct' | 'openai/gpt-5.6-sol' | 'openai/o3-pro' | 'openai/gpt-5.4-pro' | 'openai/gpt-4o-mini-2024-07-18' | 'openai/gpt-5' | 'openai/gpt-5.6-sol-discounted' | 'openai/o4-mini-high' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5-mini' | 'openai/gpt-5.6-luna' | 'openai/gpt-5.6-luna-pro' | 'openai/gpt-5.3-codex' | 'openai/gpt-5-image-mini' | 'openai/gpt-5.4-image-2' | 'openai/gpt-oss-120b' | 'openai/gpt-4.1-nano' | 'openai/o1' | 'openai/gpt-audio-mini' | 'openai/gpt-5.2' | 'openai/gpt-5.4-mini' | 'openai/gpt-4o-2024-05-13' | 'openai/o3' | 'openai/gpt-chat-latest' | 'openai/gpt-5-pro' | 'openai/gpt-5.5' | 'openai/o3-mini-high' | 'openai/gpt-5.2-codex' | 'openai/gpt-4.1' | 'openai/gpt-4o-2024-08-06' | 'openai/gpt-5.6-terra-pro' | 'openai/gpt-3.5-turbo-0613' | 'openai/gpt-5.6-terra' | 'openai/o4-mini' | 'openai/gpt-5.4' | 'openai/o3-mini' | 'openai/gpt-4o-2024-11-20' | 'openai/gpt-5.6-sol-pro' | 'openai/gpt-5.2-chat' | 'openai/gpt-5.2-pro' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-5.1-codex' | 'openai/gpt-oss-safeguard-20b' | 'openai/gpt-4.1-mini' | 'openai/gpt-oss-20b' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'openai/gpt-5-image' | 'kilo-auto/small' | 'kilo-auto/frontier' | 'kilo-auto/efficient' | 'kilo-auto/balanced' | 'kilo-auto/free' | 'meituan/longcat-2.0' | 'meituan/longcat-2.0-free' | 'nousresearch/hermes-3-llama-3.1-405b' | 'nousresearch/hermes-3-llama-3.1-70b' | 'nousresearch/hermes-4-70b' | 'nousresearch/hermes-4-405b' | 'stepfun/step-3.5-flash' | 'stepfun/step-3.7-flash:free' | 'stepfun/step-3.7-flash' | 'qwen/qwen2.5-vl-72b-instruct' | 'qwen/qwen3.5-plus-20260420' | 'qwen/qwen3-coder-30b-a3b-instruct' | 'qwen/qwen3.7-max' | 'qwen/qwen3.5-flash-02-23' | 'qwen/qwen3-32b' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen3-vl-8b-thinking' | 'qwen/qwen3-235b-a22b' | 'qwen/qwen3.5-35b-a3b' | 'qwen/qwen3-vl-235b-a22b-thinking' | 'qwen/qwen3-30b-a3b' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen-plus' | 'qwen/qwen3-coder-next' | 'qwen/qwen3-coder-flash' | 'qwen/qwen3-235b-a22b-2507' | 'qwen/qwen3.6-max-preview' | 'qwen/qwen3.8-max' | 'qwen/qwen3-30b-a3b-instruct-2507' | 'qwen/qwen3.7-plus' | 'qwen/qwen3.7-flash' | 'qwen/qwen3.5-plus-02-15' | 'qwen/qwen3-coder' | 'qwen/qwen-2.5-7b-instruct' | 'qwen/qwen3-max-thinking' | 'qwen/qwen3-14b' | 'qwen/qwen3-vl-8b-instruct' | 'qwen/qwen3.8-flash' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen-plus-2025-07-28' | 'qwen/qwen3-8b' | 'qwen/qwen3-max' | 'qwen/qwen-2.5-coder-32b-instruct' | 'qwen/qwen3.6-35b-a3b' | 'qwen/qwen3.6-27b' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3.8-27b' | 'qwen/qwen3.6-plus' | 'qwen/qwen3-30b-a3b-thinking-2507' | 'qwen/qwen3.5-9b' | 'qwen/qwen3.5-27b' | 'qwen/qwen3-vl-30b-a3b-thinking' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen3-coder-plus' | 'qwen/qwen3-vl-30b-a3b-instruct' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'qwen/qwen-2.5-72b-instruct' | 'qwen/qwen3-vl-32b-instruct' | 'qwen/qwen3.6-flash' | 'qwen/qwen3.8-2.4t-a95b' | 'liquid/lfm-2.5-2.6b:free' | 'xiaomi/mimo-v2.5' | 'xiaomi/mimo-v2.5-pro' | 'sakana/sakana-namazu' | 'sakana/fugu-ultra' | 'perplexity/sonar-deep-research' | 'perplexity/sonar' | 'perplexity/sonar-reasoning-pro' | 'perplexity/sonar-pro' | 'perplexity/sonar-pro-search' | 'thedrummer/cydonia-24b-v4.1' | 'thedrummer/skyfall-36b-v2' | 'thedrummer/unslopnemo-12b' | 'rekaai/reka-edge' | 'rekaai/reka-flash-3' | 'stealth/claude-opus-4.8' | 'stealth/claude-sonnet-4.6' | 'stealth/claude-opus-4.7' | 'stealth/claude-opus-4.6' | 'stealth/qwen3.6-plus' | 'thinkingmachines/inkling-small' | 'thinkingmachines/inkling:free' | 'thinkingmachines/inkling' | 'thinkingmachines/inkling-small:free' | 'writer/palmyra-x5' | '~deepseek/deepseek-v4-flash-latest' | 'inclusionai/ling-3.0-flash-fin:free' | 'inclusionai/ling-3.0-flash' | 'meta-llama/llama-3.2-3b-instruct' | 'meta-llama/llama-3.3-70b-instruct' | 'meta-llama/llama-guard-4-12b' | 'meta-llama/llama-3.2-1b-instruct' | 'meta-llama/llama-3.1-8b-instruct' | 'meta-llama/llama-3.1-70b-instruct' | 'meta-llama/llama-4-maverick' | 'meta-llama/llama-4-scout' | 'mistralai/ministral-8b-2512' | 'mistralai/mistral-medium-3.1' | 'mistralai/mistral-nemo' | 'mistralai/mistral-medium-3-5' | 'mistralai/devstral-2512' | 'mistralai/mistral-small-2603' | 'mistralai/mistral-small-3.2-24b-instruct' | 'mistralai/mistral-small-24b-instruct-2501' | 'mistralai/mistral-large-2512' | 'mistralai/voxtral-small-24b-2507' | 'mistralai/ministral-3b-2512' | 'mistralai/mistral-medium-3' | 'mistralai/mistral-large-2407' | 'mistralai/mistral-large' | 'mistralai/mixtral-8x22b-instruct' | 'mistralai/ministral-14b-2512' | 'mistralai/codestral-2508' | 'mistralai/mistral-saba' | 'mistralai/mistral-small-3.1-24b-instruct' | 'morph/morph-v3-large' | 'morph/morph-v3-fast' | 'amazon/nova-pro-v1' | 'amazon/nova-2-lite-v1' | 'amazon/nova-micro-v1' | 'amazon/nova-premier-v1' | 'amazon/nova-lite-v1' | 'anthracite-org/magnum-v4-72b' | '~z-ai/glm-latest' | 'nex-agi/nex-n2-mini' | 'nex-agi/nex-n2-pro' | 'upstage/solar-pro-3' | 'upstage/solar-pro4' | 'baidu/ernie-4.5-vl-424b-a47b' | 'mancer/weaver' | 'sao10k/l3.1-euryale-70b' | 'sao10k/l3.3-euryale-70b' | 'sao10k/l3-lunaris-8b' | '~moonshotai/kimi-latest' | 'kwaipilot/kat-coder-pro-v2.5' | 'kwaipilot/kat-coder-air-v2.5' | 'kwaipilot/kat-coder-pro-v2' | 'ibm-granite/granite-4.0-h-micro' | 'ibm-granite/granite-4.1-8b' | 'dots-studio/dots-3-note-preview:free' | 'minimax/minimax-01' | 'minimax/minimax-m1' | 'minimax/minimax-m2-her' | 'minimax/minimax-m3' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2' | 'minimax/minimax-m2.5' | 'minimax/minimax-m3:free' | 'minimax/minimax-m2.7:free' | 'minimax/minimax-m2.1' | 'relace/relace-search' | 'relace/relace-apply-3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Kimi For Coding Provider
 * @see {@link https://www.kimi.com/code/docs/en/third-party-tools/other-coding-agents.html}
 */
export const createKimiForCoding = (apiKey: string, baseURL = 'https://api.kimi.com/coding/v1') => merge(
  createChatProvider<'k3-256k' | 'kimi-for-coding-highspeed' | 'k3' | 'kimi-for-coding'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Kosmik Compute Provider
 * @see {@link https://api.koscompute.com/docs/}
 */
export const createKosmik = (apiKey: string, baseURL = 'https://api.koscompute.com/v1') => merge(
  createChatProvider<'qwen/qwen3.8-27b'>({ apiKey, baseURL }),
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
  createChatProvider<'google/gemma-4-31b-it' | 'moonshotai/kimi-k2.6' | 'zai-org/glm-5.2' | 'minimaxai/minimax-m3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Llama Provider
 * @see {@link https://llama.developer.meta.com/docs/models}
 */
export const createLlama = (apiKey: string, baseURL = 'https://api.llama.com/compat/v1/') => merge(
  createChatProvider<'llama-4-scout-17b-16e-instruct-fp8' | 'llama-3.3-70b-instruct' | 'cerebras-llama-4-scout-17b-16e-instruct' | 'llama-3.3-8b-instruct' | 'cerebras-llama-4-maverick-17b-128e-instruct' | 'llama-4-maverick-17b-128e-instruct-fp8' | 'groq-llama-4-maverick-17b-128e-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a DevPass (LLM Gateway) Provider
 * @see {@link https://llmgateway.io/docs}
 */
export const createLlmgateway = (apiKey: string, baseURL = 'https://api.llmgateway.io/v1') => merge(
  createChatProvider<'claude-opus-4-7' | 'glm-4.6' | 'minimax-m2.7-highspeed' | 'gpt-4o' | 'kimi-k2.7-code' | 'custom' | 'qwen3-vl-plus' | 'gemma-4-26b-a4b-it' | 'grok-4-3' | 'qwen3-coder-30b-a3b-instruct' | 'qwen3.7-max' | 'claude-opus-4-1-20250805' | 'gpt-5-nano' | 'gpt-4o-mini' | 'qwen3-235b-a22b-fp8' | 'kimi-k3' | 'qwen-omni-turbo' | 'gpt-3.5-turbo' | 'llama-3.2-3b-instruct' | 'gpt-4o-mini-transcribe' | 'gpt-5.5-pro' | 'glm-4.7' | 'auto' | 'glm-4.5v' | 'qwen3-32b' | 'gpt-4-turbo' | 'deepseek-v4-flash' | 'kimi-k3-fast' | 'minimax-text-01' | 'glm-4.5-x' | 'qwen3-235b-a22b-thinking-2507' | 'claude-opus-4-8' | 'gemini-3.5-flash-lite' | 'gpt-4' | 'mimo-v2.5' | 'gpt-5.6-sol' | 'llama-3.3-70b-instruct' | 'qwen-max' | 'sonar' | 'gpt-5.4-pro' | 'qwen3-vl-235b-a22b-thinking' | 'gpt-4o-transcribe' | 'gemini-3.1-pro-preview' | 'nemotron-3-nano-30b' | 'llama-4-scout-17b-instruct' | 'qwen-plus' | 'gpt-5' | 'ministral-8b-2512' | 'grok-4-20-beta-0309-non-reasoning' | 'nemotron-3-ultra-550b' | 'deepseek-v4-pro' | 'qwen3-coder-next' | 'claude-sonnet-5' | 'glm-5.2-fast' | 'deepseek-v3.2' | 'qwen2-5-vl-72b-instruct' | 'ling-3.0-flash' | 'gpt-5.1-codex-mini' | 'gemini-2.5-flash-lite' | 'grok-4-1-fast-reasoning' | 'gpt-5-mini' | 'minimax-m2.5-highspeed' | 'gpt-5.6-luna' | 'glm-4.7-flashx' | 'kimi-k2' | 'gemma-4-31b-it' | 'grok-4-6' | 'qwen3-coder-flash' | 'qwen-plus-latest' | 'glm-5' | 'minimax-m3' | 'cosmos3-super-reasoner' | 'mistral-large-latest' | 'qwen3.6-max-preview' | 'minimax-m2.7' | 'gpt-5.3-codex' | 'qwen3.8-max' | 'claude-sonnet-4-5-20250929' | 'qwen3-30b-a3b-instruct-2507' | 'qwen3.7-plus' | 'devstral-2512' | 'gpt-oss-120b' | 'gpt-4.1-nano' | 'fugu-ultra' | 'nemotron-3-super-120b' | 'qwen35-397b-a17b' | 'o1' | 'hermes-4-70b' | 'llama-3.1-70b-instruct' | 'gpt-5.2' | 'qwen3.7-flash' | 'glm-4-32b-0414-128k' | 'gemini-3.5-flash' | 'gpt-5.4-mini' | 'glm-4.6v-flashx' | 'mistral-small-2506' | 'o3' | 'claude-sonnet-4-6' | 'gemini-3.1-flash-lite' | 'grok-4' | 'muse-spark-1.2' | 'gpt-5-pro' | 'minicpm-v-4.5' | 'gpt-5.5' | 'sonar-reasoning-pro' | 'gemini-2.5-flash' | 'qwen3.8-flash' | 'qwen3-next-80b-a3b-thinking' | 'qwen3-coder-480b-a35b-instruct' | 'glm-5.3' | 'grok-4-1-fast-non-reasoning' | 'hermes-4-405b' | 'mistral-large-2512' | 'kimi-k2.5' | 'gpt-5.2-codex' | 'qwen-flash' | 'minimax-m2' | 'qwen3-max' | 'claude-haiku-4-5-20251001' | 'glm-4.5-airx' | 'grok-4-20-beta-0309-reasoning' | 'claude-sonnet-4-5' | 'glm-5.2' | 'glm-4.6v' | 'sonar-pro' | 'llama-3-70b-instruct' | 'muse-spark-1.1' | 'gpt-4.1' | 'seed-1-8-251228' | 'minimax-m2.5' | 'gemini-3.6-flash' | 'gpt-5.6-terra' | 'ministral-3b-2512' | 'grok-4-20-reasoning' | 'qwen3.6-35b-a3b' | 'qwen3-235b-a22b-instruct-2507' | 'o4-mini' | 'seed-1-6-250915' | 'qwen3-next-80b-a3b-instruct' | 'gemini-pro-latest' | 'gpt-5.4' | 'o3-mini' | 'llama-3.2-11b-instruct' | 'qwen3.8-27b' | 'nemotron-3-nano-omni' | 'qwen3.6-plus' | 'claude-opus-4-5-20251101' | 'seed-1-6-flash-250715' | 'qwen3.5-9b' | 'claude-fable-5' | 'gemma-3-27b' | 'ministral-14b-2512' | 'glm-4.5-air' | 'glm-5.1' | 'gpt-5.2-pro' | 'llama-3.1-nemotron-ultra-253b' | 'llama-4-maverick-17b-instruct' | 'minimax-m2.1-lightning' | 'claude-haiku-4-5' | 'seed-1-6-250615' | 'codestral-2508' | 'mimo-v2.5-pro' | 'qwen-coder-plus' | 'ernie-4.5-vl-424b-a47b' | 'gemini-3-flash-preview' | 'hy3' | 'qwen3-coder-plus' | 'claude-opus-4-6' | 'gpt-5.1-codex' | 'claude-opus-5' | 'gemini-2.5-pro' | 'qwen3-vl-30b-a3b-instruct' | 'grok-4-5' | 'grok-4-20-non-reasoning' | 'qwen3-vl-235b-a22b-instruct' | 'gpt-4.1-mini' | 'glm-4.7-flash' | 'kimi-k2.7-code-highspeed' | 'grok-build-0-1' | 'qwen3-vl-flash' | 'gpt-oss-20b' | 'minimax-m2.1' | 'gemini-3.7-flash' | 'kimi-k2-thinking' | 'gpt-5.4-nano' | 'qwen3.6-flash' | 'kimi-k2.6' | 'glm-4.5' | 'deepseek-v4-flash-vision-exp' | 'glm-5.3-flash' | 'gpt-5.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a LLM Gateway Provider
 * @see {@link https://llmgateway.io/docs}
 */
export const createLlmgatewayProviders = (apiKey: string, baseURL = 'https://api.llmgateway.io/v1') => merge(
  createChatProvider<'quartz/gemini-3.1-pro-preview' | 'fireworks/kimi-k3' | 'fireworks/deepseek-v4-flash' | 'fireworks/kimi-k3-fast' | 'fireworks/deepseek-v4-pro' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v4-flash-vision-exp' | 'google-vertex/gemini-3.5-flash-lite' | 'google-vertex/gemini-3.1-pro-preview' | 'google-vertex/gemini-2.5-flash-lite' | 'google-vertex/gemini-3.5-flash' | 'google-vertex/gemini-3.1-flash-lite' | 'google-vertex/gemini-2.5-flash' | 'google-vertex/gemini-3.6-flash' | 'google-vertex/gemini-3-flash-preview' | 'google-vertex/gemini-2.5-pro' | 'google-vertex/gemini-3.7-flash' | 'consensusprotocol/deepseek-v4-flash' | 'deepinfra/gemma-4-26b-a4b-it' | 'deepinfra/deepseek-v4-flash' | 'deepinfra/mimo-v2.5' | 'deepinfra/nemotron-3-ultra-550b' | 'deepinfra/deepseek-v4-pro' | 'deepinfra/deepseek-v3.2' | 'deepinfra/ling-3.0-flash' | 'deepinfra/gemma-4-31b-it' | 'deepinfra/kimi-k2.5' | 'deepinfra/qwen3.5-9b' | 'deepinfra/glm-5.1' | 'deepinfra/mimo-v2.5-pro' | 'deepinfra/hy3' | 'deepinfra/qwen3-vl-30b-a3b-instruct' | 'deepinfra/qwen3-vl-235b-a22b-instruct' | 'meta/muse-spark-1.2' | 'meta/muse-spark-1.1' | 'novita/glm-4.6' | 'novita/kimi-k2.7-code' | 'novita/gemma-4-26b-a4b-it' | 'novita/qwen3-coder-30b-a3b-instruct' | 'novita/qwen3.7-max' | 'novita/qwen3-235b-a22b-fp8' | 'novita/kimi-k3' | 'novita/llama-3.2-3b-instruct' | 'novita/glm-4.7' | 'novita/glm-4.5v' | 'novita/deepseek-v4-flash' | 'novita/qwen3-235b-a22b-thinking-2507' | 'novita/mimo-v2.5' | 'novita/llama-3.3-70b-instruct' | 'novita/qwen3-vl-235b-a22b-thinking' | 'novita/llama-4-scout-17b-instruct' | 'novita/deepseek-v3.2' | 'novita/ling-3.0-flash' | 'novita/kimi-k2' | 'novita/gemma-4-31b-it' | 'novita/glm-5' | 'novita/minimax-m2.7' | 'novita/qwen3.8-max' | 'novita/qwen35-397b-a17b' | 'novita/qwen3.8-flash' | 'novita/qwen3-coder-480b-a35b-instruct' | 'novita/glm-5.3' | 'novita/qwen3-max' | 'novita/glm-5.2' | 'novita/glm-4.6v' | 'novita/llama-3-70b-instruct' | 'novita/minimax-m2.5' | 'novita/qwen3.6-35b-a3b' | 'novita/qwen3-235b-a22b-instruct-2507' | 'novita/qwen3-next-80b-a3b-instruct' | 'novita/qwen3.8-27b' | 'novita/glm-5.1' | 'novita/llama-4-maverick-17b-instruct' | 'novita/mimo-v2.5-pro' | 'novita/ernie-4.5-vl-424b-a47b' | 'novita/hy3' | 'novita/qwen3-vl-30b-a3b-instruct' | 'novita/qwen3-vl-235b-a22b-instruct' | 'novita/minimax-m2.1' | 'novita/kimi-k2.6' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-opus-4-8' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-sonnet-4-5-20250929' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-haiku-4-5-20251001' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-opus-4-5-20251101' | 'anthropic/claude-fable-5' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-opus-4-6' | 'anthropic/claude-opus-5' | 'zai/glm-4.6' | 'zai/glm-4.7' | 'zai/glm-4.5v' | 'zai/glm-4.5-x' | 'zai/glm-4.7-flashx' | 'zai/glm-5' | 'zai/glm-4-32b-0414-128k' | 'zai/glm-4.6v-flashx' | 'zai/glm-5.3' | 'zai/glm-4.5-airx' | 'zai/glm-5.2' | 'zai/glm-4.6v' | 'zai/glm-4.5-air' | 'zai/glm-5.1' | 'zai/glm-4.5' | 'zai/glm-5.3-flash' | 'bytedance/glm-4.7' | 'bytedance/deepseek-v4-flash' | 'bytedance/deepseek-v4-pro' | 'bytedance/deepseek-v3.2' | 'bytedance/gpt-oss-120b' | 'bytedance/glm-5.2' | 'bytedance/seed-1-8-251228' | 'bytedance/seed-1-6-250915' | 'bytedance/seed-1-6-flash-250715' | 'bytedance/seed-1-6-250615' | 'openai/gpt-4o' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/gpt-3.5-turbo' | 'openai/gpt-4o-mini-transcribe' | 'openai/gpt-5.5-pro' | 'openai/gpt-4-turbo' | 'openai/gpt-4' | 'openai/gpt-5.6-sol' | 'openai/gpt-5.4-pro' | 'openai/gpt-4o-transcribe' | 'openai/gpt-5' | 'openai/gpt-5-mini' | 'openai/gpt-5.6-luna' | 'openai/gpt-5.3-codex' | 'openai/gpt-4.1-nano' | 'openai/o1' | 'openai/gpt-5.2' | 'openai/gpt-5.4-mini' | 'openai/o3' | 'openai/gpt-5-pro' | 'openai/gpt-5.5' | 'openai/gpt-4.1' | 'openai/gpt-5.6-terra' | 'openai/o4-mini' | 'openai/gpt-5.4' | 'openai/o3-mini' | 'openai/gpt-5.2-pro' | 'openai/gpt-4.1-mini' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'together-ai/kimi-k3' | 'together-ai/glm-4.7' | 'together-ai/deepseek-v4-flash' | 'together-ai/deepseek-v4-pro' | 'together-ai/gemma-4-31b-it' | 'together-ai/minimax-m3' | 'together-ai/gpt-oss-120b' | 'together-ai/gpt-oss-20b' | 'xai/grok-4-3' | 'xai/grok-4-20-beta-0309-non-reasoning' | 'xai/grok-4-6' | 'xai/grok-4' | 'xai/grok-4-20-beta-0309-reasoning' | 'xai/grok-4-5' | 'xai/grok-build-0-1' | 'aws-mantle/gpt-5.6-sol' | 'aws-mantle/gpt-5.6-luna' | 'aws-mantle/gpt-5.6-terra' | 'nebius/kimi-k2.7-code' | 'nebius/kimi-k3' | 'nebius/qwen3-32b' | 'nebius/llama-3.3-70b-instruct' | 'nebius/nemotron-3-nano-30b' | 'nebius/nemotron-3-ultra-550b' | 'nebius/deepseek-v4-pro' | 'nebius/qwen2-5-vl-72b-instruct' | 'nebius/minimax-m3' | 'nebius/cosmos3-super-reasoner' | 'nebius/qwen3-30b-a3b-instruct-2507' | 'nebius/gpt-oss-120b' | 'nebius/nemotron-3-super-120b' | 'nebius/hermes-4-70b' | 'nebius/minicpm-v-4.5' | 'nebius/qwen3-next-80b-a3b-thinking' | 'nebius/hermes-4-405b' | 'nebius/glm-5.2' | 'nebius/minimax-m2.5' | 'nebius/qwen3-235b-a22b-instruct-2507' | 'nebius/nemotron-3-nano-omni' | 'nebius/gemma-3-27b' | 'nebius/glm-5.1' | 'nebius/llama-3.1-nemotron-ultra-253b' | 'nebius/kimi-k2.6' | 'ranoai/deepseek-v4-flash' | 'azure-anthropic/claude-opus-4-7' | 'azure-anthropic/claude-opus-4-8' | 'azure-anthropic/claude-sonnet-5' | 'azure-anthropic/claude-fable-5' | 'azure-anthropic/claude-opus-4-6' | 'azure-anthropic/claude-opus-5' | 'google-ai-studio/gemini-3.5-flash-lite' | 'google-ai-studio/gemini-3.1-pro-preview' | 'google-ai-studio/gemini-2.5-flash-lite' | 'google-ai-studio/gemini-3.5-flash' | 'google-ai-studio/gemini-3.1-flash-lite' | 'google-ai-studio/gemini-2.5-flash' | 'google-ai-studio/gemini-3.6-flash' | 'google-ai-studio/gemini-pro-latest' | 'google-ai-studio/gemini-3-flash-preview' | 'google-ai-studio/gemini-2.5-pro' | 'google-ai-studio/gemini-3.7-flash' | 'aws-bedrock/claude-opus-4-7' | 'aws-bedrock/grok-4-3' | 'aws-bedrock/claude-opus-4-1-20250805' | 'aws-bedrock/claude-opus-4-8' | 'aws-bedrock/llama-4-scout-17b-instruct' | 'aws-bedrock/claude-sonnet-5' | 'aws-bedrock/grok-4-6' | 'aws-bedrock/claude-sonnet-4-5-20250929' | 'aws-bedrock/llama-3.1-70b-instruct' | 'aws-bedrock/claude-sonnet-4-6' | 'aws-bedrock/claude-haiku-4-5-20251001' | 'aws-bedrock/claude-sonnet-4-5' | 'aws-bedrock/claude-opus-4-5-20251101' | 'aws-bedrock/claude-fable-5' | 'aws-bedrock/llama-4-maverick-17b-instruct' | 'aws-bedrock/claude-haiku-4-5' | 'aws-bedrock/claude-opus-4-6' | 'aws-bedrock/claude-opus-5' | 'canopywave/kimi-k3' | 'canopywave/deepseek-v4-flash' | 'canopywave/deepseek-v4-pro' | 'canopywave/glm-5.2' | 'canopywave/kimi-k2.6' | 'scx-ai-gp/kimi-k2.7-code' | 'scx-ai-gp/kimi-k3' | 'scx-ai-gp/glm-5.2-fast' | 'scx-ai-gp/qwen3.8-max' | 'scx-ai-gp/glm-5.2' | 'scx-ai-gp/glm-5.3-flash' | 'xiaomi/mimo-v2.5' | 'xiaomi/mimo-v2.5-pro' | 'alibaba/qwen3-vl-plus' | 'alibaba/qwen3.7-max' | 'alibaba/qwen-omni-turbo' | 'alibaba/deepseek-v4-flash' | 'alibaba/qwen-max' | 'alibaba/qwen-plus' | 'alibaba/deepseek-v4-pro' | 'alibaba/qwen3-coder-flash' | 'alibaba/qwen-plus-latest' | 'alibaba/glm-5' | 'alibaba/qwen3.6-max-preview' | 'alibaba/qwen3.8-max' | 'alibaba/qwen3.7-plus' | 'alibaba/qwen35-397b-a17b' | 'alibaba/qwen3.7-flash' | 'alibaba/qwen3.8-flash' | 'alibaba/kimi-k2.5' | 'alibaba/qwen-flash' | 'alibaba/qwen3-max' | 'alibaba/glm-5.2' | 'alibaba/qwen3.6-35b-a3b' | 'alibaba/qwen3.6-plus' | 'alibaba/qwen-coder-plus' | 'alibaba/qwen3-coder-plus' | 'alibaba/qwen3-vl-flash' | 'alibaba/qwen3.6-flash' | 'sakana/fugu-ultra' | 'inference.net/llama-3.2-11b-instruct' | 'perplexity/sonar' | 'perplexity/sonar-reasoning-pro' | 'perplexity/sonar-pro' | 'scx-ai/qwen3-32b' | 'scx-ai/gemma-4-31b-it' | 'scx-ai/minimax-m2.7' | 'scx-ai/gpt-oss-120b' | 'scx-ai/llama-4-maverick-17b-instruct' | 'azure-ai-foundry/grok-4-3' | 'azure-ai-foundry/grok-4-1-fast-reasoning' | 'azure-ai-foundry/grok-4-1-fast-non-reasoning' | 'moonshot/kimi-k2.7-code' | 'moonshot/kimi-k3' | 'moonshot/kimi-k2.5' | 'moonshot/kimi-k2.7-code-highspeed' | 'moonshot/kimi-k2.6' | 'azure/gpt-4o' | 'azure/gpt-5-nano' | 'azure/gpt-3.5-turbo' | 'azure/gpt-4-turbo' | 'azure/gpt-4' | 'azure/gpt-5.6-sol' | 'azure/gpt-5.4-pro' | 'azure/gpt-5' | 'azure/gpt-5.1-codex-mini' | 'azure/gpt-5-mini' | 'azure/gpt-5.6-luna' | 'azure/gpt-5.3-codex' | 'azure/gpt-oss-120b' | 'azure/gpt-4.1-nano' | 'azure/o1' | 'azure/gpt-5.2' | 'azure/gpt-5.4-mini' | 'azure/o3' | 'azure/gpt-5.5' | 'azure/gpt-5.2-codex' | 'azure/gpt-4.1' | 'azure/gpt-5.6-terra' | 'azure/o4-mini' | 'azure/gpt-5.4' | 'azure/o3-mini' | 'azure/gpt-5.2-pro' | 'azure/gpt-5.1-codex' | 'azure/gpt-4.1-mini' | 'azure/gpt-5.4-nano' | 'azure/gpt-5.1' | 'runware/deepseek-v4-flash' | 'runware/deepseek-v4-pro' | 'runware/gemma-4-31b-it' | 'runware/gpt-oss-120b' | 'runware/glm-5.2' | 'runware/kimi-k2.6' | 'mistral/ministral-8b-2512' | 'mistral/mistral-large-latest' | 'mistral/devstral-2512' | 'mistral/mistral-small-2506' | 'mistral/mistral-large-2512' | 'mistral/ministral-3b-2512' | 'mistral/ministral-14b-2512' | 'mistral/codestral-2508' | 'vertex-openai/glm-4.7' | 'vertex-openai/deepseek-v3.2' | 'vertex-openai/grok-4-6' | 'vertex-openai/glm-5' | 'vertex-openai/qwen3-next-80b-a3b-thinking' | 'vertex-openai/qwen3-coder-480b-a35b-instruct' | 'vertex-openai/grok-4-20-reasoning' | 'vertex-openai/qwen3-235b-a22b-instruct-2507' | 'vertex-openai/qwen3-next-80b-a3b-instruct' | 'vertex-openai/grok-4-20-non-reasoning' | 'vertex-openai/kimi-k2-thinking' | 'cerebras/glm-4.7' | 'cerebras/llama-3.3-70b-instruct' | 'cerebras/gemma-4-31b-it' | 'cerebras/gpt-oss-120b' | 'cerebras/qwen3-235b-a22b-instruct-2507' | 'baidu/deepseek-v4-flash' | 'baidu/deepseek-v4-pro' | 'baidu/glm-5' | 'baidu/glm-5.3' | 'baidu/glm-5.2' | 'baidu/glm-5.1' | 'baidu/kimi-k2.6' | 'embercloud/glm-4.7' | 'embercloud/qwen3-coder-next' | 'embercloud/glm-5' | 'embercloud/kimi-k2.5' | 'embercloud/glm-5.2' | 'embercloud/glm-4.5-air' | 'embercloud/glm-5.1' | 'embercloud/glm-4.7-flash' | 'embercloud/glm-4.5' | 'groq/gpt-oss-120b' | 'groq/gpt-oss-20b' | 'gonka24/deepseek-v4-flash' | 'gonka24/minimax-m2.7' | 'gonka24/kimi-k2.6' | 'vertex-anthropic/claude-opus-4-7' | 'vertex-anthropic/claude-sonnet-5' | 'vertex-anthropic/claude-sonnet-4-6' | 'vertex-anthropic/claude-sonnet-4-5' | 'vertex-anthropic/claude-opus-4-5-20251101' | 'vertex-anthropic/claude-haiku-4-5' | 'vertex-anthropic/claude-opus-4-6' | 'minimax/minimax-m2.7-highspeed' | 'minimax/minimax-text-01' | 'minimax/minimax-m2.5-highspeed' | 'minimax/minimax-m3' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.1-lightning' | 'minimax/minimax-m2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a LLM Tech Provider
 * @see {@link https://llmtech.eu/models/qwen3.8-27b}
 */
export const createLlmtech = (apiKey: string, baseURL = 'https://api.llmtech.eu/v1') => merge(
  createChatProvider<'unsloth/Qwen3.8-27B-NVFP4'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a LLMTR Provider
 * @see {@link https://llmtr.com/docs}
 */
export const createLlmtr = (apiKey: string, baseURL = 'https://llmtr.com/v1') => merge(
  createChatProvider<'gemma-4' | 'medgemma-4b' | 'trendyol-asure-12b' | 'muse-glimmer-30b-tr' | 'qwen3-6-35b' | 'magibu-11b-v8' | 'google/gemini-2.5-flash-lite' | 'meta/muse-spark-1.2-contributor' | 'poolside/laguna-xs-2.1' | 'qwen/qwen3-vl-plus' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen-plus' | 'qwen/qwen3.5-plus' | 'qwen/qwen3-coder-flash' | 'qwen/qwen3.7-plus' | 'qwen/qwen-flash' | 'qwen/qwen3-max' | 'qwen/qwen3.6-plus' | 'qwen/qwen3-coder-plus' | 'qwen/qwen3.6-flash' | 'sakana/fugu-ultra' | 'perplexity/sonar-deep-research' | 'thinkingmachines/inkling-small' | 'thinkingmachines/inkling' | 'mistral/voxtral-small-latest' | 'publicai/apertus-8b-instruct' | 'publicai/apertus-70b-instruct' | 'upstage/solar-pro2' | 'upstage/solar-pro4' | 'upstage/solar-pro3' | 'mimo/mimo-v2.5' | 'mimo/mimo-v2.5-pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a LMStudio Provider
 * @see {@link https://lmstudio.ai/models}
 */
export const createLmstudio = (apiKey: string, baseURL = 'http://127.0.0.1:1234/v1') => merge(
  createChatProvider<'openai/gpt-oss-20b' | 'qwen/qwen3-30b-a3b-2507' | 'qwen/qwen3-coder-30b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a LongCat Provider
 * @see {@link https://longcat.chat/platform/docs/}
 */
export const createLongcat = (apiKey: string, baseURL = 'https://api.longcat.chat/openai') => merge(
  createChatProvider<'LongCat-2.0'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a LucidQuery Provider
 * @see {@link https://lucidquery.com/docs}
 */
export const createLucidquery = (apiKey: string, baseURL = 'https://api.lucidquery.com/v1') => merge(
  createChatProvider<'lucidnova-rf1-100b' | 'lucidquery-nexus-coder' | 'lucidquery-agi-01-frontier' | 'lucidquery-agi-01-swift'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Lynkr Provider
 * @see {@link https://github.com/Fast-Editor/Lynkr}
 */
export const createLynkr = (apiKey: string, baseURL = 'http://127.0.0.1:8081/v1') => merge(
  createChatProvider<'lynkr-auto'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Meganova Provider
 * @see {@link https://docs.meganova.ai}
 */
export const createMeganova = (apiKey: string, baseURL = 'https://api.meganova.ai/v1') => merge(
  createChatProvider<'XiaomiMiMo/MiMo-V2-Flash' | 'MiniMaxAI/MiniMax-M2.1' | 'MiniMaxAI/MiniMax-M2.5' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2-Thinking' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324' | 'deepseek-ai/DeepSeek-V3.2-Exp' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3.5-Plus' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'zai-org/GLM-4.6' | 'zai-org/GLM-5' | 'zai-org/GLM-4.7' | 'meta-llama/Llama-3.3-70B-Instruct' | 'mistralai/Mistral-Small-3.2-24B-Instruct-2506' | 'mistralai/Mistral-Nemo-Instruct-2407'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Merge Gateway Provider
 * @see {@link https://docs.merge.dev/merge-gateway}
 */
export const createMergeGateway = (apiKey: string, baseURL = 'https://api-gateway.merge.dev/v1/ai-sdk') => merge(
  createChatProvider<'nvidia/nemotron-3.5-lightning-30b-a3b' | 'nvidia/nemotron-nano-9b-v2' | 'deepseek/deepseek-r1' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro-0813' | 'deepseek/deepseek-v3.1' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v3' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-v4-flash-0731' | 'deepseek/deepseek-v4-pro-0423' | 'google/gemma-4-26b-a4b-it' | 'google/gemini-3-pro-image' | 'google/gemini-flash-lite-latest' | 'google/gemini-3.5-flash-lite' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3.1-pro-preview-customtools' | 'google/gemini-2.5-flash-lite' | 'google/gemma-4-31b-it' | 'google/gemini-2.5-computer-use-preview-10-2025' | 'google/gemini-embedding-001' | 'google/gemini-flash-latest' | 'google/gemini-3.5-flash' | 'google/gemini-3.1-flash-lite' | 'google/gemini-2.5-flash' | 'google/gemini-3-pro-preview' | 'google/gemini-3.6-flash' | 'google/gemini-3.1-flash-image' | 'google/gemini-3.1-flash-lite-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-flash-image' | 'google/gemini-2.5-pro' | 'google/gemini-3.7-flash' | 'meta/llama-3.3-70b-instruct' | 'meta/llama-3.1-8b-instruct' | 'meta/muse-spark-1.2' | 'meta/muse-spark-1.1' | 'moonshotai/kimi-k2-thinking' | 'anthropic/claude-opus-4-20250514' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-opus-4-1-20250805' | 'anthropic/claude-opus-4-8' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-3-7-sonnet-20250219' | 'anthropic/claude-sonnet-4-5-20250929' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-haiku-4-5-20251001' | 'anthropic/claude-opus-4-5-20251101' | 'anthropic/claude-fable-5' | 'anthropic/claude-sonnet-4-20250514' | 'anthropic/claude-opus-4-6' | 'anthropic/claude-opus-5' | 'cohere/command-r-plus-08-2024' | 'cohere/command-a-03-2025' | 'cohere/command-r7b-12-2024' | 'cohere/command-r-08-2024' | 'zai/glm-4.6' | 'zai/glm-4.7' | 'zai/glm-4.5v' | 'zai/glm-4.7-flashx' | 'zai/glm-5' | 'zai/glm-5-turbo' | 'zai/glm-5.3' | 'zai/glm-5.2' | 'zai/glm-4.5-air' | 'zai/glm-5.1' | 'zai/glm-4.7-flash' | 'zai/glm-4.5' | 'zai/glm-5.3-flash' | 'bytedance/dola-seed-2.0-pro' | 'bytedance/dola-seed-2.0-mini' | 'bytedance/dola-seed-2.0-lite' | 'bytedance/dola-seed-2.0-code' | 'bytedance/dola-seed-2.0-code-preview' | 'openai/gpt-4o' | 'openai/gpt-5.3-chat-latest' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/gpt-3.5-turbo' | 'openai/gpt-4-turbo' | 'openai/gpt-4' | 'openai/gpt-5-chat-latest' | 'openai/gpt-5.6-sol' | 'openai/gpt-5' | 'openai/gpt-5-mini' | 'openai/gpt-5.6-luna' | 'openai/gpt-oss-120b' | 'openai/gpt-4.1-nano' | 'openai/o1' | 'openai/gpt-5.2' | 'openai/gpt-5.4-mini' | 'openai/gpt-4o-2024-05-13' | 'openai/o3' | 'openai/gpt-5.5' | 'openai/gpt-4.1' | 'openai/gpt-4o-2024-08-06' | 'openai/gpt-5.6-terra' | 'openai/o4-mini' | 'openai/gpt-5.4' | 'openai/o3-mini' | 'openai/gpt-4o-2024-11-20' | 'openai/gpt-oss-safeguard-120b' | 'openai/gpt-5.2-chat-latest' | 'openai/gpt-5.1-chat-latest' | 'openai/gpt-4.1-mini' | 'openai/gpt-oss-20b' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'xai/grok-4.6' | 'xai/grok-4.5' | 'xai/grok-4.20-0309-non-reasoning' | 'xai/grok-4.20-0309-reasoning' | 'xai/grok-build-0.1' | 'xai/grok-4.3' | 'qwen/qwen3-vl-plus' | 'qwen/qwen3.7-max' | 'qwen/qwen3-32b' | 'qwen/qwen3-235b-a22b' | 'qwen/qwen3.5-35b-a3b' | 'qwen/qwen3-vl-235b-a22b-thinking' | 'qwen/qwen3-30b-a3b' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen3.5-flash' | 'qwen/qwen-plus' | 'qwen/qwen3-coder-next' | 'qwen/qwen3.5-plus' | 'qwen/qwen3-coder-flash' | 'qwen/qwen3.6-max-preview' | 'qwen/qwen3.8-max' | 'qwen/qwen3.7-plus' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen-flash' | 'qwen/qwen3-max' | 'qwen/qwen3.6-35b-a3b' | 'qwen/qwen3-235b-a22b-instruct-2507' | 'qwen/qwen3.6-27b' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3.6-plus' | 'qwen/qwen3.5-9b' | 'qwen/qwen3.5-27b' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen3-coder-plus' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'qwen/qwen3.6-flash' | 'qwen/qwen3.8-2.4t-a95b' | 'sakana/sakana-namazu' | 'sakana/fugu-ultra' | 'moonshot/kimi-k2.7-code' | 'moonshot/kimi-k3' | 'moonshot/kimi-k2.5' | 'moonshot/kimi-k2.7-code-highspeed' | 'moonshot/kimi-k2.6' | 'thinkingmachines/inkling' | 'writer/palmyra-x5' | 'writer/palmyra-x4' | 'mistral/mistral-small-latest' | 'mistral/devstral-medium-2507' | 'mistral/mistral-large-2411' | 'mistral/mistral-large-latest' | 'mistral/devstral-small-2507' | 'mistral/devstral-2512' | 'mistral/pixtral-large-latest' | 'mistral/mistral-large-2512' | 'mistral/mistral-medium-2505' | 'mistral/devstral-medium-latest' | 'mistral/codestral-latest' | 'mistral/magistral-medium-latest' | 'mistral/mistral-medium-latest' | 'minimax/minimax-m2.7-highspeed' | 'minimax/minimax-m2.5-highspeed' | 'minimax/minimax-m3' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Meta Provider
 * @see {@link https://dev.meta.ai/docs}
 */
export const createMeta = (apiKey: string, baseURL = 'https://api.meta.ai/v1') => merge(
  createChatProvider<'muse-spark-1.2' | 'muse-spark-1.1' | 'muse-spark-1.2-contributor'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax (minimax.io) Provider
 * @see {@link https://platform.minimax.io/docs/guides/quickstart}
 */
export const createMinimax = (apiKey: string, baseURL = 'https://api.minimax.io/v1/') => merge(
  createChatProvider<'MiniMax-M2.7' | 'MiniMax-M2.7-highspeed' | 'MiniMax-M2.1' | 'MiniMax-M2' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M3' | 'MiniMax-M2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax (minimaxi.com) Provider
 * @see {@link https://platform.minimaxi.com/docs/guides/quickstart}
 */
export const createMinimaxCn = (apiKey: string, baseURL = 'https://api.minimaxi.com/v1/') => merge(
  createChatProvider<'MiniMax-M2.7' | 'MiniMax-M2.7-highspeed' | 'MiniMax-M2.1' | 'MiniMax-M2' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M3' | 'MiniMax-M2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax Token Plan (minimaxi.com) Provider
 * @see {@link https://platform.minimaxi.com/docs/token-plan/intro}
 */
export const createMinimaxCnCodingPlan = (apiKey: string, baseURL = 'https://api.minimaxi.com/anthropic/v1') => merge(
  createChatProvider<'MiniMax-M2.7' | 'MiniMax-M2.7-highspeed' | 'MiniMax-M2.1' | 'MiniMax-M2' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M3' | 'MiniMax-M2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax Token Plan (minimax.io) Provider
 * @see {@link https://platform.minimax.io/docs/token-plan/intro}
 */
export const createMinimaxCodingPlan = (apiKey: string, baseURL = 'https://api.minimax.io/anthropic/v1') => merge(
  createChatProvider<'MiniMax-M2.7' | 'MiniMax-M2.7-highspeed' | 'MiniMax-M2.1' | 'MiniMax-M2' | 'MiniMax-M2.5-highspeed' | 'MiniMax-M3' | 'MiniMax-M2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Mistral Provider
 * @see {@link https://docs.mistral.ai/getting-started/models/}
 */
export const createMistral = (apiKey: string, baseURL = 'https://api.mistral.ai/v1/') => merge(
  createChatProvider<'mistral-medium-2508' | 'mistral-small-latest' | 'devstral-medium-2507' | 'open-mixtral-8x7b' | 'mistral-large-2411' | 'mistral-nemo' | 'devstral-latest' | 'mistral-large-latest' | 'devstral-small-2507' | 'devstral-2512' | 'labs-devstral-small-2512' | 'open-mistral-nemo' | 'mistral-small-2603' | 'magistral-small' | 'voxtral-mini-latest' | 'mistral-small-2506' | 'pixtral-large-latest' | 'mistral-large-2512' | 'ministral-3b-latest' | 'mistral-medium-2604' | 'devstral-small-2505' | 'ministral-8b-latest' | 'mistral-medium-2505' | 'devstral-medium-latest' | 'open-mistral-7b' | 'voxtral-mini-tts-latest' | 'pixtral-12b' | 'voxtral-small-latest' | 'codestral-latest' | 'zai-glm-5-2' | 'open-mixtral-8x22b' | 'magistral-medium-latest' | 'mistral-embed' | 'mistral-medium-latest'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Mixlayer Provider
 * @see {@link https://docs.mixlayer.com}
 */
export const createMixlayer = (apiKey: string, baseURL = 'https://models.mixlayer.ai/v1') => merge(
  createChatProvider<'qwen/qwen3.5-35b-a3b' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen3.5-9b' | 'qwen/qwen3.5-27b' | 'qwen/qwen3.5-122b-a10b'>({ apiKey, baseURL }),
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
 * Create a Modal Provider
 * @see {@link https://modal.com/docs/guide/endpoints}
 */
export const createModal = (apiKey: string, baseURL = 'https://inference.us-west.modal.direct/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K3' | 'Qwen/Qwen3.8-2.4T-A95B' | 'zai-org/GLM-5.3-Flash' | 'thinkingmachines/Inkling-NVFP4'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Model Oracle AI Provider
 * @see {@link https://modeloracle.com/setup/}
 */
export const createModelOracleAi = (apiKey: string, baseURL = 'https://api.modeloracle.com/api/v1') => merge(
  createChatProvider<'claude-opus-4.8' | 'auto' | 'gpt-5' | 'deepseek-v4-pro' | 'claude-sonnet-5' | 'claude-haiku-4.5' | 'gpt-5.4-mini' | 'gpt-5.5' | 'glm-5.2' | 'gpt-4.1' | 'o4-mini' | 'gpt-5.4' | 'claude-fable-5' | 'gpt-4.1-mini' | 'gpt-5.4-nano'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Modelis Provider
 * @see {@link https://modelishub.com/pricing}
 */
export const createModelis = (apiKey: string, baseURL = 'https://modelishub.com/v1') => merge(
  createChatProvider<'deepseek-v4-flash' | 'claude-opus-4-8' | 'deepseek-v4-pro' | 'claude-sonnet-4-6' | 'gemini-2.5-flash' | 'claude-fable-5' | 'gemini-2.5-pro' | 'qwen/qwen3.7-max' | 'qwen/qwen3.7-plus'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a ModelScope Provider
 * @see {@link https://modelscope.cn/docs/model-service/API-Inference/intro}
 */
export const createModelscope = (apiKey: string, baseURL = 'https://api-inference.modelscope.cn/v1') => merge(
  createChatProvider<'ZhipuAI/GLM-4.5' | 'ZhipuAI/GLM-4.6' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3-30B-A3B-Thinking-2507' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-235B-A22B-Thinking-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Moonshot AI Provider
 * @see {@link https://platform.moonshot.ai/docs/api/chat}
 */
export const createMoonshotai = (apiKey: string, baseURL = 'https://api.moonshot.ai/v1') => merge(
  createChatProvider<'kimi-k2.7-code' | 'kimi-k3' | 'kimi-k2-0711-preview' | 'kimi-k2-thinking-turbo' | 'kimi-k2.5' | 'kimi-k2-0905-preview' | 'kimi-k2-turbo-preview' | 'kimi-k2.7-code-highspeed' | 'kimi-k2-thinking' | 'kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Moonshot AI (China) Provider
 * @see {@link https://platform.moonshot.cn/docs/api/chat}
 */
export const createMoonshotaiCn = (apiKey: string, baseURL = 'https://api.moonshot.cn/v1') => merge(
  createChatProvider<'kimi-k2.6' | 'kimi-k2-thinking' | 'kimi-k2.7-code-highspeed' | 'kimi-k2-turbo-preview' | 'kimi-k2-0905-preview' | 'kimi-k2.5' | 'kimi-k2-thinking-turbo' | 'kimi-k2-0711-preview' | 'kimi-k3' | 'kimi-k2.7-code'>({ apiKey, baseURL }),
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
  createChatProvider<'gemini-exp-1206' | 'claude-sonnet-4-5-20250929-thinking' | 'gemini-2.5-flash-lite-preview-06-17' | 'claude-opus-4-20250514' | 'gemini-2.5-pro-preview-05-06' | 'auto-model' | 'claw-low' | 'doubao-seed-2-0-pro-260215' | 'jamba-large-1.6' | 'glm-4-air-0111' | 'claude-opus-4-thinking:32000' | 'doubao-1.5-vision-pro-32k' | 'celeris-1' | 'qwen3-coder-30b-a3b-instruct' | 'qwen3.7-max' | 'Gemma-4-31B-GarnetV2' | 'claude-opus-4-1-20250805' | 'deepseek-r1' | 'Gemma-4-31B-MeroMero-v2' | 'gemini-3-pro-image-preview' | 'Gemma-4-31B-Queen' | 'qwen-turbo' | 'claude-opus-4-thinking:32768' | 'venice-uncensored' | 'gemini-2.5-flash-preview-04-17:thinking' | 'deepseek-v3-0324' | 'glm-4-airx' | 'gemma-4-12b-it' | 'brave-pro' | 'gemini-2.5-flash-preview-09-2025' | 'gemini-2.5-flash-lite-preview-09-2025' | 'azure-o3-mini' | 'Meta-Llama-3-1-8B-Instruct-FP8' | 'claude-sonnet-4-thinking:1024' | 'perplexity-academic-researcher' | 'jamba-mini-1.7' | 'sonar-deep-research' | 'MiniMax-M2' | 'gemini-2.5-pro-exp-03-25' | 'qwen3.8-max:thinking' | 'learnlm-1.5-pro-experimental' | 'glm-4.1v-thinking-flashx' | 'azure-o1' | 'glm-z1-air' | 'qwen3.5-omni-flash' | 'claude-opus-4-1-thinking' | 'deepseek-reasoner-cheaper' | 'qwen3-vl-235b-a22b-instruct-original' | 'qwen-max' | 'sonar' | 'qwen3.5-35b-a3b' | 'glm-4-long' | 'gemini-2.5-flash-preview-05-20' | 'longcat-2.0:thinking' | 'qwen3-vl-235b-a22b-thinking' | 'doubao-seed-1-6-250615' | 'qwen3.5-flash' | 'glm-zero-preview' | 'gemini-2.5-pro-preview-03-25' | 'jamba-mini' | 'gemini-2.5-flash-preview-09-2025-thinking' | 'glm-4.1v-thinking-flash' | 'qwen-plus' | 'mercury-coder-small' | 'jamba-large-1.7' | 'doubao-1.5-pro-256k' | 'holo3-35b-a3b:thinking' | 'Baichuan4-Air' | 'azure-gpt-4o' | 'glm-z1-airx' | 'gemini-2.5-flash-lite' | 'ernie-5.0-thinking-preview' | 'command-a-reasoning-08-2025' | 'mercury-2' | 'fastgpt' | 'deepseek-chat' | 'auto-model-basic' | 'Baichuan4-Turbo' | 'claude-opus-4-1-thinking:1024' | 'yi-medium-200k' | 'claude-sonnet-4-thinking' | 'abliterated-model-large' | 'deepclaude' | 'glm-4-air' | 'gemini-2.0-pro-reasoner' | 'claude-opus-4-5-20251101:thinking' | 'qwen3.6-max-preview' | 'mistral-small-31-24b-instruct' | 'qwen3.5-2b' | 'Qwen3.5-27B-BlueStar-v3-Derestricted' | 'qwen3.8-max' | 'gemini-2.5-pro-preview-06-05' | 'claude-sonnet-4-5-20250929' | 'sarvam-105b' | 'azure-gpt-4-turbo' | 'auto-model-premium' | 'qwen3-30b-a3b-instruct-2507' | 'deepseek-r1-sambanova' | 'qwen3.7-plus' | 'qwen3.7-max:thinking' | 'qwen3.5-0.8b' | 'claude-opus-4-1-thinking:32000' | 'jamba-large' | 'claude-sonnet-4-thinking:64000' | 'claude-opus-4-thinking' | 'qwen3.7-flash' | 'MiniMax-M1' | 'Qwen3.5-27B-Queen-Derestricted' | 'doubao-seed-2-0-code-preview-260215' | 'exa-answer' | 'phi-4-multimodal-instruct' | 'ernie-5.1' | 'step-r1-v-mini' | 'azure-gpt-4o-mini' | 'kimi-k2-instruct-fast' | 'hermes-high' | 'qwen3.7-plus:thinking' | 'deepseek-chat-cheaper' | 'sonar-reasoning-pro' | 'auto-model-standard' | 'gemini-2.0-pro-exp-02-05' | 'qwen3.8-27b:thinking' | 'gemini-2.5-flash' | 'glm-4-plus' | 'hunyuan-turbos-20250226' | 'ernie-5.1:thinking' | 'hermes-low' | 'command-a-plus-05-2026' | 'doubao-seed-2-0-mini-260215' | 'gemini-2.5-flash-lite-preview-09-2025-thinking' | 'doubao-1.5-pro-32k' | 'holo3-35b-a3b' | 'claude-haiku-4-5-20251001' | 'claw-medium' | 'gemma-4-e2b-it' | 'hermes-medium' | 'sonar-pro' | 'qwen3.7-flash:thinking' | 'claude-opus-4-1-thinking:8192' | 'qwen3.5-4b' | 'deepseek-reasoner' | 'mistral-code-agent-latest' | 'claude-opus-4-thinking:1024' | 'Gemma-4-31B-MeroMero-v2:thinking' | 'gemini-2.5-flash-preview-05-20:thinking' | 'qvq-max' | 'longcat-2.0' | 'Gemma-4-31B-Claude-4.6-Opus-Reasoning-Distilled' | 'Gemma-4-31B-Cognitive-Unshackled' | 'qwen-long' | 'brave-research' | 'qwen3.8-27b' | 'glm-4-plus-0111' | 'mistral-code-latest' | 'qwen3.5-flash:thinking' | 'glm-4-flash' | 'qwen3.5-27b:thinking' | 'claude-opus-4-5-20251101' | 'claude-sonnet-4-thinking:8192' | 'nano-gpt-help' | 'qwen3.5-27b' | 'claude-opus-4-1-thinking:32768' | 'jamba-mini-1.6' | 'claude-opus-4-thinking:8192' | 'asi1-mini' | 'qwen25-vl-72b-instruct' | 'claude-sonnet-4-20250514' | 'claude-sonnet-4-thinking:32768' | 'qwen3.5-omni-plus' | 'doubao-seed-2-0-lite-260215' | 'qwen3-max-2026-01-23' | 'claw-high' | 'qwen3.5-122b-a10b' | 'ernie-x1.1-preview' | 'qwen-3.6-plus' | 'yi-large' | 'gemini-2.5-flash-nothinking' | 'gemini-2.5-pro' | 'Gemma-4-26B-A4B-MeroMero' | 'gemini-2.5-flash-preview-04-17' | 'GLM-4.6-Derestricted-v5' | 'glm-4' | 'gemma-4-e4b-it' | 'Gemma-4-26B-A4B-MeroMero:thinking' | 'phi-4-mini-instruct' | 'universal-summarizer' | 'qwen3.5-122b-a10b:thinking' | 'claude-haiku-4-5-20251001-thinking' | 'abliterated-model' | 'pokee-isaac' | 'brave' | 'sarvam-30b' | 'Gemma-4-31B-DarkIdol' | 'doubao-seed-1-6-flash-250615' | 'qwen3.5-35b-a3b:thinking' | 'deepcogito/cogito-v1-preview-qwen-32B' | 'tencent/Hunyuan-MT-7B' | 'tencent/hy4-preview' | 'tencent/hy3' | 'Doctor-Shotgun/MS3.2-24B-Magnum-Diamond' | 'MiniMaxAI/MiniMax-M1-80k' | 'nothingiisreal/L3.1-70B-Celeste-V0.1-BF16' | 'LatitudeGames/Wayfarer-Large-70B-Llama-3.3' | 'nanogpt/coding-router:low' | 'nanogpt/coding-router:high' | 'nanogpt/coding-router' | 'nanogpt/coding-router:medium' | 'nanogpt/coding-router:max' | 'ReadyArt/MS3.2-The-Omega-Directive-24B-Unslop-v2.0' | 'nvidia/nemotron-3-nano-30b-a3b' | 'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF' | 'nvidia/nemotron-3-super-120b-a12b' | 'nvidia/nemotron-3-super-120b-a12b:thinking' | 'nvidia/nemotron-3-ultra-550b-a55b:thinking' | 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning' | 'nvidia/nemotron-3.5-lightning' | 'nvidia/nemotron-3-ultra-550b-a55b' | 'nvidia/Llama-3.3-Nemotron-Super-49B-v1' | 'nvidia/nemotron-3.5-lightning:thinking' | 'aion-labs/aion-3.0' | 'aion-labs/aion-rp-llama-3.1-8b' | 'aion-labs/aion-2.0' | 'aion-labs/aion-3.0-mini' | 'undi95/remm-slerp-l2-13b' | 'microsoft/wizardlm-2-8x22b' | 'z-ai/glm-4.6' | 'z-ai/glm-5v-turbo' | 'z-ai/glm-4.5v' | 'z-ai/glm-4.6:thinking' | 'z-ai/glm-4.5v:thinking' | 'z-ai/glm-5-turbo' | 'z-ai/glm-5.3-flash-uncensored' | 'z-ai/glm-5v-turbo:thinking' | 'z-ai/glm-5.3-flash' | 'deepseek/deepseek-v4-flash:thinking' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro:thinking' | 'deepseek/deepseek-v4-pro-0813' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-v3.2:thinking' | 'deepseek/deepseek-prover-v2-671b' | 'deepseek/deepseek-latest' | 'deepseek/deepseek-v4-flash-0731:thinking' | 'deepseek/deepseek-v4-flash-latest' | 'deepseek/deepseek-v4-flash-0731' | 'deepseek/deepseek-v4-flash-vision-exp' | 'deepseek/deepseek-v4-pro-0813:thinking' | 'arcee-ai/trinity-large-thinking' | 'google/gemma-4-26b-a4b-it:thinking' | 'google/gemma-4-26b-a4b-it' | 'google/gemma-4-26b-a4b-it-moonlight' | 'google/gemma-4-26b-a4b-it-luminous' | 'google/gemini-flash-lite-latest' | 'google/gemini-3.1-pro-preview-low' | 'google/gemini-3.5-flash-lite' | 'google/gemma-4-31b-it-isometry' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3.1-pro-preview-customtools' | 'google/gemma-4-31b-it' | 'google/gemini-3.5-flash-thinking' | 'google/gemma-4-26b-a4b-it-musica' | 'google/gemma-4-26b-a4b-it-opusdistill' | 'google/gemma-4-31b-it-darkidol' | 'google/gemma-4-26b-a4b-uncensored:thinking' | 'google/gemma-4-26b-a4b-it-shadowsiren' | 'google/gemini-flash-latest' | 'google/gemma-4-31b-it-novelist' | 'google/gemini-3.5-flash' | 'google/gemini-3.1-flash-lite' | 'google/gemini-3-flash-preview-thinking' | 'google/gemma-4-26b-a4b-it-chimerax' | 'google/gemini-3.6-flash' | 'google/gemini-pro-latest' | 'google/gemma-4-26b-a4b-uncensored' | 'google/gemma-4-31b-it:thinking' | 'google/gemma-4-31b-it-fabled' | 'google/gemma-4-31b-it-gemsicle' | 'google/gemini-3.1-pro-preview-high' | 'google/gemma-4-31b-it-garnet' | 'google/gemini-3-flash-preview' | 'google/gemma-4-26b-a4b-it-darksoul' | 'google/gemini-3.7-flash' | 'google/gemma-4-31b-it-gembrain' | 'meta/muse-glimmer-30b' | 'meta/muse-spark-1.2' | 'meta/muse-spark-1.1' | 'meta/muse-spark-1.2-contributor' | 'soob3123/Veiled-Calla-12B' | 'soob3123/amoral-gemma3-27B-v2' | 'soob3123/GrayLine-Qwen3-8B' | 'poolside/laguna-s-2.1:thinking' | 'poolside/laguna-s-2.1' | 'x-ai/grok-4.20' | 'x-ai/grok-4.6' | 'x-ai/grok-4.5' | 'x-ai/grok-latest' | 'x-ai/grok-4.20-multi-agent' | 'x-ai/grok-build-0.1' | 'x-ai/grok-4.3' | 'perceptron/perceptron-mk1' | 'bytedance-seed/seed-2.0-code' | 'bytedance-seed/seed-2.0-lite' | 'bytedance-seed/seed-2-1-turbo' | 'moonshotai/kimi-k2.7-code' | 'moonshotai/kimi-k3' | 'moonshotai/kimi-latest' | 'moonshotai/kimi-k2-instruct' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/kimi-k2.5:thinking' | 'moonshotai/kimi-k2.6:thinking' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2.7-code-highspeed' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.6' | 'moonshotai/kimi-k2-instruct-0711' | 'unsloth/gemma-3-4b-it' | 'unsloth/gemma-3-27b-it' | 'unsloth/gemma-3-12b-it' | 'featherless-ai/Qwerky-72B' | 'TheDrummer/UnslopNemo-12B-v4.1' | 'TheDrummer/Anubis-70B-v1.1' | 'TheDrummer/Anubis-70B-v1' | 'TheDrummer/Cydonia-24B-v4.3' | 'TheDrummer/skyfall-36b-v2' | 'TheDrummer/Rocinante-12B-v1.1' | 'TheDrummer/Cydonia-24B-v2' | 'TheDrummer/Cydonia-24B-v4.1' | 'TheDrummer/Cydonia-24B-v4' | 'TheDrummer/Magidonia-24B-v4.3' | 'anthropic/claude-opus-4.8' | 'anthropic/claude-opus-4.6:thinking' | 'anthropic/claude-opus-4.8:thinking' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-opus-4.6:thinking:low' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-opus-4.7' | 'anthropic/claude-opus-4.7:thinking' | 'anthropic/claude-haiku-latest' | 'anthropic/claude-opus-latest' | 'anthropic/claude-opus-4.6:thinking:max' | 'anthropic/claude-sonnet-latest' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-sonnet-4.6:thinking' | 'anthropic/claude-fable-latest' | 'anthropic/claude-fable-5' | 'anthropic/claude-opus-5' | 'anthropic/claude-sonnet-5:thinking' | 'anthropic/claude-opus-4.6:thinking:medium' | 'cohere/command-r-plus-08-2024' | 'cohere/north-mini-code' | 'EVA-UNIT-01/EVA-LLaMA-3.33-70B-v0.1' | 'EVA-UNIT-01/EVA-Qwen2.5-32B-v0.2' | 'EVA-UNIT-01/EVA-Qwen2.5-72B-v0.2' | 'EVA-UNIT-01/EVA-LLaMA-3.33-70B-v0.0' | 'bytedance/doubao-seed-2.1-pro' | 'bytedance/doubao-seed-character' | 'bytedance/doubao-seed-2.1-turbo' | 'LLM360/K2-Think' | 'huihui-ai/DeepSeek-R1-Distill-Qwen-32B-abliterated' | 'huihui-ai/Qwen2.5-32B-Instruct-abliterated' | 'huihui-ai/Llama-3.3-70B-Instruct-abliterated' | 'huihui-ai/DeepSeek-R1-Distill-Llama-70B-abliterated' | 'Salesforce/Llama-xLAM-2-70b-fc-r' | 'openai/gpt-4o' | 'openai/o3-mini-low' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/gpt-3.5-turbo' | 'openai/o1-pro' | 'openai/gpt-4-turbo-preview' | 'openai/gpt-4-turbo' | 'openai/gpt-5.6-sol' | 'openai/o3-deep-research' | 'openai/gpt-5' | 'openai/o4-mini-high' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5-codex' | 'openai/gpt-5-mini' | 'openai/gpt-5.6-luna' | 'openai/gpt-5.6-luna-pro' | 'openai/gpt-5.3-codex' | 'openai/gpt-oss-120b' | 'openai/gpt-4.1-nano' | 'openai/o1' | 'openai/gpt-5.2' | 'openai/gpt-5.4-mini' | 'openai/o3' | 'openai/gpt-chat-latest' | 'openai/o4-mini-deep-research' | 'openai/gpt-5-pro' | 'openai/gpt-5.5' | 'openai/gpt-4o-search-preview' | 'openai/o3-mini-high' | 'openai/gpt-5.1-2025-11-13' | 'openai/gpt-5.2-codex' | 'openai/gpt-latest' | 'openai/gpt-4.1' | 'openai/gpt-4o-2024-08-06' | 'openai/o3-pro-2025-06-10' | 'openai/gpt-5.6-terra-pro' | 'openai/gpt-5.6-terra' | 'openai/o4-mini' | 'openai/gpt-5.4' | 'openai/o3-mini' | 'openai/gpt-4o-2024-11-20' | 'openai/gpt-5.6-sol-pro' | 'openai/gpt-4o-mini-search-preview' | 'openai/o1-preview' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-5.1-codex' | 'openai/gpt-oss-safeguard-20b' | 'openai/gpt-4.1-mini' | 'openai/gpt-oss-20b' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'Tongyi-Zhiwen/QwenLong-L1-32B' | 'Steelskull/L3.3-MS-Evayale-70B' | 'Steelskull/L3.3-Nevoria-R1-70b' | 'Steelskull/L3.3-MS-Nevoria-70b' | 'Steelskull/L3.3-Electra-R1-70b' | 'Steelskull/L3.3-Cu-Mai-R1-70b' | 'deepseek-ai/DeepSeek-V3.1-Terminus:thinking' | 'deepseek-ai/deepseek-v3.2-exp-thinking' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3.1:thinking' | 'deepseek-ai/deepseek-v3.2-exp' | 'stepfun-ai/step-3.5-flash-2603' | 'stepfun-ai/step-3.5-flash' | 'MarinaraSpaghetti/NemoMix-Unleashed-12B' | 'dmind/dmind-1-mini' | 'ornith-ai/ornith-1.5-397b' | 'ornith-ai/ornith-1.5-35b-a3b' | 'ornith-ai/ornith-1.5-35b-a3b:thinking' | 'ornith-ai/ornith-1.5-9b:thinking' | 'ornith-ai/ornith-1.5-9b' | 'ornith-ai/ornith-1.5-397b:thinking' | 'shisa-ai/shisa-v2.1-llama3.3-70b' | 'shisa-ai/shisa-v2-llama3.3-70b' | 'NousResearch/Hermes-4-70B:thinking' | 'NousResearch/hermes-4-405b:thinking' | 'NousResearch/hermes-3-llama-3.1-70b' | 'NousResearch/hermes-4-70b' | 'NousResearch/hermes-4-405b' | 'stepfun/step-3.7-flash:thinking' | 'Sao10K/L3.3-70B-Euryale-v2.3' | 'Sao10K/L3.1-70B-Hanami-x1' | 'Sao10K/L3.1-70B-Euryale-v2.2' | 'Sao10K/L3-8B-Stheno-v3.2' | 'failspy/Meta-Llama-3-70B-Instruct-abliterated-v3.5' | 'qwen/Qwen3-235B-A22B-Instruct-2507' | 'qwen/qwen3.8-27b-obliterated' | 'qwen/Qwen3-VL-235B-A22B-Instruct' | 'qwen/qwen3.8-27b-fable' | 'qwen/qwen3-32b' | 'qwen/qwen3-235b-a22b' | 'qwen/qwen3-30b-a3b' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen3-coder-next' | 'qwen/qwen3.5-plus' | 'qwen/qwen3.5-397b-a17b-thinking' | 'qwen/qwen3.8-27b-uncensored:thinking' | 'qwen/qwen3-coder-flash' | 'qwen/Qwen3-8B' | 'qwen/qwen3.8-27b-uncensored' | 'qwen/qwen3.5-plus-thinking' | 'qwen/qwen3-coder' | 'qwen/Qwen2.5-Coder-32B-Instruct' | 'qwen/qwen3-14b' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-max' | 'qwen/Qwen3.6-35B-A3B:thinking' | 'qwen/Qwen3-235B-A22B-Thinking-2507' | 'qwen/qwen3.5-9b' | 'qwen/qwen3.6-35b-a3b-uncensored' | 'qwen/Qwen3.6-35B-A3B' | 'qwen/qwen3.6-35b-a3b-uncensored:thinking' | 'qwen/qwen3.8-27b-obliterated:thinking' | 'qwen/qwen3-coder-plus' | 'qwen/qwen-2.5-72b-instruct' | 'qwen/qwen3.8-2.4t-a95b' | 'qwen/Qwen3-Next-80B-A3B-Instruct' | 'liquid/lfm-2.5-2.6b' | 'inflatebot/MN-12B-Mag-Mell-R1' | 'xiaomi/mimo-v2.5:thinking' | 'xiaomi/mimo-v2.5' | 'xiaomi/mimo-v2.5-pro-crof' | 'xiaomi/mimo-v2.5-pro-crof:thinking' | 'xiaomi/mimo-v2.5-pro' | 'xiaomi/mimo-v2.5-pro:thinking' | 'alibaba/qwen3.8-flash' | 'alibaba/qwen3.6-27b' | 'alibaba/qwen3.6-27b:thinking' | 'alibaba/qwen3.6-flash' | 'mlabonne/NeuralDaredevil-8B-abliterated' | 'sakana/fugu-ultra' | 'sakana/fugu-ultra-v1.1' | 'Envoid/Llama-3.05-NT-Storybreaker-Ministral-70B' | 'Envoid/Llama-3.05-Nemotron-Tenyxchat-Storybreaker-70B' | 'meganova-ai/manta-mini-1.0' | 'meganova-ai/manta-flash-1.0' | 'meganova-ai/manta-pro-1.0' | 'abacusai/Dracarys-72B-Instruct' | 'VongolaChouko/Starcannon-Unleashed-12B-v1.0' | 'zai-org/glm-5.3:thinking' | 'zai-org/glm-5-original:thinking' | 'zai-org/glm-4.7-flash:thinking' | 'zai-org/GLM-4.5-Air:thinking' | 'zai-org/glm-5.1:thinking' | 'zai-org/glm-4.7' | 'zai-org/glm-4.6v-original' | 'zai-org/GLM-4.6-turbo' | 'zai-org/glm-5:thinking' | 'zai-org/glm-4.6v-flash-original' | 'zai-org/glm-4.7:thinking' | 'zai-org/GLM-4.5-Air' | 'zai-org/glm-5' | 'zai-org/glm-4.7-flash-original' | 'zai-org/glm-latest' | 'zai-org/glm-5.3' | 'zai-org/glm-4.7-flash-original:thinking' | 'zai-org/glm-5.2' | 'zai-org/glm-4.6v' | 'zai-org/GLM-4.5:thinking' | 'zai-org/glm-4.6-original' | 'zai-org/glm-5-original' | 'zai-org/GLM-4.6-turbo:thinking' | 'zai-org/glm-5.1' | 'zai-org/glm-5.2:thinking' | 'zai-org/glm-4.7-original' | 'zai-org/glm-4.7-flash' | 'zai-org/glm-4.7-original:thinking' | 'zai-org/glm-4.5' | 'Gryphe/MythoMax-L2-13b' | 'chutesai/Mistral-Small-3.2-24B-Instruct-2506' | 'thinkingmachines/Inkling-Small:thinking' | 'thinkingmachines/inkling' | 'thinkingmachines/inkling:thinking' | 'thinkingmachines/Inkling-Small' | 'baseten/Kimi-K2-Instruct-FP4' | 'inflection/inflection-3-productivity' | 'inclusionai/ling-3.0-flash' | 'inclusionai/ling-3.0-flash:thinking' | 'mistral/mistral-medium-3.5:thinking' | 'mistral/mistral-medium-3.5' | 'meta-llama/llama-3.2-3b-instruct' | 'meta-llama/llama-3.3-70b-instruct' | 'meta-llama/llama-3.1-8b-instruct' | 'meta-llama/llama-4-maverick' | 'meta-llama/llama-4-scout' | 'mistralai/ministral-8b-2512' | 'mistralai/mixtral-8x22b-instruct-v0.1' | 'mistralai/mistral-medium-3.1' | 'mistralai/devstral-2-123b-instruct-2512' | 'mistralai/mistral-large-3-675b-instruct-2512' | 'mistralai/mistral-small-4-119b-2603:thinking' | 'mistralai/mistral-small-4-119b-2603' | 'mistralai/ministral-3b-2512' | 'mistralai/mistral-medium-3' | 'mistralai/mistral-large' | 'mistralai/Devstral-Small-2505' | 'mistralai/ministral-14b-2512' | 'mistralai/Mistral-Nemo-Instruct-2407' | 'mistralai/codestral-2508' | 'mistralai/ministral-14b-instruct-2512' | 'mistralai/mistral-saba' | 'crofai/greg-2-ultra' | 'crofai/greg-2-super' | 'amazon/nova-pro-v1' | 'amazon/nova-2-lite-v1' | 'amazon/nova-lite-v1' | 'GalrionSoftworks/MN-LooseCannon-12B-v1' | 'anthracite-org/magnum-v4-72b' | 'anthracite-org/magnum-v2-72b' | 'nex-agi/nex-n2-mini' | 'nex-agi/nex-n2-pro' | 'upstage/solar-pro-3' | 'upstage/solar-pro4:thinking' | 'upstage/solar-pro4' | 'NeverSleep/Lumimaid-v0.2-70B' | 'THUDM/GLM-4-9B-0414' | 'THUDM/GLM-Z1-9B-0414' | 'THUDM/GLM-4-32B-0414' | 'pamanseau/OpenReasoning-Nemotron-32B' | 'kwaipilot/kat-coder-pro-v2.5' | 'kwaipilot/kat-coder-air-v2.5' | 'kwaipilot/kat-coder-pro-v2' | 'ibm-granite/granite-4.1-8b' | 'TEE/qwen2.5-vl-72b-instruct' | 'TEE/kimi-k2.7-code' | 'TEE/kimi-k3' | 'TEE/glm-4.7' | 'TEE/deepseek-v4-flash' | 'TEE/llama3-3-70b' | 'TEE/gemma4-31b' | 'TEE/qwen3.5-397b-a17b' | 'TEE/glm-5.1-thinking' | 'TEE/deepseek-v3.2' | 'TEE/gemma-4-31b-it' | 'TEE/muse-glimmer-30b' | 'TEE/gpt-oss-120b' | 'TEE/glm-5.2' | 'TEE/gemma4-31b:thinking' | 'TEE/qwen3.6-35b-a3b' | 'TEE/qwen3.6-27b' | 'TEE/gemma-4-26b-a4b-uncensored' | 'TEE/qwen3.8-27b' | 'TEE/qwen3.5-27b' | 'TEE/glm-5.1' | 'TEE/qwen3.6-35b-a3b-uncensored' | 'TEE/glm-5.2:thinking' | 'TEE/gpt-oss-20b' | 'TEE/kimi-k2.6' | 'TEE/glm-5.3-flash' | 'dots-studio/dots-3-note-preview' | 'minimax/minimax-01' | 'minimax/minimax-m2-her' | 'minimax/minimax-m3' | 'minimax/minimax-m2.7' | 'minimax/minimax-latest' | 'minimax/minimax-m3:thinking' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.7-turbo' | 'minimax/minimax-m2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a NEAR AI Cloud Provider
 * @see {@link https://docs.near.ai/}
 */
export const createNearai = (apiKey: string, baseURL = 'https://cloud-api.near.ai/v1') => merge(
  createChatProvider<'google/gemini-3-pro' | 'google/gemini-2.5-flash-lite' | 'google/gemini-3.5-flash' | 'google/gemini-3.1-flash-lite' | 'google/gemini-2.5-flash' | 'google/gemini-2.5-pro' | 'google/gemma-4-31B-it' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-opus-4-6' | 'openai/gpt-5-nano' | 'openai/whisper-large-v3' | 'openai/gpt-5' | 'openai/gpt-5-mini' | 'openai/gpt-oss-120b' | 'openai/gpt-4.1-nano' | 'openai/gpt-5.2' | 'openai/gpt-5.4-mini' | 'openai/o3' | 'openai/gpt-5.5' | 'openai/gpt-4.1' | 'openai/o4-mini' | 'openai/gpt-5.4' | 'openai/o3-mini' | 'openai/gpt-4.1-mini' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'Qwen/Qwen3-Reranker-0.6B' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen3.5-122B-A10B' | 'Qwen/Qwen3.6-35B-A3B-FP8' | 'Qwen/Qwen3-Embedding-0.6B' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'zai-org/GLM-5.1-FP8' | 'black-forest-labs/FLUX.2-klein-4B'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Nebius Token Factory Provider
 * @see {@link https://docs.tokenfactory.nebius.com/}
 */
export const createNebius = (apiKey: string, baseURL = 'https://api.tokenfactory.nebius.com/v1') => merge(
  createChatProvider<'MiniMaxAI/MiniMax-M2.5-fast' | 'MiniMaxAI/MiniMax-M3' | 'MiniMaxAI/MiniMax-M2.5' | 'nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B' | 'nvidia/nemotron-3-super-120b-a12b' | 'nvidia/Llama-3_1-Nemotron-Ultra-253B-v1' | 'nvidia/Nemotron-3-Nano-Omni' | 'google/gemma-3-27b-it' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2.7-Code' | 'moonshotai/Kimi-K2.5-fast' | 'moonshotai/Kimi-K3' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-120b-fast' | 'deepseek-ai/DeepSeek-V4-Pro' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-V4-Flash' | 'deepseek-ai/DeepSeek-V3.2-fast' | 'NousResearch/Hermes-4-405B' | 'NousResearch/Hermes-4-70B' | 'Qwen/Qwen3.5-397B-A17B-fast' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-Next-80B-A3B-Thinking-fast' | 'Qwen/Qwen2.5-VL-72B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3-235B-A22B-Thinking-2507-fast' | 'Qwen/Qwen3-Embedding-8B' | 'zai-org/GLM-5' | 'zai-org/GLM-5.2' | 'meta-llama/Llama-3.3-70B-Instruct' | 'PrimeIntellect/INTELLECT-3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a NeoSmith Provider
 * @see {@link https://neosmith.ai/docs}
 */
export const createNeosmith = (apiKey: string, baseURL = 'https://router.neosmith.ai/v1') => merge(
  createChatProvider<'neosmith.intelligent-pro' | 'neosmith.intelligent-maestro' | 'neosmith.intelligent-basic' | 'neosmith.neolite'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Neuralwatt Provider
 * @see {@link https://portal.neuralwatt.com/docs}
 */
export const createNeuralwatt = (apiKey: string, baseURL = 'https://api.neuralwatt.com/v1') => merge(
  createChatProvider<'kimi-k2.7-code' | 'qwen3.6-35b-fast' | 'kimi-k2.7-code-fast' | 'kimi-k3' | 'deepseek-v4-flash' | 'kimi-k3-fast' | 'deepseek-v4-pro' | 'glm-5.2-fast' | 'glm-5.2-flex' | 'kimi-k3-flex' | 'glm-5.2-short' | 'gemma-4-31b' | 'qwen3.6-35b' | 'glm-5.2-short-fast-flex' | 'deepseek-v4-flash-flex' | 'glm-5.2' | 'qwen-3.8-27b' | 'glm-5.2-short-fast' | 'kimi-k2.7-code-flex' | 'glm-5.2-short-flex'>({ apiKey, baseURL }),
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
  createChatProvider<'microsoft/wizardlm-2-8x22b' | 'deepseek/deepseek-ocr' | 'deepseek/deepseek-v3.1-terminus' | 'deepseek/deepseek-r1-distill-qwen-32b' | 'deepseek/deepseek-v3-0324' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v3-turbo' | 'deepseek/deepseek-r1-0528-qwen3-8b' | 'deepseek/deepseek-v3.1' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-r1-turbo' | 'deepseek/deepseek-prover-v2-671b' | 'deepseek/deepseek-r1-distill-llama-70b' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-ocr-2' | 'deepseek/deepseek-r1-distill-qwen-14b' | 'google/gemma-4-26b-a4b-it' | 'google/gemma-4-31b-it' | 'google/gemma-3-27b-it' | 'google/gemma-3-12b-it' | 'paddlepaddle/paddleocr-vl' | 'gryphe/mythomax-l2-13b' | 'baichuan/baichuan-m2-32b' | 'moonshotai/kimi-k2.7-code' | 'moonshotai/kimi-k3' | 'moonshotai/kimi-k2-instruct' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.6' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'nousresearch/hermes-2-pro-llama-3-8b' | 'qwen/qwen2.5-vl-72b-instruct' | 'qwen/qwen3-4b-fp8' | 'qwen/qwen3-coder-30b-a3b-instruct' | 'qwen/qwen3.7-max' | 'qwen/qwen3-8b-fp8' | 'qwen/qwen3-235b-a22b-fp8' | 'qwen/qwen3-32b-fp8' | 'qwen/qwen3-30b-a3b-fp8' | 'qwen/qwen3-omni-30b-a3b-instruct' | 'qwen/qwen3-omni-30b-a3b-thinking' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen3.5-35b-a3b' | 'qwen/qwen3-vl-235b-a22b-thinking' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen2.5-7b-instruct' | 'qwen/qwen3-coder-next' | 'qwen/qwen3-vl-8b-instruct' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-max' | 'qwen/qwen3-235b-a22b-instruct-2507' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen-mt-plus' | 'qwen/qwen3.5-27b' | 'qwen/qwen3-vl-30b-a3b-thinking' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen3-vl-30b-a3b-instruct' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'qwen/qwen-2.5-72b-instruct' | 'sao10K/l31-70b-euryale-v2.2' | 'sao10K/l3-8b-lunaris' | 'sao10K/L3-8B-stheno-v3.2' | 'sao10K/l3-70b-euryale-v2.1' | 'xiaomimimo/mimo-v2-pro' | 'xiaomimimo/mimo-v2-flash' | 'xiaomimimo/mimo-v2.5-pro' | 'zai-org/glm-4.6' | 'zai-org/autoglm-phone-9b-multilingual' | 'zai-org/glm-4.7' | 'zai-org/glm-4.5v' | 'zai-org/glm-5' | 'zai-org/glm-5.2' | 'zai-org/glm-4.6v' | 'zai-org/glm-4.5-air' | 'zai-org/glm-5.1' | 'zai-org/glm-4.7-flash' | 'zai-org/glm-4.5' | 'inclusionai/ring-2.6-1t' | 'inclusionai/ling-2.6-1t' | 'inclusionai/ling-2.6-flash' | 'meta-llama/llama-3.2-3b-instruct' | 'meta-llama/llama-3.3-70b-instruct' | 'meta-llama/llama-3.1-8b-instruct' | 'meta-llama/llama-4-maverick-17b-128e-instruct-fp8' | 'meta-llama/llama-3-70b-instruct' | 'meta-llama/llama-4-scout-17b-16e-instruct' | 'meta-llama/llama-3-8b-instruct' | 'mistralai/mistral-nemo' | 'minimaxai/minimax-m1-80k' | 'baidu/ernie-4.5-21B-a3b-thinking' | 'baidu/ernie-4.5-vl-28b-a3b-thinking' | 'baidu/ernie-4.5-vl-28b-a3b' | 'baidu/ernie-4.5-vl-424b-a47b' | 'baidu/ernie-4.5-21B-a3b' | 'baidu/ernie-4.5-300b-a47b-paddle' | 'kwaipilot/kat-coder-pro' | 'minimax/minimax-m2.7-highspeed' | 'minimax/minimax-m2.5-highspeed' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Nvidia Provider
 * @see {@link https://docs.api.nvidia.com/nim/}
 */
export const createNvidia = (apiKey: string, baseURL = 'https://integrate.api.nvidia.com/v1') => merge(
  createChatProvider<'nvidia/llama-3.3-nemotron-super-49b-v1' | 'nvidia/nemotron-3-nano-30b-a3b' | 'nvidia/active-speaker-detection' | 'nvidia/llama-3.1-nemotron-nano-8b-v1' | 'nvidia/gliner-pii' | 'nvidia/nemotron-3-content-safety' | 'nvidia/cosmos-transfer2_5-2b' | 'nvidia/llama-3.1-nemotron-70b-instruct' | 'nvidia/nemotron-nano-12b-v2-vl' | 'nvidia/nemotron-voicechat' | 'nvidia/studiovoice' | 'nvidia/llama-nemotron-rerank-vl-1b-v2' | 'nvidia/llama-3.3-nemotron-super-49b-v1.5' | 'nvidia/llama-3_2-nemoretriever-300m-embed-v1' | 'nvidia/nemotron-3-super-120b-a12b' | 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning' | 'nvidia/rerank-qa-mistral-4b' | 'nvidia/nv-embed-v1' | 'nvidia/cosmos-transfer1-7b' | 'nvidia/streampetr' | 'nvidia/nv-embedcode-7b-v1' | 'nvidia/usdvalidate' | 'nvidia/nemotron-content-safety-reasoning-4b' | 'nvidia/nemotron-3-ultra-550b-a55b' | 'nvidia/cosmos-predict1-5b' | 'nvidia/magpie-tts-zeroshot' | 'nvidia/nvidia-nemotron-nano-9b-v2' | 'nvidia/nemotron-3.5-lightning-30b-a3b' | 'nvidia/riva-translate-4b-instruct-v1.1' | 'nvidia/llama-3.1-nemotron-ultra-253b-v1' | 'nvidia/sparsedrive' | 'nvidia/usdcode' | 'nvidia/llama-3.1-nemotron-safety-guard-8b-v3' | 'nvidia/bevformer' | 'nvidia/cosmos-reason2-8b' | 'nvidia/llama-3.1-nemotron-nano-vl-8b-v1' | 'nvidia/nemotron-mini-4b-instruct' | 'nvidia/llama-nemotron-embed-vl-1b-v2' | 'nvidia/synthetic-video-detector' | 'microsoft/phi-4-multimodal-instruct' | 'microsoft/phi-4-mini-instruct' | 'z-ai/glm-5.2' | 'google/gemma-3n-e2b-it' | 'google/google-paligemma' | 'google/gemma-3-4b-it' | 'google/gemma-4-31b-it' | 'google/gemma-3n-e4b-it' | 'google/gemma-3-12b-it' | 'google/gemma-2-2b-it' | 'meta/llama-3.2-3b-instruct' | 'meta/esmfold' | 'meta/llama-3.3-70b-instruct' | 'meta/llama-guard-4-12b' | 'meta/llama-3.2-1b-instruct' | 'meta/muse-glimmer-30b' | 'meta/llama-3.1-8b-instruct' | 'meta/llama-3.1-70b-instruct' | 'meta/esm2-650m' | 'meta/llama-3.2-90b-vision-instruct' | 'meta/llama-3.2-11b-vision-instruct' | 'meta/llama-4-maverick-17b-128e-instruct' | 'poolside/laguna-xs-2.1' | 'moonshotai/kimi-k3' | 'moonshotai/kimi-k2-instruct-0905' | 'moonshotai/kimi-k2.6' | 'bytedance/seed-oss-36b-instruct' | 'openai/whisper-large-v3' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'deepseek-ai/deepseek-v4-flash' | 'deepseek-ai/deepseek-v4-pro-0813' | 'deepseek-ai/deepseek-v4-pro' | 'deepseek-ai/deepseek-v4-flash-0731' | 'stepfun-ai/step-3.5-flash' | 'stepfun-ai/step-3.7-flash' | 'baai/bge-m3' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen-image' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen2.5-coder-32b-instruct' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen-image-edit' | 'abacusai/dracarys-llama-3.1-70b-instruct' | 'thinkingmachines/inkling' | 'mistralai/magistral-small-2506' | 'mistralai/mistral-7b-instruct-v0.3' | 'mistralai/mistral-large-3-675b-instruct-2512' | 'mistralai/mistral-nemotron' | 'mistralai/mistral-small-4-119b-2603' | 'mistralai/mixtral-8x7b-instruct' | 'mistralai/mistral-medium-3.5-128b' | 'mistralai/mixtral-8x22b-instruct' | 'mistralai/mistral-medium-3-instruct' | 'mistralai/ministral-14b-instruct-2512' | 'minimaxai/minimax-m3' | 'minimaxai/minimax-m2.7' | 'upstage/solar-10.7b-instruct' | 'sarvamai/sarvam-m' | 'black-forest-labs/flux_2-klein-4b' | 'black-forest-labs/flux.1-dev' | 'black-forest-labs/flux_1-schnell' | 'black-forest-labs/flux_1-kontext-dev'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Ofox Provider
 * @see {@link https://ofox.ai/docs}
 */
export const createOfox = (apiKey: string, baseURL = 'https://api.ofox.ai/v1') => merge(
  createChatProvider<'z-ai/glm-4.6' | 'z-ai/glm-5v-turbo' | 'z-ai/glm-4.7' | 'z-ai/glm-4.7-flashx' | 'z-ai/glm-5' | 'z-ai/glm-5-turbo' | 'z-ai/glm-5.3' | 'z-ai/glm-5.2' | 'z-ai/glm-5.1' | 'z-ai/glm-5.3-flash' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro-0813' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-v4-flash-0731' | 'deepseek/deepseek-v4-pro-0423' | 'deepseek/deepseek-v4-flash-vision-exp' | 'google/gemini-3.5-flash-lite' | 'google/gemini-3.1-pro-preview' | 'google/gemini-2.5-flash-lite' | 'google/gemini-3.5-flash' | 'google/gemini-3.1-flash-lite' | 'google/gemini-2.5-flash' | 'google/gemini-3.6-flash' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-pro' | 'google/gemini-3.7-flash' | 'x-ai/grok-4.20' | 'x-ai/grok-4.6' | 'x-ai/grok-4.5' | 'x-ai/grok-4.1-fast' | 'x-ai/grok-4.3' | 'moonshotai/kimi-k2.7-code' | 'moonshotai/kimi-k3' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2.7-code-highspeed' | 'moonshotai/kimi-k2.6' | 'anthropic/claude-opus-4.8' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.7' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-fable-5' | 'anthropic/claude-opus-5' | 'openai/gpt-4o' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/gpt-5.6-sol' | 'openai/gpt-5.4-pro' | 'openai/gpt-5' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5-mini' | 'openai/gpt-5.6-luna' | 'openai/gpt-5.3-codex' | 'openai/gpt-5.2' | 'openai/gpt-5.4-mini' | 'openai/gpt-5.5' | 'openai/gpt-5.2-codex' | 'openai/gpt-4.1' | 'openai/gpt-5.6-terra' | 'openai/gpt-5.4' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-4.1-mini' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'bailian/qwen3.7-max' | 'bailian/qwen-turbo' | 'bailian/qwen-vl-max' | 'bailian/qwen-max' | 'bailian/qwen3.5-35b-a3b' | 'bailian/qwen3.5-397b-a17b' | 'bailian/qwen3.5-flash' | 'bailian/qwen-plus' | 'bailian/qwen3-coder-next' | 'bailian/qwen3.5-plus' | 'bailian/qwen3-coder-flash' | 'bailian/qwen3.6-max-preview' | 'bailian/qwen3.8-max' | 'bailian/qwen3.7-plus' | 'bailian/qwen-flash' | 'bailian/qwen3-max' | 'bailian/qwen3.6-27b' | 'bailian/qwen3.8-27b' | 'bailian/qwen3.6-plus' | 'bailian/qwen3.5-27b' | 'bailian/qwen3.5-122b-a10b' | 'bailian/qwen3-coder-plus' | 'bailian/qwen3.6-flash' | 'volcengine/doubao-seed-1-8' | 'volcengine/doubao-seed-2.1-pro' | 'volcengine/doubao-seed-1-6' | 'volcengine/doubao-seed-evolving' | 'volcengine/doubao-seed-character' | 'volcengine/doubao-seed-2.0-mini' | 'volcengine/doubao-seed-2.1-turbo' | 'volcengine/doubao-seed-2.0-code' | 'volcengine/doubao-seed-1-6-vision' | 'volcengine/doubao-seed-2.0-lite' | 'volcengine/doubao-seed-1-6-flash' | 'volcengine/doubao-seed-2.0-pro' | 'minimax/minimax-m2.7-highspeed' | 'minimax/minimax-m3' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2.5-lightning' | 'minimax/m2-her' | 'minimax/minimax-m2' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.1-lightning' | 'minimax/minimax-m2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Ollama Cloud Provider
 * @see {@link https://docs.ollama.com/cloud}
 */
export const createOllamaCloud = (apiKey: string, baseURL = 'https://ollama.com/v1') => merge(
  createChatProvider<'nemotron-3-ultra' | 'kimi-k2.7-code' | 'kimi-k3' | 'deepseek-v4-flash' | 'deepseek-v4-pro' | 'mistral-large-3:675b' | 'minimax-m3' | 'minimax-m2.7' | 'deepseek-v4-flash:0731' | 'gpt-oss:20b' | 'qwen3.5:397b' | 'nemotron-3-super' | 'kimi-k2.5' | 'glm-5.2' | 'minimax-m2.5' | 'gpt-oss:120b' | 'glm-5.1' | 'nemotron-3-nano:30b' | 'gemma4:31b' | 'kimi-k2.6' | 'glm-5.3-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenAI Provider
 * @see {@link https://platform.openai.com/docs/models}
 */
export const createOpenAI = (apiKey: string, baseURL = 'https://api.openai.com/v1/') => merge(
  createChatProvider<'gpt-4o' | 'gpt-image-1.5' | 'gpt-5.3-chat-latest' | 'gpt-5-nano' | 'gpt-4o-mini' | 'gpt-3.5-turbo' | 'o1-pro' | 'gpt-5.5-pro' | 'gpt-4-turbo' | 'gpt-image-1-mini' | 'gpt-4' | 'gpt-5.6-sol' | 'o3-pro' | 'gpt-5.4-pro' | 'gpt-5' | 'gpt-5.6' | 'gpt-5-mini' | 'gpt-5.6-luna' | 'text-embedding-ada-002' | 'gpt-5.3-codex' | 'gpt-5.3-codex-spark' | 'gpt-4.1-nano' | 'o1' | 'gpt-5.2' | 'gpt-image-1' | 'gpt-realtime-2.1' | 'gpt-5.4-mini' | 'gpt-4o-2024-05-13' | 'o3' | 'chatgpt-image-latest' | 'text-embedding-3-small' | 'gpt-5-pro' | 'gpt-5.5' | 'gpt-4.1' | 'gpt-4o-2024-08-06' | 'gpt-5.6-terra' | 'o4-mini' | 'gpt-5.4' | 'o3-mini' | 'gpt-4o-2024-11-20' | 'text-embedding-3-large' | 'gpt-5.2-chat-latest' | 'gpt-5.2-pro' | 'gpt-image-2' | 'gpt-4.1-mini' | 'gpt-5.4-nano' | 'gpt-5.1'>({ apiKey, baseURL }),
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
  createChatProvider<'gemini-3-pro' | 'claude-opus-4-7' | 'glm-4.6' | 'ling-3.0-flash-free' | 'laguna-s-2.1-free' | 'nemotron-3.5-lightning-free' | 'kimi-k2.7-code' | 'ring-2.6-1t-free' | 'nemotron-3-super-free' | 'gpt-5-nano' | 'kimi-k3' | 'gpt-5.5-pro' | 'glm-4.7' | 'deepseek-v4-flash' | 'kimi-k2.5-free' | 'north-mini-code-free' | 'deepseek-v4-flash-free' | 'minimax-m3-free' | 'claude-opus-4-8' | 'gemini-3.5-flash-lite' | 'gemini-3.1-pro' | 'gpt-5.6-sol' | 'grok-4.6' | 'gpt-5.4-pro' | 'nemotron-3-ultra-free' | 'grok-4.5' | 'gpt-5' | 'claude-opus-4-1' | 'deepseek-v4-pro' | 'claude-sonnet-5' | 'glm-4.7-free' | 'qwen3.5-plus' | 'trinity-large-preview-free' | 'gpt-5.1-codex-mini' | 'gpt-5-codex' | 'claude-3-5-haiku' | 'grok-code' | 'ling-3.0-flash-fin-free' | 'gpt-5.6-luna' | 'kimi-k2' | 'hy3-preview-free' | 'glm-5' | 'minimax-m3' | 'minimax-m2.7' | 'hy3-free' | 'gpt-5.3-codex' | 'claude-sonnet-4' | 'gpt-5.3-codex-spark' | 'muse-spark-1.2-contributor-free' | 'x-preview-f-free' | 'gpt-5.2' | 'gemini-3.5-flash' | 'ling-2.6-flash-free' | 'claude-opus-4-5' | 'gpt-5.4-mini' | 'claude-sonnet-4-6' | 'mimo-v2-pro-free' | 'qwen3-coder' | 'muse-spark-1.2' | 'gpt-5.5' | 'mimo-v2-flash-free' | 'minimax-m2.5-free' | 'glm-5-free' | 'kimi-k2.5' | 'gpt-5.2-codex' | 'claude-sonnet-4-5' | 'glm-5.2' | 'qwen3.6-plus-free' | 'mimo-v2.5-free' | 'minimax-m2.5' | 'gemini-3.6-flash' | 'minimax-m2.1-free' | 'gpt-5.6-terra' | 'gemini-3-flash' | 'gpt-5.4' | 'qwen3.6-plus' | 'ling-3.0-tiny-free' | 'claude-fable-5' | 'glm-5.1' | 'big-pickle' | 'claude-haiku-4-5' | 'gpt-5.1-codex-max' | 'claude-opus-4-6' | 'gpt-5.1-codex' | 'claude-opus-5' | 'mimo-v2-omni-free' | 'grok-build-0.1' | 'minimax-m2.1' | 'gemini-3.7-flash' | 'kimi-k2-thinking' | 'gpt-5.4-nano' | 'kimi-k2.6' | 'longcat-2.0-free' | 'gpt-5.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenCode Go Provider
 * @see {@link https://opencode.ai/docs/zen}
 */
export const createOpencodeGo = (apiKey: string, baseURL = 'https://opencode.ai/zen/go/v1') => merge(
  createChatProvider<'kimi-k2.7-code' | 'qwen3.7-max' | 'kimi-k3' | 'deepseek-v4-flash' | 'mimo-v2.5' | 'grok-4.6' | 'grok-4.5' | 'deepseek-v4-pro' | 'qwen3.5-plus' | 'gpt-5.6-luna' | 'glm-5' | 'minimax-m3' | 'minimax-m2.7' | 'qwen3.8-max' | 'mimo-v2-pro' | 'qwen3.7-plus' | 'ox-alpha-free' | 'qwen3.8-flash' | 'glm-5.3' | 'kimi-k2.5' | 'glm-5.2' | 'minimax-m2.5' | 'mimo-v2-omni' | 'longcat-2.0' | 'qwen3.6-plus' | 'hy4-preview' | 'glm-5.1' | 'mimo-v2.5-pro' | 'hy3' | 'muse-spark-1.2-contributor' | 'kimi-k2.6' | 'deepseek-v4-flash-vision-exp' | 'glm-5.3-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenReason Provider
 * @see {@link https://openreason.app/docs}
 */
export const createOpenreason = (apiKey: string, baseURL = 'https://api.openreason.app/v1') => merge(
  createChatProvider<'moonshotai/kimi-k2.7-code' | 'openai/gpt-oss-120b' | 'deepseek-ai/deepseek-v4-flash-0731'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Opper Provider
 * @see {@link https://opper.ai/models}
 */
export const createOpper = (apiKey: string, baseURL = 'https://api.opper.ai/v3/compat') => merge(
  createChatProvider<'vertexai/gemini-3.7-flash-eu' | 'vertexai/gemini-3.7-flash' | 'meta/muse-spark-1.2' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-opus-4-8' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-opus-4-5' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-fable-5' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-opus-4-6' | 'anthropic/claude-opus-5' | 'openai/gpt-5.3-chat-latest' | 'openai/gpt-5.5-pro' | 'openai/gpt-5.6-sol' | 'openai/gpt-5.4-pro' | 'openai/gpt-5.6-luna' | 'openai/gpt-5.3-codex' | 'openai/gpt-5.4-mini' | 'openai/gpt-5.5' | 'openai/gpt-5.6-terra' | 'openai/gpt-5.4' | 'openai/gpt-5.4-nano' | 'xai/grok-4.6' | 'xai/grok-4.5' | 'xai/grok-build-0.1' | 'xai/grok-4.3' | 'perplexity/sonar' | 'perplexity/sonar-reasoning-pro' | 'perplexity/sonar-pro' | 'moonshot/kimi-k3' | 'mistral/devstral-2512' | 'mistral/mistral-small-2603' | 'mistral/mistral-large-2512' | 'gemini/gemini-3.5-flash-lite' | 'gemini/gemini-3.1-pro-preview' | 'gemini/gemini-3.5-flash' | 'gemini/gemini-3-flash-preview' | 'minimax/m3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OrcaRouter Provider
 * @see {@link https://docs.orcarouter.ai}
 */
export const createOrcarouter = (apiKey: string, baseURL = 'https://api.orcarouter.ai/v1') => merge(
  createChatProvider<'tencent/hy3-free' | 'tencent/hy3' | 'orcarouter/fusion-mini' | 'orcarouter/auto' | 'orcarouter/fusion' | 'orcarouter/fusion-flash' | 'orcarouter/free' | 'z-ai/glm-4.6' | 'z-ai/glm-4.7' | 'z-ai/glm-5' | 'z-ai/glm-5.3' | 'z-ai/glm-5.2' | 'z-ai/glm-4.5-air' | 'z-ai/glm-5.1' | 'z-ai/glm-4.5' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-flash-free' | 'deepseek/deepseek-v4-pro-0813' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-chat' | 'deepseek/deepseek-reasoner' | 'deepseek/deepseek-v4-flash-0731' | 'deepseek/deepseek-v4-flash-vision-exp' | 'kimi/kimi-k2.7-code' | 'kimi/kimi-k3' | 'kimi/kimi-k2.5' | 'kimi/kimi-k2.6' | 'google/gemma-4-26b-a4b-it' | 'google/gemini-flash-lite-latest' | 'google/gemini-3.5-flash-lite' | 'google/gemini-3.1-pro-preview' | 'google/gemini-3.1-pro-preview-customtools' | 'google/gemini-2.5-flash-lite' | 'google/gemini-robotics-er-1.6-preview' | 'google/gemma-4-31b-it' | 'google/gemini-flash-latest' | 'google/gemini-3.5-flash' | 'google/gemini-3.1-flash-lite' | 'google/gemini-2.5-flash' | 'google/gemini-3.6-flash' | 'google/gemini-3.1-flash-lite-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-pro' | 'meta/muse-spark-1.2' | 'meta/muse-spark-1.1' | 'anthropic/claude-opus-4.8' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.7' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-fable-5' | 'anthropic/claude-opus-5' | 'grok/grok-4.6' | 'grok/grok-4.5' | 'grok/grok-4.3' | 'openai/gpt-4o' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/gpt-3.5-turbo' | 'openai/gpt-5.5-pro' | 'openai/gpt-4-turbo' | 'openai/gpt-4' | 'openai/gpt-5-chat-latest' | 'openai/gpt-5.6-sol' | 'openai/gpt-5.4-pro' | 'openai/gpt-5' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5-mini' | 'openai/gpt-5.6-luna' | 'openai/gpt-5.3-codex' | 'openai/gpt-oss-120b' | 'openai/gpt-4.1-nano' | 'openai/gpt-5.2' | 'openai/gpt-5.4-mini' | 'openai/gpt-4o-2024-05-13' | 'openai/gpt-5-pro' | 'openai/gpt-5.5' | 'openai/gpt-5.2-codex' | 'openai/gpt-4.1' | 'openai/gpt-4o-2024-08-06' | 'openai/gpt-5.6-terra' | 'openai/gpt-5.4' | 'openai/gpt-4o-2024-11-20' | 'openai/gpt-5.2-chat-latest' | 'openai/gpt-5.2-pro' | 'openai/gpt-5.1-chat-latest' | 'openai/gpt-5.1-codex' | 'openai/gpt-4.1-mini' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'qwen/qwen3.7-max' | 'qwen/qwen3.8-27b-free' | 'qwen/qwen3.5-35b-a3b' | 'qwen/qwen3-vl-235b-a22b-thinking' | 'qwen/qwen3.5-397b-a17b' | 'qwen/qwen3.5-flash' | 'qwen/qwen3.5-plus' | 'qwen/qwen3.8-max' | 'qwen/qwen3.7-plus' | 'qwen/qwen3.7-flash' | 'qwen/qwen3-max' | 'qwen/qwen3.6-35b-a3b' | 'qwen/qwen3.8-27b' | 'qwen/qwen3.6-plus' | 'qwen/qwen3.5-27b' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'qwen/qwen3.6-flash' | 'minimax/minimax-m2.7-highspeed' | 'minimax/minimax-m2.5-highspeed' | 'minimax/minimax-m3' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OVHcloud AI Endpoints Provider
 * @see {@link https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog//}
 */
export const createOvhcloud = (apiKey: string, baseURL = 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1') => merge(
  createChatProvider<'qwen2.5-vl-72b-instruct' | 'qwen3guard-gen-8b' | 'qwen3-coder-30b-a3b-instruct' | 'qwen3guard-gen-0.6b' | 'qwen3-32b' | 'mistral-small-3.2-24b-instruct-2506' | 'meta-llama-3_3-70b-instruct' | 'qwen3.5-397b-a17b' | 'mistral-nemo-instruct-2407' | 'gpt-oss-120b' | 'mistral-7b-instruct-v0.3' | 'qwen3.6-27b' | 'qwen3.5-9b' | 'gpt-oss-20b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Pendra Provider
 * @see {@link https://pendra.ai/docs/integrations/opencode}
 */
export const createPendra = (apiKey: string, baseURL = 'https://api.pendra.ai/api/v1') => merge(
  createChatProvider<'deepseek-v4-flash' | 'llama3.3:70b' | 'qwen3.6:27b' | 'gpt-oss:120b' | 'glm-4.7-flash' | 'qwen3-coder:30b'>({ apiKey, baseURL }),
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
  createChatProvider<'nvidia/nemotron-3-super-120b-a12b' | 'deepseek/deepseek-v4-flash-0731' | 'google/gemini-3.1-pro-preview' | 'google/gemini-2.5-flash' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-pro' | 'anthropic/claude-opus-4-7' | 'anthropic/claude-opus-4-5' | 'anthropic/claude-sonnet-4-6' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-opus-4-6' | 'openai/gpt-5-mini' | 'openai/gpt-5.2' | 'openai/gpt-5.5' | 'openai/gpt-5.4' | 'openai/gpt-5.1' | 'xai/grok-4.6' | 'xai/grok-4-1-fast-non-reasoning' | 'perplexity/sonar' | 'moonshot-ai/kimi-k2.7-code' | 'moonshot-ai/kimi-k3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Pioneer Provider
 * @see {@link https://agent.pioneer.ai/llms.txt}
 */
export const createPioneer = (apiKey: string, baseURL = 'https://api.pioneer.ai/v1') => merge(
  createChatProvider<'claude-opus-4-7' | 'gpt-4o' | 'qwen3.7-max' | 'gpt-5-nano' | 'gpt-4o-mini' | 'claude-opus-4-8' | 'gemini-3.5-flash-lite' | 'gemini-3.1-pro' | 'gpt-5.6-sol' | 'grok-4.5' | 'claude-opus-4-1' | 'claude-sonnet-5' | 'gpt-5-mini' | 'gpt-5.6-luna' | 'mistral-large-3' | 'qwen3.6-max-preview' | 'gpt-5.3-codex' | 'qwen3.7-plus' | 'gpt-4.1-nano' | 'gemini-3.5-flash' | 'claude-opus-4-5' | 'gpt-5.4-mini' | 'claude-sonnet-4-6' | 'gemini-3.1-flash-lite' | 'gpt-5.5' | 'claude-sonnet-4-5' | 'claude-3-7-sonnet-latest' | 'gpt-4.1' | 'gemini-3.6-flash' | 'gpt-5.6-terra' | 'gemini-3-flash' | 'gpt-5.4' | 'devstral-2' | 'qwen3.6-plus' | 'claude-fable-5' | 'claude-haiku-4-5' | 'mistral-medium-3.5' | 'claude-opus-4-6' | 'claude-opus-5' | 'gpt-4.1-mini' | 'gpt-5.4-nano' | 'qwen3.6-flash' | 'gpt-5.1' | 'XiaomiMiMo/MiMo-V2.5' | 'XiaomiMiMo/MiMo-V2.5-Pro' | 'MiniMaxAI/MiniMax-M2.7' | 'MiniMaxAI/MiniMax-M3' | 'LiquidAI/LFM2-24B-A2B' | 'nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16' | 'nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16' | 'nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16' | 'nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-FP8' | 'google/gemma-3-4b-pt' | 'google/diffusiongemma-26B-A4B-it' | 'google/gemma-4-12B-it' | 'google/gemma-4-E4B-it' | 'google/gemma-4-E2B-it' | 'google/gemma-4-31B-it' | 'meta/muse-spark-1.1' | 'poolside/laguna-s-2.1' | 'moonshotai/Kimi-K2.7-Code' | 'moonshotai/Kimi-K3' | 'moonshotai/Kimi-K2.6' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'deepseek-ai/DeepSeek-V4-Pro' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/DeepSeek-V4-Flash' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3.6-27B' | 'Qwen/Qwen3.5-9B' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen2.5-Coder-0.5B' | 'Qwen/Qwen3-1.7B-Base' | 'Qwen/Qwen3-8B' | 'Qwen/Qwen3-4B-Base' | 'Qwen/Qwen3-4B-Instruct-2507' | 'Qwen/Qwen3.6-35B-A3B' | 'fastino/gliner2-privacy-filter-PII-multi' | 'fastino/gliner2-multi-v1' | 'fastino/gliner2-large-v1' | 'fastino/gliguard-LLMGuardrails-300M' | 'fastino/gliner2-base-v1' | 'fastino/gliner2-multi-large-v1' | 'sakana/fugu-ultra' | 'zai-org/GLM-5.1' | 'zai-org/GLM-5.2' | 'meta-llama/Llama-3.2-1B' | 'meta-llama/Llama-3.2-3B' | 'meta-llama/Llama-3.2-3B-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct' | 'meta-llama/Llama-3.2-1B-Instruct' | 'meta-llama/Llama-3.1-8B-Instruct' | 'mistralai/Ministral-8B-Instruct-2410' | 'mistralai/Pixtral-12B-2409' | 'mistralai/Mistral-7B-Instruct-v0.3' | 'mistralai/Magistral-Small-2506' | 'mistralai/Mistral-Nemo-Instruct-2407' | 'mistralai/Codestral-22B-v0.1' | 'mistralai/Mistral-Small-4-119B-2603' | 'HuggingFaceTB/SmolLM3-3B-Base' | 'pioneer/auto'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Poe Provider
 * @see {@link https://creator.poe.com/docs/external-applications/openai-compatible-api}
 */
export const createPoe = (apiKey: string, baseURL = 'https://api.poe.com/v1') => merge(
  createChatProvider<'trytako/tako' | 'elevenlabs/elevenlabs-v3' | 'elevenlabs/elevenlabs-v2.5-turbo' | 'elevenlabs/elevenlabs-music' | 'runwayml/runway' | 'runwayml/runway-gen-4-turbo' | 'ideogramai/ideogram' | 'ideogramai/ideogram-v2' | 'ideogramai/ideogram-v2a-turbo' | 'ideogramai/ideogram-v2a' | 'google/gemini-3-pro' | 'google/imagen-4' | 'google/veo-3.1' | 'google/gemini-2.0-flash' | 'google/veo-2' | 'google/gemini-3.1-pro' | 'google/gemini-2.5-flash-lite' | 'google/veo-3' | 'google/gemini-deep-research' | 'google/gemma-4-31b' | 'google/nano-banana-pro' | 'google/gemini-3.5-flash' | 'google/gemini-3.1-flash-lite' | 'google/imagen-4-ultra' | 'google/imagen-3' | 'google/gemini-2.5-flash' | 'google/nano-banana' | 'google/gemini-3-flash' | 'google/gemini-2.0-flash-lite' | 'google/imagen-3-fast' | 'google/veo-3.1-fast' | 'google/lyria' | 'google/imagen-4-fast' | 'google/gemini-2.5-pro' | 'google/veo-3-fast' | 'novita/glm-4.6' | 'novita/glm-4.7' | 'novita/deepseek-v3.2' | 'novita/glm-5' | 'novita/glm-4.7-n' | 'novita/kimi-k2.5' | 'novita/glm-4.6v' | 'novita/glm-4.7-flash' | 'novita/minimax-m2.1' | 'novita/kimi-k2-thinking' | 'novita/kimi-k2.6' | 'anthropic/claude-opus-4.8' | 'anthropic/claude-sonnet-3.7' | 'anthropic/claude-haiku-3.5' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.7' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-haiku-3' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-sonnet-3.5' | 'anthropic/claude-sonnet-3.5-june' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-opus-4' | 'anthropic/claude-sonnet-4.5' | 'openai/gpt-3.5-turbo-raw' | 'openai/gpt-4o' | 'openai/gpt-image-1.5' | 'openai/chatgpt-4o-latest' | 'openai/gpt-5-nano' | 'openai/gpt-4o-mini' | 'openai/gpt-5.2-instant' | 'openai/gpt-3.5-turbo' | 'openai/o1-pro' | 'openai/gpt-5.5-pro' | 'openai/gpt-4-turbo' | 'openai/gpt-image-1-mini' | 'openai/gpt-3.5-turbo-instruct' | 'openai/o3-pro' | 'openai/o3-deep-research' | 'openai/gpt-5.4-pro' | 'openai/gpt-5-chat' | 'openai/gpt-5' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5-codex' | 'openai/gpt-5-mini' | 'openai/gpt-4-classic' | 'openai/gpt-5.3-codex' | 'openai/sora-2-pro' | 'openai/gpt-5.3-codex-spark' | 'openai/gpt-4.1-nano' | 'openai/o1' | 'openai/gpt-5.2' | 'openai/gpt-image-1' | 'openai/gpt-5.4-mini' | 'openai/o3' | 'openai/gpt-4o-search' | 'openai/o4-mini-deep-research' | 'openai/gpt-5-pro' | 'openai/gpt-5.5' | 'openai/o3-mini-high' | 'openai/gpt-5.2-codex' | 'openai/gpt-4.1' | 'openai/o4-mini' | 'openai/dall-e-3' | 'openai/gpt-5.4' | 'openai/o3-mini' | 'openai/gpt-4-classic-0314' | 'openai/gpt-5.2-pro' | 'openai/gpt-image-2' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-5.1-codex' | 'openai/gpt-4o-mini-search' | 'openai/gpt-5.3-instant' | 'openai/gpt-4o-aug' | 'openai/sora-2' | 'openai/gpt-4.1-mini' | 'openai/gpt-5.1-instant' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'xai/grok-4-fast-reasoning' | 'xai/grok-3' | 'xai/grok-4.1-fast-reasoning' | 'xai/grok-code-fast-1' | 'xai/grok-3-mini' | 'xai/grok-4' | 'xai/grok-4.1-fast-non-reasoning' | 'xai/grok-4-fast-non-reasoning' | 'xai/grok-4.20-multi-agent' | 'lumalabs/ray2' | 'poetools/claude-code' | 'stabilityai/stablediffusionxl' | 'empiriolabs/deepseek-v4-flash-el' | 'empiriolabs/deepseek-v4-pro-el' | 'cerebras/qwen3-32b-cs' | 'cerebras/gpt-oss-120b-cs' | 'cerebras/llama-3.1-8b-cs' | 'cerebras/qwen3-235b-2507-cs' | 'cerebras/llama-3.3-70b-cs' | 'fireworks-ai/kimi-k2.5-fw' | 'topazlabs-co/topazlabs'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Poolside Provider
 * @see {@link https://platform.poolside.ai}
 */
export const createPoolside = (apiKey: string, baseURL = 'https://inference.poolside.ai/v1') => merge(
  createChatProvider<'poolside/laguna-m.1' | 'poolside/laguna-s-2.1' | 'poolside/laguna-xs-2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Privatemode AI Provider
 * @see {@link https://docs.privatemode.ai/api/overview}
 */
export const createPrivatemodeAi = (apiKey: string, baseURL = 'http://localhost:8080/v1') => merge(
  createChatProvider<'whisper-large-v3' | 'kimi-latest' | 'voxtral-mini-3b' | 'gpt-oss-120b' | 'qwen3-embedding-4b' | 'deepseek-ocr-2' | 'kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a QiHang Provider
 * @see {@link https://www.qhaigc.net/docs}
 */
export const createQihangAi = (apiKey: string, baseURL = 'https://api.qhaigc.net/v1') => merge(
  createChatProvider<'gpt-5-mini' | 'claude-sonnet-4-5-20250929' | 'gpt-5.2' | 'gemini-2.5-flash' | 'gemini-3-pro-preview' | 'gpt-5.2-codex' | 'claude-haiku-4-5-20251001' | 'claude-opus-4-5-20251101' | 'gemini-3-flash-preview'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Qiniu Provider
 * @see {@link https://developer.qiniu.com/aitokenapi}
 */
export const createQiniuAi = (apiKey: string, baseURL = 'https://api.qnaigc.com/v1') => merge(
  createChatProvider<'qwen2.5-vl-72b-instruct' | 'qwen3-max-preview' | 'deepseek-r1' | 'kling-v2-6' | 'doubao-1.5-vision-pro' | 'qwen-turbo' | 'deepseek-v3-0324' | 'qwen3-32b' | 'gemini-2.0-flash' | 'qwen-max-2025-01-25' | 'qwen3-235b-a22b-thinking-2507' | 'qwen3-235b-a22b' | 'qwen3-30b-a3b' | 'qwen3.5-397b-a17b' | 'deepseek-v3.1' | 'deepseek-v3' | 'gemini-3.0-pro-preview' | 'gemini-2.5-flash-lite' | 'deepseek-r1-0528' | 'doubao-seed-1.6-thinking' | 'kimi-k2' | 'claude-3.7-sonnet' | 'claude-4.0-sonnet' | 'doubao-seed-2.0-mini' | 'claude-3.5-sonnet' | 'qwen3-30b-a3b-instruct-2507' | 'gpt-oss-120b' | 'gemini-3.0-pro-image-preview' | 'claude-4.0-opus' | 'MiniMax-M1' | 'doubao-seed-1.6' | 'doubao-seed-2.0-code' | 'claude-4.1-opus' | 'claude-4.5-opus' | 'gemini-2.5-flash' | 'qwen3-next-80b-a3b-thinking' | 'qwen3-coder-480b-a35b-instruct' | 'doubao-1.5-pro-32k' | 'qwen3-max' | 'doubao-seed-2.0-lite' | 'doubao-1.5-thinking-pro' | 'claude-4.5-haiku' | 'qwen2.5-vl-7b-instruct' | 'qwen3-235b-a22b-instruct-2507' | 'qwen3-next-80b-a3b-instruct' | 'gemini-2.0-flash-lite' | 'qwen3-30b-a3b-thinking-2507' | 'mimo-v2-flash' | 'doubao-seed-1.6-flash' | 'glm-4.5-air' | 'qwen3-vl-30b-a3b-thinking' | 'qwen-vl-max-2025-01-25' | 'claude-3.5-haiku' | 'gemini-2.5-flash-image' | 'doubao-seed-2.0-pro' | 'gemini-2.5-pro' | 'claude-4.5-sonnet' | 'gpt-oss-20b' | 'gemini-3.0-flash-preview' | 'glm-4.5' | 'z-ai/glm-4.6' | 'z-ai/glm-4.7' | 'z-ai/glm-5' | 'z-ai/autoglm-phone-9b' | 'deepseek/deepseek-v3.1-terminus' | 'deepseek/deepseek-v3.2-exp-thinking' | 'deepseek/deepseek-v3.2-251201' | 'deepseek/deepseek-math-v2' | 'deepseek/deepseek-v3.1-terminus-thinking' | 'deepseek/deepseek-v3.2-exp' | 'x-ai/grok-4-fast-reasoning' | 'x-ai/grok-4.1-fast-reasoning' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4-fast' | 'x-ai/grok-4.1-fast' | 'x-ai/grok-4.1-fast-non-reasoning' | 'x-ai/grok-4-fast-non-reasoning' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking' | 'openai/gpt-5' | 'openai/gpt-5.2' | 'stepfun-ai/gelab-zero-4b-preview' | 'meituan/longcat-flash-chat' | 'meituan/longcat-flash-lite' | 'stepfun/step-3.5-flash' | 'xiaomi/mimo-v2-flash' | 'minimax/minimax-m2.5-highspeed' | 'minimax/minimax-m2' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Regolo AI Provider
 * @see {@link https://docs.regolo.ai/}
 */
export const createRegoloAi = (apiKey: string, baseURL = 'https://api.regolo.ai/v1') => merge(
  createChatProvider<'qwen3-reranker-4b' | 'brick-complexity-pro' | 'qwen3-embedding-8b' | 'llama-3.3-70b-instruct' | 'gemma4-31b' | 'qwen3-coder-next' | 'apertus-70b' | 'qwen-image' | 'qwen3.5-122b' | 'brick-v1-beta' | 'gpt-oss-120b' | 'faster-whisper-large-v3' | 'qwen3.8-27b' | 'qwen3.5-9b' | 'deepseek-ocr-2' | 'glm5.2' | 'gpt-oss-20b' | 'mistral-small-4-119b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Requesty Provider
 * @see {@link https://requesty.ai/solution/llm-routing/models}
 */
export const createRequesty = (apiKey: string, baseURL = 'https://router.requesty.ai/v1') => merge(
  createChatProvider<'seed-2.0-code' | 'claude-sonnet-4-5@eu' | 'claude-opus-4-7' | 'minimax-m2.7-highspeed' | 'gpt-5.1@eu' | 'gpt-4.1-nano@eu' | 'gemini-2.5-flash@eu' | 'nemotron-3.5-content-safety' | 'kimi-k2.7-code' | 'gemma-4-26b-a4b-it' | 'gemini-3-pro-image' | 'qwen3.7-max' | 'thinkingcap-qwen3.6-27b@eu' | 'seed-1.8' | 'mistral-medium-latest@eu' | 'kimi-k3' | 'glm-5.2@eu' | 'gpt-5.5-pro' | 'gpt-5.3-chat' | 'deepseek-v4-flash' | 'ring-2.6-1t' | 'claude-opus-4-8' | 'gemini-3.5-flash-lite' | 'gpt-5.6-sol@eu' | 'gpt-5-mini@eu' | 'deepseek-v4-pro@eu' | 'leanstral-1-5@eu' | 'mimo-v2.5' | 'gemini-3.1-flash-lite@eu' | 'gpt-5.6-sol' | 'gpt-5@eu' | 'grok-4.6' | 'gpt-5.5@eu' | 'kimi-k2.6@eu' | 'gpt-5.4-pro' | 'qwen3.5-35b-a3b' | 'gpt-5.6-luna@eu' | 'gemini-3.1-pro-preview' | 'nemotron-3-ultra-nvfp4' | 'grok-4.5' | 'glm-5.3-flash@eu' | 'gpt-5-nano@eu' | 'claude-opus-4-1' | 'deepseek-v4-pro-0813' | 'deepseek-v4-pro' | 'nemotron-3-super-120b-a12b' | 'laguna-m.1' | 'claude-sonnet-5' | 'glm-5.2-fast' | 'gpt-4.1-mini@eu' | 'o4-mini@eu' | 'kimi-k3@eu' | 'ling-2.6-1t' | 'gpt-5.6-luna' | 'gemma-4-31b-it' | 'devstral-latest' | 'mistral-medium-3-5' | 'nemotron-3-nano-omni-30b-a3b-reasoning' | 'claude-sonnet-4-6@eu' | 'nemotron-lightning-3.5-30b-a3b' | 'minimax-m3' | 'minimax-m2.7' | 'inkling-256k' | 'kimi-k2.7-code@eu' | 'claude-opus-5@eu' | 'qwen3.5-2b' | 'gpt-5.3-codex' | 'qwen3.8-max' | 'gemini-3.5-flash@eu' | 'muse-glimmer-30b' | 'qwen3.7-plus' | 'grok-4.2-beta' | 'glm-5.3@eu' | 'fugu-ultra' | 'mistral-small-2603' | 'mistral-small-2603@eu' | 'claude-sonnet-5@eu' | 'gemini-3.5-flash' | 'claude-opus-4-5' | 'gpt-5.4-mini' | 'nemotron-3-ultra-550b-a55b' | 'claude-fable-5@eu' | 'claude-opus-4-6@eu' | 'claude-opus-4-7@eu' | 'claude-sonnet-4-6' | 'gemini-3.1-flash-lite' | 'inkling' | 'gpt-5.5' | 'glm-5.3' | 'seed-2.0-pro' | 'step-3.7-flash' | 'nemotron-3.5-lightning-30b-a3b' | 'kat-coder-pro' | 'claude-sonnet-4-5' | 'glm-5.2' | 'minimax-m3@eu' | 'gemini-3.6-flash' | 'gpt-5.6-terra' | 'gemini-3.1-flash-image' | 'nvidia-nemotron-3-super-120b-a12b' | 'gpt-5.4' | 'gpt-4.1@eu' | 'nemotron-3-nano-omni@eu' | 'nemotron-3-nano-omni' | 'qwen3.6-plus' | 'deepseek-v4-flash-0731@eu' | 'qwen3.8-2.4T-A95B' | 'claude-haiku-4-5@eu' | 'ling-3.0-tiny' | 'claude-fable-5' | 'devstral-latest@eu' | 'qwen3.5-27b' | 'ling-2.6-flash' | 'seed-2.0-mini' | 'nvidia-nemotron-3-ultra' | 'claude-opus-4-8@eu' | 'glm-5.1' | 'gpt-4o-mini@eu' | 'gemini-3.7-flash@eu' | 'gpt-5.4@eu' | 'claude-sonnet-4@eu' | 'claude-haiku-4-5' | 'gpt-5.6-terra@eu' | 'mimo-v2.5-pro' | 'thinkingcap-qwen3.6-27b' | 'hy3' | 'gemini-3.5-flash-lite@eu' | 'claude-opus-4-6' | 'claude-opus-5' | 'leanstral-1-5' | 'claude-opus-4-5@eu' | 'mistral-medium-latest' | 'deepseek-v4-flash-0731' | 'grok-build-0.1' | 'laguna-xs.2' | 'gemini-3.7-flash' | 'gpt-5.4-nano' | 'grok-4.3' | 'glm-5.1@eu' | 'kimi-k2.6' | 'glm-5.3-flash' | 'mistral-medium-3-5@eu'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a routing.run Provider
 * @see {@link https://docs.routing.run/api-reference/models}
 */
export const createRoutingRun = (apiKey: string, baseURL = 'https://api.routing.run/v1') => merge(
  createChatProvider<'nemotron-3-ultra' | 'kimi-k2.7-code' | 'deepseek-v4-flash' | 'claude-opus-4-8' | 'gpt-5.6-sol' | 'kimi-k2.6-nitro' | 'deepseek-v4-pro' | 'gpt-5.6-luna' | 'claude-sonnet-4-6' | 'glm-5.2' | 'kimi-k2.7-code-nitro' | 'gpt-5.6-terra' | 'qwen3.5-9b' | 'glm-5.2-nitro' | 'kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a RunInfra Provider
 * @see {@link https://runinfra.ai/docs}
 */
export const createRuninfra = (apiKey: string, baseURL = 'https://api.runinfra.ai/v1') => merge(
  createChatProvider<'nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16' | 'deepseek-ai/DeepSeek-V4-Flash-0731' | 'deepseek-ai/DeepSeek-V4-Pro-0813' | 'ornith-ai/Ornith-1.5-35B-A3B' | 'Inferact/Qwen3.8-2.4T-A95B-NVFP4' | 'Qwen/Qwen3.8-27B' | 'zai-org/GLM-5.3-Flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Sakana AI Provider
 * @see {@link https://console.sakana.ai/models}
 */
export const createSakana = (apiKey: string, baseURL = 'https://api.sakana.ai/v1') => merge(
  createChatProvider<'fugu' | 'fugu-ultra-20260615' | 'sakana-namazu' | 'fugu-ultra'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Sarvam AI Provider
 * @see {@link https://docs.sarvam.ai/api-reference-docs/getting-started/models}
 */
export const createSarvam = (apiKey: string, baseURL = 'https://api.sarvam.ai/v1') => merge(
  createChatProvider<'sarvam-105b' | 'sarvam-30b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Scaleway Provider
 * @see {@link https://www.scaleway.com/en/docs/generative-apis/}
 */
export const createScaleway = (apiKey: string, baseURL = 'https://api.scaleway.ai/v1') => merge(
  createChatProvider<'gemma-4-26b-a4b-it' | 'qwen3-coder-30b-a3b-instruct' | 'whisper-large-v3' | 'mistral-small-3.2-24b-instruct-2506' | 'qwen3-embedding-8b' | 'llama-3.3-70b-instruct' | 'qwen3.5-397b-a17b' | 'bge-multilingual-gemma2' | 'gpt-oss-120b' | 'glm-5.2' | 'mistral-medium-3.5-128b' | 'qwen3.6-35b-a3b' | 'qwen3-235b-a22b-instruct-2507' | 'pixtral-12b-2409' | 'deepseek-v4-flash-0731'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a SCNet Token Plan Provider
 * @see {@link https://www.scnet.cn/ac/openapi/doc/2.0/moduleapi/plans/token-plan.html}
 */
export const createScnetTokenPlan = (apiKey: string, baseURL = 'https://api.scnet.cn/api/llm/v1') => merge(
  createChatProvider<'DeepSeek-V4-Pro' | 'Kimi-K2.5' | 'MiniMax-M2.7' | 'DeepSeek-V4-Flash-0731' | 'Qwen3.8-Max' | 'MiniMax-M3' | 'GLM-5.1' | 'DeepSeek-V3.2' | 'Kimi-K2.7-Code' | 'Kimi-K3' | 'GLM-5' | 'MiniMax-M2.5' | 'GLM-5.2' | 'Kimi-K2.6' | 'DeepSeek-V4-Pro-0813' | 'DeepSeek-V4-Flash' | 'MiMo-V2.5-Pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a SCX.ai Provider
 * @see {@link https://platform.scx.ai/docs}
 */
export const createScxAi = (apiKey: string, baseURL = 'https://api.scx.ai/v1') => merge(
  createChatProvider<'MiniMax-M2.7' | 'Qwen3.8-Max' | 'gpt-oss-120b' | 'GLM-5.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a SiliconFlow Provider
 * @see {@link https://cloud.siliconflow.com/models}
 */
export const createSiliconFlow = (apiKey: string, baseURL = 'https://api.siliconflow.com/v1') => merge(
  createChatProvider<'tencent/Hunyuan-A13B-Instruct' | 'tencent/Hy3-preview' | 'MiniMaxAI/MiniMax-M2.5' | 'google/gemma-4-26B-A4B-it' | 'google/gemma-4-31B-it' | 'moonshotai/Kimi-K2.5' | 'moonshotai/Kimi-K2.6' | 'inclusionAI/Ling-flash-2.0' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'deepseek-ai/DeepSeek-V4-Pro' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3.2-Exp' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/DeepSeek-V4-Flash' | 'stepfun-ai/Step-3.5-Flash' | 'ByteDance-Seed/Seed-OSS-36B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Thinking' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen3.6-27B' | 'Qwen/Qwen3.5-9B' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen3.5-122B-A10B' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-VL-8B-Instruct' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3-8B' | 'Qwen/Qwen3.5-27B' | 'Qwen/Qwen3.5-35B-A3B' | 'Qwen/Qwen3-VL-30B-A3B-Thinking' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen2.5-7B-Instruct' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3.6-35B-A3B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen3-VL-32B-Instruct' | 'Qwen/Qwen3-VL-32B-Thinking' | 'zai-org/GLM-5V-Turbo' | 'zai-org/GLM-4.5-Air' | 'zai-org/GLM-5.1' | 'zai-org/GLM-5' | 'zai-org/GLM-5.2' | 'baidu/ERNIE-4.5-300B-A47B'>({ apiKey, baseURL }),
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
  createChatProvider<'tencent/Hunyuan-A13B-Instruct' | 'PaddlePaddle/PaddleOCR-VL-1.5' | 'inclusionAI/Ling-flash-2.0' | 'deepseek-ai/DeepSeek-V4-Pro' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-OCR' | 'deepseek-ai/DeepSeek-V4-Flash' | 'deepseek-ai/DeepSeek-V3' | 'stepfun-ai/Step-3.5-Flash' | 'Pro/MiniMaxAI/MiniMax-M2.5' | 'Pro/moonshotai/Kimi-K2.5' | 'Pro/moonshotai/Kimi-K2.6' | 'Pro/deepseek-ai/DeepSeek-V3.1-Terminus' | 'Pro/deepseek-ai/DeepSeek-R1' | 'Pro/deepseek-ai/DeepSeek-V3.2' | 'Pro/deepseek-ai/DeepSeek-V3' | 'Pro/zai-org/GLM-5.1' | 'Pro/zai-org/GLM-5' | 'ByteDance-Seed/Seed-OSS-36B-Instruct' | 'Qwen/Qwen3.5-9B' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen3.5-4B' | 'Qwen/Qwen3.5-122B-A10B' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-8B' | 'Qwen/Qwen3.5-27B' | 'Qwen/Qwen3.5-35B-A3B' | 'Qwen/Qwen3.5-397B-A17B' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3.6-35B-A3B' | 'Qwen/Qwen3-VL-32B-Thinking' | 'Qwen/Qwen3-VL-32B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen2.5-7B-Instruct' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-VL-30B-A3B-Thinking' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3-VL-8B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Thinking' | 'zai-org/GLM-5.2' | 'zai-org/GLM-4.5-Air' | 'baidu/ERNIE-4.5-300B-A47B'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a STACKIT Provider
 * @see {@link https://docs.stackit.cloud/products/data-and-ai/ai-model-serving/basics/available-shared-models}
 */
export const createStackit = (apiKey: string, baseURL = 'https://api.openai-compat.model-serving.eu01.onstackit.cloud/v1') => merge(
  createChatProvider<'cortecs/Llama-3.3-70B-Instruct-FP8-Dynamic' | 'google/gemma-3-27b-it' | 'intfloat/e5-mistral-7b-instruct' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'Qwen/Qwen3.6-27B' | 'Qwen/Qwen3-VL-235B-A22B-Instruct-FP8' | 'Qwen/Qwen3-VL-Embedding-8B'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Standard Compute Provider
 * @see {@link https://standardcompute.com/models}
 */
export const createStandardcompute = (apiKey: string, baseURL = 'https://api.stdcmpt.com/v1') => merge(
  createChatProvider<'standardcompute'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a StepFun (China) Provider
 * @see {@link https://platform.stepfun.com/docs/zh/overview/concept}
 */
export const createStepfun = (apiKey: string, baseURL = 'https://api.stepfun.com/v1') => merge(
  createChatProvider<'step-3.5-flash-2603' | 'step-tts-2' | 'stepaudio-2.5-asr' | 'step-3.5-flash' | 'step-2-16k' | 'stepaudio-2.5-tts' | 'step-3.7-flash' | 'step-1-32k'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createSpeechProvider({ apiKey, baseURL }),
  createTranscriptionProvider({ apiKey, baseURL }),
)

/**
 * Create a StepFun (Global) Provider
 * @see {@link https://platform.stepfun.ai/docs/en/overview/concept}
 */
export const createStepfunAi = (apiKey: string, baseURL = 'https://api.stepfun.ai/v1') => merge(
  createChatProvider<'step-1-32k' | 'step-3.7-flash' | 'stepaudio-2.5-tts' | 'step-2-16k' | 'step-3.5-flash' | 'stepaudio-2.5-asr' | 'step-tts-2' | 'step-3.5-flash-2603'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a StepFun Step Plan (Global) Provider
 * @see {@link https://platform.stepfun.ai/docs/en/step-plan/integrations/reasoning-api}
 */
export const createStepfunAiStepPlan = (apiKey: string, baseURL = 'https://api.stepfun.ai/step_plan/v1') => merge(
  createChatProvider<'step-3.5-flash-2603' | 'step-3.5-flash' | 'step-3.7-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a StepFun Step Plan (China) Provider
 * @see {@link https://platform.stepfun.com/docs/zh/step-plan/integrations/reasoning-api}
 */
export const createStepfunStepPlan = (apiKey: string, baseURL = 'https://api.stepfun.com/step_plan/v1') => merge(
  createChatProvider<'step-3.5-flash-2603' | 'step-3.5-flash' | 'step-router-v1' | 'step-3.7-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Subconscious Provider
 * @see {@link https://docs.subconscious.dev}
 */
export const createSubconscious = (apiKey: string, baseURL = 'https://api.subconscious.dev/v1') => merge(
  createChatProvider<'subconscious/tim-qwen3.6-27b' | 'subconscious/glm-5.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a submodel Provider
 * @see {@link https://submodel.gitbook.io}
 */
export const createSubmodel = (apiKey: string, baseURL = 'https://llm.submodel.ai/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'zai-org/GLM-4.5-Air' | 'zai-org/GLM-4.5-FP8'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Synthetic Provider
 * @see {@link https://synthetic.new/pricing}
 */
export const createSynthetic = (apiKey: string, baseURL = 'https://api.synthetic.new/openai/v1') => merge(
  createChatProvider<'hf:openai/gpt-oss-120b' | 'hf:moonshotai/Kimi-K2.7-Code' | 'hf:moonshotai/Kimi-K3' | 'hf:nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-NVFP4' | 'hf:Qwen/Qwen3.6-27B' | 'hf:MiniMaxAI/MiniMax-M3' | 'hf:zai-org/GLM-5.2' | 'hf:zai-org/GLM-4.7-Flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Tencent Coding Plan (China) Provider
 * @see {@link https://cloud.tencent.com/document/product/1772/128947}
 */
export const createTencentCodingPlan = (apiKey: string, baseURL = 'https://api.lkeap.cloud.tencent.com/coding/v3') => merge(
  createChatProvider<'hunyuan-2.0-thinking' | 'glm-5' | 'hunyuan-2.0-instruct' | 'kimi-k2.5' | 'tc-code-latest' | 'minimax-m2.5' | 'hunyuan-t1' | 'hunyuan-turbos'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Tencent Token Plan Provider
 * @see {@link https://cloud.tencent.com/document/product/1823/130060}
 */
export const createTencentTokenPlan = (apiKey: string, baseURL = 'https://api.lkeap.cloud.tencent.com/plan/v3') => merge(
  createChatProvider<'hy4-preview' | 'hy3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Tencent TokenHub Provider
 * @see {@link https://cloud.tencent.com/document/product/1823/130050}
 */
export const createTencentTokenhub = (apiKey: string, baseURL = 'https://tokenhub.tencentmaas.com/v1') => merge(
  createChatProvider<'hy3-preview' | 'hy4-preview' | 'hy3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a TensorX Provider
 * @see {@link https://docs.tensorx.ai/}
 */
export const createTensorx = (apiKey: string, baseURL = 'https://api.tensorx.ai/v1') => merge(
  createChatProvider<'nvidia/nemotron-3-super-120b-a12b' | 'z-ai/glm-5v-turbo' | 'z-ai/glm-4.7' | 'z-ai/glm-5' | 'z-ai/glm-5-turbo' | 'z-ai/glm-5.2' | 'z-ai/glm-5.1' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-chat-v3.1' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-v4-flash-0731' | 'moonshotai/kimi-k2.7-code' | 'moonshotai/kimi-k3' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2.6' | 'openai/gpt-oss-120b' | 'qwen/qwen3-coder-30b-a3b-instruct' | 'qwen/qwen3-235b-a22b-2507' | 'qwen/qwen3.5-9b' | 'qwen/qwen3.5-122b-a10b' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'minimax/minimax-m3' | 'minimax/minimax-m2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a The Grid AI Provider
 * @see {@link https://thegrid.ai/docs}
 */
export const createTheGridAi = (apiKey: string, baseURL = 'https://api.thegrid.ai/v1') => merge(
  createChatProvider<'code-prime' | 'text-prime' | 'text-standard' | 'agent-prime' | 'agent-max' | 'code-standard' | 'text-max' | 'code-max' | 'agent-standard'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Thinking Machines Provider
 * @see {@link https://tinker-docs.thinkingmachines.ai/tinker/compatible-apis/anthropic/}
 */
export const createThinkingmachines = (apiKey: string, baseURL = 'https://tinker.thinkingmachines.dev/services/tinker-prod/anthropic/api/v1') => merge(
  createChatProvider<'thinkingmachines/Inkling' | 'thinkingmachines/Inkling:peft:262144'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Tinfoil Provider
 * @see {@link https://docs.tinfoil.sh}
 */
export const createTinfoil = (apiKey: string, baseURL = 'https://inference.tinfoil.sh/v1') => merge(
  createChatProvider<'kimi-k3' | 'deepseek-v4-flash' | 'llama3-3-70b' | 'gemma4-31b' | 'nomic-embed-text' | 'glm-5-2' | 'gpt-oss-120b' | 'gpt-oss-safeguard-120b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a TokenGo Provider
 * @see {@link https://www.tokengo.com/docs}
 */
export const createTokengo = (apiKey: string, baseURL = 'https://api.tokengo.com/v1') => merge(
  createChatProvider<'z-ai/glm-5' | 'z-ai/glm-5.3' | 'z-ai/glm-5.2' | 'z-ai/glm-5.1' | 'z-ai/glm-5.3-flash' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v3.1' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v3.2' | 'moonshotai/kimi-k3' | 'moonshotai/kimi-k2.6' | 'qwen/qwen3.5-397b-a17b' | 'minimax/minimax-m2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a TrustedRouter Provider
 * @see {@link https://trustedrouter.com/docs}
 */
export const createTrustedrouter = (apiKey: string, baseURL = 'https://api.trustedrouter.com/v1') => merge(
  createChatProvider<'cheap' | 'fast' | 'auto' | 'synth-code' | 'e2e' | 'zdr' | 'synth'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Umans AI Provider
 * @see {@link https://app.umans.ai/offers/code/docs/orgs}
 */
export const createUmansAi = (apiKey: string, baseURL = 'https://api.code.umans.ai/v1') => merge(
  createChatProvider<'umans-glm-5.2' | 'umans-deepseek-v4-flash-0731' | 'umans-deepseek-v4-pro-0813' | 'umans-kimi-k3' | 'umans-coder' | 'umans-flash' | 'umans-kimi-k2.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Umans AI Coding Plan Provider
 * @see {@link https://app.umans.ai/offers/code/docs}
 */
export const createUmansAiCodingPlan = (apiKey: string, baseURL = 'https://api.code.umans.ai/v1') => merge(
  createChatProvider<'umans-glm-5.2' | 'umans-deepseek-v4-flash-0731' | 'umans-deepseek-v4-pro-0813' | 'umans-kimi-k3' | 'umans-qwen3.6-35b-a3b' | 'umans-coder' | 'umans-flash' | 'umans-kimi-k2.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a UnoRouter Provider
 * @see {@link https://unorouter.com/models}
 */
export const createUnorouter = (apiKey: string, baseURL = 'https://api.unorouter.com/v1') => merge(
  createChatProvider<'deepseek-v4-flash' | 'claude-opus-4-8' | 'gpt-5.4:free' | 'glm-5.2:free' | 'deepseek-v4-pro' | 'claude-sonnet-5' | 'glm-4.5-flash:free' | 'gpt-5.5:free' | 'minimax-m2.7' | 'gpt-5.2' | 'gemini-3.5-flash' | 'step-3.7-flash:free' | 'deepseek-v4-pro:free' | 'gpt-5.5' | 'gemma-4-31b-it:free' | 'claude-haiku-4-5-20251001' | 'glm-5.2' | 'deepseek-v4-flash:free' | 'gpt-5.4' | 'nemotron-3-ultra-550b-a55b:free' | 'qwen3.5-397b-a17b:free' | 'minimax-m2.7:free' | 'kimi-k2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Upstage Provider
 * @see {@link https://developers.upstage.ai/docs/apis/chat}
 */
export const createUpstage = (apiKey: string, baseURL = 'https://api.upstage.ai/v1/solar') => merge(
  createChatProvider<'solar-pro2' | 'solar-mini' | 'solar-pro4' | 'solar-pro3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Vancine Provider
 * @see {@link https://vancine.com/docs}
 */
export const createVancine = (apiKey: string, baseURL = 'https://vancine.com/v1') => merge(
  createChatProvider<'kimi-k3' | 'deepseek-v4-flash' | 'deepseek-v4-pro' | 'MiniMax-M3' | 'qwen3.8-max' | 'qwen3.8-flash' | 'glm-5.3' | 'glm-5.3-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Venice AI Provider
 * @see {@link https://docs.venice.ai}
 */
export const createVenice = (apiKey: string, baseURL = 'https://api.venice.ai/api/v1') => merge(
  createChatProvider<'deepseek-v4-flash-0731-fast' | 'claude-opus-4-7' | 'minimax-m3-preview' | 'gemini-3-7-flash' | 'qwen3-5-35b-a3b' | 'grok-4-3' | 'kimi-k3' | 'gemini-3-5-flash-lite' | 'google-gemma-3-27b-it' | 'openai-gpt-4o-2024-11-20' | 'deepseek-v4-flash' | 'zai-org-glm-5' | 'qwen3-235b-a22b-thinking-2507' | 'openai-gpt-54-pro' | 'hermes-3-llama-3.1-405b' | 'openai-gpt-55-pro' | 'claude-opus-4-8' | 'venice-uncensored-role-play' | 'qwen3-next-80b' | 'qwen-3-8-max' | 'openai-gpt-54' | 'kimi-k3-fast-api' | 'z-ai-glm-5-turbo' | 'openai-gpt-55' | 'aion-labs-aion-3-0-mini' | 'zai-org-glm-5-2' | 'deepseek-v4-pro-0813' | 'deepseek-v4-pro' | 'claude-sonnet-5' | 'deepseek-v3.2' | 'openai-gpt-56-luna-pro' | 'openai-gpt-56-terra' | 'openai-gpt-56-sol-pro' | 'gemini-3-6-flash' | 'kimi-k2-5' | 'mercury-2' | 'olafangensan-glm-4.7-flash-heretic' | 'grok-4-6' | 'claude-opus-4-8-fast' | 'mistral-small-3-2-24b-instruct' | 'kimi-k2-7-code' | 'aion-labs-aion-3-0' | 'openai-gpt-56-terra-pro' | 'qwen3-5-9b' | 'venice-uncensored-1-2' | 'qwen3-6-27b' | 'openai-gpt-53-codex' | 'mistral-small-2603' | 'openai-gpt-4o-mini-2024-07-18' | 'claude-opus-4-5' | 'qwen3-coder-480b-a35b-instruct-turbo' | 'qwen-3-7-plus' | 'zai-org-glm-4.7-flash' | 'google-gemma-4-26b-a4b-it' | 'openai-gpt-52' | 'claude-sonnet-4-6' | 'qwen3-vl-235b-a22b' | 'inkling' | 'minimax-m27' | 'openai-gpt-54-mini' | 'minimax-m25' | 'z-ai-glm-5v-turbo' | 'z-ai-glm-5-3-flash' | 'qwen3-5-397b-a17b' | 'z-ai-glm-5-3' | 'qwen-3-7-max' | 'zai-org-glm-5-1' | 'zai-org-glm-4.7' | 'claude-sonnet-4-5' | 'grok-4-20-multi-agent' | 'gemini-3-1-pro-preview' | 'zai-org-glm-4.6' | 'kimi-k2-6' | 'qwen-3-8-2-4t-a95b' | 'qwen3-235b-a22b-instruct-2507' | 'openai-gpt-56-sol' | 'gemma-4-uncensored' | 'claude-fable-5' | 'grok-4-20' | 'openai-gpt-oss-120b' | 'gemini-3-flash-preview' | 'openai-gpt-56-luna' | 'claude-opus-4-6' | 'claude-opus-5-fast' | 'nvidia-nemotron-3-ultra-550b-a55b' | 'openai-gpt-52-codex' | 'claude-opus-5' | 'llama-3.2-3b' | 'qwen-3-8-27b' | 'grok-4-5' | 'nvidia-nemotron-3-nano-30b-a3b' | 'deepseek-v4-flash-0731' | 'llama-3.3-70b' | 'xiaomi-mimo-v2-5' | 'google-gemma-4-31b-it' | 'grok-build-0-1' | 'gemini-3-5-flash' | 'qwen-3-6-plus' | 'seed-2-1-turbo' | 'qwen3-6-35b-a3b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Vivgrid Provider
 * @see {@link https://docs.vivgrid.com/models}
 */
export const createVivgrid = (apiKey: string, baseURL = 'https://api.vivgrid.com/v1') => merge(
  createChatProvider<'kimi-k3' | 'deepseek-v4-flash' | 'gpt-5.6-sol' | 'gemini-3.1-pro-preview' | 'deepseek-v4-pro' | 'deepseek-v3.2' | 'gpt-5-mini' | 'gpt-5.6-luna' | 'gpt-5.3-codex' | 'gpt-5.4-mini' | 'gpt-5.5' | 'glm-5.3' | 'gpt-5.2-codex' | 'glm-5.2' | 'gpt-5.6-terra' | 'gpt-5.4' | 'gemini-3.1-flash-lite-preview' | 'gpt-5.1-codex-max' | 'gpt-5.1-codex' | 'gemini-3.7-flash' | 'gpt-5.4-nano' | 'glm-5.3-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Volcengine Ark Provider
 * @see {@link https://www.volcengine.com/docs/82379/1330310}
 */
export const createVolcengine = (apiKey: string, baseURL = 'https://ark.cn-beijing.volces.com/api/v3') => merge(
  createChatProvider<'doubao-seed-2-0-pro-260215' | 'doubao-seed-1-6-251015' | 'doubao-seed-evolving' | 'doubao-seed-2-1-pro-260628' | 'doubao-seed-1-6-flash-250828' | 'doubao-seed-2-0-lite-260428' | 'doubao-seed-2-0-code-preview-260215' | 'doubao-seed-1-6-vision-250815' | 'doubao-seed-2-0-mini-260428' | 'doubao-seed-2-1-turbo-260628' | 'deepseek-v4-pro-ga-260813' | 'deepseek-v4-flash-ga-260731' | 'glm-5-2-260617' | 'doubao-seed-character-260628' | 'doubao-seed-1-8-251228'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Volcengine Ark Coding Plan Provider
 * @see {@link https://www.volcengine.com/docs/82379/1928261}
 */
export const createVolcengineCodingPlan = (apiKey: string, baseURL = 'https://ark.cn-beijing.volces.com/api/coding/v3') => merge(
  createChatProvider<'kimi-k2.7-code' | 'deepseek-v4-flash' | 'deepseek-v4-pro' | 'doubao-seed-evolving' | 'minimax-m3' | 'doubao-seed-2.1-turbo' | 'glm-5.3' | 'doubao-seed-2.0-lite'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Vultr Provider
 * @see {@link https://api.vultrinference.com/}
 */
export const createVultr = (apiKey: string, baseURL = 'https://api.vultrinference.com/v1') => merge(
  createChatProvider<'XiaomiMiMo/MiMo-V2.5-Pro' | 'MiniMaxAI/MiniMax-M2.7' | 'nvidia/Nemotron-Cascade-2-30B-A3B' | 'nvidia/DeepSeek-V3.2-NVFP4' | 'nvidia/Nemotron-3-Nano-Omni-30B-A3B-Reasoning-BF16' | 'moonshotai/Kimi-K2.6' | 'deepseek-ai/DeepSeek-V4-Flash' | 'Qwen/Qwen3.6-27B' | 'Qwen/Qwen3.5-397B-A17B' | 'zai-org/GLM-5.2-FP8'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Wafer Provider
 * @see {@link https://docs.wafer.ai/wafer-pass}
 */
export const createWaferAi = (apiKey: string, baseURL = 'https://pass.wafer.ai/v1') => merge(
  createChatProvider<'MiniMax-M3' | 'GLM-5.1' | 'glm5.2-fast' | 'GLM-5.2' | 'Kimi-K2.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Weights & Biases Provider
 * @see {@link https://docs.wandb.ai/guides/integrations/inference/}
 */
export const createWandb = (apiKey: string, baseURL = 'https://api.inference.wandb.ai/v1') => merge(
  createChatProvider<'MiniMaxAI/MiniMax-M3' | 'nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B' | 'nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B' | 'google/gemma-4-31B-it' | 'JetBrains/Mellum2-12B-A2.5B-Instruct' | 'moonshotai/Kimi-K2.7-Code' | 'moonshotai/Kimi-K2.6' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'deepseek-ai/DeepSeek-V4-Pro' | 'deepseek-ai/DeepSeek-V4-Flash-0731' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V4-Pro-0813' | 'deepseek-ai/DeepSeek-V4-Flash' | 'Qwen/Qwen3.6-27B' | 'Qwen/Qwen3.5-35B-A3B' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3.6-35B-A3B' | 'Qwen/Qwen3.8-27B' | 'zai-org/GLM-5.2' | 'meta-llama/Llama-3.1-70B-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct' | 'meta-llama/Llama-3.1-8B-Instruct' | 'OpenPipe/Qwen3-14B-Instruct' | 'ibm-granite/granite-4.2-8b' | 'ibm-granite/granite-4.1-8b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a xAI Provider
 * @see {@link https://docs.x.ai/docs/models}
 */
export const createXai = (apiKey: string, baseURL = 'https://api.x.ai/v1/') => merge(
  createChatProvider<'grok-imagine-video' | 'grok-4.6' | 'grok-4.5' | 'grok-4.20-0309-non-reasoning' | 'grok-imagine-video-1.5' | 'grok-imagine-image-quality' | 'grok-4.20-0309-reasoning' | 'grok-4.20-multi-agent-0309' | 'grok-imagine-image-2.0' | 'grok-imagine-image' | 'grok-build-0.1' | 'grok-4.3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xiaomi Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 */
export const createXiaomi = (apiKey: string, baseURL = 'https://api.xiaomimimo.com/v1') => merge(
  createChatProvider<'mimo-v2.5-pro-ultraspeed' | 'mimo-v2.5' | 'mimo-v2-pro' | 'mimo-v2-omni' | 'mimo-v2-flash' | 'mimo-v2.5-pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xiaomi Token Plan (Europe) Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 */
export const createXiaomiTokenPlanAms = (apiKey: string, baseURL = 'https://token-plan-ams.xiaomimimo.com/v1') => merge(
  createChatProvider<'mimo-v2.5-pro' | 'mimo-v2.5-tts-voicedesign' | 'mimo-v2-tts' | 'mimo-v2-pro' | 'mimo-v2.5-tts-voiceclone' | 'mimo-v2.5-tts' | 'mimo-v2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xiaomi Token Plan (China) Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 */
export const createXiaomiTokenPlanCn = (apiKey: string, baseURL = 'https://token-plan-cn.xiaomimimo.com/v1') => merge(
  createChatProvider<'mimo-v2.5' | 'mimo-v2.5-tts' | 'mimo-v2.5-tts-voiceclone' | 'mimo-v2-pro' | 'mimo-v2-tts' | 'mimo-v2.5-tts-voicedesign' | 'mimo-v2.5-pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xiaomi Token Plan (Singapore) Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 */
export const createXiaomiTokenPlanSgp = (apiKey: string, baseURL = 'https://token-plan-sgp.xiaomimimo.com/v1') => merge(
  createChatProvider<'mimo-v2.5-pro' | 'mimo-v2.5-tts-voicedesign' | 'mimo-v2-tts' | 'mimo-v2-pro' | 'mimo-v2.5-tts-voiceclone' | 'mimo-v2.5-tts' | 'mimo-v2.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xpersona Provider
 * @see {@link https://www.xpersona.co/docs}
 */
export const createXpersona = (apiKey: string, baseURL = 'https://www.xpersona.co/v1') => merge(
  createChatProvider<'claude-opus-4-8' | 'gpt-5.6-sol' | 'gpt-5.6' | 'gemini-3.5-flash' | 'gpt-5.4-mini' | 'xpersona-gpt-5.5' | 'claude-sonnet-4-6' | 'gpt-5.5' | 'gpt-5.6-terra' | 'gpt-5.4' | 'xpersona-frieren-coder' | 'claude-fable-5' | 'claude-haiku-4-5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Z.AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 */
export const createZai = (apiKey: string, baseURL = 'https://api.z.ai/api/paas/v4') => merge(
  createChatProvider<'glm-4.6' | 'glm-4.5-flash' | 'glm-5v-turbo' | 'glm-4.7' | 'glm-4.5v' | 'glm-4.7-flashx' | 'glm-5' | 'glm-5-turbo' | 'glm-5.3' | 'glm-5.2' | 'glm-4.6v' | 'glm-4.5-air' | 'glm-5.1' | 'glm-4.7-flash' | 'glm-4.5' | 'glm-5.3-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Z.AI Coding Plan Provider
 * @see {@link https://docs.z.ai/devpack/overview}
 */
export const createZaiCodingPlan = (apiKey: string, baseURL = 'https://api.z.ai/api/coding/paas/v4') => merge(
  createChatProvider<'glm-4.7' | 'glm-5-turbo' | 'glm-5.3' | 'glm-5.2' | 'glm-5.2-highspeed' | 'glm-5.3-highspeed' | 'glm-5.3-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Zeldoc Provider
 * @see {@link https://docs.zeldoc.ai}
 */
export const createZeldoc = (apiKey: string, baseURL = 'https://api.zeldoc.ai/v1') => merge(
  createChatProvider<'zdev'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Zenifra Provider
 * @see {@link https://docs.zenifra.com}
 */
export const createZenifra = (apiKey: string, baseURL = 'https://ai.zenifra.com/v1') => merge(
  createChatProvider<'alibaba/qwen3.6-35b-a3b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a ZenMux Provider
 * @see {@link https://docs.zenmux.ai}
 */
export const createZenmux = (apiKey: string, baseURL = 'https://zenmux.ai/api/v1') => merge(
  createChatProvider<'tencent/hy3-preview' | 'z-ai/glm-4.6' | 'z-ai/glm-4.7-flash-free' | 'z-ai/glm-5v-turbo' | 'z-ai/glm-4.7' | 'z-ai/glm-5.2-free' | 'z-ai/glm-4.6v-flash' | 'z-ai/glm-4.7-flashx' | 'z-ai/glm-5' | 'z-ai/glm-5-turbo' | 'z-ai/glm-4.6v-flash-free' | 'z-ai/glm-5.2' | 'z-ai/glm-4.6v' | 'z-ai/glm-4.5-air' | 'z-ai/glm-5.1' | 'z-ai/glm-4.5' | 'deepseek/deepseek-v4-flash' | 'deepseek/deepseek-v4-pro' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-chat' | 'deepseek/deepseek-v3.2-exp' | 'google/gemini-3.1-pro-preview' | 'google/gemini-2.5-flash-lite' | 'google/gemini-3.5-flash' | 'google/gemini-3.1-flash-lite' | 'google/gemini-2.5-flash' | 'google/gemini-3.1-flash-lite-preview' | 'google/gemini-3-flash-preview' | 'google/gemini-2.5-pro' | 'x-ai/grok-4.2-fast-non-reasoning' | 'x-ai/grok-4.5' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4.2-fast' | 'x-ai/grok-4' | 'x-ai/grok-4-fast' | 'x-ai/grok-4.1-fast' | 'x-ai/grok-4.1-fast-non-reasoning' | 'x-ai/grok-build-0.1' | 'x-ai/grok-4.3' | 'kuaishou/kat-coder-pro-v2' | 'moonshotai/kimi-k3-free' | 'moonshotai/kimi-k2.7-code' | 'moonshotai/kimi-k3' | 'moonshotai/kimi-k2.7-code-free' | 'moonshotai/kimi-k2-thinking-turbo' | 'moonshotai/kimi-k2.5' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2.6' | 'anthropic/claude-opus-4.8' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-4.6' | 'anthropic/claude-sonnet-5' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.7' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-3.7-sonnet' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-sonnet-5-free' | 'anthropic/claude-opus-4.6' | 'anthropic/claude-opus-4' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-fable-5' | 'anthropic/claude-3.5-haiku' | 'openai/gpt-5.1-chat' | 'openai/gpt-5.5-pro' | 'openai/gpt-5.3-chat' | 'openai/gpt-5.6-sol' | 'openai/gpt-5.4-pro' | 'openai/gpt-5' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5-codex' | 'openai/gpt-5.6-luna' | 'openai/gpt-5.3-codex' | 'openai/gpt-5.2' | 'openai/gpt-5.4-mini' | 'openai/gpt-5.5' | 'openai/gpt-5.5-instant' | 'openai/gpt-5.2-codex' | 'openai/gpt-5.6-terra' | 'openai/gpt-5.4' | 'openai/gpt-5.2-pro' | 'openai/gpt-5.1-codex' | 'openai/gpt-5.4-nano' | 'openai/gpt-5.1' | 'stepfun/step-3.5-flash' | 'stepfun/step-3.7-flash' | 'stepfun/step-3' | 'stepfun/step-3.7-flash-free' | 'qwen/qwen3.7-max' | 'qwen/qwen3.5-flash' | 'qwen/qwen3.5-plus' | 'qwen/qwen3.7-plus' | 'qwen/qwen3-max' | 'qwen/qwen3.6-plus' | 'qwen/qwen3-coder-plus' | 'xiaomi/mimo-v2.5' | 'xiaomi/mimo-v2-pro' | 'xiaomi/mimo-v2-omni' | 'xiaomi/mimo-v2-flash' | 'xiaomi/mimo-v2.5-pro' | 'sapiens-ai/agnes-1.5-pro' | 'sapiens-ai/agnes-1.5-lite' | 'volcengine/doubao-seed-code' | 'volcengine/doubao-seed-2.0-mini' | 'volcengine/doubao-seed-2.0-code' | 'volcengine/doubao-seed-1.8' | 'volcengine/doubao-seed-2.0-lite' | 'volcengine/doubao-seed-2.0-pro' | 'inclusionai/ling-1t' | 'inclusionai/ring-1t' | 'inclusionai/ring-2.6-1t' | 'baidu/ernie-5.0-thinking-preview' | 'minimax/minimax-m2.7-highspeed' | 'minimax/minimax-m3' | 'minimax/minimax-m2.7' | 'minimax/minimax-m2.5-lightning' | 'minimax/minimax-m2' | 'minimax/minimax-m2.5' | 'minimax/minimax-m2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Zhipu AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 */
export const createZhipuai = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/paas/v4') => merge(
  createChatProvider<'glm-5v-turbo' | 'glm-5' | 'glm-5.3' | 'glm-5.2' | 'glm-5.1' | 'glm-5.3-flash' | 'glm-4.5' | 'glm-4.7-flash' | 'glm-4.5-air' | 'glm-4.6v' | 'glm-4.7-flashx' | 'glm-4.5v' | 'glm-4.7' | 'glm-4.5-flash' | 'glm-4.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Zhipu AI Coding Plan Provider
 * @see {@link https://docs.bigmodel.cn/cn/coding-plan/overview}
 */
export const createZhipuaiCodingPlan = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/coding/paas/v4') => merge(
  createChatProvider<'glm-5v-turbo' | 'glm-5.3' | 'glm-5.1' | 'glm-5.3-highspeed' | 'glm-5.3-flash' | 'glm-5.2-highspeed' | 'glm-4.6v' | 'glm-5.2' | 'glm-5-turbo' | 'glm-4.7'>({ apiKey, baseURL }),
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
