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
  <a href="#-更新rebuttal-studio-已存档">
    <img src="https://img.shields.io/badge/status-archived-orange.svg" alt="状态：已存档"/>
  </a>
  <a href="#-rebuttal-studio-skill">
    <img src="https://img.shields.io/badge/skill-Claude%20Code%20%7C%20Codex-8A2BE2.svg" alt="适用于 Claude Code 和 Codex 的 Skill"/>
  </a>
</p>

<p align="center">
  <b>一个帮研究者写出高质量学术 rebuttal 的编辑器：让你专注于<i>说什么</i>，而不是<i>怎么排版</i>。</b>
</p>

<p align="center">
  <a href="README.md">English</a> | <b>简体中文</b>
</p>

<p align="center">
  <img src="img/teaser.png" alt="Rebuttal Studio Teaser" width="800"/>
</p>

---

## 📢 更新：Rebuttal Studio 已存档

**这是 Rebuttal Studio 的最后一个版本，项目不再更新。**

每个会议的审稿表单、评分标准和 rebuttal 规则几乎每一届都在变，编辑器依赖的各家大模型 API 平台变得同样快。要让一个编辑器同时跟上这两边，需要持续不断地维护，而我们没有这个精力。

Rebuttal Studio 真正有用的部分是流程和格式，这两样并不依赖编辑器。现在它们以两种形式保留下来：

1. **Skill。** 我们把完整的五阶段流程打包成了一个 skill。把它接入你自己的 coding plan，用 Claude Code 或 Codex，直接通过对话来写 rebuttal，不再需要编辑器。你不用配置 API key，我们也不用再追着各家平台更新。
2. **纯文本模板。** 我们用到的所有格式都列在下面，可以直接复制。喜欢手动写的话，有这些就够了。

