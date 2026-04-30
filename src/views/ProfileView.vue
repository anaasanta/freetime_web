<script setup>
import { computed, ref } from 'vue'
import {
  House,
  Settings,
  LogOut,
  UserRound,
  BookOpen,
  Dumbbell,
  Footprints,
  Headphones,
  Heart,
  Palette,
  Pencil,
  Sparkles,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'

const avatarModules = import.meta.glob('../assets/avatars/*', {
  eager: true,
  import: 'default',
})

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  savedActivities: {
    type: Array,
    default: () => [],
  },
  completedActivities: {
    type: Array,
    default: () => [],
  },
  plannedActivities: {
    type: Array,
    default: () => [],
  },
  allActivities: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['go-home', 'logout', 'go-settings', 'open-activity', 'go-schedule'])

const visibleDate = ref(new Date())
const today = new Date()

const monthNames = [
  'Gener',
  'Febrer',
  'Març',
  'Abril',
  'Maig',
  'Juny',
  'Juliol',
  'Agost',
  'Setembre',
  'Octubre',
  'Novembre',
  'Desembre',
]

const visibleYear = computed(() => visibleDate.value.getFullYear())
const visibleMonth = computed(() => visibleDate.value.getMonth())

const visibleMonthLabel = computed(() => {
  return `${monthNames[visibleMonth.value]} ${visibleYear.value}`
})

const avatarSrc = computed(() => {
  const avatarFile = props.user?.avatar

  if (!avatarFile) return null

  return avatarModules[`../assets/avatars/${avatarFile}`] || null
})

const profileTags = computed(() => {
  return props.user?.tags?.length ? props.user.tags : ['Nou perfil']
})

const savedDisplay = computed(() => {
  return props.savedActivities
    .map((item) => {
      if (item?.title) return item
      return props.allActivities.find((activity) => activity.id === item)
    })
    .filter(Boolean)
})

const plannedDisplay = computed(() => {
  return props.plannedActivities
    .map((item, index) => {
      const activity =
        item.activity ||
        props.allActivities.find((activityItem) => activityItem.id === item.activityId) ||
        null

      if (!activity && !item.title) return null

      return {
        id: item.id ?? `planned-${index}`,
        activityId: item.activityId ?? activity?.id ?? item.id,
        title: item.title ?? activity?.title ?? 'Activitat programada',
        shortDescription:
          item.shortDescription ?? activity?.shortDescription ?? 'Activitat guardada al calendari.',
        icon: item.icon ?? activity?.icon ?? 'sparkles',
        tone: item.tone ?? activity?.tone ?? 'violet',
        date: item.date,
        time: item.time ?? '21:00',
        reminder: item.reminder ?? '30 min abans',
      }
    })
    .filter(Boolean)
})

const completedDisplay = computed(() => {
  return props.completedActivities
    .map((item, index) => {
      const activity =
        item.activity ||
        props.allActivities.find((activityItem) => activityItem.id === item.activityId) ||
        null

      if (!activity) return null

      return {
        id: item.id ?? `completed-${index}`,
        activityId: item.activityId,
        title: activity.title,
        shortDescription: activity.shortDescription,
        icon: activity.icon,
        tone: activity.tone,
        date: item.date,
        energyBefore: item.energyBefore ?? 35,
        energyAfter: item.energyAfter ?? 62,
        note: item.note ?? '',
        activity,
      }
    })
    .filter(Boolean)
})

const energyStats = computed(() => {
  if (completedDisplay.value.length > 0) {
    return completedDisplay.value.slice(-5).map((item, index) => ({
      label: `S${index + 1}`,
      before: item.energyBefore,
      after: item.energyAfter,
      title: item.title,
    }))
  }

  return [
    { label: 'S1', before: 28, after: 56, title: 'Yoga i estiraments' },
    { label: 'S2', before: 35, after: 52, title: 'Passeig curt' },
    { label: 'S3', before: 22, after: 44, title: 'Playlist + respiració' },
    { label: 'S4', before: 40, after: 70, title: 'Yoga i estiraments' },
  ]
})

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

function parseDate(dateString) {
  if (!dateString) return null

  const [year, month, day] = dateString.split('-').map(Number)

  if (!year || !month || !day) return null

  return {
    year,
    month: month - 1,
    day,
  }
}

function plannedForDate(year, month, day) {
  return plannedDisplay.value.filter((planned) => {
    const parsed = parseDate(planned.date)
    if (!parsed) return false

    return parsed.year === year && parsed.month === month && parsed.day === day
  })
}

function completedForDate(year, month, day) {
  return completedDisplay.value.filter((completed) => {
    const parsed = parseDate(completed.date)
    if (!parsed) return false

    return parsed.year === year && parsed.month === month && parsed.day === day
  })
}

