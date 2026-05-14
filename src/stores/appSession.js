import { computed, ref, watch } from 'vue'

import { allActivities } from '@/data/activities'
import { mockUsers } from '@/data/mockUser'
import { getRecommendations } from '@/data/recommender'
import { appMessages } from '@/data/uiText'

const SESSION_STORAGE_KEY = 'freetime-session'
const USER_STATE_STORAGE_KEY = 'freetime-user-state'

const currentUser = ref(null)
const loginError = ref('')

const savedActivityIds = ref([])
const startedActivityIds = ref([])
const completedActivities = ref([])
const plannedActivities = ref([])

const selectedActivityId = ref(null)
const selectedActivitySource = ref('normal')
const scheduleDraft = ref(null)
const testRecommendations = ref([])
const testAnswers = ref(null)
const testRejectedActivityIds = ref([])

const savedActivities = computed(() =>
  savedActivityIds.value
    .map((id) => allActivities.find((activity) => activity.id === id))
    .filter(Boolean),
)

const startedActivities = computed(() =>
  startedActivityIds.value
    .map((id) => allActivities.find((activity) => activity.id === id))
    .filter(Boolean),
)

const recommendedActivities = computed(() =>
  allActivities.filter((activity) => !savedActivityIds.value.includes(activity.id)).slice(0, 4),
)

const selectedActivity = computed(() =>
  allActivities.find((activity) => activity.id === selectedActivityId.value) || null,
)

const completedActivitiesDisplay = computed(() =>
  completedActivities.value
    .map((completed) => {
      const activity = allActivities.find((item) => item.id === completed.activityId)

      if (!activity) return null

      return {
        ...completed,
        activity,
      }
    })
    .filter(Boolean),
)

const completedActivityIds = computed(() => [
  ...new Set(completedActivities.value.map((activity) => activity.activityId)),
])

function normalizeReminder(reminder) {
  if (!reminder) return '30-min'

  const normalized = String(reminder).toLowerCase().trim()

  if (['30-min', '30 min abans', '30 min antes', '30 min before', '30 minutes before'].includes(normalized)) {
    return '30-min'
  }

  if (['1-hour', '1 hora abans', '1 hora antes', '1 hour before'].includes(normalized)) {
    return '1-hour'
  }

  if (['1-day', '1 dia abans', '1 día antes', '1 day before'].includes(normalized)) {
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

function normalizePlannedActivities(items) {
  return items.map((item) => ({
    ...item,
    day: item.day ?? item.date,
    date: item.date ?? item.day,
    reminder: normalizeReminder(item.reminder),
  }))
}

function resetSessionState() {
  currentUser.value = null
  savedActivityIds.value = []
  startedActivityIds.value = []
  completedActivities.value = []
  plannedActivities.value = []
  selectedActivityId.value = null
  selectedActivitySource.value = 'normal'
  scheduleDraft.value = null
  testRecommendations.value = []
  testAnswers.value = null
  testRejectedActivityIds.value = []
  loginError.value = ''
}

function clearPersistedSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}

function getPersistedUserStates() {
  if (typeof window === 'undefined') return {}

  const rawState = window.localStorage.getItem(USER_STATE_STORAGE_KEY)

  if (!rawState) return {}

  try {
    const states = JSON.parse(rawState)
    return states && typeof states === 'object' ? states : {}
  } catch {
    window.localStorage.removeItem(USER_STATE_STORAGE_KEY)
    return {}
  }
}

function persistCurrentUserState() {
  if (typeof window === 'undefined' || !currentUser.value) return

  const states = getPersistedUserStates()

  states[currentUser.value.id] = {
    savedActivityIds: savedActivityIds.value,
    startedActivityIds: startedActivityIds.value,
    completedActivities: completedActivities.value,
    plannedActivities: plannedActivities.value,
  }

  window.localStorage.setItem(USER_STATE_STORAGE_KEY, JSON.stringify(states))
}

function getUserState(user) {
  const states = getPersistedUserStates()
  const persisted = states[user.id]
  const baseCompletedActivities = Array.isArray(persisted?.completedActivities)
    ? [...persisted.completedActivities]
    : [...user.completedActivities]
  const completedActivityIds = baseCompletedActivities.map((activity) => activity.activityId)

  return {
    savedActivityIds: Array.isArray(persisted?.savedActivityIds)
      ? [...persisted.savedActivityIds]
      : [...user.savedActivityIds],
    startedActivityIds: Array.isArray(persisted?.startedActivityIds)
      ? [...persisted.startedActivityIds]
      : [...new Set([...(user.startedActivityIds ?? []), ...completedActivityIds])],
    completedActivities: baseCompletedActivities,
    plannedActivities: Array.isArray(persisted?.plannedActivities)
      ? normalizePlannedActivities(persisted.plannedActivities)
      : normalizePlannedActivities(user.plannedActivities),
  }
}

function persistSession() {
  if (typeof window === 'undefined') return

  if (!currentUser.value) {
    clearPersistedSession()
    return
  }

  persistCurrentUserState()

  const payload = {
    userId: currentUser.value.id,
    savedActivityIds: savedActivityIds.value,
    startedActivityIds: startedActivityIds.value,
    completedActivities: completedActivities.value,
    plannedActivities: plannedActivities.value,
    selectedActivityId: selectedActivityId.value,
    selectedActivitySource: selectedActivitySource.value,
    scheduleDraft: scheduleDraft.value,
    testRecommendations: testRecommendations.value,
    testAnswers: testAnswers.value,
    testRejectedActivityIds: testRejectedActivityIds.value,
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload))
}

