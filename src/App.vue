<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { allActivities } from './data/activities'
import { mockUsers } from './data/mockUser'
import { getRecommendations } from '@/data/recommender'

import LoginView from './views/LoginView.vue'
import HomeView from './views/HomeView.vue'
import TestView from './views/TestView.vue'
import ActivityResultView from './views/ActivityResultView.vue'
import ProfileView from './views/ProfileView.vue'
import ScheduleDayView from './views/ScheduleDayView.vue'
import ScheduleConfirmView from './views/ScheduleConfirmView.vue'
import ExitSurveyModal from './components/ui/ExitSurveyModal.vue'

const currentView = ref('login')
const loginError = ref('')

const currentUser = ref(null)

const savedActivityIds = ref([])
const completedActivities = ref([])
const plannedActivities = ref([])

const selectedActivityId = ref(null)
const selectedActivitySource = ref('normal')

const scheduleDraft = ref(null)

const showExitSurvey = ref(false)

const savedActivities = computed(() => {
  return savedActivityIds.value
    .map((id) => allActivities.find((activity) => activity.id === id))
    .filter(Boolean)
})


const recommendedActivities = computed(() => {
  return allActivities.filter((activity) => !savedActivityIds.value.includes(activity.id)).slice(0, 4)
})

const testRecommendations = ref([])

const selectedActivity = computed(() => {
  return allActivities.find((activity) => activity.id === selectedActivityId.value)
})

const completedActivitiesDisplay = computed(() => {
  return completedActivities.value
    .map((completed) => {
      const activity = allActivities.find((item) => item.id === completed.activityId)

      if (!activity) return null

      return {
        ...completed,
        activity,
      }
    })
    .filter(Boolean)
})

function currentHistoryState(viewName) {
  return {
    view: viewName,
    selectedActivityId: selectedActivityId.value,
    selectedActivitySource: selectedActivitySource.value,
    scheduleDraft: scheduleDraft.value,
  }
}

function updateBrowserHistory(viewName) {
  window.history.pushState(currentHistoryState(viewName), '', `#${viewName}`)
}

function replaceBrowserHistory(viewName) {
  window.history.replaceState(currentHistoryState(viewName), '', `#${viewName}`)
}

function goTo(viewName) {
  currentView.value = viewName
  updateBrowserHistory(viewName)
}

function handleBrowserBack(event) {
  const state = event.state

  if (!state || !state.view) {
    currentView.value = currentUser.value ? 'home' : 'login'
    return
  }

  currentView.value = state.view

  if (state.selectedActivityId !== undefined) {
    selectedActivityId.value = state.selectedActivityId
  }

  if (state.selectedActivitySource !== undefined) {
    selectedActivitySource.value = state.selectedActivitySource
  }

  if (state.scheduleDraft !== undefined) {
    scheduleDraft.value = state.scheduleDraft
  }
}

onMounted(() => {
  replaceBrowserHistory(currentView.value)
  window.addEventListener('popstate', handleBrowserBack)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleBrowserBack)
})


function login({ username, password }) {
  const foundUser = mockUsers.find(
    (user) => user.username === username && user.password === password,
  )

  if (!foundUser) {
    loginError.value = 'Usuari o contrasenya incorrectes.'
    return
  }

  currentUser.value = foundUser

  savedActivityIds.value = [...foundUser.savedActivityIds]
  completedActivities.value = [...foundUser.completedActivities]
  plannedActivities.value = [...foundUser.plannedActivities]

  loginError.value = ''
  currentView.value = 'home'
  replaceBrowserHistory('home')
}

function logout() {
  currentUser.value = null
  savedActivityIds.value = []
  completedActivities.value = []
  plannedActivities.value = []
  selectedActivityId.value = null
  selectedActivitySource.value = 'normal'
  scheduleDraft.value = null
  loginError.value = ''
  currentView.value = 'login'
  replaceBrowserHistory('login')
}

function openActivity(activityId, source = 'normal') {
  selectedActivityId.value = activityId
  selectedActivitySource.value = source
  goTo('activity-result')
}

function addSavedActivity(activityId) {
  if (!savedActivityIds.value.includes(activityId)) {
    savedActivityIds.value.push(activityId)
  }
}

