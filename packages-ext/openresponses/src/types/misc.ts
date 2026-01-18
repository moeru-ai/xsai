/** The status of the function tool call. */
export type FunctionCallStatus = 'completed' | 'in_progress' | 'incomplete'

/**
 * Details about why the response was incomplete.
 * @see {@link https://www.openresponses.org/reference#object-IncompleteDetails}
 */
export interface IncompleteDetails {
  /** The reason the response could not be completed. */
  reason: string
}

/** @see {@link https://www.openresponses.org/reference#object-UrlCitationParam-title} */
export interface UrlCitation {
  /** The index of the last character of the citation in the message. */
  endIndex: number
  /** The index of the first character of the citation in the message. */
  startIndex: number
  /** The title of the cited resource. */
  title: string
  type: 'url_citation'
  /** The URL of the cited resource. */
  url: string
}
