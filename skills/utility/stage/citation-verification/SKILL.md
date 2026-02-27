---
name: citation-verification
description: Verification guide for citations added during rebuttal writing. Use when Stage 2 responses introduce new references, when the Area Chair asks about a cited paper, or when any citation in the rebuttal might have been AI-generated. Prevents the serious credibility damage of fabricated references in reviewer-facing documents.
tags: [Citation, Verification, Academic, Accuracy]
version: 1.0.0
source: Adapted from Claude Scholar (https://github.com/Galaxy-Dawn/claude-scholar), skills/citation-verification/SKILL.md.
---

# Citation Verification for Rebuttals

> **RebuttalStudio Utility — Stage 2 / Stage 4**
> Apply this skill whenever a Stage 2 draft or Stage 4 follow-up response introduces a new reference — especially when the reference was suggested by an LLM. A single fabricated citation in a rebuttal can undermine the entire response's credibility.

Verification principles and workflow for citations added during the rebuttal writing process.

---

## Why Citations in Rebuttals Are High-Risk

Rebuttal citations are uniquely dangerous compared to paper citations:

1. **Short turnaround**: Rebuttal period is 2–4 days. Authors write quickly under pressure.
2. **LLM suggestions are plausible-sounding but often wrong**: AI-generated citation suggestions have an estimated **40% error rate** — wrong author, wrong year, wrong title, or entirely fabricated.
3. **Reviewers check**: An Area Chair or reviewer who discovers a fabricated citation in a rebuttal will immediately lose confidence in the entire response.
4. **No revision opportunity**: Unlike a paper, a submitted rebuttal cannot be revised after submission.

**Core rule**: Never add a citation to a rebuttal response unless you have personally verified it exists via search.

---

## When to Verify

Verify any citation that was:
- Suggested by an LLM during Stage 2 drafting
- Recalled from memory without looking it up
- Copied from a reviewer comment (reviewers can also be wrong)
- Added to counter a reviewer's "missing baseline" claim
- Introduced to support a new claim not already cited in the paper

Existing citations from the paper itself generally do not need re-verification — but do confirm the claim you are citing actually appears in that work.

---

## Verification Workflow

### Step 1: Search

Use a reliable academic search engine:

```
Recommended search order:
1. Google Scholar (scholar.google.com)
2. Semantic Scholar (semanticscholar.org)
3. arXiv (arxiv.org) — for preprints
4. ACL Anthology (aclanthology.org) — for NLP/ACL papers
5. OpenReview (openreview.net) — for ICLR/ICML papers
```

Search query pattern:
```
"[Paper title keywords]" [first author last name] [approximate year]
```

### Step 2: Confirm Existence

Verify the paper exists by confirming:
- [ ] Title matches (allow minor capitalization differences)
- [ ] At least the first author matches
- [ ] Year is within ±1 of what you recall (preprints often differ from camera-ready year)
- [ ] Venue matches what you intend to cite (workshop ≠ main conference)

### Step 3: Verify the Specific Claim

When citing a specific finding, do not trust your memory of the paper's conclusion.

- Locate the specific sentence or figure that supports your claim
- If you cannot access the full text, cite more conservatively ("as suggested by [author]") or drop the citation
- Do not paraphrase a result you have not read

### Step 4: Record the Verified Reference

Format for use in rebuttal prose (no BibTeX needed in most rebuttal portals):

```
[Author et al., Year, "Title", Venue]
e.g.: [Chen et al., 2023, "LoRA: Low-Rank Adaptation of Large Language Models", ICLR]
```

---

## When You Cannot Verify

If after searching you cannot confirm the paper exists:

**Option A — Drop the citation**
If the claim can stand without it, remove the reference.

**Option B — Hedge the claim**
"Prior work on [topic] (e.g., [general area]) suggests…" without citing a specific paper.

**Option C — Mark for human verification**
If working with an LLM and you want to flag it:
```
[CITATION NEEDED — verify before submission: "[paper title you were trying to cite]"]
```

**Never** submit a rebuttal with a citation you have not verified, even if it sounds plausible.

---

## Rebuttal-Specific Citation Patterns

### Citing Your Own Prior Work
- Verify the venue, year, and paper number match what appears in your submission's reference list
- Consistency with the submitted paper matters — reviewers notice discrepancies

### Citing a Reviewer-Suggested Baseline
- Reviewers sometimes suggest comparing with papers that are not directly comparable
- Verify the suggested paper actually evaluates on your task/dataset before agreeing to compare
- You may respond: "We have examined [Paper], which evaluates on [different setting], making direct comparison difficult."

### Citing to Defend Against "Missing Related Work"
- Search first — the paper may genuinely exist and you missed it
- If it exists, consider acknowledging it: "Thank you for pointing out [Paper]; we will add a discussion in Related Work."
- If it does not exist (after searching), respond diplomatically: "We searched but could not locate this work; we would appreciate a link or full title."

---

## Quick Verification Table

| Citation Source | Risk Level | Action |
|----------------|-----------|--------|
| LLM-suggested reference | Very high | Always verify before including |
| Recalled from memory | Medium | Verify title and year |
| Copied from reviewer comment | Medium | Verify existence; reviewer may be wrong |
| Already in paper's reference list | Low | Confirm the claim is in that paper |
| Found via search in last 24h | Low | Cross-check author/venue |

---

*Adapted from Claude Scholar's `citation-verification` skill for the rebuttal context. Original: https://github.com/Galaxy-Dawn/claude-scholar/blob/main/skills/citation-verification/SKILL.md*
