import type {
  ContentEndEvent,
  ContentStartEvent,
  ReasoningDeltaEvent,
  RefusalDeltaEvent,
  TextDeltaEvent,
  ToolCallDeltaEvent,
} from './types/event'
import type { AssistantMessage, AssistantMessageContent } from './types/message'

type ContentEvent
  = | ContentEndEvent
    | ContentStartEvent
    | ReasoningDeltaEvent
    | RefusalDeltaEvent
    | TextDeltaEvent
    | ToolCallDeltaEvent

export const contentAccumulator = () => {
  const parts: (AssistantMessageContent | undefined)[] = []
  const open = new Map<number, AssistantMessageContent>()

  const apply = (event: ContentEvent): void => {
    switch (event.type) {
      case 'content.end':
        open.delete(event.index)
        parts[event.index] = event.content
        break
      case 'content.start':
        switch (event.contentType) {
          case 'reasoning':
            open.set(event.index, { content: [], type: 'reasoning' })
            break
          case 'refusal':
            open.set(event.index, { refusal: '', type: 'refusal' })
            break
          case 'text':
            open.set(event.index, { text: '', type: 'text' })
            break
          case 'tool-call':
            open.set(event.index, { arguments: '', callId: '', id: '', name: '', type: 'tool-call' })
            break
        }
        break
      case 'reasoning.delta': {
        const part = open.get(event.index)
        if (part?.type === 'reasoning') {
          const content = part.content
          const last = content[content.length - 1]
          open.set(event.index, {
            ...part,
            content: last?.type === 'text'
              ? [...content.slice(0, -1), { text: last.text + event.delta, type: 'text' }]
              : [...content, { text: event.delta, type: 'text' }],
          })
        }
        break
      }
      case 'refusal.delta': {
        const part = open.get(event.index)
        if (part?.type === 'refusal')
          open.set(event.index, { ...part, refusal: part.refusal + event.delta })
        break
      }
      case 'text.delta': {
        const part = open.get(event.index)
        if (part?.type === 'text')
          open.set(event.index, { ...part, text: part.text + event.delta })
        break
      }
      case 'tool-call.delta': {
        const part = open.get(event.index)
        if (part?.type === 'tool-call') {
          open.set(event.index, {
            ...part,
            arguments: part.arguments + event.delta,
            callId: event.id,
            id: event.id,
            name: event.name ?? part.name,
          })
        }
        break
      }
    }
  }

  const content = (): AssistantMessageContent[] => {
    const result: AssistantMessageContent[] = []
    for (let index = 0; index < parts.length; index++) {
      const part = parts[index] ?? open.get(index)
      if (part !== undefined)
        result.push(part)
    }
    for (const [index, part] of open) {
      if (index >= parts.length)
        result.push(part)
    }
    return result
  }

  return {
    apply,
    at: (index: number): AssistantMessageContent | undefined => parts[index] ?? open.get(index),
    content,
    replace: (messageContent: AssistantMessage['content']): void => {
      open.clear()
      parts.length = 0
      parts.push(...typeof messageContent === 'string'
        ? [{ text: messageContent, type: 'text' as const }]
        : messageContent)
    },
  }
}
