# Choose a v0 package {#overview}

## Description

This page describes the packages in `v0.5.1`.
Install v0 package builds for the historical API.
The v1 package layout differs.

## Quick Start

- [Generate text](/packages/generate/text) and collect its complete output.
- [Stream text](/packages/stream/text) and read its fragments.
- [Generate structured data](/packages/generate/object) from a schema.
- [Stream structured data](/packages/stream/object) as partial values.

## FAQ

### Manage package versions

For a pnpm workspace, use catalogs to keep package versions together.
This archived example demonstrates a shared version entry.
Replace its version with `0.5.1` to select the frozen API described here.

```yaml
# pnpm-workspace.yaml
catalog:
  '@xsai/embed': &xsai ^0.1.0
  '@xsai/generate-text': *xsai
  '@xsai/shared': *xsai
  '@xsai/shared-chat': *xsai
```

### Use one package

Install [xsai](/packages-top/xsai) to import the core operations from one dependency.
Use the individual packages when you need fewer operations.
