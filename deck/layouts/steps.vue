<script setup lang="ts">
// Numbered sequence from the ordered list in the body. `current` emphasises one step.
defineProps<{ current?: number }>()
</script>

<template><PxSlide kind="steps" :data-current="current"><slot /></PxSlide></template>
