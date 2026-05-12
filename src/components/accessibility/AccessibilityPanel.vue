<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Contrast, Languages, Minus, Moon, PersonStanding, Plus, Sun, Type, Wind } from 'lucide-vue-next'
import { useAccessibility } from '@/stores/accessibility'
import { useI18n } from '@/stores/i18n'
import { useTheme } from '@/stores/theme'

const isOpen = ref(false)
const isDragging = ref(false)
const panelRoot = ref(null)
const position = ref({ x: 24, y: 24 })
const dragOffset = ref({ x: 0, y: 0 })

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

function clampPosition(nextPosition) {
  if (typeof window === 'undefined') return nextPosition

  const buttonSize = 60
  const maxX = window.innerWidth - buttonSize
  const maxY = window.innerHeight - buttonSize

  return {
    x: Math.max(0, Math.min(nextPosition.x, maxX)),
    y: Math.max(0, Math.min(nextPosition.y, maxY)),
  }
}

function loadPosition() {
  if (typeof window === 'undefined') return

  const storedPosition = window.localStorage.getItem('accessibility-position')
  if (!storedPosition) return

  try {
    position.value = clampPosition(JSON.parse(storedPosition))
  } catch {
    // Ignore invalid stored values.
  }
}

function savePosition() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('accessibility-position', JSON.stringify(position.value))
}

function closePanel() {
  isOpen.value = false
}

function togglePanel() {
  isOpen.value = !isOpen.value
}

function handlePointerDown(event) {
  if (event.button !== 0) return

  isDragging.value = true
  dragOffset.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y,
  }

  event.preventDefault()
}

function handlePointerMove(event) {
  if (!isDragging.value) return

  position.value = clampPosition({
    x: event.clientX - dragOffset.value.x,
    y: event.clientY - dragOffset.value.y,
  })
}

function handlePointerUp() {
  if (!isDragging.value) return
  isDragging.value = false
  savePosition()
}

function handleSetFontSize(level) {
  setFontSize(level)
}

function handleSetLanguage(lang) {
  setLanguage(lang)
}

function handleDocumentPointerDown(event) {
  if (!isOpen.value || !panelRoot.value) return

  if (panelRoot.value.contains(event.target)) return

  closePanel()
}

onMounted(() => {
  loadPosition()
  document.addEventListener('pointermove', handlePointerMove)
  document.addEventListener('pointerup', handlePointerUp)
  document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', handlePointerUp)
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
})
</script>

