# Generate per-provider modules and the export map

Parent: ../map.md
Type: task
Labels: needs-triage
Status: claimed
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
