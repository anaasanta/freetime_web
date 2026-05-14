import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeTheme } from './stores/theme'
import { initializeAccessibility } from './stores/accessibility'
import { initializeI18n } from './stores/i18n'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/variables.css'
import './styles/base.css'
import './styles/responsive.css'
import './styles/animations.css'

initializeTheme()
initializeAccessibility()
initializeI18n()

createApp(App).use(router).mount('#app')