function restoreSession() {
  if (typeof window === 'undefined') return

  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY)

  if (!rawSession) return

  try {
    const session = JSON.parse(rawSession)
    const foundUser = mockUsers.find((user) => user.id === session.userId)

    if (!foundUser) {
      clearPersistedSession()
      return
    }

    const persistedUserState = getUserState(foundUser)

    currentUser.value = foundUser
    savedActivityIds.value = Array.isArray(session.savedActivityIds)
      ? [...session.savedActivityIds]
      : persistedUserState.savedActivityIds
    startedActivityIds.value = Array.isArray(session.startedActivityIds)
      ? [...session.startedActivityIds]
      : Array.isArray(session.completedActivities)
        ? [...new Set(session.completedActivities.map((activity) => activity.activityId))]
        : persistedUserState.startedActivityIds
    completedActivities.value = Array.isArray(session.completedActivities)
      ? [...session.completedActivities]
      : persistedUserState.completedActivities
    plannedActivities.value = Array.isArray(session.plannedActivities)
      ? normalizePlannedActivities(session.plannedActivities)
      : persistedUserState.plannedActivities
    selectedActivityId.value = session.selectedActivityId ?? null
    selectedActivitySource.value = session.selectedActivitySource ?? 'normal'
    scheduleDraft.value = session.scheduleDraft ?? null
    testRecommendations.value = Array.isArray(session.testRecommendations)
      ? [...session.testRecommendations]
      : []
    testAnswers.value = session.testAnswers ?? null
    testRejectedActivityIds.value = Array.isArray(session.testRejectedActivityIds)
      ? [...session.testRejectedActivityIds]
      : []
  } catch {
    clearPersistedSession()
  }
}

let isInitialized = false

export function initializeAppSession() {
  if (isInitialized) return

  restoreSession()

  watch(
    [
      currentUser,
      savedActivityIds,
      startedActivityIds,
      completedActivities,
      plannedActivities,
      selectedActivityId,
      selectedActivitySource,
      scheduleDraft,
      testRecommendations,
      testAnswers,
      testRejectedActivityIds,
    ],
    () => {
      persistSession()
    },
    { deep: true },
  )

  isInitialized = true
}

export function login(credentials) {
  const foundUser = mockUsers.find(
    (user) =>
      user.username === credentials.username.trim() && user.password === credentials.password,
  )

  if (!foundUser) {
    loginError.value = appMessages.auth.invalidCredentials
    return false
  }

  const persistedUserState = getUserState(foundUser)

  currentUser.value = foundUser
  savedActivityIds.value = persistedUserState.savedActivityIds
  startedActivityIds.value = persistedUserState.startedActivityIds
  completedActivities.value = persistedUserState.completedActivities
  plannedActivities.value = persistedUserState.plannedActivities
  selectedActivityId.value = null
  selectedActivitySource.value = 'normal'
  scheduleDraft.value = null
  testRecommendations.value = []
  testAnswers.value = null
  testRejectedActivityIds.value = []
  loginError.value = ''
  return true
}

export function logout() {
  persistCurrentUserState()
  resetSessionState()
  clearPersistedSession()
}

export function isAuthenticated() {
  return Boolean(currentUser.value)
}

export function syncSelectedActivity(activityId, source = 'normal') {
  selectedActivityId.value = activityId ?? null
  selectedActivitySource.value = source || 'normal'
}

export function addSavedActivity(activityId) {
  if (!savedActivityIds.value.includes(activityId)) {
    savedActivityIds.value.push(activityId)
  }
}

