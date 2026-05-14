<script setup>
import { computed } from 'vue'
import { Contrast, Languages, Moon, Sun, Type, Wind } from 'lucide-vue-next'
import { useAccessibility } from '@/stores/accessibility'
import { useI18n } from '@/stores/i18n'
import { useTheme } from '@/stores/theme'

defineProps({
  showHint: {
    type: Boolean,
    default: false,
  },
})

const { currentTheme, toggleTheme } = useTheme()
const {
  fontSizeLevel,
  reducedMotion,
  highContrast,
  setFontSize,
  toggleReducedMotion,
  toggleHighContrast,
  FONT_SIZES,
} = useAccessibility()
const { currentLanguage, t, setLanguage } = useI18n()

const fontSizeValues = computed(() => [0, 1, 2])
const themeIcon = computed(() => (currentTheme.value === 'dark' ? Moon : Sun))
</script>

<template>
  <div class="accessibility-controls">
    <button class="accessibility-row btn" type="button" @click="toggleTheme">
      <span class="accessibility-row__icon">
        <component :is="themeIcon" :size="18" />
      </span>
      <span class="accessibility-row__text">
        <strong>{{ currentTheme === 'dark' ? t.accessibility.darkMode : t.accessibility.lightMode }}</strong>
        <small>{{ t.accessibility.themeHint }}</small>
      </span>
    </button>

    <div class="accessibility-row accessibility-row--group">
      <span class="accessibility-row__icon">
        <Type :size="18" />
      </span>
      <span class="accessibility-row__text">
        <strong>{{ t.accessibility.fontSize }}</strong>
        <small>{{ t.accessibility.fontSizeHint }}</small>
      </span>

      <div class="accessibility-row__actions">
        <button
          v-for="level in fontSizeValues"
          :key="level"
          type="button"
          class="accessibility-pill btn"
          :class="{ active: fontSizeLevel === level }"
          :aria-label="FONT_SIZES[level].label"
          :title="FONT_SIZES[level].label"
          @click="setFontSize(level)"
        >
          <span class="accessibility-pill__letter" :class="`accessibility-pill__letter--${level}`" aria-hidden="true">T</span>
        </button>
      </div>
    </div>

    <div class="accessibility-row accessibility-row--group">
      <span class="accessibility-row__icon">
        <Languages :size="18" />
      </span>
      <span class="accessibility-row__text">
        <strong>{{ t.accessibility.language }}</strong>
        <small>{{ t.accessibility.languageHint }}</small>
      </span>

      <div class="accessibility-row__actions accessibility-row__actions--language">
        <button type="button" class="accessibility-pill accessibility-pill--wide btn" :class="{ active: currentLanguage === 'ca' }" @click="setLanguage('ca')">
          CA
        </button>
        <button type="button" class="accessibility-pill accessibility-pill--wide btn" :class="{ active: currentLanguage === 'es' }" @click="setLanguage('es')">
          ES
        </button>
        <button type="button" class="accessibility-pill accessibility-pill--wide btn" :class="{ active: currentLanguage === 'en' }" @click="setLanguage('en')">
          EN
        </button>
      </div>
    </div>

    <button class="accessibility-row btn" type="button" @click="toggleReducedMotion">
      <span class="accessibility-row__icon accessibility-row__icon--motion" :class="{ active: reducedMotion }">
        <Wind :size="18" />
      </span>
      <span class="accessibility-row__text">
        <strong>{{ t.accessibility.reducedMotion }}</strong>
        <small>{{ t.accessibility.reducedMotionHint }}</small>
      </span>
      <span class="accessibility-row__status" :class="{ active: reducedMotion }">
        {{ reducedMotion ? 'ON' : 'OFF' }}
      </span>
    </button>

    <button class="accessibility-row btn" type="button" @click="toggleHighContrast">
      <span class="accessibility-row__icon accessibility-row__icon--contrast" :class="{ active: highContrast }">
        <Contrast :size="18" />
      </span>
      <span class="accessibility-row__text">
        <strong>{{ t.accessibility.highContrast }}</strong>
        <small>{{ t.accessibility.highContrastHint }}</small>
      </span>
      <span class="accessibility-row__status" :class="{ active: highContrast }">
        {{ highContrast ? 'ON' : 'OFF' }}
      </span>
    </button>

    <p v-if="showHint" class="accessibility-popover__hint">{{ t.accessibility.dragHint }}</p>
  </div>
</template>

<style scoped>
.accessibility-row {
  width: 100%;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface-soft);
  color: inherit;
  text-align: left;
}

.accessibility-row + .accessibility-row,
.accessibility-row + .accessibility-row--group,
.accessibility-row--group + .accessibility-row {
  margin-top: 10px;
}

.accessibility-row--group {
  align-items: start;
}

.accessibility-row__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--violet-soft) 36%, var(--surface-strong));
  color: var(--violet-strong);
}

.accessibility-row__icon--motion.active {
  background: color-mix(in srgb, var(--sky-soft) 42%, var(--surface-strong));
  color: var(--sky);
}

.accessibility-row__icon--contrast.active {
  background: color-mix(in srgb, var(--emerald-soft) 42%, var(--surface-strong));
  color: var(--emerald);
}

.accessibility-row__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.accessibility-row__text strong {
  font-size: 14px;
  font-weight: 700;
}

.accessibility-row__text small {
  font-size: 12px;
  color: var(--foreground-muted-soft);
}

.accessibility-row__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.accessibility-row__actions--language {
  flex-wrap: wrap;
}

.accessibility-row__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  padding: 0 10px;
  height: 26px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 82%, transparent);
  color: var(--foreground-muted-soft);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.accessibility-row__status.active {
  background: color-mix(in srgb, var(--primary) 18%, var(--surface-contrast));
  color: var(--primary);
}

.accessibility-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-contrast);
  color: var(--foreground);
}

.accessibility-pill__letter {
  display: inline-block;
  font-weight: 400;
  line-height: 1;
}

.accessibility-pill__letter--0 {
  font-size: 0.68rem;
}

.accessibility-pill__letter--1 {
  font-size: 1rem;
}

.accessibility-pill__letter--2 {
  font-size: 1.38rem;
}

.accessibility-pill--wide {
  min-width: 44px;
  padding: 0 12px;
}

.accessibility-pill.active {
  background: linear-gradient(135deg, var(--primary), var(--violet));
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.accessibility-row:hover .accessibility-row__icon,
.accessibility-row:hover .accessibility-row__status {
  color: var(--foreground);
}

.accessibility-popover__hint {
  margin: 12px 2px 0;
  font-size: 12px;
  color: var(--foreground-muted-soft);
}
</style>
