# Which audio and non-Stage consumers need a separate migration path?

Parent: ../map.md
Type: research
Labels: wayfinder:research, ready-for-agent
Status: resolved
Assignee: ecosystem_research
Blocked by: none

## Question

Inventory AIRI xsAI consumers across all tracked workspaces. Compare audio, embedding, local model, bot, integration, and plugin contracts with xsAI beta.3. Identify external blockers and a Stage-first boundary. Cite local primary sources.

## Answer

The full inventory and migration proposal is in [Audio and consumer migration research](../research/audio-and-consumers.md).

The key boundary is the new function-model API. `@xsai/audio` uses `SpeechModel` and `TranscriptionModel` functions, `signal`, `audio`, and nested provider options. Speech collection returns a `Blob`. Transcription segments use `providerMetadata.transcriptions`. `@xsai/embed` and `@xsai/model` separate model construction from calls. AIRI still uses the old one-object calls from `@xsai/generate-speech`, `@xsai/generate-transcription`, `@xsai/embed`, and `@xsai/model`.

Stage must migrate first through one AIRI adapter layer. The adapter must preserve provider IDs, configuration, settings pages, audio playback, confidence filtering, model catalogs, and live replacement snapshots. Apple Speech and Sherpaw need their own live stream boundary because beta.3 accepts a `Blob` and does not expose AIRI's PCM stream and snapshot contract. Telegram owns the active embedding migration. Discord owns one remote transcription migration. Minecraft, Satori, and the chess plugin use text only. The AIRI server's `unspeech` routes remain separate.

Retaining some current integration packages requires new package contracts or AIRI-owned implementations. `@xsai-apple-speech/transcription@0.1.3` peers on `@xsai/generate-transcription <0.6.0`. `@xsai-transformers/*`, `@xsai-ext/providers`, and `@sherpaw/xsai-transcription` still use old xsAI contracts. Compatible releases and AIRI-owned implementations are alternatives. Dead Transformers declarations can be removed after the source audit.
