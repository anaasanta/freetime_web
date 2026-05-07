<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  BookOpen,
  Dumbbell,
  Footprints,
  Headphones,
  Heart,
  Palette,
  Pencil,
  Sparkles,
  Trash2,
  Plus,
  X,
  CircleHelp,
} from 'lucide-vue-next'
import { activityResultConfig as c } from '@/data/activityResultConfig'
import {
  addSavedActivity,
  rejectActivity,
  removeSavedActivity,
  startActivity,
  syncSelectedActivity,
  useAppSession,
} from '@/stores/appSession'
import { activityCopy } from '@/data/uiText'

const route = useRoute()
const router = useRouter()

const { selectedActivity, selectedActivitySource, savedActivities } = useAppSession()

function syncFromRoute() {
  const activityId = typeof route.params.id === 'string' ? route.params.id : null
  const source = typeof route.query.source === 'string' ? route.query.source : 'normal'

  syncSelectedActivity(activityId, source)
}

watch(() => [route.params.id, route.query.source], syncFromRoute, { immediate: true })

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

function handleReject() {
  if (!selectedActivity.value) return
  rejectActivity(selectedActivity.value.id)
  router.replace({ name: 'home' })
}
</script>

<template>
  <main class="app-page detail-page">
    <div v-if="selectedActivity" class="detail-card">
      <section class="detail-visual" :class="`tone-${selectedActivity.tone}`">
        <div class="detail-icon activity-icon">
          <component :is="iconFor(selectedActivity.icon)" :size="78" />
        </div>

        <h1>{{ selectedActivity.title }}</h1>

        <p>{{ selectedActivity.shortDescription }}</p>
      </section>

      <section class="detail-content">
        <button
          class="close-detail-button"
          type="button"
          :aria-label="activityCopy.closeLabel"
          @click="router.push({ name: 'home' })"
        >
          <X :size="22" />
        </button>

        <div class="info-grid">
          <div>
            <span>Temps</span>
            <strong>{{ selectedActivity.duration }} {{ activityCopy.durationUnit }}</strong>
          </div>
          <div>
            <span>Dificultat</span>
            <strong>{{ selectedActivity.difficulty }}</strong>
          </div>
          <div>
            <span>Materials</span>
            <strong>{{ selectedActivity.materials }}</strong>
          </div>
          <div>
            <span>Preu</span>
            <strong>{{ selectedActivity.price }}</strong>
          </div>
          <div>
            <span>Energia</span>
            <strong>{{ selectedActivity.energy }}</strong>
          </div>
        </div>

        <section class="text-section">
          <h2>Descripció</h2>
          <p>{{ selectedActivity.description }}</p>
        </section>

        <section class="text-section">
          <h2>{{ c.sections.howToStart }}</h2>
          <ol class="steps-list">
            <li v-for="step in selectedActivity.steps" :key="step">
              {{ step }}
            </li>
          </ol>
        </section>

        <section class="benefit-box">
          <strong>Benefici destacat</strong>
          <p>{{ selectedActivity.benefits }}</p>
        </section>
        <section class="ai-consult-strip">
          <div class="ai-consult-copy">
            <CircleHelp :size="18" />
            <span>{{ activityCopy.aiConsult.question }}</span>
          </div>

          <button class="secondary-button ai-consult-button" type="button" @click="router.push({ name: 'ai-consult' })">
            {{ activityCopy.aiConsult.button }}
          </button>
        </section>

        <div class="actions">
          <button class="primary-button" type="button" @click="handleStart">
            Començar activitat
          </button>

          <button
            class="list-button"
            :class="{ saved: isSaved }"
            type="button"
            @click="handleSaveToggle"
          >
            <Trash2 v-if="isSaved" :size="18" />
            <Plus v-else :size="18" />
            {{ isSaved ? c.buttons.removeFromList : c.buttons.addToList }}
          </button>

          <button
            v-if="selectedActivitySource === 'test'"
            class="danger-button"
            type="button"
            @click="handleReject"
          >
            {{ c.buttons.reject }}
          </button>

          <button class="secondary-button" type="button" @click="router.push({ name: 'home' })">
            Feedback
          </button>
        </div>


      </section>
    </div>

    <div v-else class="empty-detail">
      <h1>No s’ha trobat aquesta activitat</h1>

      <button class="primary-button" type="button" @click="router.push({ name: 'home' })">
        Tornar a Home
      </button>
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  display: flex;
  align-items: stretch;
  padding: 0;
  height: 100vh;
  overflow-y: auto;
  background: var(--background);
}

.detail-card {
  display: grid;
  grid-template-columns: minmax(420px, 0.9fr) minmax(560px, 1.1fr);
  width: 100%;
  align-items: start;
}

.detail-visual {
  display: flex;
  margin-top: 150px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: clamp(50px, 6vw, 96px);
  background: transparent;
}

.detail-icon {
  display: grid;
  place-items: center;
  width: clamp(150px, 14vw, 210px);
  height: clamp(150px, 14vw, 210px);
  margin: 0 auto 32px 0;
  border-radius: 48px;
  color: var(--foreground);
  box-shadow: var(--shadow-soft);
}

