### Key Question(s)
- How does Rebuttal Studio compare to raw LLM usage in terms of novelty and performance?
- Is the user study design valid for claiming time-reduction and efficiency?
- Does the system's effectiveness depend on a specific LLM backend?
- Does the tool improve downstream acceptance rates or reviewer scores?
- What logic governs the grouping of atomic reviewer issues?
- Are the system prompts available for reproducibility?

### Main Answer(s)
- **Baseline Comparison:** A within-subjects study (N=15) showed Rebuttal Studio users were 23% faster and addressed 31% more atomic issues than those using raw ChatGPT. The advantage stems from workflow scaffolding rather than LLM capability alone.
- **Study Validity:** The N=47 study used a counterbalanced within-subjects design to provide internal control. Participants included PhDs (62%), postdocs (21%), and faculty (17%).
- **LLM Generalizability:** An ablation study comparing Claude 3.5, GPT-4o, Gemini 1.5 Pro, and Llama 3.1 found no statistically significant difference in quality (p=0.18), suggesting the five-stage pipeline is the primary driver of performance.
- **Effectiveness Metrics:** While measuring acceptance rates is currently infeasible, the authors will use reviewer confidence-score deltas as a proxy for effectiveness in a 12-month follow-up study.
- **Grouping Heuristics:** Issues are grouped using sentence-BERT embeddings (cosine similarity ≥ 0.75) combined with a shared-concern constraint. This method improved response coherence ratings from 3.4 to 4.1.
- **Transparency:** All five-stage system prompts and few-shot examples will be released in the paper's appendix and the open-source repository.