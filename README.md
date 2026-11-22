<p align="center">
  <img src="img/rebuttalstudio_hori.png" alt="Rebuttal Studio Logo" width="600"/>
</p>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/github/stars/runtsang/RebuttalStudio?style=social" alt="GitHub Stars"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"/>
  </a>
  <a href="#-update-rebuttal-studio-is-archived">
    <img src="https://img.shields.io/badge/status-archived-orange.svg" alt="Status: archived"/>
  </a>
  <a href="#-the-rebuttal-studio-skill">
    <img src="https://img.shields.io/badge/skill-Claude%20Code%20%7C%20Codex-8A2BE2.svg" alt="Skill for Claude Code and Codex"/>
  </a>
</p>

<p align="center">
  <b>A rebuttal editor for researchers to craft high-quality academic rebuttals — so you can focus on <i>what</i> to say, not <i>how</i> to format it.</b>
</p>

<p align="center">
  <b>English</b> | <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <img src="img/teaser.png" alt="Rebuttal Studio Teaser" width="800"/>
</p>

---

## 📢 Update: Rebuttal Studio Is Archived

**This is the final version of Rebuttal Studio. The project is no longer updated.**

Venues revise their review forms, scoring rubrics, and rebuttal rules almost every cycle, and the LLM API platforms the editor talks to change just as fast. Keeping an editor in sync with both takes constant maintenance, and we do not have the capacity for it.

The useful part of Rebuttal Studio is the workflow and the formats, and those do not depend on an editor. They now live on in two forms:

1. **A skill.** The whole five-stage workflow is packaged as a skill. Plug it into your own coding plan, with Claude Code or Codex, and write your rebuttal by talking to the agent instead of working in an editor. There is no API key to configure and no provider list for us to keep up with.
2. **Plain-text templates.** Every format we use is listed below, ready to copy. If you prefer to work by hand, they are all you need.

