import type * as Responses from '../../generated'

export interface ResponsesProviderPartMetadata {
  annotations: ResponsesAnnotation[]
}

type ResponsesAnnotation
  = | Responses.Annotation
    | {
      container_id: string
      end_index: number
      file_id: string
      filename: string
      start_index: number
      type: 'container_file_citation'
    }
    | {
      file_id: string
      filename: string
      index: number
      type: 'file_citation'
    }
    | {
      file_id: string
      index: number
      type: 'file_path'
    }
