<script setup lang="ts">
// Terms and explanations in rows divided by hairlines. `dense` sets the small size
// for a long list, as an appendix permits; prefer fewer terms.
defineProps<{ dense?: boolean }>()
</script>

<template><PxSlide kind="explain" :data-dense="dense || undefined"><slot /></PxSlide></template>
