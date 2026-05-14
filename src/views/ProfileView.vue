<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Amphora,
  Bike,
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
  Edit2,
  Plus,
  CheckCircle2,
} from 'lucide-vue-next'
import AppBrand from '@/components/layout/AppBrand.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
import ActivityScheduleModal from '@/components/ui/ActivityScheduleModal.vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import AppTooltip from '@/components/ui/AppTooltip.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FeedbackModal from '@/components/ui/FeedbackModal.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import { landingCopy } from '@/data/uiText'
import { getHomeCopy, getProfileCopy } from '@/data/homeCopyI18n'
import { getActivityByIdWithTranslations } from '@/data/activitiesCopyI18n'
import { getActivityResultCopy } from '@/data/testCopyI18n'
import { logout, syncSelectedActivity, useAppSession, addPlannedActivity, updatePlannedActivity, deletePlannedActivity, completeActivity } from '@/stores/appSession'
import { useI18n } from '@/stores/i18n'

const router = useRouter()
const { currentLanguage } = useI18n()
const homeCopy = computed(() => getHomeCopy(currentLanguage.value))
const profileCopy = computed(() => getProfileCopy(currentLanguage.value))
const activityResultCopy = computed(() => getActivityResultCopy(currentLanguage.value))

const {
  currentUser,
  savedActivities,
  startedActivities,
  completedActivityIds,
  completedActivitiesDisplay,
  plannedActivities,
  allActivities,
} = useAppSession()

const avatarModules = import.meta.glob('../assets/avatars/*', {
  eager: true,
  import: 'default',
})

