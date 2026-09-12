import { describe, it } from 'vitest'

import { languageModelE2ECases } from '../../text-primitives/test/test-utils'
import { responses } from '../src'

const cases = languageModelE2ECases(responses)

describe('responses e2e', () => {
  it('streams a response from the local Ollama Responses API', cases.streamsResponse)
  it('continues a manual tool loop with the finish message', cases.continuesManualToolLoop)
})
