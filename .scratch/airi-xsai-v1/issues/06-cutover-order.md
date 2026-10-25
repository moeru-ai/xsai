# What evidence permits each AIRI migration batch to ship?

Parent: ../map.md
Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: Codex
Blocked by: 04, 05

## Question

What migration order and test evidence preserve AIRI user data and behavior?

## Answer

[Which xsAI public contracts must change before 1.0?](04-xsai-public-contract.md) defines the SDK changes.
[Which AIRI preparation changes can ship before the dependency upgrade?](05-airi-preparation.md) defines AIRI preparation.
Use constructed data and automated tests for acceptance.
Do not require an AIRI launch, manual platform tests, or live provider calls.

### Order and owners

Each row defines a reviewable batch:

| Order | Owner | Work and release condition |
| --- | --- | --- |
| 1 | xsAI package owners | Implement the selected public changes. Pass the contract cases in the public-contract decision. |
| 2 | Apple Speech and Sherpaw package owners | Update the existing packages for the selected contracts. Preserve native events, replacement text, cancellation, and resource disposal through tests. This gates Stage, not core xsAI 1.0. |
| 3 | AIRI core-agent, provider-inference, and Stage owners | Upgrade generation and provider calls. Convert stored data automatically. Pass data, request, event, and tool tests. |
| 4 | AIRI speech, hearing, and Stage app owners | Upgrade file audio and integrate the updated live packages. Pass audio tests and builds for affected web, desktop, and mobile apps. Release Stage after both Stage batches pass. |
| 5 | Other AIRI consumer owners | Migrate Telegram embeddings, Discord transcription, and the remaining text consumers. Pass the affected package tests and builds. |

If a shared change affects another consumer, update that consumer in the same batch.
Each batch includes its dependency declarations and lockfile changes.

### Dependencies

Use the following package actions:

- Update the existing Apple Speech packages, including their native and Electron packages.
- Update `@sherpaw/xsai-transcription`. Keep its implementation in its own package.
- Replace old `@xsai-ext/providers` factory calls with calls that use the 1.0 contracts. Keep AIRI provider configuration and lifecycle.
- Remove unused Transformers runtime declarations after a source search. Keep required type dependencies until their callers change.
- Preserve active local providers and server integrations. Do not remove a capability to complete the dependency upgrade.

### Data and recovery

Convert stored configuration and history automatically to the selected format.
Users must not clear history or enter configuration again.
Preserve provider and model selection, message identities, media references, and usable history.

Keep the original records if conversion fails.
A retry must not duplicate records or apply a conversion twice.
Do not add reverse migration or a permanent runtime for the old SDK.
After a successful migration, resolve problems through a repair release.

### Acceptance

Construct data for these automated tests:

1. Convert saved configuration and histories with text, reasoning, tool calls, media, and native provider data.
2. Load the converted records and build a subsequent request. Preserve conversation scope, message order, and media references.
3. Repeat conversion and simulate interruption or write failure. Preserve records and prevent duplicates.
4. Preserve local data and cloud synchronization, including pending messages and deletion records.
5. Compare provider requests for protocol selection, authentication, session headers, Azure changes, and custom endpoints.
6. Feed protocol events through the adapters. Preserve tools, search, citations, completion, cancellation, and interrupted replies.
7. Feed audio bytes and transcription events through the affected modules. Preserve confidence filtering, replacement text, and resource disposal.
8. Run tests and type checks for affected packages and consumers. Build affected Stage apps to catch native and platform integration errors.

After all consumers migrate, remove old SDK entry points and the Responses patch.
Use the [consumer inventory](../research/audio-and-consumers.md) to include bots, plugins, examples, and other affected packages.
