---
name: xsai-audio
description: Generate or stream speech and transcribe recordings with xsAI's audio package.
---

# xsAI audio

Read https://xsai.js.org/audio.md. Make sure that the API matches the installed xsAI version.

- Use `@xsai/audio` or the existing `xsai` package with the project's endpoint, model, and voice configuration.
- Create a model with `speech()`, `transcriptions()`, or `transcriptionsNonStreaming()`. Operations take the model first: `generateSpeech(model, { input, voice })`, `generateTranscription(model, { audio })`.
- If the service does not support server-sent events (SSE), use `transcriptionsNonStreaming()`.
- `streamSpeech` returns a `Response`. `generateSpeech` reads its body into a `Blob`.
- For HTTP and network failures, read https://xsai.js.org/shared.md.

For code changes, make sure that the installed types accept the code. Test the affected behavior with existing tests or mock responses.
