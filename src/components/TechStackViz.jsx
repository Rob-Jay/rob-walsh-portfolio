const GROUPS = [
  {
    name: 'Backend Core',
    color: '#f59e0b',
    skills: ['Java', 'Spring Boot', 'Spring Security', 'REST APIs', 'OAuth2 / JWT', 'Microservices'],
  },
  {
    name: 'Platform & Cloud',
    color: '#818cf8',
    skills: ['Kafka', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'API Gateway'],
  },
  {
    name: 'AI / LLM',
    color: '#34d399',
    skills: ['Claude API', 'RAG', 'Vector Search', 'Embeddings', 'Streaming', 'Tool Use'],
  },
  {
    name: 'Frontend',
    color: '#f472b6',
    skills: ['React', 'TypeScript', 'Vite'],
  },
]

export default function TechStackViz() {
  return (
    <div className="techstack-viz">
      {GROUPS.map((group, i) => (
        <div key={i} className="ts-group">
          <div className="ts-group-label">
            <span className="ts-dot" style={{ background: group.color }} />
            <span style={{ color: group.color }}>{group.name}</span>
          </div>
          <div className="ts-chips">
            {group.skills.map((skill, j) => (
              <span
                key={j}
                className="ts-chip"
                style={{
                  borderColor: `${group.color}2e`,
                  background: `${group.color}0d`,
                  color: `${group.color}cc`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
