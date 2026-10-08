---
name: xsai-image
description: Generate images from a text prompt with xsAI, including size, count, quality, and output format options.
---

# xsAI images

Read https://xsai.js.org/image.md before you write code. It covers `generateImage` and the option tables.

Write code in this shape:

1. Install `@xsai/image`.
2. Create a model with `generations()`.
3. Pass the model first and the options second: `generateImage(model, { input })`.
4. Read the first picture from `result.image`, a `Blob` with its media type in `type`.
5. Take `baseURL` and the model ID from the user or the project. Ask when they are unknown.

Done when the code type-checks against the installed `@xsai/image`.
