# Generate per-provider modules and the export map

Parent: ../map.md
Type: task
Labels: needs-triage
Status: open
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
