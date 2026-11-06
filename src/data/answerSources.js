// Knowledge files behind each scripted answer, shown as source chips.
// Conversations left out here (how-built, game) are not backed by content/knowledge.
export const CONVERSATION_SOURCES = {
  intro: ['about.md'],
  contact: ['contact.md'],
  stack: ['skills.md'],
  ai: ['ai-work.md', 'training.md'],
  work: ['looking-for.md'],
  career: ['experience.md'],
  outside: ['training.md'],
}

export const CANNED_SOURCES = {
  "What's your tech stack?": ['skills.md'],
  'Tell me about your AI work': ['ai-work.md', 'training.md'],
  'Are you open to work?': ['looking-for.md'],
  'Tell me about yourself': ['about.md'],
  'Tell me about the LLM work': ['ai-work.md'],
  'How do you approach system design?': ['engineering-approach.md'],
  'What AI frameworks have you used?': ['skills.md'],
  'What did you build at Mastercard?': ['ai-work.md', 'experience.md'],
  'Walk me through your career': ['experience.md'],
  'Tell me about the UTMB training engine': ['training.md'],
}
