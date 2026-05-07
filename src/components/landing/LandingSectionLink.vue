<script setup>
defineProps({
  href: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['navigate'])

function handleClick(event) {
  emit('navigate', event)
}
</script>

<template>
  <a class="landing-section-link" :href="href" @click="handleClick">
    {{ label }}
  </a>
</template>

<style scoped>
.landing-section-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--surface-stroke-strong) 85%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 84%, transparent);
  color: var(--muted-foreground);
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 0.16s ease,
    color 0.16s ease,
    border-color 0.16s ease,
    background-color 0.16s ease,
    box-shadow 0.16s ease;
}

.landing-section-link:hover {
  transform: translateY(-1px);
  color: var(--foreground);
  border-color: color-mix(in srgb, var(--violet-strong) 18%, transparent);
  box-shadow: 0 8px 20px rgba(30, 41, 59, 0.08);
}
</style>