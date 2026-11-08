import type { Override } from './codegen'

/**
 * Corrections deep-merged into normalized providers.
 * Give each entry a comment with its reason, and prefer fixing models.dev upstream.
 */
export const overrides: Record<string, Override> = {}
