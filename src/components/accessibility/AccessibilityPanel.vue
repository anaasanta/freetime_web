<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { PersonStanding } from 'lucide-vue-next'
import AccessibilityControls from '@/components/accessibility/AccessibilityControls.vue'
import { useI18n } from '@/stores/i18n'

const POSITION_STORAGE_KEY = 'accessibility-position-v3'
const isOpen = ref(false)
const isDragging = ref(false)
const panelRoot = ref(null)
const position = ref({ x: 24, y: 24 })
const dragOffset = ref({ x: 0, y: 0 })

const { t } = useI18n()

const popoverPositionClass = computed(() => {
  if (typeof window === 'undefined') return ''

  return {
    'accessibility-popover--left': position.value.x > window.innerWidth / 2,
    'accessibility-popover--up': position.value.y > window.innerHeight / 2,
  }
})

function defaultPosition() {
  if (typeof window === 'undefined') return { x: 24, y: 24 }

  return {
    x: window.innerWidth - 84,
    y: window.innerHeight - 84,
  }
}

function clampPosition(nextPosition) {
  if (typeof window === 'undefined') return nextPosition

  const buttonSize = 60
  const margin = 18
  const maxX = window.innerWidth - buttonSize - margin
  const maxY = window.innerHeight - buttonSize - margin

  return {
    x: Math.max(margin, Math.min(nextPosition.x, maxX)),
    y: Math.max(margin, Math.min(nextPosition.y, maxY)),
  }
}

function loadPosition() {
  if (typeof window === 'undefined') return

  const storedPosition = window.localStorage.getItem(POSITION_STORAGE_KEY)
  if (!storedPosition) {
    position.value = clampPosition(defaultPosition())
    return
  }

  try {
    position.value = clampPosition(JSON.parse(storedPosition))
  } catch {
    position.value = clampPosition(defaultPosition())
  }
}

function savePosition() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position.value))
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

function handleResize() {
  position.value = clampPosition(position.value)
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
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', handlePointerUp)
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="panelRoot" class="accessibility-fab" :style="{ transform: `translate(${position.x}px, ${position.y}px)` }">
    <button
      class="accessibility-fab__button btn"
      type="button"
      :aria-label="isOpen ? t.accessibility.closePanel : t.accessibility.openPanel"
      :aria-expanded="isOpen"
      @click="togglePanel"
      @pointerdown="handlePointerDown"
    >
      <PersonStanding :size="34" />
      <span class="sr-only">{{ t.accessibility.title }}</span>
    </button>

    <div v-if="isOpen" class="accessibility-popover" :class="popoverPositionClass" role="dialog" :aria-label="t.accessibility.title">
      <div class="accessibility-popover__header">
        <div>
          <p class="accessibility-popover__eyebrow">{{ t.accessibility.title }}</p>
          <h2 class="accessibility-popover__title">{{ t.accessibility.quickOptions }}</h2>
        </div>
      </div>

      <AccessibilityControls show-hint />
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
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
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

.accessibility-popover--left {
  left: auto;
  right: 72px;
}

.accessibility-popover--up {
  top: auto;
  bottom: 0;
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

@media (max-width: 520px) {
  .accessibility-popover {
    left: auto;
    right: 0;
    top: auto;
    bottom: 76px;
    width: min(90vw, 360px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .accessibility-fab__button {
    transition: none;
  }
}
</style>
