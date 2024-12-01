import type { AudioPart, ImagePart, Part, RefusalPart, TextPart } from './message-part'

export type Message = AssistantMessage | SystemMessage | ToolMessage | UserMessage

export interface CommonMessage<T extends string, P extends Part> {
  content: Array<P> | string
  name?: string
  role: T
}

export interface SystemMessage extends CommonMessage<'system', TextPart> {}

export interface UserMessage extends CommonMessage<'user', AudioPart | ImagePart | TextPart> { }

export interface AssistantMessage extends CommonMessage<'assistant', RefusalPart | TextPart> {
  refusal?: string
  tool_calls?: {
    function: {
      arguments: string
      name: string
    }
    id: string
    type: 'function'
  }[]
  // TODO: audio
}

export interface AssistantMessageResponse extends Omit<AssistantMessage, 'content'> {
  content?: string
}

export interface ToolMessage extends Omit<CommonMessage<'tool', TextPart>, 'name'> {
  tool_call_id: string
}