const activityImages = import.meta.glob('../assets/activities/*', {
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

// For scheduling activities
const isSchedulingMode = ref(false)
const selectedScheduleDay = ref(null)

// For activity modal
const isActivityModalOpen = ref(false)
const activityModalMode = ref('add') // 'add' or 'edit'
const activityModalDate = ref(null)
const editingPlannedActivityId = ref(null)

// Mini-test al acabar la actividad
const showFinishModal = ref(false)
const finishingActivity = ref(null)

function openFinishModal(activity) {
  finishingActivity.value = activity
  showFinishModal.value = true
}

function closeFinishModal() {
  showFinishModal.value = false
  finishingActivity.value = null
}

function confirmFinishActivity(feedback) {
  if (!finishingActivity.value) return

  const moodDelta = [0, 5, 12, 22, 32, 42][feedback.moodImprovement] ?? 22
  const energyBefore = 35
  const energyAfter = Math.min(100, energyBefore + moodDelta)

  completeActivity(finishingActivity.value.id, {
    rating: feedback.rating,
    moodImprovement: feedback.moodImprovement,
    note: feedback.note,
    energyBefore,
    energyAfter,
    date: new Date().toISOString(),
  })

  showFinishModal.value = false
  finishingActivity.value = null
  router.push({ name: 'home' })
}

const visibleYear = computed(() => visibleDate.value.getFullYear())
const visibleMonth = computed(() => visibleDate.value.getMonth())

const visibleMonthLabel = computed(() => {
  return `${profileCopy.value.calendar.months[visibleMonth.value]} ${visibleYear.value}`
})

const avatarSrc = computed(() => {
  const avatarFile = currentUser.value?.avatar

  if (!avatarFile) return null

  return avatarModules[`../assets/avatars/${avatarFile}`] || null
})

const profileTags = computed(() => {
  return currentUser.value?.tags?.length ? currentUser.value.tags : [profileCopy.value.fallbackTag]
})

const savedDisplay = computed(() => {
  return savedActivities.value
    .map((item) => {
      const activity = item?.title ? item : allActivities.find((activityItem) => activityItem.id === item)
      return activity ? getActivityByIdWithTranslations(activity.id, currentLanguage.value) ?? activity : null
    })
    .filter(Boolean)
})

const startedDisplay = computed(() => {
  return startedActivities.value
    .map((item) => {
      const activity = item?.title ? item : allActivities.find((activityItem) => activityItem.id === item)
      return activity ? getActivityByIdWithTranslations(activity.id, currentLanguage.value) ?? activity : null
    })
    .filter(Boolean)
})

function isStartedActivity(activityId) {
  return startedDisplay.value.some((activity) => activity.id === activityId)
}

function isTriedActivity(activityId) {
  return isStartedActivity(activityId) || completedActivityIds.value.includes(activityId)
}

const plannedDisplay = computed(() => {
  return plannedActivities.value
    .map((item, index) => {
      const activity =
        item.activity ||
        allActivities.find((activityItem) => activityItem.id === item.activityId) ||
        null

      if (!activity && !item.title) return null

      const imageKeyPng = `../assets/activities/${activity?.id}.png`
      const imageKeyJpg = `../assets/activities/${activity?.id}.jpg`
      const imageKeySvg = `../assets/activities/${activity?.id}.svg`

      const translatedActivity = activity
        ? getActivityByIdWithTranslations(activity.id, currentLanguage.value) ?? activity
        : null

      return {
        id: item.id ?? `planned-${index}`,
        activityId: item.activityId ?? activity?.id ?? item.id,
        title: item.title ?? translatedActivity?.title ?? profileCopy.value.planned.fallbackTitle,
        shortDescription:
          item.shortDescription ?? translatedActivity?.shortDescription ?? profileCopy.value.planned.fallbackDescription,
        icon: item.icon ?? translatedActivity?.icon ?? 'sparkles',
        tone: item.tone ?? translatedActivity?.tone ?? 'violet',
        date: item.date,
        time: item.time ?? profileCopy.value.planned.fallbackTime,
        reminder: item.reminder ?? profileCopy.value.planned.fallbackReminder,
        image: activityImages[imageKeyPng] || activityImages[imageKeyJpg] || activityImages[imageKeySvg] || null,
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
        mentalBefore: item.mentalBefore ?? null,
        mentalAfter: item.mentalAfter ?? null,
        physicalBefore: item.physicalBefore ?? null,
        physicalAfter: item.physicalAfter ?? null,
        rating: item.rating ?? null,
        liked: item.liked ?? false,
        note: item.note ?? '',
        activity,
      }
    })
    .filter(Boolean)
})

const energyStats = computed(() => {
  if (completedDisplay.value.length > 0) {
    return completedDisplay.value.slice(-5).map((item, index) => ({
      label: `${profileCopy.value.stats.labelPrefix}${index + 1}`,
      before: item.energyBefore,
      after: item.energyAfter,
      title: item.title,
    }))
  }

  return profileCopy.value.stats.fallback
})

function formatFeedbackDate(dateString, language = currentLanguage.value) {
  if (!dateString) return ''

  const parsed = parseDate(dateString)

  if (!parsed) return dateString

  const date = new Date(parsed.year, parsed.month, parsed.day)

  return new Intl.DateTimeFormat(language, {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

const feedbackSessions = computed(() => {
  return completedDisplay.value
    .map((item, index) => {
      const translatedActivity = getActivityByIdWithTranslations(item.activityId, currentLanguage.value) || item.activity
      const energyBefore = item.energyBefore ?? 0
      const energyAfter = item.energyAfter ?? 0

      return {
        ...item,
        title: translatedActivity?.title ?? item.title,
        shortDescription: translatedActivity?.shortDescription ?? item.shortDescription,
        icon: translatedActivity?.icon ?? item.icon,
        tone: translatedActivity?.tone ?? item.tone,
        energyBefore,
        energyAfter,
        dateLabel: formatFeedbackDate(item.date),
        sortKey: `${item.date}-${String(index).padStart(2, '0')}`,
      }
    })
    .sort((left, right) => right.sortKey.localeCompare(left.sortKey))
})

const feedbackActivityOptions = computed(() => {
  const groups = new Map()

  feedbackSessions.value.forEach((session) => {
    const currentGroup = groups.get(session.activityId)

    if (!currentGroup) {
      groups.set(session.activityId, {
        activityId: session.activityId,
        title: session.title,
        shortDescription: session.shortDescription,
        icon: session.icon,
        tone: session.tone,
        sessions: 1,
        lastDate: session.date,
      })
      return
    }

    currentGroup.sessions += 1
    currentGroup.lastDate = currentGroup.lastDate > session.date ? currentGroup.lastDate : session.date
  })

  return [...groups.values()].sort((left, right) => {
    if (right.sessions !== left.sessions) return right.sessions - left.sessions

    return right.lastDate.localeCompare(left.lastDate)
  })
})

const selectedFeedbackActivityId = ref('')

watch(
  feedbackActivityOptions,
  (options) => {
    if (!options.length) {
      selectedFeedbackActivityId.value = ''
      return
    }

    const stillExists = options.some((option) => option.activityId === selectedFeedbackActivityId.value)

    if (!stillExists) {
      selectedFeedbackActivityId.value = options[0].activityId
    }
  },
  { immediate: true },
)

const selectedFeedbackActivity = computed(() => {
  return feedbackActivityOptions.value.find((activity) => activity.activityId === selectedFeedbackActivityId.value) || null
})

const selectedFeedbackSessions = computed(() => {
  if (!selectedFeedbackActivityId.value) return []

  return feedbackSessions.value.filter((session) => session.activityId === selectedFeedbackActivityId.value)
})

const selectedFeedbackSessionId = ref('')

watch(
  selectedFeedbackSessions,
  (sessions) => {
    if (!sessions.length) {
      selectedFeedbackSessionId.value = ''
      return
    }

    const stillExists = sessions.some((session) => session.id === selectedFeedbackSessionId.value)

    if (!stillExists) {
      selectedFeedbackSessionId.value = sessions[0].id
    }
  },
  { immediate: true },
)

const selectedFeedbackSession = computed(() => {
  return (
    selectedFeedbackSessions.value.find((session) => session.id === selectedFeedbackSessionId.value) ||
    selectedFeedbackSessions.value[0] ||
    null
  )
})

const selectedFeedbackSummary = computed(() => {
  const sessions = selectedFeedbackSessions.value

  if (!sessions.length) return null

  const totalBefore = sumMetric(sessions, 'energyBefore')
  const totalAfter = sumMetric(sessions, 'energyAfter')
  const totalRating = sumMetric(sessions, 'rating')

  return {
    before: Math.round(totalBefore / sessions.length),
    after: Math.round(totalAfter / sessions.length),
    delta: Math.round((totalAfter - totalBefore) / sessions.length),
    rating: (totalRating / sessions.length).toFixed(1),
    sessionCount: sessions.length,
  }
})

const selectedChartSessions = computed(() => {
  return [...selectedFeedbackSessions.value].sort((left, right) => left.sortKey.localeCompare(right.sortKey))
})

const feedbackLineSeries = computed(() => {
  const sessions = selectedChartSessions.value
  const denominator = Math.max(1, sessions.length - 1)
  const horizontalPadding = 7
  const verticalPadding = 10
  const drawableWidth = 100 - horizontalPadding * 2
  const drawableHeight = 100 - verticalPadding * 2
  const metrics = [
    { key: 'energy-before', label: profileCopy.value.stats.metrics.energyBefore, field: 'energyBefore' },
    { key: 'energy-after', label: profileCopy.value.stats.metrics.energyAfter, field: 'energyAfter' },
  ]

  return metrics.map((metric) => {
    const points = sessions.map((session, index) => {
      const value = Math.max(0, Math.min(100, Number(session[metric.field] ?? 0)))

      return {
        id: `${metric.key}-${session.id}`,
        sessionId: session.id,
        x: sessions.length > 1 ? horizontalPadding + (index / denominator) * drawableWidth : 50,
        y: verticalPadding + (100 - value) * (drawableHeight / 100),
        value,
        dateLabel: session.dateLabel,
        note: session.note,
        moodBefore: session.moodBefore,
        moodAfter: session.moodAfter,
      }
    })

    return {
      ...metric,
      points,
      path: points
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
        .join(' '),
    }
  })
})

const selectedFeedbackDimensions = computed(() => [])
const mainFeedbackChart = computed(() => [])
const mainFeedbackLinePath = computed(() => '')

const bestFeedbackActivity = computed(() => {
  if (!feedbackActivityOptions.value.length) return null

  return [...feedbackActivityOptions.value]
    .map((activity) => {
      const sessions = feedbackSessions.value.filter((session) => session.activityId === activity.activityId)
      const delta = averageMetric(sessions, 'energyAfter') - averageMetric(sessions, 'energyBefore')

      return { ...activity, delta }
    })
    .sort((left, right) => right.delta - left.delta)[0]
})

const latestFeedbackSession = computed(() => {
  return feedbackSessions.value[0] ?? null
})

function sumMetric(items, key) {
  return items.reduce((total, item) => total + Number(item[key] ?? 0), 0)
}

function averageMetric(items, key) {
  if (!items.length) return 0
  return Math.round(sumMetric(items, key) / items.length)
}

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
    messages.push(profileCopy.value.calendar.today)
  }

  day.completed.forEach((completed) => {
    messages.push(`${profileCopy.value.calendar.completedPrefix}: ${completed.title}`)
  })

  day.planned.forEach((planned) => {
    messages.push(`${planned.title} ${profileCopy.value.separator} ${planned.time}`)
  })

  return messages.join(' : ')
}

function dateForDay(day) {
  const month = String(visibleMonth.value + 1).padStart(2, '0')
  const dayNumber = String(day.number).padStart(2, '0')

  return `${visibleYear.value}-${month}-${dayNumber}`
}

function selectDayForScheduling(day) {
  if (day.empty || !day.canSchedule) return
  selectedScheduleDay.value = day
  isSchedulingMode.value = true
}

function exitSchedulingMode() {
  isSchedulingMode.value = false
  selectedScheduleDay.value = null
}

function openAddActivityModal() {
  if (!selectedScheduleDay.value) return

  const dateStr = formatDateString(visibleYear.value, visibleMonth.value, selectedScheduleDay.value.number)
  activityModalDate.value = dateStr
  activityModalMode.value = 'add'
  editingPlannedActivityId.value = null
  isActivityModalOpen.value = true
}

function openEditActivityModal(plannedActivityId) {
  activityModalDate.value = null // Will use the existing date from the planned activity
  activityModalMode.value = 'edit'
  editingPlannedActivityId.value = plannedActivityId
  isActivityModalOpen.value = true
}

function handleActivityModalConfirm(data) {
  if (activityModalMode.value === 'add') {
    addPlannedActivity(data.activityId, activityModalDate.value, data.time)
  } else {
    const existing = plannedActivities.value.find((p) => p.id === editingPlannedActivityId.value)
    if (existing) {
      updatePlannedActivity(
        editingPlannedActivityId.value,
        data.activityId,
        existing.date, // Keep the original date when editing
        data.time,
      )
    }
  }

  isActivityModalOpen.value = false
  editingPlannedActivityId.value = null
}

function handleActivityModalDelete() {
  if (editingPlannedActivityId.value) {
    deletePlannedActivity(editingPlannedActivityId.value)
  }

  isActivityModalOpen.value = false
  editingPlannedActivityId.value = null
}

function handleActivityModalCancel() {
  isActivityModalOpen.value = false
  editingPlannedActivityId.value = null
}

function handleProfileColumnsClick(event) {
  // Only exit if clicking outside the right panel and in scheduling mode
  if (isSchedulingMode.value && event.target.closest('.right-panel') === null) {
    exitSchedulingMode()
  }
}

// Get formatted date string for comparison
function formatDateString(year, month, day) {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

// Get activities for the selected scheduling day
const activitiesForSchedulingDay = computed(() => {
  if (!selectedScheduleDay.value) return []

  const day = selectedScheduleDay.value
  const dateStr = formatDateString(visibleYear.value, visibleMonth.value, day.number)

  return plannedDisplay.value
    .filter((activity) => activity.date === dateStr)
})

// Get label for selected scheduling day
const selectedSchedulingDayLabel = computed(() => {
  if (!selectedScheduleDay.value) return ''
  const day = selectedScheduleDay.value.number
  const monthName = profileCopy.value.calendar.months[visibleMonth.value]
  const year = visibleYear.value
  return `${day} de ${monthName} de ${year}`
})
</script>

<template>
  <main class="app-page profile-page">
    <AppContainer as="section">
      <AppNavbar class="profile-toolbar">
        <template #start>
          <AppTooltip :label="profileCopy.nav.home" position="bottom">
            <AppBrand :brand="landingCopy.nav.brand" :to="{ name: 'home' }" />
          </AppTooltip>
        </template>

        <template #end>
          <div class="toolbar-actions">
            <ThemeToggle />

            <AppTooltip :label="profileCopy.nav.settings" position="bottom">
              <button
                class="icon-button btn"
                type="button"
                @click="router.push({ name: 'settings', query: { from: 'profile' } })"
              >
                <Settings :size="20" />
              </button>
            </AppTooltip>

            <AppTooltip :label="profileCopy.nav.logout" position="bottom">
              <button
                class="icon-button btn"
                type="button"
                @click="handleLogout"
              >
                <LogOut :size="20" />
              </button>
            </AppTooltip>
          </div>
        </template>
      </AppNavbar>

    <section class="profile-columns" @click="handleProfileColumnsClick">
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
          <SectionHeader :title="profileCopy.calendar.title" size="section" />

          <div class="calendar-controls">
            <button class="calendar-nav-button btn" type="button" @click="previousMonth">
              <ChevronLeft :size="18" />
            </button>

            <button class="calendar-month-button btn" type="button" @click="goToCurrentMonth">
              {{ visibleMonthLabel }}
            </button>

            <button class="calendar-nav-button btn" type="button" @click="nextMonth">
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
                class="day-cell btn"
                :class="{
                  today: day.isToday,
                  planned: day.planned.length > 0,
                  completed: day.completed.length > 0,
                  mixed: day.planned.length > 0 && day.completed.length > 0,
                  selected: selectedScheduleDay && day.number === selectedScheduleDay.number,
                }"
                type="button"
                :aria-label="tooltipForDay(day) || `${profileCopy.calendar.dayAria} ${day.number}`"
                @click.stop="selectDayForScheduling(day)"
              >
                {{ day.number }}
              </button>

              <div v-if="!day.empty && tooltipForDay(day)" class="day-tooltip">
                <span class="day-tooltip-text">
                  {{ tooltipForDay(day) }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="right-column">
        <section class="glass-panel right-panel">
          <!-- Normal view: Only Saved activities -->
          <template v-if="!isSchedulingMode">
            <div class="panel-block saved-block">
              <SectionHeader :title="profileCopy.savedActivitiesTitle" size="section">
                <template #actions>
                  <span class="section-counter">{{ savedDisplay.length }} {{ profileCopy.counters.saved }}</span>
                </template>
              </SectionHeader>

              <div v-if="savedDisplay.length > 0" class="scroll-area">
                <article
                  v-for="activity in savedDisplay"
                  :key="activity.id"
                  class="activity-row compact"
                  :class="`tone-${activity.tone || 'violet'}`"
                  @click="openActivity(activity.id)"
                >
                  <span v-if="!isTriedActivity(activity.id)" class="new-activity-badge">
                    {{ homeCopy.newBadge }}
                  </span>

                  <div class="activity-icon">
                    <img v-if="activity.image" :src="activity.image" alt="" class="activity-image" />
                    <component v-else :is="iconFor(activity.icon)" :size="28" />
                  </div>

                  <div class="activity-copy">
                    <h3>{{ activity.title }}</h3>
                    <p>{{ activity.shortDescription }}</p>
                  </div>

                  <button
                    v-if="isStartedActivity(activity.id)"
                    type="button"
                    class="finish-activity-button btn"
                    :aria-label="`Acabar actividad: ${activity.title}`"
                    @click.stop="openFinishModal(activity)"
                  >
                    <CheckCircle2 :size="16" />
                    <span>Acabar</span>
                  </button>
                </article>
              </div>

              <EmptyState v-else>
                {{ profileCopy.empty.saved }}
              </EmptyState>
            </div>
          </template>

          <!-- Scheduling mode: Day activities only -->
          <template v-else>
            <div class="scheduling-header">
              <button class="back-to-activities btn" type="button" @click="exitSchedulingMode">
                <ChevronLeft :size="18" />
                <span>{{ profileCopy.calendar.back }}</span>
              </button>
              <div class="scheduling-title">
                <p class="scheduling-date">{{ selectedSchedulingDayLabel }}</p>
              </div>
            </div>

            <div class="day-activities-section">
              <h3>{{ profileCopy.plannedActivitiesTitle }}</h3>

              <div v-if="activitiesForSchedulingDay.length > 0" class="activity-list">
                <article
                  v-for="activity in activitiesForSchedulingDay"
                  :key="activity.id"
                  class="activity-row scheduling"
                  :class="`tone-${activity.tone || 'violet'}`"
                >
                  <div class="activity-icon">
                    <img v-if="activity.image" :src="activity.image" alt="" class="activity-image" />
                    <component v-else :is="iconFor(activity.icon)" :size="24" />
                  </div>

                  <div class="activity-copy">
                    <h4>{{ activity.title }}</h4>
                    <p>{{ activity.time }}</p>
                  </div>

                  <button class="edit-schedule-button btn" type="button" :aria-label="`${profileCopy.calendar.editActivityAria}: ${activity.title}`" @click="openEditActivityModal(activity.id)">
                    <Edit2 :size="16" />
                  </button>
                </article>
              </div>

              <EmptyState v-else>
                {{ profileCopy.calendar.noActivitiesForDay }}
              </EmptyState>

              <BaseButton block class="add-schedule-button" @click="openAddActivityModal">
                <Plus :size="18" />
                <span>{{ profileCopy.calendar.addActivityShort }}</span>
              </BaseButton>
            </div>
          </template>
        </section>
      </div>

      <!-- Scheduling overlay - click to close -->

    </section>

    <section class="glass-panel stats-panel feedback-panel">
      <SectionHeader
        :title="profileCopy.stats.dashboardTitle"
        class="feedback-panel-header"
        size="section"
      />

      <div v-if="feedbackActivityOptions.length > 0" class="feedback-shell">
        <aside class="feedback-side">
        <div class="feedback-selector-column" :aria-label="profileCopy.stats.selectorLabel">
          <button
            v-for="activity in feedbackActivityOptions"
            :key="activity.activityId"
            class="feedback-tab btn"
            :class="{ active: activity.activityId === selectedFeedbackActivityId }"
            type="button"
            @click="selectedFeedbackActivityId = activity.activityId"
          >
            <span class="feedback-tab-icon" :class="`tone-${activity.tone || 'violet'}`">
              <component :is="iconFor(activity.icon)" :size="18" />
            </span>
            <span>{{ activity.title }}</span>
            <small>{{ activity.sessions }} {{ profileCopy.stats.metrics.sessions }}</small>
          </button>
        </div>

        </aside>

        <article class="feedback-main-chart">
          <div class="feedback-chart-head">
            <div>
              <h3>{{ selectedFeedbackActivity?.title }}</h3>
            </div>

            <div class="feedback-line-legend" aria-hidden="true">
              <span v-for="series in feedbackLineSeries" :key="series.key" :class="`line-${series.key}`">
                {{ series.label }}
              </span>
            </div>
          </div>

          <div class="feedback-line-chart">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Feedback chart">
              <line x1="0" y1="25" x2="100" y2="25" class="chart-grid-line" />
              <line x1="0" y1="50" x2="100" y2="50" class="chart-grid-line" />
              <line x1="0" y1="75" x2="100" y2="75" class="chart-grid-line" />

              <g v-for="series in feedbackLineSeries" :key="series.key" :class="`feedback-series line-${series.key}`">
                <path :d="series.path" class="feedback-line-path" />
                <circle
                  v-for="point in series.points"
                  :key="point.id"
                  :cx="point.x"
                  :cy="point.y"
                  r="2.7"
                  class="feedback-line-dot"
                />
              </g>
            </svg>

            <template v-for="series in feedbackLineSeries" :key="`${series.key}-tooltips`">
              <button
                v-for="point in series.points"
                :key="`${point.id}-tooltip`"
                class="feedback-line-hotspot btn"
                :class="`line-${series.key}`"
                type="button"
                :style="{ left: `${point.x}%`, top: `${point.y}%` }"
                :aria-label="`${series.label}: ${point.value}`"
              >
                <span class="feedback-line-tooltip">
                  <strong>{{ series.label }} · {{ point.value }}</strong>
                  <small>{{ point.dateLabel }}</small>
                  <small v-if="point.moodBefore">{{ point.moodBefore }} → {{ point.moodAfter }}</small>
                </span>
              </button>
            </template>
          </div>

          <div v-if="false" class="feedback-dimension-grid">
            <div
              v-for="dimension in selectedFeedbackDimensions"
              :key="dimension.key"
              class="feedback-dimension"
            >
              <div class="feedback-dimension-head">
                <span>{{ dimension.label }}</span>
                <strong>+{{ dimension.delta }}</strong>
              </div>
              <div class="feedback-dimension-track">
                <span class="dimension-before" :style="{ width: `${dimension.before}%` }"></span>
                <span class="dimension-after" :style="{ width: `${dimension.after}%` }"></span>
              </div>
              <small>{{ dimension.before }} → {{ dimension.after }}</small>
            </div>
          </div>

          <div v-if="false" class="feedback-chart-area">
            <svg class="feedback-chart-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path v-if="mainFeedbackLinePath" :d="mainFeedbackLinePath" class="feedback-chart-path" />
              <circle
                v-for="point in mainFeedbackChart"
                :key="point.id"
                :cx="point.x"
                :cy="point.y"
                r="2.8"
                class="feedback-chart-dot"
                :class="{ active: point.id === selectedFeedbackSessionId }"
              />
            </svg>

            <div class="feedback-bar-strip">
              <button
                v-for="point in mainFeedbackChart"
                :key="`${point.id}-bar`"
                class="feedback-bar-column btn"
                :class="{ active: point.id === selectedFeedbackSessionId }"
                type="button"
                :title="`${point.dateLabel} · ${point.before} → ${point.after}`"
                @click="selectedFeedbackSessionId = point.id"
              >
                <span class="feedback-bar-track">
                  <span class="feedback-bar feedback-bar-before" :style="{ height: `${point.before}%` }"></span>
                  <span class="feedback-bar feedback-bar-after" :style="{ height: `${point.after}%` }"></span>
                </span>
                <small>{{ point.dateLabel }}</small>
              </button>
            </div>
          </div>

          <aside v-if="false && selectedFeedbackSession" class="feedback-session-card">
            <div>
              <span>{{ selectedFeedbackSession.dateLabel }}</span>
              <h4>{{ selectedFeedbackSession.moodBefore }} → {{ selectedFeedbackSession.moodAfter }}</h4>
              <p>{{ selectedFeedbackSession.note }}</p>
            </div>
            <strong>{{ selectedFeedbackSession.rating }} / 5</strong>
          </aside>
        </article>
      </div>

      <EmptyState v-else :title="profileCopy.stats.emptyTitle" :text="profileCopy.stats.emptyText" />
    </section>
    </AppContainer>

    <!-- Activity Schedule Modal -->
    <ActivityScheduleModal
      v-if="isActivityModalOpen"
      :date="activityModalDate"
      :mode="activityModalMode"
      :planned-activity-id="editingPlannedActivityId"
      @confirm="handleActivityModalConfirm"
      @delete="handleActivityModalDelete"
      @cancel="handleActivityModalCancel"
    />

    <FeedbackModal
      v-if="showFinishModal"
      :copy="activityResultCopy.finishModal"
      title-id="finish-modal-title-profile"
      @cancel="closeFinishModal"
      @confirm="confirmFinishActivity"
    />
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

.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip-bubble {
  position: absolute;
  left: 50%;
  top: calc(100% + 12px);
  transform: translateX(-50%) translateY(-8px);
  min-width: 180px;
  max-width: 280px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow-panel);
  color: var(--foreground);
  font-size: 0.82rem;
  line-height: 1.4;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.22s ease,
    transform 0.22s ease,
    visibility 0.22s ease;
  z-index: 80;
}

.tooltip-bubble::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 100%;
  width: 12px;
  height: 12px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--border);
  border-radius: 2px;
  transform: translateX(-50%) translateY(50%) rotate(45deg);
}

.tooltip-wrapper:hover .tooltip-bubble,
.tooltip-wrapper:focus-within .tooltip-bubble {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
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
  position: relative;
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
  box-shadow: var(--shadow-panel);
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
  box-shadow: var(--shadow-panel);
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
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;
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
  color: var(--violet-strong);
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.08;
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
  box-shadow: var(--shadow-panel);
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
  color: var(--muted-foreground);
  font-size: 1rem;
  font-weight: 900;
  box-shadow: var(--shadow-soft);
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease;
}

.day-cell:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-panel);
}

