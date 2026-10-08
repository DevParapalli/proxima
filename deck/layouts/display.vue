<script setup lang="ts">
// One word or short phrase scaled to fill the column, with a small title at the top
// left. The body carries the title as `#`, an optional line as a paragraph, and the
// word as `##`.
import { onSlideEnter } from '@slidev/client'
import { nextTick, onMounted, ref } from 'vue'

const root = ref<HTMLElement>()

function fit() {
  const box = root.value
  const word = box?.querySelector<HTMLElement>('h2')
  if (!box || !word) return
  word.style.fontSize = '100px'
  const scale = Math.min(box.clientWidth / word.scrollWidth, (box.clientHeight * 0.9) / word.scrollHeight)
  word.style.fontSize = `${Math.floor(100 * scale)}px`
}
onMounted(() => nextTick(fit))
onSlideEnter(() => nextTick(fit))
</script>

<template>
  <PxSlide kind="display">
    <div ref="root" class="px-display-body"><slot /></div>
  </PxSlide>
</template>
