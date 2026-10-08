<script setup lang="ts">
defineProps<{ attribution?: string }>()
</script>

<template>
  <PxSlide kind="quote">
    <div class="px-emphasis"><slot /></div>
    <p v-if="attribution" class="px-attribution">{{ attribution }}</p>
  </PxSlide>
</template>
