# RebuttalStudio Skills

This folder contains all LLM skill definitions used by the RebuttalStudio application. Each `SKILL.md` file is a structured prompt instruction that the app sends to the configured LLM provider to guide a specific rebuttal task.

---

## Architecture Overview

Skills are organized in two categories:

```
skills/
├── SKILL.md                          ← Root dispatcher (routes to stage or utility skills)
├── polish/                           ← Utility: template polishing
├── stage1/                           ← Stage 1: Reviewer comment breakdown
│   ├── template/                     ← Base template (shared Stage 1 logic)
│   ├── iclr/
│   └── icml/
├── stage2/                           ← Stage 2: Reply drafting & refinement
│   ├── template/                     ← Base template (shared Stage 2 logic)
│   ├── iclr/
│   └── icml/
├── stage4/                           ← Stage 4: Multi-round follow-up
│   ├── condense/
│   └── refine/
├── stage5/                           ← Stage 5: Final Remarks
│   └── final-remarks/
│       └── references/
└── utility/                          ← Stage-general utility skills
    └── stage/
        ├── review-response/          ← Strategy framework
        ├── writing-anti-ai/          ← Prose humanization
        ├── rebuttal-self-review/     ← Pre-submission QA
        └── citation-verification/   ← Reference integrity
```

### How Skills Are Invoked

The app calls the LLM with a system prompt built from the relevant `SKILL.md` content plus the current stage data from `project.json`. Stage-specific skills (stage1–stage5) are invoked automatically at each pipeline step. Utility skills are reference guides — they are consulted manually by the user or can be appended to stage prompts for additional guidance.

---

## Stage-Specific Skills

### Root Dispatcher — `SKILL.md`

**Role**: Top-level router. Identifies the active stage and conference, then delegates to the appropriate nested skill.

**Logic**:
1. Determine stage (`stage1` / `stage2` / `stage4` / `stage5`)
2. Determine conference (`iclr` / `icml`)
3. Execute the matching nested `SKILL.md`
4. Fall back to utility workflows for cross-stage needs

---

### Stage 1 — Breakdown

**Files**: `stage1/template/SKILL.md`, `stage1/iclr/SKILL.md`, `stage1/icml/SKILL.md`

**Purpose**: Parse one reviewer's raw text (from OpenReview or copy-paste) into a structured JSON breakdown.

**Implementation logic**:
- Extracts numeric scores from conference-specific rating fields:
  - ICLR: rating, confidence, soundness, presentation, contribution (5 scores)
  - ICML: rating, confidence, soundness, presentation, significance, originality (6 scores)
- Preserves `summary` and `strength` sections verbatim
- Splits `weakness` and `question` sections into **atomic issues** — one independent concern per item
- Assigns each atomic issue a response block (`Response1`, `Response2`, …) with a generated subtitle, source type, source ID, and quoted verbatim text
- Splitting heuristics: split on multiple independent asks joined by "and/also/furthermore", topic shifts, or distinct actionable requests; do NOT split when sentences elaborate the same single point

**Output format**: Structured Markdown with `## Scores`, `## Preserved Sections`, `## Atomic Issues`, `## Responses` blocks.

**Conference differences**: ICLR and ICML variants are template extensions. They only define conference-specific score mappings and section-name mappings.

---

### Stage 2 — Reply Drafting

**Files**: `stage2/template/SKILL.md`, `stage2/iclr/SKILL.md`, `stage2/icml/SKILL.md`

**Purpose**: Transform a rough outline or bullet-point draft into polished, reviewer-facing rebuttal prose.

**Implementation logic**:
- Takes three inputs: `quoted_issue` (verbatim reviewer concern from Stage 1), `draft` or `outline` (user-authored content), and optional style hints
- Selects one courtesy opener from a phrase bank (e.g., "Thank you for the excellent suggestion.") based on reviewer intent
- Opener selection rules:
  - Actionable improvement → "Thank you for the excellent suggestion."
  - Spotted omission/ambiguity → "Thank you for pointing this out."
  - Challenged originality → "We appreciate the opportunity to further articulate the novelty of…"
- Rewrites content into polished academic prose:
  - Starts with `> **Reviewer's Comment**: [quoted_issue]`
  - Follows with `**Response**: [acknowledgment → direct answer → evidence → forward-looking]`
- Applies Markdown normalization: tables → GitHub-flavored Markdown tables, formulas → `$...$` / `$$...$$`, code → fenced blocks
- Preserves paragraph structure from input — does NOT merge separate points into a wall of text

**Hard constraints**: No fabrication, no new citations, no over-promises, no defensive language. Output is strict JSON: `{ "draft": "..." }`.

