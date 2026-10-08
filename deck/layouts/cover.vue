<script setup lang="ts">
// Opening slide: the title set large and light, fact chips beneath. The optional
// large `number` and the `side` label are drawn by the frame layer, beneath the text.
defineProps<{ facts?: string[], number?: string | number, side?: string }>()
</script>

<template>
  <PxSlide kind="cover">
    <div class="px-cover-body">
      <slot />
      <div v-if="facts?.length" class="px-facts">
        <span v-for="f in facts" :key="f" class="px-chip">{{ f }}</span>
      </div>
    </div>
  </PxSlide>
</template>
