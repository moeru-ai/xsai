# Responsibilities for the AIRI migration to xsAI 1.0

This document explains the proposed migration order. The [migration map](map.md) owns the decision index.
The proposals below remain open until their decision tickets resolve.

## The migration boundary

xsAI owns model contracts, wire adapters, normalized events, and tool execution mechanics.
A wire adapter translates one HTTP protocol into xsAI events.
AIRI owns user configuration, provider selection, conversation history, turn lifecycle, and speech playback.
A turn is one application interaction. A round is one model request with its tool executions.

The user permits breaking changes in xsAI before 1.0.
AIRI can change internal behavior, but its UI and user configuration must stay unchanged.
The scope covers the AIRI monorepo, with Stage as the first target.
This effort changes no product code and approves no API design.

## Why a package upgrade is insufficient

AIRI uses xsAI 0.5.1 packages and a patched Responses package.
xsAI beta.3 combines text operations in `@xsai/text` and audio operations in `@xsai/audio`.
The text API takes a `LanguageModel` before request options.
A language model is a function that returns normalized text events.
The result model changes alongside package names.

AIRI already separates application turns from protocol messages in `core-agent`.
Its `provider-inference` package already separates provider definitions from Stage UI.
Extend these boundaries instead of adding another general SDK wrapper.
The [text research](research/text-contract.md) and [provider research](research/provider-boundary.md) hold the source evidence for these differences.

## xsAI changes before API freeze

The first proposed decision concerns message content and replay.
AIRI represents audio input and files with names, URLs, inline data, or provider file identities.
The current shared xsAI content types do not represent all these forms.
Resolve the portable forms and protocol-specific forms before AIRI commits to new projections.
A provider continuation is saved protocol data for the next request.
The [text research](research/text-contract.md) identifies supported media and gaps in each adapter.
Keep application scope checks in AIRI, where provider, endpoint, model, and conversation identities are known.

The second proposed decision concerns tool execution context.
The current xsAI executor gives a tool an abort signal.
AIRI tools can depend on a call identity and prior messages through the old SDK context.
Decide which context xsAI guarantees and which context AIRI supplies through its tool boundary.
Do not preserve the old SDK shape solely to reduce import changes.

The third proposed decision concerns complete results and failures.
A xsAI `step.end` ends one model request. It does not end an AIRI turn.
AIRI must wait for the entire tool loop and its event consumers before it saves a completed turn.
The decision must cover incomplete responses, cancellation, exhausted tool rounds, and failed tools.
AIRI currently rejects incomplete Responses results and unresolved tool calls at its loop limit.
Define the distinction between SDK facts and application success before the cutover.

The fourth proposed decision concerns transport and protocol extensions.
The current custom fetch contract accepts a complete `Request`.
Audit provider request transformations against this contract before removing old fetch wrappers.
Keep protocol fields in wire adapters and product configuration in AIRI.
The [provider research](research/provider-boundary.md) documents the existing boundary and request transformations.
Keep the AIRI provider registry in AIRI. Its use of `@xsai-ext/providers` does not assign that registry to xsAI.

These questions belong to [Which xsAI public contracts must change before 1.0?](issues/04-xsai-public-contract.md).
The acceptance evidence must show request payloads, event order, replay, tool results, and cancellation across the affected adapters.

## AIRI preparation before the dependency upgrade

No separate refactor is required.
The [preparation decision](issues/05-airi-preparation.md) defines the required evidence for user data and behavior.
Make code and data conversions within the migration batch that needs them.
Do not introduce preparatory abstraction layers.

## The proposed cutover order

The two repositories can work in parallel at first.
xsAI settles and implements public contract changes while AIRI records its current data and behavior on 0.5.1.
AIRI starts the dependency cutover after the required xsAI contracts have test evidence.

Stage first needs its generation runtime and provider inference to agree on model creation, event translation, and saved turns.
Audio and local backends need their own contract checks before their consumers move.
A shared package can block several apps, even when only one app is the first release target.
The remaining bots, integrations, plugins, examples, and documentation follow their actual package dependencies.
Telegram needs embedding changes. Discord needs remote transcription changes.
The [consumer inventory](research/audio-and-consumers.md) separates active integrations from dead package declarations.
External releases and AIRI-owned implementations are alternatives for retaining old integration packages.
Removing an active provider is outside this effort because users can depend on that provider.

The final gate covers user-visible behavior as well as compilation.
Existing configuration must select the same provider and model.
Existing history must remain readable and usable for subsequent turns.
The runtime must preserve tool identity, search citations, and provider continuation scope.
Speech must stop when the turn aborts. A new turn must not receive late output from a cancelled turn.

Type checks and mocks alone do not establish provider compatibility.
Use deterministic protocol fixtures first, then run the affected runtime checks for web, desktop, and mobile.
Record which real endpoints and local runtimes the release actually exercises.
Use an application release rollback rather than a hidden permanent compatibility runtime, unless a later decision explicitly selects another policy.

The release and rollback policy remains open in [What evidence permits each AIRI migration batch to ship?](issues/06-cutover-order.md).

## Evidence and limits

The source baseline is xsAI `3cabb2b0` and AIRI `3b0672e36`.
The research reads local source and installed dependency artifacts.
The notes distinguish present contracts, proposed changes, and untested external dependencies.
No product tests or real provider calls establish migration success in this planning session.

The evidence lives in these research notes:

- [Text, messages, and tools](research/text-contract.md).
- [Provider and transport boundaries](research/provider-boundary.md).
- [Audio and the consumer inventory](research/audio-and-consumers.md).
