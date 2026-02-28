# Stage 5 — Final Remarks

Stage 5 生成写给 Area Chair（AC）的 **Final Remarks**——一份结构化的、面向 AC 的高层总结，帮助 AC 在了解整轮 Rebuttal 全貌的基础上做出决策。与 Stage 3 针对每位 Reviewer 的逐条回复不同，Final Remarks 直接面向 AC：总结论文的核心优点、Reviewer 提出的主要关切、你如何应对这些关切，以及你承诺在修订版中做出的具体改动。

## 在整体流程中的位置

```
... → Stage 3: First Round → Stage 4: Multi Rounds（可选）→ Stage 5: Final Remarks [结束]
```

Stage 5 是整个流程的最后一步，对先前所有阶段的信息——Reviewer 的关切、你的回复、讨论结果——进行综合汇总。

## 开始前的准备

- [ ] 项目中**所有** Reviewer 的 Stage 3（以及可选的 Stage 4）已完成。
- [ ] 已确认是否有 Reviewer 在讨论期明确表示愿意提分。
- [ ] 已在 **API Settings** 中配置好 API Key（Auto Fill 功能需要）。

> **注意：** Final Remarks 的读者是 AC，不是 Reviewer。请以一个高层次了解你的论文但不一定读过每条 Rebuttal 细节的读者为目标来写，确保文档本身能够自圆其说。

## 界面说明

**Template 按钮**
打开 Final Remarks 模板弹窗，包含样式选择器。应用模板后，Stage 5 编辑器会重置为所选模板的骨架结构，其中包含占位符标记。

**左侧面板——原始 Markdown 编辑器**
预填有模板结构的 Markdown 编辑器，可以直接修改。模板分四个部分：

- **I. Acknowledgments（致谢）**——讨论的整体基调；Rebuttal 前后的情况描述；评分变化（如有）。
- **II. Key Strengths（核心优点）**——来自所有 Reviewer 正面评价的 4–5 条 bullet，概括你工作的核心价值。
- **III. Key Concerns and Our Responses（关注点与回应）**——Markdown 表格，每行对应一项主要关切，三列：关注点 | Reviewer | 你的回复摘要。
- **IV. Commitment to Revision（修改承诺）**——你已经完成或承诺在修订版中进行的具体改动列表。

**评分变化字段（每位 Reviewer 一组）**
每位 Reviewer 对应**原始评分**和**最终评分**两个字段。当某位 Reviewer 在讨论中明确表示愿意提分时填写，Auto Fill 会将此信息并入致谢部分。没有评分变化的 Reviewer 留空即可。

**Auto Fill 按钮**
触发 LLM 自动填充所有模板占位符。LLM 读取每位 Reviewer 的 Stage 4 压缩上下文（若未使用 Stage 4，则直接读取 Stage 3 内容），为各占位符生成合适的内容。

**Preview 按钮**
将编辑器中当前的 Markdown 渲染为格式化的 HTML，让你在复制提交之前预览最终呈现效果。

## 操作步骤

1. **点击 Template，应用模板。**
   加载包含所有占位符标记的骨架结构。从模板开始，而不是从空白编辑器开始，确保四个部分的结构完整。

2. **填写评分变化字段。**
   对于在讨论中明确表示愿意提分的 Reviewer，在对应字段填入原始评分和新评分。没有变化的 Reviewer 留空。Auto Fill 运行时会将此信息融入致谢部分。

3. **点击 Auto Fill。**
   LLM 读取所有 Reviewer 的压缩讨论上下文，自动填充各占位符：
   - 致谢段落（整体基调、讨论前后的情况摘要）。
   - 核心优点 bullet 列表，提炼自 Reviewer 的正面评价。
   - 关注点表格的各行，每行对应一项跨 Reviewer 的实质性关切。
   - 修改承诺条目。

4. **逐节审查并修改原始 Markdown。**

   **I. Acknowledgments（致谢）：**
   - 核实整体基调是否准确反映了本轮讨论的走向。
   - 如果某位 Reviewer 明确表示了评分变化，确认此处有所体现。
   - 如果没有 Reviewer 提分，确保措辞诚实，不过于乐观。

   **II. Key Strengths（核心优点）：**
   - 确认每条 bullet 对应 Reviewer 真正认可的优点，而不是 LLM 生成的泛泛之词。
   - 目标是 4–5 条涵盖不同维度的要点（新颖性、严密性、实验结果、表达清晰度等）。

   **III. Key Concerns and Our Responses（关注点与回应）：**
   - 这是 AC 最关注的部分。每行应代表一个真实的、有实质意义的关切。
   - 核实 Reviewer 列的 Reviewer ID 是否对应正确。
   - 检查"回复摘要"列是否准确反映了你的论述——不是"我们已回应"这种空话，而是一两句具体的摘要说明。
   - 删除琐碎的、已平凡解决的条目（例如补充参考文献、改正笔误），表格应聚焦于方法论或实验层面的实质性关切。

   **IV. Commitment to Revision（修改承诺）：**
   - 列出具体的、有名称的改动（例如"在 Appendix B 中增加了与 X、Y 方法的对比实验（Table 4）"、"修改了 Section 3.2，澄清了我们的方法与前人工作的区别"）。
   - 避免"我们将改善表达"这类模糊的承诺——对 AC 没有说服力。

5. **点击 Preview 检查渲染效果。**
   审查格式化输出：
   - 关注点表格的对齐是否正确。
   - Markdown 格式（加粗、bullet 列表）是否正常渲染。
   - 是否还有未被 Auto Fill 填充的 `{{placeholder}}` 占位符需要手动替换。

6. **复制并提交。**
   Preview 确认无误后，复制内容（根据平台要求选择渲染后的 HTML 或原始 Markdown），粘贴到会议平台对应字段。

## 技巧与注意事项

- **写作对象是 AC，不是 Reviewer。** AC 读过你的论文，但不一定读过每条 Rebuttal 细节。Final Remarks 应该独立成篇，不依赖 Reviewer 翻阅你的 Stage 3 回复才能理解。
- **明确引用 Reviewer 的评分变化表态。** 如果 Reviewer 说"我打算将评分提高到 7"或"我现在倾向于接受"，在致谢段落中转述这句话。AC 会非常重视 Reviewer 的明确表态。
- **关注点表格是 Final Remarks 的核心。** AC 用这张表快速判断论文的主要问题是否得到了有实质意义的回应。每行要精确且真实。
- **不要在不审查的情况下直接提交 Auto Fill 的结果。** LLM 可能会把某个关切归属到错误的 Reviewer，或者生成措辞不精确的回复摘要。把 Auto Fill 视为初稿的起点，而不是最终版本。
- **修改承诺要具体可信。** 有名称的实验、具体的章节标题、明确的补充内容——这些比泛泛的修改意向有说服力得多。

## 预期输出

完成的 Stage 5 Final Remarks 文档应该：

- 四个模板部分均已填充准确的、针对具体 Reviewer 的内容（没有未填充的 `{{placeholder}}` 占位符）。
- 致谢部分准确反映讨论结果，包含任何评分变化的记录。
- 核心优点列表有 4–5 条各有侧重的 bullet。
- 关注点表格有 4–8 行，涵盖主要关切，每行有正确的 Reviewer 归属和具体的回复摘要。
- 修改承诺列出具体的、有名称的改动内容。

---

[← Stage 4 — Multi Rounds](./stage4-multi-rounds.md) | [返回文档目录](./README.md)
