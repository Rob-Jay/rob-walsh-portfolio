import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCaseStudies } from '../../lib/caseStudies'

export const metadata: Metadata = {
  title: 'Case studies | Rob Walsh',
  description: 'How Rob Walsh approached the problems, constraints and decisions behind his projects.',
}

export default function CaseStudiesPage() {
  const studies = getCaseStudies()
  // Nothing published yet: 404 rather than show an empty public page.
  if (studies.length === 0) notFound()

  return (
    <>
      <h1 className="cs-title">Case studies</h1>
      <ul className="cs-list">
        {studies.map((study) => (
          <li key={study.slug}>
            <Link href={`/case-studies/${study.slug}`}>
              <h2>{study.title}</h2>
              <p>{study.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
