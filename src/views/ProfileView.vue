<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Amphora,
  Bike,
  House,
  Settings,
  LogOut,
  UserRound,
  BookOpen,
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
  Rose,
  ScissorsLineDashed,
  Sparkles,
  Spool,
  SunMedium,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Volleyball,
  Waves,
} from 'lucide-vue-next'
import AppBrand from '@/components/layout/AppBrand.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
import { homeCopy, landingCopy, profileCopy } from '@/data/uiText'
import { logout, syncSelectedActivity, useAppSession } from '@/stores/appSession'

const router = useRouter()

const {
  currentUser,
  savedActivities,
  startedActivities,
  completedActivitiesDisplay,
  plannedActivities,
  allActivities,
} = useAppSession()

const avatarModules = import.meta.glob('../assets/avatars/*', {
  eager: true,
  import: 'default',
})

function openActivity(activityId, source = 'normal') {
  syncSelectedActivity(activityId, source)
  router.push({
    name: 'activity',
    params: { id: activityId },
    query: source === 'normal' ? {} : { source },
  })
}

function handleLogout() {
  logout()
  router.replace({ name: 'landing' })
}

const visibleDate = ref(new Date())
const today = new Date()
const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())

const visibleYear = computed(() => visibleDate.value.getFullYear())
const visibleMonth = computed(() => visibleDate.value.getMonth())

const visibleMonthLabel = computed(() => {
  return `${profileCopy.calendar.months[visibleMonth.value]} ${visibleYear.value}`
})

const avatarSrc = computed(() => {
  const avatarFile = currentUser.value?.avatar

  if (!avatarFile) return null

  return avatarModules[`../assets/avatars/${avatarFile}`] || null
})

const profileTags = computed(() => {
  return currentUser.value?.tags?.length ? currentUser.value.tags : [profileCopy.fallbackTag]
})

const savedDisplay = computed(() => {
  return savedActivities.value
    .map((item) => {
      if (item?.title) return item
      return allActivities.find((activity) => activity.id === item)
    })
    .filter(Boolean)
})

const startedDisplay = computed(() => {
  return startedActivities.value
    .map((item) => {
      if (item?.title) return item
      return allActivities.find((activity) => activity.id === item)
    })
    .filter(Boolean)
})

function isStartedActivity(activityId) {
  return startedDisplay.value.some((activity) => activity.id === activityId)
}

const plannedDisplay = computed(() => {
  return plannedActivities.value
    .map((item, index) => {
      const activity =
        item.activity ||
        allActivities.find((activityItem) => activityItem.id === item.activityId) ||
        null

      if (!activity && !item.title) return null

      return {
        id: item.id ?? `planned-${index}`,
        activityId: item.activityId ?? activity?.id ?? item.id,
        title: item.title ?? activity?.title ?? profileCopy.planned.fallbackTitle,
        shortDescription:
          item.shortDescription ?? activity?.shortDescription ?? profileCopy.planned.fallbackDescription,
        icon: item.icon ?? activity?.icon ?? 'sparkles',
        tone: item.tone ?? activity?.tone ?? 'violet',
        date: item.date,
        time: item.time ?? profileCopy.planned.fallbackTime,
        reminder: item.reminder ?? profileCopy.planned.fallbackReminder,
      }
    })
    .filter((item) => {
      if (!item) return false

      const parsed = parseDate(item.date)

      if (!parsed) return true

      return new Date(parsed.year, parsed.month, parsed.day) >= todayStart
    })
    .filter(Boolean)
})

const completedDisplay = computed(() => {
  return completedActivitiesDisplay.value
    .map((item, index) => {
      const activity =
        item.activity ||
        allActivities.find((activityItem) => activityItem.id === item.activityId) ||
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
      label: `${profileCopy.stats.labelPrefix}${index + 1}`,
      before: item.energyBefore,
      after: item.energyAfter,
      title: item.title,
    }))
  }

  return profileCopy.stats.fallback
})

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
      canSchedule: new Date(year, month, dayNumber) >= todayStart,
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
    messages.push(profileCopy.calendar.today)
  }

  day.completed.forEach((completed) => {
    messages.push(`${profileCopy.calendar.completedPrefix}: ${completed.title}`)
  })

  day.planned.forEach((planned) => {
    messages.push(`${profileCopy.calendar.plannedPrefix}: ${planned.title} ${profileCopy.separator} ${planned.time}`)
  })

  return messages.join(` ${profileCopy.separator} `)
}

