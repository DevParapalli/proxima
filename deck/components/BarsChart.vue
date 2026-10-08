<script setup lang="ts">
// Horizontal bars with the value in a pill at the end of each bar. Each item is
// [label, value] or [label, value, display]. A bar is never narrower than 69px (the
// 2.4cm of the print version), so its pill fits; the pill carries the exact figure.
import { computed } from 'vue'

type Item = [string, number] | [string, number, string]
const props = defineProps<{ items: Item[] }>()
const top = computed(() => Math.max(...props.items.map(i => i[1])))
</script>

<template>
  <div class="px-bars">
    <template v-for="(it, i) in items" :key="i">
      <span class="px-bars-label">{{ it[0] }}</span>
      <div class="px-bars-track">
        <div class="px-bar" :style="{ width: `max(${(100 * it[1] / top).toFixed(2)}%, 69px)` }">
          <span class="px-bar-value num">{{ it[2] ?? it[1] }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
