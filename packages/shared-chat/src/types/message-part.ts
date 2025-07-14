export interface AudioBase64 {
  /**
   * Base64 encoded audio data.
   */
  data: string
  format: 'mp3' | 'wav'
}

export interface AudioPart extends CommonPart<'input_audio'> {
  input_audio: AudioBase64
}

export interface CommonPart<T extends string> {
  type: T
}

export interface ImagePart extends CommonPart<'image_url'> {
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

export type Part
  = | AudioPart
    | ImagePart
    | RefusalPart
    | TextPart

export interface RefusalPart extends CommonPart<'refusal'> {
  refusal: string
}

export interface TextPart extends CommonPart<'text'> {
  text: string
}
