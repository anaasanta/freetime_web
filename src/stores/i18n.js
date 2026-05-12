import { ref, computed } from 'vue'

const I18N_STORAGE_KEY = 'freetime-language'

const currentLanguage = ref('ca')

const translations = {
  ca: {
    toggle: {
      light: 'Canviar a mode clar',
      dark: 'Canviar a mode fosc',
    },
    accessibility: {
      openPanel: 'Obrir panel d\'accesibilitat',
      closePanel: 'Tancar panel d\'accesibilitat',
      close: 'Tancar',
      title: 'Accesibilitat',
      quickOptions: 'Opcions ràpides',
      fontSize: 'Mida de lletra',
      theme: 'Mode',
      language: 'Idioma',
      reducedMotion: 'Reduir moviment',
      highContrast: 'Contrast alt',
      dragHint: 'Pots moure aquest panel arrossegant-lo',
      lightMode: 'Mode clar',
      darkMode: 'Mode fosc',
      themeHint: 'Canvia el contrast general de la interfície',
      fontSizeHint: 'Ajusta la lectura al teu gust',
      languageHint: 'Canvia els textos visibles de la interfície',
      reducedMotionHint: 'Fa les animacions més suaus',
      highContrastHint: 'Fa els elements més fàcils de distingir',
      changeTo: {
        light: 'Mode clar',
        dark: 'Mode fosc',
      },
    },
    fontSizes: {
      small: 'Petit',
      normal: 'Normal',
      large: 'Gran',
      xlarge: 'Molt gran',
    },
    languages: {
      ca: 'Català',
      es: 'Español',
      en: 'English',
    },
  },
  es: {
    toggle: {
      light: 'Cambiar a modo claro',
      dark: 'Cambiar a modo oscuro',
    },
    accessibility: {
      openPanel: 'Abrir panel de accesibilidad',
      closePanel: 'Cerrar panel de accesibilidad',
      close: 'Cerrar',
      title: 'Accesibilidad',
      quickOptions: 'Opciones rápidas',
      fontSize: 'Tamaño de letra',
      theme: 'Tema',
      language: 'Idioma',
      reducedMotion: 'Reducir movimiento',
      highContrast: 'Contraste alto',
      dragHint: 'Puedes mover este panel arrastrándolo',
      lightMode: 'Modo claro',
      darkMode: 'Modo oscuro',
      themeHint: 'Cambia el contraste general de la interfaz',
      fontSizeHint: 'Ajusta la lectura a tu gusto',
      languageHint: 'Cambia los textos visibles de la interfaz',
      reducedMotionHint: 'Hace las animaciones más suaves',
      highContrastHint: 'Hace los elementos más fáciles de distinguir',
      changeTo: {
        light: 'Modo claro',
        dark: 'Modo oscuro',
      },
    },
    fontSizes: {
      small: 'Pequeño',
      normal: 'Normal',
      large: 'Grande',
      xlarge: 'Muy grande',
    },
    languages: {
      ca: 'Català',
      es: 'Español',
      en: 'English',
    },
  },
  en: {
    toggle: {
      light: 'Switch to light mode',
      dark: 'Switch to dark mode',
    },
    accessibility: {
      openPanel: 'Open accessibility panel',
      closePanel: 'Close accessibility panel',
      close: 'Close',
      title: 'Accessibility',
      quickOptions: 'Quick options',
      fontSize: 'Font size',
      theme: 'Theme',
      language: 'Language',
      reducedMotion: 'Reduce motion',
      highContrast: 'High contrast',
      dragHint: 'You can move this panel by dragging it',
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
      themeHint: 'Change the overall contrast of the interface',
      fontSizeHint: 'Adjust the text size to your liking',
      languageHint: 'Change the visible text in the interface',
      reducedMotionHint: 'Makes animations softer',
      highContrastHint: 'Makes elements easier to distinguish',
      changeTo: {
        light: 'Light mode',
        dark: 'Dark mode',
      },
    },
    fontSizes: {
      small: 'Small',
      normal: 'Normal',
      large: 'Large',
      xlarge: 'X-Large',
    },
    languages: {
      ca: 'Català',
      es: 'Español',
      en: 'English',
    },
  },
}

function loadLanguage() {
  if (typeof window === 'undefined') return

  const stored = window.localStorage.getItem(I18N_STORAGE_KEY)
  if (stored && translations[stored]) {
    currentLanguage.value = stored
  }
}

function saveLanguage(lang) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(I18N_STORAGE_KEY, lang)
}

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage.value = lang
    saveLanguage(lang)
    
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.language = lang
      document.documentElement.lang = lang
      document.documentElement.dir = 'ltr'
    }
  }
}

export function useI18n() {
  return {
    currentLanguage: computed(() => currentLanguage.value),
    t: computed(() => translations[currentLanguage.value] || translations.ca),
    setLanguage,
  }
}

export function initializeI18n() {
  loadLanguage()
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.language = currentLanguage.value
    document.documentElement.lang = currentLanguage.value
    document.documentElement.dir = 'ltr'
  }
}
