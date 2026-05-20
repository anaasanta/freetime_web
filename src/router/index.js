import { createRouter, createWebHistory } from 'vue-router'

import { initializeAppSession, isAuthenticated } from '@/stores/appSession'

import ActivityView from '@/views/ActivityResultView.vue'
import AiConsultView from '@/views/AuthPlaceholderView.vue'
import ForgotPasswordView from '@/views/AuthPlaceholderView.vue'
import HomeView from '@/views/HomeView.vue'
import LandingView from '@/views/LandingView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import RegisterView from '@/views/AuthPlaceholderView.vue'
import ScheduleConfirmView from '@/views/ScheduleConfirmView.vue'
import SettingsView from '@/views/SettingsView.vue'
import TestView from '@/views/TestView.vue'

initializeAppSession()

let isBackNavigation = false
const publicRouteNames = new Set(['landing', 'login', 'register', 'forgot-password'])

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    isBackNavigation = true
  })
}

const routes = [
  { path: '/', name: 'landing', component: LandingView },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: { guestOnly: true },
  },
  { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/test', name: 'test', component: TestView },
  {
    path: '/activity/:id',
    name: 'activity',
    component: ActivityView,
  },
  {
    path: '/ai-consult',
    name: 'ai-consult',
    component: AiConsultView,
    meta: { requiresAuth: true },
  },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  {
    path: '/schedule',
    name: 'schedule-day',
    redirect: { name: 'profile' },
    meta: { requiresAuth: true },
  },
  {
    path: '/schedule/confirm',
    name: 'schedule-confirm',
    component: ScheduleConfirmView,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 96,
      }
    }

    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    isBackNavigation = false
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (isAuthenticated() && isBackNavigation && publicRouteNames.has(to.name)) {
    isBackNavigation = false
    return false
  }

  return true
})

router.afterEach(() => {
  isBackNavigation = false
})

export default router
