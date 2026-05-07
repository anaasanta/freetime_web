import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeTheme } from './stores/theme'

import './styles/variables.css'
import './styles/base.css'
import './styles/responsive.css'
import './styles/animations.css'

initializeTheme()

createApp(App).use(router).mount('#app')
