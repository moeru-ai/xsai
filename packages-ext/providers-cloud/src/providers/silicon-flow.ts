import {
  createChatProvider,
  createEmbedProvider,
  createMetadata,
  createModelProvider,
  createSpeechProvider,
  createTranscriptionProvider,
  defineProvider,
} from '@xsai-ext/shared-providers'

/** @see {@link https://siliconflow.com/en/pricing} */
export const createSiliconFlow = (apiKey: string, baseURL = 'https://api.siliconflow.cn/v1/') => defineProvider(
  createMetadata('silicon-flow'),
  createChatProvider<
    | 'deepseek-ai/DeepSeek-R1'
    | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B'
    | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B'
    | 'deepseek-ai/DeepSeek-V3'
    | 'Qwen/QVQ-72B-Preview'
    | 'Qwen/Qwen2.5-32B-Instruct'
    | 'Qwen/Qwen2.5-72B-Instruct'
    | 'Qwen/Qwen2.5-72B-Instruct-128K'
    | 'Qwen/Qwen2.5-Coder-32B-Instruct'
    | 'Qwen/QwQ-32B-Preview'
  >({ apiKey, baseURL }),
  createEmbedProvider<
    | 'BAAI/bge-reranker-v2-m3'
    | 'netease-youdao/bce-embedding-base_v1'
    | 'netease-youdao/bce-reranker-base_v1'
  >({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createSpeechProvider<
    | 'BAAI/bge-large-en-v1.5'
    | 'BAAI/bge-large-zh-v1.5'
    | 'BAAI/bge-m3'
    | 'fishaudio/fish-speech-1.5'
    | 'FunAudioLLM/CosyVoice2-0.5B'
    | 'LoRA/RVC-Boss/GPT-SoVITS'
    | 'RVC-Boss/GPT-SoVITS'
  >({ apiKey, baseURL }),
  createTranscriptionProvider<'FunAudioLLM/SenseVoiceSmall'>({ apiKey, baseURL }),
)
