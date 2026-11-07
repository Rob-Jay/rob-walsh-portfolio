const PROOF_POINTS = [
  'Led the backend for an internal LLM chatbot at Mastercard',
  'Five years of production backend at Mastercard and J.P. Morgan',
  'Built a RAG training engine on Strava data and vector search',
]

export default function Hero({ onAsk }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero-eyebrow">Rob Walsh · Dublin</p>
      <h1 id="hero-title" className="hero-title">
        Senior Software Engineer building AI and LLM systems.
      </h1>
      <ul className="hero-proof">
        {PROOF_POINTS.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <div className="hero-actions">
        <a className="hero-btn" href="/Rob-Walsh-CV.pdf" target="_blank" rel="noreferrer">
          Download CV
        </a>
        <a
          className="hero-btn"
          href="https://www.linkedin.com/in/robert-walsh-937703218/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <button type="button" className="hero-btn hero-btn--primary" onClick={onAsk}>
          Ask rob-gpt
        </button>
      </div>
    </section>
  )
}
