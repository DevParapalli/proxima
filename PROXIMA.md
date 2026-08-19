# PROXIMA.md, the portable kit

What to copy:

- **Minimum.** `css/proxima.css` and this file. Delete the `@font-face` block at the top of the CSS
  and use the hosted import below, or accept the system font fallbacks.
- **Full.** Also copy the `fonts/` folder, five woff2 files under the OFL, keeping the relative
  `css/../fonts/` layout. Add `js/proxima.js` if you want the theme panel, the background blooms,
  the charts and the save bar. Additionally, copy over the .html if you need more context in a full page view.

```css
/* use this instead of the local @font-face block if you are not copying fonts/ */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300..700&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500&display=swap');
```

---

## 1. What it looks like

A dark interface built on neutrals that lean blue. The background is `#0A0B12`, never pure black and
never flat grey. Exactly one saturated colour, indigo `#8D8DF5` by default, owns every active state,
primary button and focus ring.

Status is shown with pale pills: mint for fine, amber for look at this soon, rose for broken, sky for
information. Every pill has a word in it as well as a colour. Depth comes from translucency and blur
rather than shadows. Everything you can tap is a capsule. Outfit does all the text work, IBM Plex
Mono handles labels and machine output, and Instrument Serif appears once per screen at most. A faint
noise grain and soft colour blooms sit behind the whole page.

## 2. Rules that do not bend

1. Neutrals come from the token ramp. No `#000`, no `#fff`, no untinted grey.
2. One bright colour per app. If a second saturated colour sits next to the accent, one of them is
   wrong.
3. Rose means broken or destructive. Never use it for emphasis, for a badge, or for a big number.
4. State colour always comes with a word, an icon or a dot. Facts such as ports, sizes and IDs use
   the neutral mono chip instead.
5. Pale state colours never become chart marks, and chart colours never become pill text.
6. Tappable means capsule. Cards are 18px. Textareas and inset panels are 12px.
7. Shadows only on the top layer: modals, popovers, the floating panel. Everything else uses blur and
   a hairline border.
8. The serif appears once per screen.
9. Charts get one axis, thin marks and direct labels. A forecast is the same line continued as dots.
10. Dense rows stay one line until opened, and their buttons live inside the opened row.
11. Never put a tall table and a short card in the same grid row. Use independent columns instead.
12. The signed in identity appears once per screen, in the sidebar foot.
13. A long form page gets one save bar, not a save button per section.

## 3. Tokens

Set on `:root` for dark. The light theme flips them under `html.theme-light` and accents swap under
`html.accent-teal`, `-ember` or `-lime`. Everything is defined in `proxima.css`, with full values in
`tokens.json`.

```text
SURFACES   --void #0A0B12 background · --panel #12141F · --panel-2 #181B2A
           --glass-1 .03 blur8 · --glass-2 .055 blur18 · --glass-3 .72 blur26 plus shadow
           --hairline rgba(255,255,255,.08) · --hairline-soft .05 · --well for inset areas
TEXT       --ink-hi #EFF0F8 · --ink-mid #A9ADC7 · --ink-low #666B8A   brightness is hierarchy
ACCENT     --accent #8D8DF5 · --accent-deep #5757D9 · --accent-ink for text on accent · --accent-glow
STATE      --mint, --amber, --rose, --sky, each with -fill and -line
CHARTS     --ch-1 to --ch-5 · --ch-neutral for comparison · --gridline · --crosshair
SHAPE      --r-s 8 · --r-m 12 · --r-l 18 · --r-xl 26 · --r-full 999
TYPE       --font-ui Outfit, body weight 380 · --font-serif Instrument Serif
           --font-mono IBM Plex Mono
```

## 4. Recipes

Every class below already exists in `proxima.css`. Copy the structure as it is. The same
recipes sit under each running component in `docs.html` with a copy button, and every colour
swatch there copies its custom property name.

**Buttons and controls**