The editor itself is frozen at v0.4.8 and still runs. Its original README and documentation are kept in the [archive](#-archive).

---

## 🧩 The `rebuttal-studio` Skill

### Install

Clone the repository, then copy the skill folder into your agent's skills directory.

```bash
git clone https://github.com/runtsang/RebuttalStudio.git
```

Claude Code:

```bash
mkdir -p ~/.claude/skills && cp -r RebuttalStudio/skills/rebuttal-studio ~/.claude/skills/
```

Codex:

```bash
mkdir -p ~/.codex/skills && cp -r RebuttalStudio/skills/rebuttal-studio ~/.codex/skills/
```

Start a new session afterwards so the agent picks it up. A Chinese edition of the same skill is in [`skills/rebuttal-studio-zh`](skills/rebuttal-studio-zh); install one of the two, not both.

### Use

Open Claude Code or Codex in the folder that holds your paper and your reviews, and ask in plain language:

```text
Use the rebuttal-studio skill. Venue: ICLR, Submission 4127. The reviews are in reviews/, one file per reviewer, and the paper is in paper/main.tex. OpenReview allows 5000 characters per comment. Start with the breakdown for Reviewer aB3x.
```

The agent walks through the stages with you and saves each one under `rebuttal/`, so you can stop and come back when the reviewers reply:

```text
Reviewer aB3x sent a follow-up: "<paste it here>". My points: <your bullets>. Write the follow-up reply.
```

```text
The discussion is over. Reviewer cH6y raised the score from 4 to 6. Write the final remarks to the AC.
```

```text
Reviewer ZpqT has not replied to our rebuttal. Give me the nudge message.
```

In Claude Code, typing `/rebuttal-studio` also starts it.

### What happens at each stage

| Stage | You bring | The agent does | Saved as |
|:-----:|:----------|:---------------|:---------|
| **1 Breakdown** | Each reviewer's full review | Extracts the scores, keeps summary and strengths verbatim, splits weaknesses and questions into atomic issues | `rebuttal/<reviewer>/breakdown.md` |
| **2 Reply** | Your outline for each issue: the answer, the evidence, what changes | Suggests a response strategy, then turns your outline into a polished reply | `rebuttal/<reviewer>/replies.md` |
| **3 First Round** | The platform limit and a theme color | Assembles the opening, the colored point-to-point blocks, and the closing; counts characters; splits into parts | `rebuttal/<reviewer>/first-round.md` |
| **4 Multi Rounds** *(optional)* | The reviewer's follow-up and your points | Condenses the first round and writes a short reply consistent with it | `rebuttal/<reviewer>/followups.md` |
| **5 Final Remarks** | Final ratings and score changes | Fills the four-section summary for the Area Chair | `rebuttal/final-remarks.md` |

On request it also writes reviewer nudges and a confidential note to the AC, removes AI-sounding phrasing, condenses a passage, runs a pre-submission checklist, and verifies new citations.

### Good to know

- **You stay in the driver's seat.** The skill is told never to invent experiments, numbers, or citations. Where it needs something only you know, it leaves a slot like `[AUTHOR INPUT NEEDED: result of the BOFT comparison]` and lists the open slots for you.
- **Venue forms change.** The built-in field mappings (ICLR, ICML, NeurIPS, ARR) reflect early 2026. The skill reads the actual review first and adapts, and you can edit [`references/venues.md`](skills/rebuttal-studio/references/venues.md) yourself.
- **Read everything before you post.** You are responsible for every claim in the final text.

---

## 📋 Templates for Manual Use

Everything below is plain text. Copy a block, replace the bracketed parts, and paste it into OpenReview. The complete library, including the breakdown skeleton and more phrases, is in [`references/templates.md`](skills/rebuttal-studio/references/templates.md).

### 1. Point-to-point response

One block per reviewer concern: a colored title, the reviewer's words as a quote, a colored response label, then your response.

```text
### **${\color{#f26921}\text{R1: Regarding the Novelty Clarification.}}$**

> ${\color{#f26921}\text{Weakness-1:}}$
> [The reviewer's original words, verbatim. Every quoted line starts with "> ".]

${\color{#f26921}\text{Response W1:}}$

[Your response. Plain Markdown: paragraphs, tables, code blocks, and $math$ all work.]
```

| Part | How to edit it |
|:-----|:---------------|
| **Color** | `${\color{#f26921}\text{...}}$` is a LaTeX token that OpenReview renders. Change `#f26921` (orange) to any 6-digit hex color and use the same one everywhere. The text inside must stay on one line and must not contain `{` or `}`. |
| **Title** | `R1`, `R2`, ... number the blocks for one reviewer. Follow with a short subtitle, usually "Regarding ...". |
| **Quote** | `Weakness-1:` or `Question-1:` (short form `W1:` / `Q1:`), numbered separately. Paste the reviewer's text unchanged. |
| **Response label** | `Response W1:` answers Weakness-1, `Response Q2:` answers Question-2. |
| **Inline highlight** | The same token colors any phrase, e.g. `marked in ${\color{#f26921}\text{orange}}$ in the revision`. |

<p align="center">
  <img src="img/ex1.jpg" alt="A rendered point-to-point response" width="800"/>
</p>

### 2. Opening and closing for each reviewer

Opening, before the first block. Replace `A`, `B`, and `C` with strengths this reviewer actually acknowledged:

```text
Thank you for acknowledging the A, B, and C of our method. We sincerely appreciate your time and effort in reviewing our paper and providing valuable comments. We provide explanations to your questions point-by-point in the following.
```

Closing, after the last block:

```text
**We appreciate your thoughtful comments. We hope our response addresses your concerns. Please let us know if there are any additional questions, and we will be happy to discuss further.**
```

### 3. Splitting a long response

When a response exceeds the platform limit, split it between blocks, never inside one, and post each part with this subject:

```text
Author Response to Reviewer {{reviewerId}} (Part {{i}}/{{N}})
```

### 4. Courtesy openers

Start a response with at most one of these, matched to what the reviewer did:

```text
Thank you for the excellent suggestion.
Thank you for pointing this out.
Thank you for highlighting this important point about [TOPIC].
We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA].
Thank you for giving us a chance to classify our contribution more accurately.
```

| The reviewer ... | Opener |
|:-----------------|:-------|
| gave actionable advice | Thank you for the excellent suggestion. |
| spotted an omission or ambiguity | Thank you for pointing this out. |
| stressed the importance of a dimension | Thank you for highlighting this important point about [TOPIC]. |
| challenged originality or positioning | We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA]. |
| miscategorized the contribution or its scope | Thank you for giving us a chance to classify our contribution more accurately. |
| asked a plain factual question | No opener. Start with the answer. |

### 5. Final remarks to the Area Chair

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

| Placeholder | What to write |
|:------------|:--------------|
| `{{acknowledgments_overall}}` | One or two sentences thanking all reviewers; name those who engaged most. |
| `{{before_discussion_summary}}` | Each reviewer's initial rating, and any stated willingness to reconsider, quoted verbatim. |
| `{{during_discussion_summary}}` | Which concerns were resolved, in the reviewers' own words, and every explicit score change. |
| `{{key_strengths_points_markdown}}` | 4-5 bullets across reviewers, optionally grouped by dimension with reviewer IDs in parentheses. |
| `{{concern_rows_markdown}}` | One row per substantive concern: `*Short name.* The concern` / reviewer IDs / your specific one-line response. |
| `{{commitment_to_revision}}` | Named, concrete changes already made or promised, and how they are marked in the revision. |

<details>
<summary><b>Filled example (TokenSeek, ICLR)</b></summary>

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

</details>

<p align="center">
  <img src="img/ex2.jpg" alt="Rendered final remarks" width="800"/>
