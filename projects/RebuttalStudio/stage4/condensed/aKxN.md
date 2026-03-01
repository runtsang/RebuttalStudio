### Key Question(s)
- How does Rebuttal Studio compare to raw LLM usage in terms of novelty and performance?
- Is the user study design valid for claiming efficiency gains?
- Does the system's effectiveness depend on a specific LLM backend?
- Does the tool improve downstream rebuttal success (e.g., acceptance rates)?
- What logic governs the grouping of atomic reviewer issues?
- Are the system prompts available for reproducibility?

### Main Answer(s)
- **Baseline Comparison:** A within-subjects study (N=15) showed that Rebuttal Studio users were 23% faster and addressed 31% more atomic issues compared to raw ChatGPT use. The advantage stems from workflow scaffolding rather than raw LLM capability.
- **Study Validity:** The N=47 study used a counterbalanced within-subjects design to provide internal control. The sample included PhD students (62%), postdocs (21%), and faculty (17%).
- **LLM Generalizability:** An ablation study across Claude 3.5, GPT-4o, Gemini 1.5 Pro, and Llama 3.1 showed no statistically significant difference in quality (p=0.18), suggesting the five-stage pipeline structure is the primary driver of quality.
- **Effectiveness Proxy:** While direct acceptance rates are difficult to measure, future work will track reviewer confidence-score deltas as a proxy for rebuttal impact.
- **Grouping Heuristics:** Issues are merged using a two-step process: pairwise semantic similarity (s-BERT ≥ 0.75) and a shared-concern constraint (e.g., both questioning 'novelty'). Grouped responses scored higher (4.1/5) than ungrouped ones (3.4/5).
- **Transparency:** All five-stage system prompts and few-shot examples will be released in the paper's appendix and the open-source repository.