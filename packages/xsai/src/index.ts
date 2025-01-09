// @xsai/tool extend types
import '@xsai/tool/generate-text'

// @xsai/providers
export * as providers from './providers'
export { embed, embedMany, type EmbedManyOptions, type EmbedManyResult, type EmbedOptions, type EmbedResponseUsage, type EmbedResult } from '@xsai/embed'
export { generateObject, type GenerateObjectOptions, type GenerateObjectResult } from '@xsai/generate-object'
export { generateSpeech, type GenerateSpeechOptions } from '@xsai/generate-speech'
export { generateText, type GenerateTextOptions, type GenerateTextResponseUsage, type GenerateTextResult } from '@xsai/generate-text'
export { generateTranscription, type GenerateTranscriptionOptions, type GenerateTranscriptionResult } from '@xsai/generate-transcription'
export { listModels, type ListModelsOptions, type ListModelsResponse, type Model, retrieveModel, type RetrieveModelOptions } from '@xsai/model'
// shared chat utils
export * from '@xsai/shared-chat'
export { streamObject, type StreamObjectOptions, type StreamObjectResult } from '@xsai/stream-object'
export { streamText, type StreamTextOptions, type StreamTextResponse, type StreamTextResponseUsage, type StreamTextResult } from '@xsai/stream-text'
export { tool, type ToolOptions, type ToolResult } from '@xsai/tool'
