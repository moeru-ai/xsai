---
name: xsai-audio
description: Generate speech or transcribe audio with xsAI, including streamed speech, transcript events, timestamps, and speech or transcription adapter options.
---

# xsAI audio

Read https://xsai.js.org/audio.md before you write code. It covers speech, transcription, and the option tables.

Write code in this shape:

1. Install `@xsai/audio`.
2. Create a model with `speech()`, `transcriptions()`, or `transcriptionsNonStreaming()`.
3. Pass the model first and the options second: `generateSpeech(model, { input, voice })`, `generateTranscription(model, { audio })`.
4. Use `transcriptionsNonStreaming()` for services without server-sent events.
5. Take `baseURL`, model IDs, and voice IDs from the user or the project. Ask when they are unknown.
6. Handle failures with the types in https://xsai.js.org/shared.md.

Done when the code type-checks against the installed `@xsai/audio`.
