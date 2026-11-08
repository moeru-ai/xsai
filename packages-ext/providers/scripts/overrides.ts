import type { Override } from './codegen'

/**
 * Corrections deep-merged into normalized providers.
 * Give each entry a comment with its reason, and prefer fixing models.dev upstream.
 */
export const overrides: Record<string, Override> = {
  // Authenticates with a service account file, not a bearer token.
  'google-vertex': { apiKeyEnv: [] },
  // AICORE_SERVICE_KEY is a JSON service key that needs an OAuth exchange.
  'sap-ai-core': { apiKeyEnv: [] },
}