function removeSavedActivity(activityId) {
  savedActivityIds.value = savedActivityIds.value.filter((id) => id !== activityId)
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function startActivity(activityId) {
  addSavedActivity(activityId)

  completedActivities.value.push({
    id: `completed-${activityId}-${Date.now()}`,
    activityId,
    date: formatDate(new Date()),
    energyBefore: 35,
    energyAfter: 62,
    note: 'Activitat completada des del prototip.',
  })

  goTo('profile')
}

function finishTest(answers) {
  testRecommendations.value = getRecommendations(answers)
  selectedActivityId.value = testRecommendations.value[0]?.id || null
  selectedActivitySource.value = 'test'
  goTo('activity-result')
}

function rejectActivity() {
  selectedActivityId.value = testRecommendations.value[1]?.id || null
  selectedActivitySource.value = 'test-adjusted'
  replaceBrowserHistory('activity-result')
}

function handleExitConfirm(reason) {
  console.log('Motiu de sortida:', reason)
  showExitSurvey.value = false
  goTo('home')
}

function onFeedback() {
  if (selectedActivitySource.value === 'test' || selectedActivitySource.value === 'test-adjusted') {
    showExitSurvey.value = true
  } else {
    goTo('home')
  }
}

function createScheduleDraft(activityId, date, time, reminder) {
  scheduleDraft.value = {
    activityId,
    date,
    time,
    reminder,
  }

  goTo('schedule-confirm')
}

function confirmSchedule() {
  if (!scheduleDraft.value) return

  const newPlannedActivity = {
    id: `${scheduleDraft.value.activityId}-${Date.now()}`,
    ...scheduleDraft.value,
  }

  plannedActivities.value.push(newPlannedActivity)
  addSavedActivity(scheduleDraft.value.activityId)

  scheduleDraft.value = null
  goTo('profile')
}
</script>

<template>
  <LoginView
    v-if="currentView === 'login'"
    :error-message="loginError"
    @login="login"
  />

  <HomeView
    v-else-if="currentView === 'home'"
    :user="currentUser"
    :saved-activities="savedActivities"
    :recommended-activities="recommendedActivities"
    :all-activities="allActivities"
    :planned-activities="plannedActivities"
    @go-test="goTo('test')"
    @go-profile="goTo('profile')"
    @open-activity="openActivity"
    @add-activity="addSavedActivity"
    @logout="logout"
  />

  <TestView
    v-else-if="currentView === 'test'"
    @finish-test="finishTest"
    @close="goTo('home')"
  />

  <ActivityResultView
    v-else-if="currentView === 'activity-result'"
    :activity="selectedActivity"
    :source="selectedActivitySource"
    :is-saved="selectedActivity ? savedActivityIds.includes(selectedActivity.id) : false"
    @reject="rejectActivity"
    @start="startActivity"
    @save="addSavedActivity"
    @remove="removeSavedActivity"
    @go-home="goTo('home')"
    @go-profile="goTo('profile')"
    @feedback="onFeedback"
  />

  <ProfileView
    v-else-if="currentView === 'profile'"
    :user="currentUser"
    :saved-activities="savedActivities"
    :completed-activities="completedActivitiesDisplay"
    :planned-activities="plannedActivities"
    :all-activities="allActivities"
    @go-home="goTo('home')"
    @logout="logout"
    @go-settings="goTo('settings')"
    @schedule="goTo('schedule-day')"
    @open-activity="openActivity"
  />

  <ScheduleDayView
    v-else-if="currentView === 'schedule-day'"
    :saved-activities="savedActivities"
    :recommended-activities="recommendedActivities"
    @open-activity="openActivity"
    @schedule-activity="createScheduleDraft"
  />

  <ScheduleConfirmView
    v-else-if="currentView === 'schedule-confirm'"
    :draft="scheduleDraft"
    :all-activities="allActivities"
    @confirm="confirmSchedule"
  />

  <ExitSurveyModal
    v-if="showExitSurvey"
    @confirm="handleExitConfirm"
    @cancel="showExitSurvey = false"
  />
  

</template>