```html
<button class="btn btn-primary">New alert rule</button>
<button class="btn btn-glass">Export</button>
<button class="btn btn-ghost">Cancel</button>
<button class="btn btn-danger">Revoke token</button>

<label class="input"><svg><!-- search icon --></svg><input placeholder="Search"></label>

<div class="seg" role="group"><button class="on">Board</button><button>List</button></div>
<button class="toggle on" role="switch" aria-checked="true"></button>
<button class="fchip on">Healthy <b>29</b></button>   <!-- filter chips always show the count -->
```

**Status**

```html
<span class="pill pill-mint"><i class="dot"></i>Healthy</span>
<span class="pill pill-amber"><i class="dot"></i>Degraded</span>
<span class="pill pill-rose"><i class="dot"></i>Down</span>
<span class="chip-f">5432</span>                 <!-- facts stay mono and neutral -->
<span class="delta up">+8.2%</span>
<div class="callout"><span>!</span><span><b>Heads up.</b> <span>Detail goes here.</span></span></div>
```

**A number**

```html
<div class="kpi">
  <div class="k-label">Services up</div>
  <div class="k-val">31 / 33</div>
  <div class="k-foot"><span class="delta down">2 down</span><span>across 4 hosts</span></div>
</div>
<!-- kpi-serif for a number with weight, kpi-aurora for a gradient. One of each per screen at most -->
```

**Card, field, setting row**

```html
<div class="card">…</div>

<div class="field">
  <label for="x">Host name</label>
  <input type="text" id="x">
  <span class="help">Shown everywhere this machine appears.</span>
</div>
<span class="selwrap"><select>…</select></span>

<div class="setrow">
  <div class="info"><b>Live updates</b><span>Stream readings in as they arrive.</span></div>
  <div class="ctl"><button class="toggle on" role="switch" aria-checked="true"></button></div>
</div>
```

**Expandable row**

```html
<div class="xtable">
  <header><h3>Services</h3><span class="pill pill-mute">31 / 33 up</span></header>
  <div class="xrow">
    <button aria-expanded="false" aria-controls="b1">
      <span class="id">postgres</span>
      <span class="desc">Primary database<small>kryptonane</small></span>
      <span class="chips"><span class="chip-f">5432</span><span class="pill pill-amber">Degraded</span></span>
      <span class="chev">▾</span>
    </button>
    <div class="xbody" id="b1">
      <div class="xdetail"><div class="f"><label>Image</label><div>postgres:16.4</div></div>…</div>
      <div class="xactions"><button class="btn btn-glass">View logs</button></div>
    </div>
  </div>
</div>
```

**Layout, chosen by asking whether the tiles are about the same height**

```html
<!-- yes, similar heights: twelve column mosaic, rows line up -->
<div class="mosaic">
  <div class="kpi m-3">…</div><div class="kpi m-3">…</div><div class="card m-6">…</div>
</div>

<!-- no, a short chart next to a long table: columns that flow on their own -->
<div class="cols-main">
  <div class="stack"><div class="card">chart</div><div class="xtable">…</div></div>
  <div class="stack"><div class="card">donut</div><div class="card">events</div></div>
</div>

<!-- edit on the left, result on the right -->
<div class="panes">
  <form class="pane" data-savebar="#savebar">…</form>
  <div class="pane pane-sticky"><div class="pane-preview">…</div></div>
</div>
```

**Save bar, one per page**

```html
<div class="savebar" id="savebar" role="status" aria-live="polite">
  <span class="sdot"></span>
  <span class="n"><b>0</b> unsaved changes</span>
  <button class="btn btn-ghost btn-sm" type="button" data-discard>Discard</button>
  <button class="btn btn-primary btn-sm" type="button" data-save>Save</button>
</div>
<form data-savebar="#savebar">…</form>
<!-- proxima.js snapshots every field on load and counts what differs from it -->
```

**App shell**

