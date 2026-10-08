<script setup lang="ts">
// The root of every layout. Carries the slide's kind, accent and tone as data
// attributes so tokens, grounds and the frame resolve per slide. In dev it marks a
// slide whose content runs past the canvas: Centauri fails the build, a browser
// cannot, so the warning is visible instead.
import { onSlideEnter, useNav } from '@slidev/client'
import { onMounted, ref } from 'vue'
import { usePx } from '../composables/px'

const props = defineProps<{ kind: string }>()
const px = usePx(props.kind)
const root = ref<HTMLElement>()
const overflow = ref(false)
const { isPrintMode } = useNav()

function check() {
  const el = root.value
  if (!el) return
  overflow.value = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1
}
if (import.meta.env.DEV) {
  onMounted(() => { check(); new ResizeObserver(check).observe(root.value!) })
  onSlideEnter(check)
}
</script>

<template>
  <div
    ref="root"
    class="slidev-layout px"
    :class="`px-${kind}`"
    :data-kind="kind"
    :data-accent="px.accent.value"
    :data-tone="px.tone.value"
  >
    <slot />
    <span v-if="overflow && !isPrintMode" class="pill pill-rose px-overflow"><i class="dot" />Overflows the slide</span>
  </div>
</template>
