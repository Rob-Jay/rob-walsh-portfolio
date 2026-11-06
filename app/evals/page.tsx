import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import Link from 'next/link'
import './evals.css'

export const metadata: Metadata = {
  title: 'rob-gpt evals | Rob Walsh',
  description: 'How rob-gpt scores on factual answers, out-of-scope refusals and prompt-injection attempts.',
}

type Tally = { total: number; passed: number; failed: number; errored: number; passRate: number | null }
type Check = { type: string; value: string; pass: boolean }
type CaseResult = {
  id: string
  category: string
  prompt: string
  status: 'pass' | 'fail' | 'error'
  reply?: string
  sources?: string[]
  error?: string
  checks: Check[]
}
type Results = {
  generatedAt: string
  target: string
  summary: Tally & { byCategory: Record<string, Tally> }
  results: CaseResult[]
}

const CHECK_LABELS: Record<string, string> = {
  mustIncludeAll: 'Must include',
  mustIncludeAny: 'Must include one of',
  mustNotInclude: 'Must not include',
}

// Read at build time, so the page updates when new results are committed.
function loadResults(): Results | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'evals', 'results.json'), 'utf8'))
  } catch {
    return null
  }
}

const formatRate = (rate: number | null) => (rate === null ? 'n/a' : `${rate}%`)

function TallyRow({ label, tally }: { label: string; tally: Tally }) {
  return (
    <>
      <th scope="row">{label}</th>
      <td className="ev-rate">{formatRate(tally.passRate)}</td>
      <td>{tally.passed}</td>
      <td>{tally.failed}</td>
      <td>{tally.errored}</td>
      <td>{tally.total}</td>
    </>
  )
}

export default function EvalsPage() {
  const data = loadResults()

  return (
    <div className="ev-page">
      <nav className="ev-nav" aria-label="Evals">
        <Link href="/">Rob Walsh</Link>
      </nav>
      <main className="ev-main">
        <h1 className="ev-title">rob-gpt evals</h1>
        <p className="ev-intro">
          Test cases run against the live chat: facts about Rob, out-of-scope refusals and prompt-injection attempts.
          Each reply is checked automatically with string rules, so these scores are a signal, not a guarantee.
        </p>

        {!data ? (
          <p className="ev-notice">No eval results yet.</p>
        ) : (
          <>
            <p className="ev-meta">
              Last run <time dateTime={data.generatedAt}>{new Date(data.generatedAt).toUTCString()}</time>
            </p>

            {data.summary.errored > 0 && (
              <p className="ev-notice">
                {data.summary.errored} of {data.summary.total} cases could not run. Pass rates only count cases that
                ran, so this run is incomplete.
              </p>
            )}

            <div className="ev-table-wrap">
              <table className="ev-table">
                <caption>Pass rate by category</caption>
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Pass rate</th>
                    <th scope="col">Passed</th>
                    <th scope="col">Failed</th>
                    <th scope="col">Errored</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.summary.byCategory).map(([category, tally]) => (
                    <tr key={category}>
                      <TallyRow label={category} tally={tally} />
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <TallyRow label="All cases" tally={data.summary} />
                  </tr>
                </tfoot>
              </table>
            </div>

            <h2 className="ev-heading">Cases</h2>
            <ul className="ev-cases">
              {data.results.map((result) => (
                <li key={result.id}>
                  <details className="ev-case">
                    <summary>
                      <span className={`ev-status ev-status--${result.status}`}>{result.status}</span>
                      <span className="ev-case-prompt">{result.prompt}</span>
                    </summary>
                    <dl className="ev-detail">
                      <dt>Case</dt>
                      <dd>
                        {result.id} ({result.category})
                      </dd>
                      {result.error && (
                        <>
                          <dt>Error</dt>
                          <dd>{result.error}</dd>
                        </>
                      )}
                      {result.reply && (
                        <>
                          <dt>Reply</dt>
                          <dd className="ev-reply">{result.reply}</dd>
                        </>
                      )}
                      {result.sources && result.sources.length > 0 && (
                        <>
                          <dt>Sources</dt>
                          <dd>{result.sources.join(', ')}</dd>
                        </>
                      )}
                      {result.checks.length > 0 && (
                        <>
                          <dt>Checks</dt>
                          <dd>
                            <ul className="ev-checks">
                              {result.checks.map((check, i) => (
                                <li key={i}>
                                  <span className={check.pass ? 'ev-ok' : 'ev-bad'}>{check.pass ? 'Pass' : 'Fail'}</span>{' '}
                                  {CHECK_LABELS[check.type] ?? check.type}: {check.value}
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </>
                      )}
                    </dl>
                  </details>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}
