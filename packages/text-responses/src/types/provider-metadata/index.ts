import type { UrlCitationParam } from '../../generated'

export interface ResponsesPartMetadata {
  // TODO: Move citations to a first-class TextPart field.
  citations?: UrlCitationParam[]
}
