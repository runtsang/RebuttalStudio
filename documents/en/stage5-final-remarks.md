# Stage 5 — Final Remarks

Stage 5 generates the **Final Remarks** addressed to Area Chairs (ACs) — a structured, high-level summary of the entire rebuttal that helps the AC make an informed decision. Unlike the per-reviewer responses in Stage 3, the Final Remarks speak to the AC directly: they summarize the key strengths of your work, the main concerns that were raised, how you addressed them, and the concrete revisions you have committed to making.

## In the Pipeline

```
... → Stage 3: First Round → Stage 4: Multi Rounds (optional) → Stage 5: Final Remarks [End]
```

Stage 5 is the final stage. It synthesizes information from all prior stages — the reviewer concerns, your responses, and any discussion outcomes — into a single document.

## Before You Begin

- [ ] Stage 3 (and optionally Stage 4) is complete for **all** reviewers in this project.
- [ ] You know whether any reviewers explicitly indicated they would raise their score during the discussion.
- [ ] Your API key is configured in **API Settings** (required for Auto Fill).

> **Note:** The Final Remarks are read by the Area Chair, not the individual reviewers. Write for an audience that has reviewed your paper at a high level but has not read every detail of your per-reviewer responses.

## Interface Overview

**"Template" button**
Opens the Final Remarks Template modal with a style selector. Applying a template resets the Stage 5 editor to the selected template skeleton. The template contains four numbered sections with placeholder tokens.

**Left panel — Raw source editor**
A Markdown editor pre-filled with the template structure. You can edit this directly. The four sections of the template are:

- **I. Acknowledgments** — Overall tone of the discussion; what happened before and during the rebuttal period; any explicit score changes.
- **II. Key Strengths** — 4–5 bullet points summarizing the positive aspects of your work, drawn from across all reviewers' evaluations.
- **III. Key Concerns and Our Responses** — A Markdown table with one row per major concern, three columns: Key Concern | Reviewer(s) | Our Response Summary.
- **IV. Commitment to Revision** — A concrete list of changes you have already made or committed to making in the revised manuscript.

**Rating change fields (per reviewer)**
Fields for entering the **Original Rating** and **Final Rating** for each reviewer. Fill these when a reviewer stated during the discussion that they would raise their score. This data is used to populate the Acknowledgments section.

**"Auto Fill" button**
Triggers the LLM to fill all template placeholder tokens automatically. The LLM reads the condensed context from all reviewers' Stage 4 (or Stage 3, if Stage 4 was not used) and generates appropriate content for each placeholder.

**"Preview" button**
Renders the current raw Markdown in the editor as formatted HTML, so you can see exactly what the Final Remarks will look like when copied and displayed.

## Step-by-Step Walkthrough

1. **Click "Template" and apply the template.**
   This loads the skeleton with all placeholder tokens. Start from the template rather than a blank editor to ensure the four-section structure is in place.

2. **Fill in the rating change fields.**
   For each reviewer who explicitly stated they would raise their score during the discussion, enter their original rating and their new rating in the corresponding fields. Leave the fields blank for reviewers who did not indicate a change. This data will be incorporated into the Acknowledgments section when Auto Fill runs.

3. **Click "Auto Fill".**
   The LLM reads the condensed discussion context for each reviewer and fills the placeholder tokens with appropriate content:
   - Acknowledgments paragraphs (overall, before discussion, during discussion).
   - Key Strengths bullet list drawn from positive reviewer feedback.
   - Key Concerns table rows, one per substantive concern raised across reviewers.
   - Commitment to Revision items.

4. **Review and edit the raw source — section by section.**

   **I. Acknowledgments:**
   - Verify the overall tone accurately reflects how the rebuttal went.
   - If a reviewer explicitly raised their score, confirm this is mentioned here.
   - If no reviewer changed their score, check that the section is still honest and not overly optimistic.

   **II. Key Strengths:**
   - Confirm the bullet points represent actual strengths the reviewers acknowledged, not invented claims.
   - Aim for 4–5 bullets that cover complementary aspects of your work (novelty, rigor, results, clarity).

   **III. Key Concerns and Our Responses:**
   - This is the most important section for the AC. Each row should represent one real, substantive concern.
   - Verify the Reviewer(s) column shows the correct reviewer ID(s) for each concern.
   - Check that the "Our Response Summary" column accurately reflects what you argued — not a generic "we addressed this" but a brief, specific summary.
   - Remove any rows that are trivially resolved concerns (minor typos, requests for references that you simply added) — the table should focus on substantive methodological or empirical concerns.

   **IV. Commitment to Revision:**
   - List specific, named changes (e.g., "Added Table 4 comparing our method against X and Y on Dataset Z", "Revised Section 3.2 to clarify the distinction between our approach and prior work").
   - Avoid vague commitments like "we will improve the clarity" — they are unconvincing to ACs.

5. **Click "Preview" to check the rendering.**
   Review the formatted output. Pay attention to:
   - Table alignment in the Key Concerns section.
   - Markdown formatting (bold, bullet lists) rendering correctly.
   - Any `{{placeholder}}` tokens that were not filled by Auto Fill and still need manual replacement.

6. **Copy and submit.**
   Once the Preview looks correct, copy the rendered text (or the raw Markdown, depending on your platform's input format) and paste it into the appropriate field on your conference platform.

## Tips and Best Practices

- **Write for the AC, not the reviewer.** The AC has read your paper but may not have read every line of your rebuttal. The Final Remarks should stand alone — they should make sense without the reader having to cross-reference all your Stage 3 responses.
- **Quote explicit rating changes.** If a reviewer said "I'm raising my score to 7" or "I'm now leaning towards accept," paraphrase this directly in the Acknowledgments section. ACs weight explicit reviewer statements heavily.
- **The Key Concerns table is the centerpiece.** ACs use this table to quickly assess whether the paper's main issues have been substantively addressed. Make each row precise and accurate.
- **Do not use Auto Fill without reviewing every sentence.** The LLM may misattribute a concern to the wrong reviewer, or generate a response summary that is imprecise. Treat Auto Fill as a starting draft, not a final product.
- **Commitment to Revision should be specific and credible.** Named experiments, specific sections, and concrete additions are far more persuasive than general promises to revise.

## What to Expect

A complete Stage 5 Final Remarks document:

- Has all four template sections filled with accurate, reviewer-specific content (no unfilled `{{placeholder}}` tokens).
- Acknowledgments section that accurately reflects the discussion outcome, including any score changes.
- A Key Strengths list with 4–5 distinct, substantive bullet points.
- A Key Concerns table with 4–8 rows covering the main issues, each with correct reviewer attribution and a specific response summary.
- A Commitment to Revision with named, concrete changes.

---

[← Stage 4 — Multi Rounds](./stage4-multi-rounds.md) | [Back to Docs Overview](./README.md)
