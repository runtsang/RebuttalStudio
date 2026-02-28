---
name: skills
description: Multi-stage rebuttal analysis skill for RebuttalStudio. Use when organizing reviewer comments into stage-specific conference workflows, including stage1 breakdown, stage2 refinement, stage4 multi-round follow-up, and stage5 final remarks generation.
---

# RebuttalStudio Multi-Stage Skill

Follow this dispatcher structure:

1. Identify stage first (`stage1`, `stage2`, `stage4`, or `stage5`).
2. Inside that stage, select conference-specific skill.
3. Execute the conference skill instructions directly.

## Available stage workflows

- `stage1/iclr/SKILL.md`: Convert raw reviewer feedback into a structured breakdown for rebuttal drafting.
- `stage2/iclr/SKILL.md`: Refine Stage2 outline drafts into reviewer-facing rebuttal prose.
- `stage4/condense/SKILL.md`: Condense Stage 3 combined discussion into reusable markdown context.
- `stage4/refine/SKILL.md`: Refine follow-up response using condensed context + follow-up question + user draft.
- `stage5/final-remarks/SKILL.md`: Fill Stage 5 final remarks template from all reviewers' condensed markdown context.

## Available utility workflows

- `polish/SKILL.md`: Polish (rephrase) a rebuttal message template for clarity and professionalism while preserving the original structure, tone, and intent.

## Available stage-general utility skills

These skills apply across multiple stages and provide strategic, stylistic, and quality guidance:

- `utility/stage/review-response/SKILL.md`: Comment classification (Major/Minor/Misunderstanding/Typo) and response strategy selection (Accept/Defend/Clarify/Experiment). Use when planning how to respond to any reviewer concern.
- `utility/stage/writing-anti-ai/SKILL.md`: Remove AI-generated writing patterns from rebuttal prose. Use after Stage 2 refinement or Stage 4 follow-up when text reads formulaic or robotic.
- `utility/stage/rebuttal-self-review/SKILL.md`: Pre-submission quality checklist covering coverage, tone, factual accuracy, structure, and clarity. Use after Stage 3 compilation or Stage 5 final remarks.
- `utility/stage/citation-verification/SKILL.md`: Verification workflow for any new citation added during rebuttal writing. Use when LLM-suggested references appear in Stage 2 drafts.

If a requested stage/conference does not exist, stop and ask for missing spec before inventing format.
