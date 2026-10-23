# What evidence permits each AIRI migration batch to ship?

Parent: ../map.md
Type: grilling
Labels: wayfinder:grilling, needs-info
Status: open
Assignee: unassigned
Blocked by: 04, 05

## Question

Select the Stage-first cutover order, runtime regression gates, configuration and history policy, ecosystem dependencies, and rollback method. Define the order for remaining monorepo consumers.

## Decision inputs

Use the decisions in [Which xsAI public contracts must change before 1.0?](04-xsai-public-contract.md) and [Which AIRI preparation changes can ship before the dependency upgrade?](05-airi-preparation.md).
Use [Audio and consumer migration research](../research/audio-and-consumers.md) for the consumer inventory.

Define independently reviewable batches and their release conditions.
Distinguish Stage generation, file audio, live transcription, native packaging, and non-Stage consumers.
A shared package can require several Stage apps to move together.
Classify each external dependency as retained with a new release, replaced by an AIRI-owned implementation, or removed after evidence of no active use.

Record fixture tests, affected workspace checks, real runtime checks, provider coverage, and release rollback for every batch.
Do not infer runtime compatibility from type checks alone.
