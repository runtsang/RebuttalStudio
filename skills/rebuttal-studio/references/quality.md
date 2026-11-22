# Strategy and Quality Passes

Stage-general guidance: how to plan a reply, and the passes to run on finished text.

## Contents

1. [Classify the comment, pick a strategy](#1-classify-the-comment-pick-a-strategy)
2. [De-AI pass](#2-de-ai-pass)
3. [Condense pass](#3-condense-pass)
4. [Self-review before submission](#4-self-review-before-submission)
5. [Citation verification](#5-citation-verification)

---

## 1. Classify the comment, pick a strategy

| Type | What it is | Example |
| --- | --- | --- |
| Major | Core scientific or methodological concern that affects the conclusions | "The baseline comparison is unfair" |
| Minor | Presentation, wording, or a supplementary experiment | "Figure 3 is hard to read", "Missing ablation on X" |
| Misunderstanding | The reviewer misread the paper | "No comparison with Y" (Y is in Table 2) |
| Typo / Clarity | Factual slip, grammar, unclear exposition | "Definition 2 appears to be incorrect" |

| Strategy | When | Core move |
| --- | --- | --- |
| Accept | The reviewer is right | Say so, describe the change, point to its location |
| Defend | A real scientific disagreement | Evidence, prior work, extra data if it exists |
| Clarify | The paper already addresses it | Quote the relevant section and explain |
| Experiment | Extra empirical validation is requested | Describe the experiment and give the result |

Propose a type and a strategy for each issue; the author decides.

Principles for every response:

1. Acknowledge what the reviewer recognized before addressing the concern.
2. Anchor every claim to a paper section, a result, a verified citation, or a new experiment.
3. Answer every concern. Silence reads as evasion; one sentence is better than none.
4. No defensive language. Not "the reviewer is incorrect" but "We believe this may stem from ...".
5. Concise, but never at the cost of leaving a concern half-answered.

What tends to work: lead with appreciation; add intuition where the reviewer got lost; justify each major experimental choice; address ethics and limitations head-on; say one concrete thing about practical value or scalability.

## 2. De-AI pass

Every sentence in a rebuttal should be true only for this paper. A sentence that could sit in any rebuttal gets rewritten or cut. Make targeted edits; do not rewrite from scratch.

Cut filler and emphasis crutches:

| Remove | Use |
| --- | --- |
| In order to address this concern ... | To address this ... |
| It is worth noting that / It is important to highlight that | (state the point) |
| We would like to clarify that | We clarify that |
| Due to the fact that | Because |
| crucial, pivotal, paramount, delve into, unpack | (delete or be specific) |
| additionally, furthermore (as openers) | restructure the sentence |
| leverage, utilize | use |
| facilitate | help, enable |
| demonstrate | show |
| comprehensive, novel | say what is covered, say what is new |

Break formulaic structures: negative parallelism ("not just X, but Y"), a forced list of three, "First ... Second ... Third ..." in every response, em-dash reveals, a punchy one-liner closing every paragraph.

Trust the reviewer: conclusion first, no hand-holding, no stacked hedges ("could potentially perhaps").

Use "we" plainly: "We argue that ...", not "The authors feel it may be the case that ...".

Score each response block from 0 to 10 on five dimensions:

| Dimension | 0 | 10 |
| --- | --- | --- |
| Directness | Answer buried behind filler | Answer in the first sentence |
| Specificity | Could appear in any rebuttal | Names this paper's results and this comment |
| Rhythm | Uniform sentence length | Short and long sentences mixed |
| Tone | Defensive or stiff | Collegial, confident, factual |
| Density | Padded with acknowledgments | Every sentence moves forward |

40-50: ready. 30-39: targeted edits. Below 30: rewrite from the author's outline.

Never touch technical claims, numbers, citations, placeholders, quoted reviewer text, or the block structure and labels.

## 3. Condense pass

Shorten without changing what is said.

1. Preserve the meaning exactly and keep the original language.
2. Remove filler, repetition, and unnecessary hedging.
3. Preserve every technical claim, number, equation, citation, named entity, and placeholder.
4. Preserve reviewer quotations and structural labels.
5. Add no information, interpretation, promise, or evidence.
6. Keep stance, polarity, and confidence level.
7. Keep the paragraph, list, and Markdown structure.
8. When the text is already tight, change almost nothing.

## 4. Self-review before submission

Run after assembling a first-round document, after each follow-up, and after the final remarks.

Coverage:
- [ ] Every atomic issue from the breakdown has a response block.
- [ ] Every follow-up question was answered.
- [ ] An issue that cannot be addressed now says so and says why.

Tone:
- [ ] Each reviewer section opens with thanks tied to what that reviewer acknowledged.
- [ ] No defensive phrasing, sarcasm, or frustration.
- [ ] Disagreements read as clarifications.
- [ ] Commitments are concrete ("We will add X in Section Y").

Facts:
- [ ] Every number matches the paper or the author's notes.
- [ ] No experiment is claimed that was not run.
- [ ] Every new citation is verified (section 5).
- [ ] Every Section/Table/Figure pointer is correct.

Structure:
- [ ] Quoted reviewer text precedes each response and is verbatim.
- [ ] Labels are consistent and one theme color is used throughout.
- [ ] No `[AUTHOR INPUT NEEDED]` slot, `{{placeholder}}`, or literal "A, B, and C" remains.
- [ ] Each part fits the platform limit.

Clarity:
- [ ] Each response states its conclusion within its first two sentences, right after the opener if there is one.
- [ ] Tables are readable on their own; notation matches the paper.
- [ ] Nothing is longer than it needs to be.

Common errors:

| Error | Fix |
| --- | --- |
| Silent skip: an issue has no response | Add at least one sentence |
| Over-promising: "We will completely redesign Section 4" | Scope it: "We will add a clarifying paragraph to Section 4" |
| Wrong pointer: "See Table 3" for data in Table 2 | Check every reference |
| Defensive pivot: reframing instead of answering | Answer first, then give context |
| Invisible result: "We ran this experiment" with no numbers | Give the result or say it will appear in the revision |

## 5. Citation verification

Core rule: no citation enters a rebuttal unless it was looked up and confirmed. A submitted rebuttal cannot be corrected, and one fabricated reference discredits the whole response.

Verify any citation that was suggested by a model, recalled from memory, copied from a reviewer comment, or added to answer a "missing baseline" or "missing related work" claim. Citations already in the paper's reference list only need a check that the cited claim is really in that work.

Workflow:

1. Search: Google Scholar, Semantic Scholar, arXiv, ACL Anthology, OpenReview.
2. Confirm existence: title, first author, year (within one year; preprint and proceedings years differ), venue (workshop is not main conference).
3. Confirm the claim: find the sentence, table, or figure that supports it. Without access to the full text, cite more conservatively or drop it.
4. Record it as `[Author et al., Year, "Title", Venue]`.

When verification fails: drop the citation, or hedge without naming a paper, or mark it `[CITATION NEEDED - verify before submission: "title"]` for the author. Never leave an unverified citation in text that is presented as ready.

| Source of the citation | Risk | Action |
| --- | --- | --- |
| Suggested by a model | Very high | Always verify |
| Recalled from memory | Medium | Verify title and year |
| Copied from a reviewer comment | Medium | Verify existence; reviewers can be wrong |
| Already in the paper's references | Low | Confirm the claim is in that paper |

A reviewer-suggested baseline may not be comparable. Check that it evaluates on the same task and setting before agreeing to compare.

---

Sections 1, 2, 4, and 5 are adapted from [Claude Scholar](https://github.com/Galaxy-Dawn/claude-scholar) by gaoruizhang (MIT License), reworked for rebuttals. The de-AI pass builds on Wikipedia's "Signs of AI writing" guide by WikiProject AI Cleanup.
