# 各会议的字段映射

下面的字段名对应编辑器最后一个版本发布时（2026 年初）的情况。各会议几乎每一届都会改字段名、调整评分量表，所以这张表只是起点：先读实际的审稿表单，遇到对不上的字段，告诉作者并做相应调整，不要硬套。

## 需要提取的评分

只保留数字。`3: good` 记为 `3`，`3.5 = ...` 记为 `3.5`。缺失的评分留空，不要猜。

| 会议 | 评分键（对应字段） |
| --- | --- |
| ICLR | `rating`、`confidence`、`soundness`、`presentation`、`contribution` |
| ICML | `rating`（Overall Recommendation）、`confidence`、`soundness`、`presentation`、`significance`、`originality` |
| NeurIPS | `rating`（Rating / Overall）、`confidence`、`quality`、`clarity`、`significance`、`originality` |
| ARR（ACL、EMNLP、NAACL） | `confidence`、`soundness`、`excitement`、`assessment`（Overall Assessment）、`reproducibility`；允许小数 |

## 各部分的处理方式

“保留”指原样抄进 breakdown；“拆分”指拆成原子问题，每个问题对应一条回复。

| 会议 | 保留 | 拆分为 `weakness` | 拆分为 `question` |
| --- | --- | --- | --- |
| ICLR | Summary、Strengths | Weaknesses | Questions |
| ICML | Summary、Limitations、“Strengths And Weaknesses” 中的肯定部分 | “Strengths And Weaknesses” 中的批评部分 | Key Questions For Authors |
| NeurIPS | Summary、“Strengths And Weaknesses” 中的肯定部分 | “Strengths And Weaknesses” 中的批评部分 | Questions、Limitations |
| ARR | Paper Summary、Summary Of Strengths | Summary Of Weaknesses | Comments Suggestions And Typos（source 记为 `suggestion`，标签用 `Suggestion-<i>:` / `Response S<i>:`） |

说明：

- 同一条里既有肯定又有批评时，肯定部分留在保留文本里，只把需要回应的部分拆出来。
- NeurIPS：如果 Limitations 只是说“作者已充分讨论局限性”，就保留，不拆分。
- ARR：Ethical Concerns、Datasets、Software、Knowledge Of Paper 以及各项认证字段一般忽略，除非其中有需要回应的问题。
- 编辑器的界面只有四个栏位，所以它把 NeurIPS 的 Questions 标成 `weakness`、Limitations 标成 `question`，并把 “Strengths And Weaknesses” 整段保留。对话模式下按上表处理：每一条是什么就标成什么，保证没有任何批评被漏掉。
- 表里没有的会议（CVPR、AAAI、期刊等）：选最接近的一行，和作者确认评分字段，再套用同样的保留/拆分逻辑。

## 长度限制

长度限制因会议和年份而异。向作者确认当前的上限，以及它按字符还是按单词计算，不要自行假设。编辑器最后一个版本发布时的大致情况供参考：OpenReview 的回复框一般允许约 6,000 字符，NeurIPS 的 rebuttal 一般有字数限制，ARR 的 rebuttal 总长一般在 500 到 1,000 词。
