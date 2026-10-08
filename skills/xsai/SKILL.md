---
name: xsai
description: Route an xsAI task that spans packages, pick packages, or use the `xsai` umbrella package. Use when the work combines text, audio, images, embeddings, or model lists, or when the owning package is unclear.
---

# xsAI router

Match the task to one skill. Use that skill when it is installed.

| Task | Skill |
| --- | --- |
| Text, tools, structured output, text events | `xsai-text` |
| Speech and transcription | `xsai-audio` |
| Embedding vectors | `xsai-embed` |
| Image generation | `xsai-image` |
| Model lists | `xsai-model` |

For a task that spans packages, start with the skill for the main capability, then add the others.

When a skill is not installed, read the page for it instead:

1. Open https://xsai.js.org/llms.txt.
2. Pick the pages that match the task.
3. Fetch each page as Markdown.

Packages and the `xsai` umbrella package, which re-exports every package except `xsschema`, are in https://xsai.js.org/packages.md.
Every operation takes the model first and the options second.
