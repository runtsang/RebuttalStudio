---
name: stage1-arr-breakdown
description: Break down full ARR (ACL Rolling Review) reviewer responses into structured rebuttal units. Use when input contains ARR reviewer fields (Paper Summary, Strengths, Weaknesses, Comments/Suggestions) and numeric scores (Confidence, Soundness, Excitement, Overall Assessment, Reproducibility). Splits weaknesses and comments/suggestions into granular response items while preserving original wording for quoted issues.
---

# Stage 1 · ARR Breakdown Skill (Template Extension)

Apply the shared template first:

- `skills/stage1/template/SKILL.md`

Then apply only the ARR-specific overrides below.

## ARR overrides

### Score mapping (required keys)

Extract exactly these five keys (numbers only, decimals allowed):

- `confidence` <- ARR `Confidence`
- `soundness` <- ARR `Soundness`
- `excitement` <- ARR `Excitement`
- `assessment` <- ARR `Overall Assessment` (number before `=` sign)
- `reproducibility` <- ARR `Reproducibility` (number before `=` sign)

### Preserved section mapping

- `summary` <- `Paper Summary`
- `strength` <- `Summary Of Strengths`

### Atomic issue source mapping

- weakness-type source <- `Summary Of Weaknesses`
- question-type source <- `Comments Suggestions And Typos` (label as `suggestion`)

### Output header and score block

- Header must be exactly: `# Stage1 ARR Breakdown`
- `## Scores` must contain exactly the five keys above.

## ARR notes

- ARR scores may include decimals (e.g. `2.5`, `3.5`). Extract only the numeric part before any `=` or description text.
- The `Ethical Concerns`, `Datasets`, `Software`, `Knowledge Of Paper`, and certification fields are irrelevant — ignore them.
- Map `Comments Suggestions And Typos` to the `suggestion` section and split it into atomic issues just as weaknesses are split.
