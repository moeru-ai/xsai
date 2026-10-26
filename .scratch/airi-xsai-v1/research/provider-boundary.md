# Provider boundary findings

> `streamText` returns a stream that advances as AIRI reads it. AIRI must pass events through its async handlers before `collect` consumes them. AIRI must await `collect(...)` before it persists a turn. See [Stream text](../../../docs/text/streaming.md).

This note compares xsAI `1.0.0-beta.3` at `3cabb2b0` with AIRI `0.12.0` at `3b0672e36`. It covers text transport, model discovery, authentication, custom fetch functions, and request changes.

## Supported xsAI facts

### One language model owns one wire request

`LanguageModel` is a function that accepts `LanguageModelOptions` and returns a `ReadableStream<TextEvent>`. A text adapter captures its HTTP options when the factory runs. The loop can replace the language model for a later step through `prepareStep`, and it can replace the input and all language model options except the signal. See [packages/text/src/types/language-model.ts:8-27](../../../packages/text/src/types/language-model.ts#L8-L27) and [packages/text/src/types/prepare-step.ts:7-17](../../../packages/text/src/types/prepare-step.ts#L7-L17).

The three text adapters choose paths by wire protocol. `chat()` sends to `chat/completions`, `responses()` sends to `responses`, and `messages()` sends to `messages`. The adapter maps shared options and its own `providerOptions` namespace into the request body. See [packages/text-chat/src/index.ts:24-48](../../../packages/text-chat/src/index.ts#L24-L48), [packages/text-responses/src/index.ts:25-50](../../../packages/text-responses/src/index.ts#L25-L50), and [packages/text-messages/src/index.ts:27-66](../../../packages/text-messages/src/index.ts#L27-L66).

### HTTP configuration is small and static

`HttpOptions` requires `baseURL` and `model`. It accepts an optional `apiKey`, headers, and a custom fetch function with the shape `(request: Request) => Promise<Response>`. See [packages/shared/src/types/http-options.ts:1-8](../../../packages/shared/src/types/http-options.ts#L1-L8).

`sendRequest` resolves the adapter path against `baseURL`, sets a bearer `Authorization` header when `apiKey` is present, sets JSON content type for object bodies, forwards the abort signal, and calls the custom fetch function with the complete `Request`. It wraps HTTP, empty-body, network, and abort failures in xsAI errors. See [packages/shared/src/utils/send-request.ts:13-53](../../../packages/shared/src/utils/send-request.ts#L13-L53).

Messages replaces bearer authentication with `x-api-key` and always adds the Anthropic version and JSON headers. See [packages/text-messages/src/index.ts:56-66](../../../packages/text-messages/src/index.ts#L56-L66).

### Model discovery is a separate generic model

`ModelCatalog` has `list(options?)` and `retrieve(options & { id })`. The OpenAI-shaped `models(options)` factory uses the same `HttpOptions` fields except `model`, then requests `models` or `models/<id>`. See [packages/model/src/model.ts:3-18](../../../packages/model/src/model.ts#L3-L18) and [packages/model/src/model-models.ts:16-35](../../../packages/model/src/model-models.ts#L16-L35).

xsAI does not own provider lifecycle, saved configuration, authentication sessions, model display metadata, or model availability state. A custom model can implement any catalog or transport contract. See [docs/advanced/custom-models.md:5-20](../../../docs/advanced/custom-models.md#L5-L20).

## Supported AIRI facts

### Provider definitions own lifecycle and protocol policy

`ProviderDefinition` owns configuration schema creation, provider instance creation, optional model and voice discovery, validation, and capability metadata. `InferenceServiceProvider` stores a provider instance ID, definition ID, provider configuration, validation status, and configuration owner. See [packages/provider-inference/src/types.ts:101-117](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/types.ts#L101-L117) and [packages/provider-inference/src/types.ts:265-337](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/types.ts#L265-L337).

AIRI's generation boundary exposes a `GenerationProvider`. Its `generation(model, options)` method returns a discriminated request with either Chat Completions or Responses configuration. `getGenerationProvider` adapts an old Chat provider into this boundary, and `withReasoning` applies one AIRI reasoning choice to each request. See [packages/provider-inference/src/types.ts:19-68](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/types.ts#L19-L68).

OpenAI and OpenAI Compatible provider definitions keep an `api` configuration field. OpenAI defaults to Responses, while the compatible definition defaults to Chat Completions. The selected value chooses which old SDK request factory AIRI returns. See [packages/provider-inference/src/providers/cloud/openai/index.ts:14-23](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/providers/cloud/openai/index.ts#L14-L23), [packages/provider-inference/src/providers/cloud/openai/index.ts:63-103](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/providers/cloud/openai/index.ts#L63-L103), and [packages/provider-inference/src/providers/cloud/openai-compatible/index.ts:11-20](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/providers/cloud/openai-compatible/index.ts#L11-L20), [packages/provider-inference/src/providers/cloud/openai-compatible/index.ts:54-68](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/providers/cloud/openai-compatible/index.ts#L54-L68).

The provider store caches executable instances by a JSON configuration key. It disposes an old instance when the key changes and keeps persisted provider data in the configuration store. See [packages/stage-ui/src/stores/providers/provider.ts:84-94](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/stores/providers/provider.ts#L84-L94) and [packages/stage-ui/src/stores/providers/provider.ts:915-976](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/stores/providers/provider.ts#L915-L976).

### AIRI has a richer model catalog contract

`ProviderModelCatalog` contains normalized models, optional server availability, the last known availability, and a server-selected default model. `ModelInfo` adds provider ID, display fields, input modalities, context length, deprecation, reasoning, and model-bank metadata. See [packages/provider-inference/src/types.ts:145-175](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/types.ts#L145-L175) and [packages/provider-inference/src/types.ts:227-246](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/types.ts#L227-L246).

The provider store creates a temporary provider, then chooses a provider-defined catalog, a provider-defined model list, a model provider, or a generic `/models` request. It normalizes and de-duplicates the result, stores the default model and status, and retains the last known availability on failure. See [packages/stage-ui/src/stores/providers/provider.ts:562-627](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/stores/providers/provider.ts#L562-L627) and [packages/stage-ui/src/stores/providers/provider.ts:731-808](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/stores/providers/provider.ts#L731-L808).

AIRI enriches exact IDs from the configured endpoint with a local model-bank catalog. It performs one endpoint request. It does not apply official metadata to a custom endpoint. See [packages/provider-inference/src/model-catalog.ts:21-69](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/model-catalog.ts#L21-L69) and [packages/provider-inference/src/model-catalog.test.ts:23-47](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/model-catalog.test.ts#L23-L47).

Official providers use authenticated AIRI server catalog endpoints and can return a server default model. Azure returns configured deployment names instead of querying a general model list. These are provider policies, not generic OpenAI model behavior. See [packages/stage-ui/src/libs/providers/providers/official/index.ts:31-55](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/libs/providers/providers/official/index.ts#L31-L55), [packages/stage-ui/src/libs/providers/providers/official/index.ts:143-163](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/libs/providers/providers/official/index.ts#L143-L163), and [packages/provider-inference/src/providers/cloud/azure-openai/index.ts:199-217](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/providers/cloud/azure-openai/index.ts#L199-L217).

### Authentication belongs to AIRI

Official providers declare `requiresCredentials: false` and `configuredBy: 'authentication'`. Their request fetch function reads the current AIRI token at request time, adds the bearer token and chat session header, omits browser credentials, and calls the global fetch function. See [packages/stage-ui/src/libs/providers/providers/official/shared.ts:11-33](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/libs/providers/providers/official/shared.ts#L11-L33) and [packages/stage-ui/src/libs/providers/providers/official/index.ts:58-101](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/libs/providers/providers/official/index.ts#L58-L101).

User provider configuration remains in local storage under stable provider records. AIRI imports the older credential shape, keeps provider IDs, and mirrors configured user records to the cloud. The sync payload contains `definitionId` and `config`. Validation status is local. See [packages/stage-ui/src/stores/providers/config.ts:42-54](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/stores/providers/config.ts#L42-L54), [packages/stage-ui/src/stores/providers/config.ts:74-113](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/stores/providers/config.ts#L74-L113), and [packages/stage-ui/src/stores/providers/config.ts:404-435](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/stores/providers/config.ts#L404-L435).

### AIRI uses custom fetch for provider policy and wire changes

OpenRouter adds attribution headers in a provider-specific fetch wrapper. Azure rewrites Chat Completions URLs, authentication headers, and request bodies in a fetch wrapper. MiMo converts an OpenAI-shaped audio request into a different JSON request. See [packages/provider-inference/src/providers/cloud/openrouter-ai/index.ts:53-80](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/providers/cloud/openrouter-ai/index.ts#L53-L80), [packages/provider-inference/src/providers/cloud/azure-openai/index.ts:139-196](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/providers/cloud/azure-openai/index.ts#L139-L196), and [packages/provider-inference/src/providers/cloud/mimo-audio/index.ts:56-137](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/providers/cloud/mimo-audio/index.ts#L56-L137).

The current AIRI wrappers use the old `(RequestInfo | URL, RequestInit?)` callback shape. For example, the official wrapper reads `init.headers`, Azure constructs a new request from `input` and `init`, and OpenRouter passes both values to `globalThis.fetch`. See [packages/stage-ui/src/libs/providers/providers/official/shared.ts:11-33](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/stage-ui/src/libs/providers/providers/official/shared.ts#L11-L33), [packages/provider-inference/src/providers/cloud/azure-openai/index.ts:153-196](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/providers/cloud/azure-openai/index.ts#L153-L196), and [packages/provider-inference/src/providers/cloud/openrouter-ai/index.ts:58-65](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/provider-inference/src/providers/cloud/openrouter-ai/index.ts#L58-L65).

### AIRI mutates one request object while a turn changes providers

The core-agent Chat and Responses adapters build one old SDK request object. During `prepareStep`, they replace fields such as `apiKey`, `fetch`, headers, token limits, model, tools, and reasoning, then update the projected input. See [packages/core-agent/src/runtime/chat-completions.ts:38-109](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/core-agent/src/runtime/chat-completions.ts#L38-L109) and [packages/core-agent/src/runtime/responses.ts:186-249](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/core-agent/src/runtime/responses.ts#L186-L249).

`replaceProviderConfig` deletes keys that a later request does not define, and `mergeRequestHeaders` applies per-send headers over provider headers. The continuation scope includes provider ID, endpoint, model, and conversation, while credentials and headers stay outside the scope. See [packages/core-agent/src/runtime/request-context.ts:8-16](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/core-agent/src/runtime/request-context.ts#L8-L16), [packages/core-agent/src/runtime/request-context.ts:33-49](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/core-agent/src/runtime/request-context.ts#L33-L49), and [packages/core-agent/README.md:49-65](https://github.com/moeru-ai/airi/blob/3b0672e3668bd1ade1210e579818f379e4f8a224/packages/core-agent/README.md#L49-L65).

## Confirmed gaps

1. AIRI's old request objects are not xsAI 1.0 language models. AIRI must create a `LanguageModel` per protocol, endpoint, and model. A mutable request object cannot be passed to `generateText`, `streamText`, or `loop`.

2. AIRI's old fetch boundary uses `(RequestInfo | URL, RequestInit?)`, while xsAI 1.0 passes one complete `Request`. A wrapper that already handles a `Request` can use it. A wrapper that reads `init` or rebuilds the request from two arguments needs an adapter. Every path preserves the signal and returns a `Response`.

3. AIRI's `ProviderModelCatalog` is richer than xsAI's generic `ModelCatalogEntry`. AIRI must keep catalog metadata, default model state, availability state, static model lists, and official server catalogs in the provider layer.

4. AIRI's dynamic authentication is outside `HttpOptions`. A static `apiKey` cannot model logout, token renewal, official provider sessions, or chat session headers. AIRI must inject those values through a request fetch function or a provider-owned model wrapper.

5. AIRI's `ChatRequestOptions.reasoning` does not map directly to xsAI's `reasoningEffort`. AIRI must decide whether each provider maps `enabled` and `disabled` to a shared effort value, a wire-specific `providerOptions` value, or no option when the exact model does not support it.

6. AIRI has provider-specific body transforms that are absent from the shared xsAI provider options. NVIDIA uses a provider-specific Chat field. Azure rewrites the full request. These transforms must stay in AIRI or become explicit custom models. They must not enter the shared adapter contract.

7. AIRI core-agent currently consumes old shared messages, completion steps, and stream events. Provider-boundary migration alone does not migrate those types. The text runtime needs a separate event and result migration after the provider factory seam is fixed.

8. AIRI currently supports Chat Completions and Responses in its generation contract. xsAI also has an Anthropic Messages adapter, but no AIRI generation policy selects it. Adding Messages is a separate product decision.

## xsAI 1.0 contracts to keep

The comparison supports these existing beta.3 contracts for 1.0:

1. `LanguageModel` remains the text execution seam. Adapter factories remain protocol-specific. Provider lifecycle stays outside xsAI.

2. The fetch callback receives one complete `Request` and returns a `Response`. `prepareStep` remains the way to replace the model during a loop. `LanguageModelOptions` does not gain mutable HTTP fields.

3. `@xsai/model` remains generic. AIRI maps its entries into `ModelInfo` and keeps availability, default model, and model-bank data in AIRI.

4. Adapter-specific fields stay under `providerOptions`. Provider body rewrites stay in a custom fetch function or a custom language model.

## Proposed xsAI 1.0 public changes

1. Export a named fetch type, for example `type Fetch = (request: Request) => Promise<Response>`. This is additive. It gives AIRI and other integrations one type for request wrappers.

2. Make the complete `Request` callback the only 1.0 `HttpOptions.fetch` contract. This breaks 0.5.1 callers that rely on `(input, init)`. The beta.3 source already uses the new form, so the 1.0 work freezes and documents this boundary.

3. Freeze the adapter paths, `providerOptions` namespaces, and `prepareStep` model replacement behavior before the 1.0 release. A later change to these names or semantics becomes a public breaking change.

## Documentation and contract clarifications

1. Document fetch-wrapper rules. A wrapper keeps the URL, body, headers, and abort signal unless it owns that transform. It returns the underlying `Response` or a documented replacement.

2. Document header precedence. The current `sendRequest` code replaces its default header object with a send-level header object. AIRI needs this rule for authentication and per-send session headers.

3. Document the boundary between `@xsai/model` and AIRI catalog state. xsAI returns generic endpoint data. AIRI owns provider metadata, defaults, availability, and model-bank enrichment.

4. Document dynamic authentication as a caller concern. AIRI injects rotating tokens and session headers through its request wrapper. xsAI does not store those session values in model catalog entries.

This comparison does not show a need for another xsAI breaking API change. It shows a need to freeze the current boundary, add the named fetch type, and publish these rules before 1.0.

## AIRI preparation that does not change user behavior

### Safe work with the current 0.5.1 integration

1. Keep the stored fields `api`, `apiKey`, and `baseUrl`, provider IDs, local storage keys, model IDs, and settings routes unchanged.

2. Add one internal request-normalization utility at the provider boundary. Inside the existing two-argument fetch callback, it can create `new Request(input, init)`, apply provider transforms, and call the underlying fetch. A callback that already accepts a `Request` can use that object when its type and runtime code support it. Change wrappers that read `init` or rebuild the request.

3. Keep provider policy in provider definitions. Keep the official token and session-header logic in AIRI. Keep OpenRouter attribution, Azure endpoint and body mapping, and other provider-specific transforms in those definitions.

4. Isolate old xsAI 0.5.1 request, message, and stream types behind one AIRI adapter. Keep provider configuration and model catalog types independent from those SDK types.

5. Add request fixtures before the package upgrade. Cover URL, protocol, headers, body, abort signal, model catalog results, and selected defaults for OpenAI, OpenAI Compatible, OpenRouter, Official, Azure, NVIDIA, and one custom endpoint.

6. Keep `ProviderModelCatalog`, normalization, provider instance caching, disposal, authentication ownership, and cloud configuration sync in AIRI.

### Cutover that depends on xsAI 1.0

1. Add one AIRI factory that maps a provider configuration to an xsAI 1.0 `LanguageModel`. Select `chat()` or `responses()` from the existing `api` field. Pass endpoint and model through `HttpOptions`. Put reasoning and wire-specific controls in language model options or `providerOptions`.

2. Change `GenerationProvider` to return a language model plus protocol metadata, or a factory for the selected model. Keep capability checks and protocol defaults in `@proj-airi/provider-inference`.

3. Adapt each provider fetch wrapper to the complete `Request` callback. Keep rotating authentication in AIRI and preserve the provider transforms from the 0.5.1 fixtures.

4. Replace mutable `requestOptions` updates in core-agent with `prepareStep` model replacement. Keep the continuation scope and request-switch behavior. A provider or protocol change projects the stored round instead of replaying native continuation data through another wire.

5. Use xsAI `models({ baseURL, apiKey, headers, fetch })` for ordinary OpenAI-shaped discovery. Use provider-owned catalog functions for official endpoints, Azure deployments, static audio catalogs, and model-bank enrichment.

## Acceptance criteria

### Safe preparation checks

- Existing provider IDs, local storage keys, provider fields, selected models, settings routes, and UI behavior remain unchanged.
- Existing 0.5.1 providers produce the same URL, headers, body, abort behavior, model catalog result, and selected default in the new fixtures.
- Each normalized request preserves the original signal and provider-specific transforms.

### xsAI 1.0 cutover checks

- Official requests use the current AIRI token and chat session header after token renewal, logout, and login.
- OpenAI and OpenAI Compatible requests select the same protocol and endpoint from the saved `api` value.
- OpenRouter keeps attribution headers. Azure keeps deployment URL, API version, API key, body mapping, and tool-schema mapping. Other custom fetch transforms keep their current wire behavior.
- Each xsAI fetch test receives one complete `Request`, preserves the abort signal, and returns the expected `Response`.
- Model discovery keeps one endpoint request, exact-ID model-bank enrichment, custom-endpoint isolation, provider-defined defaults, static catalogs, availability state, and last-known availability.
- A model or provider change creates a new language model for the next step. No old request object keeps stale `apiKey`, `fetch`, headers, tools, or reasoning fields.
- AIRI's migrated text runtime no longer imports old `@xsai/generate-text`, `@xsai/stream-text`, `@xsai/shared-chat`, or `@xsai-ext/responses` contracts.
