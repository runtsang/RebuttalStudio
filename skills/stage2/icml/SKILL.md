---
name: stage2-icml-refine
description: Refine a Stage2 ICML rebuttal draft into polished, reviewer-facing prose in the author's style; preserve factual grounding, optionally prepend a courteous opening phrase, and normalize tables/code/formulas into Markdown.
---

# Stage2 ICML Refine Skill

## When to use
Use this skill when you already have:
- one Stage1 atomic issue (`quoted_issue`), and
- a Stage2 draft/outline,
and now need a polished rebuttal paragraph (or short multi-paragraph answer) that sounds respectful, precise, and persuasive.

## Goal
Turn a rough draft into a reviewer-ready response that:
1. directly addresses the reviewer concern,
2. keeps claims factual and bounded by provided evidence,
3. matches the user's concise, polite, academically confident writing style,
4. optionally starts with a customized courteous opener.
5. Make the response concise and precise as a nature paper

## Input
- `response_id` / `title` / `source` / `source_id` (metadata)
- `quoted_issue` (verbatim reviewer concern)
- `draft` or `outline` (user-provided response content)
- optional style hints from user history (preferred tone, sentence length, verbosity)

## Output
Return strict JSON:

```json
{ "draft": "> **Reviewer's Comment**: [quoted_issue]\n\n**Response**: [polished rebuttal prose]" }
```

## Core writing style rules
1. **Respect-first opening**: begin with appreciation/acknowledgment before rebuttal substance when appropriate.
2. **Issue anchoring**: explicitly connect the response to `quoted_issue` in the first 1–2 sentences.
3. **Novelty articulation**: clearly state what is new, why it matters, and how it differs from prior work.
4. **No fabrication**: never invent experiments, numbers, citations, or implementation details.
5. **Constructive tone**: avoid defensive language; prefer collaborative phrasing.
6. **Concise precision**: short, information-dense paragraphs; avoid repetitive restatement.
7. **Paragraph Preservation**: aggressively separate distinct semantic points into individual paragraphs. If the provided `draft` or `outline` is split into multiple paragraphs or list items, ensure your generated `draft` has at least the same number of separate paragraphs. Do not merge separate points into a single wall of text.

## Courtesy opening phrase bank
When refining, choose **one** opener that best matches the reviewer comment and prepend it naturally.
Do not stack multiple openers.

- "Thank you for the excellent suggestion."
- "Thank you for pointing this out."
- "Thank you for highlighting this important point about [TOPIC]."
- "We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA]."
- "Thank you for making a chance to let us classify our contribution more accurately."

### Opener selection guidance (for API-time customization)
- If reviewer gives actionable improvement advice → prefer "Thank you for the excellent suggestion."
- If reviewer spots an omission/ambiguity → prefer "Thank you for pointing this out."
- If reviewer emphasizes significance of a specific dimension → prefer "Thank you for highlighting this important point about [TOPIC]."
- If reviewer challenges originality/positioning → prefer "We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA]."
- If reviewer challenges originality/positioning → prefer "Thank you for making a chance to let us classify our contribution more accurately."

## Markdown normalization rules (mandatory)
If input contains structured content, normalize in final `draft` as follows:

1. **Tables/Charts → Markdown table**
   - Convert any tabular comparison into GitHub-flavored Markdown table.
2. **Code → fenced Markdown code block**
   - Use triple backticks and language tag when known.
3. **Formula → Markdown math**
   - Inline math uses `$...$`.
   - Display math uses `$$...$$` on separate lines.

## Refine workflow
1. Read `quoted_issue` and identify reviewer intent (clarification / novelty / validity / scope / limitation).
2. Extract all factual points from `draft`/`outline`; drop unsupported claims.
3. Select one courtesy opener from the phrase bank.
4. Rewrite into coherent academic prose and format the `draft` exactly as follows:
   - Start with: `> **Reviewer's Comment**: [quoted_issue]`
   - Follow with a blank line.
   - Then start the response with `**Response**: ` followed by:
     - acknowledgment,
     - direct answer,
     - evidence/logic,
     - forward-looking clarification (if needed).
5. Normalize any table/code/formula into Markdown format.
6. Return strict JSON only.

## Hard constraints
- Do not alter the meaning of user-provided technical claims.
- Do not introduce new citations unless already provided.
- Do not over-promise (e.g., "we will definitely" without basis).
- Keep the final text ready for immediate rebuttal submission editing.
- **Strict Format**: The `draft` field MUST start with the quoted reviewer comment and follow the `> **Reviewer's Comment**: ... \n\n**Response**: ...` structure.
