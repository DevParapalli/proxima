// Shared state for a slide: its accent, tone, bloom light source and place in the
// deck. Every layout, the frame and the ground read from here so they agree.
import { useDarkMode, useNav, useSlideContext } from '@slidev/client'
import { computed } from 'vue'

export const ACCENTS = ['indigo', 'teal', 'ember', 'lime'] as const
export type Accent = (typeof ACCENTS)[number]
export type Tone = 'dark' | 'light'

/** Slides that carry no message of their own and are not listed in a section. */
const STRUCTURAL = new Set(['cover', 'section', 'outline', 'statement', 'quote'])

/** Plain text of a markdown heading, for the outline and the section cards. */
export function plain(title?: string): string | undefined {
  return title?.replace(/[*_`~]+/g, '').replace(/<[^>]+>/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim() || undefined
}

export interface DeckConfig {
  accent?: Accent
  label?: string
  date?: string
  presenter?: string
  logoLeft?: string
  logoRight?: string
  bloom?: boolean
  light?: { x: number, y: number }
}

export interface SlideEntry {
  no: number
  kind: string
  title?: string
}

export interface Section extends SlideEntry {
  index: number
  items: SlideEntry[]
}

/** Deterministic pseudo-random number in [0.12, 0.88] for slide n and channel k. */
export function rand(n: number, k: number): number {
  const v = Math.abs(Math.sin(n * 12.9898 + k * 78.233)) * 43758.5453
  return 0.12 + 0.76 * (v - Math.floor(v))
}

/** Two-digit slide numbers, as the frame prints them. */
export function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function kindOf(no: number, frontmatter: Record<string, any>): string {
  return frontmatter.layout ?? (no === 1 ? 'cover' : 'claim')
}

/** The deck's structure, read from Slidev's slide list. */
export function useDeck() {
  const nav = useNav()
  const slides = computed<SlideEntry[]>(() => nav.slides.value.map((r) => {
    const info = r.meta.slide
    return { no: r.no, kind: kindOf(r.no, info.frontmatter), title: plain(info.frontmatter.title ?? info.title) }
  }))
  const sections = computed<Section[]>(() => {
    const all = slides.value
    const out: Section[] = []
    all.forEach((s, i) => {
      if (s.kind !== 'section') return
      const items: SlideEntry[] = []
      for (let j = i + 1; j < all.length && all[j].kind !== 'section'; j++) {
        const c = all[j]
        if (!STRUCTURAL.has(c.kind) && c.title) items.push(c)
      }
      out.push({ ...s, index: out.length + 1, items })
    })
    return out
  })
  /** The section a slide sits in: the last section slide at or before it. */
  function sectionOf(no: number): Section | undefined {
    let found: Section | undefined
    for (const s of sections.value) {
      if (s.no <= no) found = s
      else break
    }
    return found
  }
  return { slides, sections, sectionOf, total: nav.total }
}

/** Per-slide state. Call inside a layout, the frame or the ground. */
export function usePx(kind: string) {
  const { $frontmatter, $page, $slidev } = useSlideContext()
  const { isDark } = useDarkMode()
  const deck = useDeck()
  const config = computed<DeckConfig>(() => ($slidev.themeConfigs ?? {}) as DeckConfig)
  const deckAccent = computed<Accent>(() => config.value.accent ?? 'indigo')
  const accent = computed<Accent>(() => {
    if ($frontmatter.accent) return $frontmatter.accent
    // Exercises stand apart from content slides in a second accent.
    if (kind === 'exercise') return deckAccent.value === 'ember' ? 'teal' : 'ember'
    return deckAccent.value
  })
  const tone = computed<Tone>(() => $frontmatter.projection ?? (isDark.value ? 'dark' : 'light'))
  const light = computed(() => $frontmatter.light ?? config.value.light ?? { x: rand($page.value, 1), y: rand($page.value, 2) })
  const bloom = computed<boolean>(() => $frontmatter.bloom ?? config.value.bloom ?? true)
  const section = computed(() => deck.sectionOf($page.value))
  return { kind, accent, tone, light, bloom, config, section, deck, page: $page, frontmatter: $frontmatter }
}
