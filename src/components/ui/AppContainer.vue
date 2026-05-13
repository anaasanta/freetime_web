<script setup>
defineProps({
  as: {
    type: String,
    default: 'div',
  },
})
</script>

<template>
  <component :is="as" class="page-container">
    <slot />
  </component>
</template>
