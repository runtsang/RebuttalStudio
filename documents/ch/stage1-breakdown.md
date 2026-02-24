# Stage 1 — Breakdown

Stage 1 把一份完整的 Reviewer 评论转化为结构化的原子问题列表。系统会自动提取评分字段，保留 Summary 和 Strengths 原文，并将 Weaknesses 和 Questions 拆分成独立的可回复条目——确保不遗漏任何问题，在 Stage 2 中逐条应对。

## 在整体流程中的位置

```
[开始] → Stage 1: Breakdown → Stage 2: Reply → Stage 3: First Round → ...
```

这是整个流程的基础阶段。你在这里生成的问题列表决定了后续所有阶段的结构——Stage 2 的草稿撰写、Stage 3 的格式组装，以及 Stage 5 关注点表格的内容。这一步做扎实，后面每步都会更顺。

## 开始前的准备

- [ ] 已创建项目并选定会议类型（ICLR 或 ICML）——这决定系统提取哪些评分字段。
- [ ] 已准备好完整的 Reviewer 评论（包括所有部分：Summary、Strengths、Weaknesses、Questions 和评分）。
- [ ] 已在 **API Settings** 中配置好 API Key（点击 Break down 按钮时需要）。

> **注意：** 如果你只粘贴 Weaknesses 而跳过 Summary，LLM 会失去对 Reviewer 整体立场的理解，拆分质量会明显下降。请粘贴完整评论。

## 界面说明

**左侧面板——Reviewer 输入区**
一个大型文本输入框，用于粘贴 Reviewer 的原始评论。顶部的 Reviewer 标签页行允许你在同一项目的多个 Reviewer 之间切换。点击标签行上的 `+` 按钮可以新增 Reviewer。

**中间列——操作区**
包含 **Break down** 按钮。点击后，左侧内容会被发送给 LLM 进行解析。请求处理期间会显示加载指示器。

**右侧面板——结构化结果区**
解析结果以四个部分展示：

- **Scores（评分）**——从评论中提取的数字评分。ICLR 包含：Rating、Confidence、Soundness、Presentation、Contribution 共 5 项；ICML 在此基础上额外增加 Significance 和 Originality，共 7 项。
- **Summary**——Reviewer 的总体评价，原文保留。
- **Strengths**——Reviewer 的正面评价，原文保留。
- **原子问题列表**——从 Weaknesses 和 Questions 中拆分出的独立条目，每条附有短标题和来源引文。

> **会议差异说明：** ICLR 提取 5 个评分字段，ICML 提取 7 个（多出 Significance 和 Originality）。如果你的会议暂不在支持列表中，选择更接近的一个，然后手动核对评分字段。

## 操作步骤

1. **打开或创建项目。**
   在主页面新建项目，选择会议类型（ICLR 或 ICML）。这个设置影响系统寻找哪些评分字段，请在粘贴内容之前确认。

2. **选择要处理的 Reviewer 标签页。**
   每位 Reviewer 对应一个标签页。新项目默认有一个标签页，可用 `+` 按钮追加更多。

3. **将 Reviewer 的完整评论粘贴到左侧面板。**
   从 OpenReview（或你的会议平台）复制整份评论，原样粘贴，不要裁剪。LLM 需要 Summary 和 Strengths 来理解每条 Weakness 背后的上下文。

4. **点击 Break down。**
   LLM 解析评论，识别各部分边界，提取数字评分，并生成原子问题列表。每条 Weakness 和 Question 都成为一个独立的 Response 条目，按 `weakness1`、`weakness2`、……、`question1`、`question2`、…… 依次编号。

5. **核对评分面板。**
   检查每个评分字段是否为具体数字，而不是占位符字母或破折号。如果某个值看起来不对，检查原始评论的格式（比如 Reviewer 写的是"8/10"而不是"8"），修正后重新运行。

6. **逐条检查原子问题。**
   通读生成的问题列表。每一条应该代表一个可以用单独一段话回复的完整关切。重点关注：
   - 被错误合并的问题（一条条目涵盖了两个不相关的批评）。
   - 被错误拆分的问题（同一个批评被分成了两条，实际上是同一件事）。

7. **用 `+` 补充遗漏问题。**
   如果评论中有某个关切没有被捕获，点击 `+` 打开"Add Atomic Issue"弹窗。设置 **Type**（weakness 或 question），填写简短的 **Title**，粘贴相关的 **Content** 文本，点击"Add"追加到列表。

8. **用 Split 拆分过大的问题。**
   如果某条条目包含两个不同的批评，点击 **Split** 打开拆分弹窗。在文本中你想分割的位置放置光标，然后点击 **Split at Cursor**，系统将把这一条拆成两条独立条目。

9. **重命名 Reviewer 标签页。**
   右键点击标签页，选择 **Rename**，输入一个 4 字符的标识符（例如 Reviewer 在 OpenReview 上的哈希值，如 `cH6y` 或 `Ab1C`）。这个标识符会出现在 Stage 5 的关注点表格中——使用真实的 OpenReview ID 可以让 AC 一眼对应上正确的 Reviewer。

## 技巧与注意事项

- **粘贴完整评论，每次都是。** LLM 用 Summary 和 Strengths 来理解 Weakness 的背景。只粘贴 Weaknesses 会让拆分质量大打折扣。
- **不要过度拆分。** 一条原子问题应该对应一件你需要解释或证明的事情。如果评论中两条 bullet 实际上在表达同一个根本关切，合并成一条即可。
- **与原始评论核对问题数量。** 数一下原始评论中的 Weaknesses 和 Questions 各有几条，生成的列表条目数应该大致相符，不应明显更少。
- **使用真实的 Reviewer ID 命名标签页。** OpenReview 给每位匿名 Reviewer 分配了短字母数字哈希（在其评论中可见）。用这个作为标签名，Stage 5 的 Final Remarks 里的 Reviewer ID 就能和 AC 看到的一致。
- **重新运行成本很低。** 如果拆分结果看起来不对，整理一下原始输入，再次点击 Break down 即可。用 `+` 手动添加的条目不会被覆盖。

## 预期输出

一次执行质量好的 Stage 1 Breakdown 应该产出：

- 所有数字评分字段都是整数（没有破折号或字母占位符）。
- 原子问题列表包含 4–12 条条目（典型的 ICLR/ICML 评论大约如此）。
- 每条条目有一个简短描述性的标题（例如"关于缺少 Dataset X 上的 baseline 对比"）。
- 没有两条条目在核心要求上实质重叠。

**需要重新运行的情况：** 如果某个评分字段显示非数字占位符，或者明显不同的批评被合并进了同一条目，在继续之前先清理原始输入并重跑一遍。这一步做干净，后面每个阶段都更省力。

## 下一步

问题列表整理干净后，进入 **[Stage 2 — Reply](./stage2-reply.md)** 开始撰写逐条回复草稿。

---

[Stage 2 — Reply →](./stage2-reply.md)
