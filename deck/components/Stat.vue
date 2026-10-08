<script setup lang="ts">
defineProps<{ value: string | number, label: string }>()
</script>

<template>
  <div class="px-stat px-tile">
    <span class="px-stat-label">{{ label }}</span>
    <span class="px-stat-value num">{{ value }}</span>
  </div>
</template>
