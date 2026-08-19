# Proxima Design System, v1.0

The design system behind my homelab console. It is dark first, built on tinted neutrals with one
accent colour, and it is meant for looking at machines at night. One stylesheet, one behaviour file,
fonts served locally, and eight sample pages that all tell the same story.

Built by Devansh Parapalli, for my own projects. The source lives at
[github.com/DevParapalli/design-system](https://github.com/DevParapalli/design-system) and all of
it is MIT licensed, see [`LICENSE`](LICENSE).

Machine readable tokens are in [`tokens.json`](tokens.json).
The portable version for restyling other repos is [`PROXIMA.md`](PROXIMA.md).

---

## File map

```text
design-system/
├── css/proxima.css          the whole system in one file
├── js/proxima.js            theme panel, background blooms, charts, save bar, scroll spy
├── fonts/                   all typefaces, woff2, OFL licensed
│   ├── outfit-variable.woff2            Outfit, variable 300 to 700
│   ├── instrument-serif-regular.woff2   Instrument Serif 400
│   ├── instrument-serif-italic.woff2    Instrument Serif 400 italic
│   ├── ibm-plex-mono-regular.woff2      IBM Plex Mono 400
│   └── ibm-plex-mono-medium.woff2       IBM Plex Mono 500
├── index.html               links to every page
├── dashboard.html           the console: numbers, chart, services table, host board
├── studio.html              two panes: edit a rule on the left, see it on the right
├── docs.html                this system with every component running
├── landing.html             the project page, dark throughout
├── article.html             long form reading
├── settings.html            forms, save bar, margin nav
├── login.html               sign in
├── 404.html                 not found, the auth register at its smallest
├── DESIGN-SYSTEM.md         this file
├── tokens.json              the same tokens in W3C format
└── PROXIMA.md               the portable kit
```

The original single file prototypes are archived in `inspiration/`, which is gitignored.

---

## The story the pages tell

Every page is the same product from a different angle. Proxima watches four machines and the
thirty three services running on them.

Machines are named after the sky, which is the scheme I use for real. Physical machines get planets
(`jupiter`, `mars`). Virtual machines get the moons of the planet they live on (`io`, `ganymede`,
`phobos`). Cloud instances get gases, with a suffix for their role (`argon` for general compute,
`kryptonane` for a stateful database, `argonene` for a CI runner that dies after every job).

Services keep their real names (`postgres`, `caddy`, `forgejo`, `immich`) so a row stays readable.

---

## Principles

Six rules the system does not break.

1. **Tinted, not grey.** Every neutral leans blue. The background is `#0A0B12`, not black. Depth
   comes from temperature rather than darkness.
2. **One bright colour.** Indigo `#8D8DF5` owns active states, primary buttons and focus rings.
   Nothing else saturated competes with it.
3. **State twice over.** Status is a tint you feel and a word you read. Never colour alone, never a
   bare label.
4. **Depth from glass.** Things lift off the page with blur and translucency. Three levels, and only
   the top one gets a shadow.
5. **Hide the detail.** A row is one line until you open it. Density is something you ask for.
6. **Texture, barely.** Five percent grain over everything, soft blooms underneath.

---

## Tokens

All tokens are CSS custom properties on `:root`, which is the dark theme. The light theme overrides
them under `html.theme-light`. Accents swap under `html.accent-teal`, `-ember` and `-lime`. Exact
values live in `tokens.json`. The property names are the bare token names below, no prefix:
`--void`, `--ink-low`, `--ch-1`. The docs page shows the variable name beside every swatch, and
clicking a swatch copies the name, since the name is what new CSS should use, never the hex.

### Neutrals

| Token | Dark | Light | Job |
| --- | --- | --- | --- |
| `--void` | `#0A0B12` | `#EDEEF6` | page background |
| `--abyss` | `#06070E` | `#E2E3EF` | the darkest ground, used on the project page |
| `--panel` | `#12141F` | `#F7F8FC` | solid panel |
| `--panel-2` | `#181B2A` | `#FFFFFF` | raised solid panel |
| `--ink-hi` | `#EFF0F8` | `#1B1D2E` | primary text |
| `--ink-mid` | `#A9ADC7` | `#4E5270` | body text |
| `--ink-low` | `#666B8A` | `#9094B0` | muted text, labels, inactive nav |
| `--hairline` | `rgba(255,255,255,.08)` | `rgba(27,29,46,.14)` | standard border |
| `--hairline-soft` | `rgba(255,255,255,.05)` | `rgba(27,29,46,.07)` | quiet divider |

Brightness carries hierarchy. Dense navigation uses the ink ramp, going from `ink-low` up to
`ink-hi`, rather than colour.

### Glass

| Level | Fill | Blur | Extra | Used for |
| --- | --- | --- | --- | --- |
| `--glass-1` | `rgba(255,255,255,.03)` | 8px | soft hairline | resting cards |
| `--glass-2` | `rgba(255,255,255,.055)` | 18px | top highlight | raised controls, inputs |
| `--glass-3` | `rgba(22,24,38,.72)` | 26px | highlight and shadow | overlays, save bar, sign in card |

Only `glass-3` casts a shadow. Everything below it floats on blur alone.

### Accent

One accent at a time, set by a class on the `html` element.

| Variant | Dark | Light | Text on top |
| --- | --- | --- | --- |
| indigo, the default | `#8D8DF5` | `#5757D9` | `#0B0B1C` or white |
| `.accent-teal` | `#5FD3C8` | `#12837C` | `#04211E` or white |
| `.accent-ember` | `#F2A566` | `#B05808` | `#2A1404` or white |
| `.accent-lime` | `#CFE763` | `#66790A` | `#1D2404` or white |

Supporting tokens are `--accent-deep` for pressed states and borders, `--accent-ink` for text on
accent, and `--accent-glow`, which is the only glow allowed anywhere. The first chart colour follows
the accent, and whichever hue it displaces flips to indigo so two series never collide.

### State

Each hue has three steps: `base` for text and dots, `fill` for the translucent background, `line`
for the border.

| Hue | Dark | Light | Means |
| --- | --- | --- | --- |
| `--mint` | `#5EDBA6` | `#0F8A5C` | fine, healthy, done |
| `--amber` | `#F5C951` | `#8F6400` | look at this soon |
| `--rose` | `#F8929F` | `#C43552` | broken, or a destructive action |
| `--sky` | `#6EC6F5` | `#1272AE` | information, in progress |

Rose is the strict one. It appears when something is genuinely broken and nowhere else. Pale steps
never become chart marks and chart colours never become pill text. Facts such as ports, sizes and
image tags wear plain mono chips, never a state colour.

### Chart marks

Dark surface: `#6A6AE8 #2FA97C #B8831F #D95C6E #3E9CD6`, with `#3A3F58` for comparison bars.
Light surface: `#5050D6 #1F8A63 #8A6200 #D23B72 #2380BC`, with `#C9CDE0`.
Furniture is `--gridline` and `--crosshair`.

Both sets were checked with an OKLab and colour vision test on their own surface. Every colour
clears 3:1 against the background, sits inside OKLCH lightness 0.48 to 0.67, holds chroma at 0.10 or
above, and keeps neighbouring pairs at least 15 apart for normal vision.

### Shape and spacing

Radius runs `--r-s 8`, `--r-m 12`, `--r-l 18` for a standard card, `--r-xl 26`, and `--r-full` for a
capsule. Anything you can tap is a capsule. Multi line surfaces such as a textarea relax to `r-m`.

Spacing is a 4px base: `--sp-1` through `--sp-7` give 4, 8, 12, 16, 24, 32 and 48.

### Type

| Face | Files | Job |
| --- | --- | --- |
| Outfit, variable 300 to 700 | `outfit-variable.woff2` | everything |
| Instrument Serif, 400 and italic | `instrument-serif-*.woff2` | one flourish per screen, either an italic word in a heading or a number that deserves weight |
| IBM Plex Mono, 400 and 500 | `ibm-plex-mono-*.woff2` | labels, hostnames, timestamps, anything a machine produced |

The scale, as classes: `.t-display` at clamp(34 to 46) weight 480, `.t-h2` at 21 weight 520,
`.t-body` at 14.5 weight 380, `.t-label` mono 11 uppercase with wide tracking, `.t-data` mono 12.5.
Body weight is 380, which the variable font makes a real weight rather than a rounding.

Eyebrows are mono, uppercase, and wrapped in parentheses. Numbers in tables and stat tiles use
`font-variant-numeric: tabular-nums`.

### Atmosphere

`#ink` is a full viewport canvas holding soft radial blooms in the accent family, blurred to 90px
above 880px and 60px below it, drifting over 46 seconds. It respects reduced motion. The bloom
positions are fractions of the canvas box rather than fixed coordinates, and the bitmap is sized from
that box on load and on every resize, so the composition keeps its shape on a tall narrow screen
instead of smearing into vertical bands.

`html.bg-flat` switches it off properly: the layer stops being painted, is taken out of the
compositing tree with `visibility: hidden`, and its drift animation is cancelled. Flat is a real
mode, not a hidden one, so nothing about the atmosphere should still be costing the device work once
it is off.

`.grain` is a fixed SVG noise overlay at 5 percent. It drops its `mix-blend-mode` below 880px and on
the light theme, which removes a full screen blend group and the banding that overlay noise showed
over a flat background. `.dots` is a masked dot grid used only in the hero of the project page.

---

## Theming

- `html.theme-light` switches to the light theme. Every component follows, with no per page work.
- `html.accent-teal`, `-ember` or `-lime` switches the accent. No class means indigo.
- `html.bg-flat` switches off the background blooms, painting and all.
- `<html data-proxima-theme="fixed-dark">` opts a page out of the light theme. The project page uses
  this because its sections are written as a dark to light to dark sequence.

Choices are kept in `localStorage` under `proxima-theme`, `proxima-accent` and `proxima-bg`, and
every page applies them in a small script in the head before first paint, so there is no flash.

---

## Layout

Three grids. Which one you want comes down to one question: are the tiles in a row about the same
height?

- **`.mosaic` with `.m-2` through `.m-12`** is a twelve column grid. Each tile declares its width and
  rows line up. Good for a band of numbers or a set of similar cards. `.m-tall` spans two rows.
- **`.cols-main` with `.stack`** gives two columns that run down the page independently, so a short
  chart above a long table leaves no hole beside it. The console page uses this.
- **`.panes` with `.pane`** splits the page in half for editing on the left and seeing the result on
  the right. The right half takes `.pane-sticky` so it stays in view while the form scrolls, and
  `.pane-preview` is the recessed well that frames the result.

Never put a tall table and a short card in the same `.mosaic` row. Grid rows match their tallest
cell, and the hole that leaves is exactly what `.cols-main` and `.stack` exist to avoid.

### Breakpoints

Six widths, each owned by a single decision. A change that does not belong to one of these does not
happen.

| Width | What changes |
| --- | --- |
| 1140 | `.settings-cols` goes single column, `.subnav` hides |
| 1100 | `.mosaic` spans halve |
| 980 | `.cols-main`, `.panes` and the marketing embed go single column |
| 880 | `.side` and `.rail` become drawers, `.navtoggle` and `.brand-sm` appear |
| 720 | `nav.top .links` becomes a dropdown panel |
| 620 | table rows restack, comparison bars narrow, frame padding tightens |

A collapsed grid column is always `minmax(0, 1fr)`, never a bare `1fr`. `1fr` means
`minmax(auto, 1fr)`, which cannot shrink below its content, and a chart or a wide table inside one
ends up pushed off the side of the screen. `.stack` and `.pane` carry `min-width: 0` for the same
reason.

Full height shells declare `100vh` and then `100dvh`, so the layout follows a mobile URL bar as it
collapses instead of leaving a seam.

---

## Components

All of these live in `css/proxima.css` and are shown working in `docs.html`, where each one
carries a copyable snippet of the minimal markup the stylesheet expects.

### Controls

- `.btn` with `-primary`, `-glass`, `-ghost` or `-danger`, plus `.btn-sm` and `.btn-block`. Always a
  capsule.
- `.input` is the pill shaped search field with a leading icon.
- `.cta-combo` fuses an input and a primary button into one capsule.
- `.fchip` is a filter chip and always carries its count, so you know how big a set is before you
  open it.
- `.seg` is a segmented control. `.toggle` is a switch with `role="switch"` and `aria-checked`.
- `.tabs` are pill tabs, used in the preview bar on the project page.

### Forms

- `.field` puts the label above and help or error text below. Adding `.invalid` pairs the rose border
  with the error message. One never appears without the other.
- Single line inputs are capsules. `.selwrap` wraps a `select` so the chevron can be themed. A
  textarea relaxes to `r-m`. Checkboxes and radios are native, tinted with `accent-color`.
- `.form-section` is a card with a header, a body and an optional footer.
- `.setrow` is the settings unit: a label and one sentence on the left, the control on the right.
- `.danger-zone` is a form section with a rose header and border.
- `.savebar` is the floating pill at the top of the page that appears when something has changed. Add
  `data-savebar="#bar-id"` to the form and `js/proxima.js` snapshots every input, toggle and
  segmented control on load, then counts the differences. Undoing an edit by hand takes the count
  back down. Discard restores the snapshot, Save takes a new one.

A page has at most one save bar, and no section inside it carries its own Save button. Two save
surfaces means working out which one owns your edit.

### Status

- `.pill` with `pill-mint`, `-sky`, `-amber`, `-rose` or `-mute`. Translucent fill, matching border,
  a dot and a word.
- `.chip-f` is a fact chip: mono, neutral, never carrying state.
- `.delta` with `.up` or `.down` for the change under a number.
- `.callout` with optional `-sky` or `-rose` is the note inside an opened row.
- `.live` is the glowing dot plus mono timestamp used in top bars.

### Feedback

- `.empty` is the panel for a set with nothing in it: one sentence and one action, centred.
- `.skel` is a skeleton bar and `.xrow-skel` a skeleton table row, shaped like the rows they stand
  in for. `.kpi-pulse` is the KPI variant that breathes until its number arrives. Both stop moving
  under `prefers-reduced-motion`.
- The modal sits on `glass-3`, the one surface that interrupts. `data-modal-open="#id"` on a button
  wires it; it reuses the drawer's focus machinery and scrim, so focus is trapped in the card,
  Escape closes, and focus returns to the opener. `data-modal-close` marks the buttons that
  dismiss it. One modal at a time.
- `Proxima.toast(word, status, detail)` shows the single toast: bottom centre, the status colour
  plus the word, gone by itself after four seconds. If it must be acted on, it is not a toast.
- `[data-tip="the fact"]` on a focusable element is the tooltip: one mono fact, a short delay,
  shown on hover and on keyboard focus alike. Never an instruction, never a control.

### Data

- `.kpi` is the stat tile: a mono label, a large tabular number, then a delta and some context.
  `.kpi-aurora` adds a soft gradient and `.kpi-serif` sets the number in the serif. At most one of
  each per screen.
- `.xtable` with `.xrow` is the expandable table. Closed, a row shows a name, a description, a few
  facts and a status pill. Open, it adds `.xdetail`, a `.riskbar`, an optional callout and
  `.xactions`. The buttons live inside the opened row, so a closed row offers exactly one action.
- `.dtable` is a plain table with mono uppercase headers and hover rows.
- `.board` with `.col` and `.pcard` is the tinted board. Each column carries a faint wash of its
  state colour so you can read the lane before reading a word. Cards stay neutral so the wash comes
  through.
- Charts: `Proxima.spark()` draws a line with an optional dotted forecast, an optional dashed
  threshold and a crosshair tooltip. It measures its host and sets a `viewBox` where one user unit is
  one CSS pixel, then redraws on resize, so stroke widths, dashes and radii are never scaled
  unevenly. Never set `preserveAspectRatio="none"` on a chart: it buys a chart that fills its box and
  costs you every mark in it. The crosshair takes pointer input, so a mouse hovers and a finger
  presses, drags and releases. `.bars` with `.brow` draws comparison bars, with `.lead` marking
  the subject. `.meter` is the segmented capsule meter. `.donut` is a plain SVG donut. Use one axis
  always. Two measures on different scales become two charts.
- Colour on an SVG mark goes through `style="stroke: var(--ch-1)"`, never a `stroke="var(--ch-1)"`
  presentation attribute. WebKit does not substitute custom properties in presentation attributes, so
  the attribute form silently paints nothing there.
- `.feed` with `.fitem` is the timestamped event list with coloured dots.

### Navigation

- `.frame` with `.rail` is the docs layout: a sticky glass rail using brightness for hierarchy.
- `.shell` with `.side`, `.topbar` and `.main` is the app layout. The sidebar holds the brand, the
  icon nav and the signed in identity. The top bar holds search, range, sync state and alerts.
- The signed in identity appears once, in the sidebar foot. The top bar carries state and actions and
  does not repeat who you are.
- `.subnav` is the sticky anchor list for the right margin of a centred page, used with `.centerwrap`
  and `.settings-cols`. It is scroll spied and hides below 1140px. It exists so a wide screen carries
  something useful instead of empty space.
- `nav.top` is the marketing nav. `.fab` is the floating theme panel.

Proxima is a fictional product, so some nav destinations are named without being built. A link
like that loses its `href`, which takes it out of the tab order, and carries
`aria-disabled="true"`, which the stylesheet mutes. Nothing on these pages looks clickable but
goes nowhere.

Below the breakpoint where a nav stops fitting, it goes off canvas rather than away. `.side` and
`.rail` become fixed drawers that slide in from the left, and `nav.top .links` becomes a dropdown
panel under the bar. A closed drawer is `visibility: hidden` rather than `display: none`, which keeps
its links out of the tab order while still allowing the panel to slide.

The toggle is one button and one attribute:

```html
<button class="navtoggle" data-nav-toggle="#app-nav" aria-label="Open navigation">…</button>
```

`data-nav-toggle` holds a selector for the panel to open. `proxima.js` wires the rest: the shared
scrim, `aria-expanded`, focus moved into the drawer and trapped there with the button kept in the
loop, Escape to close and return focus, a tap on any link inside to close, and a forced close when
the viewport goes back above the breakpoint. Add `data-nav-breakpoint="720"` when the panel collapses
somewhere other than 880, as the marketing pages do. `.navtoggle-float` is the variant for a page
with no bar to host the button, pinned top left so it never meets the `.fab` bottom right.

---

## Accessibility

Focus is always visible through a global `:focus-visible` outline in the accent colour. Interactive
components carry their ARIA state: `aria-expanded` on expandable rows, `role="switch"` with
`aria-checked` on toggles, `role="img"` and a description on charts, `aria-hidden` on decorative
canvases. Colour never carries meaning by itself, so every state colour comes with a word, an icon or
a dot. Motion sits behind `prefers-reduced-motion`. Chart colours are contrast checked on both
themes.

---

## Fonts

Outfit, Instrument Serif and IBM Plex Mono are all under the SIL Open Font License 1.1. See
[`fonts/LICENSES.md`](fonts/LICENSES.md). They are latin subsets in woff2, referenced from
`proxima.css` with relative `../fonts/` paths, so the `css/` and `fonts/` folders need to travel
together. If you would rather load them from a CDN, swap the `@font-face` block for the import shown
in `PROXIMA.md`.