.day-cell.today {
  background: color-mix(in srgb, var(--muted) 78%, var(--surface-contrast));
  color: var(--foreground-soft);
  border-color: color-mix(in srgb, var(--muted-foreground) 50%, var(--border));
}

.day-cell.planned {
  background: color-mix(in srgb, var(--violet-soft) 88%, var(--surface-contrast));
  color: var(--violet);
  border-color: color-mix(in srgb, var(--violet) 42%, var(--border));
}

.day-cell.selected {
  border-color: var(--primary);
  background: var(--primary);
  color: var(--primary-foreground);
}

.day-cell.completed {
  background: color-mix(in srgb, var(--emerald-soft) 88%, var(--surface-contrast));
  color: color-mix(in srgb, var(--emerald) 70%, var(--foreground));
  border-color: color-mix(in srgb, var(--emerald) 42%, var(--border));
}

.day-cell.mixed {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--emerald-soft) 88%, var(--surface-contrast)),
    color-mix(in srgb, var(--violet-soft) 88%, var(--surface-contrast))
  );
  color: var(--foreground-soft);
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
  border: 1px solid var(--border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-contrast) 94%, transparent);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow-panel);
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

.day-tooltip::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  width: 12px;
  height: 12px;
  background: color-mix(in srgb, var(--surface-contrast) 94%, transparent);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  border-radius: 2px;
  transform: translateX(-50%) translateY(-50%) rotate(45deg);
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
  border: 1px solid color-mix(in srgb, var(--violet) 50%, var(--border));
  border-radius: 999px;
  padding: 7px 12px;
  background: color-mix(in srgb, var(--violet-soft) 58%, var(--surface-contrast));
  color: var(--violet-strong);
  font-size: 0.8rem;
  font-weight: 900;
  white-space: nowrap;
  box-shadow: var(--shadow-soft);
}

