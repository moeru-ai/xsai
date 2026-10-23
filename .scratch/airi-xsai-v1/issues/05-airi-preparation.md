# Which AIRI preparation changes can ship before the dependency upgrade?

Parent: ../map.md
Type: grilling
Labels: wayfinder:grilling, needs-info
Status: open
Assignee: unassigned
Blocked by: 01, 02, 03

## Question

Select clean internal boundaries and preparation changes that keep the UI and user configuration unchanged. Define acceptance criteria and distinguish preparation from the dependency cutover.

## Decision inputs

Read the safe-preparation sections in [Text contract research](../research/text-contract.md), [Provider boundary findings](../research/provider-boundary.md), and [Audio and consumer migration research](../research/audio-and-consumers.md).

Select changes that can run on the current 0.5.1 dependencies.
Candidates include request fixtures, request normalization, narrower SDK type boundaries, tool context audits, audio result boundaries, and removal of proven dead dependencies.
New xsAI 1.0 imports, model factories, and manifest upgrades belong to the cutover.

For each selected batch, name its AIRI owner, affected consumers, acceptance cases, and observable behavior that must remain unchanged.
Preserve provider IDs, saved configuration fields, protocol defaults, and settings routes.
Preserve readable history and subsequent-turn behavior because these affect users.
Do not introduce a permanent compatibility runtime as preparation.
