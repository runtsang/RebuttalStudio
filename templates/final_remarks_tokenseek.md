## I. Acknowledgments

We would like to express our sincere gratitude to all reviewers for their insightful comments and constructive suggestions, which have significantly improved the quality of our work. We especially appreciate Reviewer `kTDb` and `cH6y` for their thoughtful consideration and constructive engagement with our rebuttal - it has significantly strengthened our work. 

**Before the discussion**, we appreciate the recognition from Reviewer CWhD (Rating: 8) and kTDb (Rating: 6), as well as the positive-leaning approval from Reviewer ZpqT (Rating: 4) and cH6y (Rating: 4), both of whom explicitly expressed a willingness to **reconsider their rating** (e.g., `“I would be open to raising my score”` from Reviewer ZpqT and `“I would reconsider my score if these concerns are adequately addressed”` from Reviewer cH6y).

**During the discussion**, we are pleased that the major concerns raised by Reviewer kTDb and cH6y were resolved through our additional clarifications and results (e.g., `“the tables you added cleared my concerns regarding the config and overhaul”` from Reviewer kTDb and `“Many of my earlier concerns have been addressed”` from Reviewer cH6y). We especially appreciate Reviewer cH6y’s **inclination to increase the score** from 4 to 6 on 26 Nov 2025, 03:25 ET.

---

## II. Key Strengths

Reviewers highlighted strengths across five dimensions:

- Novelty and Innovation

  - Introduction of an instance-aware paradigm combining attention and gradient signals (CWhD, kTDb) 

  - Insight that not all training tokens contribute equally to fine-tuning (cH6y) 

  - Conceptually simple yet effective improvement over random selection (ZpqT)

- Effectiveness and Efficiency

  - Substantial memory savings (e.g., 2.8 GiB peak on Llama-3.2-1B) while maintaining accuracy (kTDb, CWhD)

  - Competitive performance on multiple downstream tasks (QA, reasoning) across architectures (ZpqT)

  - Superior performance compared to LoRA with significantly lower memory usage (CWhD)

- Practicality
  - Architecture-agnostic "plug-and-play" design without requiring model modifications (CWhD)
  - Practically implementable (ZpqT)

- Interpretability

  - Transparent scoring mechanism providing insights into token importance (cH6y, CWhD)
  - High-quality presentation and clear visualizations of attention/gradient bias (cH6y, kTDb)

- Methodological Clarity and Empirical Rigor

  - The paper is clearly written and generally easy to follow, solid problem formulation (ZpqT, CWhD, cH6y)

  - The experiments are comprehensive and include ablations and cross-task evaluations, which strengthen empirical credibility, this paper is very well-written, logically structured, and easy to follow, with clear motivation and experimental validation (ZpqT, CWhD, kTDb)

------

## III. Key Concerns and Our Responses

Our responses to key concerns are summarized below.

| **Key Concerns**                                             | **Reviewers** | **Our Response**                                             |
| ------------------------------------------------------------ | ------------- | ------------------------------------------------------------ |
| *Novelty & Distinction from TokenTune.* Concern that TokenSeek is an extension of TokenTune without a new paradigm. | ZpqT          | TokenSeek introduces a data-driven, instance-aware mechanism (combining attention and gradients) which is fundamentally different from TokenTune’s unstable random/data-agnostic approach. |
| *Baselines & Generalization.* More sparse PEFT baselines and code-domain experiments (HumanEval). | ZpqT, kTDb    | Besides the BOFT, we added experiments with RanLoRA. We evaluated on code datasets (HumanEval), where TokenSeek showed robustness even with dense information. We also provided detailed training knob tables. |
| *Memory Savings Mechanism.* Clarification needed on how gradient-based scoring saves memory given the backward pass requirements. | ZpqT, kTDb    | We clarified the two-stage process: offline partial-backward scoring (using only ~11-13% memory on the penultimate layer) followed by online token ditching. |
| *Scalability & Distributed Training.* Challenges in token regrouping and communication in large-scale setups. | CWhD          | We analyzed DP vs. TP/SP settings, noting that memory overhead remains controllable. We also validated scalability on Llama2-7B, achieving comparable performance with >80% memory savings. |
| *Hyperparameters & Stability.* Justification for $\alpha/\beta$ selection and potential training instability from subset shifts. | cH6y, kTDb    | We demonstrated low sensitivity to hyperparameters via ablation studies. We clarified that subsets are fixed post-scoring and provided variance tables to prove stability. |
| *Interpretation of "Global Anchor".* Why specific tokens (anchors) are consistently preserved. | cH6y          | We explained that "attention sinks" naturally receive high combined scores due to stable attention allocation, causing TokenSeek to preserve them without artificial enforcement. |

---

## IV. Commitment to Revision

We have already incorporated all discussion points and additional experiments into our revision. All modifications have been marked in ${\\color{\#f26921} orange}$ in our revised submission. This includes adding the new experimental results on RanLoRA and HumanEval, the detailed training configuration tables, and the deeper discussions on "global anchors" and reasoning domain connections. We are also committed to continually incorporating the feedback from the discussion into the revision to polish our work. 

------

**We deeply appreciate the expertise and time of the AC and reviewers.**