import { describe, it } from 'vitest'

import { languageModelE2ECases } from '../../text/test/test-utils'
import { messages } from '../src'

const cases = languageModelE2ECases(messages, { maxOutputTokens: 4096 })

describe('messages e2e', () => {
  it('streams a response from the local Ollama Messages API', cases.streamsResponse)
  it('continues a manual tool loop with the finish message', cases.continuesManualToolLoop)
})
