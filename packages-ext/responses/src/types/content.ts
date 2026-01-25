import type { UrlCitation } from './misc'

/**
 * A file input to the model.
 * @see {@link https://www.openresponses.org/reference#object-InputFileContentParam}
 */
export interface InputFileContent {
  /** The base64-encoded data of the file to be sent to the model. */
  file_data?: string
  /** The URL of the file to be sent to the model. */
  file_url?: string
  /** The name of the file to be sent to the model. */
  filename?: string
  type: 'input_file'
}

/**
 * An image input to the model.
 * @see {@link https://www.openresponses.org/reference#object-InputImageContentParamAutoParam}
 */
export interface InputImageContent {
  /** The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`. */
  detail?: 'auto' | 'high' | 'low'
  /** The URL of the image to be sent to the model. A fully qualified URL or base64 encoded image in a data URL. */
  image_url?: string
  type: 'input_image'
}

/**
 * A text input to the model.
 * @see {@link https://www.openresponses.org/reference#object-InputTextContentParam}
 */
export interface InputTextContent {
  /** The text input to the model. */
  text: string
  type: 'input_text'
}

/**
 * A content block representing a video input to the model.
 * @see {@link https://www.openresponses.org/reference#object-InputVideoContent}
 */
export interface InputVideoContent {
  type: 'input_video'
  /** A base64 or remote url that resolves to a video file. */
  video_url: string
}

/** @see {@link https://www.openresponses.org/reference#object-OutputTextContentParam} */
export interface OutputTextContent {
  annotations?: UrlCitation[]
  /** The text content. */
  text: string
  type: 'output_text'
}

/** @see {@link https://www.openresponses.org/reference#object-ReasoningSummaryContentParam} */
export interface ReasoningSummaryContent {
  /** The reasoning summary text. */
  text: string
  type: 'summary_text'
}

/** @see {@link https://www.openresponses.org/reference#object-RefusalContentParam} */
export interface RefusalContent {
  /** The refusal text. */
  refusal: string
  type: 'refusal'
}
