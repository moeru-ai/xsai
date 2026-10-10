# xsAI v0 archive {#quick-start}

This archive describes the API from tag `v0.5.1`.
The prose follows the current writing standard. The code keeps the historical API.
Use v0 package builds with these examples.

## What is xsAI?

In v0, xsAI provides utilities for OpenAI and compatible endpoints.
Start with [text generation](/packages/generate/text).
Use the [package overview](/packages/overview) to choose another task.

## Why use the xsAI?

The v0 packages separate operations so applications can install the utilities they need.
The interface resembles the Vercel AI SDK.

### So how small is xsAI?

The original page compared package sizes for older releases.
Those charts are omitted from this archive because package size depends on the release and measurement method.
Install an individual package when you need one operation.

### Why does v0 support only OpenAI-compatible APIs? {#why-are-only-openai-compatible-api-supported}

The v0 core uses OpenAI-compatible protocols to limit protocol adapters and dependencies.
Provider presets supply request configuration for compatible services.
Read the [provider guide](/packages-ext/providers) for those presets.

## Join our Community

Use [GitHub Discussions](https://github.com/moeru-ai/xsai/discussions) for questions.
To use the current API, open [v1](/../){target="_self"}.
The [LLM index](/llms.txt){target="_self"} contains this archive only.
