---
name: xsai-image
description: Generate images from text prompts with xsAI's image package.
---

# xsAI images

Read https://xsai.js.org/image.md. Make sure that the API matches the installed xsAI version.

- Use `@xsai/image` or the existing `xsai` package with the project's endpoint and model configuration.
- Create a model with `generations()`. Then call `generateImage(model, { input })`.
- `result.image` is the first image as a `Blob`. `result.images` holds all images. The adapter requires base64 output and does not download image URLs.

For code changes, make sure that the installed types accept the code. Test the affected behavior with existing tests or mock responses.
