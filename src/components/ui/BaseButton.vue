<script setup>
import { computed } from 'vue'

const props = defineProps({
  as: {
    type: [String, Object],
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'text'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
  },
  block: {
    type: Boolean,
    default: false,
  },
  iconOnly: {
    type: Boolean,
    default: false,
  },
})

const variantClass = computed(() => {
  if (props.variant === 'text') return 'text-link-button'
  return `${props.variant}-button`
})

const buttonType = computed(() => (props.as === 'button' ? props.type : undefined))
</script>

<template>
  <component
    :is="as"
    :type="buttonType"
    class="base-button"
    :class="[variantClass, { 'base-button--block': block, 'base-button--icon-only': iconOnly }]"
  >
    <slot />
  </component>
</template>

<style scoped>
.base-button--block {
  width: 100%;
}

.base-button--icon-only {
  width: 48px;
  min-width: 48px;
  padding-inline: 0;
}
</style>
