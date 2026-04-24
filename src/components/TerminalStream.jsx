const LINES = [
  { tokens: [{ t: 'comment', v: '// Strict Mode guard — prevents double-stream' }] },
  { tokens: [{ t: 'kw', v: 'const ' }, { t: 'var', v: 'playedRef' }, { t: 'plain', v: ' = ' }, { t: 'fn', v: 'useRef' }, { t: 'plain', v: '(' }, { t: 'kw', v: 'new ' }, { t: 'fn', v: 'Set' }, { t: 'plain', v: '())' }] },
  { tokens: [] },
  { tokens: [{ t: 'kw', v: 'const ' }, { t: 'fn', v: 'play ' }, { t: 'plain', v: '= ' }, { t: 'kw', v: 'async ' }, { t: 'plain', v: '(convId) => {' }] },
  { tokens: [{ t: 'plain', v: '  ' }, { t: 'kw', v: 'if ' }, { t: 'plain', v: '(playedRef.current.' }, { t: 'fn', v: 'has' }, { t: 'plain', v: '(convId)) ' }, { t: 'kw', v: 'return' }] },
  { tokens: [{ t: 'plain', v: '  playedRef.current.' }, { t: 'fn', v: 'add' }, { t: 'plain', v: '(convId)' }] },
  { tokens: [] },
  { tokens: [{ t: 'plain', v: '  ' }, { t: 'kw', v: 'for await ' }, { t: 'plain', v: '(' }, { t: 'kw', v: 'const ' }, { t: 'var', v: 'event ' }, { t: 'kw', v: 'of ' }, { t: 'var', v: 'stream' }, { t: 'plain', v: ') {' }] },
  { tokens: [{ t: 'plain', v: '    ' }, { t: 'fn', v: 'appendChar' }, { t: 'plain', v: '(convId, event.delta.text)' }] },
  { tokens: [{ t: 'plain', v: '  }' }] },
  { tokens: [{ t: 'plain', v: '}' }] },
]

const COLORS = {
  kw:      '#818cf8',
  fn:      '#34d399',
  var:     '#fbbf24',
  comment: '#4a4870',
  plain:   '#c4bef5',
}

export default function TerminalStream() {
  return (
    <div className="terminal-window">
      <div className="terminal-chrome">
        <span className="terminal-dot terminal-dot--red" />
        <span className="terminal-dot terminal-dot--yellow" />
        <span className="terminal-dot terminal-dot--green" />
        <span className="terminal-title">portfolio.jsx</span>
      </div>
      <div className="terminal-body">
        {LINES.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.tokens.length === 0
              ? <span>&nbsp;</span>
              : line.tokens.map((tok, j) => (
                  <span key={j} style={{ color: COLORS[tok.t] }}>{tok.v}</span>
                ))
            }
          </div>
        ))}
        <div className="terminal-line">
          <span className="terminal-cursor" />
        </div>
      </div>
    </div>
  )
}
