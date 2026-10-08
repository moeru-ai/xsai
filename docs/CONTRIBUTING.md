# Maintain the documentation

Use the repository package manager and installed workspace dependencies.
Run `pnpm install` from the repository root before the commands below.
The website has two independent VitePress applications.
The current application lives in `docs`. The v0 application lives in `docs-v0`.

## Edit current content

Find the owning skill in [the ownership table](../skills/README.md#content-ownership).
Edit its files in `references/`.
For shared HTTP helpers, edit `docs/shared/`.
For xsschema, edit `docs/xsschema/`.
These two sections use the documentation as their source and have no agent skills.
Keep `SKILL.md` focused on task selection and conditional reference pointers.
Use the glossary in [CONTEXT.md](../CONTEXT.md) for domain terms.

Use a tutorial for a first successful exercise.
Use a how-to guide for a specific task.
Use a reference for inputs, outputs, defaults, and failures.
Use an explanation for concepts and tradeoffs.
These forms follow [Diátaxis](https://diataxis.fr/).
Write short, active sentences with the [Microsoft writing guidance](https://learn.microsoft.com/en-us/style-guide/welcome/).
State prerequisites before commands and give an observable result after examples.

Organize current website navigation by the reader's goal:

- Getting Started introduces xsAI, installation, adapter choice, packages, and agent skills.
- Guides complete specific tasks, such as streaming text or calling a tool.
- Advanced explains request control, integrations, custom models, and troubleshooting.
- References define API contracts, event fields, defaults, and failures.

Give each task its own source reference when it needs separate instructions.
Keep detailed contracts in References and link to them from the task guide.
Website groups do not change which skill owns the technical source.

A website wrapper includes its owning reference with VitePress include syntax.
A README uses an `automd:file` block for its package quick start.
Its source path starts at the repository root, such as `/skills/xsai-text/references/quick-start.md`.
Use canonical website URLs inside shared references so their links work in every projection.
Use relative links between skill entries and local references.

After you edit a reference, synchronize the READMEs:

```sh
pnpm docs:sync
```

This command runs the automd CLI against the root README and package READMEs.
The autofix workflow synchronizes and formats generated regions.
CI runs the same command and rejects changes to tracked READMEs.
A second synchronization must produce no changes.

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
Turbo tracks skill references and shared theme files as build inputs.

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
