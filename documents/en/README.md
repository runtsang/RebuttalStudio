# Rebuttal Studio — User Documentation (English)

This section contains the user-facing workflow guides for Rebuttal Studio. Each guide covers one stage of the rebuttal pipeline: what the stage does, how to operate it, and what output to expect. Implementation details are not covered here.

> For the project overview, installation instructions, and contributing guidelines, see the [main README](../../README.md).

---

## The 5-Stage Pipeline at a Glance

| Stage | Name | What You Do | Output |
|:-----:|:-----|:-----------|:-------|
| **1** | **Breakdown** | Paste the reviewer's full comment; let the LLM parse it into atomic issues | Structured issue list with scores, summary, strengths, and individual weaknesses/questions |
| **2** | **Reply** | Write outline drafts for each issue; refine with LLM into polished paragraphs | A reviewed Refined Draft for every atomic issue |
| **3** | **First Round** | Assemble drafts into a formatted, submission-ready document; check word count | Copy-ready rebuttal text (single block or split chunks) |
| **4** | **Multi Rounds** *(optional)* | Handle follow-up reviewer questions during the discussion period | Context-aware, concise follow-up responses |
| **5** | **Conclusion** | Generate Final Remarks addressed to Area Chairs | Structured AC summary with strengths, concerns table, and revision commitments |

---

## Stage Guides

| Stage | Guide | Summary |
|:-----:|:------|:--------|
| 1 | [Breakdown](./stage1-breakdown.md) | Parse raw reviewer comments into an atomic issue list; extract numeric scores |
| 2 | [Reply](./stage2-reply.md) | Draft and refine point-by-point responses to every concern |
| 3 | [First Round](./stage3-first-round.md) | Assemble and format the full first-round rebuttal for submission |
| 4 | [Multi Rounds](./stage4-multi-rounds.md) | Handle follow-up questions that arrive during the discussion period |
| 5 | [Conclusion](./stage5-conclusion.md) | Generate the Final Remarks for Area Chairs |

---

## Supported Conferences

| Conference | Score Fields | Notes |
|:-----------|:-------------|:------|
| **ICLR** | Rating, Confidence, Soundness, Presentation, Contribution | 5 score fields |
| **ICML** | Rating, Confidence, Soundness, Presentation, Contribution, Significance, Originality | 7 score fields |

Support for additional venues (NeurIPS, ACL, EMNLP, CVPR) is planned. For currently unsupported conferences, select the closer match and verify score fields manually.

---

## Quick Start

1. **Create a project** on the home screen and select your conference (ICLR or ICML).
2. **Configure your API key** in API Settings (top bar) — needed for all LLM-powered steps.
3. **Stage 1:** Paste each reviewer's full comment and click "Break down". Review and clean up the issue list.
4. **Stage 2:** For each issue, write a draft outline in "My Reply" and click "Refine". Read and verify every output.
5. **Stage 3:** Review the assembled document in the "All" tab, adjust formatting, check word count, and copy to your submission platform.
6. **Stage 4 (if needed):** When reviewers ask follow-up questions, use Condense + Refine to generate context-aware responses.
7. **Stage 5:** Apply the template, fill in rating changes if any, click "Auto Fill", review carefully, and submit the Final Remarks.

---

## Setting Up Your API

Rebuttal Studio supports multiple LLM providers. To configure:

1. Click the **API Settings** button in the application top bar.
2. Select a provider (OpenAI, Anthropic, Google Gemini, DeepSeek, or Azure OpenAI).
3. Enter your API key and select a model.
4. Save settings. The active model will appear in the top bar badge.

All LLM calls are made directly from your machine to the provider's API — no data passes through Rebuttal Studio's servers.

---

[→ Back to Main README](../../README.md)
