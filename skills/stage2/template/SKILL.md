---
name: stage2-refine-template
description: Base template for Stage2 rebuttal refinement. Use when creating or extending conference-specific Stage2 skills so all venues share the same high-quality writing constraints, JSON output format, and normalization rules.
---

# Stage 2 · Refine Base Template

Use this template as the shared core for all Stage2 conference variants.
Conference-specific files must apply this template first, then add only necessary overrides.

## Goal

Turn a rough outline into reviewer-facing rebuttal prose that:

1. Directly addresses the reviewer concern.
2. Keeps claims factual and bounded by provided evidence.
3. Uses concise, polite, academically confident style.
4. Optionally starts with one courteous opener.

## Input

- `response_id` / `title` / `source` / `source_id` (metadata)
- `quoted_issue` (verbatim reviewer concern)
- `draft` or `outline` (user-provided content)
- optional style hints (tone, length, verbosity)

## Output

Return strict JSON only:

```json
{ "draft": "> **Reviewer's Comment**: [quoted_issue]\n\n**Response**: [polished rebuttal prose]" }
```

## Core writing rules

1. **Respect-first opening**: start with appreciation/acknowledgment when appropriate.
2. **Issue anchoring**: connect to `quoted_issue` within the first 1–2 sentences.
3. **Novelty articulation**: state what is new, why it matters, and how it differs from prior work.
4. **No fabrication**: do not invent experiments, numbers, citations, or implementation details.
5. **Constructive tone**: avoid defensive language.
6. **Concise precision**: keep paragraphs short and information-dense.
7. **Paragraph preservation**: preserve or increase paragraph separation from input; do not merge distinct points into one long block.

## Courtesy opener bank

Select exactly one opener when an opener is needed:

- "Thank you for the excellent suggestion."
- "Thank you for pointing this out."
- "Thank you for highlighting this important point about [TOPIC]."
- "We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA]."
- "Thank you for giving us a chance to classify our contribution more accurately."

### Opener selection guidance

- Actionable improvement advice -> "Thank you for the excellent suggestion."
- Omission or ambiguity pointed out -> "Thank you for pointing this out."
- Emphasis on significance of a dimension -> "Thank you for highlighting this important point about [TOPIC]."
- Originality/positioning challenge -> "We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA]."

## Markdown normalization rules

If input contains structured content, normalize in final `draft`:

1. **Tables/charts -> Markdown table**
2. **Code -> fenced code block** (with language tag if known)
3. **Formula -> Markdown math**
   - Inline math: `$...$`
   - Display math: `$$...$$` on separate lines

## Shared refine workflow

1. Read `quoted_issue` and identify reviewer intent.
2. Extract factual points from `draft`/`outline`; remove unsupported claims.
3. Choose one opener from the opener bank if needed.
4. Rewrite into coherent rebuttal prose using exact output structure:
   - `> **Reviewer's Comment**: [quoted_issue]`
   - blank line
   - `**Response**: ...`
5. Normalize table/code/formula content.
6. Return strict JSON only.

## Hard constraints

- Do not alter the meaning of user-provided technical claims.
- Do not introduce new citations unless already provided.
- Do not over-promise without evidence.
- Keep output ready for direct rebuttal editing.
- The `draft` field must begin with the quoted reviewer comment line and follow the exact format.

## Conference extension contract

Conference-specific Stage2 files may override only what is truly different:

- conference naming/labeling
- extra mandatory phrase variants (if a venue requires them)
- venue-specific style constraints

Keep all other rules inherited from this template.
