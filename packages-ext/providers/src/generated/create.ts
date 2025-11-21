/* eslint-disable perfectionist/sort-union-types */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/use-type-alias */

import { createChatProvider, createEmbedProvider, createImageProvider, createModelProvider, createSpeechProvider, createTranscriptionProvider, merge } from '@xsai-ext/shared-providers'

/**
 * Create a Moonshot AI (China) Provider
 * @see {@link https://platform.moonshot.cn/docs/api/chat}
 */
export const createMoonshotaiCn = (apiKey: string, baseURL = 'https://api.moonshot.cn/v1') => merge(
  createChatProvider<'kimi-k2-thinking-turbo' | 'kimi-k2-thinking' | 'kimi-k2-0905-preview' | 'kimi-k2-0711-preview' | 'kimi-k2-turbo-preview'>({ apiKey, baseURL }),
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
 * Create a Moonshot AI Provider
 * @see {@link https://platform.moonshot.ai/docs/api/chat}
 */
export const createMoonshotai = (apiKey: string, baseURL = 'https://api.moonshot.ai/v1') => merge(
  createChatProvider<'kimi-k2-thinking-turbo' | 'kimi-k2-turbo-preview' | 'kimi-k2-0711-preview' | 'kimi-k2-thinking' | 'kimi-k2-0905-preview'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Z.AI Coding Plan Provider
 * @see {@link https://docs.z.ai/devpack/overview}
 */
export const createZaiCodingPlan = (apiKey: string, baseURL = 'https://api.z.ai/api/coding/paas/v4') => merge(
  createChatProvider<'glm-4.5-flash' | 'glm-4.5' | 'glm-4.5-air' | 'glm-4.5v' | 'glm-4.6'>({ apiKey, baseURL }),
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
 * Create a xAI Provider
 * @see {@link https://docs.x.ai/docs/models}
 */
export const createXai = (apiKey: string, baseURL = 'https://api.x.ai/v1/') => merge(
  createChatProvider<'grok-4-fast-non-reasoning' | 'grok-3-fast' | 'grok-4' | 'grok-2-vision' | 'grok-code-fast-1' | 'grok-2' | 'grok-3-mini-fast-latest' | 'grok-2-vision-1212' | 'grok-3' | 'grok-4-fast' | 'grok-2-latest' | 'grok-4-1-fast' | 'grok-2-1212' | 'grok-3-fast-latest' | 'grok-3-latest' | 'grok-2-vision-latest' | 'grok-vision-beta' | 'grok-3-mini' | 'grok-beta' | 'grok-3-mini-latest' | 'grok-4-1-fast-non-reasoning' | 'grok-3-mini-fast'>({ apiKey, baseURL }),
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
 * Create a Nvidia Provider
 * @see {@link https://docs.api.nvidia.com/nim/}
 */
export const createNvidia = (apiKey: string, baseURL = 'https://integrate.api.nvidia.com/v1') => merge(
  createChatProvider<'moonshotai/kimi-k2-instruct-0905' | 'moonshotai/kimi-k2-instruct' | 'nvidia/nvidia-nemotron-nano-9b-v2' | 'nvidia/cosmos-nemotron-34b' | 'nvidia/llama-embed-nemotron-8b' | 'nvidia/parakeet-tdt-0.6b-v2' | 'nvidia/nemoretriever-ocr-v1' | 'nvidia/llama-3.1-nemotron-ultra-253b-v1' | 'minimaxai/minimax-m2' | 'google/gemma-3-27b-it' | 'microsoft/phi-4-mini-instruct' | 'openai/whisper-large-v3' | 'openai/gpt-oss-120b' | 'qwen/qwen3-next-80b-a3b-instruct' | 'qwen/qwen3-235b-a22b' | 'qwen/qwen3-coder-480b-a35b-instruct' | 'qwen/qwen3-next-80b-a3b-thinking' | 'deepseek-ai/deepseek-v3.1-terminus' | 'deepseek-ai/deepseek-v3.1' | 'black-forest-labs/flux.1-dev'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Upstage Provider
 * @see {@link https://developers.upstage.ai/docs/apis/chat}
 */
export const createUpstage = (apiKey: string, baseURL = 'https://api.upstage.ai') => merge(
  createChatProvider<'solar-mini' | 'solar-pro2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
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
 * Create a GitHub Copilot Provider
 * @see {@link https://docs.github.com/en/copilot}
 */
export const createGithubCopilot = (apiKey: string, baseURL = 'https://api.githubcopilot.com') => merge(
  createChatProvider<'gemini-2.0-flash-001' | 'claude-opus-4' | 'grok-code-fast-1' | 'gpt-5.1-codex' | 'claude-haiku-4.5' | 'gemini-3-pro-preview' | 'oswe-vscode-prime' | 'claude-3.5-sonnet' | 'gpt-5.1-codex-mini' | 'o3-mini' | 'gpt-5.1' | 'gpt-5-codex' | 'gpt-4o' | 'gpt-4.1' | 'o4-mini' | 'claude-opus-41' | 'gpt-5-mini' | 'claude-3.7-sonnet' | 'gemini-2.5-pro' | 'o3' | 'claude-sonnet-4' | 'gpt-5' | 'claude-3.7-sonnet-thought' | 'claude-sonnet-4.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Mistral Provider
 * @see {@link https://docs.mistral.ai/getting-started/models/}
 */
export const createMistral = (apiKey: string, baseURL = 'https://api.mistral.ai/v1/') => merge(
  createChatProvider<'devstral-medium-2507' | 'open-mixtral-8x22b' | 'ministral-8b-latest' | 'pixtral-large-latest' | 'ministral-3b-latest' | 'pixtral-12b' | 'mistral-medium-2505' | 'devstral-small-2505' | 'mistral-medium-2508' | 'mistral-small-latest' | 'magistral-small' | 'devstral-small-2507' | 'codestral-latest' | 'open-mixtral-8x7b' | 'mistral-nemo' | 'open-mistral-7b' | 'mistral-large-latest' | 'mistral-medium-latest' | 'magistral-medium-latest'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
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
 * Create a DeepSeek Provider
 * @see {@link https://platform.deepseek.com/api-docs/pricing}
 */
export const createDeepSeek = (apiKey: string, baseURL = 'https://api.deepseek.com') => merge(
  createChatProvider<'deepseek-chat' | 'deepseek-reasoner'>({ apiKey, baseURL }),
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
 * Create a Venice AI Provider
 * @see {@link https://docs.venice.ai}
 */
export const createVenice = (apiKey: string, baseURL = 'https://api.venice.ai/api/v1') => merge(
  createChatProvider<'dolphin-2.9.2-qwen2-72b' | 'mistral-31-24b' | 'venice-uncensored' | 'qwen-2.5-vl' | 'qwen3-235b' | 'qwen-2.5-qwq-32b' | 'deepseek-coder-v2-lite' | 'qwen3-4b' | 'llama-3.3-70b' | 'qwen-2.5-coder-32b' | 'deepseek-r1-671b' | 'llama-3.2-3b' | 'llama-3.1-405b' | 'zai-org-glm-4.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Chutes Provider
 * @see {@link https://llm.chutes.ai/v1/models}
 */
export const createChutes = (apiKey: string, baseURL = 'https://llm.chutes.ai/v1') => merge(
  createChatProvider<'NousResearch/Hermes-4-70B' | 'NousResearch/Hermes-4-14B' | 'NousResearch/Hermes-4-405B-FP8' | 'NousResearch/DeepHermes-3-Mistral-24B-Preview' | 'rednote-hilab/dots.ocr' | 'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'MiniMaxAI/MiniMax-M2' | 'ArliAI/QwQ-32B-ArliAI-RpR-v1' | 'meituan-longcat/LongCat-Flash-Chat-FP8' | 'tngtech/DeepSeek-R1T-Chimera' | 'tngtech/DeepSeek-TNG-R1T2-Chimera' | 'OpenGVLab/InternVL3-78B' | 'microsoft/MAI-DS-R1-FP8' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'chutesai/Mistral-Small-3.1-24B-Instruct-2503' | 'chutesai/Mistral-Small-3.2-24B-Instruct-2506' | 'Alibaba-NLP/Tongyi-DeepResearch-30B-A3B' | 'unsloth/Mistral-Nemo-Instruct-2407' | 'unsloth/gemma-3-4b-it' | 'unsloth/Mistral-Small-24B-Instruct-2501' | 'unsloth/gemma-3-12b-it' | 'unsloth/gemma-3-27b-it' | 'Qwen/Qwen3-30B-A3B' | 'Qwen/Qwen3-14B' | 'Qwen/Qwen2.5-VL-32B-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen2.5-Coder-32B-Instruct' | 'Qwen/Qwen2.5-72B-Instruct' | 'Qwen/Qwen3-Coder-30B-A3B-Instruct' | 'Qwen/Qwen3-235B-A22B' | 'Qwen/Qwen2.5-VL-72B-Instruct' | 'Qwen/Qwen3-32B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8' | 'Qwen/Qwen3-VL-235B-A22B-Instruct' | 'Qwen/Qwen3-VL-235B-A22B-Thinking' | 'Qwen/Qwen3-30B-A3B-Instruct-2507' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'zai-org/GLM-4.5' | 'zai-org/GLM-4.6' | 'zai-org/GLM-4.5-Air' | 'deepseek-ai/DeepSeek-R1' | 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3.2-Exp' | 'deepseek-ai/DeepSeek-V3.1-Terminus' | 'deepseek-ai/DeepSeek-V3' | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B' | 'deepseek-ai/DeepSeek-V3.1' | 'deepseek-ai/DeepSeek-V3-0324'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cortecs Provider
 * @see {@link https://api.cortecs.ai/v1/models}
 */
export const createCortecs = (apiKey: string, baseURL = 'https://api.cortecs.ai/v1') => merge(
  createChatProvider<'nova-pro-v1' | 'claude-4-5-sonnet' | 'deepseek-v3-0324' | 'kimi-k2-instruct' | 'gpt-4.1' | 'gemini-2.5-pro' | 'gpt-oss-120b' | 'qwen3-coder-480b-a35b-instruct' | 'claude-sonnet-4' | 'llama-3.1-405b-instruct' | 'qwen3-32b'>({ apiKey, baseURL }),
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
 * Create a Baseten Provider
 * @see {@link https://docs.baseten.co/development/model-apis/overview}
 */
export const createBaseten = (apiKey: string, baseURL = 'https://inference.baseten.co/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K2-Instruct-0905' | 'moonshotai/Kimi-K2-Thinking' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'zai-org/GLM-4.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Hugging Face Provider
 * @see {@link https://huggingface.co/docs/inference-providers}
 */
export const createHuggingface = (apiKey: string, baseURL = 'https://router.huggingface.co/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K2-Instruct' | 'moonshotai/Kimi-K2-Instruct-0905' | 'MiniMaxAI/MiniMax-M2' | 'Qwen/Qwen3-Embedding-8B' | 'Qwen/Qwen3-Embedding-4B' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'Qwen/Qwen3-Next-80B-A3B-Instruct' | 'Qwen/Qwen3-Next-80B-A3B-Thinking' | 'zai-org/GLM-4.5' | 'zai-org/GLM-4.6' | 'zai-org/GLM-4.5-Air' | 'deepseek-ai/Deepseek-V3-0324' | 'deepseek-ai/DeepSeek-R1-0528'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenCode Zen Provider
 * @see {@link https://opencode.ai/docs/zen}
 */
export const createOpencode = (apiKey: string, baseURL = 'https://opencode.ai/zen/v1') => merge(
  createChatProvider<'qwen3-coder' | 'claude-opus-4-1' | 'kimi-k2' | 'gpt-5.1-codex' | 'claude-haiku-4-5' | 'gemini-3-pro' | 'claude-sonnet-4-5' | 'alpha-gd4' | 'alpha-kimi-k2-thinking' | 'gpt-5.1' | 'alpha-minimax-m2' | 'gpt-5-nano' | 'gpt-5-codex' | 'big-pickle' | 'claude-3-5-haiku' | 'glm-4.6' | 'grok-code' | 'alpha-doubao-seed-code' | 'claude-sonnet-4' | 'gpt-5'>({ apiKey, baseURL }),
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
 * Create a Minimax Provider
 * @see {@link https://platform.minimax.io/docs/guides/quickstart}
 */
export const createMinimax = (apiKey: string, baseURL = 'https://api.minimax.io/v1/') => merge(
  createChatProvider<'MiniMax-M2'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Google Provider
 * @see {@link https://ai.google.dev/gemini-api/docs/pricing}
 */
export const createGoogleGenerativeAI = (apiKey: string, baseURL = 'https://generativelanguage.googleapis.com/v1beta/openai/') => merge(
  createChatProvider<'gemini-embedding-001' | 'gemini-2.5-flash-image' | 'gemini-2.5-flash-preview-05-20' | 'gemini-flash-lite-latest' | 'gemini-3-pro-preview' | 'gemini-2.5-flash' | 'gemini-flash-latest' | 'gemini-2.5-pro-preview-05-06' | 'gemini-2.5-flash-preview-tts' | 'gemini-2.0-flash-lite' | 'gemini-live-2.5-flash-preview-native-audio' | 'gemini-2.0-flash' | 'gemini-2.5-flash-lite' | 'gemini-2.5-pro-preview-06-05' | 'gemini-live-2.5-flash' | 'gemini-2.5-flash-lite-preview-06-17' | 'gemini-2.5-flash-image-preview' | 'gemini-2.5-flash-preview-09-2025' | 'gemini-2.5-flash-preview-04-17' | 'gemini-2.5-pro-preview-tts' | 'gemini-2.5-pro' | 'gemini-1.5-flash' | 'gemini-1.5-flash-8b' | 'gemini-2.5-flash-lite-preview-09-2025' | 'gemini-1.5-pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
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
 * Create a Weights & Biases Provider
 * @see {@link https://weave-docs.wandb.ai/guides/integrations/inference/}
 */
export const createWandb = (apiKey: string, baseURL = 'https://api.inference.wandb.ai/v1') => merge(
  createChatProvider<'moonshotai/Kimi-K2-Instruct' | 'microsoft/Phi-4-mini-instruct' | 'meta-llama/Llama-3.1-8B-Instruct' | 'meta-llama/Llama-3.3-70B-Instruct' | 'meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'Qwen/Qwen3-235B-A22B-Instruct-2507' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-235B-A22B-Thinking-2507' | 'deepseek-ai/DeepSeek-R1-0528' | 'deepseek-ai/DeepSeek-V3-0324'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a OpenAI Provider
 * @see {@link https://platform.openai.com/docs/models}
 */
export const createOpenAI = (apiKey: string, baseURL = 'https://api.openai.com/v1/') => merge(
  createChatProvider<'gpt-4.1-nano' | 'text-embedding-3-small' | 'gpt-4' | 'o1-pro' | 'gpt-4o-2024-05-13' | 'gpt-5.1-codex' | 'gpt-4o-2024-08-06' | 'gpt-4.1-mini' | 'o3-deep-research' | 'gpt-3.5-turbo' | 'text-embedding-3-large' | 'gpt-4-turbo' | 'o1-preview' | 'gpt-5.1-codex-mini' | 'o3-mini' | 'gpt-5.1' | 'codex-mini-latest' | 'gpt-5-nano' | 'gpt-5-codex' | 'gpt-4o' | 'gpt-4.1' | 'o4-mini' | 'o1' | 'gpt-5-mini' | 'o1-mini' | 'text-embedding-ada-002' | 'o3-pro' | 'gpt-4o-2024-11-20' | 'o3' | 'o4-mini-deep-research' | 'gpt-5-chat-latest' | 'gpt-4o-mini' | 'gpt-5' | 'gpt-5-pro' | 'gpt-5.1-chat-latest'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createImageProvider({ apiKey, baseURL }),
  createSpeechProvider({ apiKey, baseURL }),
  createTranscriptionProvider({ apiKey, baseURL }),
)

/**
 * Create a Zhipu AI Coding Plan Provider
 * @see {@link https://docs.bigmodel.cn/cn/coding-plan/overview}
 */
export const createZhipuaiCodingPlan = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/coding/paas/v4') => merge(
  createChatProvider<'glm-4.6' | 'glm-4.5v' | 'glm-4.5-air' | 'glm-4.5' | 'glm-4.5-flash'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Perplexity Provider
 * @see {@link https://docs.perplexity.ai}
 */
export const createPerplexity = (apiKey: string, baseURL = 'https://api.perplexity.ai/') => merge(
  createChatProvider<'sonar-reasoning' | 'sonar' | 'sonar-pro' | 'sonar-reasoning-pro'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a ZenMux Provider
 * @see {@link https://docs.zenmux.ai}
 */
export const createZenmux = (apiKey: string, baseURL = 'https://zenmux.ai/api/v1') => merge(
  createChatProvider<'moonshotai/kimi-k2-thinking-turbo' | 'moonshotai/kimi-k2-0905' | 'moonshotai/kimi-k2-thinking' | 'x-ai/grok-4-fast-non-reasoning' | 'x-ai/grok-4' | 'x-ai/grok-code-fast-1' | 'x-ai/grok-4-fast' | 'deepseek/deepseek-chat' | 'minimax/minimax-m2' | 'google/gemini-2.5-pro' | 'openai/gpt-5-codex' | 'openai/gpt-5' | 'inclusionai/ring-1t' | 'inclusionai/lint-1t' | 'z-ai/glm-4.5-air' | 'z-ai/glm-4.6' | 'qwen/qwen3-coder-plus' | 'kuaishou/kat-coder-pro-v1' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-4.5'>({ apiKey, baseURL }),
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
 * Create a iFlow Provider
 * @see {@link https://platform.iflow.cn/en/docs}
 */
export const createIflowcn = (apiKey: string, baseURL = 'https://apis.iflow.cn/v1') => merge(
  createChatProvider<'qwen3-coder' | 'deepseek-v3' | 'kimi-k2' | 'deepseek-r1' | 'deepseek-v3.1' | 'minimax-m2' | 'qwen3-235b' | 'kimi-k2-0905' | 'qwen3-235b-a22b-thinking-2507' | 'qwen3-vl-plus' | 'glm-4.6' | 'tstars2.0' | 'qwen3-235b-a22b-instruct' | 'qwen3-max' | 'deepseek-v3.2' | 'qwen3-max-preview' | 'qwen3-coder-plus' | 'qwen3-32b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Synthetic Provider
 * @see {@link https://synthetic.new/pricing}
 */
export const createSynthetic = (apiKey: string, baseURL = 'https://api.synthetic.new/v1') => merge(
  createChatProvider<'hf:Qwen/Qwen3-235B-A22B-Instruct-2507' | 'hf:Qwen/Qwen2.5-Coder-32B-Instruct' | 'hf:Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'hf:Qwen/Qwen3-235B-A22B-Thinking-2507' | 'hf:MiniMaxAI/MiniMax-M2' | 'hf:meta-llama/Llama-3.1-70B-Instruct' | 'hf:meta-llama/Llama-3.1-8B-Instruct' | 'hf:meta-llama/Llama-3.3-70B-Instruct' | 'hf:meta-llama/Llama-4-Scout-17B-16E-Instruct' | 'hf:meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' | 'hf:meta-llama/Llama-3.1-405B-Instruct' | 'hf:moonshotai/Kimi-K2-Instruct' | 'hf:moonshotai/Kimi-K2-Instruct-0905' | 'hf:moonshotai/Kimi-K2-Thinking' | 'hf:zai-org/GLM-4.5' | 'hf:zai-org/GLM-4.6' | 'hf:deepseek-ai/DeepSeek-R1' | 'hf:deepseek-ai/DeepSeek-R1-0528' | 'hf:deepseek-ai/DeepSeek-V3.1-Terminus' | 'hf:deepseek-ai/DeepSeek-V3' | 'hf:deepseek-ai/DeepSeek-V3.1' | 'hf:deepseek-ai/DeepSeek-V3-0324' | 'hf:openai/gpt-oss-120b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Deep Infra Provider
 * @see {@link https://deepinfra.com/models}
 */
export const createDeepinfra = (apiKey: string, baseURL = 'https://api.deepinfra.com/v1/openai/') => merge(
  createChatProvider<'moonshotai/Kimi-K2-Instruct' | 'openai/gpt-oss-20b' | 'openai/gpt-oss-120b' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct' | 'Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo' | 'zai-org/GLM-4.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Zhipu AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 */
export const createZhipuai = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/paas/v4') => merge(
  createChatProvider<'glm-4.6' | 'glm-4.5v' | 'glm-4.5-air' | 'glm-4.5' | 'glm-4.5-flash'>({ apiKey, baseURL }),
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
 * Create a Z.AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 */
export const createZai = (apiKey: string, baseURL = 'https://api.z.ai/api/paas/v4') => merge(
  createChatProvider<'glm-4.5-flash' | 'glm-4.5' | 'glm-4.5-air' | 'glm-4.5v' | 'glm-4.6'>({ apiKey, baseURL }),
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
 * Create a Requesty Provider
 * @see {@link https://requesty.ai/solution/llm-routing/models}
 */
export const createRequesty = (apiKey: string, baseURL = 'https://router.requesty.ai/v1') => merge(
  createChatProvider<'xai/grok-4' | 'xai/grok-4-fast' | 'google/gemini-2.5-flash' | 'google/gemini-2.5-pro' | 'openai/gpt-4.1-mini' | 'openai/gpt-5-nano' | 'openai/gpt-4.1' | 'openai/o4-mini' | 'openai/gpt-5-mini' | 'openai/gpt-4o-mini' | 'openai/gpt-5' | 'anthropic/claude-opus-4' | 'anthropic/claude-opus-4-1' | 'anthropic/claude-haiku-4-5' | 'anthropic/claude-sonnet-4-5' | 'anthropic/claude-3-7-sonnet' | 'anthropic/claude-sonnet-4'>({ apiKey, baseURL }),
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
 * Create a LMStudio Provider
 * @see {@link https://lmstudio.ai/models}
 */
export const createLmstudio = (apiKey: string, baseURL = 'http://127.0.0.1:1234/v1') => merge(
  createChatProvider<'openai/gpt-oss-20b' | 'qwen/qwen3-30b-a3b-2507' | 'qwen/qwen3-coder-30b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Fireworks AI Provider
 * @see {@link https://fireworks.ai/docs/}
 */
export const createFireworks = (apiKey: string, baseURL = 'https://api.fireworks.ai/inference/v1/') => merge(
  createChatProvider<'accounts/fireworks/models/deepseek-r1-0528' | 'accounts/fireworks/models/deepseek-v3p1' | 'accounts/fireworks/models/minimax-m2' | 'accounts/fireworks/models/deepseek-v3-0324' | 'accounts/fireworks/models/kimi-k2-instruct' | 'accounts/fireworks/models/qwen3-235b-a22b' | 'accounts/fireworks/models/gpt-oss-20b' | 'accounts/fireworks/models/gpt-oss-120b' | 'accounts/fireworks/models/glm-4p5-air' | 'accounts/fireworks/models/qwen3-coder-480b-a35b-instruct' | 'accounts/fireworks/models/glm-4p5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
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
 * Create a Llama Provider
 * @see {@link https://llama.developer.meta.com/docs/models}
 */
export const createLlama = (apiKey: string, baseURL = 'https://api.llama.com/compat/v1/') => merge(
  createChatProvider<'llama-3.3-8b-instruct' | 'llama-4-maverick-17b-128e-instruct-fp8' | 'llama-3.3-70b-instruct' | 'llama-4-scout-17b-16e-instruct-fp8' | 'groq-llama-4-maverick-17b-128e-instruct' | 'cerebras-llama-4-scout-17b-16e-instruct' | 'cerebras-llama-4-maverick-17b-128e-instruct'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Scaleway Provider
 * @see {@link https://www.scaleway.com/en/docs/generative-apis/}
 */
export const createScaleway = (apiKey: string, baseURL = 'https://api.scaleway.ai/v1') => merge(
  createChatProvider<'qwen3-235b-a22b-instruct-2507' | 'pixtral-12b-2409' | 'llama-3.1-8b-instruct' | 'mistral-nemo-instruct-2407' | 'mistral-small-3.2-24b-instruct-2506' | 'qwen3-coder-30b-a3b-instruct' | 'llama-3.3-70b-instruct' | 'whisper-large-v3' | 'deepseek-r1-distill-llama-70b' | 'voxtral-small-24b-2507' | 'gpt-oss-120b' | 'bge-multilingual-gemma2' | 'gemma-3-27b-it'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Poe Provider
 * @see {@link https://creator.poe.com/docs/external-applications/openai-compatible-api}
 */
export const createPoe = (apiKey: string, baseURL = 'https://api.poe.com/v1') => merge(
  createChatProvider<'facebook/llama-3.1-8b' | 'facebook/llama-3.1-405b' | 'facebook/llama-3.1-70b' | 'xai/grok-4-fast-non-reasoning' | 'xai/grok-4-fast-reasoning' | 'xai/grok-4' | 'xai/grok-code-fast-1' | 'xai/grok-2' | 'xai/grok-3' | 'xai/grok-3-mini' | 'ideogramai/ideogram' | 'ideogramai/ideogram-v2a' | 'ideogramai/ideogram-v2a-turbo' | 'ideogramai/ideogram-v2' | 'runwayml/runway' | 'runwayml/runway-gen-4-turbo' | 'openAi/gpt-4.1-nano' | 'openAi/sora-2' | 'openAi/o1-pro' | 'openAi/gpt-3.5-turbo-raw' | 'openAi/gpt-4-classic' | 'openAi/gpt-4.1-mini' | 'openAi/gpt-5-chat' | 'openAi/o3-deep-research' | 'openAi/gpt-4o-search' | 'openAi/gpt-image-1-mini' | 'openAi/gpt-3.5-turbo' | 'openAi/o3-mini-high' | 'openAi/chatgpt-4o-latest' | 'openAi/gpt-4-turbo' | 'openAi/o3-mini' | 'openAi/gpt-5-nano' | 'openAi/gpt-5-codex' | 'openAi/gpt-4o' | 'openAi/gpt-4.1' | 'openAi/o4-mini' | 'openAi/o1' | 'openAi/gpt-5-mini' | 'openAi/gpt-4o-aug' | 'openAi/o3-pro' | 'openAi/gpt-image-1' | 'openAi/gpt-3.5-turbo-instruct' | 'openAi/o3' | 'openAi/o4-mini-deep-research' | 'openAi/gpt-4-classic-0314' | 'openAi/gpt-4o-mini' | 'openAi/gpt-5' | 'openAi/dall-e-3' | 'openAi/sora-2-pro' | 'openAi/gpt-5-pro' | 'openAi/gpt-4o-mini-search' | 'elevenlabs/elevenlabs-v3' | 'elevenlabs/elevenlabs-music' | 'elevenlabs/elevenlabs-v2.5-turbo' | 'google/nano-banana' | 'google/imagen-4' | 'google/imagen-3' | 'google/imagen-4-ultra' | 'google/gemini-2.5-flash' | 'google/gemini-3.0-pro' | 'google/gemini-2.0-flash-lite' | 'google/veo-3.1' | 'google/imagen-3-fast' | 'google/lyria' | 'google/gemini-2.0-flash' | 'google/gemini-2.5-flash-lite' | 'google/veo-3' | 'google/veo-3-fast' | 'google/imagen-4-fast' | 'google/veo-2' | 'google/gemini-2.5-pro' | 'google/veo-3.1-fast' | 'openai/gpt-5.1-codex' | 'openai/gpt-5.1-codex-mini' | 'openai/gpt-5.1-instant' | 'openai/gpt-5.1' | 'stabilityai/stablediffusionxl' | 'topazlabs-co/topazlabs' | 'lumalabs/ray2' | 'lumalabs/dream-machine' | 'anthropic/claude-opus-3' | 'anthropic/claude-opus-4' | 'anthropic/claude-sonnet-3.7-reasoning' | 'anthropic/claude-opus-4-search' | 'anthropic/claude-sonnet-3.7' | 'anthropic/claude-haiku-3.5-search' | 'anthropic/claude-haiku-4.5' | 'anthropic/claude-sonnet-4-reasoning' | 'anthropic/claude-haiku-3' | 'anthropic/claude-opus-4.1' | 'anthropic/claude-sonnet-3.7-search' | 'anthropic/claude-opus-4-reasoning' | 'anthropic/claude-sonnet-3.5' | 'anthropic/claude-sonnet-4' | 'anthropic/claude-haiku-3.5' | 'anthropic/claude-sonnet-3.5-june' | 'anthropic/claude-sonnet-4.5' | 'anthropic/claude-sonnet-4-search' | 'trytako/tako' | 'novita/glm-4.6'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Cerebras Provider
 * @see {@link https://inference-docs.cerebras.ai/models/overview}
 */
export const createCerebras = (apiKey: string, baseURL = 'https://api.cerebras.ai/v1/') => merge(
  createChatProvider<'qwen-3-235b-a22b-instruct-2507' | 'zai-glm-4.6' | 'qwen-3-coder-480b' | 'gpt-oss-120b'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)

/**
 * Create a Minimaxi Provider
 * @see {@link https://platform.minimaxi.com/docs/api-reference/text-openai-api}
 */
export const createMinimaxi = (apiKey: string, baseURL = 'https://api.minimaxi.com/v1/') => merge(
  createChatProvider({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a Novita AI Provider
 * @see {@link https://novita.ai/docs/guides/llm-api#api-integration}
 */
export const createNovita = (apiKey: string, baseURL = 'https://api.novita.ai/v3/openai/') => merge(
  createChatProvider({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)

/**
 * Create a SiliconFlow Provider
 * @see {@link https://docs.siliconflow.com/en/userguide/quickstart#4-3-call-via-openai-interface}
 */
export const createSiliconFlow = (apiKey: string, baseURL = 'https://api.siliconflow.cn/v1/') => merge(
  createChatProvider({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createSpeechProvider({ apiKey, baseURL }),
  createTranscriptionProvider({ apiKey, baseURL }),
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
