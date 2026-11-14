# Add runtime catalog fetch with snapshot fallback

Parent: ../map.md
Type: grilling
Labels: wayfinder:grilling
Status: resolved
Blocked by: 01

## Question

What does `/fetch` return, from which URL, with which cache and fallback?
Decide whether the bundled snapshot is the generated data or a separate trimmed file, how large it may be for browser callers, whether the source URL and fetch function are configurable, and how decode failures fall back.

## Comments

2026-11-08: Runtime data includes `description`, which generated modules omit (issue 06). Decide how the runtime model type extends `Model`.

## Answer

Resolved on 2026-11-08.

Facts checked that day: models.dev sends `access-control-allow-origin: *`, an `ETag`, and `cache-control: public, max-age=0, must-revalidate`. The full v2 catalog is about 10.4 MB, 766 KB gzipped. The `type` filter for our six types saves about 2%. There is no provider filter.

- Default URL: `https://models.dev/experimental/v2.0/api.json?type=chat,decision,embedding,image,speech,transcription`. Options `url` and `fetch` override it.
- Result: `Record<string, RuntimeProvider>`, where `RuntimeModel = Model & { description?: string }`. Runtime and codegen share one normalization module, so the only difference is `description`.
- No bundled snapshot. On failure `/fetch` throws. The caller picks a fallback: imported provider subpaths, `/full`, or its own stored copy. This replaces the earlier "bundled snapshot fallback" decision.
- No persistent cache in the package. The caller passes a previous `etag`; the result is `{ notModified: true }` or `{ etag, providers }`. Results are plain JSON.
- Lenient decoding at runtime: invalid models or routes are skipped. Throw only when the top level is not an object or no provider survives. No issue callback.
- Codegen decodes strictly and fails on any invalid entry.