function dateForDay(day) {
  const month = String(visibleMonth.value + 1).padStart(2, '0')
  const dayNumber = String(day.number).padStart(2, '0')

  return `${visibleYear.value}-${month}-${dayNumber}`
}

function scheduleFromDay(day) {
  router.push({
    name: 'schedule-day',
    query: { date: dateForDay(day) },
  })
}
</script>

<template>
  <main class="app-page profile-page">
    <section class="page-container">
      <AppNavbar class="profile-toolbar">
        <template #start>
          <AppBrand :brand="landingCopy.nav.brand" :to="{ name: 'home' }" />
        </template>

        <template #end>
          <div class="toolbar-actions">
            <ThemeToggle />

            <button
              class="icon-button"
              type="button"
              :title="profileCopy.nav.home"
              @click="router.push({ name: 'home' })"
            >
              <House :size="22" />
            </button>

            <button
              class="icon-button"
              type="button"
              :title="profileCopy.nav.settings"
              @click="router.push({ name: 'settings' })"
            >
              <Settings :size="20" />
            </button>

            <button
              class="icon-button"
              type="button"
              :title="profileCopy.nav.logout"
              @click="handleLogout"
            >
              <LogOut :size="20" />
            </button>
          </div>
        </template>
      </AppNavbar>

    <section class="profile-columns">
      <div class="left-column">
        <section class="glass-panel profile-panel">
          <div class="avatar-shell">
            <img
              v-if="avatarSrc"
              :src="avatarSrc"
              :alt="profileCopy.avatarAlt"
              class="profile-avatar-image"
            />

            <div v-else class="profile-avatar-fallback">
              <UserRound :size="38" />
            </div>
          </div>

          <div class="profile-copy">
            <h1>{{ currentUser?.name }}</h1>
            <p>{{ currentUser?.handle }} {{ profileCopy.separator }} {{ currentUser?.age }} {{ profileCopy.ageUnit }}</p>

            <div class="tag-list">
              <span v-for="tag in profileTags" :key="tag" class="chip">
                {{ tag }}
              </span>
            </div>
          </div>
        </section>

        <section class="glass-panel calendar-panel">
          <div class="panel-header">
            <h2>{{ profileCopy.calendar.title }}</h2>
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
            <span v-for="weekday in profileCopy.calendar.weekdays" :key="weekday">
              {{ weekday }}
            </span>
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
                :aria-label="tooltipForDay(day) || `${profileCopy.calendar.dayAria} ${day.number}`"
              >
                {{ day.number }}
              </button>

              <div v-if="!day.empty && (tooltipForDay(day) || day.canSchedule)" class="day-tooltip">
                <span v-if="tooltipForDay(day)" class="day-tooltip-text">
                  {{ tooltipForDay(day) }}
                </span>

                <button
                  v-if="day.canSchedule"
                  class="day-add-button"
                  type="button"
                  :aria-label="`${profileCopy.calendar.addActivityAria} ${day.number}`"
                  @click.stop="scheduleFromDay(day)"
                >
                  {{ profileCopy.calendar.addActivity }}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="right-column">
        <section class="glass-panel right-panel">
          <div class="panel-block">
            <div class="panel-header">
              <h2>{{ profileCopy.plannedActivitiesTitle }}</h2>
              <span class="section-counter">{{ plannedDisplay.length }} {{ profileCopy.counters.activities }}</span>
            </div>

            <div v-if="plannedDisplay.length > 0" class="activity-list">
              <article
                v-for="activity in plannedDisplay"
                :key="activity.id"
                class="activity-row"
                :class="`tone-${activity.tone || 'violet'}`"
                @click="openActivity(activity.activityId)"
              >
                <div class="activity-icon">
                  <component :is="iconFor(activity.icon)" :size="28" />
                </div>

                <div class="activity-copy">
                  <h3>{{ activity.title }}</h3>
                  <p>{{ activity.date }} {{ profileCopy.separator }} {{ activity.time }}</p>
                  <small>{{ activity.reminder }}</small>
                </div>
              </article>
            </div>

            <div v-else class="empty-box">
              {{ profileCopy.empty.planned }}
            </div>
          </div>

          <div class="panel-block saved-block">
            <div class="panel-header">
              <h2>{{ profileCopy.startedActivitiesTitle }}</h2>
              <span class="section-counter">{{ startedDisplay.length }} {{ profileCopy.counters.started }}</span>
            </div>

            <div v-if="startedDisplay.length > 0" class="activity-list">
              <article
                v-for="activity in startedDisplay"
                :key="activity.id"
                class="activity-row compact"
                :class="`tone-${activity.tone || 'violet'}`"
                @click="openActivity(activity.id)"
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
              {{ profileCopy.empty.started }}
            </div>
          </div>

          <div class="panel-block saved-block">
            <div class="panel-header">
              <h2>{{ profileCopy.savedActivitiesTitle }}</h2>
              <span class="section-counter">{{ savedDisplay.length }} {{ profileCopy.counters.saved }}</span>
            </div>

            <div v-if="savedDisplay.length > 0" class="scroll-area">
              <article
                v-for="activity in savedDisplay"
                :key="activity.id"
                class="activity-row compact"
                :class="`tone-${activity.tone || 'violet'}`"
                @click="openActivity(activity.id)"
              >
                <span v-if="!isStartedActivity(activity.id)" class="new-activity-badge">
                  {{ homeCopy.newBadge }}
                </span>

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
              {{ profileCopy.empty.saved }}
            </div>
          </div>
        </section>
      </div>
    </section>

    <section class="glass-panel stats-panel">
      <div class="panel-header">
        <h2>{{ profileCopy.statsTitle }}</h2>
        <span class="section-counter">{{ profileCopy.counters.latestActivities }}</span>
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
          <strong>{{ profileCopy.stats.insightLabel }}:</strong>
          {{ profileCopy.stats.insightText }}
        </p>
      </div>
    </section>
    </section>
  </main>
