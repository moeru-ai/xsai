import {
  createChatProvider,
  createMetadataProvider,
  createSpeechProvider,
  merge,
} from '@xsai-ext/shared-providers'

export const createPlayer2 = (baseURL = 'http://localhost:4315/v1/') => merge(createMetadataProvider('player2'), createChatProvider({ baseURL }), createSpeechProvider({ baseURL, specialTag: 'player2' }))
