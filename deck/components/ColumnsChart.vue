<script setup lang="ts">
// Rising columns: height proportional to the value, the figure set inside the top
// and the label in an outlined pill at the base. Tones alternate within the accent
// ramp; colour encodes series, not emphasis. `height` is the tallest column in px.
import { computed } from 'vue'

type Item = [string, number] | [string, number, string]
const props = withDefaults(defineProps<{ items: Item[], height?: number }>(), { height: 260 })
const top = computed(() => Math.max(...props.items.map(i => i[1])))
</script>

<template>
  <div class="px-columns">
    <div v-for="(it, i) in items" :key="i" class="px-column">
      <div class="px-column-bar" :style="{ height: `${(props.height * it[1] / top).toFixed(1)}px` }">
        <span class="num">{{ it[2] ?? it[1] }}</span>
      </div>
      <span class="px-column-label">{{ it[0] }}</span>
    </div>
  </div>
</template>
