# xsAI + Mastra Example

https://github.com/mastra-ai/mastra

## Run

```bash
pnpm -rF @xsai/example-mastra dev
```

## Overrides

###### workspace

```json
{
  "pnpm": {
    "overrides": {
      "@mastra/core>ai": "workspace:@xsai-ext/compat@*"
    }
  }
}
```

###### npm

```json
{
  "pnpm": {
    "overrides": {
      "@mastra/core>ai": "npm:@xsai-ext/compat@0.1.2"
    }
  }
}
```
