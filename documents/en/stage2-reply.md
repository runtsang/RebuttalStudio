# Stage 2 — Reply

Stage 2 is where the actual rebuttal writing happens. You work through each atomic issue from Stage 1 using an outline-first approach: write rough notes capturing your key technical points, then use the **Refine** button to turn those notes into a polished, publication-ready response paragraph. The LLM handles grammar, tone, and formatting — you stay in charge of the technical substance.

## In the Pipeline

```
Stage 1: Breakdown → Stage 2: Reply → Stage 3: First Round → ...
```

Stage 2 takes the atomic issue list from Stage 1 and produces a drafted response for each item. Stage 3 then assembles those drafts into the final submission document.

## Before You Begin

- [ ] Stage 1 is complete for the reviewer you are working on — the atomic issue list is clean and finalized.
- [ ] Your API key is configured in **API Settings**.
- [ ] You have thought through your actual technical responses. The LLM refines your prose — it does not invent claims, numbers, or experiments on your behalf.

> **Warning:** Never let a Refined Draft go to Stage 3 without reading it carefully. The LLM can misstate a nuance or introduce imprecision. You are responsible for every factual claim in the final rebuttal.

## Interface Overview

**Issue table**
The main view of Stage 2 is a table with one row per atomic issue from Stage 1. Each row shows:

- The **issue title** and source label (`weakness1`, `question2`, etc.) at the top.
- The **quoted issue** — a verbatim excerpt of what the reviewer wrote.
- A **My Reply** text area where you write your outline draft.
- A **Refined Draft** panel (to the right) where the LLM output appears after you click Refine.
- A **Refine** button to trigger the LLM for that row.

**"My Reply" text area**
An editable field for your rough notes. Right-clicking inside it opens a context menu with two options:

- **Insert Table** — opens a modal where you set the number of rows and columns, click "Build Grid" to generate a fillable grid, enter your data, then click "Insert" to embed a Markdown table in your draft.
- **Insert Code** — opens a modal with an optional language tag field and a code content area. Use this for algorithm pseudocode, configuration details, or code snippets.

**"Refined Draft" panel**
Displays the LLM-generated response after Refine is clicked. The output always follows this format:

```
> **Reviewer's Comment**: [verbatim quoted issue]

**Response**: [polished prose]
```

This panel is also directly editable — you can and should make manual corrections after the LLM runs.

**"Auto Fit" button**
Located in the center column. Click it to resize all table rows to match their content height, which helps when rows contain varying amounts of text.

## Step-by-Step Walkthrough

1. **Navigate to the first issue in the table.**
   Work through the rows in order. Each row corresponds to one atomic issue from Stage 1. Read the quoted issue text at the top before writing anything.

2. **Identify the root concern.**
   Before writing, ask: is this a request for clarification, a claim that something is missing, a methodological objection, or a question about scope? Understanding the concern type helps you write a focused, direct response rather than a generic one.

3. **Write your outline in "My Reply".**
   Write bullet points or rough sentences covering your key points. Do not aim for polished prose — the LLM will handle that. Good outline content includes:
   - The direct answer to the concern (yes, no, or why it depends).
   - Specific evidence (experiment numbers, table references, equation citations).
   - Any clarification of what the reviewer may have misunderstood.

4. **Insert supporting structures when needed.**
   Right-click in "My Reply" to insert a Table or Code block:
   - Use **Insert Table** for side-by-side comparisons (your method vs. baselines, before/after numbers).
   - Use **Insert Code** for algorithm listings or configuration details.

   Embedded tables and code blocks are preserved through the Refine step.

5. **Click "Refine".**
   The LLM receives the quoted issue and your draft outline, then generates a polished response. It selects a contextually appropriate courtesy opening phrase, structures your points into clear paragraphs, and formats the output with the standard `> Reviewer's Comment` / `**Response**:` block.

6. **Read and edit the Refined Draft.**
   This is the most important step. Go through the generated text sentence by sentence:
   - Verify every number, citation, and claim against your actual results.
   - Check that no points from your outline were dropped.
   - Confirm the tone is confident and direct, not defensive or dismissive.
   - Edit the panel directly for any corrections.

   If a key point is missing, add it manually rather than re-running Refine, since re-running will overwrite any edits you have already made to the panel.

7. **Use "Auto Fit" to restore row heights.**
   After filling in several rows, click Auto Fit to normalize the table layout.

8. **Repeat for every row.**
   Stage 2 is complete only when every row has a non-empty, reviewed Refined Draft.

## Tips and Best Practices

- **More outline input → better Refined output.** Write at least 2–3 substantive bullet points before clicking Refine. A one-line outline produces a shallow, generic response. Specific technical details (numbers, references, experimental conditions) produce specific, accurate responses.
- **Use tables for numeric results.** If you are addressing a concern about missing experiments, embed the numbers using Insert Table. The Refined Draft will preserve the table structure.
- **Multiple bullets → multiple paragraphs.** Each bullet point in your outline tends to map to a separate paragraph in the Refined Draft. Use this intentionally if you want to address sub-points with clear visual separation.
- **Read the output aloud.** This quickly catches unnatural phrasing, repeated sentence structures, or places where the LLM lost the thread of your argument.
- **Stage 2 is your last chance to add content.** Stage 3 is about formatting and assembly, not writing. Any concern not addressed here will not appear in the final rebuttal.

## What to Expect

A complete Stage 2 has every Response row filled with a non-empty, manually reviewed Refined Draft. Good output for each row:

- Opens with a contextually appropriate courtesy phrase.
- Directly quotes the reviewer's concern as a blockquote.
- Addresses the concern in 1–3 focused paragraphs with specific evidence.
- Contains no invented numbers, unverified citations, or vague claims.

**When to redo:** If a Refined Draft completely misses the point of the concern, or if the output is significantly worse than your outline, check that your outline was clear and specific. A vague or one-line outline almost always produces a vague output.

## Next Steps

Once every issue has a verified Refined Draft, move to **[Stage 3 — First Round](./stage3-first-round.md)** to assemble the full rebuttal document and prepare it for submission.

---

[← Stage 1 — Breakdown](./stage1-breakdown.md) | [Stage 3 — First Round →](./stage3-first-round.md)
