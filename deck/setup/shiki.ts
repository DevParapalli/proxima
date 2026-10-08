// Code highlighting from the palette in force. Colours are CSS variables, so a
// listing follows the accent and the tone of the slide it sits on, as in Centauri.
import { defineShikiSetup } from '@slidev/types'

function theme(name: string, type: 'dark' | 'light') {
  const v = (n: string) => `var(--${n})`
  return {
    name,
    type,
    colors: { 'editor.background': 'transparent', 'editor.foreground': v('ink-mid') },
    tokenColors: [
      { settings: { foreground: v('ink-mid') } },
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: v('ink-low'), fontStyle: 'italic' } },
      { scope: ['keyword', 'storage', 'storage.type', 'keyword.operator.new', 'keyword.control', 'constant.language'], settings: { foreground: v('accent') } },
      { scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: v('ch-2') } },
      { scope: ['constant.numeric', 'constant.character', 'constant.other'], settings: { foreground: v('ch-3') } },
      { scope: ['entity.name.function', 'support.function', 'meta.function-call.generic'], settings: { foreground: v('ink-hi') } },
      { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class'], settings: { foreground: v('ink-hi') } },
      { scope: ['variable', 'variable.parameter', 'meta.definition.variable'], settings: { foreground: v('ink-mid') } },
      { scope: ['entity.name.tag'], settings: { foreground: v('accent') } },
      { scope: ['entity.other.attribute-name'], settings: { foreground: v('ch-3') } },
      { scope: ['punctuation', 'meta.brace'], settings: { foreground: v('ink-low') } },
    ],
  }
}

export default defineShikiSetup(() => ({
  themes: { dark: theme('proxima-dark', 'dark') as any, light: theme('proxima-light', 'light') as any },
}))