编辑器本身停留在 v0.4.8，仍然可以运行。原来的 README 和使用文档都保存在[存档](#-存档)里。

---

## 🧩 `rebuttal-studio` Skill

### 安装

先克隆仓库，再把 skill 文件夹复制到你所用 agent 的 skills 目录。

```bash
git clone https://github.com/runtsang/RebuttalStudio.git
```

Claude Code：

```bash
mkdir -p ~/.claude/skills && cp -r RebuttalStudio/skills/rebuttal-studio-zh ~/.claude/skills/
```

Codex：

```bash
mkdir -p ~/.codex/skills && cp -r RebuttalStudio/skills/rebuttal-studio-zh ~/.codex/skills/
```

装好后新开一个会话，agent 才会加载它。上面装的是中文版；英文版在 [`skills/rebuttal-studio`](skills/rebuttal-studio)，内容相同。两个版本装一个就行，不要同时装。

### 使用

在放着论文和审稿意见的文件夹里打开 Claude Code 或 Codex，直接用自然语言说：

```text
用 rebuttal-studio-zh skill。会议是 ICLR，Submission 4127。审稿意见在 reviews/ 里，每个 reviewer 一个文件；论文在 paper/main.tex。OpenReview 每条评论上限 5000 字符。先从 Reviewer aB3x 的 breakdown 开始。
```

agent 会带着你一个阶段一个阶段往下走，并把每一步的结果存到 `rebuttal/` 下面。reviewer 回复之后，你可以随时回来接着做：

```text
Reviewer aB3x 追问了："<把追问原文贴在这里>"。我想回的要点：<你的要点>。帮我写 follow-up 回复。
```

```text
讨论期结束了。Reviewer cH6y 把分数从 4 提到了 6。帮我写给 AC 的 final remarks。
```

```text
Reviewer ZpqT 一直没有回复我们的 rebuttal，给我一封催促消息。
```

在 Claude Code 里，也可以直接输入 `/rebuttal-studio-zh` 启动。

### 每个阶段做什么

| 阶段 | 你提供 | agent 负责 | 保存位置 |
|:----:|:-------|:-----------|:---------|
| **1 Breakdown** | 每位 reviewer 的完整审稿意见 | 提取评分，原样保留 summary 和 strengths，把 weaknesses 和 questions 拆成原子问题 | `rebuttal/<reviewer>/breakdown.md` |
| **2 Reply** | 每个问题的回复要点：结论、证据、论文里改了什么 | 建议回复策略，再把你的要点润色成正式回复 | `rebuttal/<reviewer>/replies.md` |
| **3 First Round** | 平台字数上限和主题色 | 组装开头、带颜色的 point-to-point 回复块和结尾；统计字符数；按上限拆分 | `rebuttal/<reviewer>/first-round.md` |
| **4 Multi Rounds**（可选） | reviewer 的追问和你的要点 | 压缩首轮回复作为上下文，写出与之一致的简短回复 | `rebuttal/<reviewer>/followups.md` |
| **5 Final Remarks** | 最终评分和分数变化 | 填好写给 Area Chair 的四段式总结 | `rebuttal/final-remarks.md` |

另外，你还可以让它写催促 reviewer 的消息、写给 AC 的保密说明、去掉 AI 腔、压缩过长的段落、做提交前检查，以及核实新加的引用。

### 需要知道的几点

- **内容由你决定。** skill 明确要求 agent 不编造实验、数字和引用。遇到只有你才知道的内容，它会留下 `[AUTHOR INPUT NEEDED: BOFT 对比实验的结果]` 这样的占位，并把所有待填的地方列给你。
- **会议表单会变。** 内置的字段映射（ICLR、ICML、NeurIPS、ARR）对应的是 2026 年初的情况。skill 会先读实际的审稿意见再做调整，你也可以自己修改 [`references/venues.md`](skills/rebuttal-studio-zh/references/venues.md)。
- **发出去之前自己通读一遍。** 最终文本里的每一句话都由你负责。

---

## 📋 手动使用的模板

下面全部是纯文本。复制一段，替换方括号里的内容，贴到 OpenReview 即可。Rebuttal 一般用英文写，所以模板保持英文原文。完整的模板库（包括 breakdown 骨架和更多常用句）见 [`references/templates.md`](skills/rebuttal-studio-zh/references/templates.md)。

### 1. Point-to-point 回复

每个 reviewer 关注点对应一个回复块：带颜色的标题、引用 reviewer 原话、带颜色的 Response 标签，然后是你的回复。

```text
### **${\color{#f26921}\text{R1: Regarding the Novelty Clarification.}}$**

> ${\color{#f26921}\text{Weakness-1:}}$
> [The reviewer's original words, verbatim. Every quoted line starts with "> ".]

${\color{#f26921}\text{Response W1:}}$

[Your response. Plain Markdown: paragraphs, tables, code blocks, and $math$ all work.]
```

| 部分 | 怎么改 |
|:-----|:-------|
| **颜色** | `${\color{#f26921}\text{...}}$` 是 OpenReview 能渲染的 LaTeX 写法。把 `#f26921`（橙色）换成任意 6 位十六进制颜色，全文用同一个颜色。花括号里的文字必须在同一行，且不能包含 `{` 或 `}`。 |
| **标题** | `R1`、`R2`…… 是同一位 reviewer 下回复块的序号，后面跟一个简短小标题，通常写成 "Regarding ..."。 |
| **引用** | `Weakness-1:` 或 `Question-1:`（也可以缩写成 `W1:` / `Q1:`），两类分别编号。reviewer 的原话原样粘贴，不要改写。 |
| **Response 标签** | `Response W1:` 回复 Weakness-1，`Response Q2:` 回复 Question-2。 |
| **行内高亮** | 同样的写法可以给任意短语上色，例如 `marked in ${\color{#f26921}\text{orange}}$ in the revision`。 |

<p align="center">
  <img src="img/ex1.jpg" alt="渲染后的 point-to-point 回复" width="800"/>
</p>

### 2. 每位 reviewer 的开头和结尾

开头，放在第一个回复块之前。把 `A`、`B`、`C` 换成这位 reviewer 实际认可的优点：

```text
Thank you for acknowledging the A, B, and C of our method. We sincerely appreciate your time and effort in reviewing our paper and providing valuable comments. We provide explanations to your questions point-by-point in the following.
```

结尾，放在最后一个回复块之后：

```text
**We appreciate your thoughtful comments. We hope our response addresses your concerns. Please let us know if there are any additional questions, and we will be happy to discuss further.**
```

### 3. 回复太长时的拆分

回复超过平台上限时，只在回复块之间拆，不要把一个回复块拆开。每一部分单独发一条评论，标题用：

```text
Author Response to Reviewer {{reviewerId}} (Part {{i}}/{{N}})
```

### 4. 礼貌开场句

每条回复开头最多用一句，根据 reviewer 的意图来选：

```text
Thank you for the excellent suggestion.
Thank you for pointing this out.
Thank you for highlighting this important point about [TOPIC].
We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA].
Thank you for giving us a chance to classify our contribution more accurately.
```

| reviewer 的意图 | 开场句 |
|:----------------|:-------|
| 给出可操作的改进建议 | Thank you for the excellent suggestion. |
| 指出遗漏或表述不清 | Thank you for pointing this out. |
| 强调某个维度的重要性 | Thank you for highlighting this important point about [TOPIC]. |
| 质疑原创性或定位 | We appreciate the opportunity to further articulate the novelty of [METHOD/IDEA]. |
| 对贡献的类别或范围理解有偏差 | Thank you for giving us a chance to classify our contribution more accurately. |
| 只是问一个事实性问题 | 不用开场句，直接回答。 |

### 5. 写给 Area Chair 的 Final Remarks

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

| 占位符 | 写什么 |
|:-------|:-------|
| `{{acknowledgments_overall}}` | 一两句话感谢所有 reviewer，点名参与讨论最积极的几位。 |
| `{{before_discussion_summary}}` | 每位 reviewer 的初始评分，以及他们表示愿意重新考虑评分的原话。 |
| `{{during_discussion_summary}}` | 哪些问题已经解决（引用 reviewer 的原话），以及每一次明确的分数变化。 |
| `{{key_strengths_points_markdown}}` | 综合所有 reviewer 的 4 到 5 条优点，可以按维度分组，并在括号里标出 reviewer ID。 |
| `{{concern_rows_markdown}}` | 每个实质性问题一行：`*简短名称.* 问题描述` / reviewer ID / 一句具体的回复。 |
| `{{commitment_to_revision}}` | 已经完成或承诺要做的具体修改，以及它们在修改稿中的标记方式。 |

<details>
<summary><b>填写示例（TokenSeek，ICLR）</b></summary>

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
  <img src="img/ex2.jpg" alt="渲染后的 final remarks" width="800"/>
</p>

### 6. 多轮讨论

回复追问之前，先把你给这位 reviewer 的首轮回复压缩成一小段上下文，这样新的回复才能和之前说过的保持一致：

```text
## Key Question(s)
- [one line per main concern the reviewer raised]

## Main Answer(s)
- **[Topic]:** [the answer you gave, with its key numbers and commitments]
```

追问的回复比首轮更短、更直接，一般一到两段：

```text
[Thanks tied to the specific follow-up.] [Direct answer.]

[Evidence, or a pointer to your earlier answer: "As noted in our Response W2, ..."] [What will be added to the revision.]
```

### 7. 发给 reviewer 和 Area Chair 的消息

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

向 Area Chair 保密反映某位 reviewer 不回应或审稿不公。标题：`Confidential concern regarding Reviewer {{reviewerId}}`

```text
Dear Area Chair,

We are writing to you confidentially regarding our submission {{submissionId}}. We have significant concerns about the engagement and quality of the review provided by Reviewer {{reviewerId}}.

Despite our detailed rebuttal and efforts to engage in constructive dialogue, Reviewer {{reviewerId}} has [briefly state the issue: e.g., remained unresponsive / provided comments that show a lack of attendance to the paper's core contributions / refused to acknowledge direct responses to their questions].

We understand the demanding nature of the review process, but we feel this situation may compromise the fairness of the evaluation for our submission. We would be grateful if you could look into this matter and provide any guidance on how to proceed.

Thank you for your time and continued service to the conference.

Best regards,

The Authors of Submission {{submissionId}}
```

### 8. 常用句

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

## 🙏 感谢

Rebuttal Studio 最初只是一个周末的产物：一个从没写过应用的人，花了大约 15 个小时做出来的。它后来能走这么远，是因为你们。

感谢每一位给仓库点过 star、在真实的 rebuttal 里用过它、提过 issue、发过 pull request，或者把它推荐给同门的人。感谢为代码投入了自己时间的贡献者：

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

也感谢 gaoruizhang 的 [Claude Scholar](https://github.com/Galaxy-Dawn/claude-scholar)：回复策略、去 AI 腔、自查和引用核实这几部分内容改编自其中的 skills。

希望这个 skill 和这些模板，在下一轮审稿意见到来时还能帮你省下时间。祝大家 rebuttal 顺利。

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

## 📦 存档

编辑器时期的所有内容都还在这个仓库里：

- **[存档版 README](archive/README.md)**：编辑器原来的介绍、安装方法、示例和路线图（英文）。
- **编辑器使用文档**：[中文](documents/ch/README.md) | [English](documents/en/README.md)
- **编辑器本身**，停留在 v0.4.8，仍然可以用 `npm install` 和 `npm start` 运行，详见存档版 README。
- **编辑器自带的 prompts**：[`skills/`](skills/README.md) 下的其他文件夹，`rebuttal-studio` skill 就是从它们提炼出来的。

---

## 📌 引用

如果 Rebuttal Studio 对你的研究有帮助，欢迎引用：

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

本项目基于 MIT License 开源。

<p align="center">
  <i>Built with ❤️ for the research community.</i>
</p>

<p align="center">
  <a href="archive/README.md">📦 想看原来的 README？它存档在这里。</a>
</p>
