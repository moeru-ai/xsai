import type { UrlCitationParam } from '../../generated'

export type ResponsesAnnotation
  = | UrlCitationParam
    | { container_id: string, end_index: number, file_id: string, filename: string, index: null | number, start_index: number, type: 'container_file_citation' }
    | { file_id: string, filename: string, index: number, type: 'file_citation' }
    | { file_id: string, index: number, type: 'file_path' }

export interface ResponsesPartMetadata {
  // TODO: Move citations to a first-class TextPart field.
  citations?: ResponsesAnnotation[]
}
