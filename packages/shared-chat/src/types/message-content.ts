export interface AudioContentPart {
  input_audio: {
    data: string
    format: 'mp3' | 'wav'
  }
  type: 'input_audio'
}

/** @internal */
export type CommonContentPart = AudioContentPart | FileContentPart | ImageContentPart | TextContentPart

export interface FileContentPart {
  file: {
    file_data?: string
    file_id?: string
    filename?: string
  }
  type: 'file'
}

export interface ImageContentPart {
  image_url: {
    detail?: 'auto' | 'high' | 'low'
    url: string
  }
  type: 'image_url'
}

export interface RefusalContentPart {
  refusal: string
  type: 'refusal'
}

export interface TextContentPart {
  text: string
  type: 'text'
}
