<script setup lang="ts">
// Ground and frame, below the content of every slide. The ground is the slide's
// base colour with an accent bloom at the light source. The frame is two hairlines:
// label, section and date above the top one; slide count and presenter below the
// foot one. A `source:` line sits at the bottom left of the content area.
import { useDarkMode } from '@slidev/client'
import { computed, watchEffect } from 'vue'
import { pad, usePx } from './composables/px'

const px = usePx('frame')
const kind = computed<string>(() => px.frontmatter.layout ?? (px.page.value === 1 ? 'cover' : 'claim'))
const total = px.deck.total
const sectionTitle = computed(() => kind.value === 'section' ? undefined : px.section.value?.title)

// Proxima keys its light theme on html.theme-light; Slidev toggles html.dark.
const { isDark } = useDarkMode()
watchEffect(() => {
  if (typeof document !== 'undefined')
    document.documentElement.classList.toggle('theme-light', !isDark.value)
})
</script>

<template>
  <div
    class="px px-frame"
    :data-kind="kind"
    :data-accent="px.accent.value"
    :data-tone="px.tone.value"
    :data-bloom="px.bloom.value"
    :style="{ '--px-lx': px.light.value.x, '--px-ly': px.light.value.y }"
  >
    <div class="px-ground" />
    <template v-if="kind === 'cover'">
      <span v-if="px.frontmatter.number !== undefined" class="px-cover-number num">{{ px.frontmatter.number }}</span>
      <span v-if="px.frontmatter.side" class="px-cover-side">{{ px.frontmatter.side }}</span>
    </template>
    <div class="px-frame-top">
      <span><img v-if="px.config.value.logoLeft" :src="px.config.value.logoLeft" alt=""><template v-else>{{ px.config.value.label }}</template></span>
      <span>{{ sectionTitle }}</span>
      <span><img v-if="px.config.value.logoRight" :src="px.config.value.logoRight" alt=""><template v-else>{{ px.config.value.date }}</template></span>
    </div>
    <div class="px-frame-foot">
      <span class="num">{{ pad(px.page.value) }} / {{ pad(total) }}</span>
      <span v-if="kind !== 'cover'">{{ px.config.value.presenter }}</span>
    </div>
    <span v-if="px.frontmatter.source" class="px-source">Source: {{ px.frontmatter.source }}</span>
  </div>
</template>
