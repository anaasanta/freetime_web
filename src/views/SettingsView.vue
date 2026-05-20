<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import AccessibilityControls from '@/components/accessibility/AccessibilityControls.vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import AppPanel from '@/components/ui/AppPanel.vue'
import AppTooltip from '@/components/ui/AppTooltip.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import { getAuthCopy } from '@/data/authCopyI18n'
import { useI18n } from '@/stores/i18n'

const route = useRoute()
const router = useRouter()
const { currentLanguage, t } = useI18n()

// Textos de ajustes segun el idioma seleccionado.
const authPageCopy = computed(() => getAuthCopy(currentLanguage.value))
const settingsCopy = computed(() => authPageCopy.value.settings)
const backTooltip = computed(() => settingsCopy.value.backTooltip)

function goBack() {
    // Si ajustes se abrio desde home, volvemos a home; si no, al perfil.
  router.push({ name: route.query.from === 'home' ? 'home' : 'profile' })
}
</script>

<template>
  <main class="app-page settings-page">
    <AppContainer as="section" class="settings-container">
      <AppPanel panel-class="settings-card">
        <div class="settings-stack">
          <AppTooltip :label="backTooltip" position="bottom" class="settings-back-tooltip">
            <button class="settings-back btn" type="button" :aria-label="backTooltip" @click="goBack">
              <ChevronLeft :size="22" />
            </button>
          </AppTooltip>

          <SectionHeader
            :title="settingsCopy.title"
            title-as="h1"
            size="page"
          />

          <section class="settings-section" :aria-label="t.accessibility.title">
            <div class="settings-section__head">
              <p>{{ t.accessibility.title }}</p>
              <h2>{{ t.accessibility.quickOptions }}</h2>
            </div>

            <AccessibilityControls />
          </section>
        </div>
      </AppPanel>
    </AppContainer>
  </main>
</template>

<style scoped>
.settings-page {
  display: flex;
  align-items: center;
}

.settings-container {
  display: flex;
  justify-content: center;
}

.settings-card {
  width: min(100%, 780px);
  max-width: 780px;
}

.settings-stack {
  display: grid;
  gap: 26px;
}

.settings-back {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 50%;
  background: color-mix(in srgb, var(--surface-contrast) 78%, transparent);
  color: var(--foreground);
  box-shadow: var(--shadow-soft);
}

.settings-back:hover,
.settings-back:focus-visible {
  border-color: var(--border-focus);
  box-shadow: var(--shadow-panel);
}

.settings-back-tooltip {
  justify-self: start;
}

.settings-section {
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 24px;
  background: color-mix(in srgb, var(--surface-contrast) 74%, transparent);
}

.settings-section__head p {
  margin: 0 0 4px;
  color: var(--foreground-muted-soft);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.settings-section__head h2 {
  margin: 0;
  color: var(--foreground);
  font-size: 1.35rem;
}
</style>
