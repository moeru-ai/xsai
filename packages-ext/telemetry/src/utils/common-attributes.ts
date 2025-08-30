import type { Attributes } from '@opentelemetry/api'

export const commonAttributes = {
  'ai.model.id': 'qwen3:0.6b',
  'ai.model.provider': 'ollama.responses',
  'ai.operationId': 'ai.generateText.doGenerate',
  // "ai.prompt.messages": "[{"role":"user","content":[{"type":"text","text":"Why is the sky blue?"}]}]",
  'ai.response.finishReason': 'stop',
  'ai.response.id': 'aitxt-3yWUFG3So3GamhjWSS32iO5n',
  'ai.response.model': 'qwen3:0.6b',
  // "ai.response.providerMetadata": "{"ollama":{}}",
  'ai.response.timestamp': '2025-08-30T05:17:04.081Z',
  'ai.settings.maxRetries': 2,
  'ai.settings.seed': 114514,
  'ai.usage.completionTokens': 164,
  'ai.usage.promptTokens': 22,
  'gen_ai.request.model': 'qwen3:0.6b',
  'gen_ai.response.finish_reasons': [
    'stop',
  ],
  'gen_ai.response.id': 'aitxt-3yWUFG3So3GamhjWSS32iO5n',
  'gen_ai.response.model': 'qwen3:0.6b',
  'gen_ai.system': 'ollama.responses',
  'gen_ai.usage.input_tokens': 22,
  'gen_ai.usage.output_tokens': 164,
  'operation.name': 'ai.generateText.doGenerate',
} satisfies Attributes
