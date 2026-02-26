---
name: stage4-refine-followup
description: Refine a Stage 4 follow-up response using condensed prior discussion context, current follow-up question, and the user's draft.
---

# Stage4 Refine Follow-up Skill

## Goal
Generate a polished follow-up response for multi-round reviewer discussion.

## Inputs
- `condensed_markdown`: condensed context from Stage4 condense skill.
- `followup_question`: current reviewer follow-up question text.
- `draft`: user-authored draft response.

## Output
Return strict JSON:

```json
{ "refinedText": "..." }
```

## Rules
1. Keep claims grounded in provided context and draft.
2. Address the follow-up question directly in the opening lines.
3. Maintain respectful, concise academic tone.
4. Avoid fabrication of data/citations/experiments.
5. Preserve the core intent of user draft while improving clarity and flow.
