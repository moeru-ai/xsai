import type { AudioPart, ImagePart, Part, RefusalPart, TextPart } from './message-part'

type Optional<T, K extends keyof T> = Omit<T, K> & Pick<Partial<T>, K>

export type Message = AssistantMessage | SystemMessage | ToolMessage | UserMessage

export interface CommonMessage<T extends string, P extends Part> {
  content: Array<P> | string
  name?: string
  role: T
}

export type SystemMessagePart = TextPart

export interface SystemMessage extends CommonMessage<'system', SystemMessagePart> {}

export type UserMessagePart = AudioPart | ImagePart | TextPart

export interface UserMessage extends CommonMessage<'user', UserMessagePart> { }

export type AssistantMessagePart = RefusalPart | TextPart

export interface ToolCall {
  function: {
    arguments: string
    name: string
  }
  id: string
  type: 'function'
}

export interface AssistantMessage extends Optional<CommonMessage<'assistant', AssistantMessagePart>, 'content'> {
  refusal?: null | string
  tool_calls?: ToolCall[]
  // TODO: audio
}

export interface AssistantMessageResponse extends Omit<AssistantMessage, 'content'> {
  content?: string
}

export type ToolMessagePart = TextPart

export interface ToolMessage extends Omit<CommonMessage<'tool', ToolMessagePart>, 'name'> {
  tool_call_id: string
}
