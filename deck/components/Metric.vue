<script setup lang="ts">
// A number with its label, for use inside any slide.
defineProps<{ value: string | number, label: string, note?: string }>()
</script>

<template>
  <div class="px-metric">
    <span class="px-metric-value num">{{ value }}</span>
    <span class="px-metric-label">{{ label }}</span>
    <span v-if="note" class="px-metric-note">{{ note }}</span>
  </div>
</template>
