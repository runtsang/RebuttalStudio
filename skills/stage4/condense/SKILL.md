---
name: stage4-condense-context
description: Condense Stage 3 combined discussion content into compact markdown context for Stage 4 multi-round follow-up drafting.
---

# Stage4 Condense Context Skill

## Goal
Convert long Stage 3 "All" content into short reusable markdown context.

## Input
- `stage3_all_source`: full Stage 3 combined source for one reviewer.

## Output
Return strict JSON:

```json
{ "condensedMarkdown": "..." }
```

## Required structure in `condensedMarkdown`
- `## Key Question(s)`
- `## Main Answer(s)`

## Rules
1. Keep wording concise and factual.
2. Preserve key technical claims and commitments.
3. Remove repetition and non-essential greetings.
4. Do not invent numbers, experiments, or citations.
5. Produce markdown ready for local file persistence.
