---
name: xsai
description: Choose xsAI packages or route tasks across text, audio, decisions, images, embeddings, and model lists.
---

# xsAI router

Before you choose packages, read the installed xsAI version and existing imports.

Use the relevant installed skill:

| Task | Skill |
| --- | --- |
| Text, tools, structured output, text events | `xsai-text` |
| Speech and transcription | `xsai-audio` |
| Classification, routing, rating with typed answers | `xsai-decide` |
| Embedding vectors | `xsai-embed` |
| Image generation | `xsai-image` |
| Model lists | `xsai-model` |

For a task that spans packages, start with the skill for the main capability. Then use the other skills as needed.

If a skill is not installed, find the relevant Markdown pages through https://xsai.js.org/llms.txt.
Read only the pages needed for the task.

The `xsai` package re-exports every package except `xsschema`. For package details, read https://xsai.js.org/packages.md.
Reuse the project's import style. If the project uses `xsai`, use its exports without extra package dependencies.
