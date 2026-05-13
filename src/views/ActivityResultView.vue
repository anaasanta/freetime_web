<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Amphora,
  Bike,
  BookOpen,
  CircleHelp,
  CirclePlay,
  CookingPot,
  Dumbbell,
  Footprints,
  HandFist,
  Headphones,
  Heart,
  Languages,
  MountainSnow,
  Music,
  NotebookPen,
  Origami,
  Palette,
  Pencil,
  Plus,
  Rose,
  ScissorsLineDashed,
  Sparkles,
  Spool,
  SunMedium,
  Volleyball,
  Waves,
  X,
  Trash2,
} from 'lucide-vue-next'
import { getActivityByIdWithTranslations } from '@/data/activitiesCopyI18n'
import { getActivityCopy, getActivityResultCopy } from '@/data/testCopyI18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useI18n } from '@/stores/i18n'
import {
  addSavedActivity,
  rejectActivity,
  removeSavedActivity,
  startActivity,
  syncSelectedActivity,
  useAppSession,
} from '@/stores/appSession'

const route = useRoute()
const router = useRouter()
const { currentLanguage } = useI18n()
const { selectedActivity, selectedActivitySource, savedActivities } = useAppSession()

const showRejectModal = ref(false)
const selectedRejectReason = ref('effort')
const detailVisualRef = ref(null)
const detailIconRef = ref(null)
let resizeObserver = null
const activityImageModules = import.meta.glob('../data/activity_images/*.png', {
  eager: true,
  import: 'default',
})

const activityCopy = computed(() => getActivityCopy(currentLanguage.value))
const activityResultCopy = computed(() => getActivityResultCopy(currentLanguage.value))
const rejectionOptions = computed(() => Object.entries(activityResultCopy.value.rejectModal.options))
const translatedActivity = computed(() => {
  if (!selectedActivity.value) return null
  return getActivityByIdWithTranslations(selectedActivity.value.id, currentLanguage.value) ?? selectedActivity.value
})
const activityImageSrc = computed(() => {
  if (!selectedActivity.value) return null
  return activityImageModules[`../data/activity_images/${selectedActivity.value.id}.png`] ?? null
})

function syncFromRoute() {
  const activityId = typeof route.params.id === 'string' ? route.params.id : null
  const source = typeof route.query.source === 'string' ? route.query.source : 'normal'
  syncSelectedActivity(activityId, source)
}

watch(() => [route.params.id, route.query.source], syncFromRoute, { immediate: true })

function updateDockStartPosition() {
  if (!detailVisualRef.value || !detailIconRef.value) return

  const visualRect = detailVisualRef.value.getBoundingClientRect()
  const iconRect = detailIconRef.value.getBoundingClientRect()
  const visualCenterX = visualRect.left + visualRect.width / 2
  const visualCenterY = visualRect.top + visualRect.height / 2
  const iconCenterX = iconRect.left + iconRect.width / 2
  const iconCenterY = iconRect.top + iconRect.height / 2

  detailVisualRef.value.style.setProperty('--dock-start-x', `${visualCenterX - iconCenterX}px`)
  detailVisualRef.value.style.setProperty('--dock-start-y', `${visualCenterY - iconCenterY}px`)
}

watch(
  () => selectedActivity.value?.id,
  async () => {
    await nextTick()
    updateDockStartPosition()
  },
)

