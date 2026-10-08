# Working with AI

xsAI publishes agent skills, Markdown pages, and an `llms.txt` index.
Use them when an AI tool writes xsAI code for you.

## Agent skills

An [agent skill](https://agentskills.io) is a folder of instructions that your coding tool loads when a task matches.
xsAI has one skill for each package, and they point to the pages on this site.

```sh
npx skills add moeru-ai/xsai
```

Select the skills that match the packages you use.
For example, install `xsai-text` and `xsai-embed` if your project needs only text and embeddings.
The `xsai` skill is optional.
It routes tasks that span several packages.

You can also copy a directory from [`skills/`](https://github.com/moeru-ai/xsai/tree/main/skills) into your tool's skill directory.

## Markdown pages and llms.txt

Add `.md` to the URL of any page to get its Markdown source, for example [`/text/tools.md`](/text/tools.md){target="_self"}.
[`/llms.txt`](/llms.txt){target="_self"} lists every page.
[`/llms-full.txt`](/llms-full.txt){target="_self"} contains all pages in one file.
