// Everything the page says about Rob. Facts only: rob-gpt's notes in
// content/knowledge must agree with this file.

export const SITE_URL = 'https://rob-walsh-homepage.vercel.app'
export const EMAIL = 'robertjaywalsh@gmail.com'
export const LINKEDIN = 'https://www.linkedin.com/in/robert-walsh-937703218/'
export const GITHUB = 'https://github.com/Rob-Jay'
export const SOURCE = 'https://github.com/Rob-Jay/rob-walsh-portfolio'
export const CV = '/Rob-Walsh-CV.pdf'

export const PROOF_POINTS = [
  'Led backend design for an internal LLM chatbot at Mastercard',
  'Five years of production Java and Spring Boot in regulated finance',
  'Promoted to Senior Software Engineer at Mastercard in February 2026',
]

export type Role = {
  company: string
  location: string
  titles: { title: string; dates: string }[]
  highlights: string[]
}

export const EXPERIENCE: Role[] = [
  {
    company: 'Mastercard',
    location: 'Dublin',
    titles: [
      { title: 'Senior Software Engineer', dates: 'Feb 2026 – present' },
      { title: 'Software Engineer II', dates: '2023 – 2026' },
    ],
    highlights: [
      'Led backend design for an internal LLM-powered chatbot: an enterprise data ingestion pipeline feeding a hosted LLM, with responses streamed back to the client.',
      'Kept ingestion and the model provider independently deployable, so the knowledge base or the model can change without touching the other.',
      'Built microservices and event-driven pipelines with Kafka and API Gateway, with platform work on security (Spring Security, OAuth2/JWT) and observability.',
      'Mentored two junior engineers as the team scaled.',
    ],
  },
  {
    company: 'J.P. Morgan',
    location: 'Dublin',
    titles: [{ title: 'Software Engineer', dates: '2021 – 2023' }],
    highlights: [
      'Built backend services for internal financial systems in Java and Spring Boot, in a regulated environment where reliability and auditability were required.',
    ],
  },
]

export type Project = {
  name: string
  context: string
  summary: string
  points: string[]
  // Left-to-right flow drawn as a small diagram on the card
  flow: string[]
  tags: string[]
  links?: { label: string; href: string }[]
}

export const PROJECTS: Project[] = [
  {
    name: 'Internal LLM chatbot',
    context: 'Mastercard',
    summary: 'A chatbot that answers internal users from enterprise knowledge.',
    points: [
      'Ingestion pipeline processes enterprise data into the model’s context',
      'Streaming response layer back to the client',
      'Ingestion and LLM provider deployable independently',
    ],
    flow: ['Enterprise data', 'Ingestion', 'Hosted LLM', 'Streamed reply'],
    tags: ['Java', 'Spring Boot', 'LLM', 'Streaming'],
  },
  {
    name: 'rob-gpt',
    context: 'This site',
    summary: 'A grounded assistant that answers questions about me, and says so when it can’t.',
    points: [
      'Retrieves matching notes from markdown files and cites them on every answer',
      'Refuses questions the notes don’t cover before any model call',
      'Per-IP rate limits and input caps, with the prompt kept server-side',
      '25-case eval suite for facts, refusals and prompt injection, re-run weekly in CI',
    ],
    flow: ['Question', 'Limits', 'Note retrieval', 'Claude Haiku', 'Cited answer'],
    tags: ['Next.js', 'Claude', 'RAG', 'Evals', 'Vercel'],
    links: [
      { label: 'Evals', href: '/evals' },
      { label: 'Source', href: SOURCE },
    ],
  },
]

export const SKILLS: { group: string; items: string[] }[] = [
  {
    group: 'Backend',
    items: ['Java 17+', 'Spring Boot', 'Hibernate / JPA', 'Microservices', 'REST APIs', 'Spring Security', 'OAuth2 / JWT', 'Redis', 'Tomcat / JBoss'],
  },
  {
    group: 'Platform',
    items: ['Distributed systems', 'Kafka', 'API Gateway', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Pivotal Cloud Foundry', 'Observability'],
  },
  {
    group: 'AI and LLM',
    items: ['Python', 'PyTorch', 'TensorFlow', 'Fine-tuning', 'RAG', 'Embeddings', 'Vector databases', 'Model serving', 'Agents and tool calling', 'MLOps / LLMOps', 'Evals', 'AI governance and guardrails', 'Claude API'],
  },
  {
    group: 'Ways of working',
    items: ['Agile delivery', 'Technical design docs', 'Code review', 'Incident response and on-call', 'Performance tuning', 'Mentoring'],
  },
  { group: 'Frontend', items: ['React', 'TypeScript', 'Next.js'] },
]

export const LOOKING_FOR =
  'Senior backend, platform or AI engineering roles where the AI is the engineering problem. Hybrid or remote from Dublin, and happy to move quickly.'

export const FACTS: { label: string; value: string }[] = [
  { label: 'Now', value: 'Senior Software Engineer, Mastercard' },
  { label: 'Before', value: 'Software Engineer, J.P. Morgan' },
  { label: 'Based', value: 'Dublin, Ireland' },
  { label: 'Focus', value: 'Backend and AI/LLM systems' },
  { label: 'Open to', value: 'Hybrid or remote' },
]

export const STATS: { value: string; label: string }[] = [
  { value: '5 yrs', label: 'production backend in finance' },
  { value: '2', label: 'global financial firms' },
  { value: '2', label: 'junior engineers mentored' },
  { value: '2026', label: 'promoted to Senior' },
]

export const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: 'Failure modes first',
    body: 'Start from requirements and what breaks, not the happy path. Then work back to consistency guarantees, data flow and failure domains.',
  },
  {
    title: 'Contracts before code',
    body: 'Sequence diagram first, find the bounded contexts, and get the team to agree on contracts before anyone writes code.',
  },
  {
    title: 'Context before model',
    body: 'In AI systems, get data ingestion and the context layer right before tuning the model. The model can’t fix bad input.',
  },
]
