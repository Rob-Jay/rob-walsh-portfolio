import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'case-studies')

export const SECTIONS = ['Problem', 'Constraints', 'Architecture', 'Decisions', 'Outcome'] as const

export type CaseStudy = {
  slug: string
  title: string
  summary: string
  role?: string
  draft: boolean
  sections: { heading: string; html: string }[]
}

// Drafts show in `next dev`, or in a build with SHOW_DRAFTS=1. Never on a normal production build.
const showDrafts = () => process.env.NODE_ENV !== 'production' || process.env.SHOW_DRAFTS === '1'

function parseFile(file: string): CaseStudy {
  const { data, content } = matter(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8'))

  for (const field of ['title', 'summary']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) {
      throw new Error(`${file}: front matter needs a "${field}"`)
    }
  }

  // split with a capture group gives [intro, heading, body, heading, body, ...]
  const parts = content.split(/^## +(.+?) *$/m)
  const bodies = new Map<string, string>()
  for (let i = 1; i < parts.length; i += 2) bodies.set(parts[i].trim(), parts[i + 1])

  const sections = SECTIONS.map((heading) => {
    const body = bodies.get(heading)?.trim()
    if (!body) throw new Error(`${file}: needs a non-empty "## ${heading}" section`)
    return { heading, html: marked.parse(body, { async: false }) as string }
  })

  return {
    slug: file.replace(/\.md$/, ''),
    title: data.title,
    summary: data.summary,
    role: typeof data.role === 'string' ? data.role : undefined,
    draft: data.draft === true,
    sections,
  }
}

export function getCaseStudies(): CaseStudy[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    .sort()
    .map(parseFile)
    .filter((study) => !study.draft || showDrafts())
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return getCaseStudies().find((study) => study.slug === slug)
}
