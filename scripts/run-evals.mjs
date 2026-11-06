#!/usr/bin/env node
// Runs evals/cases.json against rob-gpt and writes evals/results.json.
//
//   EVAL_URL=https://your-deployment.vercel.app npm run evals
//
// EVAL_URL defaults to http://localhost:3000. EVAL_DELAY_MS sets the gap between cases and
// defaults to 6500, which stays under the chat route's limit of 10 requests a minute.
//
// Exits 1 if any case could not be run. Results are not written if no case could be run.

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const MAX_ATTEMPTS = 3

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Case-insensitive. An end that is a letter or digit must fall on a word boundary.
export function matches(reply, term) {
  const start = /^[a-z0-9]/i.test(term) ? '(?<![a-z0-9])' : ''
  const end = /[a-z0-9]$/i.test(term) ? '(?![a-z0-9])' : ''
  return new RegExp(start + escapeRegex(term) + end, 'i').test(reply)
}

export function scoreReply(reply, checks) {
  const results = []
  for (const value of checks.mustIncludeAll ?? []) {
    results.push({ type: 'mustIncludeAll', value, pass: matches(reply, value) })
  }
  if (checks.mustIncludeAny) {
    results.push({
      type: 'mustIncludeAny',
      value: checks.mustIncludeAny.join(' | '),
      pass: checks.mustIncludeAny.some((value) => matches(reply, value)),
    })
  }
  for (const value of checks.mustNotInclude ?? []) {
    results.push({ type: 'mustNotInclude', value, pass: !matches(reply, value) })
  }
  return results
}

// The route answers in the AI SDK data stream format: 0: is text, 3: is an error.
export function parseStream(body) {
  let reply = ''
  let error = null
  for (const line of body.split('\n')) {
    if (line.startsWith('0:')) reply += JSON.parse(line.slice(2))
    else if (line.startsWith('3:')) error = JSON.parse(line.slice(2))
  }
  return { reply, error }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function askRobGpt(baseUrl, prompt) {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
    })

    if (response.status === 429 && attempt < MAX_ATTEMPTS) {
      const wait = Number(response.headers.get('Retry-After')) || 60
      console.log(`  rate limited, waiting ${wait}s`)
      await sleep(wait * 1000)
      continue
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const { reply, error } = parseStream(await response.text())
    if (error) throw new Error(`Stream error: ${error}`)
    if (!reply.trim()) throw new Error('Empty reply')

    let sources = []
    try {
      sources = JSON.parse(response.headers.get('X-Rob-Sources') ?? '[]')
    } catch {
      // Older deployments do not send sources.
    }
    return { reply, sources }
  }
}

export function summarize(results) {
  const tally = (list) => {
    const passed = list.filter((r) => r.status === 'pass').length
    const failed = list.filter((r) => r.status === 'fail').length
    const errored = list.filter((r) => r.status === 'error').length
    const scored = passed + failed
    return {
      total: list.length,
      passed,
      failed,
      errored,
      passRate: scored ? Math.round((passed / scored) * 1000) / 10 : null,
    }
  }
  const categories = [...new Set(results.map((r) => r.category))]
  return {
    ...tally(results),
    byCategory: Object.fromEntries(
      categories.map((category) => [category, tally(results.filter((r) => r.category === category))]),
    ),
  }
}

async function main() {
  const baseUrl = (process.env.EVAL_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  const delayMs = Number(process.env.EVAL_DELAY_MS ?? 6500)
  const casesPath = process.env.EVAL_CASES ?? join(ROOT, 'evals', 'cases.json')
  const resultsPath = process.env.EVAL_RESULTS ?? join(ROOT, 'evals', 'results.json')
  const { cases } = JSON.parse(readFileSync(casesPath, 'utf8'))

  console.log(`Running ${cases.length} cases against ${baseUrl}`)
  const results = []

  for (const [index, testCase] of cases.entries()) {
    if (index > 0) await sleep(delayMs)
    const base = { id: testCase.id, category: testCase.category, prompt: testCase.prompt }

    try {
      const { reply, sources } = await askRobGpt(baseUrl, testCase.prompt)
      const checks = scoreReply(reply, testCase.checks)
      const status = checks.every((check) => check.pass) ? 'pass' : 'fail'
      results.push({ ...base, status, reply, sources, checks })
      console.log(`${status.toUpperCase().padEnd(5)} ${testCase.id}`)
    } catch (error) {
      results.push({ ...base, status: 'error', error: error.message, checks: [] })
      console.log(`ERROR ${testCase.id}: ${error.message}`)
    }
  }

  const summary = summarize(results)
  const rate = summary.passRate === null ? 'n/a' : `${summary.passRate}%`
  console.log(`\n${summary.passed} passed, ${summary.failed} failed, ${summary.errored} errored. Pass rate ${rate}.`)

  if (summary.errored === summary.total) {
    console.error(`No case could be run, so ${resultsPath} was left unchanged.`)
    process.exitCode = 1
    return
  }

  const output = { generatedAt: new Date().toISOString(), target: baseUrl, summary, results }
  writeFileSync(resultsPath, `${JSON.stringify(output, null, 2)}\n`)
  console.log(`Wrote ${resultsPath}`)

  // Not process.exit(): it can crash Node on Windows while fetch connections are closing.
  if (summary.errored > 0) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
