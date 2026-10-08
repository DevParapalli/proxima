# Proxima deck

`slidev-theme-proxima` is the projected half of the deck system: Centauri's deck language, set on Proxima's tokens and fonts, as a [Slidev](https://sli.dev) theme. Centauri builds the same decks for print with Typst; this theme builds them for a browser, a projector and PDF export, with Slidev's presenter mode, speaker notes, click steps, code highlighting and diagrams.

The complete reference for every layout, component and option is [`docs/reference.md`](docs/reference.md). It is written to serve as reference material for people and for AI agents generating deck source. Deck design rationale is in Centauri's [`docs/deck-board.md`](https://github.com/DevParapalli/centauri/blob/main/docs/deck-board.md); the archetypes, the frame and the build rules are the same.

## Releases

The theme reads `css/proxima.css`, `fonts/` and `tokens.toml` from this repository by relative path, so it is in lockstep with Proxima without a sync step. The version in `package.json` follows Proxima's. It is not published to npm yet: use it from a checkout.

`styles/tokens.css` MUST NOT be edited by hand. It is written by:

```sh
uv run deck/scripts/tokens.py           # from the repository root
uv run deck/scripts/tokens.py --check   # exits 1 when the file is out of date
```

## Requirements

- Node 22.12 or later and pnpm.
- Slidev 53 or later. Two upstream breakages in Slidev 53.0.0 have workarounds that ship here and MUST be repeated in a deck's own project: a pnpm override pinning `markdown-it` to 14, and `build.cssMinify: false` in `vite.config.ts`. See [Setup](#setup).
- For PDF, PPTX and PNG export: `playwright-chromium`. When Playwright cannot find its own browser, pass `--executable-path`.
- Fonts: Outfit, Instrument Serif and IBM Plex Mono, served from Proxima's `fonts/`. No web font provider is used.

## Setup

A deck is a directory with a `package.json`, a `vite.config.ts` and one markdown file per deck.

```json
{
  "private": true,
  "type": "module",
  "scripts": { "dev": "slidev deck.md", "build": "slidev build deck.md", "export": "slidev export deck.md" },
  "devDependencies": { "@slidev/cli": "^53.0.0", "playwright-chromium": "^1.64.0" },
  "pnpm": { "overrides": { "markdown-it": "^14.1.0" } }
}
```

```ts
// vite.config.ts
export default { build: { cssMinify: false } }
```

The deck names the theme by path, relative to the markdown file:

```md
---
theme: ../proxima/deck
title: Class 1
themeConfig:
  accent: ember
  label: Class 1
  date: September 2026
  presenter: Platform team
layout: cover
number: 1
facts: [60 min, Recorded]
---

# What AI actually is

Four eras and a first call.

---
layout: section
---

# Where the money goes

---

# One ticket can be routed four ways, each with its own cost

- Rules, classical ML, deep learning, generative AI
```

```sh
pnpm slidev deck.md                     # dev server with presenter mode at /presenter
pnpm slidev build deck.md               # static site
pnpm slidev export deck.md              # PDF
pnpm slidev export deck.md --format pptx
node ../proxima/deck/scripts/titles.mjs deck.md   # the title-only outline
```

## Deck options

`themeConfig` in the headmatter takes the arguments `centauri(kind: "deck")` takes:

| Key | Default | Effect |
|---|---|---|
| `accent` | `indigo` | Deck accent: `indigo`, `teal`, `ember` or `lime`. Slides without `accent:` use it. |
| `label` | none | Top left of every slide, such as the series name. |
| `date` | none | Top right of every slide. |
| `presenter` | none | Bottom right of every slide except the cover. |
| `logoLeft`, `logoRight` | none | Image URLs that replace `label` or `date` in the top corners. |
| `light` | per slide | Bloom light source `{ x: 0..1, y: 0..1 }` for every slide. Without it each slide takes a fixed point from its number, so builds are reproducible. |
| `bloom` | `true` | `false` removes the accent bloom. |

Projection is Slidev's colour scheme. The theme defaults to `colorSchema: dark`; set `colorSchema: light` in the headmatter for a lit room. Dark content slides sit on Proxima's near-black with an accent bloom and section slides on the accent's 600 step; light content slides are off-white and section slides sit on the accent's 800 step. The accent ramp is built in OKLCH from the light accent, as Centauri builds it.

Every slide accepts `accent:`, `projection:` (`dark` or `light`), `light:`, `bloom:` and `source:` in its frontmatter. They apply to that slide only.

## Slides

The first heading of a slide is its title. Titles MUST be in sentence case and MUST NOT end with a full stop: the build stops if one does. Statements and quotations are exempt. The body size is fixed for the whole deck; in the dev server a slide whose content runs past the canvas shows a rose warning, since a browser cannot stop a build on layout.

| Layout | Use |
|---|---|
| `cover` | Title set large and light, subtitle, `facts` chips, optional large `number` cropped at the bottom right, `side` up the left edge. |
| `outline` | One tile per section with its slide count; `current` highlights one. |
| `section` | Accent ground. `Section n of m`, the title, and up to `preview` glass cards listing the slides in the section. |
| `claim` (default) | A sentence title stating the takeaway, then one exhibit. |
| `exhibit` | One chart or diagram, centred; the title interprets, the exhibit shows data only. |
| `statement` | One phrase at display size beside the emphasis line, with an optional line under it. |
| `quote` | Quotation in the serif beside the emphasis line, with `attribution`. |
| `explain` | A two-column table set as terms and explanations in rows divided by hairlines; `dense` for a long list. |
| `compare` | `::left::` and `::right::` on a shared baseline; `pick` marks the favoured side. |
| `split` | Accent panel carrying the title on the left, the ordered list as numbered tiles on the right. |
| `display` | One word (the `##` heading) scaled to fill the column. |
| `table` | A markdown table with numbers right-aligned after the first column; `align: left` for text, `dense` for a long table. |
| `code` | A listing with `file`; Slidev's `{2,3}` line highlighting sets the lines on a band. |
| `steps` | The ordered list as a numbered sequence; `current` emphasises one step. |
| `exercise` | Task, `minutes` and an `::output::` slot, in the deck accent's partner. |
| `appendix` | Dense evidence at the small size. |
| `close` | Next actions as an ordered list, with `contact`. |

Components for use inside a slide: `Cols` and `Col`, `Tile`, `Stats` and `Stat`, `Metric`, `BarsChart`, `ColumnsChart`. `**strong**` is the highlight; speaker notes are Slidev's `<!-- -->` comment at the end of a slide.

## Output

| Centauri | Here |
|---|---|
| `mode=slides` | `slidev build`, `slidev export` |
| `mode=titles` | `node scripts/titles.mjs deck.md` |
| `notes=true` | presenter mode at `/presenter`, or `slidev export --with-toc` for the PDF outline |
| `mode=handout` | not provided; build the handout with Centauri |

## Tests

`tests/run.sh`, run from `deck/`, MUST pass before a release. It requires pnpm, uv, `pdftotext` and a Chromium that `playwright-chromium` can launch (set `SLIDEV_CHROME` to a browser executable otherwise). It checks that the generated tokens are current; that `example.md` builds and exports in both projections with the frame, section cards and source lines printing the expected text; that a title ending in a full stop stops the build; that the titles script lists the deck's argument; and that `docs/reference.md` documents every layout and component, and no other.

## Licence

MIT, with Proxima. Fonts are OFL-1.1 under their own licence files in `fonts/`.
