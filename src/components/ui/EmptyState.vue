<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="empty-state-box alert" role="status">
    <h3 v-if="title">{{ title }}</h3>
    <p v-if="text">{{ text }}</p>
    <slot v-if="!title && !text" />
  </div>
</template>

<style scoped>
.empty-state-box {
  display: grid;
  gap: 8px;
  padding: 18px 20px;
  border: 1px solid color-mix(in srgb, var(--surface-stroke-strong) 70%, transparent);
  border-radius: 20px;
  background: color-mix(in srgb, var(--surface-contrast) 40%, transparent);
  color: var(--muted-foreground);
  line-height: 1.55;
}

.empty-state-box h3,
.empty-state-box p {
  margin: 0;
}

.empty-state-box h3 {
  color: var(--foreground);
  font-size: 1rem;
  font-weight: 900;
}
</style>
