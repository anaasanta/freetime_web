<script setup>
import {
  Amphora,
  Bike,
  BookOpen,
  CirclePlay,
  CookingPot,
  Dumbbell,
  Footprints,
  HandFist,
  Headphones,
  Languages,
  MountainSnow,
  Music,
  NotebookPen,
  Origami,
  Palette,
  Pencil,
  Rose,
  ScissorsLineDashed,
  Sparkles,
  Spool,
  SunMedium,
  Volleyball,
  Waves,
} from 'lucide-vue-next'
import { activityCopy } from '@/data/uiText'

const props = defineProps({
  savedActivities: {
    type: Array,
    default: () => [],
  },
  recommendedActivities: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['open-activity', 'schedule-activity'])

const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1)

function iconFor(activity) {
  if (!activity) return Sparkles

  if (activity.icon === 'dumbbell') return Dumbbell
  if (activity.icon === 'footprints') return Footprints
  if (activity.icon === 'headphones') return Headphones
  if (activity.icon === 'palette') return Palette
  if (activity.icon === 'pencil') return Pencil
  if (activity.icon === 'book') return BookOpen
  if (activity.icon === 'amphora') return Amphora
  if (activity.icon === 'bike') return Bike
  if (activity.icon === 'circle-play') return CirclePlay
  if (activity.icon === 'cooking-pot') return CookingPot
  if (activity.icon === 'hand-fist') return HandFist
  if (activity.icon === 'languages') return Languages
  if (activity.icon === 'mountain-snow') return MountainSnow
  if (activity.icon === 'music') return Music
  if (activity.icon === 'notebook-pen') return NotebookPen
  if (activity.icon === 'origami') return Origami
  if (activity.icon === 'rose') return Rose
  if (activity.icon === 'scissors-line-dashed') return ScissorsLineDashed
  if (activity.icon === 'spool') return Spool
  if (activity.icon === 'sun-medium') return SunMedium
  if (activity.icon === 'volleyball') return Volleyball
  if (activity.icon === 'waves') return Waves

  return Sparkles
}

function scheduleYoga() {
  emit('schedule-activity', 'yoga', 'Dimarts', '12:30', '10 min abans')
}

function scheduleDrawing() {
  emit('schedule-activity', 'drawing', 'Divendres', '22:00', '30 min abans')
}
</script>

<template>
    <main class="schedule-page">
        <div class="schedule-layout">
        <section class="calendar-panel">
          <span class="chip">Programar</span>

          <h1>Tria un dia del calendari</h1>

          <div class="month-card">
            <h2>Març</h2>

            <div class="calendar-grid">
              <span v-for="dayName in ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg']" :key="dayName">
                {{ dayName }}
              </span>

              <button
                v-for="day in calendarDays"
                :key="day"
                class="calendar-day"
                :class="{ selected: day === 23 || day === 26 }"
                type="button"
              >
                {{ day }}
              </button>
            </div>
          </div>

          <p class="hint">
            Per al prototip funcional, pots programar Yoga el dimarts o Dibuix relaxant el divendres.
          </p>
        </section>

        <section class="activities-panel">
          <div>
            <div class="section-heading">
              <h2>De la teva llista</h2>
              <span class="chip">Guardades</span>
            </div>

            <div v-if="savedActivities.length > 0" class="activity-list">
              <article
                v-for="activity in savedActivities"
                :key="activity.id"
                class="activity-card"
                :class="`tone-${activity.tone}`"
                @click="emit('open-activity', activity.id)"
              >
                <div class="activity-icon">
                  <component :is="iconFor(activity)" :size="26" />
                </div>

                <div>
                  <h3>{{ activity.title }}</h3>
                  <p>{{ activity.duration }} {{ activityCopy.durationUnit }}</p>
                </div>

                <button
                  v-if="activity.id === 'yoga'"
                  class="primary-button"
                  type="button"
                  @click.stop="scheduleYoga"
                >
                  Programar
                </button>
              </article>
            </div>

            <div v-else class="empty-state">
              Encara no tens activitats guardades.
            </div>
          </div>

          <div>
            <div class="section-heading">
              <h2>Recomanacions</h2>
              <span class="chip">Per a tu</span>
            </div>

            <div class="activity-list">
              <article
                v-for="activity in recommendedActivities"
                :key="activity.id"
                class="activity-card"
                :class="`tone-${activity.tone}`"
                @click="emit('open-activity', activity.id)"
              >
                <div class="activity-icon">
                  <component :is="iconFor(activity)" :size="26" />
                </div>

                <div>
                  <h3>{{ activity.title }}</h3>
                  <p>{{ activity.duration }} {{ activityCopy.durationUnit }}</p>
                </div>

                <button
                  v-if="activity.id === 'drawing'"
                  class="primary-button"
                  type="button"
                  @click.stop="scheduleDrawing"
                >
                  Programar
                </button>
              </article>
            </div>
          </div>
        </section>
      </div>
  </main>
</template>

<style scoped>

.schedule-page {
  width: 100%;
  min-height: 100vh;
  padding: 24px 28px 36px;
}

.schedule-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 24px;
  width: 100%;
  min-height: calc(100vh - 60px);
}

.calendar-panel,
.activities-panel {
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 32px rgba(90, 110, 140, 0.06);
}

.calendar-panel {
  padding: clamp(28px, 4vw, 52px);
}

.activities-panel {
  display: grid;
  gap: 30px;
  padding: clamp(28px, 4vw, 52px);
  align-content: start;
}

.calendar-panel h1 {
  margin: 20px 0;
  color: var(--foreground);
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.month-card {
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 28px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(14px);
}

.month-card h2 {
  margin: 0 0 18px;
  text-align: center;
  color: var(--foreground);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  text-align: center;
}

.calendar-grid span {
  color: var(--muted-foreground);
  font-weight: 800;
}

.calendar-day {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  justify-self: center;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  color: var(--muted-foreground);
  font-weight: 900;
  box-shadow: 0 8px 22px rgba(90, 110, 140, 0.04);
}

.calendar-day.selected {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
}

.hint {
  margin: 18px 0 0;
  border-radius: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(14px);
  color: var(--muted-foreground);
  line-height: 1.5;
}



.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.section-heading h2 {
  margin: 0;
  color: var(--foreground);
}

.activity-list {
  display: grid;
  gap: 14px;
}

.activity-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.44);
  backdrop-filter: blur(14px);
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(90, 110, 140, 0.12);
}

.activity-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 20px;
  color: var(--foreground);
}

.activity-card h3 {
  margin: 0;
  color: var(--foreground);
}

.activity-card p {
  margin: 4px 0 0;
  color: var(--muted-foreground);
}

@media (max-width: 980px) {
  .schedule-page {
    padding: 18px;
  }

  .schedule-layout {
    grid-template-columns: 1fr;
  }

  .activity-card {
    grid-template-columns: auto 1fr;
  }

  .activity-card .primary-button {
    grid-column: 1 / -1;
  }
}
</style>
