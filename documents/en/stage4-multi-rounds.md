# Stage 4 — Multi Rounds

Stage 4 handles follow-up questions that arrive after your initial rebuttal during the discussion period. Instead of crafting responses in isolation, each Stage 4 run first compresses your Stage 3 rebuttal into a compact context block, then uses that context when refining your follow-up draft — so your responses stay consistent with what you already argued and do not repeat or contradict your earlier answers.

## In the Pipeline

```
... → Stage 3: First Round → Stage 4: Multi Rounds (optional) → Stage 5: Final Remarks
```

Stage 4 is optional — you only need it if reviewers engage during the discussion period with follow-up questions or clarifications. It can be used multiple times for the same reviewer if the discussion spans multiple rounds.

## Before You Begin

- [ ] Stage 3 is complete for the reviewer who asked the follow-up question.
- [ ] You have received the reviewer's follow-up question from the conference platform.
- [ ] Your API key is configured in **API Settings**.
- [ ] If you want extra paper background available during refinement, your project-level **Document Memory** is already prepared.

> **Note:** If multiple reviewers ask follow-up questions, work through them one reviewer at a time using their respective tabs.

## Interface Overview

**Reviewer tabs**
The same reviewer tabs from Stages 1–3 carry over. Select the tab for the reviewer who sent the follow-up.

**Follow-up question input (top area)**
A text field where you paste the reviewer's follow-up question or comment verbatim from the conference platform.

**"Draft Editor" text area**
Your rough response draft. Use the same outline-first approach as Stage 2: write key points and evidence, not polished prose. The LLM handles the final language.

**Center-column "Refine" button**
Stage 4 uses the main center-column **Refine** button. One click runs a two-step pipeline:
- **Step 1:** read the current reviewer's Stage 3 `All` content and condense it into a compact summary with two sections:
  - `## Key Questions` — the main concerns the reviewer raised.
  - `## Main Answers` — your key responses to those concerns.
- **Step 2:** refine the new follow-up answer using the condensed context, the current follow-up question, your draft, and optional Document Memory.

The condensed context is saved locally for that reviewer and refreshed on each new Refine run, so it stays aligned with your latest Stage 3 content.

The saved condensed Markdown path is shown in the right panel after the step completes, so you can see that the local reviewer summary exists on disk.

**Right-side result panel + copy popup**
The generated follow-up response is stored in the right-side output panel. A copy popup also appears after a successful run so you can copy the result quickly without leaving the stage.

## Step-by-Step Walkthrough

1. **Select the correct reviewer tab.**
   Make sure you are on the tab for the reviewer who sent the follow-up.

2. **Paste the follow-up question into the top input field.**
   Copy the exact text of the reviewer's follow-up from OpenReview (or your conference platform) and paste it verbatim. Do not paraphrase — the LLM needs the original wording to respond accurately.

3. **Write your draft response in "Draft Editor".**
   Use the same outline-first approach as Stage 2:
   - State your direct answer first (agree, disagree, or clarify).
   - Include specific evidence or references to earlier responses.
   - If the follow-up raises a point you already addressed, note where ("As we explained in Response 3…").

4. **Click "Refine".**
   One run performs both internal steps:
   - Step 1 condenses the current Stage 3 `All` content for this reviewer and saves the condensed Markdown locally.
   - Step 2 uses that condensed context, the follow-up question, your draft, and optional Document Memory background to generate a coherent, context-aware follow-up response.

   The output is calibrated to the discussion register — more conversational than the formal Stage 3 rebuttal, while remaining professional.

5. **Review the result in the right panel or popup.**
   Read the generated response carefully:
   - Does it directly address the follow-up question?
   - Is it consistent with what you said in Stage 3 (no contradictions)?
   - Is it appropriately concise? Follow-up responses should generally be shorter than initial rebuttals.

6. **Copy and post to the conference platform.**
   Use the **Copy** button from the popup or the right panel and paste the response into OpenReview's discussion field.

7. **Repeat for subsequent rounds.**
   For each additional follow-up from the same reviewer: paste the new question, write a new draft, and click Refine again. The app will refresh the condensed context from your current Stage 3 content each time.

## Tips and Best Practices

- **Refine already includes Condense.** You do not need to hunt for a separate button. Just make sure Stage 3 `All` content is up to date before you run Stage 4 Refine.
- **Document Memory is secondary context.** It can help remind the model of the paper's methods or experiments, but the follow-up answer should still be driven by the actual follow-up question and your current draft.
- **Explicitly reference prior responses in your draft when relevant.** If the reviewer is revisiting something from Stage 3, include a phrase like "As noted in our response to Weakness 2…" in your draft. The LLM will preserve this framing in the output.
- **Keep follow-up responses focused and short.** Reviewers asking follow-up questions are typically looking for targeted clarification, not a new essay. Aim for 1–2 paragraphs unless the question requires a detailed new explanation.
- **If a follow-up raises a genuinely new concern not covered in Stage 1–3**, treat it like a Stage 2 issue: outline your technical answer in detail before clicking Refine.
- **For multi-round discussions**, each new Refine run refreshes the condensed context from your current Stage 3 source. If you edited Stage 3 after an earlier discussion turn, Stage 4 will pick up the updated context on the next run.

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
