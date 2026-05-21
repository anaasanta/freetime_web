import { computed } from 'vue'
import { getActivityByIdWithTranslations } from '@/data/activitiesCopyI18n'

export function parseDate(dateString) {
  if (!dateString) return null

  const [year, month, day] = dateString.split('-').map(Number)

  if (!year || !month || !day) return null

  return {
    year,
    month: month - 1,
    day,
  }
}

export function useProfileActivities({
  currentLanguage,
  profileCopy,
  savedActivities,
  startedActivities,
  completedActivityIds,
  completedActivitiesDisplay,
  plannedActivities,
  allActivities,
  activityImages,
}) {
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())

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

  function normalizeReminder(reminder) {
    if (!reminder) return '30-min'

    const normalized = String(reminder).toLowerCase().trim()

    if (['30-min', '30 min abans', '30 min antes', '30 min before', '30 minutes before'].includes(normalized)) {
      return '30-min'
    }

    if (['1-hour', '1 hora abans', '1 hora antes', '1 hour before'].includes(normalized)) {
      return '1-hour'
    }

    if (['1-day', '1 dia abans', '1 dia antes', '1 day before'].includes(normalized)) {
      return '1-day'
    }

    if (['custom', 'altre', 'otro', 'other'].includes(normalized)) {
      return 'custom'
    }

    if (['none', 'no rebre notificacio', 'no rebre notificació', 'no recibir notificacion', 'no recibir notificación', 'no notification'].includes(normalized)) {
      return 'none'
    }

    return reminder
  }

  function plannedReminderLabel(reminder) {
    const reminderId = normalizeReminder(reminder)
    const option = profileCopy.value.planned.notificationOptions?.find((item) => item.id === reminderId)

    return option?.label ?? reminder ?? profileCopy.value.planned.fallbackReminder
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
          reminder: plannedReminderLabel(item.reminder),
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
    const seenCompletedDays = new Set()

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
      .filter((item) => {
        const key = `${item.activityId}-${item.date}`

        if (seenCompletedDays.has(key)) return false

        seenCompletedDays.add(key)
        return true
      })
  })

  return {
    savedDisplay,
    startedDisplay,
    plannedDisplay,
    completedDisplay,
    isStartedActivity,
    isTriedActivity,
    parseDate,
  }
}
