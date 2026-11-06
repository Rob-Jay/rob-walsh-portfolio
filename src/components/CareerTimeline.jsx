const ROLES = [
  {
    company: 'J.P. Morgan',
    role: 'Software Engineer',
    period: '2021 – 2023',
    color: '#4a6fa5',
    textColor: '#8aa8dc',
    initials: 'JPM',
    highlights: [
      'Backend services for internal financial systems',
      'Java & Spring Boot in a regulated environment',
      'Reliability, auditability, and production scale',
    ],
  },
  {
    company: 'Mastercard',
    role: 'Software Engineer II',
    period: '2023 – Feb 2026',
    color: '#d6001a',
    textColor: '#ff6b73',
    initials: 'MC',
    highlights: [
      'Microservices, Kafka pipelines, API Gateway',
      'Led backend design for LLM-powered chatbot',
      'RAG retrieval layer and streaming architecture',
    ],
  },
  {
    company: 'Mastercard',
    role: 'Senior Software Engineer',
    period: 'Feb 2026 – Present',
    color: '#f59e0b',
    badgeText: '#0a0500',
    initials: 'MC',
    current: true,
    highlights: [
      'Promoted off the LLM chatbot architecture work',
      'Team mentoring as the engineering org scales',
      'Targeting AI-native product engineering next',
    ],
  },
]

export default function CareerTimeline() {
  return (
    <div className="career-timeline">
      {ROLES.map((role, i) => (
        <div key={i} className="tl-entry">
          <div className="tl-left">
            <div
              className="tl-badge"
              style={{ background: role.color, color: role.badgeText, boxShadow: `0 0 0 3px ${role.color}28` }}
            >
              {role.initials}
            </div>
            {i < ROLES.length - 1 && <div className="tl-spine" />}
          </div>
          <div className="tl-body">
            <div className="tl-period">{role.period}</div>
            <div className="tl-company" style={{ color: role.textColor ?? role.color }}>{role.company}</div>
            <div className="tl-role">
              {role.role}
              {role.current && <span className="tl-now-badge">now</span>}
            </div>
            <ul className="tl-points">
              {role.highlights.map((h, j) => <li key={j}>{h}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
