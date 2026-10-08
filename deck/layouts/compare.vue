<script setup lang="ts">
// Two options on a shared baseline. `pick` puts the emphasis on the option the
// title argues for and dims the other.
defineProps<{ pick?: "left" | "right" }>()
</script>

<template>
  <PxSlide kind="compare" :data-pick="pick">
    <slot />
    <div class="px-compare-cols">
      <div class="px-compare-side" :data-side="`left`"><slot name="left" /></div>
      <div class="px-compare-side" :data-side="`right`"><slot name="right" /></div>
    </div>
  </PxSlide>
</template>
