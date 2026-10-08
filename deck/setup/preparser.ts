// Build rules carried over from Centauri. A slide title MUST NOT end with a full
// stop; the build stops if one does. Statements and quotations carry a sentence as
// their body and are exempt.
import { definePreparserSetup } from '@slidev/types'

const EXEMPT = new Set(['statement', 'quote'])
const INLINE = /[*_`~]|<[^>]+>|\[([^\]]*)\]\([^)]*\)/g

function titleOf(content: string): string | undefined {
  for (const line of content.split('\n')) {
    const m = /^#\s+(.+?)\s*$/.exec(line)
    if (m) return m[1].replace(INLINE, '$1').trim()
    if (/^#{2,}\s/.test(line)) return undefined
  }
  return undefined
}

export default definePreparserSetup(() => [
  {
    name: 'proxima-title-lint',
    transformSlide(content, frontmatter) {
      if (EXEMPT.has(frontmatter.layout)) return undefined
      const title = titleOf(content)
      if (title?.endsWith('.'))
        throw new Error(`proxima: slide title ends with a full stop: "${title}"`)
      return undefined
    },
  },
])
