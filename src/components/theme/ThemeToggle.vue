<script setup>
import { computed } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'

import { useTheme } from '@/stores/theme'

const props = defineProps({
  labels: {
    type: Object,
    default: () => ({
      light: 'Canviar a mode clar',
      dark: 'Canviar a mode fosc',
    }),
  },
})

const { currentTheme, isDarkTheme, toggleTheme } = useTheme()

const buttonLabel = computed(() =>
  isDarkTheme.value ? props.labels.light : props.labels.dark,
)

const iconComponent = computed(() => (currentTheme.value === 'dark' ? Moon : Sun))
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="buttonLabel"
    :title="buttonLabel"
    @click="toggleTheme"
  >
    <component :is="iconComponent" :size="18" />
    <span class="sr-only">{{ buttonLabel }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 90%, transparent);
  color: var(--foreground);
  box-shadow: var(--shadow-soft);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.theme-toggle:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-panel);
  background: color-mix(in srgb, var(--surface-strong) 92%, transparent);
}

.theme-toggle:focus-visible {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--violet) 12%, transparent);
}
</style>