const calendarCells = computed(() => {
  const year = visibleYear.value
  const month = visibleMonth.value

  const firstDayOfMonth = new Date(year, month, 1)
  const totalDays = new Date(year, month + 1, 0).getDate()

  // JS: domingo = 0. Lo convertimos a lunes = 0.
  const firstWeekdayMondayBased = (firstDayOfMonth.getDay() + 6) % 7

  const emptyCells = Array.from({ length: firstWeekdayMondayBased }, (_, index) => ({
    id: `empty-${index}`,
    empty: true,
  }))

  const dayCells = Array.from({ length: totalDays }, (_, index) => {
    const dayNumber = index + 1

    const planned = plannedForDate(year, month, dayNumber)
    const completed = completedForDate(year, month, dayNumber)

    const isToday =
      dayNumber === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()

    return {
      id: `day-${year}-${month}-${dayNumber}`,
      empty: false,
      number: dayNumber,
      planned,
      completed,
      isToday,
    }
  })

  return [...emptyCells, ...dayCells]
})

function previousMonth() {
  visibleDate.value = new Date(visibleYear.value, visibleMonth.value - 1, 1)
}

function nextMonth() {
  visibleDate.value = new Date(visibleYear.value, visibleMonth.value + 1, 1)
}

function goToCurrentMonth() {
  visibleDate.value = new Date()
}

function tooltipForDay(day) {
  if (day.empty) return ''

  const messages = []

  if (day.isToday) {
    messages.push('Avui')
  }

  day.completed.forEach((completed) => {
    messages.push(`Fet: ${completed.title}`)
  })

  day.planned.forEach((planned) => {
    messages.push(`Programat: ${planned.title} · ${planned.time}`)
  })

  return messages.join(' · ')
}
</script>