**Conference differences**: ICLR and ICML variants are template extensions. Core refinement logic is shared in `stage2/template/SKILL.md`.

---

### Stage 4 — Multi-Round Follow-up

#### Condense — `stage4/condense/SKILL.md`

**Purpose**: Compress the full Stage 3 compiled discussion for one reviewer into a short, reusable markdown context for subsequent rounds.

**Implementation logic**:
- Input: `stage3_all_source` — full Stage 3 combined document for one reviewer
- Output: compact `condensedMarkdown` with two required sections: `## Key Question(s)` and `## Main Answer(s)`
- Rules: keep wording concise and factual; preserve key technical claims and commitments; remove repetition and non-essential greetings; no fabrication
- Purpose is to allow Stage 4 refinement to operate without re-processing the full Stage 3 text

**Output**: Strict JSON `{ "condensedMarkdown": "..." }`

#### Refine — `stage4/refine/SKILL.md`

**Purpose**: Generate a polished follow-up response for a multi-round reviewer question.

**Implementation logic**:
- Takes three inputs: `condensed_markdown` (from condense step), `followup_question` (current reviewer follow-up), `draft` (user-authored response)
- Grounds the response in condensed context + user draft; does not invent new claims
- Addresses the follow-up question directly in the opening lines
- Maintains the same respectful, concise academic tone as Stage 2

**Output**: Strict JSON `{ "refinedText": "..." }`

---

### Stage 5 — Final Remarks

**File**: `stage5/final-remarks/SKILL.md`

**Purpose**: Fill a Stage 5 final remarks template from condensed discussion data across all reviewers.

**Implementation logic**:
- Inputs: `template_markdown` (placeholder-based template), `reviewer_summaries` (array of per-reviewer records with `reviewerId`, `condensedMarkdown`, optional `originalRating`, `finalRating`)
- If `template_markdown` is empty, uses the built-in reference template at `references/run-template.md`
- Default template structure: Acknowledgments / Key Strengths / Key Concerns and Our Responses (table) / Commitment to Revision
- Fills placeholders using only content from `reviewer_summaries` — no fabrication
- Generates `{{key_strengths_points_markdown}}` as 4–5 bullet points summarized across reviewers
- Generates `{{concern_rows_markdown}}` as a Markdown table with columns: Key Concerns / Reviewers / Our Response

**Output**: Strict JSON `{ "filledMarkdown": "..." }`

---

### Polish Utility — `polish/SKILL.md`

**Purpose**: Lightly rephrase a template message (e.g., nudge email, status update) for clarity and naturalness without changing meaning or structure.

**Implementation logic**:
- Preserves paragraph order, greeting, sign-off, and line breaks exactly
- Preserves all placeholder tokens (`{{reviewerId}}`, `{{submissionId}}`, literal `X`)
- Improves grammar, removes redundancy, improves word choice, smooths transitions
- Does NOT rewrite from scratch, change tone level, add new content, or produce AI-sounding corporate language

**Output**: Strict JSON `{ "text": "...polished text..." }`

---

## Utility Skills (Stage-General)

These skills do not produce structured JSON output for the app pipeline. They serve as strategic and quality guidance — either read by the user in the Skills panel or appended to prompts for additional LLM guidance.

