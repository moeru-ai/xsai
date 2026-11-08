# Define AIRI acceptance for the 1.0 package

Parent: ../map.md
Type: research
Labels: needs-triage
Status: open
Blocked by: 01, 02

## Question

What must the package provide so AIRI can replace `model-bank` enrichment in `provider-inference/src/model-catalog.ts` and drop the 0.x imports (`createOpenAI`, `SpeechProvider`, `TranscriptionProvider` types)?
List AIRI fields (`ModelInfo`, `metadata.abilities`, `pricing`, `maxOutput`) and map each to the new types or mark it as AIRI-owned.
Keep exact-ID enrichment and custom-endpoint isolation.
