# Maintain the documentation

Use the repository package manager and installed workspace dependencies.
Run `pnpm install` from the repository root before the commands below.
The website has two independent VitePress applications.
The current application lives in `docs`. The v0 application lives in `docs-v0`.

## Edit current content

Every page of the current site is a Markdown file in `docs`.
There is no other source for technical content.
The skills in `skills/` hold only an entry point and a few rules.
They link to the pages on the site, so edit a page and the skills follow.

Use the glossary in [CONTEXT.md](../CONTEXT.md) for domain terms.
Write in plain English: short sentences, active voice, and one word for one meaning.
Define a term the first time it appears, but only terms that xsAI introduces.
State prerequisites once, in [Getting started](./getting-started.md), and link to them from other pages.
Do not explain a step that a developer already knows.

Organize pages by the reader's goal:

- Getting Started introduces xsAI, installation, packages, and agent skills.
- Core Concepts covers text: the operations, messages, events, and adapters, then troubleshooting and the text API reference. Each task, such as cancelling a request, lives in the page of the concept that it extends.
- More Capabilities covers audio, embeddings, images, and models. Each page ends with a reference section.
- Advanced covers custom models for every package and module augmentation.
- Extras covers the shared HTTP helpers and xsschema. Each page ends with a reference section.

Code samples run through twoslash during the build, so a type error fails `pnpm build:docs`.
Use `// ---cut---` to hide setup lines such as `declare const model: LanguageModel`.

Short examples that also appear in package READMEs live in `docs/snippets/`.
A page includes a snippet with `<!-- @include: ./snippets/name.md -->`.
A README includes the same file with an `automd:file` block that starts at the repository root, such as `/docs/snippets/text-responses.md`.
Keep snippets free of `// ---cut---` lines, because READMEs show them as written.

After you edit a snippet, synchronize the READMEs:

```sh
pnpm docs:sync
```

This command runs the automd CLI against the root README and package READMEs.
The autofix workflow synchronizes and formats generated regions.
CI runs the same command and rejects changes to tracked READMEs.
A second synchronization must produce no changes.

## Edit the skills

Each directory in `skills/` is an independent skill, so a user can install only the packages that they use.
Keep a skill to its description, a table of page URLs, and a short list of rules for writing code.
Do not copy page content into a skill.
Do not link from one skill to another skill with a relative path.
Write skills in the way that [writing-for-agents](../.agents/skills/writing-for-agents/SKILL.md) describes.

## Edit the archive

The historical source is tag `v0.5.1`, commit `c63fe0406b8b63cf54a83256c9fea7e52eb1a650`.
Use `git show v0.5.1:docs/content/docs/<path>.mdx` to read an original page.
Rewrite prose with the current writing standard.
Preserve historical API behavior, example meaning, page hierarchy, and heading anchors.
Keep old examples on the v0 API.
The archive uses ordinary syntax highlighting because current types do not describe the old API.

The old URL inventory is [routes.json](./legacy/routes.json).
Its entries include the historical top-level aliases and xsschema error links.
Static redirect wrappers live in `docs/legacy`.
VitePress rewrites their output paths to `/docs/...`.
The redirect component preserves the query string and fragment in the browser.
It also renders a destination link before JavaScript runs.
Redirect pages are excluded from search and LLM exports.

## Run both versions locally

Start the two applications and the Turbo Microfrontends proxy:

```sh
pnpm dev:docs
```

Open the proxy URL that Turbo prints.
The current application handles unmatched paths.
The archived application handles `/v0` and `/v0/:path*`, including its assets.
Turbo supplies each application port through `TURBO_MFE_PORT`.
Cross-version links use full-page navigation to load the destination application.
The archive navigation uses `/../` to escape its `/v0/` base on the same origin.
Theme 5.0.7 omits the base from search results and logo links.
The shared configuration uses the native VitePress search component and corrects the header links.
Retest these links when you update the theme.

## Build and inspect the deployment

Build both applications and assemble one static artifact:

```sh
pnpm build:docs
```

Each application first writes to its own `.vitepress/dist` directory.
Assembly copies the current output to `docs/out` and the archive to `docs/out/v0`.
GitHub Pages deploys `docs/out`.
A failed application build prevents assembly.
The assembly command copies the two successful builds into a fresh output directory.

To preview a built application, use its native VitePress command:

```sh
pnpm preview:docs
pnpm --filter @xsai/docs-v0 preview --port 4174
```

Run these commands in separate terminals.
Each preview serves one application.
Use the development proxy to inspect both versions on one origin.

Each version has its own local search index, `llms.txt`, `llms-full.txt`, and page Markdown.
The archive build adds `/v0/` to internal links in its Markdown exports.
The configuration excludes agent instructions, ADRs, research, and assembled output from the published site.
Turbo tracks package sources and shared theme files as build inputs.

Run synchronization, typechecking, and lint before a pull request:

```sh
pnpm docs:sync
pnpm typecheck
pnpm lint
```

Inspect version switches, search, and an old URL with a query and fragment in a browser.
Use `/docs/packages-top/xsschema?source=example#missing-dependencies` for the compatibility case.
It must reach the matching v0 anchor and retain the query.
A real service still controls model support and generated output.
