import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult, SpeechProvider, TranscriptionProvider } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createSiliconFlow = (userOptions: ProviderOptions<true>):
  /** @see {@link https://siliconflow.com/en/pricing} */
  ChatProvider< | 'deepseek-ai/DeepSeek-R1'
  | 'deepseek-ai/DeepSeek-R1-Distill-Llama-8B'
  | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B'
  | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B'
  | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B'
  | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B'
  | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B'
  | 'deepseek-ai/DeepSeek-V3'
  | 'deepseek-ai/deepseek-vl2'
  | 'deepseek-ai/Janus-Pro-7B'
  | 'Qwen/QVQ-72B-Preview'
  | 'Qwen/Qwen2.5-7B-Instruct'
  | 'Qwen/Qwen2.5-14B-Instruct'
  | 'Qwen/Qwen2.5-32B-Instruct'
  | 'Qwen/Qwen2.5-72B-Instruct'
  | 'Qwen/Qwen2.5-72B-Instruct-128K'
  | 'Qwen/Qwen2.5-Coder-7B-Instruct'
  | 'Qwen/Qwen2.5-Coder-32B-Instruct'
  | 'Qwen/QwQ-32B-Preview'>
  & EmbedProvider<'BAAI/bge-reranker-v2-m3'
  | 'netease-youdao/bce-embedding-base_v1'
  | 'netease-youdao/bce-reranker-base_v1'
  | 'Pro/BAAI/bge-m3'
  | 'Pro/BAAI/bge-reranker-v2-m3'>
  & ModelProvider
  & SpeechProvider< | 'BAAI/bge-large-en-v1.5'
  | 'BAAI/bge-large-zh-v1.5'
  | 'BAAI/bge-m3'
  | 'fishaudio/fish-speech-1.4'
  | 'fishaudio/fish-speech-1.5'
  | 'FunAudioLLM/CosyVoice2-0.5B'
  | 'LoRA/RVC-Boss/GPT-SoVITS'
  | 'RVC-Boss/GPT-SoVITS' >
  & TranscriptionProvider<
    'FunAudioLLM/SenseVoiceSmall'
  > => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.siliconflow.cn/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
    model: () => options,
    speech: result,
    transcription: result,
  }
}
