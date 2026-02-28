---
name: review-response
description: Systematic review response strategy guide for RebuttalStudio. Use when developing response strategies for reviewer comments, deciding how to classify concerns, or choosing between Accept/Defend/Clarify/Experiment approaches at any stage of the rebuttal pipeline.
tags: [Rebuttal, Strategy, Review, Academic]
version: 1.0.0
source: Adapted from Claude Scholar (https://github.com/Galaxy-Dawn/claude-scholar), skills/review-response/SKILL.md
---

# Review Response Strategy Guide

> **RebuttalStudio Utility — Stage-General**
> This skill applies across the full 5-stage rebuttal pipeline. It provides strategic guidance for classifying reviewer comments and choosing response approaches, complementing the stage-specific breakdown and refinement skills.

A systematic framework for analyzing reviewer comments and developing high-quality, professionally grounded rebuttal responses.

---

## Comment Classification

Every reviewer comment belongs to one of four types. Identify the type before selecting a strategy.

| Type | Description | Examples |
|------|-------------|---------|
| **Major** | Core scientific or methodological concerns that affect the paper's conclusions | "The baseline comparison is unfair", "The claims are unsupported by experiments" |
| **Minor** | Peripheral concerns about presentation, wording, or supplementary experiments | "Figure 3 is hard to read", "Missing ablation on X" |
| **Misunderstanding** | Reviewer has misread or misinterpreted the paper | "The authors do not compare with Y" (but Y is in Table 2) |
| **Typo / Clarity** | Factual errors, grammar, or unclear exposition | "Definition 2 appears to be incorrect", "Section 3 is confusing" |

---

## Response Strategies

After classification, select the appropriate response strategy:

| Strategy | When to Use | Core Approach |
|----------|-------------|---------------|
| **Accept** | Reviewer is correct; the concern is valid | Acknowledge explicitly, describe the change made, point to location |
| **Defend** | Reviewer's concern is based on a valid scientific disagreement | Provide evidence, cite prior work, offer additional data if available |
| **Clarify** | Reviewer has a misunderstanding that the paper actually addresses | Quote the relevant section, explain why the concern does not apply |
| **Experiment** | Reviewer requests additional empirical validation | Describe the experiment, provide preliminary results if possible |

---

## Core Principles

These apply to every response at every stage, from Stage 2 draft outlines to Stage 4 follow-up refinement:

1. **Acknowledge strengths before criticism** — Thank reviewers for recognized contributions before addressing concerns. Even a brief acknowledgment improves tone.

2. **Anchor to evidence** — Every claim in a response must be backed by: a paper section, a result in the supplementary, a cited prior work, or a new experiment. Do not assert without grounding.

3. **Address all concerns** — An unreplied-to comment is treated by reviewers as evasion. Even a one-sentence acknowledgment is better than silence.

4. **No defensive language** — Phrases like "the reviewer is incorrect" or "this criticism is unfounded" damage tone. Prefer collaborative phrasing: "We believe this may stem from…", "To clarify our intent…"

5. **Completeness over brevity** — Concision matters, but do not sacrifice completeness. A reviewer who feels dismissed will lower the score.

---

## Success Factors (from ICLR Spotlight Paper Analysis)

Key lessons distilled from analyzing accepted papers' rebuttals:

### 1. Acknowledge Strengths, Respond Positively to Criticism
- Even spotlight papers receive constructive criticism
- Reviewers are more receptive when they feel their positive observations were noted
- **Strategy**: Lead with appreciation, then address each concern specifically

### 2. Provide Clarity and Intuitive Understanding
- High-quality work can still have presentation gaps
- Reviewers with different backgrounds may need extra scaffolding
- **Strategy**: Expand explanations inline, move heavy derivations to appendix, add step-by-step walkthroughs where missing

### 3. Thorough Justification of Experimental Choices
- Reviewers may question design decisions that seem obvious to the authors
- Alternative metrics and ablations demonstrate rigor
- **Strategy**: Justify each major choice; offer to add ablations if feasible within the rebuttal period

### 4. Address Ethics and Limitations Proactively
- Especially important for sensitive application areas
- Unaddressed limitations signal incomplete scholarship
- **Strategy**: If a reviewer raises an ethical concern, respond directly with the paper's safeguards or discuss as a known limitation

### 5. Emphasize Practical Value and Scalability
- Reviewers respond well to practical impact framing
- Show that the contribution generalizes beyond the specific setting tested
- **Strategy**: Add one or two sentences about broader applicability if not already present in the paper

---

## Integration with RebuttalStudio Stages

| Stage | How to Use This Skill |
|-------|-----------------------|
| **Stage 1 — Breakdown** | After receiving reviewer text, apply the classification table to categorize each atomic issue before writing titles |
| **Stage 2 — Reply** | Use the Accept/Defend/Clarify/Experiment framework when drafting outlines; choose the strategy that matches each issue type |
| **Stage 4 — Multi-Round** | Re-apply classification to follow-up comments; use "Clarify" or "Experiment" strategy for reviewer persistence |
| **Stage 5 — Final Remarks** | Summarize the response strategies used for each reviewer in the final remarks |

---

## Rebuttal Structure Template

For a well-structured per-reviewer rebuttal block:

```
We thank Reviewer [X] for their thoughtful and constructive feedback.

**Response to [Issue Title]**

> "[quoted reviewer comment]"

[Strategy: Accept / Defend / Clarify / Experiment]

[Response body: acknowledgment → direct answer → evidence → forward-looking note]

**Changes made**: [Section X, paragraph Y; or "no change needed because…"]
```

---

*Adapted from Claude Scholar's `review-response` skill by gaoruizhang. Original: https://github.com/Galaxy-Dawn/claude-scholar/blob/main/skills/review-response/SKILL.md*
