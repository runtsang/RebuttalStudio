# Rebuttal Studio 使用文档（中文）

这套文档面向 Rebuttal Studio 的使用者，涵盖从解析 Reviewer 评论到生成 AC Final Remarks 的完整五阶段工作流。文档只讲操作方法和预期效果，不涉及实现细节。

> 项目介绍、安装说明和贡献指南请参阅[主 README](../../README.md)。

---

## 五阶段流程一览

| 阶段 | 名称 | 你在做什么 | 输出 |
|:----:|:-----|:----------|:-----|
| **1** | **Breakdown** | 粘贴 Reviewer 完整评论；LLM 解析为原子问题 | 含评分、Summary、Strengths 和逐条 Weakness/Question 的结构化问题列表 |
| **2** | **Reply** | 为每条问题写大纲草稿；Refine 润色为正式段落 | 每条原子问题对应一份经过人工核查的 Refined Draft |
| **3** | **First Round** | 组装格式化文档；检查字数；复制提交 | 可直接粘贴提交的 Rebuttal 文本（单块或分段） |
| **4** | **Multi Rounds**（可选）| 处理讨论期 Reviewer 的追问 | 基于前文上下文的简洁跟进回复 |
| **5** | **Conclusion** | 生成给 AC 的 Final Remarks | 含优点总结、关注点表格和修改承诺的结构化 AC 总结 |

---

## 各阶段指南

| 阶段 | 指南 | 简介 |
|:----:|:-----|:-----|
| 1 | [Breakdown](./stage1-breakdown.md) | 将 Reviewer 评论解析为原子问题列表并提取数字评分 |
| 2 | [Reply](./stage2-reply.md) | 撰写并润色每条问题的逐条回复 |
| 3 | [First Round](./stage3-first-round.md) | 组装格式化的首轮 Rebuttal 并准备提交 |
| 4 | [Multi Rounds](./stage4-multi-rounds.md) | 处理讨论期的追问 |
| 5 | [Conclusion](./stage5-conclusion.md) | 生成写给 AC 的 Final Remarks |

---

## 支持的会议格式

| 会议 | 评分字段 | 说明 |
|:-----|:---------|:-----|
| **ICLR** | Rating、Confidence、Soundness、Presentation、Contribution | 共 5 项 |
| **ICML** | Rating、Confidence、Soundness、Presentation、Contribution、Significance、Originality | 共 7 项 |

其他会议（NeurIPS、ACL、EMNLP、CVPR 等）的支持已在计划中。当前不在支持列表的会议，选择更接近的一个并手动核对评分字段即可。

---

## 快速开始

1. **创建项目**：在主页面新建项目，选择会议类型（ICLR 或 ICML）。
2. **配置 API Key**：点击顶部栏的 API Settings，选择 Provider 并填写 API Key——所有 LLM 功能都依赖此配置。
3. **Stage 1**：粘贴每位 Reviewer 的完整评论，点击 Break down，整理问题列表。
4. **Stage 2**：对每条问题在 My Reply 里写大纲，点击 Refine，逐句核查输出。
5. **Stage 3**：在 All 视图中审查完整文档，整理格式，检查字数，复制粘贴提交平台。
6. **Stage 4（如需要）**：Reviewer 追问时，先 Condense，再 Refine，生成上下文感知的跟进回复。
7. **Stage 5**：应用模板，填入评分变化（如有），点击 Auto Fill，认真审查，提交 Final Remarks。

---

## 配置 API

Rebuttal Studio 支持以下 LLM Provider：OpenAI、Anthropic、Google Gemini、DeepSeek、Azure OpenAI。

配置方法：
1. 点击应用顶部栏的 **API Settings** 按钮。
2. 选择 Provider，填写 API Key，选择模型。
3. 保存设置。顶部栏徽标会显示当前激活的模型名称。

所有 LLM 调用从你的本机直接发送到 Provider 的 API，数据不经过 Rebuttal Studio 服务器。

---

[→ 返回主 README](../../README.md)
