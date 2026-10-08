<script setup lang="ts">
// A page laid out elsewhere: one SVG or image per slide, written by
// scripts/import-pages.mjs from a Centauri document or a PDF. The page fills the
// canvas. With `chrome: true` it sits inside Proxima's frame instead, for a document
// page presented with the deck's label, count and presenter.
withDefaults(defineProps<{ image: string, chrome?: boolean, fit?: 'contain' | 'cover' }>(), { chrome: false, fit: 'contain' })
</script>

<template>
  <PxSlide kind="page" :data-chrome="chrome || undefined">
    <img class="px-page-image" :src="image" :style="{ objectFit: fit }" alt="">
  </PxSlide>
</template>
