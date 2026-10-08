<script setup lang="ts">
defineProps<{ file?: string }>()
</script>

<template>
  <PxSlide kind="code">
    <slot />
    <span v-if="file" class="px-code-file">{{ file }}</span>
  </PxSlide>
</template>
