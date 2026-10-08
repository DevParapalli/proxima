#!/usr/bin/env node
// Present a Centauri document, or any PDF, through the deck: every page becomes a
// `page` slide, so the result has Slidev's presenter view, notes, overview and
// export over pages that were laid out elsewhere.
//
//   node scripts/import-pages.mjs deck.typ [--out dir] [--chrome] [-- typst args]
//   node scripts/import-pages.mjs report.pdf [--out dir] [--chrome]
//
// A `.typ` input is compiled with `typst compile --format svg`, one vector SVG per
// page, and its slide titles, kinds and sections are read with `typst query` from
// the <centauri-slide> metadata Centauri writes. Arguments after `--` go to typst
// (for example `--root .` or `--input projection=light`). A `.pdf` input is
// rendered with pdftocairo, and each page's first text line becomes its title.
//
// Output, beside the input unless --out is given: `<name>-pages.md`, the deck, and
// `public/<name>-pages/NN.svg`, the pages, which Slidev serves and copies on build.
// Re-running regenerates the pages and the frontmatter and keeps the speaker notes
// written in the markdown.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, relative, resolve } from 'node:path'
import process from 'node:process'
import { parseSync } from '@slidev/parser'

const THEME = resolve(import.meta.dirname, '..')

function usage(msg) {
  if (msg) console.error(msg)
  console.error('usage: import-pages.mjs <deck.typ|document.pdf> [--out dir] [--chrome] [-- typst args]')
  process.exit(2)
}

function run(cmd, args, what) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' })
  if (r.error?.code === 'ENOENT') usage(`${cmd} is not installed; it is needed to ${what}`)
  if (r.status !== 0) usage(`${cmd} failed (${what}):\n${r.stderr}`)
  return r.stdout
}

const pad = n => (n < 10 ? `0${n}` : String(n))
const yaml = s => JSON.stringify(String(s))

/** Plain text of a Typst content value as `typst query` serialises it. */
function plainTypst(v) {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v.map(plainTypst).join('')
  if (typeof v === 'object') {
    if (typeof v.text === 'string') return v.text
    if (v.func === 'space') return ' '
    if (v.func === 'linebreak') return ' '
    if (v.children) return plainTypst(v.children)
    if (v.body) return plainTypst(v.body)
    if (v.child) return plainTypst(v.child)
  }
  return ''
}

// ---- arguments ----------------------------------------------------------------
const argv = process.argv.slice(2)
const dash = argv.indexOf('--')
const own = dash === -1 ? argv : argv.slice(0, dash)
const typstArgs = dash === -1 ? [] : argv.slice(dash + 1)
let input, outDir, chrome = false
for (let i = 0; i < own.length; i++) {
  const a = own[i]
  if (a === '--out') outDir = own[++i]
  else if (a === '--chrome') chrome = true
  else if (a.startsWith('-')) usage(`unknown option ${a}`)
  else if (!input) input = a
  else usage('one input only')
}
if (!input) usage()
input = resolve(input)
if (!existsSync(input)) usage(`${input} does not exist`)
const ext = extname(input).toLowerCase()
if (ext !== '.typ' && ext !== '.pdf') usage('the input must be a .typ or a .pdf file')
const name = basename(input, ext)
outDir = resolve(outDir ?? dirname(input))
const pagesDir = resolve(outDir, 'public', `${name}-pages`)
const deckPath = resolve(outDir, `${name}-pages.md`)

// ---- pages --------------------------------------------------------------------
rmSync(pagesDir, { recursive: true, force: true })
mkdirSync(pagesDir, { recursive: true })

/** @type {{ title?: string, kind?: string }[]} one entry per page */
let pages = []

if (ext === '.typ') {
  run('typst', ['compile', '--format', 'svg', ...typstArgs, input, resolve(pagesDir, '{0p}.svg')], 'compile the pages')
  const count = readdirSync(pagesDir).filter(f => f.endsWith('.svg')).length
  pages = Array.from({ length: count }, () => ({}))
  const json = run('typst', ['query', ...typstArgs, input, '<centauri-slide>', '--field', 'value'], 'read the slide titles')
  for (const s of JSON.parse(json)) {
    const p = pages[s.n - 1]
    if (!p) continue
    p.kind = s.kind
    p.title = plainTypst(s.title).trim() || undefined
  }
} else {
  const info = run('pdfinfo', [input], 'count the pages')
  const count = Number(/^Pages:\s+(\d+)/m.exec(info)?.[1] ?? 0)
  if (!count) usage('pdfinfo reported no pages')
  pages = []
  for (let n = 1; n <= count; n++) {
    run('pdftocairo', ['-svg', '-f', String(n), '-l', String(n), input, resolve(pagesDir, `${pad(n)}.svg`)], `render page ${n}`)
    const xml = run('pdftotext', ['-f', String(n), '-l', String(n), '-bbox-layout', input, '-'], `read page ${n}`)
    pages.push({ title: largestText(xml) })
  }
}

/** The text block set largest on a page, which is its title on most documents. */
function largestText(xml) {
  let best, bestSize = 0
  for (const [, block] of xml.matchAll(/<block[^>]*>([\s\S]*?)<\/block>/g)) {
    const lines = [...block.matchAll(/<line[^>]*yMin="([\d.]+)"[^>]*yMax="([\d.]+)"[^>]*>([\s\S]*?)<\/line>/g)]
    if (!lines.length) continue
    const size = Math.max(...lines.map(l => Number(l[2]) - Number(l[1])))
    const text = lines.map(l => [...l[3].matchAll(/<word[^>]*>([^<]*)<\/word>/g)].map(w => w[1]).join(' ')).join(' ').trim()
    // Rotated text comes back one letter per word; it is never the title.
    const words = text.split(' ')
    if (words.filter(w => w.length === 1).length > words.length / 2) continue
    if (text && size > bestSize + 0.01) { best = text; bestSize = size }
  }
  return best ? best.slice(0, 120) : undefined
}

// ---- notes already written ----------------------------------------------------
const notes = new Map()
if (existsSync(deckPath)) {
  const old = parseSync(readFileSync(deckPath, 'utf8'), deckPath)
  old.slides.forEach((s, i) => { if (s.note?.trim()) notes.set(i, s.note.trim()) })
}

// ---- deck ---------------------------------------------------------------------
const theme = relative(outDir, THEME) || '.'
const out = []
pages.forEach((p, i) => {
  const no = i + 1
  const fm = []
  if (no === 1) {
    fm.push(`theme: ${theme.startsWith('.') ? theme : `./${theme}`}`)
    if (chrome) fm.push('themeConfig:', `  label: ${yaml(name)}`)
  }
  fm.push('layout: page', `image: /${name}-pages/${pad(no)}.svg`)
  if (chrome) fm.push('chrome: true')
  if (p.kind) fm.push(`kind: ${p.kind}`)
  // The first slide's title is also the deck's.
  fm.push(`title: ${yaml(p.title ?? (no === 1 ? name : `Page ${no}`))}`)
  out.push(`---\n${fm.join('\n')}\n---\n`)
  out.push(`<!--\n${notes.get(i) ?? `Notes for page ${no}.`}\n-->\n`)
})
writeFileSync(deckPath, out.join('\n'))
console.log(`wrote ${relative(process.cwd(), deckPath)} and ${pages.length} pages in ${relative(process.cwd(), pagesDir)}`)