.day-add-button:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--violet) 50%, var(--border));
}

.right-panel {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 22px;
  padding: 24px;
  position: relative;
  z-index: 1;
}

.panel-block {
  display: flex;
  flex-direction: column;
}

.saved-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  box-shadow: var(--shadow-panel);
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

.feedback-panel {
  display: grid;
  gap: 18px;
}

.feedback-panel-header {
  align-items: flex-start;
}

.feedback-heading-copy {
  display: grid;
  gap: 4px;
}

.feedback-heading-copy h2,
.feedback-chart-head h3,
.feedback-empty-state h3,
.feedback-main-chart p {
  margin: 0;
}

.feedback-heading-copy p,
.feedback-main-chart p,
.feedback-empty-state p {
  color: var(--muted-foreground);
}

.feedback-shell {
  display: grid;
  grid-template-columns: minmax(230px, 0.32fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.feedback-side {
  display: grid;
  align-content: start;
  gap: 10px;
}

.feedback-selector-column {
  display: grid;
  gap: 14px;
  max-height: 330px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 4px;
  scrollbar-width: thin;
}

.feedback-selector-column::-webkit-scrollbar {
  width: 8px;
}

.feedback-selector-column::-webkit-scrollbar-track {
  background: transparent;
}

.feedback-selector-column::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: color-mix(in srgb, var(--muted-foreground) 28%, transparent);
}

.feedback-tab {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 10px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-contrast) 38%, transparent);
  color: var(--muted-foreground);
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    background-color 0.16s ease,
    color 0.16s ease;
}