<template>
  <div ref="panelRoot" class="accessibility-fab" :style="{ transform: `translate(${position.x}px, ${position.y}px)` }">
      <button
        class="accessibility-fab__button"
        type="button"
        :aria-label="isOpen ? t.accessibility.closePanel : t.accessibility.openPanel"
        :aria-expanded="isOpen"
        @click="togglePanel"
        @pointerdown="handlePointerDown"
      >
      <PersonStanding :size="34" />
      <span class="sr-only">{{ t.accessibility.title }}</span>
    </button>

    <div v-if="isOpen" class="accessibility-popover" role="dialog" :aria-label="t.accessibility.title">
      <div class="accessibility-popover__header">
        <div>
          <p class="accessibility-popover__eyebrow">{{ t.accessibility.title }}</p>
          <h2 class="accessibility-popover__title">{{ t.accessibility.quickOptions }}</h2>
        </div>
      </div>

      <button class="accessibility-row" type="button" @click="toggleTheme">
        <span class="accessibility-row__icon">
          <component :is="themeIcon" :size="18" />
        </span>
        <span class="accessibility-row__text">
          <strong>{{ currentTheme === 'dark' ? t.accessibility.darkMode : t.accessibility.lightMode }}</strong>
          <small>{{ t.accessibility.themeHint ?? 'Canvia el contrast general de la interfície' }}</small>
        </span>
      </button>

      <div class="accessibility-row accessibility-row--group">
        <span class="accessibility-row__icon">
          <Type :size="18" />
        </span>
        <span class="accessibility-row__text">
          <strong>{{ t.accessibility.fontSize }}</strong>
          <small>{{ t.accessibility.fontSizeHint ?? 'Ajusta la lectura al teu gust' }}</small>
        </span>

        <div class="accessibility-row__actions">
          <button
            v-for="level in fontSizeValues"
            :key="level"
            type="button"
            class="accessibility-pill"
            :class="{ active: fontSizeLevel === level }"
            :aria-label="FONT_SIZES[level].label"
            :title="FONT_SIZES[level].label"
            @click="handleSetFontSize(level)"
          >
            <component :is="level === 0 ? Minus : level === 2 ? Plus : Type" :size="16" />
          </button>
        </div>
      </div>

      <div class="accessibility-row accessibility-row--group">
        <span class="accessibility-row__icon">
          <Languages :size="18" />
        </span>
        <span class="accessibility-row__text">
          <strong>{{ t.accessibility.language }}</strong>
          <small>{{ t.accessibility.languageHint ?? 'Canvia els textos visibles de la interfície' }}</small>
        </span>

        <div class="accessibility-row__actions accessibility-row__actions--language">
          <button
            type="button"
            class="accessibility-pill accessibility-pill--wide"
            :class="{ active: currentLanguage === 'ca' }"
            @click="handleSetLanguage('ca')"
          >
            CA
          </button>
          <button
            type="button"
            class="accessibility-pill accessibility-pill--wide"
            :class="{ active: currentLanguage === 'es' }"
            @click="handleSetLanguage('es')"
          >
            ES
          </button>
          <button
            type="button"
            class="accessibility-pill accessibility-pill--wide"
            :class="{ active: currentLanguage === 'en' }"
            @click="handleSetLanguage('en')"
          >
            EN
          </button>
        </div>
      </div>

      <button class="accessibility-row" type="button" @click="toggleReducedMotion">
        <span class="accessibility-row__icon accessibility-row__icon--motion" :class="{ active: reducedMotion }">
          <Wind :size="18" />
        </span>
        <span class="accessibility-row__text">
          <strong>{{ t.accessibility.reducedMotion }}</strong>
          <small>{{ t.accessibility.reducedMotionHint ?? 'Fa les animacions més suaus' }}</small>
        </span>
        <span class="accessibility-row__status" :class="{ active: reducedMotion }">
          {{ reducedMotion ? 'ON' : 'OFF' }}
        </span>
      </button>

      <button class="accessibility-row" type="button" @click="toggleHighContrast">
        <span class="accessibility-row__icon accessibility-row__icon--contrast" :class="{ active: highContrast }">
          <Contrast :size="18" />
        </span>
        <span class="accessibility-row__text">
          <strong>{{ t.accessibility.highContrast }}</strong>
          <small>{{ t.accessibility.highContrastHint ?? 'Fa els elements més fàcils de distingir' }}</small>
        </span>
        <span class="accessibility-row__status" :class="{ active: highContrast }">
          {{ highContrast ? 'ON' : 'OFF' }}
        </span>
      </button>

      <p class="accessibility-popover__hint">{{ t.accessibility.dragHint }}</p>
    </div>
  </div>
</template>

<style scoped>
.accessibility-fab {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  user-select: none;
}

.accessibility-fab__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: linear-gradient(135deg, var(--surface-contrast), var(--card-solid));
  color: var(--foreground);
  box-shadow: var(--shadow-panel);
  cursor: grab;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.accessibility-fab__button:hover {
  transform: scale(1.04);
  box-shadow: var(--shadow-panel-strong);
  border-color: var(--border-focus);
}

.accessibility-fab__button:active {
  cursor: grabbing;
}

.accessibility-popover {
  position: absolute;
  left: 72px;
  top: 0;
  width: min(360px, calc(100vw - 110px));
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 22px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
  color: var(--foreground);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-panel-strong);
}

.accessibility-popover__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.accessibility-popover__eyebrow {
  margin: 0 0 2px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--foreground-muted-soft);
}

.accessibility-popover__title {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
}

.accessibility-popover__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--muted);
  color: var(--foreground);
}

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

.accessibility-pill--wide {
  min-width: 44px;
  padding: 0 12px;
}

.accessibility-pill.active {
  background: linear-gradient(135deg, var(--primary), var(--violet));
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.accessibility-row:hover .accessibility-row__icon {
  color: var(--foreground);
}

.accessibility-row:hover .accessibility-row__status {
  color: var(--foreground);
}

.accessibility-popover__hint {
  margin: 12px 2px 0;
  font-size: 12px;
  color: var(--foreground-muted-soft);
}

@media (max-width: 520px) {
  .accessibility-popover {
    left: 0;
    top: 84px;
    width: min(90vw, 360px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .accessibility-fab__button {
    transition: none;
  }
}
</style>

