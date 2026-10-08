// Slidev 53.0.0 with Vite 8 fails `slidev build` when lightningcss minifies the
// client stylesheet (a nested `.dark` rule trips the minifier). Dev and export are
// unaffected. Decks that use this theme need the same setting in their own
// vite.config.ts until the upstream fix lands.
export default {
  build: { cssMinify: false },
}
