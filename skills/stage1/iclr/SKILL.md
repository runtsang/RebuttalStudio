---
name: stage1-iclr-breakdown
description: Break down full ICLR reviewer responses into structured rebuttal units. Use when input contains reviewer summary/presentation/contribution/strength/weakness/question text and the goal is to split weaknesses/questions into granular R-style response items while preserving original wording for quoted issues.
---

# Stage 1 · ICLR Breakdown Skill (Template Extension)

Apply the shared template first:

- `skills/stage1/template/SKILL.md`

Then apply only the ICLR-specific overrides below.

## ICLR overrides

### Score mapping (required keys)

Extract exactly these five keys (numbers only):

- `rating` <- ICLR `rating`
- `confidence` <- ICLR `confidence`
- `soundness` <- ICLR `soundness`
- `presentation` <- ICLR `presentation`
- `contribution` <- ICLR `contribution`

### Preserved section mapping

- `summary` <- `summary`
- `strength` <- `strength`

### Atomic issue source mapping

- weakness-type source <- `weakness`
- question-type source <- `question`

### Output header and score block

- Header must be exactly: `# Stage1 ICLR Breakdown`
- `## Scores` must contain exactly the five keys above.

## ICLR note

If reviewer text mixes free-form paragraphs and bullets, keep template splitting rules unchanged and split only by independent concerns.