</p>

### 6. Follow-up rounds

Before answering a follow-up, condense your first-round response to that reviewer into a short context, so the new reply stays consistent with it:

```text
## Key Question(s)
- [one line per main concern the reviewer raised]

## Main Answer(s)
- **[Topic]:** [the answer you gave, with its key numbers and commitments]
```

A follow-up reply is shorter and more direct than the first round, usually one or two paragraphs:

```text
[Thanks tied to the specific follow-up.] [Direct answer.]

[Evidence, or a pointer to your earlier answer: "As noted in our Response W2, ..."] [What will be added to the revision.]
```

### 7. Messages to reviewers and the Area Chair

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

Confidential note to the Area Chair about an unresponsive or unfair review. Title: `Confidential concern regarding Reviewer {{reviewerId}}`

```text
Dear Area Chair,

We are writing to you confidentially regarding our submission {{submissionId}}. We have significant concerns about the engagement and quality of the review provided by Reviewer {{reviewerId}}.

Despite our detailed rebuttal and efforts to engage in constructive dialogue, Reviewer {{reviewerId}} has [briefly state the issue: e.g., remained unresponsive / provided comments that show a lack of attendance to the paper's core contributions / refused to acknowledge direct responses to their questions].

We understand the demanding nature of the review process, but we feel this situation may compromise the fairness of the evaluation for our submission. We would be grateful if you could look into this matter and provide any guidance on how to proceed.

Thank you for your time and continued service to the conference.

Best regards,

The Authors of Submission {{submissionId}}
```

### 8. Reusable phrases

```text
We believe this may stem from ...
To clarify our intent, ...
As noted in our Response W2, ...
We have added [Table 4 comparing our method against X and Y on Z] to the revision.
We will add a clarifying paragraph to Section [N].
Thank you for pointing out [Paper]; we will add a discussion in Related Work.
We have examined [Paper], which evaluates on [different setting], making direct comparison difficult.
We searched but could not locate this work; we would appreciate a link or full title.
```

---

## 🙏 Thank You

Rebuttal Studio started as a single weekend of work, about 15 hours, by one person who had never built an app before. It went much further than that because of you.

Thank you to everyone who starred the repository, used it during a real rebuttal, opened an issue, sent a pull request, or passed it on to a labmate. Thank you to the contributors who put their own time into the code:

<p align="center">
  <a href="https://github.com/runtsang">
    <img src="https://avatars.githubusercontent.com/u/70456146?v=4" alt="runtsang" width="56" height="56" style="border-radius: 50%;" />
  </a>
  <a href="https://github.com/robinzixuan">
    <img src="https://avatars.githubusercontent.com/u/32207883?v=4" alt="robinzixuan" width="56" height="56" style="border-radius: 50%;" />
  </a>
  <a href="https://github.com/liu33333">
    <img src="https://github.com/liu33333.png?size=112" alt="liu33333" width="56" height="56" style="border-radius: 50%;" />
  </a>
</p>

And thank you to [Claude Scholar](https://github.com/Galaxy-Dawn/claude-scholar) by gaoruizhang, whose skills the strategy, de-AI, self-review, and citation-verification guidance is adapted from.

We hope the skill and the templates keep saving you time when the next round of reviews arrives. Good luck with your rebuttals.

<p align="center">
  <a href="https://star-history.com/#runtsang/RebuttalStudio&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=runtsang/RebuttalStudio&type=Date&theme=dark" />
      <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=runtsang/RebuttalStudio&type=Date" />
      <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=runtsang/RebuttalStudio&type=Date" width="600" />
    </picture>
  </a>
</p>

---

## 📦 Archive

Everything from the editor era is still in this repository:

- **[Archived README](archive/README.md)**: the original introduction, installation guide, examples, and roadmap of the editor.
- **Editor documentation**: [English](documents/en/README.md) | [中文](documents/ch/README.md)
- **The editor itself**, frozen at v0.4.8. It still runs with `npm install` and `npm start`; see the archived README.
- **The editor's own prompts**: the other folders under [`skills/`](skills/README.md), which the `rebuttal-studio` skill was distilled from.

---

## 📌 Citation

If Rebuttal Studio is useful in your research, please consider citing it:

```bibtex
@misc{rebuttalstudio,
  author       = {Zeng, Runjia},
  title        = {A rebuttal editor for researchers to craft high-quality academic rebuttals},
  month        = 02,
  year         = 2026,
  publisher    = {Github},
  version      = {v0.3.0},
  url          = {https://github.com/runtsang/RebuttalStudio}
}
```

This project is open-source under the MIT License.

<p align="center">
  <i>Built with ❤️ for the research community.</i>
</p>

<p align="center">
  <a href="archive/README.md">📦 Looking for the original README? It is archived here.</a>
</p>
