# Define AIRI acceptance for the 1.0 package

Parent: ../map.md
Type: research
Labels: needs-triage
Status: claimed
Blocked by: 01, 02

## Question

What must the package provide so AIRI can replace `model-bank` enrichment in `provider-inference/src/model-catalog.ts` and drop the 0.x imports (`createOpenAI`, `SpeechProvider`, `TranscriptionProvider` types)?
List AIRI fields (`ModelInfo`, `metadata.abilities`, `pricing`, `maxOutput`) and map each to the new types or mark it as AIRI-owned.
Keep exact-ID enrichment and custom-endpoint isolation.

## Answer

Researched on 2026-11-08 against AIRI `ea7b3fe8a`.

### Where AIRI reads model-bank

1. `packages/provider-inference/src/model-catalog.ts:21-69`: exact-ID enrichment of endpoint discovery. Copies `displayName`, `description`, `contextWindowTokens`, and `metadata: { abilities, maxOutput, pricing, settings }`. Only applies when the configured endpoint equals the official base URL.
2. `packages/provider-inference/src/providers/cloud/openai/index.ts:69-80`: checks `settings.extendParams` and `MODEL_REASONING_PARAM_LEVELS` to decide whether a model accepts reasoning effort `none` or `medium`.
3. `packages/provider-inference/src/providers/cloud/openrouter-ai/index.ts:77-79`: passes OpenRouter chat models to the enrichment above.
4. `server/apps/api/src/services/adapters/llm/responses.ts:9,64`: builds a set of OpenAI models with `abilities.search` to decide whether to map hosted web search.

### Downstream reads of the enriched fields

- `metadata.abilities.vision`: `stage-ui/src/composables/vision/use-chat-vision.ts:24`, `stage-ui/src/stores/chat.ts:1355`.
- `description`: rendered and searched by `stage-ui/src/components/menu/radio-card-many-select.vue:10,87` in the model pickers.
- `contextLength`: stored by `stage-ui/src/stores/providers/provider.ts:690,868`.
- `metadata.pricing`, `metadata.maxOutput`: no reader found. `attributes.ts:122` `pricing` is a provider-level paid/free tag, not model pricing.
- `reasoning.mandatory`: comes from endpoint discovery, not model-bank (`stage-ui/src/stores/modules/consciousness.ts:42,134`).

### Field mapping

| AIRI field | New package | Status |
| --- | --- | --- |
| `name` | `model.name` | Covered |
| `contextLength` | `model.limit.context` | Covered |
| `metadata.maxOutput` | `model.limit.output` | Covered |
| `metadata.pricing` | `model.cost` | Covered, no current reader |
| `metadata.abilities.vision` | `accepts(model, 'image/*')` | Covered |
| OpenAI reasoning effort support | `model.capabilities.reasoning.efforts` | Covered |
| `inputModalities` | `model.modalities.input` (MIME) | AIRI maps MIME to its kinds |
| `description` | Dropped by issue 01 | Gap |
| `abilities.search` (server) | No v2 capability. v2 only has a `cost.web_search` price | Gap |
| `reasoning.mandatory` | Endpoint data | AIRI-owned |
| availability, default model, official catalogs, Azure deployments | Not in scope | AIRI-owned |

### Provider IDs

AIRI IDs differ from models.dev IDs (`openrouter-ai` → `openrouter`, `google-generative-ai` → `google`, `moonshot-ai` → `moonshotai`, `together-ai` → `togetherai`). Some AIRI providers are absent from v2 (`ollama`, `featherless-ai`, `comet-api`, `runcrate`). AIRI owns the ID mapping. Enrichment today only uses `openai` and `openrouter` (617 v2 models), so AIRI imports two provider subpaths.

### 0.x imports

- `createOpenAI` from `@xsai-ext/providers/create`: `stage-ui/src/libs/providers/providers/official/shared.ts`, `local-audio/index.ts`, `nvidia/index.ts`.
- `SpeechProvider`, `TranscriptionProvider`, `*WithExtraOptions`, `createChatProvider` from `@xsai-ext/providers/utils`: about 30 files in `stage-ui`, `stage-pages`, `stage-web`, and `stage-pocket`.

These are request-option builders and provider types. xsAI 1.0 replaces them with adapter factories (`chat`, `speech`, `transcriptions`) and their model types. They are part of the AIRI migration map, not this package.

### Acceptance

- AIRI can drop `model-bank` from `provider-inference` and `server/apps/api` with no lost reader, once the two gaps are decided.
- Enrichment stays exact-ID and official-endpoint-only, with one discovery request.
- AIRI imports only the provider subpaths it enriches, not `/full`.
- No AIRI file imports `@xsai-ext/providers/create` or `@xsai-ext/providers/utils`.
