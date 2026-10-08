<script setup lang="ts">
// Section divider on the accent ground. "Section n of m", the title set large and
// light, and up to `preview` glass cards listing the slides in the section.
import { computed } from 'vue'
import { pad, usePx } from '../composables/px'

const props = withDefaults(defineProps<{ preview?: number }>(), { preview: 4 })
const px = usePx('section')
const me = computed(() => px.deck.sections.value.find(s => s.no === px.page.value))
const shown = computed(() => (me.value?.items ?? []).slice(0, props.preview))
</script>

<template>
  <PxSlide kind="section">
    <div class="px-section-body">
      <span v-if="me" class="px-section-place">Section {{ me.index }} of {{ px.deck.sections.value.length }}</span>
      <slot />
    </div>
    <div v-if="shown.length" class="px-section-cards">
      <div v-for="(it, i) in shown" :key="it.no" class="px-glass">
        <span class="px-section-card-no num">{{ pad(i + 1) }}</span>
        <span class="px-section-card-title">{{ it.title }}</span>
      </div>
    </div>
  </PxSlide>
</template>
