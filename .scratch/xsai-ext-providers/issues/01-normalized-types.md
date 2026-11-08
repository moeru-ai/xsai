# Define the normalized provider, model, route, capability, and cost types

Parent: ../map.md
Type: grilling
Labels: wayfinder:grilling
Status: resolved
Blocked by: none

## Question

Which public types does the package expose, and which models.dev v2 fields map into them?
Cover provider (id, name, doc, env), model (id, name, type, status, family, limits, modalities), route (protocol, baseURL, compatibility), capabilities (tools, reasoning efforts, structured output, input MIME types), and cost.
Decide which model types (`chat`, `embedding`, `speech`, `transcription`, `image`, others) are included, and how unknown v2 fields are dropped or kept.

## Answer

Resolved on 2026-11-08 against the models.dev v2 snapshot of the same day.

### Scope

- Include model types with an xsAI package: `chat`, `decision`, `embedding`, `image`, `speech`, `transcription`.
- Exclude `video`, `realtime`, `reranking`, `audio` (music generation), and `extraction`.
- Include deprecated models and mark them with `status`.
- Drop `description`, `family`, `release_date`, `last_updated`, `knowledge`, `open_weights`, `canonical_id`, `experimental.modes`, and `sdk`.

### Protocols

Protocol names equal xsAI factory names:

| Protocol | v2 `api` key | Helper subpath |
| --- | --- | --- |
| `chat` | `chat-completions` | `/text-chat` |
| `messages` | `messages` | `/text-messages` |
| `responses` | `responses` | `/text-responses` |
| `embeddings` | `embeddings` | `/embed` |
| `generations` | `images` | `/image` |
| `speech` | `speech` | `/audio` |
| `transcriptions` | `transcriptions` | `/audio` |
| `decisions` | `decisions` | `/decide` |
| `systemone` | `systemone` | `/decide` |

Other v2 `api` keys are dropped.

### Types

```ts
type Protocol = 'chat' | 'decisions' | 'embeddings' | 'generations' | 'messages' | 'responses' | 'speech' | 'systemone' | 'transcriptions'

type ReasoningEffort = 'high' | 'low' | 'max' | 'medium' | 'minimal' | 'none' | 'xhigh' | (string & {})

interface Provider<TModel extends string = string> {
  doc: string
  /** Environment variable names, including API keys and template variables. */
  env: string[]
  id: string
  models: Record<TModel, Model>
  name: string
}

interface Model {
  capabilities: ModelCapabilities
  /** Defined by issue 02. */
  cost?: Cost
  id: string
  limit: { context?: number, input?: number, output?: number }
  /** MIME types, as models.dev lists them. */
  modalities: { input: string[], output: string[] }
  name: string
  routes: Partial<Record<Protocol, Route>>
  status?: 'alpha' | 'beta' | 'deprecated'
  type: 'chat' | 'decision' | 'embedding' | 'image' | 'speech' | 'transcription'
}

interface ModelCapabilities {
  cache?: { explicit?: boolean, implicit?: boolean }
  reasoning: {
    budget?: { max?: number, min?: number }
    default?: unknown // shape follows v2 `reasoning.default`
    efforts?: ReasoningEffort[]
    supported: boolean
    toggle?: boolean
  }
  structuredOutput?: boolean
  temperature?: boolean
  tools: { supported: boolean }
  topK?: boolean
  topP?: boolean
}

interface Route {
  baseURL: string
  capabilities?: { tools?: { choice?: string[], strict?: boolean } }
  /** Exposed as data only. xsAI adapters do not read it. */
  compatibility?: { maxTokensField?: string, mediaInput?: string, reasoningField?: string }
  /** Resolution against adapter paths is decided by issue 05. */
  path?: string
  protocol: Protocol
  /** Template variables in `baseURL`, such as `AWS_REGION`. */
  variables?: string[]
}
```

### Rules

- Fields use camelCase.
- A value models.dev does not give stays `undefined`. Only fields present on every v2 model are required. Unknown is never written as `false` or `0`.
- Templated base URLs are kept. `route()` requires a value for each variable and throws when one is missing.
- `accepts(model, mime)` checks input MIME types and supports wildcards such as `image/*`.
- Provider modules are generated `as const satisfies Provider`, so model IDs are literal types. Helper parameters accept `TModel | (string & {})`. `/full` widens to `Provider<string>`.
- `route()` returns `{ protocol, baseURL, model }`, structurally compatible with `HttpOptions`.
- Data subpaths depend on no `@xsai/*` package, including types.
- Not kept: custom (freeform) tools, `system_updates`, `effort_updates`, `prompt_cache_key`, `service_tier`, `store`, and `stream_usage`. Add them when xsAI uses them.

### Amendment (2026-11-08)

Add `serviceTiers?: string[]` to `ModelCapabilities`, from v2 `capabilities.service_tier` (values such as `flex`, `priority`, `fast`, `standby`, `ultrafast`).
Reason: 284 models list service tiers, and tier multipliers change prices by up to 2x (OpenAI `gpt-5`: priority 2x, flex 0.5x). It is useful for display. Tier selection in requests moved to `../../text-service-tier/`.

### Amendment 2 (2026-11-08)

Generated provider modules keep no `description`. Runtime data from `/fetch` includes `description` (issue 06: AIRI model pickers render and search it). Issue 04 defines how the runtime model type extends `Model`.

### Amendment 3 (2026-11-08)

Add `defaults?: Partial<Record<Protocol, { baseURL: string }>>` to `Provider`, computed by codegen (issue 03). `route()` uses it for model IDs that are not in the catalog.

### Amendment 4 (2026-11-08)

Add `apiKeyEnv?: string[]` to `Provider`: the variables in `env` that hold an API key. `createProvider` reads them (issue 05 amendment).

### Amendment 5 (2026-11-08): PR review

From review comments on PR #350, implemented in `3f3f1bb5`:

- `ModelCapabilities.supportedParams?: { outputFormat?, temperature?, topK?, topP? }` replaces `structuredOutput`, `temperature`, `topK`, and `topP`. Keys follow xsAI option names (`outputFormat` and `temperature` on `LanguageModelOptions`, `topK` in Chat provider options). An object keeps unknown apart from unsupported; a list would not. LobeHub uses a deny-list (`disabledParams`) for the same problem (Claude Opus 4.7 rejects non-default `temperature` and `top_p`).
- `RouteCapabilities.tools.search?: boolean` keeps models.dev `tools.search` (hosted search), which AIRI's server needs and LobeHub models as `abilities.search`.
- Tool calling was not missing: it is `capabilities.tools.supported` on every model. AIRI learns tool support from failures today and could seed it from this field.
- Reasoning during tool calls: no source models interleaved thinking. The practical need is sending reasoning back on tool-call turns; `@xsai/text-chat` already sends every reasoning part back in the field it arrived in (`reasoning_content` or `reasoning`). `reasoning_details` (92 routes) is not read by the adapter; that is an adapter gap, outside this package.
- Cache: undecided. Floway and LobeHub model cache only through prices (Floway prices 1-hour writes separately); models.dev also has `ttl`, `max_breakpoints`, `min_tokens`, and `targets`.