onMounted(() => {
  updateDockStartPosition()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateDockStartPosition)
    if (detailVisualRef.value) resizeObserver.observe(detailVisualRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

const isSaved = computed(() =>
  selectedActivity.value
    ? savedActivities.value.some((activity) => activity.id === selectedActivity.value.id)
    : false,
)

function iconFor(iconName) {
  if (iconName === 'book') return BookOpen
  if (iconName === 'dumbbell') return Dumbbell
  if (iconName === 'footprints') return Footprints
  if (iconName === 'headphones') return Headphones
  if (iconName === 'palette') return Palette
  if (iconName === 'pencil') return Pencil
  if (iconName === 'heart') return Heart
  if (iconName === 'amphora') return Amphora
  if (iconName === 'bike') return Bike
  if (iconName === 'circle-play') return CirclePlay
  if (iconName === 'cooking-pot') return CookingPot
  if (iconName === 'hand-fist') return HandFist
  if (iconName === 'languages') return Languages
  if (iconName === 'mountain-snow') return MountainSnow
  if (iconName === 'music') return Music
  if (iconName === 'notebook-pen') return NotebookPen
  if (iconName === 'origami') return Origami
  if (iconName === 'rose') return Rose
  if (iconName === 'scissors-line-dashed') return ScissorsLineDashed
  if (iconName === 'spool') return Spool
  if (iconName === 'sun-medium') return SunMedium
  if (iconName === 'volleyball') return Volleyball
  if (iconName === 'waves') return Waves
  return Sparkles
}

function handleSaveToggle() {
  if (!selectedActivity.value) return

  if (isSaved.value) {
    removeSavedActivity(selectedActivity.value.id)
  } else {
    addSavedActivity(selectedActivity.value.id)
  }
}

function handleStart() {
  if (!selectedActivity.value) return
  startActivity(selectedActivity.value.id)
  router.push({ name: 'schedule-day' })
}

function openRejectModal() {
  if (!selectedActivity.value) return
  showRejectModal.value = true
}

function closeRejectModal() {
  showRejectModal.value = false
}

function confirmReject() {
  if (!selectedActivity.value) return

  const nextId = rejectActivity(selectedRejectReason.value)
  showRejectModal.value = false

  if (!nextId) {
    router.replace({ name: 'home' })
    return
  }

  router.replace({
    name: 'activity',
    params: { id: nextId },
    query: { source: 'test-adjusted' },
  })
}

function skipRejectQuestion() {
  if (!selectedActivity.value) return

  const nextId = rejectActivity(null)
  showRejectModal.value = false

  if (!nextId) {
    router.replace({ name: 'home' })
    return
  }

  router.replace({
    name: 'activity',
    params: { id: nextId },
    query: { source: 'test-adjusted' },
  })
}
</script>

<template>
  <main class="app-page detail-page">
    <div v-if="selectedActivity && translatedActivity" class="detail-card">
      <section ref="detailVisualRef" class="detail-visual" :class="`tone-${selectedActivity.tone}`">
        <div ref="detailIconRef" :key="selectedActivity.id" class="detail-icon detail-icon-docked activity-icon">
          <component :is="iconFor(selectedActivity.icon)" :size="78" />
        </div>

        <div class="detail-hero-media">
          <img
            v-if="activityImageSrc"
            :src="activityImageSrc"
            :alt="translatedActivity.title"
            class="detail-activity-image"
          />
          <div v-else class="detail-image-fallback activity-icon">
            <component :is="iconFor(selectedActivity.icon)" :size="72" />
          </div>
        </div>

        <div class="detail-visual-copy">
          <h1>{{ translatedActivity.title }}</h1>
          <p>{{ translatedActivity.shortDescription }}</p>
        </div>
      </section>

      <section class="detail-content">
        <button
          class="close-detail-button"
          type="button"
          :aria-label="activityCopy.closeLabel"
          :title="activityCopy.closeLabel"
          @click="router.push({ name: 'home' })"
        >
          <X :size="22" />
        </button>

        <div class="info-grid">
          <div>
            <span>{{ activityResultCopy.labels.duration }}</span>
            <strong>{{ selectedActivity.duration }} {{ activityCopy.durationUnit }}</strong>
          </div>
          <div>
            <span>{{ activityResultCopy.labels.difficulty }}</span>
            <strong>{{ selectedActivity.difficulty }}</strong>
          </div>
          <div>
            <span>{{ activityResultCopy.labels.materials }}</span>
            <strong>{{ translatedActivity.materials }}</strong>
          </div>
          <div>
            <span>{{ activityResultCopy.labels.price }}</span>
            <strong>{{ selectedActivity.price }}</strong>
          </div>
          <div>
            <span>{{ activityResultCopy.labels.energy }}</span>
            <strong>{{ selectedActivity.energy }}</strong>
          </div>
        </div>

        <section class="text-section">
          <h2>{{ activityResultCopy.sections.description }}</h2>
          <p>{{ translatedActivity.description }}</p>
        </section>

        <section class="text-section">
          <h2>{{ activityResultCopy.sections.howToStart }}</h2>
          <ol class="steps-list">
            <li v-for="step in translatedActivity.steps" :key="step">
              {{ step }}
            </li>
          </ol>
        </section>

        <section class="benefit-box">
          <strong>{{ activityResultCopy.sections.benefit }}</strong>
          <p>{{ translatedActivity.benefits }}</p>
        </section>

        <section class="ai-consult-strip">
          <div class="ai-consult-copy">
            <CircleHelp :size="18" />
            <span>{{ activityCopy.aiConsult.question }}</span>
          </div>

          <BaseButton
            variant="secondary"
            class="ai-consult-button"
            @click="router.push({ name: 'ai-consult' })"
          >
            {{ activityCopy.aiConsult.button }}
          </BaseButton>
        </section>

        <div class="actions">
          <BaseButton @click="handleStart">
            {{ activityResultCopy.buttons.start }}
          </BaseButton>

          <button class="list-button" :class="{ saved: isSaved }" type="button" @click="handleSaveToggle">
            <Trash2 v-if="isSaved" :size="18" />
            <Plus v-else :size="18" />
            {{ isSaved ? activityResultCopy.buttons.removeFromList : activityResultCopy.buttons.addToList }}
          </button>

          <BaseButton
            v-if="selectedActivitySource === 'test'"
            variant="danger"
            @click="openRejectModal"
          >
            {{ activityResultCopy.buttons.reject }}
          </BaseButton>

          <BaseButton variant="secondary" @click="router.push({ name: 'home' })">
            {{ activityResultCopy.buttons.feedback }}
          </BaseButton>
        </div>
      </section>
    </div>

    <EmptyState v-else class="empty-detail" :title="activityResultCopy.buttons.notFound">
      <BaseButton @click="router.push({ name: 'home' })">
        {{ activityResultCopy.buttons.backToHome }}
      </BaseButton>
    </EmptyState>

    <div v-if="showRejectModal" class="reject-modal">
      <div class="reject-dialog" role="dialog" :aria-label="activityResultCopy.rejectModal.closeLabel">
        <button
          class="reject-close"
          type="button"
          :aria-label="activityResultCopy.rejectModal.closeLabel"
          :title="activityResultCopy.rejectModal.closeLabel"
          @click="closeRejectModal"
        >
          <X :size="18" />
        </button>
        <h3>{{ activityResultCopy.rejectModal.title }}</h3>
        <p>{{ activityResultCopy.rejectModal.subtitle }}</p>

        <div class="reject-options">
          <button
            v-for="[reason, label] in rejectionOptions"
            :key="reason"
            type="button"
            class="reject-option"
            :class="{ selected: selectedRejectReason === reason }"
            @click="selectedRejectReason = reason"
          >
            {{ label }}
          </button>
        </div>

        <div class="reject-actions">
          <BaseButton variant="secondary" @click="skipRejectQuestion">
            {{ activityResultCopy.rejectModal.skipQuestion }}
          </BaseButton>
          <BaseButton @click="confirmReject">
            {{ activityResultCopy.rejectModal.confirm }}
          </BaseButton>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  padding: 0;
  background:
    radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--violet-soft) 26%, transparent), transparent 28%),
    radial-gradient(circle at 82% 20%, color-mix(in srgb, var(--sky-soft) 22%, transparent), transparent 28%),
    linear-gradient(180deg, var(--background), color-mix(in srgb, var(--background) 82%, var(--violet-soft)));
}

