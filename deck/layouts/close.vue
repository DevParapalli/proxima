<script setup lang="ts">
defineProps<{ contact?: string }>()
</script>

<template>
  <PxSlide kind="close">
    <slot />
    <p v-if="contact" class="px-contact">{{ contact }}</p>
  </PxSlide>
</template>
