---
name: rebuttal-studio
description: Use when the user is working on an academic paper rebuttal or author response - reviews from ICLR, ICML, NeurIPS, ARR/ACL/EMNLP, or another OpenReview-style venue have to be broken down, answered point by point, formatted for posting, followed up during the discussion, or summarized in final remarks to the Area Chair, or when a silent reviewer needs a nudge or the AC a confidential note. Triggers include "rebuttal", "author response", "respond to reviewers", "reviewer comments", "final remarks", "写 rebuttal", "回复审稿人", "审稿意见".
---

# Rebuttal Studio

## Overview

The five-stage workflow of the Rebuttal Studio editor, run as a conversation. The author decides **what** to say; this skill fixes **how** it is structured, formatted, and polished.

Core principle: every sentence of a response traces to the author. What only the author can know goes into a slot, never into a guess.

## Contracts

These hold in every stage.

1. **Sentence sources.** Each sentence of a response body is one of: (a) the author's outline, restated; (b) a fact read from a file the author provided (paper, results, logs), with its location; (c) a courtesy opener or transition; (d) a slot: `[AUTHOR INPUT NEEDED: what is missing]`. The review is the source for what the reviewer said (quotes, acknowledged strengths), not for facts about the paper. Examples in this skill's files show format only and are never a source of facts.
2. **Slots.** One slot per missing piece of information. An issue the author has said nothing about gets a body of exactly one slot that names what the answer needs.
3. **Quotes.** Reviewer text is copied verbatim, as exact substrings of the review. When one bullet is split into several issues, each piece is an exact substring: the joining connective ("and", "Also,") and the punctuation next to it are left out, and a piece may begin in lowercase.
4. **Formats.** Templates in `references/templates.md` are copied character for character. Only bracketed parts and `{{placeholders}}` change.
5. **Status.** A document with open slots is a draft. Deliver it with a numbered list of its slots. A document is called ready only when it has none.
6. **Language.** Talk to the author in the author's language. Write rebuttal text in English unless told otherwise.
7. **Checkpoints.** Show each stage's output and get the author's confirmation before starting the next stage. When the author asks for everything in one pass, run every stage the inputs allow (a first-round request ends at Stage 3) and deliver the result under contract 5.

## Setup

Ask once, in one message, for whatever is missing:

- Venue, submission number, and each reviewer's ID with the full review text.
- The limit per comment, and whether it counts characters or words.
- Theme color as a 6-digit hex (default `#f26921`, orange). For a color given in words, use template 1's mapping and state the hex.
- Paper source and result files, if available.

Keep the work in files so later rounds can resume:

```
rebuttal/
├── paper-memory.md            # optional background summary of the paper
├── <reviewerId>/
│   ├── breakdown.md           # Stage 1
│   ├── replies.md             # Stage 2: outline and refined reply per issue
│   ├── first-round.md         # Stage 3: status and slot list, then each paste-ready part
│   └── followups.md           # Stage 4: condensed context and each round
├── final-remarks.md           # Stage 5
└── messages.md                # optional: reviewer nudges and notes to the AC
```

When a paper is available, write `paper-memory.md` with the headings of template 11. It is background: it never overrides a review or the author's outline.

## Stage 1 - Breakdown

Per reviewer, write `breakdown.md` using template 6:

1. Extract the venue's scores, numbers only. Field mappings: `references/venues.md`.
2. Copy the summary and strengths verbatim.
3. Split every section that needs an answer into atomic issues, one independent concern or request each. Split on: several asks joined by "and", "also", "in addition", "furthermore"; a topic shift inside one bullet; distinct actionable requests; different concern types in one item. Keep together the sentences that elaborate a single concern.
4. Number `weaknessN` and `questionN` independently, in order of appearance. The numbers follow the atomic issues, not the reviewer's own bullet numbers.
5. Give each issue one response entry: a short title ("Regarding ..."), `source`, `source_id`, and `quoted_issue`.
6. Check: every issue appears once, maps to exactly one response, and is verbatim.

Show the issue list. The author may merge, split, retitle, or reorder.

## Stage 2 - Reply

Per issue, in `replies.md` (entry layout: template 7):

1. **Outline first.** Collect the author's points: the direct answer, the evidence, what changes in the paper. To help, propose a comment type and a strategy (`references/quality.md`, section 1). When paper or result files were provided, a proposed outline may be drafted from them; label it "Proposed outline (unconfirmed)" and cite where each fact comes from. An issue with no outline is not refined: its entry reads `Outline: (none yet)` and its refined reply is one slot (contract 2).
2. **Refine** the outline into the working format of template 7:
   - An opener is optional: at most one from the opener bank, matched to the reviewer's intent, and none when no entry fits (a plain factual question starts with the answer).
   - Tie the answer to the quoted issue within the first two sentences.
   - For a novelty challenge, state what is new, why it matters, and how it differs from prior work.
   - One short paragraph per outline point; keep separate points separate.
   - Tables become Markdown tables, code becomes fenced blocks, formulas become `$...$` or `$$...$$`.
   - Keep the meaning of every technical claim. Commitments stay within what the outline promises.
   - A new citation enters only after verification (`references/quality.md`, section 5).
