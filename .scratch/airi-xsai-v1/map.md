# AIRI migration to xsAI 1.0

Labels: wayfinder:map
Status: resolved

## Destination

Define responsibilities, order, dependencies, and acceptance criteria for migrating AIRI to xsAI 1.0.
Cover the whole AIRI monorepo, with Stage as the first implementation target.

## Notes

This effort plans the migration. It does not change product code.
The user permits further public API changes before xsAI 1.0.
Prioritize breaking changes in xsAI. Migrate AIRI directly without preparatory abstraction layers.
Limit AIRI preparation to evidence that user data and behavior survive the upgrade.
Convert stored data automatically without user reconfiguration or history deletion.
Use constructed data and automated tests for acceptance. Do not require an AIRI launch.
AIRI can change internal behavior, but its UI and configuration must stay unchanged.
Preserve active provider capabilities and usable history. Remove only dependencies with proven absence of runtime use.
Read [Responsibilities for the AIRI migration to xsAI 1.0](migration-analysis.md) for source context.
Record facts separately from proposals. A research answer does not approve a design decision.
The initial source revisions are xsAI `3cabb2b0` and AIRI `3b0672e36`.
Open children live in `issues/`. Their `Blocked by` fields define the next available tickets.

## Decisions so far

- [What text, message, and tool contracts block AIRI migration?](issues/01-text-contract.md): Shared media types miss existing AIRI inputs and outputs. Existing raw events and model replacement already support several migration needs.
- [Where must provider and transport responsibilities live?](issues/02-provider-boundary.md): AIRI already owns provider lifecycle and catalog policy. Its transport wrappers need an audit against complete `Request` objects.
- [Which audio and non-Stage consumers need a separate migration path?](issues/03-audio-and-consumers.md): Live transcription differs from file transcription. Stage, Telegram, Discord, and external integrations need distinct checks.
- [Which xsAI public contracts must change before 1.0?](issues/04-xsai-public-contract.md): Select the public API additions and acceptance criteria. Keep scope policy and live transcription in AIRI.
- [Which AIRI preparation changes can ship before the dependency upgrade?](issues/05-airi-preparation.md): Require no separate refactor. Preserve user data and behavior through direct migration.
- [What evidence permits each AIRI migration batch to ship?](issues/06-cutover-order.md): Set the Stage-first order, automatic data conversion, package updates, and automated acceptance tests. Exclude reverse migration.

## Not yet specified

None.

## Out of scope

Implementing the migration, releasing packages, deploying AIRI, and changing AIRI UI or user configuration.
