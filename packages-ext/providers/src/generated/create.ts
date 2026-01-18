/* eslint-disable perfectionist/sort-union-types */
/* eslint-disable sonarjs/no-identical-functions */

import { createChatProvider, createEmbedProvider, createImageProvider, createModelProvider, createSpeechProvider, createTranscriptionProvider, merge } from '../utils'

/**
 * Create a Abacus Provider
 * @see {@link https://abacus.ai/help/api}
 */
export const createAbacus = (apiKey: string, baseURL = 'https://routellm.abacus.ai/v1') => merge(
  createChatProvider<'gpt-4.1-nano' | 'grok-4-fast-non-reasoning' | 'gemini-2.0-flash-001' | 'gemini-3-flash-preview' | 'route-llm' | 'grok-code-fast-1' | 'kimi-k2-turbo-preview' | 'gemini-3-pro-preview' | 'gemini-2.5-flash' | 'gpt-4.1-mini' | 'claude-opus-4-5-20251101' | 'qwen-2.5-coder-32b' | 'claude-sonnet-4-5-20250929' | 'grok-4-0709' | 'o3-mini' | 'gpt-5.2-chat-latest' | 'gemini-2.0-pro-exp-02-05' | 'gpt-5.1' | 'gpt-5-nano' | 'claude-sonnet-4-20250514' | 'gpt-4.1' | 'o4-mini' | 'claude-opus-4-20250514' | 'gpt-5-mini' | 'o3-pro' | 'claude-3-7-sonnet-20250219' | 'gemini-2.5-pro' | 'gpt-4o-2024-11-20' | 'o3' | 'gpt-4o-mini' | 'qwen3-max' | 'gpt-5' | 'grok-4-1-fast-non-reasoning' | 'llama-3.3-70b-versatile' | 'claude-opus-4-1-20250805' | 'gpt-5.2' | 'gpt-5.1-chat-latest' | 'claude-haiku-4-5-20251001' | 'deepseek/deepseek-v3.1' | 'openai/gpt-oss-120b' | 'meta-llama/Meta-Llama-3.1-8B-Instruct' | 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'meta-llama/Meta-Llama-3.1-70B-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/QwQ-32B' | 'Qwen/Qwen3-32B' | 'Qwen/qwen3-coder-480b-a35b-instruct' | 'zai-org/glm-4.7' | 'zai-org/glm-4.5' | 'zai-org/glm-4.6' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-V3.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 */
export const createAlibaba = (apiKey: string, baseURL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1') => merge(
  createChatProvider<'qwen3-livetranslate-flash-realtime' | 'qwen3-asr-flash' | 'qwen-omni-turbo' | 'qwen-vl-max' | 'qwen3-next-80b-a3b-instruct' | 'qwen-turbo' | 'qwen3-vl-235b-a22b' | 'qwen3-coder-flash' | 'qwen3-vl-30b-a3b' | 'qwen3-14b' | 'qvq-max' | 'qwen-plus-character-ja' | 'qwen2-5-14b-instruct' | 'qwq-plus' | 'qwen3-coder-30b-a3b-instruct' | 'qwen-vl-ocr' | 'qwen2-5-72b-instruct' | 'qwen3-omni-flash' | 'qwen-flash' | 'qwen3-8b' | 'qwen3-omni-flash-realtime' | 'qwen2-5-vl-72b-instruct' | 'qwen3-vl-plus' | 'qwen-plus' | 'qwen2-5-32b-instruct' | 'qwen2-5-omni-7b' | 'qwen-max' | 'qwen2-5-7b-instruct' | 'qwen2-5-vl-7b-instruct' | 'qwen3-235b-a22b' | 'qwen-omni-turbo-realtime' | 'qwen-mt-turbo' | 'qwen3-coder-480b-a35b-instruct' | 'qwen-mt-plus' | 'qwen3-max' | 'qwen3-coder-plus' | 'qwen3-next-80b-a3b-thinking' | 'qwen3-32b' | 'qwen-vl-plus'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Alibaba (China) Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 */
export const createAlibabaCn = (apiKey: string, baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1') => merge(
  createChatProvider<'deepseek-r1-distill-qwen-7b' | 'qwen3-asr-flash' | 'deepseek-r1-0528' | 'deepseek-v3' | 'qwen-omni-turbo' | 'qwen-vl-max' | 'deepseek-v3-2-exp' | 'qwen3-next-80b-a3b-instruct' | 'deepseek-r1' | 'qwen-turbo' | 'qwen3-vl-235b-a22b' | 'qwen3-coder-flash' | 'qwen3-vl-30b-a3b' | 'qwen3-14b' | 'qvq-max' | 'deepseek-r1-distill-qwen-32b' | 'qwen-plus-character' | 'qwen2-5-14b-instruct' | 'qwq-plus' | 'qwen2-5-coder-32b-instruct' | 'qwen3-coder-30b-a3b-instruct' | 'qwen-math-plus' | 'qwen-vl-ocr' | 'qwen-doc-turbo' | 'qwen-deep-research' | 'qwen2-5-72b-instruct' | 'qwen3-omni-flash' | 'qwen-flash' | 'qwen3-8b' | 'qwen3-omni-flash-realtime' | 'qwen2-5-vl-72b-instruct' | 'qwen3-vl-plus' | 'qwen-plus' | 'qwen2-5-32b-instruct' | 'qwen2-5-omni-7b' | 'qwen-max' | 'qwen-long' | 'qwen2-5-math-72b-instruct' | 'moonshot-kimi-k2-instruct' | 'tongyi-intent-detect-v3' | 'qwen2-5-7b-instruct' | 'qwen2-5-vl-7b-instruct' | 'deepseek-v3-1' | 'deepseek-r1-distill-llama-70b' | 'qwen3-235b-a22b' | 'qwen2-5-coder-7b-instruct' | 'deepseek-r1-distill-qwen-14b' | 'qwen-omni-turbo-realtime' | 'qwen-math-turbo' | 'qwen-mt-turbo' | 'deepseek-r1-distill-llama-8b' | 'qwen3-coder-480b-a35b-instruct' | 'qwen-mt-plus' | 'qwen3-max' | 'qwq-32b' | 'qwen2-5-math-7b-instruct' | 'qwen3-next-80b-a3b-thinking' | 'deepseek-r1-distill-qwen-1-5b' | 'qwen3-32b' | 'qwen-vl-plus' | 'qwen3-coder-plus'>({ apiKey, baseURL }),
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
  createChatProvider<'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'zai-org/GLM-4.7' | 'zai-org/GLM-4.6' | 'deepseek-ai/DeepSeek-V3.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cerebras Provider
 * @see {@link https://inference-docs.cerebras.ai/models/overview}
 */
export const createCerebras = (apiKey: string, baseURL = 'https://api.cerebras.ai/v1/') => merge(
  createChatProvider<'zai-glm-4.7' | 'qwen-3-235b-a22b-instruct-2507' | 'gpt-oss-120b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Chutes Provider
 * @see {@link https://llm.chutes.ai/v1/models}
 */
export const createChutes = (apiKey: string, baseURL = 'https://llm.chutes.ai/v1') => merge(
  createChatProvider<'NousResearch/Hermes-4.3-36B' | 'NousResearch/Hermes-4-70B' | 'NousResearch/Hermes-4-14B' | 'NousResearch/Hermes-4-405B-FP8-TEE' | 'NousResearch/DeepHermes-3-Mistral-24B-Preview' | 'rednote-hilab/dots.ocr' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking-TEE' | 'MiniMaxAI/MiniMax-M2.1-TEE' | 'nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16' | 'tngtech/DeepSeek-R1T-Chimera' | 'tngtech/DeepSeek-TNG-R1T2-Chimera' | 'tngtech/TNG-R1T-Chimera-TEE' | 'XiaomiMiMo/MiMo-V2-Flash' | 'OpenGVLab/InternVL3-78B-TEE' | 'openai/gpt-oss-120b-TEE' | 'openai/gpt-oss-20b' | 'chutesai/Mistral-Small-3.1-24B-Instruct-2503' | 'chutesai/Mistral-Small-3.2-24B-Instruct-2506' | 'mistralai/Devstral-2-123B-Instruct-2512' | 'mistralai/Devstral-2-123B-Instruct-2512-TEE' | 'unsloth/Mistral-Nemo-Instruct-2407' | 'unsloth/gemma-3-4b-it' | 'unsloth/Mistral-Small-24B-Instruct-2501' | 'unsloth/gemma-3-12b-it' | 'unsloth/gemma-3-27b-it' | 'Qwen/Qwen3-30B-A3B' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3Guard-Gen-0.6B' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen2.5-VL-72B-Instruct-TEE' | 'Qwen/Qwen3-235B-A22B' | 'Qwen/Qwen3-235B-A22B-Instruct-2507-TEE' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8-TEE' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'miromind-ai/MiroThinker-v1.5-235B' | 'zai-org/GLM-4.6-TEE' | 'zai-org/GLM-4.5-TEE' | 'zai-org/GLM-4.6V' | 'zai-org/GLM-4.7-TEE' | 'zai-org/GLM-4.5-Air' | 'deepseek-ai/DeepSeek-V3-0324-TEE' | 'deepseek-ai/DeepSeek-V3.2-Speciale-TEE' | 'deepseek-ai/DeepSeek-V3.1-Terminus-TEE' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/DeepSeek-R1-TEE' | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B' | 'deepseek-ai/DeepSeek-R1-0528-TEE' | 'deepseek-ai/DeepSeek-V3.2-TEE' | 'deepseek-ai/DeepSeek-V3.1-TEE'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cohere Provider
 * @see {@link https://docs.cohere.com/docs/models}
 */
export const createCohere = (apiKey: string, baseURL = 'https://api.cohere.ai/compatibility/v1/') => merge(
  createChatProvider<'command-a-translate-08-2025' | 'command-a-03-2025' | 'command-r-08-2024' | 'command-r-plus-08-2024' | 'command-r7b-12-2024' | 'command-a-reasoning-08-2025' | 'command-a-vision-07-2025'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Cortecs Provider
 * @see {@link https://api.cortecs.ai/v1/models}
 */
export const createCortecs = (apiKey: string, baseURL = 'https://api.cortecs.ai/v1') => merge(
  createChatProvider<'nova-pro-v1' | 'devstral-2512' | 'intellect-3' | 'claude-4-5-sonnet' | 'deepseek-v3-0324' | 'kimi-k2-thinking' | 'kimi-k2-instruct' | 'gpt-4.1' | 'gemini-2.5-pro' | 'gpt-oss-120b' | 'devstral-small-2512' | 'qwen3-coder-480b-a35b-instruct' | 'claude-sonnet-4' | 'llama-3.1-405b-instruct' | 'qwen3-next-80b-a3b-thinking' | 'qwen3-32b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Deep Infra Provider
 * @see {@link https://deepinfra.com/models}
 */
export const createDeepinfra = (apiKey: string, baseURL = 'https://api.deepinfra.com/v1/openai/') => merge(
  createChatProvider<'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-K2-Thinking' | 'MiniMaxAI/MiniMax-M2' | 'MiniMaxAI/MiniMax-M2.1' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo' | 'zai-org/GLM-4.5' | 'zai-org/GLM-4.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a DeepSeek Provider
 * @see {@link https://platform.deepseek.com/api-docs/pricing}
 */
export const createDeepSeek = (apiKey: string, baseURL = 'https://api.deepseek.com') => merge(
  createChatProvider<'deepseek-chat' | 'deepseek-reasoner'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a FastRouter Provider
 * @see {@link https://fastrouter.ai/models}
 */
export const createFastrouter = (apiKey: string, baseURL = 'https://go.fastrouter.ai/api/v1') => merge(
  createChatProvider<'moonshotai/kimi-k2' | 'x-ai/grok-4' | 'google/gemini-2.5-flash' | 'google/gemini-2.5-pro' | 'openai/gpt-5-nano' | 'openai/gpt-4.1' | 'openai/gpt-5-mini' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'openai/gpt-5' | 'qwen/qwen3-coder' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-4' | 'deepseek-ai/deepseek-r1-distill-llama-70b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Fireworks AI Provider
 * @see {@link https://fireworks.ai/docs/}
 */
export const createFireworks = (apiKey: string, baseURL = 'https://api.fireworks.ai/inference/v1/') => merge(
  createChatProvider<'accounts/fireworks/models/deepseek-r1-0528' | 'accounts/fireworks/models/deepseek-v3p1' | 'accounts/fireworks/models/deepseek-v3p2' | 'accounts/fireworks/models/minimax-m2' | 'accounts/fireworks/models/minimax-m2p1' | 'accounts/fireworks/models/glm-4p7' | 'accounts/fireworks/models/deepseek-v3-0324' | 'accounts/fireworks/models/glm-4p6' | 'accounts/fireworks/models/kimi-k2-thinking' | 'accounts/fireworks/models/kimi-k2-instruct' | 'accounts/fireworks/models/qwen3-235b-a22b' | 'accounts/fireworks/models/gpt-oss-20b' | 'accounts/fireworks/models/gpt-oss-120b' | 'accounts/fireworks/models/glm-4p5-air' | 'accounts/fireworks/models/qwen3-coder-480b-a35b-instruct' | 'accounts/fireworks/models/glm-4p5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Firmware Provider
 * @see {@link https://docs.firmware.ai}
 */
export const createFirmware = (apiKey: string, baseURL = 'https://app.firmware.ai/api/v1') => merge(
  createChatProvider<'grok-4-fast-non-reasoning' | 'grok-4-fast-reasoning' | 'gemini-3-flash-preview' | 'deepseek-coder' | 'grok-code-fast-1' | 'claude-opus-4-5' | 'deepseek-chat' | 'gemini-3-pro-preview' | 'gemini-2.5-flash' | 'claude-sonnet-4-5-20250929' | 'gpt-5-nano' | 'gpt-4o' | 'gpt-5-mini' | 'deepseek-reasoner' | 'gemini-2.5-pro' | 'gpt-5' | 'gpt-5.2' | 'claude-haiku-4-5-20251001'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Friendli Provider
 * @see {@link https://friendli.ai/docs/guides/serverless_endpoints/introduction}
 */
export const createFriendli = (apiKey: string, baseURL = 'https://api.friendli.ai/serverless/v1') => merge(
  createChatProvider<'meta-llama-3.3-70b-instruct' | 'meta-llama-3.1-8b-instruct' | 'LGAI-EXAONE/K-EXAONE-236B-A23B' | 'LGAI-EXAONE/EXAONE-4.0.1-32B' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct' | 'meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'Qwen/Qwen3-30B-A3B' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'zai-org/GLM-4.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a GitHub Copilot Provider
 * @see {@link https://docs.github.com/en/copilot}
 */
export const createGithubCopilot = (apiKey: string, baseURL = 'https://api.githubcopilot.com') => merge(
  createChatProvider<'gemini-2.0-flash-001' | 'claude-opus-4' | 'gemini-3-flash-preview' | 'gpt-5.2-codex' | 'grok-code-fast-1' | 'gpt-5.1-codex' | 'claude-haiku-4.5' | 'gemini-3-pro-preview' | 'claude-3.5-sonnet' | 'gpt-5.1-codex-mini' | 'o3-mini' | 'gpt-5.1' | 'gpt-5-codex' | 'gpt-4o' | 'gpt-4.1' | 'o4-mini' | 'claude-opus-41' | 'gpt-5-mini' | 'claude-3.7-sonnet' | 'gemini-2.5-pro' | 'gpt-5.1-codex-max' | 'o3' | 'claude-sonnet-4' | 'gpt-5' | 'claude-3.7-sonnet-thought' | 'claude-opus-4.5' | 'gpt-5.2' | 'claude-sonnet-4.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a GitHub Models Provider
 * @see {@link https://docs.github.com/en/github-models}
 */
export const createGithubModels = (apiKey: string, baseURL = 'https://models.github.ai/inference') => merge(
  createChatProvider<'core42/jais-30b-chat' | 'xai/grok-3' | 'xai/grok-3-mini' | 'cohere/cohere-command-r-08-2024' | 'cohere/cohere-command-a' | 'cohere/cohere-command-r-plus-08-2024' | 'cohere/cohere-command-r' | 'cohere/cohere-command-r-plus' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-r1' | 'deepseek/deepseek-v3-0324' | 'mistral-ai/mistral-medium-2505' | 'mistral-ai/ministral-3b' | 'mistral-ai/mistral-nemo' | 'mistral-ai/mistral-large-2411' | 'mistral-ai/codestral-2501' | 'mistral-ai/mistral-small-2503' | 'microsoft/phi-3-medium-128k-instruct' | 'microsoft/phi-3-mini-4k-instruct' | 'microsoft/phi-3-small-128k-instruct' | 'microsoft/phi-3.5-vision-instruct' | 'microsoft/phi-4' | 'microsoft/phi-4-mini-reasoning' | 'microsoft/phi-3-small-8k-instruct' | 'microsoft/phi-3.5-mini-instruct' | 'microsoft/phi-4-multimodal-instruct' | 'microsoft/phi-3-mini-128k-instruct' | 'microsoft/phi-3.5-moe-instruct' | 'microsoft/phi-4-mini-instruct' | 'microsoft/phi-3-medium-4k-instruct' | 'microsoft/phi-4-reasoning' | 'microsoft/mai-ds-r1' | 'openai/gpt-4.1-nano' | 'openai/gpt-4.1-mini' | 'openai/o1-preview' | 'openai/o3-mini' | 'openai/gpt-4o' | 'openai/gpt-4.1' | 'openai/o4-mini' | 'openai/o1' | 'openai/o1-mini' | 'openai/o3' | 'openai/gpt-4o-mini' | 'meta/llama-3.2-11b-vision-instruct' | 'meta/meta-llama-3.1-405b-instruct' | 'meta/llama-4-maverick-17b-128e-instruct-fp8' | 'meta/meta-llama-3-70b-instruct' | 'meta/meta-llama-3.1-70b-instruct' | 'meta/llama-3.3-70b-instruct' | 'meta/llama-3.2-90b-vision-instruct' | 'meta/meta-llama-3-8b-instruct' | 'meta/llama-4-scout-17b-16e-instruct' | 'meta/meta-llama-3.1-8b-instruct' | 'ai21-labs/ai21-jamba-1.5-large' | 'ai21-labs/ai21-jamba-1.5-mini'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Google Provider
 * @see {@link https://ai.google.dev/gemini-api/docs/pricing}
 */
export const createGoogleGenerativeAI = (apiKey: string, baseURL = 'https://generativelanguage.googleapis.com/v1beta/openai/') => merge(
  createChatProvider<'gemini-embedding-001' | 'gemini-3-flash-preview' | 'gemini-2.5-flash-image' | 'gemini-2.5-flash-preview-05-20' | 'gemini-flash-lite-latest' | 'gemini-3-pro-preview' | 'gemini-2.5-flash' | 'gemini-flash-latest' | 'gemini-2.5-pro-preview-05-06' | 'gemini-2.5-flash-preview-tts' | 'gemini-2.0-flash-lite' | 'gemini-live-2.5-flash-preview-native-audio' | 'gemini-2.0-flash' | 'gemini-2.5-flash-lite' | 'gemini-2.5-pro-preview-06-05' | 'gemini-live-2.5-flash' | 'gemini-2.5-flash-lite-preview-06-17' | 'gemini-2.5-flash-image-preview' | 'gemini-2.5-flash-preview-09-2025' | 'gemini-2.5-flash-preview-04-17' | 'gemini-2.5-pro-preview-tts' | 'gemini-2.5-pro' | 'gemini-1.5-flash' | 'gemini-1.5-flash-8b' | 'gemini-2.5-flash-lite-preview-09-2025' | 'gemini-1.5-pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Groq Provider
 * @see {@link https://console.groq.com/docs/models}
 */
export const createGroq = (apiKey: string, baseURL = 'https://api.groq.com/openai/v1/') => merge(
  createChatProvider<'llama-3.1-8b-instant' | 'mistral-saba-24b' | 'llama3-8b-8192' | 'qwen-qwq-32b' | 'llama3-70b-8192' | 'deepseek-r1-distill-llama-70b' | 'llama-guard-3-8b' | 'gemma2-9b-it' | 'llama-3.3-70b-versatile' | 'moonshotai/kimi-k2-instruct-0905' | 'moonshotai/kimi-k2-instruct' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'qwen/qwen3-32b' | 'meta-llama/llama-4-scout-17b-16e-instruct' | 'meta-llama/llama-4-maverick-17b-128e-instruct' | 'meta-llama/llama-guard-4-12b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Helicone Provider
 * @see {@link https://helicone.ai/models}
 */
export const createHelicone = (apiKey: string, baseURL = 'https://ai-gateway.helicone.ai/v1') => merge(
  createChatProvider<'gpt-4.1-nano' | 'grok-4-fast-non-reasoning' | 'qwen3-coder' | 'deepseek-v3' | 'claude-opus-4' | 'grok-4-fast-reasoning' | 'llama-3.1-8b-instant' | 'claude-opus-4-1' | 'grok-4' | 'qwen3-next-80b-a3b-instruct' | 'llama-4-maverick' | 'llama-prompt-guard-2-86m' | 'grok-4-1-fast-reasoning' | 'grok-code-fast-1' | 'claude-4.5-haiku' | 'llama-3.1-8b-instruct-turbo' | 'gpt-5.1-codex' | 'gpt-4.1-mini-2025-04-14' | 'llama-guard-4' | 'llama-3.1-8b-instruct' | 'gemini-3-pro-preview' | 'gemini-2.5-flash' | 'gpt-4.1-mini' | 'deepseek-v3.1-terminus' | 'llama-prompt-guard-2-22m' | 'claude-3.5-sonnet-v2' | 'sonar-deep-research' | 'gemini-2.5-flash-lite' | 'claude-sonnet-4-5-20250929' | 'grok-3' | 'mistral-small' | 'kimi-k2-0711' | 'chatgpt-4o-latest' | 'qwen3-coder-30b-a3b-instruct' | 'kimi-k2-0905' | 'sonar-reasoning' | 'llama-3.3-70b-instruct' | 'gpt-5.1-codex-mini' | 'kimi-k2-thinking' | 'o3-mini' | 'claude-4.5-sonnet' | 'gpt-5.1' | 'codex-mini-latest' | 'gpt-5-nano' | 'gpt-5-codex' | 'gpt-4o' | 'deepseek-tng-r1t2-chimera' | 'claude-4.5-opus' | 'gpt-4.1' | 'sonar' | 'glm-4.6' | 'o4-mini' | 'qwen3-235b-a22b-thinking' | 'hermes-2-pro-llama-3-8b' | 'o1' | 'grok-3-mini' | 'sonar-pro' | 'gpt-5-mini' | 'deepseek-r1-distill-llama-70b' | 'o1-mini' | 'claude-3.7-sonnet' | 'claude-3-haiku-20240307' | 'o3-pro' | 'qwen2.5-coder-7b-fast' | 'deepseek-reasoner' | 'gemini-2.5-pro' | 'gemma-3-12b-it' | 'mistral-nemo' | 'o3' | 'gpt-oss-20b' | 'gpt-oss-120b' | 'claude-3.5-haiku' | 'gpt-5-chat-latest' | 'gpt-4o-mini' | 'gemma2-9b-it' | 'claude-sonnet-4' | 'sonar-reasoning-pro' | 'gpt-5' | 'qwen3-vl-235b-a22b-instruct' | 'qwen3-30b-a3b' | 'deepseek-v3.2' | 'grok-4-1-fast-non-reasoning' | 'gpt-5-pro' | 'llama-3.3-70b-versatile' | 'mistral-large-2411' | 'claude-opus-4-1-20250805' | 'ernie-4.5-21b-a3b-thinking' | 'gpt-5.1-chat-latest' | 'qwen3-32b' | 'claude-haiku-4-5-20251001' | 'llama-4-scout'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Hugging Face Provider
 * @see {@link https://huggingface.co/docs/inference-providers}
 */
export const createHuggingface = (apiKey: string, baseURL = 'https://router.huggingface.co/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'MiniMaxAI/MiniMax-M2.1' | 'XiaomiMiMo/MiMo-V2-Flash' | 'Qwen/Qwen3-Embedding-8B' | 'Qwen/Qwen3-Embedding-4B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'zai-org/GLM-4.7' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a iFlow Provider
 * @see {@link https://platform.iflow.cn/en/docs}
 */
export const createIflowcn = (apiKey: string, baseURL = 'https://apis.iflow.cn/v1') => merge(
  createChatProvider<'deepseek-v3' | 'kimi-k2' | 'deepseek-r1' | 'qwen3-235b' | 'kimi-k2-0905' | 'qwen3-235b-a22b-thinking-2507' | 'qwen3-vl-plus' | 'glm-4.6' | 'qwen3-235b-a22b-instruct' | 'qwen3-max' | 'deepseek-v3.2' | 'qwen3-max-preview' | 'qwen3-coder-plus' | 'qwen3-32b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Inception Provider
 * @see {@link https://platform.inceptionlabs.ai/docs}
 */
export const createInception = (apiKey: string, baseURL = 'https://api.inceptionlabs.ai/v1/') => merge(
  createChatProvider<'mercury-coder' | 'mercury'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Inference Provider
 * @see {@link https://inference.net/models}
 */
export const createInference = (apiKey: string, baseURL = 'https://inference.net/v1') => merge(
  createChatProvider<'mistral/mistral-nemo-12b-instruct' | 'google/gemma-3' | 'osmosis/osmosis-structure-0.6b' | 'qwen/qwen3-embedding-4b' | 'qwen/qwen-2.5-7b-vision-instruct' | 'meta/llama-3.2-11b-vision-instruct' | 'meta/llama-3.1-8b-instruct' | 'meta/llama-3.2-3b-instruct' | 'meta/llama-3.2-1b-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a IO.NET Provider
 * @see {@link https://io.net/docs/guides/intelligence/io-intelligence}
 */
export const createIoNet = (apiKey: string, baseURL = 'https://api.intelligence.io.solutions/api/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'mistralai/Devstral-Small-2505' | 'mistralai/Mistral-Nemo-Instruct-2407' | 'mistralai/Magistral-Small-2506' | 'mistralai/Mistral-Large-Instruct-2411' | 'meta-llama/Llama-3.3-70B-Instruct' | 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'meta-llama/Llama-3.2-90B-Vision-Instruct' | 'Intel/Qwen3-Coder-480B-A35B-Instruct-int4-mixed-ar' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'zai-org/GLM-4.6' | 'deepseek-ai/DeepSeek-R1-0528'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Kimi For Coding Provider
 * @see {@link https://www.kimi.com/coding/docs/en/third-party-agents.html}
 */
export const createKimiForCoding = (apiKey: string, baseURL = 'https://api.kimi.com/coding/v1') => merge(
  createChatProvider<'kimi-k2-thinking'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Llama Provider
 * @see {@link https://llama.developer.meta.com/docs/models}
 */
export const createLlama = (apiKey: string, baseURL = 'https://api.llama.com/compat/v1/') => merge(
  createChatProvider<'llama-3.3-8b-instruct' | 'llama-4-maverick-17b-128e-instruct-fp8' | 'llama-3.3-70b-instruct' | 'llama-4-scout-17b-16e-instruct-fp8' | 'groq-llama-4-maverick-17b-128e-instruct' | 'cerebras-llama-4-scout-17b-16e-instruct' | 'cerebras-llama-4-maverick-17b-128e-instruct'>({ apiKey, baseURL }),
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
 * Create a LucidQuery AI Provider
 * @see {@link https://lucidquery.com/api/docs}
 */
export const createLucidquery = (apiKey: string, baseURL = 'https://lucidquery.com/api/v1') => merge(
  createChatProvider<'lucidquery-nexus-coder' | 'lucidnova-rf1-100b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax Provider
 * @see {@link https://platform.minimax.io/docs/guides/quickstart}
 */
export const createMinimax = (apiKey: string, baseURL = 'https://api.minimax.io/v1/') => merge(
  createChatProvider<'MiniMax-M2' | 'MiniMax-M2.1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a MiniMax (China) Provider
 * @see {@link https://platform.minimaxi.com/docs/guides/quickstart}
 */
export const createMinimaxCn = (apiKey: string, baseURL = 'https://api.minimaxi.com/v1/') => merge(
  createChatProvider<'MiniMax-M2.1' | 'MiniMax-M2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Mistral Provider
 * @see {@link https://docs.mistral.ai/getting-started/models/}
 */
export const createMistral = (apiKey: string, baseURL = 'https://api.mistral.ai/v1/') => merge(
  createChatProvider<'devstral-medium-2507' | 'mistral-large-2512' | 'open-mixtral-8x22b' | 'ministral-8b-latest' | 'pixtral-large-latest' | 'mistral-small-2506' | 'devstral-2512' | 'ministral-3b-latest' | 'pixtral-12b' | 'mistral-medium-2505' | 'labs-devstral-small-2512' | 'devstral-medium-latest' | 'devstral-small-2505' | 'mistral-medium-2508' | 'mistral-embed' | 'mistral-small-latest' | 'magistral-small' | 'devstral-small-2507' | 'codestral-latest' | 'open-mixtral-8x7b' | 'mistral-nemo' | 'open-mistral-7b' | 'mistral-large-latest' | 'mistral-medium-latest' | 'mistral-large-2411' | 'magistral-medium-latest'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a ModelScope Provider
 * @see {@link https://modelscope.cn/docs/model-service/API-Inference/intro}
 */
export const createModelscope = (apiKey: string, baseURL = 'https://api-inference.modelscope.cn/v1') => merge(
  createChatProvider<'ZhipuAI/GLM-4.5' | 'ZhipuAI/GLM-4.6' | 'Qwen/Qwen3-30B-A3B-Thinking-2507' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-235B-A22B-Thinking-2507'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Moonshot AI Provider
 * @see {@link https://platform.moonshot.ai/docs/api/chat}
 */
export const createMoonshotai = (apiKey: string, baseURL = 'https://api.moonshot.ai/v1') => merge(
  createChatProvider<'kimi-k2-thinking-turbo' | 'kimi-k2-turbo-preview' | 'kimi-k2-0711-preview' | 'kimi-k2-thinking' | 'kimi-k2-0905-preview'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Moonshot AI (China) Provider
 * @see {@link https://platform.moonshot.cn/docs/api/chat}
 */
export const createMoonshotaiCn = (apiKey: string, baseURL = 'https://api.moonshot.cn/v1') => merge(
  createChatProvider<'kimi-k2-thinking-turbo' | 'kimi-k2-thinking' | 'kimi-k2-0905-preview' | 'kimi-k2-0711-preview' | 'kimi-k2-turbo-preview'>({ apiKey, baseURL }),
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
  createChatProvider<'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2-instruct' | 'nousresearch/hermes-4-405b:thinking' | 'nvidia/llama-3_3-nemotron-super-49b-v1_5' | 'deepseek/deepseek-v3.2:thinking' | 'deepseek/deepseek-r1' | 'minimax/minimax-m2.1' | 'openai/gpt-oss-120b' | 'z-ai/glm-4.6:thinking' | 'z-ai/glm-4.6' | 'qwen/qwen3-coder' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'mistralai/devstral-2-123b-instruct-2512' | 'mistralai/mistral-large-3-675b-instruct-2512' | 'mistralai/ministral-14b-instruct-2512' | 'meta-llama/llama-4-maverick' | 'meta-llama/llama-3.3-70b-instruct' | 'zai-org/glm-4.7' | 'zai-org/glm-4.5-air' | 'zai-org/glm-4.7:thinking' | 'zai-org/glm-4.5-air:thinking'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Nebius Token Factory Provider
 * @see {@link https://docs.tokenfactory.nebius.com/}
 */
export const createNebius = (apiKey: string, baseURL = 'https://api.tokenfactory.nebius.com/v1') => merge(
  createChatProvider<'NousResearch/hermes-4-70b' | 'NousResearch/hermes-4-405b' | 'moonshotai/kimi-k2-instruct' | 'nvidia/llama-3_1-nemotron-ultra-253b-v1' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'qwen/qwen3-235b-a22b-instruct-2507' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'meta-llama/llama-3_1-405b-instruct' | 'meta-llama/llama-3.3-70b-instruct-fast' | 'meta-llama/llama-3.3-70b-instruct-base' | 'zai-org/glm-4.5' | 'zai-org/glm-4.5-air' | 'deepseek-ai/deepseek-v3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a NovitaAI Provider
 * @see {@link https://novita.ai/docs/guides/introduction}
 */
export const createNovitaAi = (apiKey: string, baseURL = 'https://api.novita.ai/openai') => merge(
  createChatProvider<'baichuan/baichuan-m2-32b' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2-instruct' | 'nousresearch/hermes-2-pro-llama-3-8b' | 'paddlepaddle/paddleocr-vl' | 'kwaipilot/kat-coder' | 'kwaipilot/kat-coder-pro' | 'xiaomimimo/mimo-v2-flash' | 'deepseek/deepseek-prover-v2-671b' | 'deepseek/deepseek-r1-0528' | 'deepseek/deepseek-r1-0528-qwen3-8b' | 'deepseek/deepseek-v3.1-terminus' | 'deepseek/deepseek-v3.1' | 'deepseek/deepseek-v3-0324' | 'deepseek/deepseek-r1-turbo' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-r1-distill-llama-70b' | 'deepseek/deepseek-ocr' | 'deepseek/deepseek-v3.2' | 'deepseek/deepseek-v3-turbo' | 'sao10k/l3-8b-lunaris' | 'sao10k/L3-8B-Stheno-v3.2' | 'sao10k/l31-70b-euryale-v2.2' | 'sao10k/l3-70b-euryale-v2.1' | 'skywork/r1v4-lite' | 'minimaxai/minimax-m1-80k' | 'minimax/minimax-m2' | 'minimax/minimax-m2.1' | 'google/gemma-3-27b-it' | 'microsoft/wizardlm-2-8x22b' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'gryphe/mythomax-l2-13b' | 'baidu/ernie-4.5-vl-28b-a3b-thinking' | 'baidu/ernie-4.5-300b-a47b-paddle' | 'baidu/ernie-4.5-21B-a3b' | 'baidu/ernie-4.5-21B-a3b-thinking' | 'baidu/ernie-4.5-vl-424b-a47b' | 'baidu/ernie-4.5-vl-28b-a3b' | 'qwen/qwen3-vl-30b-a3b-thinking' | 'qwen/qwen3-235b-a22b-instruct-2507' | 'qwen/qwen3-omni-30b-a3b-thinking' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3-8b-fp8' | 'qwen/qwen2.5-vl-72b-instruct' | 'qwen/qwen3-4b-fp8' | 'qwen/qwen3-coder-30b-a3b-instruct' | 'qwen/qwen3-vl-8b-instruct' | 'qwen/qwen3-235b-a22b-thinking-2507' | 'qwen/qwen2.5-7b-instruct' | 'qwen/qwen3-30b-a3b-fp8' | 'qwen/qwen3-32b-fp8' | 'qwen/qwen3-omni-30b-a3b-instruct' | 'qwen/qwen-2.5-72b-instruct' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-vl-235b-a22b-thinking' | 'qwen/qwen-mt-plus' | 'qwen/qwen3-max' | 'qwen/qwen3-vl-235b-a22b-instruct' | 'qwen/qwen3-vl-30b-a3b-instruct' | 'qwen/qwen3-next-80b-a3b-thinking' | 'qwen/qwen3-235b-a22b-fp8' | 'mistralai/mistral-nemo' | 'meta-llama/llama-3-70b-instruct' | 'meta-llama/llama-3-8b-instruct' | 'meta-llama/llama-3.1-8b-instruct' | 'meta-llama/llama-4-maverick-17b-128e-instruct-fp8' | 'meta-llama/llama-3.3-70b-instruct' | 'meta-llama/llama-4-scout-17b-16e-instruct' | 'zai-org/glm-4.7' | 'zai-org/glm-4.5' | 'zai-org/glm-4.5-air' | 'zai-org/glm-4.5v' | 'zai-org/glm-4.6' | 'zai-org/glm-4.6v' | 'zai-org/autoglm-phone-9b-multilingual'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Nvidia Provider
 * @see {@link https://docs.api.nvidia.com/nim/}
 */
export const createNvidia = (apiKey: string, baseURL = 'https://integrate.api.nvidia.com/v1') => merge(
  createChatProvider<'moonshotai/kimi-k2-instruct-0905' | 'moonshotai/kimi-k2-thinking' | 'moonshotai/kimi-k2-instruct' | 'nvidia/nvidia-nemotron-nano-9b-v2' | 'nvidia/cosmos-nemotron-34b' | 'nvidia/llama-embed-nemotron-8b' | 'nvidia/nemotron-3-nano-30b-a3b' | 'nvidia/parakeet-tdt-0.6b-v2' | 'nvidia/nemoretriever-ocr-v1' | 'nvidia/llama-3.3-nemotron-super-49b-v1' | 'nvidia/llama-3.1-nemotron-51b-instruct' | 'nvidia/llama3-chatqa-1.5-70b' | 'nvidia/llama-3.1-nemotron-ultra-253b-v1' | 'nvidia/llama-3.1-nemotron-70b-instruct' | 'nvidia/nemotron-4-340b-instruct' | 'nvidia/llama-3.3-nemotron-super-49b-v1.5' | 'minimaxai/minimax-m2' | 'google/gemma-3n-e2b-it' | 'google/codegemma-1.1-7b' | 'google/gemma-3n-e4b-it' | 'google/gemma-2-2b-it' | 'google/gemma-3-12b-it' | 'google/codegemma-7b' | 'google/gemma-3-1b-it' | 'google/gemma-2-27b-it' | 'google/gemma-3-27b-it' | 'microsoft/phi-3-medium-128k-instruct' | 'microsoft/phi-3-small-128k-instruct' | 'microsoft/phi-3.5-vision-instruct' | 'microsoft/phi-3-small-8k-instruct' | 'microsoft/phi-3.5-moe-instruct' | 'microsoft/phi-4-mini-instruct' | 'microsoft/phi-3-medium-4k-instruct' | 'microsoft/phi-3-vision-128k-instruct' | 'openai/whisper-large-v3' | 'openai/gpt-oss-120b' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen2.5-coder-32b-instruct' | 'qwen/qwen2.5-coder-7b-instruct' | 'qwen/qwen3-235b-a22b' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwq-32b' | 'qwen/qwen3-next-80b-a3b-thinking' | 'mistralai/devstral-2-123b-instruct-2512' | 'mistralai/mistral-large-3-675b-instruct-2512' | 'mistralai/ministral-14b-instruct-2512' | 'mistralai/mamba-codestral-7b-v0.1' | 'mistralai/mistral-large-2-instruct' | 'mistralai/codestral-22b-instruct-v0.1' | 'mistralai/mistral-small-3.1-24b-instruct-2503' | 'meta/llama-3.2-11b-vision-instruct' | 'meta/llama3-70b-instruct' | 'meta/llama-3.3-70b-instruct' | 'meta/llama-3.2-1b-instruct' | 'meta/llama-4-scout-17b-16e-instruct' | 'meta/llama-4-maverick-17b-128e-instruct' | 'meta/codellama-70b' | 'meta/llama-3.1-405b-instruct' | 'meta/llama3-8b-instruct' | 'meta/llama-3.1-70b-instruct' | 'deepseek-ai/deepseek-r1-0528' | 'deepseek-ai/deepseek-r1' | 'deepseek-ai/deepseek-v3.1-terminus' | 'deepseek-ai/deepseek-v3.1' | 'deepseek-ai/deepseek-coder-6.7b-instruct' | 'black-forest-labs/flux.1-dev'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Ollama Cloud Provider
 * @see {@link https://docs.ollama.com/cloud}
 */
export const createOllamaCloud = (apiKey: string, baseURL = 'https://ollama.com/v1') => merge(
  createChatProvider<'kimi-k2-thinking:cloud' | 'qwen3-vl-235b-cloud' | 'qwen3-coder:480b-cloud' | 'gpt-oss:120b-cloud' | 'deepseek-v3.1:671b-cloud' | 'glm-4.6:cloud' | 'cogito-2.1:671b-cloud' | 'gpt-oss:20b-cloud' | 'qwen3-vl-235b-instruct-cloud' | 'kimi-k2:1t-cloud' | 'minimax-m2:cloud' | 'gemini-3-pro-preview:latest'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenAI Provider
 * @see {@link https://platform.openai.com/docs/models}
 */
export const createOpenAI = (apiKey: string, baseURL = 'https://api.openai.com/v1/') => merge(
  createChatProvider<'gpt-4.1-nano' | 'text-embedding-3-small' | 'gpt-4' | 'o1-pro' | 'gpt-4o-2024-05-13' | 'gpt-5.2-codex' | 'gpt-5.1-codex' | 'gpt-4o-2024-08-06' | 'gpt-4.1-mini' | 'o3-deep-research' | 'gpt-3.5-turbo' | 'gpt-5.2-pro' | 'text-embedding-3-large' | 'gpt-4-turbo' | 'o1-preview' | 'gpt-5.1-codex-mini' | 'o3-mini' | 'gpt-5.2-chat-latest' | 'gpt-5.1' | 'codex-mini-latest' | 'gpt-5-nano' | 'gpt-5-codex' | 'gpt-4o' | 'gpt-4.1' | 'o4-mini' | 'o1' | 'gpt-5-mini' | 'o1-mini' | 'text-embedding-ada-002' | 'o3-pro' | 'gpt-4o-2024-11-20' | 'gpt-5.1-codex-max' | 'o3' | 'o4-mini-deep-research' | 'gpt-5-chat-latest' | 'gpt-4o-mini' | 'gpt-5' | 'gpt-5-pro' | 'gpt-5.2' | 'gpt-5.1-chat-latest'>({ apiKey, baseURL }),
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
  createChatProvider<'qwen3-coder' | 'claude-opus-4-1' | 'kimi-k2' | 'gpt-5.2-codex' | 'gpt-5.1-codex' | 'claude-haiku-4-5' | 'claude-opus-4-5' | 'gemini-3-pro' | 'alpha-glm-4.7' | 'claude-sonnet-4-5' | 'gpt-5.1-codex-mini' | 'alpha-gd4' | 'kimi-k2-thinking' | 'gpt-5.1' | 'gpt-5-nano' | 'gpt-5-codex' | 'big-pickle' | 'claude-3-5-haiku' | 'glm-4.6' | 'glm-4.7-free' | 'grok-code' | 'gemini-3-flash' | 'gpt-5.1-codex-max' | 'minimax-m2.1-free' | 'claude-sonnet-4' | 'gpt-5' | 'gpt-5.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OVHcloud AI Endpoints Provider
 * @see {@link https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog//}
 */
export const createOvhcloud = (apiKey: string, baseURL = 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1') => merge(
  createChatProvider<'mixtral-8x7b-instruct-v0.1' | 'mistral-7b-instruct-v0.3' | 'llama-3.1-8b-instruct' | 'qwen2.5-vl-72b-instruct' | 'mistral-nemo-instruct-2407' | 'mistral-small-3.2-24b-instruct-2506' | 'qwen2.5-coder-32b-instruct' | 'qwen3-coder-30b-a3b-instruct' | 'llava-next-mistral-7b' | 'deepseek-r1-distill-llama-70b' | 'meta-llama-3_1-70b-instruct' | 'gpt-oss-20b' | 'gpt-oss-120b' | 'meta-llama-3_3-70b-instruct' | 'qwen3-32b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Perplexity Provider
 * @see {@link https://docs.perplexity.ai}
 */
export const createPerplexity = (apiKey: string, baseURL = 'https://api.perplexity.ai/') => merge(
  createChatProvider<'sonar' | 'sonar-pro' | 'sonar-reasoning-pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Poe Provider
 * @see {@link https://creator.poe.com/docs/external-applications/openai-compatible-api}
 */
export const createPoe = (apiKey: string, baseURL = 'https://api.poe.com/v1') => merge(
  createChatProvider<'xai/grok-4-fast-non-reasoning' | 'xai/grok-4-fast-reasoning' | 'xai/grok-4.1-fast-reasoning' | 'xai/grok-4' | 'xai/grok-code-fast-1' | 'xai/grok-4.1-fast-non-reasoning' | 'xai/grok-3' | 'xai/grok-3-mini' | 'ideogramai/ideogram' | 'ideogramai/ideogram-v2a' | 'ideogramai/ideogram-v2a-turbo' | 'ideogramai/ideogram-v2' | 'runwayml/runway' | 'runwayml/runway-gen-4-turbo' | 'poetools/claude-code' | 'elevenlabs/elevenlabs-v3' | 'elevenlabs/elevenlabs-music' | 'elevenlabs/elevenlabs-v2.5-turbo' | 'google/gemini-deep-research' | 'google/nano-banana' | 'google/imagen-4' | 'google/imagen-3' | 'google/imagen-4-ultra' | 'google/gemini-2.5-flash' | 'google/gemini-2.0-flash-lite' | 'google/gemini-3-pro' | 'google/veo-3.1' | 'google/imagen-3-fast' | 'google/lyria' | 'google/gemini-2.0-flash' | 'google/gemini-2.5-flash-lite' | 'google/veo-3' | 'google/veo-3-fast' | 'google/imagen-4-fast' | 'google/veo-2' | 'google/gemini-3-flash' | 'google/nano-banana-pro' | 'google/gemini-2.5-pro' | 'google/veo-3.1-fast' | 'openai/gpt-4.1-nano' | 'openai/gpt-5.2-instant' | 'openai/sora-2' | 'openai/o1-pro' | 'openai/gpt-5.1-codex' | 'openai/gpt-3.5-turbo-raw' | 'openai/gpt-4-classic' | 'openai/gpt-4.1-mini' | 'openai/gpt-5-chat' | 'openai/o3-deep-research' | 'openai/gpt-4o-search' | 'openai/gpt-image-1.5' | 'openai/gpt-image-1-mini' | 'openai/gpt-3.5-turbo' | 'openai/gpt-5.2-pro' | 'openai/o3-mini-high' | 'openai/chatgpt-4o-latest' | 'openai/gpt-4-turbo' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.1-instant' | 'openai/o3-mini' | 'openai/gpt-5.1' | 'openai/gpt-5-nano' | 'openai/gpt-5-codex' | 'openai/gpt-4o' | 'openai/gpt-4.1' | 'openai/o4-mini' | 'openai/o1' | 'openai/gpt-5-mini' | 'openai/gpt-4o-aug' | 'openai/o3-pro' | 'openai/gpt-image-1' | 'openai/gpt-5.1-codex-max' | 'openai/gpt-3.5-turbo-instruct' | 'openai/o3' | 'openai/o4-mini-deep-research' | 'openai/gpt-4-classic-0314' | 'openai/gpt-4o-mini' | 'openai/gpt-5' | 'openai/dall-e-3' | 'openai/sora-2-pro' | 'openai/gpt-5-pro' | 'openai/gpt-5.2' | 'openai/gpt-4o-mini-search' | 'stabilityai/stablediffusionxl' | 'topazlabs-co/topazlabs' | 'lumalabs/ray2' | 'lumalabs/dream-machine' | 'anthropic/claude-opus-3' | 'anthropic/claude-opus-4' | 'anthropic/claude-sonnet-3.7-reasoning' | 'anthropic/claude-opus-4-search' | 'anthropic/claude-sonnet-3.7' | 'anthropic/claude-haiku-3.5-search' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-sonnet-4-reasoning' | 'anthropic/claude-haiku-3' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-3.7-search' | 'anthropic/claude-opus-4-reasoning' | 'anthropic/claude-sonnet-3.5' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-haiku-3.5' | 'anthropic/claude-sonnet-3.5-june' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-sonnet-4-search' | 'trytako/tako' | 'novita/glm-4.7' | 'novita/kimi-k2-thinking' | 'novita/kat-coder-pro' | 'novita/glm-4.6' | 'novita/minimax-m2.1' | 'novita/glm-4.6v' | 'cerebras/gpt-oss-120b-cs' | 'cerebras/zai-glm-4.6-cs'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Privatemode AI Provider
 * @see {@link https://docs.privatemode.ai/api/overview}
 */
export const createPrivatemodeAi = (apiKey: string, baseURL = 'http://localhost:8080/v1') => merge(
  createChatProvider<'whisper-large-v3' | 'qwen3-embedding-4b' | 'gpt-oss-120b' | 'gemma-3-27b' | 'qwen3-coder-30b-a3b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Requesty Provider
 * @see {@link https://requesty.ai/solution/llm-routing/models}
 */
export const createRequesty = (apiKey: string, baseURL = 'https://router.requesty.ai/v1') => merge(
  createChatProvider<'xai/grok-4' | 'xai/grok-4-fast' | 'google/gemini-3-flash-preview' | 'google/gemini-3-pro-preview' | 'google/gemini-2.5-flash' | 'google/gemini-2.5-pro' | 'openai/gpt-4.1-mini' | 'openai/gpt-5-nano' | 'openai/gpt-4.1' | 'openai/o4-mini' | 'openai/gpt-5-mini' | 'openai/gpt-4o-mini' | 'openai/gpt-5' | 'anthropic/claude-opus-4' | 'anthropic/claude-opus-4-1' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-opus-4-5' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-3-7-sonnet' | 'anthropic/claude-sonnet-4'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Scaleway Provider
 * @see {@link https://www.scaleway.com/en/docs/generative-apis/}
 */
export const createScaleway = (apiKey: string, baseURL = 'https://api.scaleway.ai/v1') => merge(
  createChatProvider<'qwen3-235b-a22b-instruct-2507' | 'devstral-2-123b-instruct-2512' | 'pixtral-12b-2409' | 'llama-3.1-8b-instruct' | 'mistral-nemo-instruct-2407' | 'mistral-small-3.2-24b-instruct-2506' | 'qwen3-coder-30b-a3b-instruct' | 'llama-3.3-70b-instruct' | 'whisper-large-v3' | 'deepseek-r1-distill-llama-70b' | 'voxtral-small-24b-2507' | 'gpt-oss-120b' | 'bge-multilingual-gemma2' | 'gemma-3-27b-it'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a SiliconFlow Provider
 * @see {@link https://cloud.siliconflow.com/models}
 */
export const createSiliconFlow = (apiKey: string, baseURL = 'https://api.siliconflow.com/v1') => merge(
  createChatProvider<'inclusionAI/Ling-mini-2.0' | 'inclusionAI/Ling-flash-2.0' | 'inclusionAI/Ring-flash-2.0' | 'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-Dev-72B' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'tencent/Hunyuan-MT-7B' | 'tencent/Hunyuan-A13B-Instruct' | 'MiniMaxAI/MiniMax-M2' | 'MiniMaxAI/MiniMax-M1-80k' | 'THUDM/GLM-4-32B-0414' | 'THUDM/GLM-4.1V-9B-Thinking' | 'THUDM/GLM-Z1-9B-0414' | 'THUDM/GLM-4-9B-0414' | 'THUDM/GLM-Z1-32B-0414' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'stepfun-ai/step3' | 'nex-agi/DeepSeek-V3.1-Nex-N1' | 'baidu/ERNIE-4.5-300B-A47B' | 'ByteDance-Seed/Seed-OSS-36B-Instruct' | 'meta-llama/Meta-Llama-3.1-8B-Instruct' | 'Qwen/Qwen3-30B-A3B' | 'Qwen/Qwen3-30B-A3B-Thinking-2507' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-Omni-30B-A3B-Captioner' | 'Qwen/Qwen3-8B' | 'Qwen/Qwen3-Omni-30B-A3B-Instruct' | 'Qwen/Qwen3-VL-8B-Thinking' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'Qwen/Qwen2.5-32B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct-128K' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen2.5-7B-Instruct' | 'Qwen/Qwen3-235B-A22B' | 'Qwen/Qwen2.5-VL-72B-Instruct' | 'Qwen/QwQ-32B' | 'Qwen/Qwen2.5-VL-7B-Instruct' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-VL-8B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Thinking' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-VL-30B-A3B-Thinking' | 'Qwen/Qwen3-VL-32B-Thinking' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Omni-30B-A3B-Thinking' | 'Qwen/Qwen3-VL-32B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen2.5-14B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'zai-org/GLM-4.6V' | 'zai-org/GLM-4.5' | 'zai-org/GLM-4.7' | 'zai-org/GLM-4.6' | 'zai-org/GLM-4.5V' | 'zai-org/GLM-4.5-Air' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B' | 'deepseek-ai/deepseek-vl2' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B' | 'deepseek-ai/DeepSeek-V3.2-Exp' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/DeepSeek-V3.1'>({ apiKey, baseURL }),
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
  createChatProvider<'inclusionAI/Ring-flash-2.0' | 'inclusionAI/Ling-flash-2.0' | 'inclusionAI/Ling-mini-2.0' | 'Kwaipilot/KAT-Dev' | 'moonshotai/Kimi-K2-Thinking' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-Dev-72B' | 'moonshotai/Kimi-K2-Instruct' | 'tencent/Hunyuan-A13B-Instruct' | 'tencent/Hunyuan-MT-7B' | 'MiniMaxAI/MiniMax-M1-80k' | 'MiniMaxAI/MiniMax-M2' | 'THUDM/GLM-Z1-32B-0414' | 'THUDM/GLM-4-9B-0414' | 'THUDM/GLM-Z1-9B-0414' | 'THUDM/GLM-4.1V-9B-Thinking' | 'THUDM/GLM-4-32B-0414' | 'openai/gpt-oss-120b' | 'openai/gpt-oss-20b' | 'ascend-tribe/pangu-pro-moe' | 'stepfun-ai/step3' | 'nex-agi/DeepSeek-V3.1-Nex-N1' | 'baidu/ERNIE-4.5-300B-A47B' | 'ByteDance-Seed/Seed-OSS-36B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'Qwen/Qwen2.5-14B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3-VL-32B-Instruct' | 'Qwen/Qwen3-Omni-30B-A3B-Thinking' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-VL-32B-Thinking' | 'Qwen/Qwen3-VL-30B-A3B-Thinking' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-VL-235B-A22B-Thinking' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen3-VL-8B-Instruct' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen2.5-VL-7B-Instruct' | 'Qwen/QwQ-32B' | 'Qwen/Qwen2.5-VL-72B-Instruct' | 'Qwen/Qwen3-235B-A22B' | 'Qwen/Qwen2.5-7B-Instruct' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct-128K' | 'Qwen/Qwen2.5-32B-Instruct' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-VL-8B-Thinking' | 'Qwen/Qwen3-Omni-30B-A3B-Instruct' | 'Qwen/Qwen3-8B' | 'Qwen/Qwen3-Omni-30B-A3B-Captioner' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen3-VL-30B-A3B-Instruct' | 'Qwen/Qwen3-30B-A3B-Thinking-2507' | 'Qwen/Qwen3-30B-A3B' | 'zai-org/GLM-4.5-Air' | 'zai-org/GLM-4.5V' | 'zai-org/GLM-4.6' | 'zai-org/GLM-4.5' | 'zai-org/GLM-4.6V' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/DeepSeek-V3.2' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B' | 'deepseek-ai/deepseek-vl2' | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B' | 'deepseek-ai/DeepSeek-R1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a submodel Provider
 * @see {@link https://submodel.gitbook.io}
 */
export const createSubmodel = (apiKey: string, baseURL = 'https://llm.submodel.ai/v1') => merge(
  createChatProvider<'openai/gpt-oss-120b' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'zai-org/GLM-4.5-FP8' | 'zai-org/GLM-4.5-Air' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Synthetic Provider
 * @see {@link https://synthetic.new/pricing}
 */
export const createSynthetic = (apiKey: string, baseURL = 'https://api.synthetic.new/v1') => merge(
  createChatProvider<'hf:Qwen/Qwen3-235B-A22B-Instruct-2507' | 'hf:Qwen/Qwen2.5-Coder-32B-Instruct' | 'hf:Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'hf:Qwen/Qwen3-235B-A22B-Thinking-2507' | 'hf:MiniMaxAI/MiniMax-M2' | 'hf:MiniMaxAI/MiniMax-M2.1' | 'hf:meta-llama/Llama-3.1-70B-Instruct' | 'hf:meta-llama/Llama-3.1-8B-Instruct' | 'hf:meta-llama/Llama-3.3-70B-Instruct' | 'hf:meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'hf:meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'hf:meta-llama/Llama-3.1-405B-Instruct' | 'hf:moonshotai/Kimi-K2-Instruct-0905' | 'hf:moonshotai/Kimi-K2-Thinking' | 'hf:zai-org/GLM-4.5' | 'hf:zai-org/GLM-4.7' | 'hf:zai-org/GLM-4.6' | 'hf:deepseek-ai/DeepSeek-R1' | 'hf:deepseek-ai/DeepSeek-R1-0528' | 'hf:deepseek-ai/DeepSeek-V3.1-Terminus' | 'hf:deepseek-ai/DeepSeek-V3.2' | 'hf:deepseek-ai/DeepSeek-V3' | 'hf:deepseek-ai/DeepSeek-V3.1' | 'hf:deepseek-ai/DeepSeek-V3-0324' | 'hf:openai/gpt-oss-120b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Upstage Provider
 * @see {@link https://developers.upstage.ai/docs/apis/chat}
 */
export const createUpstage = (apiKey: string, baseURL = 'https://api.upstage.ai/v1/solar') => merge(
  createChatProvider<'solar-mini' | 'solar-pro3' | 'solar-pro2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Venice AI Provider
 * @see {@link https://docs.venice.ai}
 */
export const createVenice = (apiKey: string, baseURL = 'https://api.venice.ai/api/v1') => merge(
  createChatProvider<'grok-41-fast' | 'qwen3-235b-a22b-instruct-2507' | 'gemini-3-flash-preview' | 'claude-opus-45' | 'mistral-31-24b' | 'grok-code-fast-1' | 'zai-org-glm-4.7' | 'venice-uncensored' | 'gemini-3-pro-preview' | 'openai-gpt-52' | 'qwen3-4b' | 'llama-3.3-70b' | 'claude-sonnet-45' | 'openai-gpt-oss-120b' | 'kimi-k2-thinking' | 'qwen3-235b-a22b-thinking-2507' | 'llama-3.2-3b' | 'google-gemma-3-27b-it' | 'hermes-3-llama-3.1-405b' | 'zai-org-glm-4.6v' | 'minimax-m21' | 'qwen3-next-80b' | 'qwen3-coder-480b-a35b-instruct' | 'openai-gpt-52-codex' | 'deepseek-v3.2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Vivgrid Provider
 * @see {@link https://docs.vivgrid.com/models}
 */
export const createVivgrid = (apiKey: string, baseURL = 'https://api.vivgrid.com/v1') => merge(
  createChatProvider<'gpt-5.1-codex'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Vultr Provider
 * @see {@link https://api.vultrinference.com/}
 */
export const createVultr = (apiKey: string, baseURL = 'https://api.vultrinference.com/v1') => merge(
  createChatProvider<'deepseek-r1-distill-qwen-32b' | 'qwen2.5-coder-32b-instruct' | 'kimi-k2-instruct' | 'deepseek-r1-distill-llama-70b' | 'gpt-oss-120b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Weights & Biases Provider
 * @see {@link https://weave-docs.wandb.ai/guides/integrations/inference/}
 */
export const createWandb = (apiKey: string, baseURL = 'https://api.inference.wandb.ai/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K2-Instruct' | 'microsoft/Phi-4-mini-instruct' | 'meta-llama/Llama-3.1-8B-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct' | 'meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3-0324'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a xAI Provider
 * @see {@link https://docs.x.ai/docs/models}
 */
export const createXai = (apiKey: string, baseURL = 'https://api.x.ai/v1/') => merge(
  createChatProvider<'grok-4-fast-non-reasoning' | 'grok-3-fast' | 'grok-4' | 'grok-2-vision' | 'grok-code-fast-1' | 'grok-2' | 'grok-3-mini-fast-latest' | 'grok-2-vision-1212' | 'grok-3' | 'grok-4-fast' | 'grok-2-latest' | 'grok-4-1-fast' | 'grok-2-1212' | 'grok-3-fast-latest' | 'grok-3-latest' | 'grok-2-vision-latest' | 'grok-vision-beta' | 'grok-3-mini' | 'grok-beta' | 'grok-3-mini-latest' | 'grok-4-1-fast-non-reasoning' | 'grok-3-mini-fast'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Xiaomi Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 */
export const createXiaomi = (apiKey: string, baseURL = 'https://api.xiaomimimo.com/v1') => merge(
  createChatProvider<'mimo-v2-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Z.AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 */
export const createZai = (apiKey: string, baseURL = 'https://api.z.ai/api/paas/v4') => merge(
  createChatProvider<'glm-4.7' | 'glm-4.5-flash' | 'glm-4.5' | 'glm-4.5-air' | 'glm-4.5v' | 'glm-4.6' | 'glm-4.6v'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Z.AI Coding Plan Provider
 * @see {@link https://docs.z.ai/devpack/overview}
 */
export const createZaiCodingPlan = (apiKey: string, baseURL = 'https://api.z.ai/api/coding/paas/v4') => merge(
  createChatProvider<'glm-4.7' | 'glm-4.5-flash' | 'glm-4.5' | 'glm-4.5-air' | 'glm-4.5v' | 'glm-4.6' | 'glm-4.6v'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a ZenMux Provider
 * @see {@link https://docs.zenmux.ai}
 */
export const createZenmux = (apiKey: string, baseURL = 'https://zenmux.ai/api/v1') => merge(
  createChatProvider<'stepfun/step-3' | 'moonshotai/kimi-k2-thinking-turbo' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking' | 'xiaomi/mimo-v2-flash-free' | 'xiaomi/mimo-v2-flash' | 'x-ai/grok-4' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4.1-fast-non-reasoning' | 'x-ai/grok-4-fast' | 'x-ai/grok-4.1-fast' | 'deepseek/deepseek-chat' | 'deepseek/deepseek-v3.2-exp' | 'deepseek/deepseek-reasoner' | 'deepseek/deepseek-v3.2' | 'minimax/minimax-m2' | 'minimax/minimax-m2.1' | 'google/gemini-3-flash-preview' | 'google/gemini-3-flash-preview-free' | 'google/gemini-3-pro-preview' | 'google/gemini-2.5-flash' | 'google/gemini-2.5-flash-lite' | 'google/gemini-2.5-pro' | 'volcengine/doubao-seed-code' | 'volcengine/doubao-seed-1.8' | 'openai/gpt-5.1-codex' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.1' | 'openai/gpt-5-codex' | 'openai/gpt-5.1-chat' | 'openai/gpt-5' | 'openai/gpt-5.2' | 'baidu/ernie-5.0-thinking-preview' | 'inclusionai/ring-1t' | 'inclusionai/ling-1t' | 'z-ai/glm-4.7' | 'z-ai/glm-4.6v-flash-free' | 'z-ai/glm-4.6v-flash' | 'z-ai/glm-4.5' | 'z-ai/glm-4.5-air' | 'z-ai/glm-4.6' | 'z-ai/glm-4.6v' | 'qwen/qwen3-coder-plus' | 'kuaishou/kat-coder-pro-v1-free' | 'kuaishou/kat-coder-pro-v1' | 'anthropic/claude-opus-4' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-opus-4.5' | 'anthropic/claude-sonnet-4.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Zhipu AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 */
export const createZhipuai = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/paas/v4') => merge(
  createChatProvider<'glm-4.6v-flash' | 'glm-4.6v' | 'glm-4.6' | 'glm-4.5v' | 'glm-4.5-air' | 'glm-4.5' | 'glm-4.5-flash' | 'glm-4.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Zhipu AI Coding Plan Provider
 * @see {@link https://docs.bigmodel.cn/cn/coding-plan/overview}
 */
export const createZhipuaiCodingPlan = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/coding/paas/v4') => merge(
  createChatProvider<'glm-4.6v-flash' | 'glm-4.6v' | 'glm-4.6' | 'glm-4.5v' | 'glm-4.5-air' | 'glm-4.5' | 'glm-4.5-flash' | 'glm-4.7'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a StepFun Provider
 * @see {@link https://www.stepfun.com}
 */
export const createStepfun = (apiKey: string, baseURL = 'https://api.stepfun.com/v1/') => merge(
  createChatProvider({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createSpeechProvider({ apiKey, baseURL }),
  createTranscriptionProvider({ apiKey, baseURL }),
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
