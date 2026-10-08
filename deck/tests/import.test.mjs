// import-pages.mjs turns a PDF, or a Centauri document through typst, into a deck
// of page slides that builds, exports and keeps its notes across runs.
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { test } from 'node:test'
import { OUT, ROOT, exportArgs, pdfPages, slidev } from './helpers.mjs'

const DIR = resolve(OUT, 'import')
rmSync(DIR, { recursive: true, force: true })
mkdirSync(DIR, { recursive: true })

function importPages(args, env = {}) {
  return spawnSync('node', ['scripts/import-pages.mjs', ...args], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, ...env } })
}

test('a PDF imports as one page slide per page, builds and exports', () => {
  const pdf = resolve(DIR, 'source.pdf')
  const r0 = slidev(['export', 'example.md', '--output', pdf, ...exportArgs()])
  assert.equal(r0.status, 0, r0.out)

  const r = importPages([pdf, '--out', DIR])
  assert.equal(r.status, 0, r.stderr)
  const md = readFileSync(resolve(DIR, 'source-pages.md'), 'utf8')
  assert.equal(readdirSync(resolve(DIR, 'public/source-pages')).length, 18)
  assert.equal((md.match(/^layout: page$/gm) ?? []).length, 18)
  assert.match(md, /^image: \/source-pages\/01\.svg$/m)
  // Page furniture repeated on every page is not taken as a title.
  assert.doesNotMatch(md, /^title: "Series label"$/m)
  assert.match(md, /^title: "Deck title in five words or fewer"$/m)

  const b = slidev(['build', resolve(DIR, 'source-pages.md'), '--out', resolve(DIR, 'dist')])
  assert.equal(b.status, 0, b.out)
  assert.ok(existsSync(resolve(DIR, 'dist/source-pages/18.svg')))

  const out = resolve(DIR, 'source-pages.pdf')
  const e = slidev(['export', resolve(DIR, 'source-pages.md'), '--output', out, ...exportArgs()])
  assert.equal(e.status, 0, e.out)
  // pdftocairo outlines text, so count pages rather than text.
  assert.equal(pdfPages(out), 18)
})

test('a Centauri document imports through typst with its titles and kinds', () => {
  const typ = resolve(DIR, 'stub.typ')
  writeFileSync(typ, '// stub\n')
  const r = importPages([typ, '--out', DIR, '--', '--root', '.'], { PATH: `${resolve(ROOT, 'tests/fixtures/bin')}:${process.env.PATH}` })
  assert.equal(r.status, 0, r.stderr)
  const md = readFileSync(resolve(DIR, 'stub-pages.md'), 'utf8')
  assert.equal(readdirSync(resolve(DIR, 'public/stub-pages')).length, 3)
  assert.match(md, /^kind: cover$/m)
  assert.match(md, /^kind: section$/m)
  assert.match(md, /^title: "Deck title"$/m)
  assert.match(md, /^title: "A claim with emphasis"$/m)
  // The titles script sees the imported structure.
  const t = spawnSync('node', ['scripts/titles.mjs', resolve(DIR, 'stub-pages.md')], { cwd: ROOT, encoding: 'utf8' })
  assert.match(t.stdout, /^1\. First section$/m)
  assert.match(t.stdout, /^  03  A claim with emphasis$/m)
})

test('re-running keeps the notes written in the deck', () => {
  const typ = resolve(DIR, 'notes.typ')
  writeFileSync(typ, '// stub\n')
  const env = { PATH: `${resolve(ROOT, 'tests/fixtures/bin')}:${process.env.PATH}` }
  assert.equal(importPages([typ, '--out', DIR], env).status, 0)
  const path = resolve(DIR, 'notes-pages.md')
  writeFileSync(path, readFileSync(path, 'utf8').replace('Notes for page 2.', 'Ask the room what a baseline is.'))
  assert.equal(importPages([typ, '--out', DIR], env).status, 0)
  const md = readFileSync(path, 'utf8')
  assert.match(md, /Ask the room what a baseline is\./)
  assert.match(md, /Notes for page 3\./)
})
