# Where must provider and transport responsibilities live?

Parent: ../map.md
Type: research
Labels: wayfinder:research, ready-for-agent
Status: resolved
Assignee: provider_research
Blocked by: none

## Question

Compare xsAI wire adapters and HTTP configuration with AIRI provider creation, endpoint selection, model catalog, authentication, custom fetch, and request mutation. Identify safe preparation and unresolved public contracts. Cite local primary sources.

## Answer

Keep the provider boundary in AIRI. xsAI 1.0 provides protocol adapters, a complete-request fetch seam, and generic model discovery. AIRI keeps provider lifecycle, saved configuration, authentication, model metadata, availability, and provider-specific request transforms.

The migration seam is a per-provider `LanguageModel` factory. AIRI replaces mutable old request objects and old fetch callbacks with xsAI 1.0 language models and `(request: Request) => Promise<Response>` callbacks. The full evidence, gaps, breaking-change recommendations, AIRI preparation, and acceptance criteria are in [provider boundary findings](../research/provider-boundary.md).
