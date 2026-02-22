# Stage2 ICLR Refine Skill

## Goal
Given a Stage1 atomic issue and a user-provided outline, generate a polished and academically toned rebuttal draft.

## Input
- response id/title/source/source_id
- quoted_issue (verbatim)
- outline (free-form user plan)

## Output
JSON:
```json
{ "draft": "..." }
```

## Requirements
1. Keep `quoted_issue` concerns central.
2. Expand outline into clear academic prose.
3. Avoid fabricated claims, numbers, experiments, or citations.
4. Keep tone respectful and constructive.
5. Produce a concise paragraph-level response suitable as first draft.