.feedback-tab-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  grid-row: span 2;
  border-radius: 16px;
}

.feedback-tab:hover,
.feedback-tab.active {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--violet) 45%, var(--surface-stroke-strong));
  background: color-mix(in srgb, var(--violet-soft) 24%, var(--surface-contrast));
  color: var(--foreground);
}

.feedback-tab span,
.feedback-tab small {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 800;
}

.feedback-main-chart {
  display: grid;
  grid-template-rows: auto auto;
  align-content: start;
  gap: 16px;
  min-height: 0;
  padding: 22px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--violet-soft) 30%, transparent), transparent 32%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--emerald-soft) 26%, transparent), transparent 32%),
    linear-gradient(180deg, color-mix(in srgb, var(--surface-contrast) 58%, transparent), transparent);
}

.feedback-line-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.feedback-line-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
  padding: 4px 8px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 42%, transparent);
  color: var(--foreground);
  font-size: 0.72rem;
  font-weight: 900;
  line-height: 1;
}

.feedback-line-legend span::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--series-color);
}

.feedback-line-chart {
  position: relative;
  min-height: 280px;
  padding: 0;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 24px;
  background:
    linear-gradient(color-mix(in srgb, var(--border) 32%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--border) 32%, transparent) 1px, transparent 1px),
    color-mix(in srgb, var(--surface-contrast) 30%, transparent);
  background-size: 100% 25%, 12.5% 100%, auto;
}

