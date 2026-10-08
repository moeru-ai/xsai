# Working with AI

Use Agent Skills, Markdown docs, and `llms.txt` to help AI tools write xsAI code.

## Agent Skills

[Agent Skills](https://agentskills.io) are folders of instructions and references that your AI coding tool can load when relevant.

To install the xsAI skills, run:

```bash
npx skills add moeru-ai/xsai
```

The skills are in the [`skills/`](https://github.com/moeru-ai/xsai/tree/main/skills) directory of the repository.
You can also copy the skill directories into your tool's skill directory.
Keep each `references/` directory and install all six skills, because the `xsai` router links to the others.

## Markdown docs

Each page in the xsAI documentation is also available as a standalone Markdown file.
Add the `.md` extension to the URL to get the Markdown version of a page, for example [`/text/quick-start.md`](/text/quick-start.md){target="_self"}.

## llms.txt

The [`llms.txt`](/llms.txt){target="_self"} file lists all Markdown pages in this version of the documentation.
The [`llms-full.txt`](/llms-full.txt){target="_self"} file contains the full text of all pages in one file.
