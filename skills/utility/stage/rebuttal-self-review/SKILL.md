---
name: rebuttal-self-review
description: Systematic quality check for a completed rebuttal document before submission. Use after Stage 3 document compilation or after Stage 5 conclusion writing to verify completeness, tone, factual accuracy, and structural integrity. Catches common rebuttal errors before they reach reviewers.
tags: [Rebuttal, Quality, Review, Pre-Submission]
version: 1.0.0
source: Adapted from Claude Scholar (https://github.com/Galaxy-Dawn/claude-scholar), skills/paper-self-review/SKILL.md.
---

# Rebuttal Self-Review

> **RebuttalStudio Utility — Pre-Submission Check**
> Run this skill after Stage 3 or Stage 5 document generation, before copying the final text into OpenReview or the submission portal. It catches structural gaps, tone issues, and factual risks that stage-specific skills may have missed.

A systematic quality assurance checklist tailored for academic conference rebuttals (ICLR, ICML, NeurIPS, and similar venues).

---

## Overview

Unlike a paper, a rebuttal has a strict deadline, tight word limits, and must directly engage with specific reviewer concerns. This review process is optimized for those constraints: fast, targeted, and submission-ready focused.

**Recommended timing:**
- After Stage 3 compilation (before first-round submission)
- After Stage 5 final remarks (before conclusion submission)
- After each multi-round Stage 4 response (optional but recommended)

---

## Review Checklist

### 1. Coverage — Did You Address Everything?

The most common rebuttal failure is missing a reviewer concern.

```
Coverage Check:
- [ ] Count the total issues in Stage 1 breakdown for each reviewer
- [ ] Confirm each issue appears in the Stage 3 document
- [ ] For multi-round reviewers, confirm each follow-up was answered
- [ ] No reviewer's comment was silently dropped
- [ ] If an issue was not addressed, a reason is stated ("We will address this in the revision")
```

### 2. Tone — Is It Collaborative, Not Defensive?

```
Tone Check:
- [ ] Opening of each reviewer section thanks the reviewer
- [ ] No response uses defensive phrases ("The reviewer is wrong", "This criticism is unfounded")
- [ ] Disagreements are framed as clarifications ("We believe this may be due to…")
- [ ] Commitments are grounded ("We will add X in Section Y" not "We might consider…")
- [ ] No sarcasm or frustration, even with persistent or unfair reviews
```

### 3. Factual Accuracy — No Fabrication

```
Factual Check:
- [ ] All cited results match the actual paper numbers
- [ ] No experiment is claimed that was not actually run
- [ ] No citation is mentioned that has not been verified (see citation-verification skill)
- [ ] "Changes made" pointers (section/table/figure numbers) are accurate
- [ ] No comparison results were invented to satisfy a reviewer
```

### 4. Structure — Is It Easy to Navigate?

Conference rebuttals are read quickly. Structure affects perceived quality.

```
Structure Check:
- [ ] Each reviewer has a clearly labeled section
- [ ] Each concern has a visible label matching the Stage 1 breakdown title
- [ ] Quoted reviewer text appears before each response (using the Stage 2 format)
- [ ] The document reads in a logical order: per-reviewer, then per-issue
- [ ] For Stage 5: section headers (Acknowledgments / Key Strengths / Key Concerns / Commitment) are present
```

### 5. Clarity — Would a Tired Reviewer Understand It?

```
Clarity Check:
- [ ] Each response states its conclusion in the first sentence
- [ ] Technical claims are self-contained (no unexplained jargon for new terms)
- [ ] Tables are labeled and readable without surrounding text
- [ ] Formulas use consistent notation with the paper
- [ ] No response is longer than needed (trim to the minimum convincing length)
```

### 6. Writing Quality — Does It Sound Human-Authored?

```
Writing Check:
- [ ] No AI filler phrases ("It is worth noting that…", "Furthermore…" as opener)
- [ ] Sentence lengths are varied
- [ ] Claims are specific to this paper (not generic statements)
- [ ] If in doubt, apply writing-anti-ai skill to the full document
```

---

## Review Process

Follow these steps for a systematic pass:

**Pass 1 — Coverage scan (5 min)**
> Count all Stage 1 atomic issues. Open the Stage 3 document. Check off each issue.

**Pass 2 — Tone pass (10 min)**
> Read only the opening sentence of each response. Does each one feel collaborative? Fix any that don't.

**Pass 3 — Factual spot-check (10 min)**
> Pick 3–5 specific claims (percentages, section numbers, citation names). Verify them against the paper.

**Pass 4 — Structure skim (5 min)**
> Can you navigate from one reviewer to another, and one issue to another, in 30 seconds? If not, improve headings.

**Pass 5 — Final read-aloud (optional)**
> Read the document aloud or use text-to-speech. Awkward phrases become obvious when heard.

---

## Common Rebuttal Errors

| Error Type | Description | How to Fix |
|-----------|-------------|-----------|
| Silent skip | An issue has no response | Add even a one-sentence placeholder |
| Over-promising | "We will completely redesign Section 4" | Scope it: "We will add a clarifying paragraph to Section 4" |
| Unverified citation | Citing a paper you haven't confirmed exists | Apply citation-verification skill |
| Wrong pointer | "See Table 3" but the data is in Table 2 | Verify all section/figure/table references |
| Defensive pivot | Reframing the concern without addressing it | Address it directly first, then provide context |
| Invisible result | "We ran this experiment" with no numbers | Include the result or say "results will appear in the revision" |

---

## After the Review

Once all checks pass:

1. **For Stage 3**: Copy the compiled document to the submission portal. Respect word/character limits.
2. **For Stage 5**: Copy the final remarks to the conclusion box.
3. **Keep a local copy**: The project.json autosaves, but export a Markdown backup before submitting.

---

*Adapted from Claude Scholar's `paper-self-review` skill for the rebuttal context. Original: https://github.com/Galaxy-Dawn/claude-scholar/blob/main/skills/paper-self-review/SKILL.md*
