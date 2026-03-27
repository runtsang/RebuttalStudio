# Rebuttal Studio — User Documentation (English)

This section contains the current user-facing workflow guides for Rebuttal Studio. It covers both the 5-stage rebuttal pipeline and the project-level tools that were added recently, such as Document Memory, Template Center, project snapshots, and expanded API settings.

> For the project overview, installation instructions, and contributing guidelines, see the [main README](../../README.md).

---

## The 5-Stage Pipeline at a Glance

| Stage | Name | What You Do | Output |
|:-----:|:-----|:-----------|:-------|
| **1** | **Breakdown** | Paste the reviewer's full comment; let the LLM parse it into atomic issues | Structured issue list with scores, summary, strengths, and individual weaknesses/questions |
| **2** | **Reply** | Write outline drafts, optionally consult Document Memory, then refine each issue into reviewer-facing prose | A reviewed Refined Draft for every atomic issue |
| **3** | **First Round** | Assemble drafts into a formatted, submission-ready document; manage styling and length | Copy-ready rebuttal text (single block or split chunks) |
| **4** | **Multi Rounds** *(optional)* | Handle follow-up reviewer questions with condensed prior context plus optional Document Memory | Context-aware, concise follow-up responses |
| **5** | **Final Remarks** | Generate Final Remarks addressed to Area Chairs | Structured AC summary with strengths, concerns table, and revision commitments |

---

## Stage Guides

| Stage | Guide | Summary |
|:-----:|:------|:--------|
| 1 | [Breakdown](./stage1-breakdown.md) | Parse raw reviewer comments into an atomic issue list; extract conference-specific scores |
| 2 | [Reply](./stage2-reply.md) | Draft and refine point-by-point responses to every concern |
| 3 | [First Round](./stage3-first-round.md) | Assemble and format the full first-round rebuttal for submission |
| 4 | [Multi Rounds](./stage4-multi-rounds.md) | Handle follow-up questions that arrive during the discussion period |
| 5 | [Final Remarks](./stage5-final-remarks.md) | Generate the Final Remarks for Area Chairs |

---

## Supported Conferences

| Conference | Score Fields | Notes |
|:-----------|:-------------|:------|
| **ICLR** | Rating, Confidence, Soundness, Presentation, Contribution | 5 score fields |
| **ICML** | Rating, Confidence, Soundness, Presentation, Significance, Originality | 6 score fields |
| **NeurIPS** | Rating, Confidence, Quality, Clarity, Significance, Originality | 6 score fields |
| **ARR** | Confidence, Soundness, Excitement, Assessment, Reproducibility | 5 score fields |

If your venue is not listed, pick the closest match and verify the extracted score fields manually.

> Extension reminder: when adding new conferences later, always start from `skills/stage1/template/SKILL.md` and `skills/stage2/template/SKILL.md`, and change only conference-specific differences instead of rewriting from scratch.

---

## Project-Level Tools

### 1. Document Memory

Each project can store one project-level **Document Memory**. You can add it:

- while creating a new project
- later from the sidebar through the **Document Memory** button

Current file support:

- `.txt`
- `.md`
- `.tex` / `.latex`
- `.pdf`

Behavior:

- Text, Markdown, and LaTeX files are read directly as text.
- PDF files are first converted to text locally with a Python script, then summarized.
- The app stores an editable Markdown summary inside the project folder.
- That Markdown is injected only into **Stage 2 Refine** and **Stage 4 Refine** as supporting background knowledge.
- The background memory does **not** override the quoted reviewer issue, your current outline, or your current follow-up draft.

Important caveats:

- Most model APIs do not accept raw files directly, so Rebuttal Studio always converts Document Memory into text first.
- PDF extraction can fail or be noisy. If you already have clean `.txt`, `.md`, or `.tex`, use those instead.
- Automatic Document Memory summarization currently depends on a configured supported API. If it fails, you can edit or paste the Markdown manually.

### 2. Documents and Template Center

The sidebar now exposes two helper tools that do not change your current stage:

- **Documents** opens the built-in stage documentation reader.
- **Template** opens the Template Center, where you can render and copy reusable reviewer-facing or AC-facing snippets, and optionally AI-polish them.

These are convenience tools. They do not overwrite any project content unless you manually paste the results into your draft.

### 3. Project Management

Recent project-level utilities include:

- create, rename, copy, and delete projects
- save and restore project snapshots
- per-project autosave interval
- undo / redo for in-session editing history
- reviewer tab rename for stable 4-character reviewer identifiers

### 4. API Settings and Diagnostics

The API Settings dialog now supports:

- provider-specific API profiles
- custom base URLs for OpenAI-compatible endpoints
- **Detect models** for supported providers
- active-model badge in the top bar
- token usage badge in the top bar
- detailed API error modal with a report-friendly error payload

Current workflow support:

- The stage-generation flows in this release are wired for **Google Gemini** and **OpenAI-compatible providers**.
- This includes OpenAI, DeepSeek, Azure OpenAI, Qwen, OpenRouter, Groq, Grok, Together AI, Kimi, MiniMax, HuggingFace, Portkey, AWS Bedrock, and custom OpenAI-compatible endpoints.
- Some providers may still appear in the settings UI for configuration or model discovery even if a specific stage flow is not fully wired yet.

---

## Quick Start

1. **Create a project** on the home screen and select the correct conference.
2. **Optionally upload Document Memory** during project creation if you want the app to keep paper-level background knowledge for later stages.
3. **Configure your API key** in API Settings.
4. **Stage 1:** Paste each reviewer's full comment and click `Break down`. Review and clean the issue list.
5. **Stage 2:** For each issue, write an outline in `My Reply`, optionally open `Document Memory`, and click `Refine`.
6. **Stage 3:** Review the assembled document, adjust formatting and theme color, and split it if your submission platform has strict limits.
7. **Stage 4 (if needed):** Paste the follow-up question, write a new outline draft, and let the app condense prior context before refining the follow-up.
8. **Stage 5:** Apply a Final Remarks template, enter final ratings where relevant, auto-fill the structure, preview the result, and edit it carefully before submission.

---

## Setting Up Your API

To configure your API:

1. Click the **API Settings** button in the application top bar.
2. Select a provider.
3. Enter your API key.
4. Adjust the base URL if needed.
5. Use **Detect models** if the provider supports it.
6. Save settings. The active model appears in the top bar badge.

Notes:

- All API calls are made directly from your machine to the provider's API.
- Rebuttal Studio does not proxy your requests through its own server.
- If a specific provider/model combination is incompatible with a workflow, the app will raise an explicit error instead of silently guessing.

---

[→ Back to Main README](../../README.md)
