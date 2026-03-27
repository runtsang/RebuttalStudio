---
name: document-memory-summarize
description: Summarize extracted paper text into concise Markdown memory for later Stage 2 and Stage 4 background use, with fixed section headings and no fabricated claims.
---

# Document Memory Summarize

## Goal
Convert extracted document text into a concise Markdown memory file that is easy to edit and reuse in later rebuttal stages.

## Input
- `document_text`: plain text extracted from `.txt`, `.md`, `.tex`, or `.pdf`.

## Output
Return strict JSON:

```json
{ "markdown": "..." }
```

## Required Markdown headings
- `## Contribution Overview`
- `## Introduction`
- `## Methods`
- `## Logic Chain`
- `## Experiments`
- `## Key Conclusions`

## Rules
1. Keep the Markdown concise and scannable.
2. Preserve the main theoretical ideas, methods, experiments, and conclusions.
3. Ignore references, appendices, and supplementary material unless the main text clearly depends on them.
4. Do not invent numbers, citations, experiments, or claims.
5. If a section is weak or missing in the source, keep the heading and add a short grounded note instead of guessing.
