---
name: stage1-breakdown-template
description: Base template for Stage1 reviewer-comment breakdown. Use when creating or extending conference-specific Stage1 skills (for example ICLR, ICML, NeurIPS, ACL) so shared extraction, splitting, and response-mapping logic stays consistent.
---

# Stage 1 · Breakdown Base Template

Use this template as the shared core for all Stage1 conference variants.
Conference-specific files must apply this template first, then add only necessary overrides.

## Shared input assumptions

- Input is one reviewer's full text (OpenReview export, PDF copy, DOC/DOCX paste, etc.).
- Review sections may appear as headings, bullets, numbered lists, or mixed prose.
- A single bullet can contain multiple independent concerns.

## Shared mandatory workflow

1. **Extract conference-defined scores (numbers only)**
   - Extract every score required by the conference extension.
   - Keep values numeric only (for example `6`, `4`, `3`), without scale explanations.
   - If a score is missing, leave it empty rather than inventing.

2. **Preserve designated sections verbatim**
   - Keep conference-defined preserved sections unchanged.
   - Keep line breaks where possible.

3. **Split issue-bearing sections into atomic issues**
   - Split conference-defined weakness/question sources into issue-level items.
   - One atomic issue should correspond to one independent concern or request.
   - Split further if one item contains multiple asks.

4. **Create response blocks (`Response1` ... `ResponseN`)**
   - Each response block must include:
     - `title`: generated short subtitle
     - `source`: `weakness` or `question`
     - `source_id`: `weaknessN` or `questionN`
     - `quoted_issue`: exact verbatim text of the mapped atomic issue

5. **Apply prefix and numbering rules**
   - Issues from weakness-type source sections must use `weaknessN`.
   - Issues from question-type source sections must use `questionN`.
   - Number `weaknessN` and `questionN` independently.

## Shared splitting heuristics

Split when any of these applies:

- Multiple independent asks connected by "and", "also", "in addition", "furthermore".
- Topic shift inside one bullet (for example novelty vs experiments).
- Distinct actionable requests (for example "clarify theorem" and "add baseline").
- Different concern types in one item (for example validity + writing quality).

Do not split when sentences elaborate one single concern.

## Shared output skeleton

Use this structure, with conference-specific keys provided by the extension file:

```markdown
# Stage1 <CONFERENCE> Breakdown

## Scores
- <score_key_1>: <number>
- <score_key_2>: <number>

## Preserved Sections
- summary: |
  <verbatim text>
- strength: |
  <verbatim text>

## Atomic Issues
- weakness1: "<verbatim quoted issue>"
- weakness2: "<verbatim quoted issue>"
- question1: "<verbatim quoted issue>"

## Responses
### Response1
- title: <generated subtitle>
- source: weakness
- source_id: weakness1
- quoted_issue: "<same verbatim text as weakness1>"
```

## Shared quality checklist

Before finalizing, verify:

- Preserved sections are unchanged.
- Every atomic issue appears exactly once in `Atomic Issues`.
- Every atomic issue maps to exactly one response block.
- Every `quoted_issue` is verbatim.

## Conference extension contract

Conference-specific Stage1 files must define:

- Score field mapping and required score keys.
- Preserved section mapping.
- Weakness/question source section mapping.
- Output header text (`# Stage1 <CONFERENCE> Breakdown`).

Do not rewrite shared logic in conference files unless a true conference-specific exception exists.
