---
name: xsai-embed
description: Create text embeddings with xsAI for one string or a batch.
---

# xsAI embeddings

Read https://xsai.js.org/embed.md. Make sure that the API matches the installed xsAI version.

- Use `@xsai/embed` or the existing `xsai` package with the project's endpoint and model configuration.
- Create a model with `embeddings()`. Then call `embed(model, { input })` or `embedMany(model, { input })`.
- `embedMany` sends one request for the whole input. If the service limits batch sizes, split the input into smaller batches.

For code changes, make sure that the installed types accept the code. Test the affected behavior with existing tests or mock responses.
