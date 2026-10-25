# Responsibilities for the AIRI migration to xsAI 1.0

The [AIRI migration to xsAI 1.0](map.md) map links the approved decisions.
Its resolved tickets define contracts, responsibilities, migration order, and acceptance criteria.
They replace the earlier proposals in this document and the research notes.

The source baseline is xsAI `3cabb2b0` and AIRI `3b0672e36`.
AIRI uses xsAI 0.5.1 and a patched Responses package at that baseline.
The research notes record the source evidence:

- [Text contract research](research/text-contract.md) covers messages, tools, events, cancellation, and history.
- [Provider boundary findings](research/provider-boundary.md) covers provider configuration, authentication, requests, and model catalogs.
- [Audio and consumer migration research](research/audio-and-consumers.md) covers audio, local providers, bots, and package dependencies.
