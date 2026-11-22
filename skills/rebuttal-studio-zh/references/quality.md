# 回复策略与质量检查

各阶段通用的指导：怎么规划一条回复，以及成稿之后要过的几遍检查。Rebuttal 正文用英文写，所以下面的例句和替换词保持英文。

## 目录

1. [判断评论类型，选择回复策略](#1-判断评论类型选择回复策略)
2. [去 AI 腔](#2-去-ai-腔)
3. [压缩](#3-压缩)
4. [提交前自查](#4-提交前自查)
5. [引用核实](#5-引用核实)

---

## 1. 判断评论类型，选择回复策略

| 类型 | 含义 | 例子 |
| --- | --- | --- |
| Major | 影响结论的核心科学或方法问题 | "The baseline comparison is unfair" |
| Minor | 表述、措辞，或补充性的实验 | "Figure 3 is hard to read"、"Missing ablation on X" |
| Misunderstanding | reviewer 误读了论文 | "No comparison with Y"（其实 Y 在 Table 2 里） |
| Typo / Clarity | 事实性笔误、语法、表述不清 | "Definition 2 appears to be incorrect" |

| 策略 | 什么时候用 | 核心做法 |
| --- | --- | --- |
| Accept | reviewer 说得对 | 明确承认，说明做了什么修改，指出修改的位置 |
| Defend | 确实存在科学上的分歧 | 给证据、引已有工作，有额外数据就给出 |
| Clarify | 论文里其实已经回答了 | 引用相关章节并解释 |
| Experiment | 要求补充实证 | 说明实验设置并给出结果 |

为每个问题建议一个类型和一个策略，由作者决定。

每条回复都遵循的原则：

1. 先肯定 reviewer 认可的地方，再回应问题。
2. 每个论断都要有依据：论文章节、实验结果、核实过的引用，或者新做的实验。
3. 每个问题都要回应。不回应会被当成回避，哪怕只写一句也比不写好。
4. 不用防御性的语言。不写 "the reviewer is incorrect"，而写 "We believe this may stem from ..."。
5. 力求简洁，但不能因此把问题只答一半。

通常有效的做法：先表达感谢；reviewer 没看懂的地方补上直观解释；每个主要的实验选择都给出理由；正面回应伦理和局限性问题；用一句具体的话说明实际价值或可扩展性。

## 2. 去 AI 腔

Rebuttal 里的每句话都应该只对这篇论文成立。放进任何一篇 rebuttal 都说得通的句子，要么改写，要么删掉。只做针对性的修改，不要整段重写。

删掉填充语和强调套话：

| 删掉 | 改成 |
| --- | --- |
| In order to address this concern ... | To address this ... |
| It is worth noting that / It is important to highlight that | （直接说内容） |
| We would like to clarify that | We clarify that |
| Due to the fact that | Because |
| crucial、pivotal、paramount、delve into、unpack | （删掉，或者说具体） |
| additionally、furthermore（用在句首时） | 调整句子结构 |
| leverage、utilize | use |
| facilitate | help、enable |
| demonstrate | show |
| comprehensive、novel | 说清楚覆盖了什么、新在哪里 |

打破套路化的结构：否定式排比（"not just X, but Y"）、硬凑的三项并列、每条回复都用 "First ... Second ... Third ..."、用破折号卖关子、每段都以一句金句收尾。

相信 reviewer 的水平：结论先行，不要手把手解释，不要叠加含糊措辞（"could potentially perhaps"）。

"we" 直接用："We argue that ..."，不要写成 "The authors feel it may be the case that ..."。

给每个回复块在五个维度上各打 0 到 10 分：

| 维度 | 0 分 | 10 分 |
| --- | --- | --- |
| 直接 | 答案埋在套话后面 | 第一句就给出答案 |
| 具体 | 放进任何 rebuttal 都行 | 点出这篇论文的结果和这条评论 |
| 节奏 | 句子长度一律 | 长短句交错 |
| 语气 | 防御或生硬 | 平等、自信、讲事实 |
| 密度 | 堆满了客套话 | 每句话都在推进 |

40 到 50 分：可以提交。30 到 39 分：做针对性修改。30 分以下：回到作者的要点重写。

永远不动的内容：技术论断、数字、引用、占位符、reviewer 的引文，以及回复块的结构和标签。

## 3. 压缩

缩短文字，但不改变内容。

1. 意思完全保留，语言不变。
2. 删掉填充语、重复和不必要的含糊措辞。
3. 保留每一个技术论断、数字、公式、引用、专有名词和占位符。
4. 保留 reviewer 的引文和结构标签。
5. 不添加信息、解读、承诺或证据。
6. 立场、倾向和确信程度不变。
7. 段落、列表和 Markdown 结构不变。
8. 原文已经很紧凑时，几乎不改。

## 4. 提交前自查

首轮文档组装完之后、每次回复追问之后、final remarks 写完之后，各做一遍。

覆盖：
- [ ] breakdown 里的每个原子问题都有对应的回复块。
- [ ] 每个追问都回答了。
- [ ] 暂时无法解决的问题，说明了情况和原因。

语气：
- [ ] 每位 reviewer 的回复都以感谢开头，并点到这位 reviewer 认可的内容。
- [ ] 没有防御性的措辞、讽刺或情绪。
- [ ] 分歧以澄清的方式表达。
- [ ] 承诺是具体的（"We will add X in Section Y"）。

事实：
- [ ] 每个数字都和论文或作者的笔记一致。
- [ ] 没有声称做了实际上没做的实验。
- [ ] 每条新引用都核实过（第 5 节）。
- [ ] 每个 Section/Table/Figure 的指向都正确。

结构：
- [ ] 每条回复前面都有 reviewer 的原话，并且一字不差。
- [ ] 标签一致，全文只用一个主题色。
- [ ] 没有残留的 `[AUTHOR INPUT NEEDED]`、`{{placeholder}}` 或者字面的 "A, B, and C"。
- [ ] 每一部分都没有超过平台上限。

清晰：
- [ ] 每条回复在前两句之内给出结论；有开场句时，结论紧跟在开场句后面。
- [ ] 表格单独看也能看懂；符号和论文一致。
- [ ] 没有多余的篇幅。

常见错误：

| 错误 | 改法 |
| --- | --- |
| 漏答：某个问题没有回复 | 至少补一句 |
| 承诺过头："We will completely redesign Section 4" | 收窄范围："We will add a clarifying paragraph to Section 4" |
| 指向错误：数据在 Table 2，却写 "See Table 3" | 逐个核对引用位置 |
| 防御式转移：换个说法但没有回答 | 先回答，再补充背景 |
| 只说不给：只写 "We ran this experiment"，没有数字 | 给出结果，或者说明结果会放进修改稿 |

## 5. 引用核实

核心规则：没有查证过的引用，不进 rebuttal。Rebuttal 提交之后无法更正，一条编造的参考文献会让整篇回复失去可信度。

以下来源的引用都要核实：模型建议的、凭记忆写的、从 reviewer 评论里抄来的，以及为了回应 “缺少 baseline” 或 “缺少相关工作” 而新加的。论文参考文献里已有的引用，只需确认所引的结论确实出自那篇文章。

流程：

1. 搜索：Google Scholar、Semantic Scholar、arXiv、ACL Anthology、OpenReview。
2. 确认存在：标题、第一作者、年份（允许相差一年，预印本和正式发表的年份常常不同）、发表会议（workshop 不等于主会）。
3. 确认结论：找到支持该结论的那句话、那张表或那张图。看不到全文时，引用得保守一些，或者不引。
4. 记录为 `[Author et al., Year, "Title", Venue]`。

核实不了时：删掉这条引用；或者不点名具体论文，泛泛表述；或者标成 `[CITATION NEEDED - verify before submission: "title"]` 留给作者。标为“可以提交”的文本里，不能有未核实的引用。

| 引用来源 | 风险 | 处理 |
| --- | --- | --- |
| 模型建议的 | 很高 | 必须核实 |
| 凭记忆写的 | 中 | 核实标题和年份 |
| 从 reviewer 评论里抄的 | 中 | 核实是否存在；reviewer 也会记错 |
| 论文参考文献里已有的 | 低 | 确认所引结论确实在那篇文章里 |

reviewer 建议的 baseline 不一定可比。答应比较之前，先确认它评测的任务和设置与本文一致。

---

第 1、2、4、5 节改编自 gaoruizhang 的 [Claude Scholar](https://github.com/Galaxy-Dawn/claude-scholar)（MIT License），并针对 rebuttal 场景做了调整。去 AI 腔部分基于 WikiProject AI Cleanup 维护的 Wikipedia “Signs of AI writing” 指南。
