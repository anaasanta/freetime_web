<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Eye, EyeOff } from 'lucide-vue-next'
import { mockUsers } from '@/data/mockUser'
import { landingCopy } from '@/data/uiText'
import { getAuthCopy } from '@/data/authCopyI18n'
import AppBrand from '@/components/layout/AppBrand.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
import AppPanel from '@/components/ui/AppPanel.vue'
import BaseField from '@/components/ui/BaseField.vue'
import FormMessage from '@/components/ui/FormMessage.vue'
import { useAppSession } from '@/stores/appSession'
import { useI18n } from '@/stores/i18n'

const route = useRoute()
const router = useRouter()
const { loginError, login } = useAppSession()
const { currentLanguage } = useI18n()

const loginCopy = computed(() => getAuthCopy(currentLanguage.value).login)
const isPasswordVisible = ref(false)

const username = ref(loginCopy.value.defaultCredentials.username)
const password = ref(loginCopy.value.defaultCredentials.password)

const primarySampleUser = computed(() => mockUsers[0] ?? null)

const sampleUsers = computed(() =>
  mockUsers.map(
    (user) => `${user.username}${loginCopy.value.testAccess.pairSeparator}${user.password}`,
  ),
)

const sampleUserSummary = computed(() =>
  sampleUsers.value.join(loginCopy.value.testAccess.listSeparator),
)

const passwordFieldType = computed(() => (isPasswordVisible.value ? 'text' : 'password'))

const passwordToggleLabel = computed(() =>
  isPasswordVisible.value
    ? loginCopy.value.passwordToggle.hideLabel
    : loginCopy.value.passwordToggle.showLabel,
)

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
  isPasswordVisible.value = false
}

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
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
          <ThemeToggle />
        </template>
      </AppNavbar>
    </div>

    <section class="page-container login-container">
      <AppPanel panel-class="login-card">
        <div class="page-header login-header">
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

          <label class="field-label password-field" :for="loginCopy.fields.password.id">
            <span class="field-label-text">{{ loginCopy.fields.password.label }}</span>

            <span class="password-input-wrap">
              <input
                :id="loginCopy.fields.password.id"
                v-model="password"
                class="field-input password-input"
                :type="passwordFieldType"
                :placeholder="loginCopy.fields.password.placeholder"
                :autocomplete="loginCopy.fields.password.autocomplete"
              />

              <button
                class="password-toggle-button"
                type="button"
                :aria-label="passwordToggleLabel"
                :title="passwordToggleLabel"
                @click="togglePasswordVisibility"
              >
                <Eye v-if="!isPasswordVisible" :size="18" />
                <EyeOff v-else :size="18" />
              </button>
            </span>
          </label>

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
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--violet-soft) 24%, transparent), transparent 30%),
    radial-gradient(circle at 80% 18%, color-mix(in srgb, var(--sky-soft) 22%, transparent), transparent 24%),
    linear-gradient(180deg, color-mix(in srgb, var(--background) 94%, white), var(--background));
}

.login-container {
  display: grid;
  justify-items: center;
  gap: 16px;
}

.login-card {
  width: min(100%, 760px);
  max-width: 760px;
  margin-top: 84px;
  box-shadow: var(--shadow-panel-strong);
  backdrop-filter: blur(22px);
}

.login-header {
  max-width: 640px;
}

.login-header .page-title {
  color: var(--violet-strong);
  font-size: clamp(2.4rem, 5.5vw, 3.6rem);
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
  margin-top: 0;
}

.login-test-button {
  min-height: 42px;
  padding-inline: 18px;
  border-color: color-mix(in srgb, var(--violet) 22%, var(--border));
  background: linear-gradient(135deg, color-mix(in srgb, var(--violet-soft) 70%, white), color-mix(in srgb, var(--sky-soft) 60%, white));
  color: var(--foreground);
  box-shadow: 0 8px 22px rgba(138, 117, 255, 0.12);
}

.login-test-caption {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.92rem;
  line-height: 1.5;
  text-align: center;
}

.login-test-caption strong {
  color: var(--violet-strong);
}

.password-field {
  gap: 0;
}

.password-input-wrap {
  position: relative;
}

.password-input {
  padding-right: 52px;
}

.password-toggle-button {
  position: absolute;
  top: 50%;
  right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--muted-foreground);
  transform: translateY(-50%);
  cursor: pointer;
}

.password-toggle-button:hover,
.password-toggle-button:focus-visible {
  color: var(--foreground);
  background: color-mix(in srgb, var(--violet-soft) 55%, transparent);
  outline: none;
}

@media (max-width: 640px) {
  .login-links {
    flex-direction: column;
    align-items: flex-start;
  }

  .login-card {
    margin-top: 56px;
  }
}
</style>