.feedback-line-chart svg {
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.chart-grid-line {
  stroke: color-mix(in srgb, var(--muted-foreground) 20%, transparent);
  stroke-width: 0.5;
}

.feedback-line-path {
  fill: none;
  stroke: var(--series-color);
  stroke-width: 1.15;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  filter: drop-shadow(0 5px 10px color-mix(in srgb, var(--series-color) 18%, transparent));
}

.feedback-line-dot {
  display: none;
}

.feedback-line-hotspot {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  transform: translate(-50%, -50%);
  cursor: help;
}

.feedback-line-hotspot::before {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: inherit;
  background: var(--series-color);
  box-shadow: 0 0 0 2px var(--surface-contrast);
  opacity: 0.9;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.feedback-line-hotspot:hover::before,
.feedback-line-hotspot:focus-visible::before {
  opacity: 1;
  transform: scale(1.55);
}

.feedback-line-tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  display: grid;
  gap: 4px;
  min-width: 170px;
  padding: 10px 12px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-contrast) 94%, transparent);
  box-shadow: 0 16px 36px color-mix(in srgb, var(--series-color) 18%, transparent);
  color: var(--foreground);
  text-align: left;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(6px);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
  z-index: 4;
}

.feedback-line-tooltip strong {
  font-size: 0.86rem;
}

