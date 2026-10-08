---
name: xsai-embed
description: Create text embeddings with xsAI for one string or a batch, including output dimensions and usage.
---

# xsAI embeddings

Read https://xsai.js.org/embed.md before you write code. It covers `embed`, `embedMany`, and the option table.

Write code in this shape:

1. Install `@xsai/embed`.
2. Create a model with `embeddings()`.
3. Pass the model first and the options second: `embed(model, { input })`.
4. Use `embedMany` for several strings, and split large batches yourself.
5. Take `baseURL` and the model ID from the user or the project. Ask when they are unknown.

Done when the code type-checks against the installed `@xsai/embed`.
