# Which AIRI preparation changes can ship before the dependency upgrade?

Parent: ../map.md
Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: Codex
Blocked by: 01, 02, 03

## Question

What must AIRI prepare before the xsAI upgrade to preserve user data and behavior?

## Answer

The user selected direct migration.
AIRI needs no separate refactor before the upgrade.
Change production code only where the upgrade requires it.

Preparation records the evidence needed to compare the old and new versions:

- Keep representative saved configuration and conversation history as test inputs.
- Record the current behavior of the affected user features.
- Reuse existing tests where they cover that behavior.

The existing configuration and history modules own data coverage.
The existing feature modules own behavior coverage.
Start with Stage and include other consumers when their dependencies change.

Acceptance requires these user outcomes:

- Saved configuration selects the same provider and model without user reconfiguration.
- Existing history remains readable and supports subsequent turns.
- Tools, search, citations, speech, and transcription retain their current capabilities.
- Cancellation stops output and prevents late output from entering another turn.
- The UI and configuration controls remain unchanged.

Do not add application types, SDK wrappers, unified provider interfaces, or request utilities as preparation.
If the upgrade requires a code or data conversion, include it in the affected migration batch.
The [cutover decision](06-cutover-order.md) selects batch order, data conversion, release evidence, and rollback.
