import type { Usage as OpenResponsesUsage } from '../generated'

export interface Usage extends Omit<OpenResponsesUsage, 'input_tokens_details' | 'output_tokens_details'> {}
