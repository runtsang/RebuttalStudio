# Rebuttal Studio Templates

Every reusable format from Rebuttal Studio as plain text. Copy a block, replace the bracketed or `{{placeholder}}` parts, and keep everything else character-for-character.

## Contents

1. [Color token](#1-color-token)
2. [Point-to-point response block](#2-point-to-point-response-block)
3. [Opening and closing paragraphs](#3-opening-and-closing-paragraphs)
4. [Full first-round document](#4-full-first-round-document)
5. [Splitting into parts](#5-splitting-into-parts)
6. [Stage 1 breakdown skeleton](#6-stage-1-breakdown-skeleton)
7. [Stage 2 working draft and opener bank](#7-stage-2-working-draft-and-opener-bank)
8. [Follow-up rounds](#8-follow-up-rounds)
9. [Final remarks to the AC](#9-final-remarks-to-the-ac)
10. [Messages to reviewers and the AC](#10-messages-to-reviewers-and-the-ac)
11. [Paper memory](#11-paper-memory)
12. [Reusable phrases](#12-reusable-phrases)

---

## 1. Color token

All colored labels use one LaTeX token that OpenReview renders through MathJax:

```text
${\color{#f26921}\text{Your label here}}$
```

- `#f26921` (orange) is the default theme color. Use one 6-digit hex color for the whole rebuttal.
- Editor presets: `#ff0000` red, `#ff7f00` orange, `#ffff00` yellow, `#00aa00` green, `#0077ff` blue, `#4b0082` indigo, `#8b00ff` violet. Avoid bright yellow (low contrast) and near-black (looks like body text).
- A color named in words: "orange" means the default `#f26921`; any other name means the matching preset.
- The label must stay on one line and must not contain `{` or `}`.
- The same token highlights any phrase inside a response, e.g. `marked in ${\color{#f26921}\text{orange}}$ in the revision`.
- On a platform without LaTeX rendering, drop the token and keep the bold: `### **R1: Regarding ...**`.

## 2. Point-to-point response block

One block per atomic issue. This is "Run's Template": colored title, quoted reviewer text, colored response label, response.

```text
### **${\color{#f26921}\text{R1: Regarding the Novelty Clarification.}}$**

> ${\color{#f26921}\text{Weakness-1:}}$
> [The reviewer's original words, verbatim. Every quoted line starts with "> ".]

${\color{#f26921}\text{Response W1:}}$

[Response body. Plain Markdown: paragraphs, tables, code blocks, and $math$ are all fine.]
```

| Line | Pattern | Rule |
| --- | --- | --- |
| Title | `### **${\color{HEX}\text{R<n>: Regarding <topic>.}}$**` | `<n>` is the running index of the block for this reviewer (R1, R2, ...). Short subtitle, conventionally "Regarding ...". |
| Quote label | `> ${\color{HEX}\text{Weakness-<i>:}}$` | `Weakness-<i>:` or `Question-<i>:` (`Suggestion-<i>:` for ARR), numbered independently. The long form is the default; use the short form `W<i>:` / `Q<i>:` only when the author asks for it. |
| Quote | `> <text>` | Verbatim reviewer text. Never paraphrase or trim silently. |
| Response label | `${\color{HEX}\text{Response W<i>:}}$` | `W<i>` for a weakness, `Q<i>` for a question, `S<i>` for a suggestion. |
| Body | Markdown | Blank line between every part, exactly as shown. |

Filled example (from the demo project shipped with the editor, short label form):

```text
### **${\color{#f26921}\text{R1: Regarding Novelty vs. Direct LLM Use.}}$**

> ${\color{#f26921}\text{W1:}}$
> The core technical contribution—feeding reviewer text into an LLM and structuring the output—is essentially a prompt-engineering pipeline wrapped in a UI. No direct A/B comparison against raw LLM use is provided.

${\color{#f26921}\text{Response W1:}}$

We thank the reviewer for this important point. To address the missing baseline, we have conducted a within-subjects comparison study (N=15) where participants completed two equivalent rebuttal tasks—one using Rebuttal Studio and one using direct ChatGPT access with no structured guidance. Rebuttal Studio users completed tasks 23% faster (p=0.031, paired t-test) and addressed 31% more atomic reviewer issues (assessed by three independent annotators, κ=0.81). The key advantage lies not in LLM capability per se, but in workflow scaffolding: the five-stage structure enforces systematic issue decomposition and coverage that unstructured LLM sessions do not guarantee. We will add this comparison as a controlled baseline experiment in the revised paper.
```

## 3. Opening and closing paragraphs

Opening, placed before the first block. Replace `A`, `B`, and `C` with the strengths this reviewer actually acknowledged:

```text
Thank you for acknowledging the A, B, and C of our method. We sincerely appreciate your time and effort in reviewing our paper and providing valuable comments. We provide explanations to your questions point-by-point in the following.
```

Closing, placed after the last block:

```text
**We appreciate your thoughtful comments. We hope our response addresses your concerns. Please let us know if there are any additional questions, and we will be happy to discuss further.**
```

## 4. Full first-round document

One document per reviewer: opening, blocks in order, closing, separated by blank lines.

```text
Thank you for acknowledging the A, B, and C of our method. We sincerely appreciate your time and effort in reviewing our paper and providing valuable comments. We provide explanations to your questions point-by-point in the following.

### **${\color{#f26921}\text{R1: Regarding <topic>.}}$**

> ${\color{#f26921}\text{Weakness-1:}}$
> [verbatim reviewer text]

${\color{#f26921}\text{Response W1:}}$

[response]

### **${\color{#f26921}\text{R2: Regarding <topic>.}}$**

> ${\color{#f26921}\text{Question-1:}}$
> [verbatim reviewer text]

${\color{#f26921}\text{Response Q1:}}$

[response]

**We appreciate your thoughtful comments. We hope our response addresses your concerns. Please let us know if there are any additional questions, and we will be happy to discuss further.**
```

When several reviewers go into one file, start each with `# Response to Reviewer {{reviewerId}}` and separate reviewers with a `---` line.

## 5. Splitting into parts

When the document exceeds the platform limit, split it and post each part as its own comment with this subject:

```text
Author Response to Reviewer {{reviewerId}} (Part {{i}}/{{N}})
```

- The opening, each response block, and the closing are atomic units. Split only between units, never inside one.
- Fill each part greedily: add the next unit while the part (units joined by one blank line) stays within the limit.
- A single unit longer than the limit stays whole in its own part. Report it so the author can shorten that response.
- Count characters of the raw Markdown source, color tokens included, without a trailing newline. The subject line is not part of the count.

## 6. Stage 1 breakdown skeleton

```text
# Stage1 <VENUE> Breakdown

## Scores
- <score_key>: <number>

## Preserved Sections
- summary: |
  <verbatim text>
- strength: |
  <verbatim text>

## Atomic Issues
- weakness1: "<verbatim quoted issue>"
- weakness2: "<verbatim quoted issue>"
- question1: "<verbatim quoted issue>"

## Responses
### Response1
- title: <short subtitle>
- source: weakness
- source_id: weakness1
- quoted_issue: "<same verbatim text as weakness1>"
```

Score keys and section names per venue are in `venues.md`.

## 7. Stage 2 working draft and opener bank

Working format for one refined reply, before it is wrapped in the colored block:

```text
> **Reviewer's Comment**: [verbatim quoted issue]

**Response**: [polished rebuttal prose]
```

Layout of one entry in `replies.md`:

```text
## Response1 - Regarding <topic>

- source_id: weakness1
- Proposed type: <Major | Minor | Misunderstanding | Typo / Clarity>
- Proposed strategy: <Accept | Defend | Clarify | Experiment>

Outline:

- <the author's points, in the author's words>

Refined reply:

> **Reviewer's Comment**: <verbatim quoted issue>

**Response**: <polished rebuttal prose>
```

Courtesy openers. An opener is optional; use at most one per response:

```text
Thank you for the excellent suggestion.
Thank you for pointing this out.
Thank you for highlighting this important point about [TOPIC].
We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA].
Thank you for giving us a chance to classify our contribution more accurately.
```

| Reviewer intent | Opener |
| --- | --- |
| Actionable improvement advice | Thank you for the excellent suggestion. |
| Omission or ambiguity pointed out | Thank you for pointing this out. |
| Stresses the importance of a dimension | Thank you for highlighting this important point about [TOPIC]. |
| Challenges originality or positioning | We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA]. |
| Miscategorizes the contribution or its scope | Thank you for giving us a chance to classify our contribution more accurately. |
| Asks a plain factual question | No opener; start with the answer. |

Shape of the response body:

```text
[Opener.] [Direct answer in the first one or two sentences.]

[Evidence: numbers, a table, a pointer to Section/Table/Figure.]

[What changed or will change in the revision.]
```

## 8. Follow-up rounds

Condensed context of the first round, one per reviewer:

```text
## Key Question(s)
- [one line per main concern the reviewer raised]

## Main Answer(s)
- **[Topic]:** [the answer given, with its key numbers and commitments]
```

Layout of `followups.md`: the condensed context first, then one record per follow-up:

```text
## Follow-up 1

> [the reviewer's follow-up, verbatim]

Author's points:

- <the author's points, in the author's words>

Reply:

[the reply, in the shape below]
```

Shape of a follow-up reply (shorter and more direct than the first round, usually one or two paragraphs):

```text
[Thanks tied to the specific follow-up.] [Direct answer.]

[Evidence, or a pointer to the earlier answer: "As noted in our Response W2, ..."] [What will be added to the revision.]
```

## 9. Final remarks to the AC

Template ("Run's Template"):

```text
## I. Acknowledgments

{{acknowledgments_overall}}

**Before the discussion**, {{before_discussion_summary}}

**During the discussion**, {{during_discussion_summary}}

---

## II. Key Strengths

Reviewers highlighted the following main strengths:

{{key_strengths_points_markdown}}

---

## III. Key Concerns and Our Responses

Our responses to key concerns are summarized below.

| **Key Concerns** | **Reviewers** | **Our Response** |
| --- | --- | --- |
{{concern_rows_markdown}}

---

## IV. Commitment to Revision

{{commitment_to_revision}}

---

**We deeply appreciate the expertise and time of the AC and reviewers.**
```

| Placeholder | Content |
| --- | --- |
| `{{acknowledgments_overall}}` | One or two sentences thanking all reviewers; name the reviewers who engaged most. |
| `{{before_discussion_summary}}` | Initial ratings per reviewer, and any stated willingness to reconsider, quoted verbatim. |
| `{{during_discussion_summary}}` | Which concerns were resolved, in the reviewers' own quoted words, and every explicit score change (from, to, date). |
| `{{key_strengths_points_markdown}}` | 4-5 bullets summarized across reviewers. Optionally group them by dimension with reviewer IDs in parentheses. |
| `{{concern_rows_markdown}}` | One table row per substantive concern: `*Short name.* One-line concern` / reviewer IDs / specific one-line response. Usually 4-8 rows. |
| `{{commitment_to_revision}}` | Named, concrete changes already made or promised, and how they are marked in the revision. |

Formatting conventions used in the example below: reviewer IDs and verbatim reviewer quotes in `inline code`, score movements in **bold**, the lead-ins "Before the discussion" / "During the discussion" in bold (or in the color token), the concern name in *italics* at the start of each table row.

Filled example (TokenSeek, ICLR):

```text
## I. Acknowledgments

We would like to express our sincere gratitude to all reviewers for their insightful comments and constructive suggestions, which have significantly improved the quality of our work. We especially appreciate Reviewer `kTDb` and `cH6y` for their thoughtful consideration and constructive engagement with our rebuttal - it has significantly strengthened our work.

**Before the discussion**, we appreciate the recognition from Reviewer CWhD (Rating: 8) and kTDb (Rating: 6), as well as the positive-leaning approval from Reviewer ZpqT (Rating: 4) and cH6y (Rating: 4), both of whom explicitly expressed a willingness to **reconsider their rating** (e.g., `“I would be open to raising my score”` from Reviewer ZpqT and `“I would reconsider my score if these concerns are adequately addressed”` from Reviewer cH6y).

**During the discussion**, we are pleased that the major concerns raised by Reviewer kTDb and cH6y were resolved through our additional clarifications and results (e.g., `“the tables you added cleared my concerns regarding the config and overhaul”` from Reviewer kTDb and `“Many of my earlier concerns have been addressed”` from Reviewer cH6y). We especially appreciate Reviewer cH6y’s **inclination to increase the score** from 4 to 6 on 26 Nov 2025, 03:25 ET.

---

## II. Key Strengths

Reviewers highlighted strengths across five dimensions:

- Novelty and Innovation
  - Introduction of an instance-aware paradigm combining attention and gradient signals (CWhD, kTDb)
  - Insight that not all training tokens contribute equally to fine-tuning (cH6y)
  - Conceptually simple yet effective improvement over random selection (ZpqT)
- Effectiveness and Efficiency
  - Substantial memory savings (e.g., 2.8 GiB peak on Llama-3.2-1B) while maintaining accuracy (kTDb, CWhD)
  - Competitive performance on multiple downstream tasks (QA, reasoning) across architectures (ZpqT)
  - Superior performance compared to LoRA with significantly lower memory usage (CWhD)
- Practicality
  - Architecture-agnostic "plug-and-play" design without requiring model modifications (CWhD)
  - Practically implementable (ZpqT)
- Interpretability
  - Transparent scoring mechanism providing insights into token importance (cH6y, CWhD)
  - High-quality presentation and clear visualizations of attention/gradient bias (cH6y, kTDb)
- Methodological Clarity and Empirical Rigor
  - The paper is clearly written and generally easy to follow, solid problem formulation (ZpqT, CWhD, cH6y)
  - The experiments are comprehensive and include ablations and cross-task evaluations, which strengthen empirical credibility, this paper is very well-written, logically structured, and easy to follow, with clear motivation and experimental validation (ZpqT, CWhD, kTDb)

---

## III. Key Concerns and Our Responses

Our responses to key concerns are summarized below.

| **Key Concerns** | **Reviewers** | **Our Response** |
| --- | --- | --- |
| *Novelty & Distinction from TokenTune.* Concern that TokenSeek is an extension of TokenTune without a new paradigm. | ZpqT | TokenSeek introduces a data-driven, instance-aware mechanism (combining attention and gradients) which is fundamentally different from TokenTune’s unstable random/data-agnostic approach. |
| *Baselines & Generalization.* More sparse PEFT baselines and code-domain experiments (HumanEval). | ZpqT, kTDb | Besides the BOFT, we added experiments with RanLoRA. We evaluated on code datasets (HumanEval), where TokenSeek showed robustness even with dense information. We also provided detailed training knob tables. |
| *Memory Savings Mechanism.* Clarification needed on how gradient-based scoring saves memory given the backward pass requirements. | ZpqT, kTDb | We clarified the two-stage process: offline partial-backward scoring (using only ~11-13% memory on the penultimate layer) followed by online token ditching. |
| *Scalability & Distributed Training.* Challenges in token regrouping and communication in large-scale setups. | CWhD | We analyzed DP vs. TP/SP settings, noting that memory overhead remains controllable. We also validated scalability on Llama2-7B, achieving comparable performance with >80% memory savings. |
| *Hyperparameters & Stability.* Justification for $\alpha/\beta$ selection and potential training instability from subset shifts. | cH6y, kTDb | We demonstrated low sensitivity to hyperparameters via ablation studies. We clarified that subsets are fixed post-scoring and provided variance tables to prove stability. |
| *Interpretation of "Global Anchor".* Why specific tokens (anchors) are consistently preserved. | cH6y | We explained that "attention sinks" naturally receive high combined scores due to stable attention allocation, causing TokenSeek to preserve them without artificial enforcement. |

---

## IV. Commitment to Revision

We have already incorporated all discussion points and additional experiments into our revision. All modifications have been marked in ${\color{#f26921}\text{orange}}$ in our revised submission. This includes adding the new experimental results on RanLoRA and HumanEval, the detailed training configuration tables, and the deeper discussions on "global anchors" and reasoning domain connections. We are also committed to continually incorporating the feedback from the discussion into the revision to polish our work.

---

**We deeply appreciate the expertise and time of the AC and reviewers.**
```

## 10. Messages to reviewers and the AC

Placeholders: `{{reviewerId}}`, `{{submissionId}}`.

Nudge a reviewer who has not replied to the first-round rebuttal. Title: `Looking forward to the discussion`

```text
Dear Reviewer {{reviewerId}},

We deeply appreciate the time and effort you've taken to review our work, especially given your busy schedule. As the authors-reviewer discussion phase draws to a close, we would be grateful for the opportunity to engage in dialogue with you. Our goal is to ensure we've adequately addressed your concerns and welcome any additional questions or points of discussion you'd like to raise.

Thank you for your thoughtful consideration.

Best regards,

The Authors of Submission {{submissionId}}
```

Nudge a reviewer who went quiet after a follow-up. Title: `Follow-up on remaining concerns`

```text
Dear Reviewer {{reviewerId}},

We deeply appreciate the time and effort you've taken to review our work, especially given your busy schedule. As the authors-reviewer discussion phase draws to a close, we would be grateful to know whether we have adequately addressed your follow-up concerns and welcome any additional questions or points of discussion you'd like to raise.

Thank you for your thoughtful consideration.

Best regards,

The Authors of Submission {{submissionId}}
```

Confidential note to the Area Chair about an unresponsive or unfair review. Title: `Confidential concern regarding Reviewer {{reviewerId}}`. Replace the bracketed sentence with the specific, factual issue:

```text
Dear Area Chair,

We are writing to you confidentially regarding our submission {{submissionId}}. We have significant concerns about the engagement and quality of the review provided by Reviewer {{reviewerId}}.

Despite our detailed rebuttal and efforts to engage in constructive dialogue, Reviewer {{reviewerId}} has [briefly state the issue: e.g., remained unresponsive / provided comments that show a lack of attendance to the paper's core contributions / refused to acknowledge direct responses to their questions].

We understand the demanding nature of the review process, but we feel this situation may compromise the fairness of the evaluation for our submission. We would be grateful if you could look into this matter and provide any guidance on how to proceed.

Thank you for your time and continued service to the conference.

Best regards,

The Authors of Submission {{submissionId}}
```

When polishing one of these messages, keep the greeting, sign-off, paragraph order, and placeholders unchanged; fix only grammar, redundancy, and word choice.

## 11. Paper memory

Background summary of the paper, reused when refining replies and follow-ups. Keep every heading; when the source is thin on one, write a short grounded note instead of guessing.

```text
## Contribution Overview

## Introduction

## Methods

## Logic Chain

## Experiments

## Key Conclusions
```

## 12. Reusable phrases

Framing a disagreement or a misunderstanding without sounding defensive:

```text
We believe this may stem from ...
To clarify our intent, ...
To clarify: [the specific point].
The metric has a known limitation: [state it]. We address this in [Appendix B].
```

Pointing back to an earlier answer:

```text
As noted in our Response W2, ...
As discussed in our initial response, ...
```

Committing to a change, scoped and concrete:

```text
We have added [Table 4 comparing our method against X and Y on Z] to the revision.
We will add a clarifying paragraph to Section [N].
Results will appear in the revision.
```

Handling citations and baselines:

```text
[Author et al., Year, "Title", Venue]
Thank you for pointing out [Paper]; we will add a discussion in Related Work.
We have examined [Paper], which evaluates on [different setting], making direct comparison difficult.
We searched but could not locate this work; we would appreciate a link or full title.
[CITATION NEEDED - verify before submission: "paper title"]
```

Slot for content only the author can supply:

```text
[AUTHOR INPUT NEEDED: what is missing, e.g. "result of the BOFT comparison, or the reason it is not comparable"]
```
