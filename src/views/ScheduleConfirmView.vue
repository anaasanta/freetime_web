<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, CalendarDays, CheckCircle2, Clock3 } from 'lucide-vue-next'
import { getScheduleConfirmCopy } from '@/data/scheduleCopyI18n'
import { confirmSchedule, useAppSession } from '@/stores/appSession'
import { useI18n } from '@/stores/i18n'

const props = defineProps({
  draft: {
    type: Object,
    default: null,
  },
  allActivities: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['confirm'])
const router = useRouter()
const { currentLanguage } = useI18n()
const { scheduleDraft, allActivities: sessionActivities } = useAppSession()
const scheduleCopy = computed(() => getScheduleConfirmCopy(currentLanguage.value))
const visibleDraft = computed(() => props.draft ?? scheduleDraft.value)
const visibleActivities = computed(() => (props.allActivities.length > 0 ? props.allActivities : sessionActivities.value))

const activity = computed(() => {
  if (!visibleDraft.value) return null
  return visibleActivities.value.find((item) => item.id === visibleDraft.value.activityId)
})

function handleConfirm() {
  emit('confirm')
  confirmSchedule()
  router.push({ name: 'profile' })
}
</script>

<template>
    <main class="confirm-page">
        <div v-if="visibleDraft && activity" class="confirm-layout">
        <section class="confirm-main">
          <span class="chip">{{ scheduleCopy.chip }}</span>

          <h1>{{ scheduleCopy.title }}</h1>

          <div class="selected-activity" :class="`tone-${activity.tone}`">
            <div class="activity-icon">
              <CheckCircle2 :size="32" />
            </div>

            <div>
              <h2>{{ activity.title }}</h2>
              <p>{{ activity.shortDescription }}</p>
            </div>
          </div>

          <div class="settings-grid">
            <div class="setting-card">
              <CalendarDays :size="24" />
              <span>{{ scheduleCopy.labels.day }}</span>
              <strong>{{ visibleDraft.day }}</strong>
            </div>

            <div class="setting-card">
              <Clock3 :size="24" />
              <span>{{ scheduleCopy.labels.time }}</span>
              <strong>{{ visibleDraft.time }}</strong>
            </div>

            <div class="setting-card">
              <Bell :size="24" />
              <span>{{ scheduleCopy.labels.reminder }}</span>
              <strong>{{ visibleDraft.reminder }}</strong>
            </div>
          </div>
        </section>

        <aside class="summary-panel">
          <h2>{{ scheduleCopy.summaryTitle }}</h2>

          <div class="summary-item">
            <span>{{ scheduleCopy.labels.activity }}</span>
            <strong>{{ activity.title }}</strong>
          </div>

          <div class="summary-item">
            <span>{{ scheduleCopy.labels.day }}</span>
            <strong>{{ visibleDraft.day }}</strong>
          </div>

          <div class="summary-item">
            <span>{{ scheduleCopy.labels.time }}</span>
            <strong>{{ visibleDraft.time }}</strong>
          </div>

          <div class="summary-item">
            <span>{{ scheduleCopy.labels.reminder }}</span>
            <strong>{{ visibleDraft.reminder }}</strong>
          </div>

          <button class="primary-button" type="button" @click="handleConfirm">
            {{ scheduleCopy.confirm }}
          </button>
        </aside>
      </div>

    <div v-else class="empty-confirm">
        <h1>{{ scheduleCopy.empty }}</h1>
    </div>
    </main>
</template>

<style scoped>
.confirm-page {
  width: 100%;
  min-height: 100vh;
  padding: 24px 28px 36px;
  display: flex;
  align-items: stretch;
}

.confirm-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(380px, 0.9fr);
  gap: 24px;
  width: 100%;
  min-height: calc(100vh - 60px);
}

.confirm-main {
  display: grid;
  align-content: center;
  gap: 28px;
  padding: clamp(32px, 5vw, 72px);
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 32px rgba(90, 110, 140, 0.06);
}

.confirm-main h1 {
  margin: 0;
  color: var(--foreground);
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.selected-activity {
  display: flex;
  gap: 18px;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 28px;
  padding: 20px;
  background: white;
}

.activity-icon {
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  border-radius: 22px;
  color: var(--foreground);
}

.selected-activity h2 {
  margin: 0;
  color: var(--foreground);
}

.selected-activity p {
  margin: 6px 0 0;
  color: var(--muted-foreground);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.setting-card {
  display: grid;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.44);
  backdrop-filter: blur(14px);
}

.empty-confirm {
  width: min(100%, 900px);
  margin: auto;
  padding: 40px;
}

.setting-card svg {
  color: var(--violet);
}

.setting-card span {
  color: var(--muted-foreground);
  font-weight: 800;
}

.setting-card strong {
  color: var(--foreground);
}

.summary-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: clamp(32px, 4vw, 52px);
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 32px rgba(90, 110, 140, 0.06);
}

.summary-panel h2 {
  margin: 0 0 8px;
  color: var(--foreground);
}

.summary-item {
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.46);
  backdrop-filter: blur(14px);
}

.summary-item span {
  display: block;
  color: var(--muted-foreground);
  font-size: 0.85rem;
  font-weight: 800;
}

.summary-item strong {
  display: block;
  margin-top: 4px;
  color: var(--foreground);
}

.summary-panel .primary-button {
  margin-top: auto;
}

@media (max-width: 900px) {
  .confirm-page {
    padding: 18px;
  }

  .confirm-layout {
    grid-template-columns: 1fr;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
