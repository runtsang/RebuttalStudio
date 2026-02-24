---
name: stage1-icml-breakdown
description: Break down full ICML reviewer responses into structured rebuttal units. Use when input contains reviewer summary/presentation/contribution/strength/weakness/question text and the goal is to split weaknesses/questions into granular R-style response items while preserving original wording for quoted issues.
---

# Stage 1 · ICML Breakdown Skill

Process reviewer text into a strict structure for rebuttal planning.

## Input assumptions

- Input is one reviewer's full text (possibly copied from DOC/DOCX or OpenReview).
- Sections may include: `Summary`, `Soundness`, `Presentation`, `Significance`, `Originality`, `Limitations`, `Key Questions For Authors`, `Strengths And Weaknesses`.
- Bullets may contain one or multiple independent concerns.

## Mandatory extraction rules

1. **Extract all six scores (numbers only)**
   - Extract the numeric value for each of the ICML review scores:
     - `Overall Recommendation` (map to `rating`)
     - `Confidence` (map to `confidence`)
     - `Soundness` (map to `soundness`)
     - `Presentation` (map to `presentation`)
     - `Significance` (map to `significance`)
     - `Originality` (map to `originality`)
   - Output only the number (e.g., `6`, `4`, `3`). Do not include scale descriptions.

2. **Keep original text for unchanged fields**
   - Preserve `Summary` and `Limitations` exactly as written.
   - Keep line breaks when possible.

3. **Split weakness/question into atomic issues**
   - For `Strengths And Weaknesses` and `Key Questions For Authors`, split into issue-level items.
   - One bullet usually maps to one response item, but split further when one bullet contains multiple distinct asks/criticisms.
   - Each atomic item must be mapped to one response block.

4. **Create response blocks: R1 ... RN**
   - Use `Response1`, `Response2`, ... in final order.
   - Each response has:
     - `title`: short generated subtitle (e.g., "Regarding novelty classification").
     - `source`: `weakness` or `question`.
     - `source_id`: `weakness1`, `weakness2`, ... or `question1`, `question2`, ... according to origin after splitting.
     - `quoted_issue`: exact quoted original text segment (verbatim, wrapped in quotes).

5. **Prefix logic for split issues**
   - If issue comes from weakness section, use `weaknessN`.
   - If issue comes from question section, use `questionN`.
   - Number independently per source type.

## Splitting heuristics

Use these cues to split one bullet into multiple issues:

- Multiple independent requests connected by "and", "also", "in addition", "furthermore".
- Topic shift inside one bullet (e.g., novelty + experiment setting).
- Distinct actionable asks (e.g., "clarify theorem" and "add baseline").
- One concern about claim validity and another about writing/organization.

Do **not** split when sentences elaborate the same single concern.

## Output format

Use this exact skeleton:

```markdown
# Stage1 ICML Breakdown

## Scores
- rating: <number>
- confidence: <number>
- soundness: <number>
- presentation: <number>
- significance: <number>
- originality: <number>

## Preserved Sections
- summary: |
  <verbatim summary text>
- strength: |
  <verbatim strength/limitations text>

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

### Response2
- title: <generated subtitle>
- source: weakness
- source_id: weakness2
- quoted_issue: "<same verbatim text as weakness2>"

### Response3
- title: <generated subtitle>
- source: question
- source_id: question1
- quoted_issue: "<same verbatim text as question1>"
```

## Quality checklist

Before finalizing, verify:

- `summary` and `strength` are unchanged.
- Every weakness/question atomic issue appears once in `Atomic Issues`.
- Every atomic issue is linked by exactly one response block.
- `quoted_issue` text is verbatim.
