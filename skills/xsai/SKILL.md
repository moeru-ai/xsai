---
name: xsai
description: Find the right xsAI skill for a current AI application task, select packages, or coordinate work across text, audio, images, embeddings, and model catalogs. Use when the task spans packages or the owning xsAI capability is unclear.
---

# xsAI task router

Use these skills for xsAI v1.
Select the owning skill below and read its entry before its references.

| Task | Entry |
| --- | --- |
| Text, tools, structured output, or text events | [xsai-text](../xsai-text/SKILL.md) |
| Speech or transcription | [xsai-audio](../xsai-audio/SKILL.md) |
| Embedding vectors | [xsai-embed](../xsai-embed/SKILL.md) |
| Image generation | [xsai-image](../xsai-image/SKILL.md) |
| Model discovery | [xsai-model](../xsai-model/SKILL.md) |

Install this router and all five package skills as sibling directories in the host skill directory.
If a target is absent, install that skill from this repository's `skills/` directory before you continue.
For the umbrella package, read the text skill's [umbrella quick start](../xsai-text/references/umbrella-quick-start.md).

Use the owning references for technical instructions.
For a task that spans packages, load only the entries and references required for that task.
Use the imports and call signatures from the owning references.
