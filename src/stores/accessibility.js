import { computed, ref } from 'vue'

const ACCESSIBILITY_STORAGE_KEY = 'freetime-accessibility'

const fontSizeLevel = ref(1) // 0 = pequeno, 1 = normal, 2 = grande
const reducedMotion = ref(false)
const highContrast = ref(false)

const FONT_SIZES = {
  0: { label: 'Petit', scale: 0.85, name: 'small' },
  1: { label: 'Normal', scale: 1, name: 'normal' },
  2: { label: 'Gran', scale: 1.15, name: 'large' },
  3: { label: 'Molt gran', scale: 1.3, name: 'xlarge' },
}

function loadAccessibilitySettings() {
  if (typeof window === 'undefined') return

  const stored = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY)
  if (stored) {
    try {
      const settings = JSON.parse(stored)
      fontSizeLevel.value = settings.fontSizeLevel ?? 1
      reducedMotion.value = settings.reducedMotion ?? false
      highContrast.value = settings.highContrast ?? false
    } catch (e) {
      console.error('Error loading accessibility settings:', e)
    }
  }
}

function saveAccessibilitySettings() {
  if (typeof window === 'undefined') return

  const settings = {
    fontSizeLevel: fontSizeLevel.value,
    reducedMotion: reducedMotion.value,
    highContrast: highContrast.value,
  }

  window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings))
}

function applyAccessibilitySettings() {
  if (typeof document === 'undefined') return

  // Aplicar escala de fuente
  const scale = FONT_SIZES[fontSizeLevel.value].scale
  document.documentElement.style.fontSize = `${16 * scale}px`

  // Aplicar atributos de accesibilidad
  document.documentElement.dataset.fontsize = FONT_SIZES[fontSizeLevel.value].name
  document.documentElement.dataset.reducedmotion = reducedMotion.value ? 'true' : 'false'
  document.documentElement.dataset.highcontrast = highContrast.value ? 'true' : 'false'

  // Actualizar prefers-reduced-motion si es necesario
  if (reducedMotion.value) {
    document.documentElement.style.setProperty('--animation-duration', '0.01s')
  } else {
    document.documentElement.style.removeProperty('--animation-duration')
  }
}

function initializeAccessibility() {
  loadAccessibilitySettings()
  applyAccessibilitySettings()
}

export function setFontSize(level) {
  if (FONT_SIZES[level]) {
    fontSizeLevel.value = level
    applyAccessibilitySettings()
    saveAccessibilitySettings()
  }
}

export function toggleReducedMotion() {
  reducedMotion.value = !reducedMotion.value
  applyAccessibilitySettings()
  saveAccessibilitySettings()
}

export function toggleHighContrast() {
  highContrast.value = !highContrast.value
  applyAccessibilitySettings()
  saveAccessibilitySettings()
}

export function useAccessibility() {
  return {
    fontSizeLevel: computed(() => fontSizeLevel.value),
    reducedMotion: computed(() => reducedMotion.value),
    highContrast: computed(() => highContrast.value),
    
    setFontSize,
    toggleReducedMotion,
    toggleHighContrast,
    
    FONT_SIZES,
  }
}

export { initializeAccessibility }
