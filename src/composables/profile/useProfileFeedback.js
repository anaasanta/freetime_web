import { computed, ref, watch } from 'vue'
import { getActivityByIdWithTranslations } from '@/data/activitiesCopyI18n'

export function useProfileFeedback({ currentLanguage, profileCopy, completedDisplay, parseDate }) {
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

  return {
    selectedFeedbackActivityId,
    feedbackActivityOptions,
    selectedFeedbackActivity,
    feedbackLineSeries,
  }
}
