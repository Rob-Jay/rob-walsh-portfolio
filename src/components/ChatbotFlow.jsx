const ROWS = [
  [
    { label: 'Internal Data', sub: 'enterprise knowledge', color: '#818cf8' },
    { label: 'Ingestion Layer', sub: 'processing pipeline', color: '#a78bfa' },
    { label: 'LLM Context', sub: 'data-aware model', color: '#f59e0b' },
  ],
  [
    { label: 'Response', sub: 'streamed to client', color: '#34d399', mirror: true },
    { label: 'LLM Engine', sub: 'generation layer', color: '#f59e0b', mirror: true },
    { label: 'User Query', sub: 'natural language', color: '#34d399', mirror: true },
  ],
]

function ArrowRight() {
  return (
    <svg className="flow-arrow" viewBox="0 0 28 16" aria-hidden="true">
      <line x1="2" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="16,3 22,8 16,13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowLeft() {
  return (
    <svg className="flow-arrow" viewBox="0 0 28 16" aria-hidden="true">
      <line x1="26" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="12,3 6,8 12,13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowDown() {
  return (
    <div className="flow-arrow-down" aria-hidden="true">
      <svg viewBox="0 0 16 28" width="16" height="28">
        <line x1="8" y1="2" x2="8" y2="22" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
        <polyline points="3,16 8,22 13,16" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function ChatbotFlow() {
  return (
    <div className="chatbot-flow">
      {ROWS.map((row, ri) => (
        <div key={ri}>
          <div className="flow-row">
            {row.map((node, ni) => {
              const isLast = ni === row.length - 1
              const Arrow = row[0].mirror ? ArrowLeft : ArrowRight
              return (
                <div key={ni} className="flow-node-group">
                  <div
                    className="flow-node"
                    style={{
                      borderColor: `${node.color}2a`,
                      background: `${node.color}0c`,
                    }}
                  >
                    <span className="flow-node-dot" style={{ background: node.color }} />
                    <div className="flow-node-text">
                      <span className="flow-node-label" style={{ color: node.color }}>{node.label}</span>
                      <span className="flow-node-sub">{node.sub}</span>
                    </div>
                  </div>
                  {!isLast && (
                    <div style={{ color: `${row[ni + 1]?.color ?? node.color}55` }}>
                      <Arrow />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {ri === 0 && <ArrowDown />}
        </div>
      ))}
    </div>
  )
}