.detail-card {
  display: grid;
  grid-template-columns: minmax(360px, 0.9fr) minmax(640px, 1.1fr);
  width: 100%;
}

.detail-visual {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: flex-start;
  gap: clamp(18px, 3vw, 28px);
  padding: clamp(32px, 5vw, 72px);
}

.detail-icon {
  display: grid;
  place-items: center;
  width: clamp(72px, 7vw, 104px);
  height: clamp(72px, 7vw, 104px);
  border-radius: 28px;
  box-shadow: var(--shadow-soft);
  color: var(--foreground);
}

.detail-icon-docked {
  align-self: start;
  animation: dock-icon 1300ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.detail-hero-media {
  display: grid;
  align-self: center;
  width: min(100%, 520px);
  animation: reveal-activity-image 1200ms ease 520ms both;
}

.detail-activity-image,
.detail-image-fallback {
  width: min(100%, 460px);
  aspect-ratio: 1 / 1;
  border-radius: 32px;
  object-fit: cover;
  object-position: center;
  box-shadow:
    0 28px 70px color-mix(in srgb, var(--violet) 20%, transparent),
    inset 0 1px 0 var(--surface-inset-highlight);
}

.detail-image-fallback {
  display: grid;
  place-items: center;
}

.detail-visual-copy {
  display: grid;
  gap: 12px;
  justify-items: start;
  animation: reveal-activity-copy 980ms ease 760ms both;
}

.detail-visual h1 {
  margin: 0;
  color: var(--foreground);
  font-size: clamp(2.4rem, 5vw, 4.6rem);
  line-height: 1;
  letter-spacing: -0.05em;
}

.detail-visual p {
  max-width: 44ch;
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.7;
}

@keyframes dock-icon {
  from {
    opacity: 0;
    transform: translate(var(--dock-start-x, 42px), var(--dock-start-y, 72px)) scale(1.42);
  }

  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes reveal-activity-image {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes reveal-activity-copy {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-content {
  position: relative;
  display: grid;
  gap: 28px;
  align-content: start;
  padding: clamp(34px, 4.5vw, 74px);
  background: color-mix(in srgb, var(--surface-strong) 94%, transparent);
  backdrop-filter: blur(14px);
}

.close-detail-button {
  position: absolute;
  top: clamp(18px, 3vw, 30px);
  right: clamp(18px, 3vw, 30px);
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 999px;
  background: var(--card);
  color: var(--foreground);
  box-shadow: var(--shadow-panel);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  padding-right: 72px;
}

.info-grid div,
.steps-list li,
.benefit-box,
.ai-consult-strip {
  border: 1px solid var(--surface-stroke-strong);
  background: var(--card);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(14px);
}

.info-grid div {
  display: grid;
  align-content: center;
  min-height: 128px;
  padding: 20px 12px;
  border-radius: 22px;
  text-align: center;
}

.info-grid span {
  color: var(--muted-foreground);
  font-size: clamp(0.64rem, 0.72vw, 0.72rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.info-grid strong {
  margin-top: 8px;
  color: var(--foreground);
  overflow-wrap: anywhere;
  line-height: 1.15;
  font-size: clamp(1rem, 1.25vw, 1.25rem);
}

.text-section h2 {
  margin: 0 0 12px;
  color: var(--foreground);
  font-size: 1.6rem;
}

.text-section p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.75;
}

.steps-list {
  display: grid;
  gap: 12px;
  max-height: 280px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
}

.steps-list li {
  border-radius: 20px;
  padding: 14px 16px;
  color: var(--card-foreground);
}

.benefit-box {
  border-radius: 24px;
  padding: 18px 20px;
}

.benefit-box strong {
  color: var(--violet-strong);
}

.benefit-box p {
  margin: 6px 0 0;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.ai-consult-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-radius: 24px;
  padding: 14px 16px;
}

.ai-consult-copy {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: var(--foreground);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.list-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 12px 20px;
  background: var(--card-solid);
  color: var(--card-foreground);
  font-weight: 900;
  box-shadow: var(--shadow-panel-strong);
}

.list-button.saved {
  border-color: var(--border-focus);
  background: linear-gradient(135deg, color-mix(in srgb, var(--violet-soft) 78%, var(--card-solid) 22%), color-mix(in srgb, var(--violet) 24%, var(--card) 76%));
  color: var(--violet-strong);
}

.empty-detail {
  width: min(100%, 900px);
  margin: auto;
  padding: 40px;
  border-radius: 32px;
  background: var(--card);
}

.reject-modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--background);
  z-index: 1200;
}

.reject-dialog {
  position: relative;
  width: min(100%, 460px);
  padding: 22px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 28px;
  background: var(--surface-contrast);
  color: var(--foreground);
  box-shadow: 0 30px 80px color-mix(in srgb, var(--violet) 24%, transparent);
}

.reject-dialog h3 {
  margin: 0 0 8px;
  font-size: 1.4rem;
}

.reject-dialog p {
  margin: 0 0 18px;
  color: var(--muted-foreground);
}

.reject-close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  font-size: 1.5rem;
}

.reject-options {
  display: grid;
  gap: 10px;
}

.reject-option {
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 12px 14px;
  background: var(--card);
  color: var(--foreground);
  text-align: left;
}

.reject-option.selected {
  border-color: var(--violet-strong);
  background: color-mix(in srgb, var(--violet-soft) 76%, var(--card) 24%);
}

.reject-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

@media (max-width: 1100px) {
  .detail-card {
    grid-template-columns: 1fr;
  }

  .detail-visual {
    min-height: 78vh;
  }

  .info-grid {
    padding-right: 0;
  }
}

@media (max-width: 760px) {
  .detail-visual,
  .detail-content {
    padding: 24px;
  }

  .detail-activity-image,
  .detail-image-fallback {
    width: min(100%, 360px);
  }

  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ai-consult-strip,
  .reject-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .ai-consult-strip .secondary-button,
  .reject-actions > * {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .detail-icon-docked,
  .detail-hero-media,
  .detail-visual-copy {
    animation: none;
  }
}
</style>
