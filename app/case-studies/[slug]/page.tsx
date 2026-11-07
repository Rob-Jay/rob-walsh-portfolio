import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudy } from '../../../lib/caseStudies'

type Props = { params: { slug: string } }

export const dynamicParams = false

export function generateStaticParams() {
  return getCaseStudies().map(({ slug }) => ({ slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const study = getCaseStudy(params.slug)
  if (!study) return {}
  return {
    title: `${study.title} | Rob Walsh`,
    description: study.summary,
    robots: study.draft ? { index: false } : undefined,
  }
}

export default function CaseStudyPage({ params }: Props) {
  const study = getCaseStudy(params.slug)
  if (!study) notFound()

  return (
    <article>
      <header className="cs-header">
        {study.draft && <p className="cs-draft">Draft</p>}
        <h1 className="cs-title">{study.title}</h1>
        <p className="cs-summary">{study.summary}</p>
        {study.role && <p className="cs-role">{study.role}</p>}
      </header>
      {study.sections.map(({ heading, html }) => (
        <section key={heading} className="cs-section">
          <h2>{heading}</h2>
          <div className="cs-prose" dangerouslySetInnerHTML={{ __html: html }} />
        </section>
      ))}
    </article>
  )
}
