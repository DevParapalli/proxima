// The example builds, exports in both projections, and the frame prints what it
// should. Mirrors Centauri's tests/run.sh for decks.
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { test } from 'node:test'
import { OUT, ROOT, exportArgs, pdftotext, slidev } from './helpers.mjs'

test('example.md builds with no errors', () => {
  const r = slidev(['build', 'example.md', '--out', resolve(OUT, 'dist')])
  assert.equal(r.status, 0, r.out)
  assert.ok(existsSync(resolve(OUT, 'dist/index.html')))
  assert.doesNotMatch(r.out, /\[vite\].*error/i)
})

test('example.md exports to PDF and the frame prints label, section, count and source', () => {
  const pdf = resolve(OUT, 'example.pdf')
  const r = slidev(['export', 'example.md', '--output', pdf, ...exportArgs()])
  assert.equal(r.status, 0, r.out)
  const text = pdftotext(pdf)
  assert.match(text, /Series label/)
  assert.match(text, /Session · Year/)
  assert.match(text, /01 \/ 18/)
  assert.match(text, /18 \/ 18/)
  assert.match(text, /Section 1 of 2/)
  assert.match(text, /Section 2 of 2/)
  assert.match(text, /Source: Source line/)
  assert.match(text, /Presenter/)
  // The cover never prints the presenter beside the count.
  const cover = text.split('\f')[0]
  assert.doesNotMatch(cover, /Presenter/)
  // Section cards list the slides in the section without markdown markers.
  assert.doesNotMatch(text, /\*\*/)
})

test('the light fixture exports in light projection with the ember accent', () => {
  const pdf = resolve(OUT, 'light.pdf')
  const r = slidev(['export', 'tests/fixtures/light.md', '--output', pdf, ...exportArgs()])
  assert.equal(r.status, 0, r.out)
  const text = pdftotext(pdf)
  assert.match(text, /Light projection,\s+ember accent/)
  assert.match(text, /01 \/ 17/)
})

test('a title that ends with a full stop stops the build', () => {
  const r = slidev(['build', 'tests/fixtures/title-stop.md', '--out', resolve(OUT, 'title-stop')])
  assert.notEqual(r.status, 0)
  assert.match(r.out, /proxima: slide title ends with a full stop: "This title ends with a full stop\."/)
})

test('the titles script lists every titled slide under its section', () => {
  const r = spawnSync('node', ['scripts/titles.mjs', 'example.md'], { cwd: ROOT, encoding: 'utf8' })
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.stdout, /^1\. Section title$/m)
  assert.match(r.stdout, /^2\. Second section$/m)
  assert.match(r.stdout, /^  05  Claim slide: the title states the conclusion as a full sentence$/m)
  assert.doesNotMatch(r.stdout, /highlighted phrase/)
})

test('package.json pins the upstream workarounds', () => {
  const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'))
  assert.equal(pkg.pnpm?.overrides?.['markdown-it'], '^14.1.0')
  assert.match(readFileSync(resolve(ROOT, 'vite.config.ts'), 'utf8'), /cssMinify: false/)
})