> **Attribution**: The four utility skills below are adapted from [Claude Scholar](https://github.com/Galaxy-Dawn/claude-scholar) by [gaoruizhang](https://github.com/Galaxy-Dawn), licensed under MIT. Each skill has been modified for the RebuttalStudio context. Original files are linked in each skill's frontmatter.

---

### `utility/stage/review-response/SKILL.md`

**Purpose**: Strategic framework for classifying reviewer comments and selecting response approaches.

**What it provides**:
- Comment classification table (Major / Minor / Misunderstanding / Typo) with examples
- Response strategy matrix (Accept / Defend / Clarify / Experiment) with decision rules
- 5 core principles applicable to all rebuttal responses
- Success factors distilled from analysis of ICLR spotlight paper rebuttals
- Mapping of how to use this framework at each RebuttalStudio stage

**When to consult**: Before writing Stage 2 outlines; when unsure how to approach a challenging concern; when preparing Stage 4 follow-up strategy.

**Source**: Adapted from Claude Scholar [`skills/review-response/SKILL.md`](https://github.com/Galaxy-Dawn/claude-scholar/blob/main/skills/review-response/SKILL.md). The classification system, success factor analysis, and core principles are substantially derived from the original; the stage-integration table and rebuttal structure template are new additions for RebuttalStudio.

---

### `utility/stage/writing-anti-ai/SKILL.md`

**Purpose**: Checklist for removing AI-generated writing patterns from rebuttal prose.

**What it provides**:
- 6-rule quick checklist (cut filler phrases, break formulaic structures, vary rhythm, trust the reviewer, remove pull-quote language, use first-person correctly)
- Tables of overused AI vocabulary with replacements
- Rebuttal-specific pattern guide (AI patterns that appear specifically in rebuttal drafts)
- 5-dimension scoring rubric (0–10 per dimension, 50 points total) to assess human authenticity
- Clear statement of what NOT to change (technical claims, citations, format)

**When to consult**: After Stage 2 refinement output; after Stage 4 follow-up refinement; before Stage 3 document finalization if text sounds formulaic.

**Source**: Adapted from Claude Scholar [`skills/writing-anti-ai/SKILL.md`](https://github.com/Galaxy-Dawn/claude-scholar/blob/main/skills/writing-anti-ai/SKILL.md), originally authored by gaoruizhang. Based on [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) by WikiProject AI Cleanup. The core AI pattern taxonomy is substantially derived from the original; the rebuttal-specific framing and scoring rubric are new for RebuttalStudio.

---

### `utility/stage/rebuttal-self-review/SKILL.md`

**Purpose**: Pre-submission quality assurance checklist for a completed rebuttal document.

**What it provides**:
- 6-area review checklist: Coverage, Tone, Factual Accuracy, Structure, Clarity, Writing Quality
- 5-pass review process with time estimates (total ~30 min)
- Table of common rebuttal errors with fixes
- Stage-specific guidance (when to run after Stage 3 vs Stage 5)
- Post-review submission steps

**When to consult**: After Stage 3 compilation before first-round submission; after Stage 5 final remarks writing; optionally after each Stage 4 follow-up response.

**Source**: Adapted from Claude Scholar [`skills/paper-self-review/SKILL.md`](https://github.com/Galaxy-Dawn/claude-scholar/blob/main/skills/paper-self-review/SKILL.md). The 6-area review structure and multi-pass process are adapted from the original paper review framework; all checklist items have been rewritten for the rebuttal context.

---

### `utility/stage/citation-verification/SKILL.md`

**Purpose**: Verification workflow to prevent fabricated or incorrect citations in rebuttal responses.

**What it provides**:
- Explanation of why rebuttal citations are uniquely high-risk
- Decision guide for when to verify
- Step-by-step verification workflow (search → confirm → verify claim → record)
- Fallback options when verification fails (drop / hedge / mark)
- Rebuttal-specific citation patterns (own prior work, reviewer-suggested baselines, missing related work)
- Risk-level table by citation source

**When to consult**: Any time an LLM-suggested reference appears in a Stage 2 draft; before including any new citation not already in the paper's reference list.

**Source**: Adapted from Claude Scholar [`skills/citation-verification/SKILL.md`](https://github.com/Galaxy-Dawn/claude-scholar/blob/main/skills/citation-verification/SKILL.md). The core verification principles and 40% error rate warning are from the original; the rebuttal-specific sections (reviewer-suggested baselines, rebuttal portal formatting, risk table) are new additions.

---

## Adding New Skills

To add a new stage-specific skill:

1. Reuse the stage base template first (`stage1/template/SKILL.md` or `stage2/template/SKILL.md` when applicable).
2. Create the folder under the appropriate stage path: `stage{N}/{conference}/`
3. Add a `SKILL.md` file that keeps shared logic in the template and only writes conference-specific overrides.
4. Add a clear reminder in the new file: future venue expansion must extend the template rather than rewriting from scratch.
5. Add the same frontmatter format (`name`, `description`)
6. Register it in the root `SKILL.md` dispatcher under `## Available stage workflows`
7. Update this README

To add a new utility skill:

1. Create the folder under `utility/stage/{skill-name}/`
2. Add a `SKILL.md` file
3. Register it in the root `SKILL.md` dispatcher under `## Available stage-general utility skills`
4. Add an entry to the Utility Skills section of this README with attribution if derived from external sources

---

## Credits

The utility skills in `utility/stage/` are adapted from **[Claude Scholar](https://github.com/Galaxy-Dawn/claude-scholar)** by [gaoruizhang](https://github.com/Galaxy-Dawn), licensed under [MIT](https://github.com/Galaxy-Dawn/claude-scholar/blob/main/LICENSE). Adaptations were made to fit the RebuttalStudio rebuttal pipeline context. All original ideas, taxonomies, and frameworks from Claude Scholar are credited to the original author.

The stage-pipeline skills (stage1–stage5) and the polish utility were developed independently for RebuttalStudio.
