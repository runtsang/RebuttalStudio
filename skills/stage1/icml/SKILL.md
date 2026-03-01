---
name: stage1-icml-breakdown
description: Break down full ICML reviewer responses into structured rebuttal units. Use when input contains reviewer summary/presentation/contribution/strength/weakness/question text and the goal is to split weaknesses/questions into granular R-style response items while preserving original wording for quoted issues.
---

# Stage 1 · ICML Breakdown Skill (Template Extension)

Apply the shared template first:

- `skills/stage1/template/SKILL.md`

Then apply only the ICML-specific overrides below.

## ICML overrides

### Score mapping (required keys)

Extract exactly these six keys (numbers only):

- `rating` <- `Overall Recommendation`
- `confidence` <- `Confidence`
- `soundness` <- `Soundness`
- `presentation` <- `Presentation`
- `significance` <- `Significance`
- `originality` <- `Originality`

### Preserved section mapping

- `summary` <- `Summary`
- `strength` <- `Limitations` (keep compatibility with shared output key naming)

### Atomic issue source mapping

- weakness-type source <- `Strengths And Weaknesses` (extract only concern/criticism parts)
- question-type source <- `Key Questions For Authors`

### Output header and score block

- Header must be exactly: `# Stage1 ICML Breakdown`
- `## Scores` must contain exactly the six keys above.

## ICML note

If "Strengths And Weaknesses" mixes praise and criticism in one bullet, keep praise in preserved context and split only actionable weakness concerns into atomic issues.
