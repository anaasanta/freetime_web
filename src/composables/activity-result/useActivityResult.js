import { computed, ref, watch } from 'vue'
import { getActivityByIdWithTranslations } from '@/data/activitiesCopyI18n'
import { getActivityCopy, getActivityResultCopy } from '@/data/testCopyI18n'
import {
  addSavedActivity,
  completeActivity,
  rejectActivity,
  removeSavedActivity,
  startActivity,
  syncSelectedActivity,
  useAppSession,
} from '@/stores/appSession'

export function useActivityResult({ route, router, currentLanguage, activityImageModules }) {
  const {
    currentUser,
    selectedActivity,
    selectedActivitySource,
    savedActivities,
    startedActivities,
    completedActivityIds,
  } = useAppSession()
  const showRejectModal = ref(false)
  const showAuthPrompt = ref(false)
  const selectedRejectReason = ref('effort')
  const showFinishModal = ref(false)

  const activityCopy = computed(() => getActivityCopy(currentLanguage.value))
  const activityResultCopy = computed(() => getActivityResultCopy(currentLanguage.value))
  const isGuest = computed(() => !currentUser.value)
  const loginRoute = computed(() => ({
    name: 'login',
    query: { redirect: router.currentRoute.value.fullPath },
  }))
  const rejectionOptions = computed(() => Object.entries(activityResultCopy.value.rejectModal.options))
  const translatedActivity = computed(() => {
    if (!selectedActivity.value) return null
    return getActivityByIdWithTranslations(selectedActivity.value.id, currentLanguage.value) ?? selectedActivity.value
  })
  const activityImageSrc = computed(() => {
    if (!selectedActivity.value) return null
    return activityImageModules[`../data/activity_images/${selectedActivity.value.id}.png`] ?? null
  })
  const isSaved = computed(() =>
    selectedActivity.value
      ? savedActivities.value.some((activity) => activity.id === selectedActivity.value.id)
      : false,
  )
  const isStarted = computed(() =>
    selectedActivity.value
      ? startedActivities.value.some((activity) => activity.id === selectedActivity.value.id)
      : false,
  )
  const isCompleted = computed(() =>
    selectedActivity.value ? completedActivityIds.value.includes(selectedActivity.value.id) : false,
  )
  const canRejectActivity = computed(() =>
    ['test', 'test-adjusted'].includes(selectedActivitySource.value) && !isStarted.value && !isCompleted.value,
  )

  function syncFromRoute() {
    const activityId = typeof route.params.id === 'string' ? route.params.id : null
    const source = typeof route.query.source === 'string' ? route.query.source : 'normal'
    syncSelectedActivity(activityId, source)
  }

  watch(() => [route.params.id, route.query.source], syncFromRoute, { immediate: true })

  function requireUser() {
    if (!isGuest.value) return false

    showAuthPrompt.value = true
    return true
  }

  function handleSaveToggle() {
    if (!selectedActivity.value || requireUser()) return

    if (isSaved.value) {
      removeSavedActivity(selectedActivity.value.id)
    } else {
      addSavedActivity(selectedActivity.value.id)
    }
  }

  function handleStart() {
    if (!selectedActivity.value || requireUser()) return

    startActivity(selectedActivity.value.id)
  }

  function openAiConsult() {
    if (!selectedActivity.value || requireUser()) return

    router.push({
      name: 'ai-consult',
      query: {
        activityId: selectedActivity.value.id,
        source: selectedActivitySource.value,
      },
    })
  }

  function openFinishModal() {
    if (!selectedActivity.value || requireUser()) return

    showFinishModal.value = true
  }

  function closeFinishModal() {
    showFinishModal.value = false
  }

  function closeDetail() {
    const from = typeof route.query.from === 'string' ? route.query.from : ''

    router.push({ name: from === 'profile' ? 'profile' : 'home' })
  }

  function confirmFinish(feedback) {
    if (!selectedActivity.value) return

    const moodDelta = [0, 5, 12, 22, 32, 42][feedback.moodImprovement] ?? 22
    const energyBefore = 35
    const energyAfter = Math.min(100, energyBefore + moodDelta)

    completeActivity(selectedActivity.value.id, {
      rating: feedback.rating,
      moodImprovement: feedback.moodImprovement,
      note: feedback.note,
      energyBefore,
      energyAfter,
      date: new Date().toISOString(),
    })

    closeFinishModal()
  }

  function openRejectModal() {
    if (!selectedActivity.value) return
    showRejectModal.value = true
  }

  function closeRejectModal() {
    showRejectModal.value = false
  }

  function closeAuthPrompt() {
    showAuthPrompt.value = false
  }

  function replaceWithAlternative(nextId) {
    showRejectModal.value = false

    if (!nextId) {
      router.replace({ name: 'home' })
      return
    }

    router.replace({
      name: 'activity',
      params: { id: nextId },
      query: {
        source: 'test-adjusted',
        ...(typeof route.query.from === 'string' ? { from: route.query.from } : {}),
      },
    })
  }

  function confirmReject() {
    if (!selectedActivity.value) return

    replaceWithAlternative(rejectActivity(selectedRejectReason.value))
  }

  function skipRejectQuestion() {
    if (!selectedActivity.value) return

    replaceWithAlternative(rejectActivity(null))
  }

  return {
    selectedActivity,
    activityCopy,
    activityResultCopy,
    translatedActivity,
    activityImageSrc,
    loginRoute,
    rejectionOptions,
    selectedRejectReason,
    showRejectModal,
    showAuthPrompt,
    showFinishModal,
    isSaved,
    isStarted,
    canRejectActivity,
    handleSaveToggle,
    handleStart,
    openAiConsult,
    openFinishModal,
    closeFinishModal,
    closeDetail,
    confirmFinish,
    openRejectModal,
    closeRejectModal,
    closeAuthPrompt,
    confirmReject,
    skipRejectQuestion,
  }
}
