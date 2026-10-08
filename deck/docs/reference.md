# Proxima deck reference

Reference for `slidev-theme-proxima`, the Slidev theme that builds Centauri's decks for the screen. It covers every layout, component, option and script the theme ships. The test suite checks that every layout and component file has an entry here, and that nothing is documented that does not exist.

Terms: a *deck* is one markdown file; a *slide* is one `---`-separated block; the *headmatter* is the first frontmatter block, which configures the deck; a slide's *frontmatter* configures that slide. The *title* of a slide is its first heading. The *canvas* is 980 × 551 px (16:9), scaled to the screen.

## Contents

1. [Setup](#1-setup)
2. [Build rules](#2-build-rules)
3. [Deck options](#3-deck-options)
4. [Slide options](#4-slide-options)
5. [Layouts](#5-layouts)
6. [Components](#6-components)
7. [Scripts](#7-scripts)

## 1. Setup

### Project

A deck project is a directory with `package.json`, `vite.config.ts` and markdown files. `package.json` MUST pin `markdown-it` to 14 with a pnpm override and `vite.config.ts` MUST set `build.cssMinify` to `false`; both work around Slidev 53.0.0 and are harmless once upstream fixes land.

```json
{
  "private": true,
  "type": "module",
  "devDependencies": { "@slidev/cli": "^53.0.0", "playwright-chromium": "^1.64.0" },
  "pnpm": { "overrides": { "markdown-it": "^14.1.0" } }
}
```

```ts
export default { build: { cssMinify: false } }
```

### Theme

The headmatter names the theme by path, relative to the markdown file:

```md
---
theme: ../proxima/deck
---
```

### Fonts

The theme serves Outfit, Instrument Serif and IBM Plex Mono from Proxima's `fonts/` and sets `fonts.provider` to `none`. A deck SHOULD NOT set `fonts`.

### Commands

| Command | Output |
|---|---|
| `slidev deck.md` | Dev server. `/presenter` shows notes and the next slide; `/overview` shows every slide. |
| `slidev build deck.md` | Static site in `dist/`. |
| `slidev export deck.md` | PDF. `--format pptx`, `png` or `md`; `--with-toc` adds a PDF outline; `--executable-path` names a browser. |
| `node scripts/titles.mjs deck.md` | The title-only outline. |

## 2. Build rules

| Rule | Effect |
|---|---|
| A title ends with a full stop | The build stops with `proxima: slide title ends with a full stop: "…"`. Layouts `statement` and `quote` are exempt. |
| A slide's content runs past the canvas | In the dev server the slide shows a rose pill reading "Overflows the slide". Exports do not stop; cut the content or split the slide. |
| `styles/tokens.css` differs from `tokens.toml` | `scripts/tokens.py --check` exits 1. |

## 3. Deck options

### `themeConfig`

Set in the headmatter. Every key is optional.

| Key | Values | Effect |
|---|---|---|
| `accent` | `indigo` (default), `teal`, `ember`, `lime` | The deck accent. |
| `label` | string | Top left of every slide, above the top hairline. |
| `date` | string | Top right of every slide. |
| `presenter` | string | Bottom right of every slide except the cover. |
| `logoLeft`, `logoRight` | image URL | Replaces `label` or `date` with an image 20 px high. |
| `light` | `{ x: 0..1, y: 0..1 }` | The bloom's light source on every slide. `x: 1` is the right edge, `y: 1` the bottom. Without it each slide takes a fixed pseudo-random point from its number, so builds are reproducible. |
| `bloom` | `true` (default), `false` | `false` removes the bloom from every slide. |

Projection is the Slidev `colorSchema` option: the theme defaults it to `dark`; a deck sets `colorSchema: light` for a lit room. Slidev's own `aspectRatio` and `canvasWidth` are honoured; the text column is 694 px, so a 4:3 canvas keeps the same measure with narrower outer margins. Other Slidev headmatter options (`title`, `transition`, `drawings`, `download`, `export`) apply as Slidev documents them.

## 4. Slide options

Every layout accepts these frontmatter keys. They apply to that slide only; a slide without them uses the deck's values.

| Key | Values | Effect |
|---|---|---|
| `accent` | an accent name | The slide's accent. |
| `projection` | `dark`, `light` | The slide's tone. |
| `light` | `{ x, y }` | The slide's light source. |
| `bloom` | boolean | Bloom on or off. |
| `source` | string | Printed as `Source: …` at the bottom left of the content area. |

Slidev's own per-slide keys (`clicks`, `transition`, `hideInToc`, `title`, `src`, `disabled`) apply as documented. `title` overrides the heading in the outline and section cards.

## 5. Layouts

Every layout takes its title from the first `#` heading in the body. The frame (label, section title, date, slide count, presenter) is drawn on every slide.

### `cover`

The opening slide. The `#` heading is the title, set large and light; the paragraph after it is the subtitle. Frontmatter:

| Key | Effect |
|---|---|
| `facts` | A list of strings set as chips beneath the subtitle. |
| `number` | A numeral set very large in a tone of the ground, cropped at the bottom right. |
| `side` | Text that runs up the left edge, for a classification such as "Internal". |

```md
---
layout: cover
number: 1
side: Internal
facts: [60 min, Recorded, Class 1 of 15]
---

# What AI actually is

Four eras and a first call.
```

### `default`

An alias of `claim`. Slides without `layout:` use it.

### `claim`

The default content slide: a sentence title stating the takeaway, then one exhibit. The body is markdown; `Cols`, `Tile` and `Stats` arrange it.

```md
# A model learns a mapping from examples, so the examples decide what it can learn

<Cols widths="1.1fr 1fr">
<Col>

Each old ticket is one example. The **features** are what the model gets to look at.

</Col>
<Col>
<Tile>

**Label** cw-device

</Tile>
</Col>
</Cols>
```

### `exhibit`

One chart or diagram. The title interprets; the exhibit shows data only and is centred in the space the title leaves. Takes `source`.

```md
---
layout: exhibit
source: Measured on 600 held-out tickets
---

# Always guessing the biggest queue gets 9%; a simple model gets 90%

<ColumnsChart :height="203" :items="[['Always access-request', 9, '9%'], ['TF-IDF + logistic regression', 90, '90%']]" />
```

### `statement`

One phrase at display size, set light beside the emphasis line. The `#` heading is the phrase; a paragraph after it is the line beneath. Exempt from the full-stop rule. `**strong**` marks the words that matter.

```md
---
layout: statement
---

# If a model can't beat the **baseline**, it doesn't ship.

Measured on held-out tickets, not the training set.
```

### `quote`

A quotation in the serif beside the emphasis line. The body is the quotation; `attribution` is set beneath it.

```md
---
layout: quote
attribution: Michael Alley
---

Audiences understood sentence-headline slides better than topic-and-bullet slides.
```

### `explain`

Terms and explanations in rows divided by hairlines. The body is the title and a two-column markdown table; the header row is the first term. Use sparingly. Takes `source`, and `dense: true` for the small size when a list runs past five terms.

```md
---
layout: explain
---

# Precision and recall ask two different questions

| Precision | Of the tickets it sent to payroll, how many really were payroll? |
|---|---|
| Recall | Of the real payroll mismatches, how many did it send there? |
```

### `compare`

Two options on a shared baseline. `::left::` and `::right::` open the sides; the first `##` heading in a side is its name. `pick` (`left` or `right`) sets the emphasis on one side and dims the other. Takes `source`.

```md
---
layout: compare
pick: left
---

# Classical ML beats an LLM when the input is structured and the volume is high

::left::

## Classical ML

- Fractions of a cent per million predictions

::right::

## LLM

- Cost per call, every call
```

### `split`

A deep accent panel on the left carrying the title and a line beneath it; the ordered list on the right as numbered tiles. In each item the first `**strong**` run is the heading and the rest is the body.

```md
---
layout: split
---

# Hold back a test set, like an exam you haven't seen

Split before you look at anything.

1. **Train on most of it** 80% of the tickets.
2. **Test on the rest** 20% it never saw.
```

### `display`

One word or short phrase scaled to fill the column. The `#` heading is a small title at the top left, the paragraph after it a line beneath, and the `##` heading is the word.

```md
---
layout: display
---

# The word for today

If a model can't beat this, it doesn't ship

## Baseline
```

### `page`

A page laid out elsewhere, written by [`import-pages.mjs`](#import-pagesmjs) from a Centauri document or a PDF, or set by hand. `image` is the page, served from the deck's `public/` directory. The page fills the canvas and draws no frame or bloom, since a Centauri page carries its own; `chrome: true` sets it inside Proxima's frame instead, for a document page presented with the deck's label, count and presenter. `fit` is `contain` (default) or `cover`. `kind:` records the slide's archetype (`cover`, `section`, `claim` and so on) so the frame, the outline and the titles script treat it as that kind; `title:` names it. A `page` slide MAY sit among native slides in one deck.

```md
---
layout: page
image: /class03-pages/07.svg
kind: section
title: Measuring it honestly
---

<!--
Speaker notes for the page.
-->
```

### `outline`

Generated from the section slides: one tile per section with its slide count. The body carries the title. `current` (1-based) highlights one section and sets the others back.

```md
---
layout: outline
current: 1
---

# What this session covers
```

### `section`

Section divider on the accent ground. The `#` heading is the title, the paragraph after it the subtitle. `Section n of m` is computed. `preview` (default 4, `0` for none) sets how many glass cards list the slides in the section; statements and quotations are not listed.

```md
---
layout: section
accent: teal
---

# Measuring it honestly

Most bad models look great on the data they were trained on.
```

### `table`

A grid of numbers or text. The body is the title and a markdown table with a header row. Numbers are right-aligned after the first column; `align: left` left-aligns every column. Takes `source`, and `dense: true` for the small size on a long table.

```md
---
layout: table
source: Test set
---

# The confusion matrix is four counts

|  | Predicted payroll | Predicted other |
|---|---|---|
| Actually payroll | 23 · caught | 2 · missed |
```

### `code`

A listing of at most 15 lines. `file` is set in the monospace face above the block. Slidev's line highlighting (`{2,3}` after the language) sets those lines on a band and dims the rest; the code theme follows the slide's accent and tone. Takes `source`.

````md
---
layout: code
file: code/class03/classify.py
---

# Split first, and keep the queue mix the same on both sides

```python {2}
df = tickets()
train, test = train_test_split(df, test_size=0.2, stratify=df.queue)
```
````

### `steps`

A numbered sequence from the ordered list in the body, set in equal columns. `current` (1-based, at most 8) emphasises one step and sets the others back. Takes `source`.

```md
---
layout: steps
current: 3
---

# Building a classical model always follows the same six steps

1. Collect labelled history
2. Split before looking
3. Score the baseline
```

### `exercise`

A training exercise: the body is the title and the task; `::output::` opens the expected output; `minutes` is set large on the right. The slide takes the deck accent's partner (`teal` for an `ember` deck, `ember` otherwise) unless `accent:` is set.

```md
---
layout: exercise
minutes: 10
---

# Find the weakest queue

Run the classifier and read the report from the worst queue up.

::output::

The queue name and its recall.
```

### `appendix`

Dense evidence behind the main argument. The title is set at the h5 size and the body at the small size. Takes `source`.

### `close`

The closing slide: the title, next actions as an ordered list, and `contact` at the bottom left. Not "Questions?" or "Thank you".

```md
---
layout: close
contact: Questions after class: the course channel.
---

# What to do next

1. Run the classifier on your machine.
2. Change the split to time-based.
```

## 6. Components

Components are used inside a slide body. Markdown inside a component MUST be separated from the tags by blank lines.

### `Cols`

Columns with a shared gutter. `widths` is a CSS grid track list such as `"1.2fr 1fr"`; without it every column is equal. `gutter` (default `29px`) sets the gap. Children are `Col` blocks.

### `Col`

One column of `Cols`.

### `Tile`

A tonal card, one or two steps off the ground in the accent ramp.

### `Stats`

Stacked stat tiles. Children are `Stat` elements.

### `Stat`

One stat tile: `label` on the left, `value` large and light on the right.

```md
<Stats>
  <Stat value="3000" label="tickets" />
  <Stat value="98.9%" label="accuracy of never P1" />
</Stats>
```

### `Metric`

A number with its label and an optional `note`, for use inside any slide.

```md
<Metric value="31 / 33" label="services up" note="across 4 hosts" />
```

### `BarsChart`

Horizontal bars with the value in a pill at the end of each bar. `items` is a list of `[label, value]` or `[label, value, display]`. A bar is never narrower than 69 px, so its pill fits; a very small value reads slightly longer than its true length, and the pill carries the exact figure. Tones alternate within the accent ramp; colour encodes series, not emphasis.

```md
<BarsChart :items="[['Category A', 65], ['Category B', 42, '42 h']]" />
```

### `ColumnsChart`

Rising columns with the value inside the top and the label in a pill at the base. `items` as for `BarsChart`; `height` (default 260) is the tallest column in px.

```md
<ColumnsChart :height="203" :items="[['Rules', 60, '60%'], ['Model', 90, '90%']]" />
```

## 7. Scripts

### `tokens.py`

`uv run deck/scripts/tokens.py` writes `styles/tokens.css` from `tokens.toml`: the shared neutrals, state colours, chart series and accents as attribute selectors on the slide wrapper, so a slide can take another accent or projection. `--check` exits 1 when the file is out of date.

### `import-pages.mjs`

```sh
node scripts/import-pages.mjs decks/class03.typ --out decks -- --root . --input projection=light
node scripts/import-pages.mjs report.pdf --chrome
```

Presents a Centauri document, or any PDF, through the deck. Every page becomes a `page` slide, so the result has the presenter view, notes, overview, drawing and export over pages laid out elsewhere. Output goes beside the input, or under `--out`: `<name>-pages.md`, the deck, and `public/<name>-pages/NN.svg`, the pages.

- A `.typ` input is compiled with `typst compile --format svg`, one vector page each, and its titles, kinds and sections are read with `typst query` from the `<centauri-slide>` metadata Centauri writes. Arguments after `--` are passed to both typst calls. Requires `typst` on the path.
- A `.pdf` input is rendered with `pdftocairo -svg`, and each page's title is the text block set largest on the page, read with `pdftotext -bbox-layout`. Requires poppler.
- `--chrome` sets every page inside Proxima's frame with the input's name as the label.
- Re-running regenerates the pages and the frontmatter and keeps the speaker notes written in the markdown.

### `titles.mjs`

`node scripts/titles.mjs deck.md` prints every slide title in order, grouped by section, with slide numbers: Centauri's `mode=titles`, for reviewing the argument before the content is written. Statements and quotations are omitted.