.detail-chip {
  width: fit-content;
  background: var(--card);
  backdrop-filter: blur(12px);
}

.detail-visual h1 {
  max-width: 620px;
  margin: 24px 0 16px;
  color: var(--foreground);
  font-size: clamp(4rem, 6vw, 7rem);
  line-height: 1;
  letter-spacing: -0.07em;
  text-align: left;
}

.detail-visual p {
  max-width: 620px;
  margin: 0;
  color: var(--foreground);
  text-align: left;
}
.detail-content {
  position: relative;
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr) auto auto;
  align-content: stretch;
  gap: clamp(18px, 2.6vh, 30px);
  padding: clamp(42px, 5vw, 84px);
  background: var(--surface-strong);
  backdrop-filter: blur(12px);
} 

.close-detail-button {
  position: absolute;
  top: clamp(20px, 3vw, 34px);
  right: clamp(20px, 3vw, 34px);
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 999px;
  background: var(--card);
  color: var(--foreground);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(14px);
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}

.close-detail-button:hover {
  transform: translateY(-1px);
  background: var(--surface-strong);
  box-shadow: var(--shadow-panel-strong);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  padding-right: 56px;
}

.info-grid div {
  display: grid;
  align-content: center;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: var(--radius-control);
  min-height: clamp(118px, 15vh, 170px);
  padding: 22px 14px;
  background: var(--card);
  backdrop-filter: blur(14px);
  text-align: center;
  box-shadow: var(--shadow-panel);
} 

.info-grid span {
  display: block;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 900;
}

.info-grid strong {
  display: block;
  margin-top: 7px;
  color: var(--foreground);
}

.text-section h2 {
  margin: 0 0 12px;
  color: var(--foreground);
  font-size: 1.75rem;
}

.text-section p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.8;
  font-size: 1.02rem;
}

.steps-list {
  display: grid;
  gap: clamp(10px, 1.5vh, 16px);
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Ensure there's consistent spacing after text sections and
   prevent the steps list from pushing the benefit box — if the
   list grows too large, it will scroll instead of overlapping. */
.text-section {
  margin-bottom: clamp(12px, 2vh, 24px);
}

.steps-list {
  max-height: clamp(120px, 30vh, 420px);
  overflow-y: auto;
  padding-right: 8px;
}

.steps-list li {
  display: flex;
  align-items: center;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 20px;
  padding: 16px 18px;
  background: var(--card);
  backdrop-filter: blur(14px);
  color: var(--card-foreground);
} 

.benefit-box {
  border: 1px solid var(--info-border);
  border-radius: var(--radius-card);
  padding: 18px 20px;
  background: color-mix(in srgb, var(--card) 84%, var(--info-soft) 16%);
  backdrop-filter: blur(14px);
  margin-top: clamp(18px, 3vh, 40px);
} 

.benefit-box strong {
  color: var(--info-accent);
}

.benefit-box p {
  margin: 6px 0 0;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 0;
}

.ai-consult-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: var(--radius-control);
  padding: 14px 16px;
  background: var(--card);
  box-shadow: var(--shadow-panel);
} 

.ai-consult-copy {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: var(--foreground);
  font-size: 0.92rem;
}

.ai-consult-copy svg {
  flex: 0 0 auto;
}

.ai-consult-button {
  min-height: 42px;
  padding: 10px 18px;
  flex: 0 0 auto;
}

.list-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
  padding: 12px 20px;
  background: var(--card-solid);
  color: var(--card-foreground);
  font-weight: 900;
  box-shadow: var(--shadow-panel-strong);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
} 

.list-button:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--card-solid) 76%, var(--violet-soft) 24%);
  box-shadow: var(--shadow-panel-strong);
} 

.list-button.saved {
  border-color: var(--border-focus);
  background: linear-gradient(135deg, color-mix(in srgb, var(--violet-soft) 80%, var(--card-solid) 20%), color-mix(in srgb, var(--violet) 24%, var(--card) 76%));
  color: var(--violet-strong);
} 

.empty-detail {
  width: min(100%, 900px);
  margin: auto;
  padding: 40px;
  background: var(--card);
  border-radius: var(--radius-card);
}

@media (max-width: 1100px) {
  .detail-card {
    grid-template-columns: 1fr;
  }

  .detail-visual {
    min-height: 58vh;
  }

  .detail-content {
    justify-content: flex-start;
  }

  .info-grid {
    padding-right: 0;
  }
}

@media (max-width: 760px) {
  .detail-page {
    padding: 0;
  }

  .detail-visual,
  .detail-content {
    padding: 28px;
  }

  .detail-visual h1 {
    font-size: clamp(3rem, 16vw, 4.6rem);
  }

  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .close-detail-button {
    top: 16px;
    right: 16px;
  }

  .ai-consult-strip {
    align-items: stretch;
    flex-direction: column;
  }

  .ai-consult-button {
    width: 100%;
  }

  .actions > * {
    width: 100%;
  }
}
</style>
