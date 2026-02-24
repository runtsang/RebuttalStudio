# Stage 1 — Breakdown

Stage 1 transforms a raw reviewer comment into a structured, atomic issue list. It extracts numeric scores, preserves the reviewer's summary and strengths, and splits weaknesses and questions into individual addressable items — so that nothing gets missed and every concern can be answered systematically in Stage 2.

## In the Pipeline

```
[Start] → Stage 1: Breakdown → Stage 2: Reply → Stage 3: First Round → ...
```

This is the foundation stage. The issue list you produce here determines the structure of everything that follows — Stage 2 drafts, Stage 3 formatting, and the Key Concerns table in Stage 5. Take the time to get it right.

## Before You Begin

- [ ] You have created a project and selected the correct conference (ICLR or ICML) — this controls which score fields are extracted.
- [ ] You have the reviewer's complete comment ready to paste (all sections: summary, strengths, weaknesses, questions, and ratings).
- [ ] Your API key is configured in **API Settings** (required for the "Break down" button).

> **Note:** If you only paste the weaknesses and skip the summary, the LLM loses context about the reviewer's overall stance. Always paste the full comment.

## Interface Overview

**Left panel — Reviewer Input**
A large text area where you paste the reviewer's raw comment. The reviewer tabs row at the top lets you switch between multiple reviewers in the same project. Use the `+` button on the tab row to add a new reviewer.

**Center column — Actions**
Contains the **Break down** button. Clicking it sends the left-panel content to the LLM for parsing. A loading indicator appears while the request is processing.

**Right panel — Structured Breakdown**
Displays the parsed output in four sections:

- **Scores** — Numeric ratings extracted from the review. For ICLR: Rating, Confidence, Soundness, Presentation, Contribution. For ICML: the same five fields, plus Significance and Originality.
- **Summary** — The reviewer's overall summary, preserved verbatim.
- **Strengths** — The reviewer's positive remarks, preserved verbatim.
- **Atomic Issues** — The list of individual weaknesses and questions, each as a separate response item with a short title and a quoted source excerpt.

> **Conference note:** ICLR extracts 5 scores; ICML extracts 7 (adds Significance and Originality). If your conference is not yet listed, select the closer match and verify the score fields manually.

## Step-by-Step Walkthrough

1. **Open or create a project.**
   On the home screen, create a new project and select your conference (ICLR or ICML). This setting affects which score fields the parser looks for, so choose before you paste any content.

2. **Select the reviewer tab you want to work on.**
   Each reviewer in your project gets its own tab. If this is a new project, there is one tab by default. Add more with the `+` button on the tab row.

3. **Paste the reviewer's full comment into the left panel.**
   Copy the entire review from OpenReview (or your conference platform) and paste it as-is. Do not trim sections — the LLM uses the summary and strengths to understand the context behind each weakness.

4. **Click "Break down".**
   The LLM parses the review, identifies section boundaries, extracts numeric scores, and generates atomic issues. Each weakness and question in the review becomes a separate Response item, labeled `weakness1`, `weakness2`, …, `question1`, `question2`, and so on.

5. **Verify the scores panel.**
   Check that each score field contains a number, not a placeholder letter or dash. If a value looks wrong, check the raw review text for formatting issues (e.g., the reviewer wrote "8/10" instead of just "8") and re-run.

6. **Review each atomic issue.**
   Read through the generated issue list. Each item should represent one coherent concern that can be addressed in a single response paragraph. Look for:
   - Issues that were incorrectly merged (one item covers two unrelated criticisms).
   - Issues that were incorrectly split (one criticism divided into two items when it is really one point).

7. **Add missing issues with `+`.**
   If a concern from the review was not captured, click `+` to open the **Add Atomic Issue** modal. Set the **Type** (weakness or question), enter a short **Title**, and paste the relevant **Content** from the review. Click "Add" to append it to the list.

8. **Split oversized issues with "Split".**
   If one item contains two distinct criticisms, click **Split** to open the Split Issue modal. Place your cursor in the text exactly where you want to divide it, then click **Split at Cursor**. This creates two separate items from the single original.

9. **Rename reviewer tabs for clarity.**
   Right-click a reviewer tab and select **Rename** to assign a 4-character identifier (e.g., the reviewer's OpenReview hash like `cH6y` or `Ab1C`). This identifier appears throughout Stage 5, so using the real OpenReview ID makes cross-referencing easy.

## Tips and Best Practices

- **Paste the full review, every time.** The LLM uses the summary and strengths sections to interpret ambiguous weakness statements. Pasting only the weaknesses produces lower-quality issue extraction.
- **Don't over-split.** One atomic issue should correspond to one thing you need to explain or demonstrate. If two bullet points in the review are arguing the same underlying concern, keep them as one item.
- **Verify the issue count against the original review.** Count the weaknesses and questions in the raw text. The generated list should have roughly the same number of items, not significantly fewer.
- **Use real reviewer IDs for tab names.** OpenReview assigns short alphanumeric hashes to anonymous reviewers (visible in their comments). Using these as tab names means the reviewer IDs in your Stage 5 Final Remarks will match what the Area Chair sees.
- **Re-running is cheap.** If the breakdown looks wrong, clean up the raw input and click "Break down" again. Manually-added issues from `+` are preserved and will not be overwritten on re-run.

## What to Expect

A well-executed Stage 1 breakdown produces:

- All numeric score fields populated with integers (no dashes or letters).
- An atomic issue list with 4–12 items for a typical ICLR/ICML review.
- Each item titled with a short, descriptive phrase (e.g., "Regarding missing baseline comparison on Dataset X").
- No two items that substantially overlap in what they are asking you to address.

**When to re-do:** If any score shows a non-numeric placeholder, or if clearly distinct concerns were merged into a single issue, clean up the raw input and re-run before proceeding. A clean issue list here saves time across all subsequent stages.

## Next Steps

Once your issue list is clean and complete, move to **[Stage 2 — Reply](./stage2-reply.md)** to begin drafting your point-by-point responses.

---

[Stage 2 — Reply →](./stage2-reply.md)