</template>

<style scoped>
.profile-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-toolbar {
  margin-bottom: 44px;
}

.profile-toolbar :deep(.theme-toggle) {
  border-color: var(--surface-stroke-strong);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-button {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
  box-shadow: var(--shadow-soft);
  color: var(--foreground);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.icon-button:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--surface-strong) 92%, transparent);
  box-shadow: var(--shadow-panel);
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
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 28px;
  background: color-mix(in srgb, var(--surface-contrast) 30%, transparent);
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
  width: 122px;
  height: 122px;
  flex: 0 0 auto;
  border-radius: 60px;
  overflow: hidden;
  background: color-mix(in srgb, var(--surface-contrast) 62%, transparent);
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
  border: 1px solid var(--surface-stroke-strong);
  background: color-mix(in srgb, var(--surface-contrast) 54%, transparent);
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
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 50%, transparent);
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
  display: grid;
  gap: 10px;
  justify-items: center;
  width: max-content;
  max-width: 260px;
  padding: 10px 12px;
  border: 1px solid rgba(180, 190, 220, 0.36);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-contrast) 94%, transparent);
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
  pointer-events: auto;
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
  border-color: color-mix(in srgb, var(--surface-contrast) 94%, transparent) transparent transparent transparent;
}

.day-wrapper:hover .day-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.day-tooltip-text {
  display: block;
}

.day-add-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  border: 1px solid rgba(167, 139, 250, 0.5);
  border-radius: 999px;
  padding: 7px 12px;
  background: color-mix(in srgb, var(--violet-soft) 58%, var(--surface-contrast));
  color: var(--violet-strong);
  font-size: 0.8rem;
  font-weight: 900;
  white-space: nowrap;
  box-shadow: 0 8px 18px rgba(124, 58, 237, 0.08);
}

.day-add-button:hover {
  transform: translateY(-1px);
  border-color: rgba(124, 58, 237, 0.5);
}

.right-panel {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 22px;
  padding: 24px;
}

.panel-block {
  display: flex;
  flex-direction: column;
}

.saved-block {
  height: 100%;
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
  height: 100%;
  overflow-y: auto;
  padding-right: 6px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 24px;
  padding: 16px 68px 16px 16px;
  background: color-mix(in srgb, var(--surface-contrast) 46%, transparent);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.new-activity-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  min-height: 24px;
  border: 1px solid color-mix(in srgb, var(--violet) 36%, var(--border));
  border-radius: 999px;
  padding: 4px 8px;
  background: color-mix(in srgb, var(--violet-soft) 82%, var(--surface-contrast));
  color: var(--violet-strong);
  font-size: 0.72rem;
  font-weight: 900;
  line-height: 1;
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
  background: color-mix(in srgb, var(--surface-contrast) 38%, transparent);
  color: var(--muted-foreground);
}

.stats-panel {
  margin-top: 32px;
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
