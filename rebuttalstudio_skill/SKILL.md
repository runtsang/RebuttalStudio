---
name: rebuttalstudio_skill
description: Multi-stage rebuttal analysis skill for RebuttalStudio. Use when organizing reviewer comments into stage-specific conference workflows, especially stage1 breakdown tasks under conference folders.
---

# RebuttalStudio Multi-Stage Skill

Follow this dispatcher structure:

1. Identify stage first (for now only `stage1`).
2. Inside that stage, select conference-specific skill.
3. Execute the conference skill instructions directly.

## Available stage workflows

- `stage1/iclr/SKILL.md`: Convert raw reviewer feedback into a structured breakdown for rebuttal drafting.

## Available utility workflows

- `polish/SKILL.md`: Polish (rephrase) a rebuttal message template for clarity and professionalism while preserving the original structure, tone, and intent.

If a requested stage/conference does not exist, stop and ask for missing spec before inventing format.
