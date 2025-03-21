import { renderHook } from '@testing-library/react-hooks'
import { describe, expect, it } from 'vitest'

import { useChat } from '../src'

describe('useChat', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useChat({
      baseURL: 'http://localhost:43210/v1/',
      id: 'simple-chat',
      initialMessages: [
        {
          content: 'you are a helpful assistant.',
          role: 'system',
        },
      ],
      maxSteps: 3,
      model: 'mistral-nemo-instruct-2407',
      preventDefault: true,
      toolChoice: 'auto',
    }))

    expect(result.current.submitMessage).toBeDefined()
  })
})
