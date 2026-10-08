<script setup lang="ts">
// Columns with a shared gutter. `widths` is a grid track list, such as "1.2fr 1fr";
// without it every column is equal. Children are <Col> blocks.
const props = withDefaults(defineProps<{ widths?: string, gutter?: string }>(), { gutter: '29px' })
</script>

<template>
  <div class="px-cols" :style="{ gridTemplateColumns: props.widths ?? undefined, gap: props.gutter }">
    <slot />
  </div>
</template>