<template>
  <main class="profile-page">
    <header class="profile-toolbar">
      <button
        class="icon-button"
        type="button"
        title="Tornar a Home"
        @click="emit('go-home')"
      >
        <House :size="22" />
      </button>

      <div class="toolbar-actions">
        <button
          class="icon-button"
          type="button"
          title="Ajustos"
          @click="emit('go-settings')"
        >
          <Settings :size="20" />
        </button>

        <button
          class="icon-button"
          type="button"
          title="Sortir"
          @click="emit('logout')"
        >
          <LogOut :size="20" />
        </button>
      </div>
    </header>

    <section class="profile-columns">
      <div class="left-column">
        <section class="glass-panel profile-panel">
          <div class="avatar-shell">
            <img
              v-if="avatarSrc"
              :src="avatarSrc"
              alt="Foto de perfil"
              class="profile-avatar-image"
            />

            <div v-else class="profile-avatar-fallback">
              <UserRound :size="38" />
            </div>
          </div>

          <div class="profile-copy">
            <h1>{{ user?.name || 'Usuària' }}</h1>
            <p>{{ user?.handle || `@${user?.username || 'usuaria'}` }} · {{ user?.age || 24 }} anys</p>

            <div class="tag-list">
              <span v-for="tag in profileTags" :key="tag" class="chip">
                {{ tag }}
              </span>
            </div>
          </div>
        </section>

        <section class="glass-panel calendar-panel">
          <div class="panel-header">
            <h2>Calendari del temps lliure</h2>

            <button class="primary-button" type="button" @click="emit('schedule')">
            Programar
            </button>
          </div>

          <div class="calendar-controls">
            <button class="calendar-nav-button" type="button" @click="previousMonth">
              <ChevronLeft :size="18" />
            </button>

            <button class="calendar-month-button" type="button" @click="goToCurrentMonth">
              {{ visibleMonthLabel }}
            </button>

            <button class="calendar-nav-button" type="button" @click="nextMonth">
              <ChevronRight :size="18" />
            </button>
          </div>

          <div class="calendar-weekdays">
            <span>Dl</span>
            <span>Dt</span>
            <span>Dc</span>
            <span>Dj</span>
            <span>Dv</span>
            <span>Ds</span>
            <span>Dg</span>
          </div>

          <div class="calendar-grid">
            <div
              v-for="day in calendarCells"
              :key="day.id"
              class="day-wrapper"
              :class="{ empty: day.empty }"
            >
              <button
                v-if="!day.empty"
                class="day-cell"
                :class="{
                  today: day.isToday,
                  planned: day.planned.length > 0,
                  completed: day.completed.length > 0,
                  mixed: day.planned.length > 0 && day.completed.length > 0,
                }"
                type="button"
                :aria-label="tooltipForDay(day) || `Dia ${day.number}`"
              >
                {{ day.number }}
              </button>

              <span v-if="tooltipForDay(day)" class="day-tooltip">
                {{ tooltipForDay(day) }}
              </span>
            </div>
          </div>
        </section>
      </div>

      <div class="right-column">
        <section class="glass-panel right-panel">
          <div class="panel-block">
            <div class="panel-header">
              <h2>Activitats programades</h2>
              <span class="section-counter">{{ plannedDisplay.length }} activitats</span>
            </div>

            <div v-if="plannedDisplay.length > 0" class="activity-list">
              <article
                v-for="activity in plannedDisplay"
                :key="activity.id"
                class="activity-row"
                :class="`tone-${activity.tone || 'violet'}`"
                @click="emit('open-activity', activity.activityId)"
              >
                <div class="activity-icon">
                  <component :is="iconFor(activity.icon)" :size="28" />
                </div>

                <div class="activity-copy">
                  <h3>{{ activity.title }}</h3>
                  <p>{{ activity.date }} · {{ activity.time }}</p>
                  <small>{{ activity.reminder }}</small>
                </div>
              </article>
            </div>

            <div v-else class="empty-box">
              Encara no tens activitats programades.
            </div>
          </div>

          <div class="panel-block saved-block">
            <div class="panel-header">
              <h2>Les meves activitats</h2>
              <span class="section-counter">{{ savedDisplay.length }} guardades</span>
            </div>

            <div v-if="savedDisplay.length > 0" class="scroll-area">
              <article
                v-for="activity in savedDisplay"
                :key="activity.id"
                class="activity-row compact"
                :class="`tone-${activity.tone || 'violet'}`"
                @click="emit('open-activity', activity.id)"
              >
                <div class="activity-icon">
                  <component :is="iconFor(activity.icon)" :size="28" />
                </div>

                <div class="activity-copy">
                  <h3>{{ activity.title }}</h3>
                  <p>{{ activity.shortDescription }}</p>
                </div>
              </article>
            </div>

            <div v-else class="empty-box">
              Encara no tens activitats guardades.
            </div>
          </div>
        </section>
      </div>
    </section>

    <section class="glass-panel stats-panel">
      <div class="panel-header">
        <h2>Seguiment d’energia</h2>
        <span class="section-counter">Últimes activitats</span>
      </div>

      <div class="stats-chart">
        <div v-for="item in energyStats" :key="item.label" class="stat-group">
          <div class="stat-bars">
            <div
              class="bar bar-before"
              :style="{ height: `${item.before}%` }"
            />
            <div
              class="bar bar-after"
              :style="{ height: `${item.after}%` }"
            />
          </div>

          <span class="stat-label">{{ item.label }}</span>
        </div>
      </div>

      <div class="insight-box">
        <CalendarDays :size="18" />
        <p>
          <strong>Insight:</strong>
          Les activitats registrades mostren la diferència entre l’energia abans i després
          de fer cada activitat.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-page {
  width: 100%;
  min-height: 100vh;
  padding: 24px 28px 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-button {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.54);
  backdrop-filter: blur(14px);
  box-shadow: 0 10px 26px rgba(90, 110, 140, 0.08);
  color: var(--foreground);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.icon-button:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 14px 32px rgba(90, 110, 140, 0.14);
}

.profile-columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  align-items: stretch;
  min-height: 650px;
}

.left-column,
.right-column {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.glass-panel {
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 32px rgba(90, 110, 140, 0.06);
}

.profile-panel {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.avatar-shell {
  width: 108px;
  height: 108px;
  flex: 0 0 auto;
  border-radius: 30px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 12px 28px rgba(90, 110, 140, 0.08);
}

.profile-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--violet);
}

.profile-copy {
  flex: 1;
}

.profile-copy h1 {
  margin: 0;
  color: var(--foreground);
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.profile-copy p {
  margin: 10px 0 14px;
  color: var(--muted-foreground);
  font-size: 1rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.calendar-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: visible;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.panel-header h2 {
  margin: 0;
  color: var(--foreground);
  font-size: 1.75rem;
}

.section-counter {
  color: var(--muted-foreground);
  font-size: 0.95rem;
  font-weight: 700;
}

.calendar-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 10px 0 20px;
}

.calendar-nav-button,
.calendar-month-button {
  border: 1px solid rgba(255, 255, 255, 0.78);
  background: rgba(255, 255, 255, 0.52);
  backdrop-filter: blur(14px);
  color: var(--foreground);
  box-shadow: 0 8px 24px rgba(90, 110, 140, 0.06);
}

.calendar-nav-button {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
}

.calendar-month-button {
  min-width: 180px;
  min-height: 42px;
  border-radius: 999px;
  padding: 0 18px;
  font-weight: 900;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.calendar-weekdays span {
  display: grid;
  place-items: center;
  height: 32px;
  color: var(--muted-foreground);
  font-size: 0.9rem;
  font-weight: 900;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
}

.day-wrapper {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 0;
  aspect-ratio: 1 / 1;
}

.day-wrapper.empty {
  pointer-events: none;
}

.day-cell {
  display: grid;
  place-items: center;
  width: clamp(38px, 4.4vw, 54px);
  height: clamp(38px, 4.4vw, 54px);
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.48);
  backdrop-filter: blur(12px);
  color: #64748b;
  font-size: 1rem;
  font-weight: 900;
  box-shadow: 0 8px 22px rgba(90, 110, 140, 0.04);
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease;
}

.day-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(90, 110, 140, 0.1);
}

