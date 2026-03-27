# Stage 4 — Multi Rounds

Stage 4 处理 Reviewer 在首轮 Rebuttal 之后、讨论期间发起的追问。它不是孤立地生成回复，而是每次运行时都会先将你的 Stage 3 Rebuttal 压缩成简洁的上下文摘要，再以此为基础润色你的跟进草稿——确保新的回复与你之前的论述保持一致，既不重复也不矛盾。

## 在整体流程中的位置

```
... → Stage 3: First Round → Stage 4: Multi Rounds（可选）→ Stage 5: Final Remarks
```

Stage 4 是可选阶段，只在 Reviewer 于讨论期发起追问时才需要使用。对同一位 Reviewer 可以多次使用，支持第二轮、第三轮等多轮讨论。

## 开始前的准备

- [ ] 提出追问的 Reviewer 的 Stage 3 已完成。
- [ ] 已从会议平台获取 Reviewer 的追问原文。
- [ ] 已在 **API Settings** 中配置好 API Key。
- [ ] 如果你希望 Refine 时能参考更多论文背景，项目级 **Document Memory** 已经准备好。

> **注意：** 如果多位 Reviewer 同时发起追问，对每位 Reviewer 分别切换标签页处理。

## 界面说明

**Reviewer 标签页**
与 Stage 1–3 相同的标签页延续使用。选择发起追问的 Reviewer 对应的标签页。

**追问输入框（顶部区域）**
在此粘贴 Reviewer 发来的追问原文（从会议平台复制）。

**Draft Editor 文本区**
你对这条追问的初步回答草稿。与 Stage 2 相同，使用"大纲优先"的方式：写下关键要点和证据，不需要追求完整的正式表达。

**中间列的 Refine 按钮**
Stage 4 使用中间列主按钮 **Refine**。一次点击会自动运行两步：
- **Step 1：**读取当前 Reviewer 的 Stage 3 `All` 视图内容，并压缩为包含两个部分的简洁摘要：
  - `## Key Questions`——Reviewer 在本轮 Rebuttal 中提出的主要问题。
  - `## Main Answers`——你对这些问题的核心回答。
- **Step 2：**结合压缩后的上下文、当前追问、你的草稿以及可选的 Document Memory，生成新的跟进回复。

压缩结果会为该 Reviewer 本地保存，并且在每次新的 Refine 时重新刷新，这样就能和你最新的 Stage 3 内容保持一致。

完成后，右侧面板还会显示本地保存的 condensed Markdown 路径，方便你确认这份上下文已经落盘。

**右侧结果面板 + 复制弹窗**
生成结果会保存在右侧输出区。成功运行后还会弹出一个复制窗口，方便你快速复制，不需要离开当前 stage。

## 操作步骤

1. **选择对应 Reviewer 的标签页。**
   确认你在发起追问的 Reviewer 的标签页下操作。

2. **将 Reviewer 的追问粘贴到顶部输入框。**
   从 OpenReview（或你的会议平台）复制追问的完整原文，逐字粘贴，不要改写。LLM 需要原始措辞来精准回应。

3. **在 Draft Editor 里写你的草稿回答。**
   与 Stage 2 相同的大纲优先方式：
   - 先给出直接回答（同意、不同意，或澄清）。
   - 引用相关的具体证据，或者指向之前回复的具体位置。
   - 如果追问涉及你在 Stage 3 已经回应过的内容，在草稿中明确提示（如"如我们在 Response 3 中所述……"）。

4. **点击 Refine。**
   一次运行会自动完成两步：
   - Step 1：压缩当前 Reviewer 的 Stage 3 `All` 内容，并把 condensed Markdown 保存到本地
   - Step 2：结合这份上下文、追问原文、你的草稿，以及可选的 Document Memory 背景，生成一段连贯的、上下文感知的跟进回复

   输出的语气比 Stage 3 的正式 Rebuttal 略显对话性，但保持专业。

5. **在右侧面板或弹窗中审查结果。**
   仔细阅读生成的回复：
   - 是否直接回应了追问的核心问题？
   - 与 Stage 3 的内容是否一致（没有矛盾）？
   - 是否足够简洁？追问的跟进回复通常应该比首轮 Rebuttal 更短。

6. **复制并粘贴到会议平台的讨论区。**
   你可以使用弹窗里的 **Copy**，也可以使用右侧结果区里的复制按钮。

7. **后续轮次重复上述流程。**
   每收到一条新追问：粘贴新追问 → 在 Draft Editor 写草稿 → 再次点击 Refine。系统会基于当前的 Stage 3 内容重新刷新压缩上下文。

## 技巧与注意事项

- **Refine 本身已经包含 Condense。** 你不需要额外寻找单独按钮；只要确保 Stage 3 `All` 内容是最新的，再运行 Stage 4 Refine 即可。
- **Document Memory 只是次级背景。** 它可以帮助模型回忆论文方法、实验或定义，但真正决定这轮回复内容的，仍然应该是 reviewer 当前追问和你现在写的草稿。
- **在草稿中主动引用之前的回复。** 如果 Reviewer 在重提 Stage 3 已经回应的内容，在草稿中写"如我们在 Response 2 中已经说明……"，LLM 会保留这种指引性语气，让 Reviewer 知道你没有忘记之前的论述。
- **追问的跟进回复应简短聚焦。** Reviewer 追问通常是要求进一步澄清，不是在要求一篇新的论文章节。一般 1–2 段已经足够，除非追问提出了全新的、复杂的质疑。
- **如果追问提出了 Stage 1–3 完全没有涉及的新问题**，像对待 Stage 2 的新条目一样处理：先认真想清楚技术回答，再写详细大纲，然后 Refine。
- **多轮讨论中**，每次新的 Refine 都会从你当前的 Stage 3 内容重新生成 condensed context。如果你中途回去修改了 Stage 3，下一次 Stage 4 运行会自动吸收这些更新。

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
