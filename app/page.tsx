import AskRobGpt from './components/AskRobGpt'
import ThemeToggle from './components/ThemeToggle'
import {
  CV,
  EMAIL,
  EXPERIENCE,
  GITHUB,
  LINKEDIN,
  LOOKING_FOR,
  PROJECTS,
  PROOF_POINTS,
  SITE_URL,
  SKILLS,
  SOURCE,
} from './profile'

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rob Walsh',
  jobTitle: 'Senior Software Engineer',
  url: SITE_URL,
  email: `mailto:${EMAIL}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Dublin', addressCountry: 'IE' },
  worksFor: { '@type': 'Organization', name: 'Mastercard' },
  alumniOf: { '@type': 'Organization', name: 'J.P. Morgan' },
  knowsAbout: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'LLM systems', 'RAG'],
  sameAs: [LINKEDIN, GITHUB],
}

const NAV = [
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#ask', label: 'Ask rob-gpt' },
  { href: '#contact', label: 'Contact' },
]

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, '\\u003c') }}
      />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="wrap site-header-inner">
          <a className="site-name" href="#top">
            Rob Walsh
          </a>
          <nav aria-label="Sections">
            <ul className="site-nav">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="main">
        <section className="hero wrap" id="top" aria-labelledby="hero-title">
          <p className="eyebrow">
            Dublin · <span className="status">Open to work</span>
          </p>
          <h1 id="hero-title">Senior Software Engineer building AI and LLM systems.</h1>
          <p className="lede">
            Five years shipping production backend in financial services at Mastercard and J.P. Morgan. Now focused on
            systems where the AI is the engineering problem.
          </p>
          <ul className="proof">
            {PROOF_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="actions">
            <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
              Email me
            </a>
            <a className="btn" href={CV} target="_blank" rel="noreferrer">
              Download CV
            </a>
            <a className="btn" href={LINKEDIN} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </section>

        <section className="section wrap" id="experience" aria-labelledby="experience-title">
          <h2 id="experience-title">Experience</h2>
          <ol className="roles">
            {EXPERIENCE.map((role) => (
              <li key={role.company} className="role">
                <div className="role-head">
                  <h3>{role.company}</h3>
                  <span className="muted">{role.location}</span>
                </div>
                <ul className="role-titles">
                  {role.titles.map((t) => (
                    <li key={t.title}>
                      <span>{t.title}</span>
                      <span className="muted mono">{t.dates}</span>
                    </li>
                  ))}
                </ul>
                <ul className="bullets">
                  {role.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="section wrap" id="work" aria-labelledby="work-title">
          <h2 id="work-title">Selected work</h2>
          <div className="projects">
            {PROJECTS.map((project) => (
              <article key={project.name} className="project">
                <p className="eyebrow">{project.context}</p>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <ul className="bullets">
                  {project.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {project.links && (
                  <p className="links">
                    {project.links.map((link) => (
                      <a key={link.href} href={link.href}>
                        {link.label}
                      </a>
                    ))}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="section wrap" id="skills" aria-labelledby="skills-title">
          <h2 id="skills-title">Skills</h2>
          <dl className="skills">
            {SKILLS.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section wrap" id="ask" aria-labelledby="ask-title">
          <h2 id="ask-title">Ask rob-gpt</h2>
          <p className="muted">
            Questions about my experience, answered from my notes. It says so when the notes don’t cover something.
          </p>
          <AskRobGpt />
        </section>

        <section className="section wrap" id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <p className="lede">{LOOKING_FOR}</p>
          <div className="actions">
            <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <a className="btn" href={LINKEDIN} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="btn" href={CV} target="_blank" rel="noreferrer">
              CV
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer wrap">
        <span>© {new Date().getFullYear()} Rob Walsh · Dublin</span>
        <span>
          <a href={GITHUB}>GitHub</a> · <a href={SOURCE}>Site source</a>
        </span>
      </footer>
    </>
  )
}