```html
<div class="shell">
  <aside class="side">
    <a class="brand" href="/"><span class="orb"></span><span>Name<small>Console</small></span></a>
    <span class="rail-label">Section</span>
    <nav><a class="on"><svg/>Overview</a><a><svg/>Alerts<span class="badge">2</span></a></nav>
    <div class="foot"><span class="av">DP</span><div class="who"><b>Name</b><span>role</span></div></div>
  </aside>
  <div>
    <div class="topbar"><label class="input">…</label>
      <div class="right"><span class="live"><i></i>synced</span></div></div>
    <main class="main">
      <div class="page-head"><div><h1>Good evening, <em class="serif-em">Devansh.</em></h1>
        <div class="when">SAT 26 JUL · 18:42</div></div>
        <div class="actions"><button class="btn btn-primary">New alert rule</button></div></div>
    </main>
  </div>
</div>
```

**Type moments**

```html
<div class="eyebrow">( <b>SECTION</b> · CONTEXT )</div>      <!-- mono, caps, in brackets -->
<h1>Everything is <em class="serif-em">fine.</em></h1>       <!-- the serif, once per screen -->
<span class="t-label">( REQUESTS PER HOUR )</span>
<span class="t-data">ganymede · vm on jupiter</span>
```

## 5. How to adapt an existing app

Work through these in order.

1. **Load the stylesheet** globally. Remove any competing reset or framework from the pages you are
   touching, or load Proxima last. Add the small head script if you want theme choices to persist.
2. **Map the surfaces.** The app background becomes `var(--void)`. Cards and panels become `.card`,
   or `background: var(--glass-1)` with a `1px solid var(--hairline)` border at `var(--r-l)`. Remove
   every existing box shadow except on modals and popovers, which become `--glass-3` with a shadow.
3. **Map the text.** Headings take `--ink-hi`, body takes `--ink-mid`, secondary text and labels take
   `--ink-low`. Labels, IDs and timestamps switch to `--font-mono` at 10.5 to 12.5px. Set the body to
   `font: 380 14.5px/1.6 var(--font-ui)`.
4. **Map the accent.** Find the app's current brand colour and replace every use with the accent
   tokens. Primary buttons become `.btn btn-primary`. If the brand needs its own hue, redefine
   `--accent`, `--accent-deep`, `--accent-ink` and `--accent-glow` once at the root. Do not scatter
   the hex around.
5. **Map the state.** Success, warning, error and info become `.pill` variants. Then audit every red
   in the app. If it is not a genuine failure or a destructive action, it loses its colour.
6. **Round the controls.** Buttons, inputs, chips, tabs and toggles become capsules. Tables and
   textareas keep the softer 12px corner.
7. **Redo the data views.** Stat blocks become `.kpi`. A simple table becomes `.dtable`. A dense one
   becomes the `.xrow` pattern. Charts get recoloured to `--ch-1` through `--ch-5`, comparison bars
   to `--ch-neutral` with the subject on `--ch-1`, and any second y axis gets split into two charts.
8. **Add the atmosphere if it suits.** A `<canvas id="ink">`, a `.grain` div and `proxima.js` give
   the full effect. Skip both in a dense embedded context. The system works flat.
9. **Check your work.**
   - no pure black, pure white or untinted grey left in what you touched
   - exactly one saturated colour visible per screen
   - every state colour paired with a word, icon or dot
   - everything tappable is a capsule, and only overlays have shadows
   - the serif appears once at most, and eyebrows are mono caps
   - the focus ring works on every interactive element
   - it still reads correctly with `theme-light` on the `html` element
   - no grid row pairs a tall table with a short card, the identity appears once, one save bar

## 6. Writing new CSS

Use the tokens, never a raw hex. Match the file's habits: one line per rule, a token for every
colour, radius and font, hover states that shift brightness or background rather than scale, and
transitions of 0.2s or less on `background`, `color`, `filter` and `transform` only.

A new state colour follows the same three step pattern as the others: a base for text, a fill at
roughly 12 percent alpha, and a border line at roughly 28 percent.
