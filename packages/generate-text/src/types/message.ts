export type Part =
  | PartAudio
  | PartImage
  | PartRefusal
  | PartText

export interface CommonPart<T extends string> {
  type: T
}

export interface PartImage extends CommonPart<'image_url'> {
  image_url: ImageURLorBase64
}

export interface ImageURLorBase64 {
  /**
   * Specifies the detail level of the image.
   */
  detail?: 'auto' | 'high' | 'low'

  /**
   * Either a URL of the image or the base64 encoded image data.
   */
  url: string
}

export interface PartAudio extends CommonPart<'input_audio'> {
  input_audio: AudioBase64
}

export interface AudioBase64 {
  /**
   * Base64 encoded audio data.
   */
  data: string
  format: 'mp3' | 'wav'
}

export interface PartRefusal extends CommonPart<'refusal'> {
  refusal: string
}

export interface PartText extends CommonPart<'text'> {
  text: string
}

export type Message = AssistantMessage | SystemMessage | ToolMessage | UserMessage

export interface CommonMessage<T extends string, P extends Part> {
  content: Array<P> | string
  name?: string
  role: T
}

export interface SystemMessage extends CommonMessage<'system', PartText> {}

export interface UserMessage extends CommonMessage<'user', PartAudio | PartImage | PartText> { }

export interface AssistantMessage extends CommonMessage<'assistant', PartRefusal | PartText> {
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

export interface ToolMessage extends Omit<CommonMessage<'tool', PartText>, 'name'> {
  tool_call_id: string
}
