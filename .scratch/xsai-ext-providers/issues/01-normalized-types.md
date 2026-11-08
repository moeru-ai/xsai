# Define the normalized provider, model, route, capability, and cost types

Parent: ../map.md
Type: grilling
Labels: needs-triage
Status: open
Blocked by: none

## Question

Which public types does the package expose, and which models.dev v2 fields map into them?
Cover provider (id, name, doc, env), model (id, name, type, status, family, limits, modalities), route (protocol, baseURL, compatibility), capabilities (tools, reasoning efforts, structured output, input MIME types), and cost.
Decide which model types (`chat`, `embedding`, `speech`, `transcription`, `image`, others) are included, and how unknown v2 fields are dropped or kept.
