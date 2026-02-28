# Stage 4 — Multi Rounds

Stage 4 handles follow-up questions that arrive after your initial rebuttal during the discussion period. Instead of crafting responses in isolation, it first compresses your Stage 3 rebuttal into a compact context block, then uses that context when refining your follow-up draft — so your responses stay consistent with what you already argued and do not repeat or contradict your earlier answers.

## In the Pipeline

```
... → Stage 3: First Round → Stage 4: Multi Rounds (optional) → Stage 5: Final Remarks
```

Stage 4 is optional — you only need it if reviewers engage during the discussion period with follow-up questions or clarifications. It can be used multiple times for the same reviewer if the discussion spans multiple rounds.

## Before You Begin

- [ ] Stage 3 is complete for the reviewer who asked the follow-up question.
- [ ] You have received the reviewer's follow-up question from the conference platform.
- [ ] Your API key is configured in **API Settings**.

> **Note:** If multiple reviewers ask follow-up questions, work through them one reviewer at a time using their respective tabs.

## Interface Overview

**Reviewer tabs**
The same reviewer tabs from Stages 1–3 carry over. Select the tab for the reviewer who sent the follow-up.

**Follow-up question input (top area)**
A text field where you paste the reviewer's follow-up question or comment verbatim from the conference platform.

**"Draft Editor" text area**
Your rough response draft. Use the same outline-first approach as Stage 2: write key points and evidence, not polished prose. The LLM handles the final language.

**"Condense" button**
Reads your Stage 3 "All" content for this reviewer and compresses it into a compact summary with two sections:
- `## Key Questions` — the main concerns the reviewer raised.
- `## Main Answers` — your key responses to those concerns.

This condensed context is stored and automatically used by subsequent Refine calls for this reviewer. **You only need to run Condense once per reviewer.** For all subsequent follow-up rounds, the stored context is reused.

**"Refine" button**
Takes three inputs — the condensed Stage 3 context, the current follow-up question, and your draft — and generates a polished, context-aware follow-up response. The result appears in a popup dialog.

**Result popup**
Shows the generated follow-up response with a **Copy** button and a **Close** button.

## Step-by-Step Walkthrough

1. **Select the correct reviewer tab.**
   Make sure you are on the tab for the reviewer who sent the follow-up.

2. **Paste the follow-up question into the top input field.**
   Copy the exact text of the reviewer's follow-up from OpenReview (or your conference platform) and paste it verbatim. Do not paraphrase — the LLM needs the original wording to respond accurately.

3. **Click "Condense" (first time only for this reviewer).**
   This step compresses your entire Stage 3 rebuttal for this reviewer into a compact context block. Without it, the Refine step cannot reference your prior arguments, and the generated follow-up may contradict or ignore what you already wrote.

   > **Warning:** Do not skip Condense before the first Refine. A follow-up response generated without context has no awareness of your previous arguments and risks inconsistency with your Stage 3 rebuttal.

   Once Condense has run for a reviewer, the result is stored. You do not need to run it again for subsequent follow-up rounds with the same reviewer.

4. **Write your draft response in "Draft Editor".**
   Use the same outline-first approach as Stage 2:
   - State your direct answer first (agree, disagree, or clarify).
   - Include specific evidence or references to earlier responses.
   - If the follow-up raises a point you already addressed, note where ("As we explained in Response 3…").

5. **Click "Refine".**
   The LLM receives the condensed context, the follow-up question, and your draft, and generates a coherent, context-aware follow-up response. The output is calibrated to the discussion register — more conversational than the formal Stage 3 rebuttal, while remaining professional.

6. **Review the result in the popup.**
   Read the generated response carefully:
   - Does it directly address the follow-up question?
   - Is it consistent with what you said in Stage 3 (no contradictions)?
   - Is it appropriately concise? Follow-up responses should generally be shorter than initial rebuttals.

7. **Copy and post to the conference platform.**
   Click "Copy" in the popup and paste the response into OpenReview's discussion field.

8. **Repeat for subsequent rounds.**
   For each additional follow-up from the same reviewer: paste the new question, write a new draft in Draft Editor, click Refine. The stored condensed context persists across all rounds for this reviewer.

## Tips and Best Practices

- **Always run Condense before the first Refine.** This single step is what makes Stage 4 context-aware. Skipping it removes the primary benefit of the stage.
- **Explicitly reference prior responses in your draft when relevant.** If the reviewer is revisiting something from Stage 3, include a phrase like "As noted in our response to Weakness 2…" in your draft. The LLM will preserve this framing in the output.
- **Keep follow-up responses focused and short.** Reviewers asking follow-up questions are typically looking for targeted clarification, not a new essay. Aim for 1–2 paragraphs unless the question requires a detailed new explanation.
- **If a follow-up raises a genuinely new concern not covered in Stage 1–3**, treat it like a Stage 2 issue: outline your technical answer in detail before clicking Refine.
- **For multi-round discussions** (third, fourth exchange), the condensed context from the first Condense run is still sufficient for subsequent Refine calls — it captures the essence of the original rebuttal, which is the relevant baseline throughout the discussion.

## What to Expect

A good Stage 4 follow-up response:

- Opens by directly acknowledging the specific follow-up question.
- References your prior Stage 3 response where relevant (e.g., "As discussed in our initial response…").
- Is noticeably shorter than a Stage 3 response — 1–2 focused paragraphs is typical.
- Maintains the same professional tone as Stage 3 while being slightly more conversational.
- Does not introduce new claims or experiments that were not in your draft.

## Next Steps

Once all active discussion threads are resolved, move to **[Stage 5 — Final Remarks](./stage5-final-remarks.md)** to write the Final Remarks for Area Chairs summarizing the full rebuttal outcome.

---

[← Stage 3 — First Round](./stage3-first-round.md) | [Stage 5 — Final Remarks →](./stage5-final-remarks.md)
