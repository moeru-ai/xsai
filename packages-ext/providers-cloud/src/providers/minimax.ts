import { createChatProvider, createMetadataProvider, defineProvider } from '@xsai-ext/shared-providers'

/** @see {@link https://www.minimax.io/platform/document/platform%20introduction} */
export const createMinimax = (apiKey: string, baseURL = 'https://api.minimaxi.chat/v1/') => defineProvider(
  createMetadataProvider('minimax'),
  /** @see {@link https://platform.minimaxi.com/document/ChatCompletion%20v2?key=66701d281d57f38758d581d0#1XspWaYA7baUnFix0otJIQkt} */
  createChatProvider<'abab6.5s-chat' | 'DeepSeek-R1' | 'MiniMax-Text-01'>({ apiKey, baseURL }),
)