.feedback-line-tooltip small {
  color: var(--muted-foreground);
  font-size: 0.76rem;
  font-weight: 800;
}

.feedback-line-hotspot:hover .feedback-line-tooltip,
.feedback-line-hotspot:focus-visible .feedback-line-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.line-energy-before {
  --series-color: var(--violet);
}

.line-energy-after {
  --series-color: var(--emerald);
}

.feedback-chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.feedback-chart-head span {
  flex: none;
  min-width: 64px;
  text-align: right;
  font-size: 0.95rem;
  font-weight: 900;
  color: var(--foreground);
}

.feedback-chart-head h3 {
  margin: 0;
  color: var(--foreground);
  font-size: clamp(1.25rem, 2.2vw, 1.7rem);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.1;
}

.feedback-chart-area {
  position: relative;
}

.feedback-chart-line {
  position: absolute;
  inset: 0 0 48px;
  width: 100%;
  height: calc(100% - 48px);
  pointer-events: none;
}

.feedback-chart-path {
  fill: none;
  stroke: color-mix(in srgb, var(--primary) 70%, var(--surface-contrast));
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.feedback-chart-dot {
  fill: color-mix(in srgb, var(--primary) 65%, var(--surface-contrast));
  stroke: var(--foreground);
  stroke-width: 0.7;
}

.feedback-chart-dot.active {
  fill: var(--primary);
}

.feedback-bar-strip {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  min-height: 240px;
  overflow-x: auto;
  padding-top: 18px;
}

.feedback-bar-column {
  flex: 1 0 56px;
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
}

.feedback-bar-column.active {
  color: var(--foreground);
}

.feedback-bar-track {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  width: 100%;
  height: 180px;
  padding: 10px 8px 8px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 22px;
  background: color-mix(in srgb, var(--surface-contrast) 54%, transparent);
}

.feedback-bar {
  flex: 1;
  border-radius: 999px 999px 8px 8px;
}

.feedback-bar-before {
  background: color-mix(in srgb, var(--muted-foreground) 70%, transparent);
}

.feedback-bar-after {
  background: color-mix(in srgb, var(--primary) 80%, var(--surface-contrast));
}

.feedback-bar-column small {
  font-size: 0.72rem;
  font-weight: 800;
}

.feedback-metrics-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.focus-chip {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 7px 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 46%, transparent);
  color: var(--foreground);
  font-size: 0.82rem;
  font-weight: 900;
}

.feedback-session-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 22px;
  background:
    radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--violet-soft) 44%, transparent), transparent 42%),
    color-mix(in srgb, var(--surface-contrast) 44%, transparent);
}

.feedback-session-card h4 {
  margin: 6px 0 6px;
  color: var(--foreground);
  font-size: 1rem;
}

.feedback-session-card p {
  margin: 0;
  color: var(--muted-foreground);
}

.feedback-session-card > strong {
  flex: 0 0 auto;
  padding: 8px 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--emerald-soft) 62%, var(--surface-contrast));
  color: color-mix(in srgb, var(--emerald) 70%, var(--foreground));
}

.feedback-empty-state {
  display: grid;
  gap: 8px;
  padding: 20px;
  border-radius: 24px;
  background: color-mix(in srgb, var(--surface-contrast) 40%, transparent);
}

.tone-violet .activity-icon,
.tone-indigo .activity-icon {
  background: color-mix(in srgb, var(--violet-soft) 88%, var(--surface-contrast));
}

