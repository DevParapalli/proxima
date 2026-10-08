// docs/reference.md documents every layout and component the theme ships, and no
// other, as Centauri's reference is checked against lib.typ.
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { test } from 'node:test'
import { ROOT } from './helpers.mjs'

const ref = readFileSync(resolve(ROOT, 'docs/reference.md'), 'utf8')
const documented = new Set([...ref.matchAll(/^### `([^`]+)`/gm)].map(m => m[1]))

test('every layout is documented', () => {
  const layouts = readdirSync(resolve(ROOT, 'layouts')).map(f => f.replace(/\.vue$/, ''))
  for (const l of layouts) assert.ok(documented.has(l), `layout ${l} is not documented`)
})

test('every public component is documented', () => {
  const components = readdirSync(resolve(ROOT, 'components')).map(f => f.replace(/\.vue$/, '')).filter(c => !c.startsWith('Px'))
  for (const c of components) assert.ok(documented.has(c), `component ${c} is not documented`)
})

test('the reference documents nothing that does not exist', () => {
  const names = new Set([
    ...readdirSync(resolve(ROOT, 'layouts')).map(f => f.replace(/\.vue$/, '')),
    ...readdirSync(resolve(ROOT, 'components')).map(f => f.replace(/\.vue$/, '')),
    'themeConfig', 'tokens.py', 'titles.mjs',
  ])
  for (const d of documented) assert.ok(names.has(d), `reference documents "${d}", which does not exist`)
})
