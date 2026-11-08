# Generate per-provider modules and the export map

Parent: ../map.md
Type: task
Labels: needs-triage
Status: resolved
Blocked by: 01

## Scope

Write the sync script that reads models.dev v2, normalizes it, applies local corrections and extra providers, and writes `src/providers/<id>.ts` plus `src/full.ts`.
Export providers through one `"./*"` pattern in `package.json` and `publishConfig`, built by pkgroll.
Fail on reserved-subpath collisions. Give `302ai` and similar IDs valid export names.
Decide how corrections and extra providers (Ollama, LiteLLM, Qianfan, Hunyuan) are authored.

## Acceptance

- Importing one provider subpath bundles only that provider's data.
- The root entry contains no provider data.
- Exact subpaths win over the provider pattern in Node and TypeScript resolution.

## Comments

2026-11-08 decisions:

- Corrections live in `scripts/overrides.ts` as `Record<providerId, DeepPartial<Provider>>`, deep-merged after normalization. Each entry has a comment with its reason. Prefer upstream models.dev fixes.
- Extra providers live in `scripts/extra.ts` as complete normalized `Provider` objects. Include only `ollama` (`http://localhost:11434/v1/`) and `litellm` (`http://localhost:4000/v1/`). Send other missing providers (Qianfan, Tencent Hunyuan) upstream.
- Overrides and extras pass the same checks as generated data: reserved subpaths and no ID clash with v2.
- Codegen computes `Provider.defaults?: Partial<Record<Protocol, { baseURL: string }>>`. A protocol gets a default only when all of the provider's models share one base URL for it. Extras usually have `defaults` and no models.
- Keep route `path` from v2 and strip its leading `/`, because `HttpOptions.path` follows standard URL rules (issue 09).

## Answer

Implemented on 2026-11-08 in `e5d6d3b0` on this branch. The package lives at `packages-ext/providers`, which the pkg-pr-new workflow already publishes.

- `src/normalize.ts` decodes models.dev v2 into the issue 01 types. `strict` throws on the first invalid entry; otherwise invalid models and routes are skipped (issue 04). `description` keeps model descriptions for runtime use.
- `scripts/sync.ts` (`pnpm sync`, or `pnpm sync <file>` for a local catalog) runs `buildProviders` in `scripts/codegen.ts`: strict normalization, overrides, extras, then ID checks. It writes `src/providers/<id>.ts` and `src/full.ts`.
- Each module is `export const <name>: Provider<'id1' | 'id2'> = {...}` with a type-only import. An explicit annotation replaces `as const satisfies Provider`: model IDs stay literal, the arrays stay `string[]`, and each `.d.ts` stays one line.
- Export names are camelCase; an ID that starts with a digit gets `_` (`302ai` → `_302ai`, `wafer.ai` → `waferAi`). `/full` exports `providers: Record<string, Provider>`, keyed by provider ID.
- Codegen fails on a reserved subpath, an ID that is not a valid subpath, a shared export name, an extra provider that clashes with models.dev, or an override for an unknown provider.
- `Override` is `DeepPartial<Provider>` without `defaults`, plus `defaults`. Fields deep-merge, arrays replace, and override `defaults` replace computed ones per protocol. `scripts/overrides.ts` starts empty.
- `defaults[protocol]` is set only when every route for that protocol shares one base URL and has no `path`.
- Prices with a `unit` (speech `character`) are dropped. `cacheWrite` takes the first TTL price.
- Generated modules keep each model on one line: 6.2 MB of source for 235 providers and 9144 models. `.gitattributes` marks them generated.

The root entry has types only. `route()` and `accepts()` are left to issue 05.

Amended by issue 05 amendment 2: the data modules moved to `src/models/<id>.ts` (`/models/*`); `src/providers/<id>.ts` now holds client modules with routes only.

Amendment 2026-11-08 (PR #350 review, generated data size):

- Generated data leaves out models with no route, after corrections: 273 models served only through APIs that xsAI has no package for, mainly `converse` (154 Bedrock models) and `workers-ai-run` (71 Cloudflare models), plus `generate-content`, `realtime`, `interactions`, and others (48). `/fetch` still returns them, with empty `routes`. AIRI does not read this metadata: its Bedrock provider lists models from the AWS API and calls Converse through its own `fetch`, its Workers AI provider uses the OpenAI-compatible endpoints, and its code names none of the other 48 models.
- `renderModels` stores `capabilities`, `cost`, `limit`, `modalities`, and `routes` values that repeat within a provider as constants. Types do not change. Constants are per file, so importing one provider does not load another provider's data. One shared module was larger in total and added 174 KB to every import.
- Constants are numbered in order of first use. Content-hash names keep other models' lines stable, but made the tarball 9% larger than before deduplication, so we accept renumbering in sync diffs.
- Models stay when `deprecated` or old. The `deprecated` flag includes models in use (`whisper-1`, `tts-1`), and models.dev has no usage data.
- Result: JS in `dist` went from 6.98 MB to 3.86 MB; the largest model module from 473 KB to 189 KB. The gzipped `dist` went from 555 KB to 541 KB, because gzip already removed most repetition.
- `renderObject` now uses a replacer function. A string replacement turned `$$` in model names into `$`.

Validation:

- Acceptance, checked against a packed tarball: importing `/deepseek` bundles 5.8 KB with only DeepSeek models (rolldown). `dist/index.js` is empty. Node and TypeScript (`nodenext`) resolve `/full` to `dist/full.*` and `/wafer.ai` through the pattern.
- `vitest run`: 57 files, 459 tests. New tests cover normalization and codegen.
- `pnpm typecheck` (about 5 s with generated modules).
- ESLint: no errors. Generated files are ignored.
