<script setup lang="ts">
// A grid of numbers or text. `align: left` for tables of text; `dense` sets the
// small size for a long table.
withDefaults(defineProps<{ align?: string, dense?: boolean }>(), { align: 'auto' })
</script>

<template><PxSlide kind="table" :data-align="align" :data-dense="dense || undefined"><slot /></PxSlide></template>
