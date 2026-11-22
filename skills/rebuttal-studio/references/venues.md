# Venue Field Mappings

Field names as of the last editor release (early 2026). Venues rename fields and rescale scores almost every cycle, so treat this table as a starting point: read the actual review form first, and when a field does not match, tell the author and adapt instead of forcing the mapping.

## Scores to extract

Numbers only. `3: good` becomes `3`; `3.5 = ...` becomes `3.5`. Leave a missing score empty; never guess.

| Venue | Score keys (source field) |
| --- | --- |
| ICLR | `rating`, `confidence`, `soundness`, `presentation`, `contribution` |
| ICML | `rating` (Overall Recommendation), `confidence`, `soundness`, `presentation`, `significance`, `originality` |
| NeurIPS | `rating` (Rating / Overall), `confidence`, `quality`, `clarity`, `significance`, `originality` |
| ARR (ACL, EMNLP, NAACL) | `confidence`, `soundness`, `excitement`, `assessment` (Overall Assessment), `reproducibility`; decimals allowed |

## Sections

"Preserve" means copy verbatim into the breakdown. "Split" means break into atomic issues that each get a response.

| Venue | Preserve | Split as `weakness` | Split as `question` |
| --- | --- | --- | --- |
| ICLR | Summary, Strengths | Weaknesses | Questions |
| ICML | Summary, Limitations, praise inside "Strengths And Weaknesses" | Criticism inside "Strengths And Weaknesses" | Key Questions For Authors |
| NeurIPS | Summary, praise inside "Strengths And Weaknesses" | Criticism inside "Strengths And Weaknesses" | Questions, Limitations |
| ARR | Paper Summary, Summary Of Strengths | Summary Of Weaknesses | Comments Suggestions And Typos (source `suggestion`, labels `Suggestion-<i>:` / `Response S<i>:`) |

Notes:

- When one bullet mixes praise and criticism, keep the praise in the preserved text and split out only the part that needs an answer.
- NeurIPS: a Limitations field that only says the limitations were discussed adequately is preserved, not split.
- ARR: ignore Ethical Concerns, Datasets, Software, Knowledge Of Paper, and the certification fields unless they contain a concern that needs an answer.
- The editor's four-slot interface labeled NeurIPS Questions as `weakness` and Limitations as `question`, and kept "Strengths And Weaknesses" whole. In conversation, label each item by what it is, as in the table above, so that no criticism is left unanswered.
- Unlisted venue (CVPR, AAAI, journals, ...): use the closest row, confirm the score fields with the author, and apply the same preserve/split logic.

## Length limits

Limits change per venue and per year. Ask the author for the current limit and whether it counts characters or words; do not assume one. As a rough orientation from the last editor release: an OpenReview response field typically allowed about 6,000 characters, NeurIPS rebuttals typically had a word limit, and ARR rebuttals typically ran 500-1,000 words in total.
