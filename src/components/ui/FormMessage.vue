<script setup>
defineProps({
  tone: {
    type: String,
    default: 'error',
  },
})
</script>

<template>
  <p class="form-message alert mb-0" :class="[`tone-${tone}`, tone === 'error' ? 'alert-danger' : 'alert-info']">
    <slot />
  </p>
</template>
