<script setup lang="ts">
// Generated outline: one tile per section slide with its slide count. `current`
// highlights one section (1-based) and sets the others back.
import { computed } from 'vue'
import { pad, usePx } from '../composables/px'

const props = defineProps<{ current?: number }>()
const px = usePx('outline')
const sections = computed(() => px.deck.sections.value)
const per = computed(() => Math.min(4, Math.max(sections.value.length, 1)))
</script>

<template>
  <PxSlide kind="outline">
    <slot />
    <div class="px-outline-grid" :style="{ gridTemplateColumns: `repeat(${per}, 1fr)` }">
      <div
        v-for="s in sections"
        :key="s.no"
        class="px-outline-tile"
        :class="props.current == null || props.current === s.index ? 'px-tile' : 'px-outline-dim'"
      >
        <span class="px-outline-no num">{{ pad(s.index) }}</span>
        <span class="px-outline-title">{{ s.title }}</span>
        <span class="px-outline-count">{{ s.items.length }} slides</span>
      </div>
    </div>
  </PxSlide>
</template>
