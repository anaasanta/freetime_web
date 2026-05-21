import { computed, ref, watch } from 'vue'

import { allActivities } from '@/data/activities'
import { mockUsers } from '@/data/mockUser'
import { getRecommendations } from '@/data/recommender'
import { appMessages } from '@/data/uiText'

const SESSION_STORAGE_KEY = 'freetime-session'
const USER_STATE_STORAGE_KEY = 'freetime-user-state'
const LAURA_ALLOWED_ACTIVITY_IDS = new Set(['yoga', 'breathing', 'walk'])

// Estado principal de la sesion. Lo dejamos en refs para que las vistas se actualicen solas.
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

// Convertimos los ids guardados en objetos completos de actividad para pintarlos en la interfaz.
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
  // Recomendaciones simples de home: evitamos enseñar lo que ya esta guardado.
  allActivities.filter((activity) => !savedActivityIds.value.includes(activity.id)).slice(0, 4),
)

const selectedActivity = computed(() =>
  // Actividad que se esta viendo en la pantalla de detalle.
  allActivities.find((activity) => activity.id === selectedActivityId.value) || null,
)

const completedActivitiesDisplay = computed(() =>
  // Juntamos cada sesion completada con los datos completos de su actividad.
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

// Normalizamos recordatorios porque pueden venir en distintos idiomas o formatos.
function normalizeReminder(reminder) {
  if (!reminder) return '30-min'

  const normalized = String(reminder).toLowerCase().trim()

  if (['30-min', '30 min abans', '30 min antes', '30 min before', '30 minutes before'].includes(normalized)) {
    return '30-min'
  }

  if (['1-hour', '1 hora abans', '1 hora antes', '1 hour before'].includes(normalized)) {
    return '1-hour'
  }

  if (['1-day', '1 dia abans', '1 dÃ­a antes', '1 day before'].includes(normalized)) {
    return '1-day'
  }

  if (['custom', 'altre', 'otro', 'other'].includes(normalized)) {
    return 'custom'
  }

  if (['none', 'no rebre notificacio', 'no rebre notificaciÃ³', 'no recibir notificacion', 'no recibir notificaciÃ³n', 'no notification'].includes(normalized)) {
    return 'none'
  }

  return reminder
}

function normalizePlannedActivities(items) {
  // Algunas partes usan day y otras date, por eso guardamos ambos.
  return items.map((item) => ({
    ...item,
    day: item.day ?? item.date,
    date: item.date ?? item.day,
    reminder: normalizeReminder(item.reminder),
  }))
}

function dedupeCompletedActivities(items) {
  // Evita que se repita la misma actividad completada el mismo dia.
  const seen = new Set()

  return items.filter((activity) => {
    const key = `${activity.activityId ?? activity.id}-${activity.date ?? 'no-date'}`

    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}

function normalizeUserActivityState(user, state) {
  if (user.id !== 'laura') return state

  // Laura tiene datos preparados para la demo, asi que limitamos su perfil a esas actividades.
  const completedActivitiesForLaura = state.completedActivities.filter((activity) =>
    LAURA_ALLOWED_ACTIVITY_IDS.has(activity.activityId),
  )

  return {
    ...state,
    savedActivityIds: state.savedActivityIds.filter((id) => LAURA_ALLOWED_ACTIVITY_IDS.has(id)),
    startedActivityIds: state.startedActivityIds.filter((id) => LAURA_ALLOWED_ACTIVITY_IDS.has(id)),
    completedActivities: dedupeCompletedActivities(completedActivitiesForLaura),
    plannedActivities: state.plannedActivities.filter((activity) =>
      LAURA_ALLOWED_ACTIVITY_IDS.has(activity.activityId),
    ),
  }
}

function resetSessionState() {
  // Dejamos la app como si acabara de abrirse sin usuario.
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
  // Borra solo la sesion activa, no el historial guardado por usuario.
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
    // Si localStorage queda corrupto, lo limpiamos para que la app pueda arrancar bien.
    window.localStorage.removeItem(USER_STATE_STORAGE_KEY)
    return {}
  }
}

function persistCurrentUserState() {
  // Guardamos el estado privado de cada usuario por separado.
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
  // Primero intentamos usar datos guardados; si no existen, usamos el mock inicial.
  const states = getPersistedUserStates()
  const persisted = states[user.id]
  const baseCompletedActivities = Array.isArray(persisted?.completedActivities)
    ? [...persisted.completedActivities]
    : [...user.completedActivities]
  const completedActivityIds = baseCompletedActivities.map((activity) => activity.activityId)

  return normalizeUserActivityState(user, {
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
  })
}

function persistSession() {
  // Guarda la sesion activa para no perder la navegacion al recargar.
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
  // Recupera la sesion activa si existe en localStorage.
  if (typeof window === 'undefined') return

  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY)

  if (!rawSession) return

  try {
    const session = JSON.parse(rawSession)
    const foundUser = mockUsers.find((user) => user.id === session.userId)

    if (!foundUser) {
      // Si el usuario guardado ya no existe en los mocks, borramos la sesion antigua.
      clearPersistedSession()
      return
    }

    const persistedUserState = getUserState(foundUser)

    const sessionUserState = normalizeUserActivityState(foundUser, {
      savedActivityIds: Array.isArray(session.savedActivityIds)
        ? [...session.savedActivityIds]
        : persistedUserState.savedActivityIds,
      startedActivityIds: Array.isArray(session.startedActivityIds)
        ? [...session.startedActivityIds]
        : Array.isArray(session.completedActivities)
          ? [...new Set(session.completedActivities.map((activity) => activity.activityId))]
          : persistedUserState.startedActivityIds,
      completedActivities: Array.isArray(session.completedActivities)
        ? [...session.completedActivities]
        : persistedUserState.completedActivities,
      plannedActivities: Array.isArray(session.plannedActivities)
        ? normalizePlannedActivities(session.plannedActivities)
        : persistedUserState.plannedActivities,
    })

    currentUser.value = foundUser
    savedActivityIds.value = sessionUserState.savedActivityIds
    startedActivityIds.value = sessionUserState.startedActivityIds
    completedActivities.value = sessionUserState.completedActivities
    plannedActivities.value = sessionUserState.plannedActivities
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

  // Cada cambio importante se guarda para mantener la sesion al recargar la pagina.
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

export function clearLoginError() {
  loginError.value = ''
}

export function login(credentials, messages = {}) {
  // En este prototipo el login se compara con usuarios mock.
  const foundUser = mockUsers.find(
    (user) =>
      user.username === credentials.username.trim() && user.password === credentials.password,
  )

  if (!foundUser) {
    loginError.value = messages.invalidCredentials ?? appMessages.auth.invalidCredentials
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
  // Antes de salir guardamos el estado del usuario actual.
  persistCurrentUserState()
  resetSessionState()
  clearPersistedSession()
}

export function isAuthenticated() {
  return Boolean(currentUser.value)
}

export function syncSelectedActivity(activityId, source = 'normal') {
  // El source indica si viene de home, perfil, test o recomendacion ajustada.
  selectedActivityId.value = activityId ?? null
  selectedActivitySource.value = source || 'normal'
}

export function addSavedActivity(activityId) {
  // Evitamos ids repetidos en la lista guardada.
  if (!savedActivityIds.value.includes(activityId)) {
    savedActivityIds.value.push(activityId)
  }
}

export function addStartedActivity(activityId) {
  // Una actividad empezada tambien queda guardada automaticamente.
  addSavedActivity(activityId)

  if (!startedActivityIds.value.includes(activityId)) {
    startedActivityIds.value.push(activityId)
  }
}

export function removeSavedActivity(activityId) {
  savedActivityIds.value = savedActivityIds.value.filter((id) => id !== activityId)
}

function formatDate(date) {
  // Formato estable para comparar fechas sin depender del idioma.
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function startActivity(activityId) {
  addStartedActivity(activityId)

  // Para el prototipo marcamos la actividad como completada al empezarla.
  completedActivities.value.push({
    id: `completed-${activityId}-${Date.now()}`,
    activityId,
    date: formatDate(new Date()),
    energyBefore: 35,
    energyAfter: 62,
    note: 'Activitat completada des del prototip.',
  })
}

function getStartedActivityExclusionIds() {
  // El test no deberia recomendar algo que la persona ya ha empezado o completado.
  return [...new Set([...startedActivityIds.value, ...completedActivityIds.value])]
}

export function finishTest(answers) {
  // Guardamos las respuestas para poder recalcular si luego pulsa "No me interesa".
  testAnswers.value = { ...answers }
  testRejectedActivityIds.value = []
  testRecommendations.value = getRecommendations({
    ...answers,
    excludedIds: getStartedActivityExclusionIds(),
  })

  const firstRecommendation = testRecommendations.value[0] ?? null
  syncSelectedActivity(firstRecommendation?.id ?? null, 'test')

  return firstRecommendation?.id ?? null
}

export function rejectActivity(reason) {
  const currentId = selectedActivityId.value
  const rejectedActivity = allActivities.find((activity) => activity.id === currentId) ?? null

  if (currentId) {
    // Evitamos volver a recomendar una actividad rechazada en este test.
    testRejectedActivityIds.value = [...new Set([...testRejectedActivityIds.value, currentId])]
  }

  if (!testAnswers.value) return null

  const adjustedRecommendations = getRecommendations({
    ...testAnswers.value,
    excludedIds: [...new Set([...testRejectedActivityIds.value, ...getStartedActivityExclusionIds()])],
    rejectionReason: reason,
    rejectedActivity,
  })
  const fallbackRecommendations =
    adjustedRecommendations.length > 0
      ? adjustedRecommendations
      : getRecommendations({
          ...testAnswers.value,
          excludedIds: [...new Set([...testRejectedActivityIds.value, ...getStartedActivityExclusionIds()])],
        })

  testRecommendations.value = fallbackRecommendations

  const secondRecommendation = fallbackRecommendations[0] ?? null
  syncSelectedActivity(secondRecommendation?.id ?? null, 'test-adjusted')

  return secondRecommendation?.id ?? null
}

export function createScheduleDraft(activityId, day, time, reminder) {
  // Borrador temporal usado antes de confirmar una actividad programada.
  scheduleDraft.value = {
    activityId,
    day,
    date: day,
    time,
    reminder: normalizeReminder(reminder),
  }
}

export function confirmSchedule() {
  // Pasa el borrador a la lista real de actividades programadas.
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
  // Crea una actividad programada directamente desde el calendario.
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
  // Actualiza una actividad programada sin cambiar su identificador.
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
  // Elimina una actividad del calendario.
  const index = plannedActivities.value.findIndex((p) => p.id === plannedActivityId)
  if (index === -1) return false

  plannedActivities.value.splice(index, 1)
  return true
}

export function completeActivity(activityId, data) {
  // Anadimos el feedback de la actividad al historial.
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

  // Al terminarla ya no aparece como actividad en curso.
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
    clearLoginError,
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