.day-cell.today {
  background: rgba(226, 232, 240, 0.92);
  color: #334155;
  border-color: rgba(148, 163, 184, 0.5);
}

.day-cell.planned {
  background: rgba(237, 233, 254, 0.96);
  color: #6d28d9;
  border-color: rgba(167, 139, 250, 0.42);
}

.day-cell.completed {
  background: rgba(220, 252, 231, 0.96);
  color: #15803d;
  border-color: rgba(74, 222, 128, 0.36);
}

.day-cell.mixed {
  background: linear-gradient(135deg, rgba(220, 252, 231, 0.96), rgba(237, 233, 254, 0.96));
  color: #334155;
}

.day-tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  z-index: 60;
  width: max-content;
  max-width: 260px;
  padding: 10px 12px;
  border: 1px solid rgba(180, 190, 220, 0.36);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 30px rgba(80, 100, 140, 0.14);
  color: var(--foreground);
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.35;
  text-align: center;
  transform: translateX(-50%) translateY(6px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    visibility 0.18s ease;
}

.day-tooltip::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  border-width: 7px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.94) transparent transparent transparent;
}

.day-wrapper:hover .day-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.right-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 24px;
}

.panel-block {
  display: flex;
  flex-direction: column;
}

.saved-block {
  flex: 1;
  min-height: 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scroll-area {
  flex: 1;
  min-height: 0;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 6px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-row {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.44);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.activity-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(90, 110, 140, 0.1);
}

.activity-row.compact {
  min-height: 88px;
}

.activity-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
  border-radius: 20px;
  color: var(--foreground);
}

.activity-copy {
  flex: 1;
  min-width: 0;
}

.activity-copy h3 {
  margin: 0;
  color: var(--foreground);
  font-size: 1.05rem;
}

.activity-copy p {
  margin: 4px 0 0;
  color: var(--muted-foreground);
  line-height: 1.5;
}

.activity-copy small {
  display: inline-block;
  margin-top: 6px;
  color: var(--muted-foreground);
}

.empty-box {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.36);
  color: var(--muted-foreground);
}

.stats-panel {
  padding: 24px;
}

.stats-chart {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
  align-items: end;
  min-height: 220px;
}

.stat-group {
  display: grid;
  justify-items: center;
  gap: 10px;
}

.stat-bars {
  display: flex;
  align-items: end;
  gap: 10px;
  height: 150px;
}

.bar {
  width: 22px;
  border-radius: 999px 999px 0 0;
}

.bar-before {
  background: rgba(148, 163, 184, 0.45);
}

.bar-after {
  background: rgba(110, 231, 183, 0.92);
}

.stat-label {
  color: var(--muted-foreground);
  font-weight: 800;
}

.insight-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(236, 253, 245, 0.74);
  color: var(--muted-foreground);
}

.insight-box p {
  margin: 0;
  line-height: 1.5;
}

.tone-violet .activity-icon,
.tone-indigo .activity-icon {
  background: rgba(237, 233, 254, 0.95);
}

.tone-rose .activity-icon,
.tone-pink .activity-icon {
  background: rgba(252, 231, 243, 0.95);
}

.tone-sky .activity-icon,
.tone-blue .activity-icon {
  background: rgba(219, 234, 254, 0.95);
}

.tone-emerald .activity-icon,
.tone-green .activity-icon {
  background: rgba(220, 252, 231, 0.95);
}

.tone-amber .activity-icon,
.tone-yellow .activity-icon {
  background: rgba(254, 249, 195, 0.95);
}

@media (max-width: 1100px) {
  .profile-columns {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .right-panel {
    min-height: auto;
  }

  .saved-block {
    min-height: auto;
  }

  .scroll-area {
    max-height: 420px;
  }

  .stats-chart {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 24px;
  }
}

@media (max-width: 700px) {
  .profile-page {
    padding: 18px;
  }

  .profile-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .panel-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .calendar-grid,
  .calendar-weekdays {
    gap: 8px;
  }

  .day-cell {
    width: 42px;
    height: 42px;
  }

  .stats-chart {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>