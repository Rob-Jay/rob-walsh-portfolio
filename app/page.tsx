import AskRobGpt from './components/AskRobGpt'
import ThemeToggle from './components/ThemeToggle'
import {
  CV,
  EMAIL,
  EXPERIENCE,
  FACTS,
  GITHUB,
  LINKEDIN,
  LOOKING_FOR,
  PRINCIPLES,
  PROJECTS,
  PROOF_POINTS,
  SITE_URL,
  SKILLS,
  SOURCE,
  STATS,
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

const initials = (name: string) =>
  name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)

function SectionHeading({ id, index, title }: { id: string; index: string; title: string }) {
  return (
    <h2 id={id} className="section-title">
      <span className="section-index" aria-hidden="true">
        {index}
      </span>
      {title}
    </h2>
  )
}

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
            <span className="monogram" aria-hidden="true">
              RW
            </span>
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
          <a className="btn btn-small btn-primary header-cta" href={`mailto:${EMAIL}`}>
            Hire me
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div>
              <p className="eyebrow">
                Dublin · <span className="status">Open to work</span>
              </p>
              <h1 id="hero-title">
                Senior Software Engineer building <span className="accent">AI and LLM systems.</span>
              </h1>
              <p className="lede">
                Five years shipping production backend in financial services at Mastercard and J.P. Morgan. Now focused
                on systems where the AI is the engineering problem.
              </p>
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
            </div>

            <aside className="profile-card" aria-label="At a glance">
              <div className="profile-top">
                <span className="avatar" aria-hidden="true">
                  RW
                </span>
                <div>
                  <p className="profile-name">Rob Walsh</p>
                  <p className="muted small">Senior Software Engineer</p>
                </div>
              </div>
              <dl className="facts">
                {FACTS.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>

          <div className="wrap">
            <ul className="proof">
              {PROOF_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="stats-band" aria-label="In numbers">
          <dl className="wrap stats">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section wrap" aria-labelledby="experience-title" id="experience">
          <SectionHeading id="experience-title" index="01" title="Experience" />
          <ol className="timeline">
            {EXPERIENCE.map((role) => (
              <li key={role.company} className="role">
                <span className="role-mark" aria-hidden="true">
                  {initials(role.company)}
                </span>
                <div className="role-body">
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
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section wrap" aria-labelledby="work-title" id="work">
          <SectionHeading id="work-title" index="02" title="Selected work" />
          <div className="projects">
            {PROJECTS.map((project) => (
              <article key={project.name} className="project">
                <p className="eyebrow">{project.context}</p>
                <h3>{project.name}</h3>
                <p className="project-summary">{project.summary}</p>
                <ol className="flow" aria-label={`${project.name} architecture`}>
                  {project.flow.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <ul className="bullets">
                  {project.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <ul className="tags" aria-label="Technologies">
                  {project.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {project.links && (
                  <p className="links">
                    {project.links.map((link) => (
                      <a key={link.href} href={link.href}>
                        {link.label} →
                      </a>
                    ))}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="section wrap" aria-labelledby="approach-title" id="approach">
          <SectionHeading id="approach-title" index="03" title="How I work" />
          <ol className="principles">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title}>
                <span className="principle-index mono" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section wrap" aria-labelledby="skills-title" id="skills">
          <SectionHeading id="skills-title" index="04" title="Skills" />
          <div className="skills">
            {SKILLS.map((s) => (
              <div key={s.group} className="skill-group">
                <h3>{s.group}</h3>
                <ul className="tags">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="section wrap" aria-labelledby="ask-title" id="ask">
          <SectionHeading id="ask-title" index="05" title="Ask rob-gpt" />
          <p className="section-intro">
            Questions about my experience, answered from my notes with sources. It says so when the notes don’t cover
            something.
          </p>
          <AskRobGpt />
        </section>

        <section className="wrap contact-wrap" aria-labelledby="contact-title" id="contact">
          <div className="contact-panel">
            <h2 id="contact-title">Let’s talk.</h2>
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
          </div>
        </section>
      </main>

      <footer className="site-footer wrap">
        <span>© {new Date().getFullYear()} Rob Walsh · Dublin</span>
        <span>
          <a href={GITHUB}>GitHub</a> · <a href={SOURCE}>Site source</a> · <a href="/evals">Evals</a>
        </span>
      </footer>
    </>
  )
}