.tone-rose .activity-icon,
.tone-pink .activity-icon {
  background: color-mix(in srgb, var(--pink-soft) 88%, var(--surface-contrast));
}

.tone-sky .activity-icon,
.tone-blue .activity-icon {
  background: color-mix(in srgb, var(--sky-soft) 88%, var(--surface-contrast));
}

.tone-emerald .activity-icon,
.tone-green .activity-icon {
  background: color-mix(in srgb, var(--emerald-soft) 88%, var(--surface-contrast));
}

.tone-amber .activity-icon,
.tone-yellow .activity-icon {
  background: color-mix(in srgb, var(--amber-soft) 88%, var(--surface-contrast));
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

  .feedback-main-chart {
    padding: 18px;
  }

  .feedback-overview-grid,
  .feedback-dimension-grid {
    grid-template-columns: 1fr;
  }

  .feedback-bar-strip {
    min-height: 210px;
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

  .feedback-selector-row {
    gap: 8px;
  }

  .feedback-tab {
    width: 100%;
    justify-content: space-between;
  }

  .feedback-bar-strip {
    min-height: 188px;
  }

  .feedback-bar-column {
    flex-basis: 50px;
  }
}

/* Scheduling Mode Styles */
.scheduling-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--surface-stroke-strong);
}

.back-to-activities {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 8px;
  background: transparent;
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
}

.back-to-activities:hover {
  background: color-mix(in srgb, var(--surface-contrast) 30%, transparent);
  border-color: var(--foreground);
}

.scheduling-title {
  flex: 1;
  min-width: 0;
}

.scheduling-date {
  margin: 0;
  color: var(--foreground);
  font-size: 1.25rem;
  font-weight: 700;
}

.day-activities-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  overflow-y: auto;
}

.day-activities-section h3 {
  margin: 0 0 12px;
  color: var(--foreground);
  font-size: 1rem;
  font-weight: 600;
}

.activity-row.scheduling {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-contrast) 40%, transparent);
  transition: all 0.2s ease;
}

.activity-row.scheduling:hover {
  background: color-mix(in srgb, var(--surface-contrast) 50%, transparent);
  transform: translateY(-1px);
}

.activity-row.scheduling .activity-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.activity-row.scheduling .activity-copy {
  flex: 1;
  min-width: 0;
}

.activity-row.scheduling .activity-copy h4 {
  margin: 0;
  color: var(--foreground);
  font-size: 0.95rem;
  font-weight: 600;
}

.activity-row.scheduling .activity-copy p {
  margin: 3px 0 0;
  color: var(--muted-foreground);
  font-size: 0.85rem;
}

.edit-schedule-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 8px;
  background: transparent;
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.edit-schedule-button:hover {
  background: color-mix(in srgb, var(--surface-contrast) 40%, transparent);
  border-color: var(--primary);
  color: var(--primary);
}

.add-schedule-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  margin-top: 12px;
  border: 1px solid var(--primary);
  border-radius: 14px;
  background: var(--primary);
  color: var(--primary-foreground);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-schedule-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-panel);
}

.add-schedule-button:active {
  transform: translateY(0);
}
.activity-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
}

.activity-icon .activity-image {
  display: inline-block;
}

/* ===== Botón "Acabar" en tarjetas de actividad iniciada ===== */
.activity-row.compact {
  position: relative;
}

.finish-activity-button {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid color-mix(in srgb, #10b981 60%, var(--border));
  border-radius: 999px;
  padding: 6px 12px;
  background: color-mix(in srgb, #10b981 12%, var(--card));
  color: #047857;
  font-weight: 800;
  font-size: 0.78rem;
  cursor: pointer;
  z-index: 4;
  transition:
    transform 0.18s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.finish-activity-button:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border-color: #059669;
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
  width: min(100%, 520px);
  padding: 22px;
  border: 1px solid var(--surface-stroke-strong, var(--border));
  border-radius: 28px;
  background: var(--surface-contrast, var(--card));
  color: var(--foreground);
  box-shadow: 0 30px 80px color-mix(in srgb, var(--violet) 24%, transparent);
  max-height: 90vh;
  overflow-y: auto;
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

.finish-question {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}

.finish-label {
  display: block;
  color: var(--foreground);
  font-weight: 800;
  font-size: 0.98rem;
}

.star-row {
  display: inline-flex;
  gap: 8px;
}

.star-button {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--card);
  color: var(--muted-foreground);
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.star-button:hover,
.star-button:focus-visible {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--violet) 42%, var(--border));
  outline: none;
}

.star-button.active {
  background: color-mix(in srgb, var(--violet-soft) 70%, var(--card) 30%);
  border-color: var(--violet-strong);
  color: var(--violet-strong);
}

.star-button.mood.active {
  background: color-mix(in srgb, var(--rose-soft) 70%, var(--card) 30%);
  border-color: var(--rose);
  color: var(--rose);
}

.finish-textarea {
  width: 100%;
  resize: vertical;
  min-height: 80px;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 12px 14px;
  background: var(--card);
  color: var(--foreground);
  font-family: inherit;
  font-size: 0.98rem;
  line-height: 1.5;
}

.finish-textarea:focus-visible {
  outline: none;
  border-color: var(--violet-strong);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--violet) 22%, transparent);
}

.reject-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.reject-actions .primary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .star-button,
  .finish-activity-button {
    transition: none;
  }
  .star-button:hover,
  .star-button:focus-visible,
  .finish-activity-button:hover {
    transform: none;
  }
}

</style>
