# Add runtime catalog fetch with snapshot fallback

Parent: ../map.md
Type: grilling
Labels: needs-triage
Status: open
Blocked by: 01

## Question

What does `/fetch` return, from which URL, with which cache and fallback?
Decide whether the bundled snapshot is the generated data or a separate trimmed file, how large it may be for browser callers, whether the source URL and fetch function are configurable, and how decode failures fall back.