export function addStartedActivity(activityId) {
  addSavedActivity(activityId)

  if (!startedActivityIds.value.includes(activityId)) {
    startedActivityIds.value.push(activityId)
  }
}

export function removeSavedActivity(activityId) {
  savedActivityIds.value = savedActivityIds.value.filter((id) => id !== activityId)
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function startActivity(activityId) {
  addStartedActivity(activityId)

  completedActivities.value.push({
    id: `completed-${activityId}-${Date.now()}`,
    activityId,
    date: formatDate(new Date()),
    energyBefore: 35,
    energyAfter: 62,
    note: 'Activitat completada des del prototip.',
  })
}

export function finishTest(answers) {
  testAnswers.value = { ...answers }
  testRejectedActivityIds.value = []
  testRecommendations.value = getRecommendations({ ...answers, excludedIds: [] })

  const firstRecommendation = testRecommendations.value[0] ?? null
  syncSelectedActivity(firstRecommendation?.id ?? null, 'test')

  return firstRecommendation?.id ?? null
}

export function rejectActivity(reason) {
  const currentId = selectedActivityId.value
  const rejectedActivity = allActivities.find((activity) => activity.id === currentId) ?? null

  if (currentId) {
    testRejectedActivityIds.value = [...new Set([...testRejectedActivityIds.value, currentId])]
  }

  if (!testAnswers.value) return null

  testRecommendations.value = getRecommendations({
    ...testAnswers.value,
    excludedIds: testRejectedActivityIds.value,
    rejectionReason: reason,
    rejectedActivity,
  })

  const secondRecommendation = testRecommendations.value[0] ?? null
  syncSelectedActivity(secondRecommendation?.id ?? null, 'test-adjusted')

  return secondRecommendation?.id ?? null
}

export function createScheduleDraft(activityId, day, time, reminder) {
  scheduleDraft.value = {
    activityId,
    day,
    date: day,
    time,
    reminder: normalizeReminder(reminder),
  }
}

export function confirmSchedule() {
  if (!scheduleDraft.value) return false

  plannedActivities.value.push(
    normalizePlannedActivities([
      {
        id: `${scheduleDraft.value.activityId}-${Date.now()}`,
        ...scheduleDraft.value,
      },
    ])[0],
  )

  addSavedActivity(scheduleDraft.value.activityId)
  scheduleDraft.value = null
  return true
}

export function addPlannedActivity(activityId, date, time, reminder = '30-min') {
  const newPlanned = {
    id: `${activityId}-${Date.now()}`,
    activityId,
    date,
    time,
    reminder: normalizeReminder(reminder),
  }

  plannedActivities.value.push(newPlanned)
  addSavedActivity(activityId)
}

export function updatePlannedActivity(plannedActivityId, activityId, date, time, reminder = '30-min') {
  const index = plannedActivities.value.findIndex((p) => p.id === plannedActivityId)
  if (index === -1) return false

  plannedActivities.value[index] = {
    ...plannedActivities.value[index],
    activityId,
    date,
    time,
    reminder: normalizeReminder(reminder),
  }

  return true
}

export function deletePlannedActivity(plannedActivityId) {
  const index = plannedActivities.value.findIndex((p) => p.id === plannedActivityId)
  if (index === -1) return false

  plannedActivities.value.splice(index, 1)
  return true
}

export function completeActivity(activityId, data) {
  // 1) Añadir registro a completedActivities (usando el ref correcto)
  completedActivities.value.push({
    id: `completed-${activityId}-${Date.now()}`,
    activityId,
    rating: data.rating,
    moodImprovement: data.moodImprovement,
    note: data.note ?? '',
    energyBefore: data.energyBefore,
    energyAfter: data.energyAfter,
    date: data.date ?? formatDate(new Date()),
  })

  // 2) Quitarla de las iniciadas
  startedActivityIds.value = startedActivityIds.value.filter(
    (id) => id !== activityId,
  )
}

export function useAppSession() {
  return {
    allActivities,
    currentUser,
    loginError,
    savedActivities,
    startedActivities,
    recommendedActivities,
    completedActivitiesDisplay,
    completedActivityIds,
    plannedActivities,
    selectedActivity,
    selectedActivityId,
    selectedActivitySource,
    scheduleDraft,
    login,
    logout,
    syncSelectedActivity,
    addSavedActivity,
    addStartedActivity,
    removeSavedActivity,
    startActivity,
    finishTest,
    rejectActivity,
    createScheduleDraft,
    confirmSchedule,
    addPlannedActivity,
    updatePlannedActivity,
    deletePlannedActivity,
    completeActivity,
  }
}
