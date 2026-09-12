import { describe, it } from 'vitest'

import { languageModelE2ECases } from '../../text-primitives/test/test-utils'
import { chat } from '../src'

const cases = languageModelE2ECases(chat)

describe('chat e2e', () => {
  it('streams a response from the local Ollama Chat Completions API', cases.streamsResponse)
  it('continues a manual tool loop with the finish message', cases.continuesManualToolLoop)
})
