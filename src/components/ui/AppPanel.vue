<script setup>
defineProps({
  as: {
    type: String,
    default: 'section',
  },
  panelClass: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <component :is="as" class="app-panel surface" :class="panelClass">
    <slot />
  </component>
</template>
