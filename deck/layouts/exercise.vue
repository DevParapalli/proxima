<script setup lang="ts">
// Task, time box and expected output. The accent is the deck accent's partner, set
// in PxSlide, so exercises stand apart from content slides.
defineProps<{ minutes?: number }>()
</script>

<template>
  <PxSlide kind="exercise">
    <div class="px-exercise-grid">
      <div class="px-exercise-task">
        <slot />
        <div v-if="$slots.output" class="px-exercise-output">
          <span class="px-exercise-output-label">Expected output</span>
          <slot name="output" />
        </div>
      </div>
      <div v-if="minutes" class="px-exercise-minutes">
        <span class="num">{{ minutes }}</span>
        <span>minutes</span>
      </div>
    </div>
  </PxSlide>
</template>
