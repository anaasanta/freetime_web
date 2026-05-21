import { computed, ref } from 'vue'
import { addPlannedActivity, updatePlannedActivity, deletePlannedActivity } from '@/stores/appSession'

export function useProfileCalendar({ profileCopy, plannedActivities, plannedDisplay, completedDisplay, parseDate }) {
  const visibleDate = ref(new Date())
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const isSchedulingMode = ref(false)
  const selectedScheduleDay = ref(null)
  const isActivityModalOpen = ref(false)
  const activityModalMode = ref('add')
  const activityModalDate = ref(null)
  const editingPlannedActivityId = ref(null)

  const visibleYear = computed(() => visibleDate.value.getFullYear())
  const visibleMonth = computed(() => visibleDate.value.getMonth())

  const visibleMonthLabel = computed(() => {
    return `${profileCopy.value.calendar.months[visibleMonth.value]} ${visibleYear.value}`
  })

  function plannedForDate(year, month, day) {
    return plannedDisplay.value.filter((planned) => {
      const parsed = parseDate(planned.date)
      return parsed && parsed.year === year && parsed.month === month && parsed.day === day
    })
  }

  function completedForDate(year, month, day) {
    return completedDisplay.value.filter((completed) => {
      const parsed = parseDate(completed.date)
      return parsed && parsed.year === year && parsed.month === month && parsed.day === day
    })
  }

  const calendarCells = computed(() => {
    const year = visibleYear.value
    const month = visibleMonth.value
    const firstDayOfMonth = new Date(year, month, 1)
    const totalDays = new Date(year, month + 1, 0).getDate()
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

  function selectDayForScheduling(day) {
    if (day.empty || !day.canSchedule) return

    selectedScheduleDay.value = day
    isSchedulingMode.value = true
  }

  function exitSchedulingMode() {
    isSchedulingMode.value = false
    selectedScheduleDay.value = null
  }

  function formatDateString(year, month, day) {
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${year}-${m}-${d}`
  }

  function openAddActivityModal() {
    if (!selectedScheduleDay.value) return

    activityModalDate.value = formatDateString(visibleYear.value, visibleMonth.value, selectedScheduleDay.value.number)
    activityModalMode.value = 'add'
    editingPlannedActivityId.value = null
    isActivityModalOpen.value = true
  }

  function openEditActivityModal(plannedActivityId) {
    activityModalDate.value = null
    activityModalMode.value = 'edit'
    editingPlannedActivityId.value = plannedActivityId
    isActivityModalOpen.value = true
  }

  function handleActivityModalConfirm(data) {
    if (activityModalMode.value === 'add') {
      addPlannedActivity(data.activityId, activityModalDate.value, data.time, data.reminder)
    } else {
      const existing = plannedActivities.value.find((item) => item.id === editingPlannedActivityId.value)

      if (existing) {
        updatePlannedActivity(editingPlannedActivityId.value, data.activityId, existing.date, data.time, data.reminder)
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
    if (isSchedulingMode.value && event.target.closest('.right-panel') === null) {
      exitSchedulingMode()
    }
  }

  const activitiesForSchedulingDay = computed(() => {
    if (!selectedScheduleDay.value) return []

    const dateStr = formatDateString(visibleYear.value, visibleMonth.value, selectedScheduleDay.value.number)

    return plannedDisplay.value.filter((activity) => activity.date === dateStr)
  })

  const selectedSchedulingDayLabel = computed(() => {
    if (!selectedScheduleDay.value) return ''

    const day = selectedScheduleDay.value.number
    const monthName = profileCopy.value.calendar.months[visibleMonth.value]

    return `${day} de ${monthName} de ${visibleYear.value}`
  })

  return {
    isSchedulingMode,
    selectedScheduleDay,
    isActivityModalOpen,
    activityModalMode,
    activityModalDate,
    editingPlannedActivityId,
    visibleMonthLabel,
    calendarCells,
    activitiesForSchedulingDay,
    selectedSchedulingDayLabel,
    previousMonth,
    nextMonth,
    goToCurrentMonth,
    tooltipForDay,
    selectDayForScheduling,
    exitSchedulingMode,
    openAddActivityModal,
    openEditActivityModal,
    handleActivityModalConfirm,
    handleActivityModalDelete,
    handleActivityModalCancel,
    handleProfileColumnsClick,
  }
}
