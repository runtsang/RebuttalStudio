# Rebuttal Studio 使用文档（中文）

这套文档是当前版本 Rebuttal Studio 的用户说明，既覆盖五阶段 rebuttal 工作流，也覆盖最近新增的项目级功能，例如 Document Memory、Template Center、项目快照和扩展后的 API 设置。

> 项目介绍、安装说明和贡献指南请参阅[主 README](../../README.md)。

---

## 五阶段流程一览

| 阶段 | 名称 | 你在做什么 | 输出 |
|:----:|:-----|:----------|:-----|
| **1** | **Breakdown** | 粘贴 Reviewer 完整评论，让 LLM 拆成原子问题 | 含评分、Summary、Strengths 和逐条 Weakness/Question 的结构化问题列表 |
| **2** | **Reply** | 为每条问题写大纲，必要时参考 Document Memory，再润色成正式回复 | 每条原子问题对应一份经过人工核查的 Refined Draft |
| **3** | **First Round** | 组装格式化文档，调整样式，控制长度 | 可直接复制提交的 rebuttal 文本（单块或分段） |
| **4** | **Multi Rounds**（可选）| 结合前文压缩上下文与可选的 Document Memory，处理讨论期追问 | 上下文感知的简洁跟进回复 |
| **5** | **Final Remarks** | 生成写给 Area Chair 的 Final Remarks | 含优点总结、关注点表格和修改承诺的结构化 AC 总结 |

---

## 各阶段指南

| 阶段 | 指南 | 简介 |
|:----:|:-----|:-----|
| 1 | [Breakdown](./stage1-breakdown.md) | 将 Reviewer 评论解析为原子问题列表并提取会议对应的评分字段 |
| 2 | [Reply](./stage2-reply.md) | 撰写并润色每条问题的逐条回复 |
| 3 | [First Round](./stage3-first-round.md) | 组装格式化的首轮 rebuttal 并准备提交 |
| 4 | [Multi Rounds](./stage4-multi-rounds.md) | 处理讨论期追问 |
| 5 | [Final Remarks](./stage5-final-remarks.md) | 生成写给 AC 的 Final Remarks |

---

## 当前支持的会议格式

| 会议 | 评分字段 | 说明 |
|:-----|:---------|:-----|
| **ICLR** | Rating、Confidence、Soundness、Presentation、Contribution | 共 5 项 |
| **ICML** | Rating、Confidence、Soundness、Presentation、Significance、Originality | 共 6 项 |
| **NeurIPS** | Rating、Confidence、Quality、Clarity、Significance、Originality | 共 6 项 |
| **ARR** | Confidence、Soundness、Excitement、Assessment、Reproducibility | 共 5 项 |

如果你的会议暂不在支持列表中，可以先选择最接近的一个模板，再手动核对评分字段。

> 扩展提醒：未来新增会议时，请先套用 `skills/stage1/template/SKILL.md` 和 `skills/stage2/template/SKILL.md`，只修改会议差异项，不要从零重写。

---

## 项目级功能

### 1. Document Memory

每个项目现在都可以保存一个项目级 **Document Memory**。它有两个入口：

- 新建项目时可选上传
- 进入项目后，通过侧边栏的 **Document Memory** 按钮进入

当前支持的文件类型：

- `.txt`
- `.md`
- `.tex` / `.latex`
- `.pdf`

处理逻辑：

- Text、Markdown、LaTeX 文件会直接按文本读取。
- PDF 会先用本地 Python 脚本抽取文本，再进入总结流程。
- 系统会在项目目录内保存一份可编辑的 Markdown 摘要。
- 这份 Markdown 只会作为背景知识注入 **Stage 2 Refine** 和 **Stage 4 Refine**。
- 它只提供 supporting context，不会覆盖 reviewer 原问题，也不会覆盖你当前写的大纲或追问草稿。

注意事项：

- 大多数模型 API 不直接接收原始文件，因此 Rebuttal Studio 会统一先转成文本。
- PDF 文本抽取可能失败或抽得不干净；如果你已经有 `.txt`、`.md` 或 `.tex`，优先使用这些格式。
- 如果自动总结失败，你仍然可以手动编辑或直接粘贴 Markdown 内容。

### 2. Documents 与 Template Center

侧边栏现在有两个不会打断当前 stage 的辅助入口：

- **Documents**：打开内置阶段文档阅读器
- **Template**：打开 Template Center，用来渲染、复制 reviewer / AC 场景下的常用模板，也可以选择 AI polish

这些工具本身不会覆盖项目内容，除非你手动把结果粘贴回草稿中。

### 3. 项目管理

当前版本已经支持以下项目级操作：

- 新建、重命名、复制、删除项目
- 保存与恢复项目快照
- 按项目设置 autosave 间隔
- 会话内的 undo / redo
- 将 Reviewer 标签重命名为稳定的 4 位标识符

### 4. API 设置与诊断

API Settings 对话框现在支持：

- 按 provider 保存配置
- 为 OpenAI-compatible 接口自定义 base URL
- 对支持的 provider 使用 **Detect models**
- 顶栏显示当前激活模型
- 顶栏显示 token usage
- 遇到 API 报错时弹出详细错误窗口，便于定位或反馈

当前调用边界：

- 本版本的主要 stage 生成流程已经接通 **Google Gemini** 和 **OpenAI-compatible providers**。
- 这包括 OpenAI、DeepSeek、Azure OpenAI、Qwen、OpenRouter、Groq、Grok、Together AI、Kimi、MiniMax、HuggingFace、Portkey、AWS Bedrock，以及自定义 OpenAI-compatible 接口。
- 某些 provider 可能已经出现在设置界面中，用于配置或模型发现，但尚未完全接通所有 stage。

---

## 快速开始

1. **创建项目**：在主页新建项目，并选择正确的会议类型。
2. **可选上传 Document Memory**：如果你希望 Stage 2 / Stage 4 可以参考论文背景知识，可以在建项目时一起上传。
3. **配置 API**：打开 API Settings，填入可用的 provider 和模型。
4. **Stage 1**：粘贴每位 Reviewer 的完整评论，点击 `Break down`，整理问题列表。
5. **Stage 2**：对每条问题在 `My Reply` 中写大纲，必要时打开 `Document Memory`，然后点击 `Refine`。
6. **Stage 3**：检查整合后的文本，调整样式与颜色，并在需要时拆分成多个部分。
7. **Stage 4（如需要）**：粘贴 Reviewer 的追问，先压缩前文上下文，再润色新回复。
8. **Stage 5**：套用 Final Remarks 模板，填写必要的最终评分变化，自动填充后认真预览与修改。

---

## 配置 API

配置步骤：

1. 点击顶部栏的 **API Settings**。
2. 选择 provider。
3. 输入 API Key。
4. 按需调整 base URL。
5. 如果支持，点击 **Detect models** 获取模型列表。
6. 保存配置。顶部会显示当前激活模型。

补充说明：

- 所有 API 请求都由你的本机直接发往 provider。
- Rebuttal Studio 不会通过自己的服务器中转这些请求。
- 如果某个 provider / model 组合和当前工作流不兼容，应用会明确报错，而不是静默降级。

---

[→ 返回主 README](../../README.md)
