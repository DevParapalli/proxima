import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

export const ROOT = resolve(import.meta.dirname, '..')
export const OUT = resolve(ROOT, 'tests/out')
mkdirSync(OUT, { recursive: true })

/** Runs the Slidev CLI through pnpm and returns { status, out } with ANSI stripped. */
export function slidev(args, { timeout = 300_000 } = {}) {
  const r = spawnSync('pnpm', ['exec', 'slidev', ...args], { cwd: ROOT, encoding: 'utf8', timeout, env: { ...process.env, CI: '1' } })
  const out = `${r.stdout ?? ''}\n${r.stderr ?? ''}`.replace(/\x1B\[[0-9;]*m/g, '')
  return { status: r.status, out }
}

/** Export arguments that pick a browser when Playwright cannot find its own. */
export function exportArgs(extra = []) {
  const chrome = process.env.SLIDEV_CHROME
  return chrome && existsSync(chrome) ? [...extra, '--executable-path', chrome] : extra
}

export function pdftotext(pdf) {
  const r = spawnSync('pdftotext', ['-layout', pdf, '-'], { encoding: 'utf8' })
  if (r.status !== 0) throw new Error(`pdftotext failed: ${r.stderr}`)
  return r.stdout
}
