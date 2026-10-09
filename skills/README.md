# xsAI skills

Each directory is an independent [agent skill](https://agentskills.io).
Install only the ones that match the packages that you use.

| Skill | Use for |
| --- | --- |
| `xsai-text` | `@xsai/text` and the three text adapters. |
| `xsai-audio` | `@xsai/audio`. |
| `xsai-decide` | `@xsai/decide`. |
| `xsai-embed` | `@xsai/embed`. |
| `xsai-image` | `@xsai/image`. |
| `xsai-model` | `@xsai/model`. |
| `xsai` | Tasks that span packages. It is optional. |

```sh
npx skills add moeru-ai/xsai
```

You can also copy a skill directory into the skill directory of your tool.

A skill holds the entry point and a few rules.
The technical content lives in the documentation pages that each skill links to.
Edit those pages in `docs/`.
