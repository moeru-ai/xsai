import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult, SpeechProvider, TranscriptionProvider } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createSiliconFlow = (userOptions: ProviderOptions<true>):
  /** @see {@link https://siliconflow.com/en/pricing} */
  ChatProvider<'01-ai/Yi-1.5-6B-Chat'
  | '01-ai/Yi-1.5-9B-Chat-16K'
  | '01-ai/Yi-1.5-34B-Chat-16K'
  | 'AIDC-AI/Marco-o1'
  | 'deepseek-ai/DeepSeek-R1'
  | 'deepseek-ai/DeepSeek-R1-Distill-Llama-8B'
  | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B'
  | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B'
  | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B'
  | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B'
  | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B'
  | 'deepseek-ai/DeepSeek-V2.5'
  | 'deepseek-ai/DeepSeek-V3'
  | 'deepseek-ai/deepseek-vl2'
  | 'deepseek-ai/Janus-Pro-7B'
  | 'genmo/mochi-1-preview'
  | 'internlm/internlm2_5-7b-chat'
  | 'internlm/internlm2_5-20b-chat'
  | 'Lightricks/LTX-Video'
  | 'LoRA/Qwen/Qwen2.5-7B-Instruct'
  | 'LoRA/Qwen/Qwen2.5-14B-Instruct'
  | 'LoRA/Qwen/Qwen2.5-32B-Instruct'
  | 'LoRA/Qwen/Qwen2.5-72B-Instruct'
  | 'OpenGVLab/InternVL2-26B'
  | 'Pro/deepseek-ai/DeepSeek-R1'
  | 'Pro/deepseek-ai/DeepSeek-R1-Distill-Llama-8B'
  | 'Pro/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B'
  | 'Pro/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B'
  | 'Pro/deepseek-ai/DeepSeek-V3'
  | 'Pro/OpenGVLab/InternVL2-8B'
  | 'Pro/Qwen/Qwen2-1.5B-Instruct'
  | 'Pro/Qwen/Qwen2-7B-Instruct'
  | 'Pro/Qwen/Qwen2-VL-7B-Instruct'
  | 'Pro/Qwen/Qwen2.5-7B-Instruct'
  | 'Pro/Qwen/Qwen2.5-Coder-7B-Instruct'
  | 'Pro/THUDM/glm-4-9b-chat'
  | 'Qwen/QVQ-72B-Preview'
  | 'Qwen/Qwen2-1.5B-Instruct'
  | 'Qwen/Qwen2-7B-Instruct'
  | 'Qwen/Qwen2-VL-72B-Instruct'
  | 'Qwen/Qwen2.5-7B-Instruct'
  | 'Qwen/Qwen2.5-14B-Instruct'
  | 'Qwen/Qwen2.5-32B-Instruct'
  | 'Qwen/Qwen2.5-72B-Instruct'
  | 'Qwen/Qwen2.5-72B-Instruct-128K'
  | 'Qwen/Qwen2.5-Coder-7B-Instruct'
  | 'Qwen/Qwen2.5-Coder-32B-Instruct'
  | 'Qwen/QwQ-32B-Preview'
  | 'TeleAI/TeleChat2'
  | 'THUDM/chatglm3-6b'
  | 'THUDM/glm-4-9b-chat'
  | 'Vendor-A/Qwen/Qwen2.5-72B-Instruct'>
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
