# Proxima Design System

A dark-first UI system for a homelab console, built around tinted neutrals, a single accent colour, and soft glassy depth.

## What this project contains

- `css/proxima.css` — the complete design system in one stylesheet
- `js/proxima.js` — optional behavior for theme switching, background blooms, the mobile nav drawer, responsive charts with touch inspection, save bar state, and scroll spy
- `fonts/`: local OFL font files for Outfit, Instrument Serif, and IBM Plex Mono
- sample pages:
  - `index.html`
  - `dashboard.html`
  - `studio.html`
  - `docs.html`
  - `landing.html`
  - `article.html`
  - `settings.html`
  - `login.html`
- documentation files:
  - `DESIGN-SYSTEM.md` — system overview, tokens, and principles
  - `PROXIMA.md` — portable kit guidance and usage notes

## Purpose

Proxima is designed for night-friendly monitoring interfaces. It keeps visuals consistent with:

- a dark page background that is never pure black
- a single bright accent colour for states and focus
- soft translucency, blur, and minimalist shadow
- clear typed systems with neutral state treatment and monospace machine data

## Usage

### Minimal integration

Copy `css/proxima.css` and a page structure from one of the sample HTML files. If you are not including the local `fonts/` folder, remove the local `@font-face` block in `proxima.css` and use the hosted font import shown in `PROXIMA.md`.

### Full integration

Copy `css/proxima.css`, `js/proxima.js`, and the `fonts/` folder. Keep the relative `css/../fonts/` layout intact.

### Theming

The system supports:

- `html.theme-light` — light theme
- `html.accent-teal`, `html.accent-ember`, `html.accent-lime` — accent variants
- `html.bg-flat` — disable animated background blooms
- `data-proxima-theme="fixed-dark"` — force a dark presentation on pages that should not switch to light mode

### Recommended structure

Use one save bar per page and choose layout classes based on card height:

- `mosaic` for same-height tiles
- `cols-main` + `stack` for independent columns
- `panes` for editor / preview split layouts

Collapsed grid columns take `minmax(0, 1fr)` rather than a bare `1fr`, so wide children such as
charts and tables cannot push past the edge of a phone screen.

### Mobile navigation

Give the panel an id and point a toggle button at it. Everything else is wired by `proxima.js`:

```html
<button class="navtoggle" data-nav-toggle="#app-nav" aria-label="Open navigation">…</button>
<aside class="side" id="app-nav">…</aside>
```

`.side` and `.rail` become off-canvas drawers below 880px, `nav.top .links` becomes a dropdown below
720px, and `data-nav-breakpoint` overrides the default of 880. Use `.navtoggle-float` on a page with
no top bar to host the button.

## Tokens and releases

`tokens.toml` holds the values Proxima shares with Centauri, the print and slide half of the system: neutrals, accents, state colours, chart series and the type-scale rule. Typefaces and weights are not shared: Proxima is set in Outfit for screens, Centauri in the Source family for print. It is the canonical copy.

- After editing `tokens.toml`, run `uv run scripts/tokens.py`. It rewrites only the block between the `tokens:begin` and `tokens:end` markers in `css/proxima.css`. `--check` exits 1 when the stylesheet is out of date.
- Proxima and Centauri are released in lockstep, and Proxima leads. A Proxima release tag `vX.Y.Z` fixes `tokens.toml`; the Centauri release with the same version vendors it with `scripts/sync-tokens.py --ref vX.Y.Z`. The current version is 0.2.0.

## Files of note

- `DESIGN-SYSTEM.md`: design principles, token definitions, spacing and type scales
- `tokens.toml`: tokens shared with Centauri
- `scripts/tokens.py`: regenerates the shared token block in `css/proxima.css`
- `scripts/shots.py`: checks the stacked bar demo in `docs.html` across themes, accents and a 375px width, and saves screenshots
- `PROXIMA.md`: portable usage notes and recipes for buttons, cards, fields, tables, and layout
- `LICENSE`: licence for the project

## License

This project is licensed under the terms described in `LICENSE`.
