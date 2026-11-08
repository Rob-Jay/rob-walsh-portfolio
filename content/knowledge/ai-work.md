---
keywords: ai, llm, chatbot, mastercard, built, build, project, projects, ingestion, streaming, rag, agent, agents, rob-gpt, assistant, eval, evals
---
## Mastercard LLM chatbot
At Mastercard, Rob led backend design for an internal LLM-powered chatbot: an enterprise data ingestion pipeline feeding a hosted LLM, with a streaming response layer back to the client. Knowledge is processed into the model's context. Ingestion and the LLM provider are independently deployable and swappable, so the knowledge base can change or the model can be replaced without touching the other. The team adopted the engineering patterns from this work.

## rob-gpt
Rob built rob-gpt, the assistant on this site. It retrieves matching notes from markdown files with keyword search, cites them on every answer, and refuses questions the notes don't cover before calling a model. It has per-IP rate limits and input caps, keeps its prompt server-side, and is checked by a 25-case eval suite covering facts, refusals and prompt injection, re-run weekly in CI.
