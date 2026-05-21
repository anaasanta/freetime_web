<script setup>
import { computed } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'

import { useTheme } from '@/stores/theme'
import { useI18n } from '@/stores/i18n'

const props = defineProps({
  labels: {
    type: Object,
    default: undefined,
  },
})

const { currentTheme, isDarkTheme, toggleTheme } = useTheme()
const { t } = useI18n()

const labels = computed(() =>
  props.labels ?? {
    light: t.value.toggle.light,
    dark: t.value.toggle.dark,
  },
)

const buttonLabel = computed(() =>
  isDarkTheme.value ? labels.value.light : labels.value.dark,
)

const iconComponent = computed(() => (currentTheme.value === 'dark' ? Moon : Sun))
</script>

<template>
  <button
    class="theme-toggle btn btn-outline-secondary"
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
  --bs-btn-color: var(--foreground);
  --bs-btn-border-color: var(--border);
  --bs-btn-hover-color: var(--foreground);
  --bs-btn-hover-bg: color-mix(in srgb, var(--violet-soft) 62%, var(--surface-contrast));
  --bs-btn-hover-border-color: var(--border-focus);
  --bs-btn-active-color: var(--foreground);
  --bs-btn-active-bg: color-mix(in srgb, var(--violet-soft) 70%, var(--surface-contrast));
  --bs-btn-active-border-color: var(--border-focus);
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
  background: color-mix(in srgb, var(--violet-soft) 62%, var(--surface-contrast));
  color: var(--foreground);
}

.theme-toggle svg {
  color: currentColor;
  stroke-width: 2.2;
}

.theme-toggle:focus-visible {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--violet) 12%, transparent);
}
</style>
