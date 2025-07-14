import { createChatProvider, createMetadataProvider, merge } from '@xsai-ext/shared-providers'

/** @see {@link https://www.minimax.io/platform/document/platform%20introduction?key=66701c8e1d57f38758d58198} */
export const createMinimaxGlobal = (apiKey: string, baseURL = 'https://api.minimaxi.chat/v1/') => merge(
  createMetadataProvider('minimax'),
  /** @see {@link https://www.minimax.io/platform/document/ChatCompletion%20v2?key=66701d281d57f38758d581d0#QklxsNSbaf6kM4j6wjO5eEek} */
  createChatProvider<'abab6.5s-chat' | 'DeepSeek-R1' | 'MiniMax-Text-01'>({ apiKey, baseURL }),
)

/** @see {@link https://platform.minimaxi.com/document/platform%20introduction?key=66701c8e1d57f38758d58198} */
export const createMinimaxChina = (apiKey: string, baseURL = 'https://api.minimax.chat/v1/') => merge(
  createMetadataProvider('minimax'),
  /** @see {@link https://platform.minimaxi.com/document/ChatCompletion%20v2?key=66701d281d57f38758d581d0#1XspWaYA7baUnFix0otJIQkt} */
  createChatProvider<'abab6.5s-chat' | 'DeepSeek-R1' | 'MiniMax-Text-01'>({ apiKey, baseURL }),
)
