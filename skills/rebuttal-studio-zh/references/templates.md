# Rebuttal Studio 模板库

Rebuttal Studio 里所有可复用的格式，全部以纯文本给出。复制一段，替换方括号或 `{{placeholder}}` 部分，其余内容逐字符保持不变。Rebuttal 正文用英文写，所以模板保持英文原文。

## 目录

1. [颜色写法](#1-颜色写法)
2. [Point-to-point 回复块](#2-point-to-point-回复块)
3. [开头和结尾](#3-开头和结尾)
4. [完整的首轮文档](#4-完整的首轮文档)
5. [拆分成多条](#5-拆分成多条)
6. [Stage 1 breakdown 骨架](#6-stage-1-breakdown-骨架)
7. [Stage 2 工作稿和开场句库](#7-stage-2-工作稿和开场句库)
8. [多轮讨论](#8-多轮讨论)
9. [写给 AC 的 Final Remarks](#9-写给-ac-的-final-remarks)
10. [发给 reviewer 和 AC 的消息](#10-发给-reviewer-和-ac-的消息)
11. [论文记忆](#11-论文记忆)
12. [常用句](#12-常用句)

---

## 1. 颜色写法

所有带颜色的标签都用同一种 LaTeX 写法，OpenReview 会通过 MathJax 渲染：

```text
${\color{#f26921}\text{Your label here}}$
```

- `#f26921`（橙色）是默认主题色。整篇 rebuttal 只用一个 6 位十六进制颜色。
- 编辑器预设的颜色：`#ff0000` 红、`#ff7f00` 橙、`#ffff00` 黄、`#00aa00` 绿、`#0077ff` 蓝、`#4b0082` 靛、`#8b00ff` 紫。避免亮黄色（对比度太低）和接近黑色的颜色（和正文分不开）。
- 作者用文字说颜色时：“橙色 / orange” 指默认的 `#f26921`，其他颜色名对应上面的预设值。
- 标签必须在同一行，且不能包含 `{` 或 `}`。
- 同样的写法可以高亮回复中的任意短语，例如 `marked in ${\color{#f26921}\text{orange}}$ in the revision`。
- 平台不支持 LaTeX 渲染时，去掉颜色写法，只保留加粗：`### **R1: Regarding ...**`。

## 2. Point-to-point 回复块

每个原子问题一个回复块。这就是 “Run's Template”：带颜色的标题、引用 reviewer 原文、带颜色的 Response 标签、回复正文。

```text
### **${\color{#f26921}\text{R1: Regarding the Novelty Clarification.}}$**

> ${\color{#f26921}\text{Weakness-1:}}$
> [The reviewer's original words, verbatim. Every quoted line starts with "> ".]

${\color{#f26921}\text{Response W1:}}$

[Response body. Plain Markdown: paragraphs, tables, code blocks, and $math$ are all fine.]
```

| 行 | 写法 | 规则 |
| --- | --- | --- |
| 标题 | `### **${\color{HEX}\text{R<n>: Regarding <topic>.}}$**` | `<n>` 是该 reviewer 下回复块的顺序号（R1、R2……）。后面是简短小标题，习惯写成 "Regarding ..."。 |
| 引用标签 | `> ${\color{HEX}\text{Weakness-<i>:}}$` | `Weakness-<i>:` 或 `Question-<i>:`（ARR 用 `Suggestion-<i>:`），两类分别编号。默认用完整形式；缩写 `W<i>:` / `Q<i>:` 只在作者要求时用。 |
| 引用 | `> <text>` | reviewer 的原话，一字不差。不要改写，也不要悄悄删减。 |
| Response 标签 | `${\color{HEX}\text{Response W<i>:}}$` | weakness 用 `W<i>`，question 用 `Q<i>`，suggestion 用 `S<i>`。 |
| 正文 | Markdown | 各部分之间空一行，和上面完全一致。 |

填写示例（来自编辑器自带的演示项目，标签用缩写形式）：

```text
### **${\color{#f26921}\text{R1: Regarding Novelty vs. Direct LLM Use.}}$**

> ${\color{#f26921}\text{W1:}}$
> The core technical contribution—feeding reviewer text into an LLM and structuring the output—is essentially a prompt-engineering pipeline wrapped in a UI. No direct A/B comparison against raw LLM use is provided.

${\color{#f26921}\text{Response W1:}}$

We thank the reviewer for this important point. To address the missing baseline, we have conducted a within-subjects comparison study (N=15) where participants completed two equivalent rebuttal tasks—one using Rebuttal Studio and one using direct ChatGPT access with no structured guidance. Rebuttal Studio users completed tasks 23% faster (p=0.031, paired t-test) and addressed 31% more atomic reviewer issues (assessed by three independent annotators, κ=0.81). The key advantage lies not in LLM capability per se, but in workflow scaffolding: the five-stage structure enforces systematic issue decomposition and coverage that unstructured LLM sessions do not guarantee. We will add this comparison as a controlled baseline experiment in the revised paper.
```

## 3. 开头和结尾

开头，放在第一个回复块之前。把 `A`、`B`、`C` 换成这位 reviewer 实际认可的优点：

```text
Thank you for acknowledging the A, B, and C of our method. We sincerely appreciate your time and effort in reviewing our paper and providing valuable comments. We provide explanations to your questions point-by-point in the following.
```

结尾，放在最后一个回复块之后：

```text
**We appreciate your thoughtful comments. We hope our response addresses your concerns. Please let us know if there are any additional questions, and we will be happy to discuss further.**
```

## 4. 完整的首轮文档

每位 reviewer 一份文档：开头、按顺序排列的回复块、结尾，彼此之间空一行。

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

多位 reviewer 放在同一个文件里时，每位以 `# Response to Reviewer {{reviewerId}}` 开头，reviewer 之间用一行 `---` 分隔。

## 5. 拆分成多条

文档超过平台上限时，拆成几部分，每部分单独发一条评论，标题用：

```text
Author Response to Reviewer {{reviewerId}} (Part {{i}}/{{N}})
```

- 开头段、每个回复块、结尾段都是不可拆的单元。只在单元之间拆，不在单元内部拆。
- 贪心填充：只要这一部分（各单元之间空一行）还在上限以内，就继续放入下一个单元。
- 单个单元本身就超过上限时，让它独占一部分，并告诉作者需要缩短这条回复。
- 字符数按 Markdown 源码计算，颜色写法也算在内，末尾的换行不算。标题行不计入字符数。

## 6. Stage 1 breakdown 骨架

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

各会议的评分键和部分名称见 `venues.md`。

## 7. Stage 2 工作稿和开场句库

单条回复润色之后、套上带颜色的回复块之前的工作格式：

```text
> **Reviewer's Comment**: [verbatim quoted issue]

**Response**: [polished rebuttal prose]
```

`replies.md` 里每个问题一条记录，格式如下：

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

礼貌开场句。开场句可以不用；用的话每条回复最多一句：

```text
Thank you for the excellent suggestion.
Thank you for pointing this out.
Thank you for highlighting this important point about [TOPIC].
We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA].
Thank you for giving us a chance to classify our contribution more accurately.
```

| reviewer 的意图 | 开场句 |
| --- | --- |
| 给出可操作的改进建议 | Thank you for the excellent suggestion. |
| 指出遗漏或表述不清 | Thank you for pointing this out. |
| 强调某个维度的重要性 | Thank you for highlighting this important point about [TOPIC]. |
| 质疑原创性或定位 | We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA]. |
| 对贡献的类别或范围理解有偏差 | Thank you for giving us a chance to classify our contribution more accurately. |
| 只是问一个事实性问题 | 不用开场句，直接回答。 |

回复正文的形状：

```text
[Opener.] [Direct answer in the first one or two sentences.]

[Evidence: numbers, a table, a pointer to Section/Table/Figure.]

[What changed or will change in the revision.]
```

## 8. 多轮讨论

首轮回复的压缩上下文，每位 reviewer 一份：

```text
## Key Question(s)
- [one line per main concern the reviewer raised]

## Main Answer(s)
- **[Topic]:** [the answer given, with its key numbers and commitments]
```

`followups.md` 的格式：先放压缩上下文，然后每条追问一条记录：

```text
## Follow-up 1

> [the reviewer's follow-up, verbatim]

Author's points:

- <the author's points, in the author's words>

Reply:

[the reply, in the shape below]
```

追问回复的形状（比首轮更短、更直接，一般一到两段）：

```text
[Thanks tied to the specific follow-up.] [Direct answer.]

[Evidence, or a pointer to the earlier answer: "As noted in our Response W2, ..."] [What will be added to the revision.]
```

## 9. 写给 AC 的 Final Remarks

模板（“Run's Template”）：

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

| 占位符 | 内容 |
| --- | --- |
| `{{acknowledgments_overall}}` | 一两句话感谢所有 reviewer，点名参与讨论最积极的几位。 |
| `{{before_discussion_summary}}` | 每位 reviewer 的初始评分，以及表示愿意重新考虑评分的原话。 |
| `{{during_discussion_summary}}` | 哪些问题已经解决（引用 reviewer 的原话），以及每一次明确的分数变化（从几分到几分、日期）。 |
| `{{key_strengths_points_markdown}}` | 综合所有 reviewer 的 4 到 5 条优点。可以按维度分组，并在括号里标出 reviewer ID。 |
| `{{concern_rows_markdown}}` | 每个实质性问题一行：`*Short name.* One-line concern` / reviewer ID / 一句具体的回复。通常 4 到 8 行。 |
| `{{commitment_to_revision}}` | 已经完成或承诺要做的具体修改，以及它们在修改稿中的标记方式。 |

下面的示例用到的排版习惯：reviewer ID 和 reviewer 的原话放在 `inline code` 里；分数变化加粗；"Before the discussion" / "During the discussion" 加粗（或者用颜色写法）；表格每行开头的问题名称用斜体。

填写示例（TokenSeek，ICLR）：

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

## 10. 发给 reviewer 和 AC 的消息

占位符：`{{reviewerId}}`、`{{submissionId}}`。

催促还没有回复首轮 rebuttal 的 reviewer。标题：`Looking forward to the discussion`

```text
Dear Reviewer {{reviewerId}},

We deeply appreciate the time and effort you've taken to review our work, especially given your busy schedule. As the authors-reviewer discussion phase draws to a close, we would be grateful for the opportunity to engage in dialogue with you. Our goal is to ensure we've adequately addressed your concerns and welcome any additional questions or points of discussion you'd like to raise.

Thank you for your thoughtful consideration.

Best regards,

The Authors of Submission {{submissionId}}
```

催促追问之后没有再回复的 reviewer。标题：`Follow-up on remaining concerns`

```text
Dear Reviewer {{reviewerId}},

We deeply appreciate the time and effort you've taken to review our work, especially given your busy schedule. As the authors-reviewer discussion phase draws to a close, we would be grateful to know whether we have adequately addressed your follow-up concerns and welcome any additional questions or points of discussion you'd like to raise.

Thank you for your thoughtful consideration.

Best regards,

The Authors of Submission {{submissionId}}
```

向 Area Chair 保密反映某位 reviewer 不回应或审稿不公。标题：`Confidential concern regarding Reviewer {{reviewerId}}`。把方括号里的那句换成具体、客观的情况：

```text
Dear Area Chair,

We are writing to you confidentially regarding our submission {{submissionId}}. We have significant concerns about the engagement and quality of the review provided by Reviewer {{reviewerId}}.

Despite our detailed rebuttal and efforts to engage in constructive dialogue, Reviewer {{reviewerId}} has [briefly state the issue: e.g., remained unresponsive / provided comments that show a lack of attendance to the paper's core contributions / refused to acknowledge direct responses to their questions].

We understand the demanding nature of the review process, but we feel this situation may compromise the fairness of the evaluation for our submission. We would be grateful if you could look into this matter and provide any guidance on how to proceed.

Thank you for your time and continued service to the conference.

Best regards,

The Authors of Submission {{submissionId}}
```

润色这些消息时，称呼、落款、段落顺序和占位符保持不变，只改语法、重复和用词。

## 11. 论文记忆

论文的背景摘要，在润色回复和追问回复时反复使用。每个标题都保留；原文在某一项上内容很少时，写一句有依据的简短说明，不要猜。

```text
## Contribution Overview

## Introduction

## Methods

## Logic Chain

## Experiments

## Key Conclusions
```

## 12. 常用句

表达分歧或澄清误解，同时不显得防御：

```text
We believe this may stem from ...
To clarify our intent, ...
To clarify: [the specific point].
The metric has a known limitation: [state it]. We address this in [Appendix B].
```

指回之前的回复：

```text
As noted in our Response W2, ...
As discussed in our initial response, ...
```

做出范围明确、内容具体的修改承诺：

```text
We have added [Table 4 comparing our method against X and Y on Z] to the revision.
We will add a clarifying paragraph to Section [N].
Results will appear in the revision.
```

处理引用和 baseline：

```text
[Author et al., Year, "Title", Venue]
Thank you for pointing out [Paper]; we will add a discussion in Related Work.
We have examined [Paper], which evaluates on [different setting], making direct comparison difficult.
We searched but could not locate this work; we would appreciate a link or full title.
[CITATION NEEDED - verify before submission: "paper title"]
```

只有作者才能提供的内容，用这个占位：

```text
[AUTHOR INPUT NEEDED: what is missing, e.g. "result of the BOFT comparison, or the reason it is not comparable"]
```
