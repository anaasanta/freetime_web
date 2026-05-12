<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppPanel from '@/components/ui/AppPanel.vue'
import { getAuthCopy } from '@/data/authCopyI18n'
import { useI18n } from '@/stores/i18n'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  note: {
    type: String,
    default: '',
  },
  backLabel: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['back'])

const route = useRoute()
const router = useRouter()
const { currentLanguage } = useI18n()

const routeCopyKeys = {
  'forgot-password': 'forgotPassword',
  register: 'register',
  settings: 'settings',
  'ai-consult': 'aiConsult',
}

const authPageCopy = computed(() => getAuthCopy(currentLanguage.value))
const routeCopy = computed(() => authPageCopy.value[routeCopyKeys[route.name]] ?? authPageCopy.value.register)

const content = computed(() => ({
  title: props.title || routeCopy.value.title,
  description: props.description || routeCopy.value.description,
  note: props.note || routeCopy.value.note,
  backLabel:
    props.backLabel ||
    (route.name === 'settings' && route.query.from === 'home'
      ? authPageCopy.value.settings.backHomeLabel
      : routeCopy.value.backLabel),
}))

function goBack() {
  emit('back')

  if (route.name === 'settings') {
    router.push({ name: route.query.from === 'home' ? 'home' : 'profile' })
    return
  }

  if (route.name === 'ai-consult') {
    router.push({ name: 'home' })
    return
  }

  router.push({ name: 'login' })
}
</script>

<template>
  <main class="app-page auth-placeholder-page">
    <section class="page-container auth-placeholder-container">
      <AppPanel panel-class="auth-placeholder-card">
        <div class="page-stack">
          <div class="page-header">
            <h1 class="page-title">{{ content.title }}</h1>
            <p class="page-description">{{ content.description }}</p>
          </div>

          <p v-if="content.note" class="placeholder-note">
            {{ content.note }}
          </p>

          <button class="secondary-button placeholder-back" type="button" @click="goBack">
            {{ content.backLabel }}
          </button>
        </div>
      </AppPanel>
    </section>
  </main>
</template>

<style scoped>
.auth-placeholder-page {
  display: flex;
  align-items: center;
}

.auth-placeholder-container {
  display: flex;
  justify-content: center;
}

.auth-placeholder-card {
  width: min(100%, 720px);
  max-width: 720px;
}

.placeholder-note {
  margin: 0;
  border: 1px dashed var(--border);
  border-radius: 20px;
  padding: 18px 20px;
  background: color-mix(in srgb, var(--surface-contrast) 76%, transparent);
  color: var(--muted-foreground);
  line-height: 1.65;
}

.placeholder-back {
  justify-self: start;
}
</style>
