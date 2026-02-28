# Stage 4 — Multi Rounds

Stage 4 处理 Reviewer 在首轮 Rebuttal 之后、讨论期间发起的追问。它不是孤立地生成回复，而是先将你的 Stage 3 Rebuttal 压缩成简洁的上下文摘要，再以此为基础润色你的跟进草稿——确保新的回复与你之前的论述保持一致，既不重复也不矛盾。

## 在整体流程中的位置

```
... → Stage 3: First Round → Stage 4: Multi Rounds（可选）→ Stage 5: Final Remarks
```

Stage 4 是可选阶段，只在 Reviewer 于讨论期发起追问时才需要使用。对同一位 Reviewer 可以多次使用，支持第二轮、第三轮等多轮讨论。

## 开始前的准备

- [ ] 提出追问的 Reviewer 的 Stage 3 已完成。
- [ ] 已从会议平台获取 Reviewer 的追问原文。
- [ ] 已在 **API Settings** 中配置好 API Key。

> **注意：** 如果多位 Reviewer 同时发起追问，对每位 Reviewer 分别切换标签页处理。

## 界面说明

**Reviewer 标签页**
与 Stage 1–3 相同的标签页延续使用。选择发起追问的 Reviewer 对应的标签页。

**追问输入框（顶部区域）**
在此粘贴 Reviewer 发来的追问原文（从会议平台复制）。

**Draft Editor 文本区**
你对这条追问的初步回答草稿。与 Stage 2 相同，使用"大纲优先"的方式：写下关键要点和证据，不需要追求完整的正式表达。

**Condense 按钮**
读取当前 Reviewer 的 Stage 3 All 视图内容，将其压缩为包含两个部分的简洁摘要：
- `## Key Questions`——Reviewer 在本轮 Rebuttal 中提出的主要问题。
- `## Main Answers`——你对这些问题的核心回答。

压缩结果会被存储，供后续该 Reviewer 所有 Refine 操作自动调用。**每位 Reviewer 只需运行一次 Condense。** 后续所有追问轮次直接复用已存储的上下文。

**Refine 按钮**
接收三个输入——压缩后的 Stage 3 上下文、当前追问、你的草稿——生成一段上下文感知的润色后跟进回复。结果在弹窗中显示。

**结果弹窗**
显示生成的跟进回复，包含 **Copy** 按钮和 **Close** 按钮。

## 操作步骤

1. **选择对应 Reviewer 的标签页。**
   确认你在发起追问的 Reviewer 的标签页下操作。

2. **将 Reviewer 的追问粘贴到顶部输入框。**
   从 OpenReview（或你的会议平台）复制追问的完整原文，逐字粘贴，不要改写。LLM 需要原始措辞来精准回应。

3. **点击 Condense（仅第一次追问时需要）。**
   这一步将你的整篇 Stage 3 Rebuttal 压缩成紧凑的上下文摘要。没有它，Refine 步骤无法参考你之前的论述，生成的跟进回复可能与 Stage 3 的内容产生矛盾或重复。

   > **警告：** 第一次 Refine 之前不要跳过 Condense。没有上下文的跟进回复不知道你之前说了什么，容易造成前后不一致。

   Condense 完成后，结果会被存储。对同一位 Reviewer 的后续追问轮次，不需要再次运行 Condense。

4. **在 Draft Editor 里写你的草稿回答。**
   与 Stage 2 相同的大纲优先方式：
   - 先给出直接回答（同意、不同意，或澄清）。
   - 引用相关的具体证据，或者指向之前回复的具体位置。
   - 如果追问涉及你在 Stage 3 已经回应过的内容，在草稿中明确提示（如"如我们在 Response 3 中所述……"）。

5. **点击 Refine。**
   LLM 接收压缩后的上下文、追问原文和你的草稿，生成一段连贯的、上下文感知的跟进回复。输出的语气比 Stage 3 的正式 Rebuttal 略显对话性，但保持专业。

6. **在弹窗中审查结果。**
   仔细阅读生成的回复：
   - 是否直接回应了追问的核心问题？
   - 与 Stage 3 的内容是否一致（没有矛盾）？
   - 是否足够简洁？追问的跟进回复通常应该比首轮 Rebuttal 更短。

7. **复制并粘贴到会议平台的讨论区。**

8. **后续轮次重复上述流程。**
   每收到一条新追问：粘贴新追问 → 在 Draft Editor 写草稿 → 点击 Refine。已存储的压缩上下文在该 Reviewer 的所有追问轮次中持续有效。

## 技巧与注意事项

- **第一次 Refine 之前必须先运行 Condense。** 这一步是 Stage 4 的核心。不运行它，就失去了整个阶段的主要价值：上下文一致性。
- **在草稿中主动引用之前的回复。** 如果 Reviewer 在重提 Stage 3 已经回应的内容，在草稿中写"如我们在 Response 2 中已经说明……"，LLM 会保留这种指引性语气，让 Reviewer 知道你没有忘记之前的论述。
- **追问的跟进回复应简短聚焦。** Reviewer 追问通常是要求进一步澄清，不是在要求一篇新的论文章节。一般 1–2 段已经足够，除非追问提出了全新的、复杂的质疑。
- **如果追问提出了 Stage 1–3 完全没有涉及的新问题**，像对待 Stage 2 的新条目一样处理：先认真想清楚技术回答，再写详细大纲，然后 Refine。
- **多轮讨论中**（第三、第四轮交流），第一次 Condense 存储的摘要依然适用——它覆盖了你原始 Rebuttal 的要旨，这在整个讨论期间都是有效的基础。

## 预期输出

质量好的 Stage 4 跟进回复应该：

- 开门见山地回应追问的具体问题。
- 在需要时引用 Stage 3 的具体回复（"如我们在 Response 3 中所述……"）。
- 明显比 Stage 3 的首轮 Rebuttal 更短——通常 1–2 段已足够。
- 保持与 Stage 3 一致的专业语气，同时略显对话性。
- 不引入草稿中没有的新论断或新实验。

## 下一步

所有讨论线程处理完毕后，进入 **[Stage 5 — Final Remarks](./stage5-final-remarks.md)** 撰写给 AC 的 Final Remarks，对整轮 Rebuttal 做总结性陈述。

---

[← Stage 3 — First Round](./stage3-first-round.md) | [Stage 5 — Final Remarks →](./stage5-final-remarks.md)
