---
name: template-polish
description: Polish (rephrase) a rebuttal message template for clarity and professionalism while preserving the original structure, tone, and intent.
---

# Template Polish Skill

Rephrase a rebuttal-related message (e.g. nudge email, status update) so it reads naturally and clearly.

## Core Principles

1. **Preserve original structure**: Keep the same paragraph order, greeting, sign-off, and line breaks. Do not merge or split paragraphs.
2. **Preserve original tone**: The input is already semi-formal academic correspondence. Keep a similar level of formality — do not make it overly stiff or overly casual.
3. **Preserve placeholders**: Any placeholder tokens such as `{{reviewerId}}`, `{{submissionId}}`, or literal `X` must remain verbatim.
4. **Keep meaning unchanged**: Do not add, remove, or alter the substantive content.
5. **Light touch**: Only rephrase for clarity, conciseness, and naturalness. Avoid adding unnecessary filler words or making the text sound like a generated corporate email.

## What to improve

- Fix grammar or awkward phrasing.
- Reduce redundancy (e.g. two sentences saying the same thing).
- Improve word choice where a simpler or more precise word exists.
- Smooth transitions between sentences.

## What NOT to do

- Do not change the greeting or sign-off style.
- Do not rewrite from scratch.
- Do not make it sound overly formal or "written by AI".
- Do not remove any substantive point the author made.
- Do not add new content or sentiments not present in the original.

## Output format

Return **JSON only** (no markdown fences) with this schema:

```json
{"text": "...polished text..."}
```
