import type { GenerateTextOptions } from 'xsai'

import { trace } from '@opentelemetry/api'
import { generateText } from 'xsai'

export class Telemetry {
  private tracer = trace.getTracer('@xsai-ext/opentelemetry')

  constructor() {

  }

  public async generateText(options: GenerateTextOptions) {
    return this.tracer.startActiveSpan('ai.generateText.doGenerate', async (span) => {
      const result = await generateText(options)

      span.setAttributes({
        'ai.response.finishReason': result.finishReason,
        'ai.response.id': crypto.randomUUID(),
        'ai.response.model': options.model,
        'ai.response.text': result.text,
        'ai.response.timestamp': new Date().toISOString(),
        'ai.response.toolCalls': JSON.stringify(result.toolCalls),
        'ai.usage.completionTokens': result.usage.completion_tokens,
        'ai.usage.promptTokens': result.usage.prompt_tokens,
      })

      return result
    })
  }
}

export const createTelemetry = () => new Telemetry()
