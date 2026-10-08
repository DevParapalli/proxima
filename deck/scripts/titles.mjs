#!/usr/bin/env node
// Titles mode, as Centauri's `--input mode=titles`: every slide title in order,
// grouped by section, for reviewing the argument before the content is written
// (the "ghost deck"). Usage: node scripts/titles.mjs deck.md
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { load } from '@slidev/parser/fs'

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); throw e })

const entry = resolve(process.argv[2] ?? 'slides.md')
const userRoot = dirname(entry)
const data = await load({ userRoot, roots: [userRoot], allowedRoots: [userRoot] }, entry)

// Statements and quotations carry a sentence, not a title, and are not listed.
const UNTITLED = new Set(['statement', 'quote'])
const plain = t => t?.replace(/[*_`~]+/g, '').replace(/<[^>]+>/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim()
const pad = n => (n < 10 ? `0${n}` : String(n))

let section = 0
for (const s of data.slides) {
  const no = s.index + 1
  const kind = s.frontmatter.layout ?? (no === 1 ? 'cover' : 'claim')
  const title = plain(s.frontmatter.title ?? s.title)
  if (kind === 'section') {
    section += 1
    process.stdout.write(`\n${section}. ${title ?? ''}\n`)
    continue
  }
  if (UNTITLED.has(kind)) continue
  process.stdout.write(`  ${pad(no)}  ${title ?? `(${kind})`}\n`)
}
