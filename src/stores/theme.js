import { computed, ref } from 'vue'

const THEME_STORAGE_KEY = 'freetime-theme'
const VALID_THEMES = new Set(['light', 'dark'])

const currentTheme = ref('light')

let hasInitializedTheme = false

function isValidTheme(theme) {
  return VALID_THEMES.has(theme)
}

function persistTheme(theme) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

function resolveStoredTheme() {
  if (typeof window === 'undefined') return 'light'

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isValidTheme(storedTheme) ? storedTheme : 'light'
}

export function setTheme(nextTheme) {
  const resolvedTheme = isValidTheme(nextTheme) ? nextTheme : 'light'

  currentTheme.value = resolvedTheme
  applyTheme(resolvedTheme)
  persistTheme(resolvedTheme)
}

export function toggleTheme() {
  setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
}

export function initializeTheme() {
  if (hasInitializedTheme) return

  const initialTheme = resolveStoredTheme()
  currentTheme.value = initialTheme
  applyTheme(initialTheme)

  hasInitializedTheme = true
}

export function useTheme() {
  return {
    currentTheme,
    isDarkTheme: computed(() => currentTheme.value === 'dark'),
    setTheme,
    toggleTheme,
  }
}
