### Key Question(s)
- How does the tool compare to direct LLM access in a controlled setting?
- How is AI over-reliance prevented during the rebuttal process?
- What are the data privacy protocols and server-side retention policies?
- What is the roadmap for supporting other venues (ACL, NeurIPS, CVPR) and journals?

### Main Answer(s)

**User Study & Efficiency**
- **Controlled Experiment:** A pre-registered between-subjects study (N=60) is scheduled for March 2026 to compare Rebuttal Studio against direct Claude API access, measuring efficiency via screen-recording analysis.

**Mitigating AI Over-reliance**
- **Design Safeguards:** The system displays original reviewer quotes alongside drafts and requires users to create an outline (Stage 2) before generating text.
- **Critique Mode:** Upcoming v1.1 will include a feature where the LLM identifies weaknesses in its own drafts for user adjudication.
- **Longitudinal Study:** A six-month study is planned to track changes in user-led outline quality over time.

**Data Privacy & Security**
- **Local-First Storage:** Review content is stored in the user's local browser (IndexedDB); no review data is sent to project servers.
- **BYOK Model:** Users provide their own API keys; LLM calls are made directly from the browser to the provider (Anthropic/OpenAI).
- **Encryption:** Optional cloud backups use AES-256 encryption with user-controlled keys.

**Cross-Venue Roadmap**
- **Current Support:** ACL 2026 schema is implemented (v1.0.1).
- **Upcoming Support:** NeurIPS and CVPR 2026 (v1.1, April 2026); Journal formats (v1.2) including chunked processing for long reviews and editor-response letter generation.