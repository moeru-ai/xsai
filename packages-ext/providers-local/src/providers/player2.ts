import {
  createChatProvider,
  createMetadataProvider,
  merge,
} from '@xsai-ext/shared-providers'

export const createPlayer2 = (baseURL = 'http://localhost:4315/v1/') => merge(createMetadataProvider('player2-api'), createChatProvider({ baseURL }))
