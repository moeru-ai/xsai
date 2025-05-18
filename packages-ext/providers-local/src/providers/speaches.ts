import {
  createMetadataProvider,
  createSpeechProvider,
  createTranscriptionProvider,
  merge,
} from '@xsai-ext/shared-providers'

/** @see {@link https://speaches.ai} */
export const createSpeaches = (apiKey?: string, baseURL = 'http://localhost:8000/v1/') => merge(
  createMetadataProvider('litellm'),
  createSpeechProvider<
    | 'hexgrad/Kokoro-82M'
    | 'rhasspy/piper-voices'
    | 'speaches-ai/Kokoro-82M-v1.0-ONNX'
  >({ apiKey, baseURL }),
  createTranscriptionProvider<
    | 'deepdml/faster-whisper-large-v3-turbo-ct2'
    | 'Systran/faster-whisper-large-v3'
    | 'Systran/faster-whisper-small.en'
  >({ apiKey, baseURL }),
)