3. The author's edits to a refined reply are final.

## Stage 3 - First Round

Per reviewer, assemble `first-round.md`:

1. Opening paragraph (template 3), with `A`, `B`, `C` replaced by strengths this reviewer acknowledged.
2. One block per issue in breakdown order, in the point-to-point format (template 2): colored title `R<n>: Regarding ...`, quote label and verbatim quote, colored response label, body.
3. Closing paragraph (template 3).
4. Count the characters of the raw Markdown with a tool (`wc -m` or a short script), not by estimate. Over the limit: split between blocks and give each part its subject line (template 5). A draft with slots is counted as it stands; say that it has to be re-counted and re-split once the slots are filled.
5. Run the self-review checklist (`references/quality.md`, section 4). Report the items that fail or could not be verified; keep the checklist itself out of the paste-ready parts.

Deliver each part as a fenced block, preceded by its subject line and character count.

## Stage 4 - Multi Rounds

Per follow-up, in `followups.md` (record layout: template 8):

1. Condense the reviewer's first-round document into `Key Question(s)` / `Main Answer(s)` (template 8). Refresh it whenever `first-round.md` changes.
2. Record the follow-up verbatim and collect the author's draft points.
3. Write the reply: direct answer in the opening lines, grounded in the condensed context and the draft, consistent with the first round, pointing back where relevant ("As noted in our Response W2, ..."). One or two paragraphs.
4. A follow-up that raises a new concern is handled as a Stage 2 issue.

## Stage 5 - Final Remarks

Write `final-remarks.md` from template 9:

1. Inputs: every reviewer's condensed context including follow-ups, the original ratings from Stage 1, and final ratings only where a reviewer stated a change. Ask the author for those.
2. Keep the four sections in order. Fill each placeholder as its table row in template 9 describes.
3. Strengths: 4-5 bullets across reviewers. Concerns table: substantive concerns only (leave out typos, wording requests, and simple clarifications), correct reviewer IDs, a specific one-line response each.
4. Reviewer quotes are verbatim; score changes are only the explicit ones.
5. Write for the Area Chair: the text has to stand alone.
6. Count the characters as in Stage 3 and report the count. Ask the author which limit applies to the comment for the AC.

## Side tasks

| Request | Do |
| --- | --- |
| Nudge a silent reviewer; confidential note to the AC | Fill template 10 and save it in `messages.md`. Polish lightly: greeting, sign-off, paragraph order, and placeholders stay. Where a phrase no longer fits the situation (the discussion has already ended), adjust it and say what changed. |
| "Sounds like AI", "too stiff" | De-AI pass (`references/quality.md`, section 2) on the selected text only. |
| "Too long" | Condense pass (`references/quality.md`, section 3). |
| A reference was added | Citation verification (`references/quality.md`, section 5). |
| Manual formatting help | Hand over the matching template from `references/templates.md`. |

## Common mistakes

| Mistake | Correct form |
| --- | --- |
| Own label scheme (`W1a`, `\color{orange}{\textbf{...}}`) | `${\color{#f26921}\text{Response W1:}}$`, exactly as in template 2 |
| Response block without the reviewer's words | Every block carries the quote label and the verbatim quote |
| Improvised opening, closing, or part title | Templates 3 and 5 |
| A plausible argument the author never made, written as final text | A slot, or a proposed outline labeled unconfirmed |
| Describing a baseline or prior method from its name | A fact from the provided files, or a slot |
| Three slots in every block (answer, evidence, change) when the author gave nothing | One slot per untouched issue |
| Sub-labels that mirror the reviewer's bullets (`W1a`, `W1b`) | Atomic issues numbered in sequence: `Weakness-1`, `Weakness-2` |
| Length judged by eye | Counted with a tool, reported per part |
| A draft with open slots announced as ready to paste | "Draft, N slots open", with the slot list |

## References

- `references/templates.md` - every format as plain text: color token, response block, opening and closing, splitting, breakdown skeleton, opener bank, follow-ups, final remarks with a filled example, reviewer and AC messages, reusable phrases.
- `references/venues.md` - score and section mappings for ICLR, ICML, NeurIPS, and ARR.
- `references/quality.md` - comment classification and strategy, de-AI pass, condense pass, self-review checklist, citation verification.
