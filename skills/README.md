# Install xsAI skills

These skills document the xsAI v1 API.
An agent skill is a directory with a `SKILL.md` entry and optional references.

Copy the six skill directories into your host's skill directory:

```text
<skill-directory>/
  xsai/
  xsai-audio/
  xsai-embed/
  xsai-image/
  xsai-model/
  xsai-text/
```

Retain each `references/` directory.
The router uses relative links to sibling skills.
Installing the router alone does not install those targets.
If a target is missing, copy the matching directory from this repository.
Use your host's documented location for local or project skills.
The entries use the portable Agent Skills format.
Host-specific automatic selection and invocation behavior can differ.

## Content ownership

| Public package | Owning skill | Reference |
| --- | --- | --- |
| `@xsai/text` | `xsai-text` | `references/api.md`, `events.md`, and task guides |
| `@xsai/text-chat` | `xsai-text` | `references/adapters.md`, `quick-start.md` |
| `@xsai/text-messages` | `xsai-text` | `references/adapters.md`, `messages-quick-start.md` |
| `@xsai/text-responses` | `xsai-text` | `references/adapters.md`, `responses-quick-start.md` |
| `@xsai/audio` | `xsai-audio` | `references/api.md` |
| `@xsai/embed` | `xsai-embed` | `references/api.md` |
| `@xsai/image` | `xsai-image` | `references/api.md` |
| `@xsai/model` | `xsai-model` | `references/api.md` |
| `xsai` | Router and the owning package skill | Text `references/umbrella-quick-start.md` and package references |

Edit xsAI technical content in the owning references.
The [shared helpers](https://xsai.js.org/shared/api) and [xsschema](https://xsai.js.org/xsschema/api) use documentation sources in `docs/shared/` and `docs/xsschema/`.
The package READMEs and website pages project those files.
Read [documentation maintenance](https://github.com/moeru-ai/xsai/blob/main/docs/CONTRIBUTING.md) for synchronization and validation.
