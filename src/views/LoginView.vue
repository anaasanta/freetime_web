<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockUsers } from '@/data/mockUser'
import { authCopy, landingCopy, themeCopy } from '@/data/uiText'
import AppBrand from '@/components/layout/AppBrand.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
import AppPanel from '@/components/ui/AppPanel.vue'
import BaseField from '@/components/ui/BaseField.vue'
import FormMessage from '@/components/ui/FormMessage.vue'
import { useAppSession } from '@/stores/appSession'

const route = useRoute()
const router = useRouter()
const { loginError, login } = useAppSession()

const loginCopy = authCopy.login

const username = ref(loginCopy.defaultCredentials.username)
const password = ref(loginCopy.defaultCredentials.password)

const primarySampleUser = computed(() => mockUsers[0] ?? null)

const sampleUsers = computed(() =>
  mockUsers.map((user) => `${user.username} / ${user.password}`),
)

const sampleUserSummary = computed(() => sampleUsers.value.join(' · '))

function submitLogin() {
  const isValid = login({
    username: username.value.trim(),
    password: password.value,
  })

  if (!isValid) return

  const redirectTarget =
    typeof route.query.redirect === 'string' ? route.query.redirect : null

  router.replace(redirectTarget || { name: 'home' })
}

function fillSampleUser() {
  if (!primarySampleUser.value) return

  username.value = primarySampleUser.value.username
  password.value = primarySampleUser.value.password
}
</script>

<template>
  <main class="app-page login-page">
    <div class="page-container">
      <AppNavbar>
        <template #start>
          <AppBrand :brand="landingCopy.nav.brand" :to="{ name: 'landing' }" />
        </template>

        <template #end>
          <ThemeToggle :labels="themeCopy.toggle" />
        </template>
      </AppNavbar>
    </div>

    <section class="page-container login-container">
      <AppPanel panel-class="login-card">
        <div class="page-header">
          <h1 class="page-title">{{ loginCopy.title }}</h1>

          <p class="page-description">{{ loginCopy.description }}</p>
        </div>

        <form class="form-stack" @submit.prevent="submitLogin">
          <BaseField
            :id="loginCopy.fields.username.id"
            v-model="username"
            :label="loginCopy.fields.username.label"
            :placeholder="loginCopy.fields.username.placeholder"
            :autocomplete="loginCopy.fields.username.autocomplete"
          />

          <BaseField
            :id="loginCopy.fields.password.id"
            v-model="password"
            :label="loginCopy.fields.password.label"
            type="password"
            :placeholder="loginCopy.fields.password.placeholder"
            :autocomplete="loginCopy.fields.password.autocomplete"
          />

          <FormMessage v-if="loginError">
            {{ loginError }}
          </FormMessage>

          <button class="primary-button" type="submit">
            {{ loginCopy.submitLabel }}
          </button>
        </form>

        <div class="login-links">
          <button class="text-link-button" type="button" @click="router.push({ name: 'forgot-password' })">
            {{ loginCopy.links.forgotPassword }}
          </button>

          <button class="text-link-button" type="button" @click="router.push({ name: 'register' })">
            {{ loginCopy.links.register }}
          </button>
        </div>
      </AppPanel>

      <div class="login-test-access">
        <button class="secondary-button login-test-button" type="button" @click="fillSampleUser">
          {{ loginCopy.testAccess.buttonLabel }}
        </button>

        <p class="login-test-caption">
          <strong>{{ loginCopy.testAccess.helperLabel }}:</strong>
          {{ sampleUserSummary }}
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
}
.login-container {
  display: grid;
  justify-items: center;
}

.login-card {
  width: min(100%, 820px);
  max-width: 720px;
  max-height: 500px;;
  margin-top: 200px;
  box-shadow: var(--shadow-panel-strong);
  backdrop-filter: blur(22px);
}

.login-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
}

.login-test-access {
  display: grid;
  justify-items: center;
  gap: 10px;
  width: min(100%, 720px);
  max-width: 720px;
  margin-top: 14px;
}

.login-test-button {
  min-height: 42px;
  padding-inline: 18px;
  border-color: var(--info-border);
  background: color-mix(in srgb, var(--surface-contrast) 82%, var(--gradient-1));
  color: var(--info-accent);
  box-shadow: 0 8px 22px rgba(125, 211, 252, 0.12);
}

.login-test-caption {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.92rem;
  line-height: 1.5;
  text-align: center;
}

.login-test-caption strong {
  color: var(--info-accent);
}

@media (max-width: 640px) {
  .login-links {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
