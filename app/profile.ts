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
    links: [
      { label: 'Evals', href: '/evals' },
      { label: 'Source', href: SOURCE },
    ],
  },
]

export const SKILLS: { group: string; items: string[] }[] = [
  { group: 'Backend', items: ['Java', 'Spring Boot', 'Microservices', 'REST APIs', 'Spring Security', 'OAuth2 / JWT'] },
  { group: 'Platform', items: ['Kafka', 'API Gateway', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Observability'] },
  { group: 'AI and LLM', items: ['Claude API', 'Streaming', 'Tool use', 'RAG', 'Embeddings', 'Vector search', 'Evals'] },
  { group: 'Frontend', items: ['React', 'TypeScript', 'Next.js'] },
]

export const LOOKING_FOR =
  'Senior backend, platform or AI engineering roles where the AI is the engineering problem. Hybrid or remote from Dublin, and happy to move quickly.'
