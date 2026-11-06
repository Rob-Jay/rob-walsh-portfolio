import Link from 'next/link'
import './case-studies.css'

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cs-page">
      <nav className="cs-nav" aria-label="Case studies">
        <Link href="/">Rob Walsh</Link>
        <Link href="/case-studies">Case studies</Link>
      </nav>
      <main className="cs-main">{children}</main>
    </div>
  )
}
