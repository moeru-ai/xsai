export type Content = ContentMap[ContentType]

export interface ContentMap {
  'file': FilePart
  'image': ImagePart
  'reasoning': ReasoningPart
  'text': TextPart
  'tool-call': ToolCallPart
  'tool-result': ToolResultPart
}

export type ContentType = keyof ContentMap

export interface FilePart {
  data: string | URL
  type: 'file'
}

export interface ImagePart {
  data: string | URL
  detail?: 'auto' | 'high' | 'low'
  type: 'image'
}

export interface ReasoningPart {
  content: ReasoningPartContent[]
  id?: string
  type: 'reasoning'
}

export type ReasoningPartContent
  = | ReasoningPartEncryptedContent
    | ReasoningPartRedactedContent
    | ReasoningPartSummaryContent
    | ReasoningPartTextContent

export interface ReasoningPartEncryptedContent {
  text: string
  type: 'encrypted'
}

export interface ReasoningPartRedactedContent {
  data: string
  type: 'redacted'
}

export interface ReasoningPartSummaryContent {
  text: string
  type: 'summary'
}

export interface ReasoningPartTextContent {
  signature?: string
  text: string
  type: 'text'
}

export interface TextPart {
  text: string
  type: 'text'
}

export interface ToolCallPart {
  arguments: string
  callId: string
  id: string
  name: string
  type: 'tool-call'
}

export interface ToolResultPart {
  callId: string
  output: string | ToolResultPartContent[]
  type: 'tool-result'
}

export type ToolResultPartContent = ImagePart | TextPart
