---
name: stage5-final-remarks
description: Fill a Stage5 final remarks template using condensed discussion markdown from all reviewers and optional rating changes. Use when generating final remarks after Stage3/Stage4 discussion.
---

# Stage5 Final Remarks Skill

## Goal
Generate a complete Stage5 final remarks markdown by filling template placeholders from multi-reviewer evidence.

## Inputs
- `template_markdown`: placeholder-based template source.
- `reviewer_summaries`: array of reviewer records, each containing:
  - `reviewerId`
  - `condensedMarkdown`
  - `originalRating` (optional)
  - `finalRating` (optional)

If `template_markdown` is empty, use [references/run-template.md](references/run-template.md).

## Output
Return strict JSON:

```json
{ "filledMarkdown": "..." }
```

## Rules
1. Preserve the template structure and section order.
2. Replace placeholders with grounded content from `reviewer_summaries` only.
3. Keep uncertain or missing items concise; do not fabricate numbers, dates, quotes, or experiments.
4. Keep tone respectful, concise, and rebuttal-ready.
5. Generate `{{key_strengths_points_markdown}}` as a concise markdown bullet list with 4-5 items summarized across reviewers.
6. Generate valid markdown table rows for `{{concern_rows_markdown}}`.
7. When rating updates are provided, reflect only explicit score transitions.
