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
import AppContainer from '@/components/ui/AppContainer.vue'
import AppPanel from '@/components/ui/AppPanel.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
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
    <AppContainer>
      <AppNavbar>
        <template #start>
          <AppBrand :brand="landingCopy.nav.brand" :to="{ name: 'landing' }" />
        </template>

        <template #end>
          <ThemeToggle />
        </template>
      </AppNavbar>
    </AppContainer>

    <AppContainer as="section" class="login-container">
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
                class="field-input form-control password-input"
                :type="passwordFieldType"
                :placeholder="loginCopy.fields.password.placeholder"
                :autocomplete="loginCopy.fields.password.autocomplete"
              />

              <button
                class="password-toggle-button btn"
                type="button"
                :aria-label="passwordToggleLabel"
                :title="passwordToggleLabel"
                @click="togglePasswordVisibility"
              >
                <Eye v-if="!isPasswordVisible" :size="24" />
                <EyeOff v-else :size="24" />
              </button>
            </span>
          </label>

          <FormMessage v-if="loginError">
            {{ loginError }}
          </FormMessage>

          <BaseButton type="submit">
            {{ loginCopy.submitLabel }}
          </BaseButton>
        </form>

        <div class="login-links">
          <BaseButton variant="text" @click="router.push({ name: 'forgot-password' })">
            {{ loginCopy.links.forgotPassword }}
          </BaseButton>

          <BaseButton variant="text" @click="router.push({ name: 'register' })">
            {{ loginCopy.links.register }}
          </BaseButton>
        </div>
      </AppPanel>

      <div class="login-test-access">
        <BaseButton variant="secondary" class="login-test-button" @click="fillSampleUser">
          {{ loginCopy.testAccess.buttonLabel }}
        </BaseButton>

        <p class="login-test-caption">
          <strong>{{ loginCopy.testAccess.helperLabel }}:</strong>
          {{ sampleUserSummary }}
        </p>
      </div>
    </AppContainer>
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
  width: min(100%, 980px);
  max-width: 980px;
  margin-top: 84px;
  box-shadow: var(--shadow-panel-strong);
  backdrop-filter: blur(22px);
}

.login-header {
  max-width: none;
}

.login-header .page-title {
  color: var(--violet-strong);
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;
  white-space: nowrap;
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
  width: min(100%, 500px);
  min-height: 56px;
  padding: 0.95rem 1.6rem;
  border: 2px solid color-mix(in srgb, var(--sky) 58%, white);
  background:
    linear-gradient(100deg, var(--violet-strong) 0%, var(--violet) 52%, var(--sky) 100%);
  color: white;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-align: center;
  text-shadow: 0 1px 2px rgba(15, 23, 42, 0.34);
  box-shadow:
    0 18px 38px color-mix(in srgb, var(--emerald) 42%, transparent),
    0 0 0 5px color-mix(in srgb, var(--emerald) 34%, transparent),
    0 0 34px color-mix(in srgb, var(--emerald) 34%, transparent);
}

.login-test-button:hover,
.login-test-button:focus-visible {
  border-color: color-mix(in srgb, var(--sky) 78%, white);
  background:
    linear-gradient(100deg, color-mix(in srgb, var(--violet-strong) 88%, white) 0%, var(--violet) 46%, color-mix(in srgb, var(--sky) 92%, white) 100%);
  color: #ffffff;
  box-shadow:
    0 24px 48px color-mix(in srgb, var(--emerald) 50%, transparent),
    0 0 0 6px color-mix(in srgb, var(--emerald) 42%, transparent),
    0 0 42px color-mix(in srgb, var(--emerald) 42%, transparent);
  transform: translateY(-2px) scale(1.01);
}

.login-test-button:focus-visible {
  outline: 4px solid color-mix(in srgb, var(--emerald) 62%, transparent);
  outline-offset: 4px;
}

:global(:root[data-theme='dark']) .login-test-button {
  border-color: color-mix(in srgb, var(--sky) 70%, white);
  box-shadow:
    0 20px 52px color-mix(in srgb, var(--emerald) 58%, transparent),
    0 0 0 5px color-mix(in srgb, var(--emerald) 46%, transparent),
    0 0 46px color-mix(in srgb, var(--emerald) 44%, transparent);
}

.login-test-caption {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 1.2rem;
  line-height: 1.5;
  text-align: center;
}

.login-test-caption strong {
  color: var(--violet-strong);
}

.password-field {
  gap: 8px;
}

.password-input-wrap {
  position: relative;
  display: block;
  width: 100%;
}

.password-input {
  padding-right: 64px;
}

.password-toggle-button {
  position: absolute;
  top: 50%;
  right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
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

  .login-header .page-title {
    white-space: normal;
  }
}
</style>
