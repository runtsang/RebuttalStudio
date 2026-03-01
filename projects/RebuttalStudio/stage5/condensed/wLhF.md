### Key Question(s)
- How does Rebuttal Studio compare to direct LLM access in a controlled efficiency study?
- What safeguards prevent user over-reliance on AI-generated arguments?
- What are the data privacy protocols and server-side retention policies?
- What is the roadmap for supporting other venues (ACL, NeurIPS, CVPR) and journals?

### Main Answer(s)
- **Controlled Evaluation**: A pre-registered between-subjects study (N=60) is scheduled for March 2026 to compare Rebuttal Studio against direct Claude API access, measuring efficiency via screen-recording analysis.
- **Over-reliance Safeguards**: 
  - **Active Engagement**: Original reviewer quotes are displayed alongside drafts.
  - **Intellectual Authorship**: Stage 2 requires users to outline arguments before AI generation.
  - **Critique Mode**: Upcoming v1.1 feature where the LLM identifies weaknesses in its own drafts for user adjudication.
- **Privacy Architecture**: 
  - **Local-First**: Review content is stored in the user's browser (IndexedDB); no review data is sent to central servers.
  - **BYOK Model**: Users provide their own API keys; calls go directly to LLM providers (Anthropic/OpenAI) from the browser.
  - **Encryption**: Optional cloud backups use AES-256 with user-controlled keys.
- **Cross-Venue Roadmap**: 
  - **ACL**: Implemented in v1.0.1.
  - **NeurIPS/CVPR**: Targeted for v1.1 (April 2026).
  - **Journals**: Targeted for v1.2, including chunked processing for long reviews and editor-response letter generation.