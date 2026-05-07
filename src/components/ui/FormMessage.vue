<script setup>
defineProps({
  tone: {
    type: String,
    default: 'error',
  },
})
</script>

<template>
  <p class="form-message" :class="`tone-${tone}`">
    <slot />
  </p>
</template>
