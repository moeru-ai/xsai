# Which xsAI public contracts must change before 1.0?

Parent: ../map.md
Type: grilling
Labels: wayfinder:grilling, needs-info
Status: open
Assignee: unassigned
Blocked by: 01, 02, 03

## Question

Use the research to select required breaking changes, supported contracts, and exclusions. Define acceptance evidence for each selected change. Do not treat proposals as approved.

## Decision inputs

Read [Text contract research](../research/text-contract.md), [Provider boundary findings](../research/provider-boundary.md), and [Audio and consumer migration research](../research/audio-and-consumers.md).

Resolve these public contract questions:

- Which audio input, file identity, file name, and tool-result media forms become shared Parts?
- Does tool execution need `callId`, or can AIRI remove its dependency on the old execution context?
- Do existing raw events meet observation needs, or does evidence justify another public hook?
- Does live transcription belong in xsAI core, an ecosystem package, or AIRI?
- Which failure and loop-completion guarantees stay shared, and which policies stay in AIRI?

Keep existing model replacement and complete-request fetch separate from proposed additions.
A retained beta.3 capability is not a new implementation task.
For each selected API change, record affected packages, rejected alternatives, and concrete acceptance cases.
