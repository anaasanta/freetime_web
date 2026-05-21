<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Amphora,
  Bike,
  Settings,
  LogOut,
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
  Volleyball,
  Waves,
} from 'lucide-vue-next'
import AppBrand from '@/components/layout/AppBrand.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
import ProfileActivitiesPanel from '@/components/profile/ProfileActivitiesPanel.vue'
import ProfileCalendarPanel from '@/components/profile/ProfileCalendarPanel.vue'
import ProfileFeedbackDashboard from '@/components/profile/ProfileFeedbackDashboard.vue'
import ProfileSummaryCard from '@/components/profile/ProfileSummaryCard.vue'
import ActivityScheduleModal from '@/components/ui/ActivityScheduleModal.vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import AppTooltip from '@/components/ui/AppTooltip.vue'
import FeedbackModal from '@/components/ui/FeedbackModal.vue'
import { landingCopy } from '@/data/uiText'
import { getHomeCopy, getProfileCopy } from '@/data/homeCopyI18n'
import { getActivityResultCopy } from '@/data/testCopyI18n'
import { logout, syncSelectedActivity, useAppSession, completeActivity } from '@/stores/appSession'
import { useI18n } from '@/stores/i18n'
import { useProfileActivities } from '@/composables/profile/useProfileActivities'
import { useProfileCalendar } from '@/composables/profile/useProfileCalendar'
import { useProfileFeedback } from '@/composables/profile/useProfileFeedback'

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

const showFinishModal = ref(false)
const finishingActivity = ref(null)

const avatarSrc = computed(() => {
  const avatarFile = currentUser.value?.avatar

  if (!avatarFile) return null

  return avatarModules[`../assets/avatars/${avatarFile}`] || null
})

const profileTags = computed(() => {
  return currentUser.value?.tags?.length ? currentUser.value.tags : [profileCopy.value.fallbackTag]
})

const {
  savedDisplay,
  plannedDisplay,
  completedDisplay,
  isStartedActivity,
  isTriedActivity,
  parseDate,
} = useProfileActivities({
  currentLanguage,
  profileCopy,
  savedActivities,
  startedActivities,
  completedActivityIds,
  completedActivitiesDisplay,
  plannedActivities,
  allActivities,
  activityImages,
})

const {
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
} = useProfileCalendar({
  profileCopy,
  plannedActivities,
  plannedDisplay,
  completedDisplay,
  parseDate,
})

const {
  selectedFeedbackActivityId,
  feedbackActivityOptions,
  selectedFeedbackActivity,
  feedbackLineSeries,
} = useProfileFeedback({
  currentLanguage,
  profileCopy,
  completedDisplay,
  parseDate,
})

function openActivity(activityId, source = 'normal') {
  syncSelectedActivity(activityId, source)
  router.push({
    name: 'activity',
    params: { id: activityId },
    query: source === 'normal' ? { from: 'profile' } : { source, from: 'profile' },
  })
}

function handleLogout() {
  logout()
  router.replace({ name: 'landing' })
}

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

  closeFinishModal()
}

function iconFor(iconName) {
  // Relacionamos el nombre de icono guardado en datos con el componente real.
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
        <ProfileSummaryCard
          :user="currentUser"
          :avatar-src="avatarSrc"
          :copy="profileCopy"
          :tags="profileTags"
        />

        <ProfileCalendarPanel
          :copy="profileCopy.calendar"
          :month-label="visibleMonthLabel"
          :calendar-cells="calendarCells"
          :selected-day="selectedScheduleDay"
          :tooltip-for-day="tooltipForDay"
          @previous-month="previousMonth"
          @next-month="nextMonth"
          @current-month="goToCurrentMonth"
          @select-day="selectDayForScheduling"
        />
      </div>

      <div class="right-column">
        <ProfileActivitiesPanel
          :is-scheduling-mode="isSchedulingMode"
          :saved-activities="savedDisplay"
          :day-activities="activitiesForSchedulingDay"
          :selected-day-label="selectedSchedulingDayLabel"
          :profile-copy="profileCopy"
          :home-copy="homeCopy"
          :icon-for="iconFor"
          :is-started-activity="isStartedActivity"
          :is-tried-activity="isTriedActivity"
          @open-activity="openActivity"
          @finish-activity="openFinishModal"
          @exit-scheduling="exitSchedulingMode"
          @edit-schedule="openEditActivityModal"
          @add-schedule="openAddActivityModal"
        />
      </div>

      <!-- Capa para cerrar el modo calendario al hacer clic fuera. -->

    </section>

    <ProfileFeedbackDashboard
      v-model:selected-activity-id="selectedFeedbackActivityId"
      :profile-copy="profileCopy"
      :activity-options="feedbackActivityOptions"
      :selected-activity="selectedFeedbackActivity"
      :line-series="feedbackLineSeries"
      :icon-for="iconFor"
    />
    </AppContainer>

    <!-- Modal para anadir o editar una actividad programada. -->
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

<style scoped src="../styles/profile.css"></style>

