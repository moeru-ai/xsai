import type { Override } from '.'

/**
 * Corrections deep-merged into normalized providers.
 * Give each entry a comment with its reason, and prefer fixing models.dev upstream.
 */
export const overrides: Record<string, Override> = {
  // Native protocols first; other providers prefer Chat Completions.
  'anthropic': { protocols: ['messages'] },
  'azure': { protocols: ['responses'] },
  // Claude models are also on Chat Completions; Messages is their native protocol.
  'github-copilot': { protocols: ['messages'] },
  // Authenticates with a service account file, not a bearer token.
  'google-vertex': { apiKeyEnv: [] },
  'openai': { protocols: ['responses'] },
  // AICORE_SERVICE_KEY is a JSON service key that needs an OAuth exchange.
  'sap-ai-core': { apiKeyEnv: [] },
  // xAI calls Chat Completions its legacy API.
  'xai': { protocols: ['responses'] },
}
