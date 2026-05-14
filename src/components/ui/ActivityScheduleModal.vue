<script setup>
import { ref, computed } from 'vue'
import {
  Amphora,
  Bike,
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
  X,
  Search,
  Trash2,
  ChevronDown,
} from 'lucide-vue-next'
import { useAppSession } from '@/stores/appSession'
import { getProfileCopy } from '@/data/homeCopyI18n'
import { getActivityByIdWithTranslations } from '@/data/activitiesCopyI18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useI18n } from '@/stores/i18n'

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

const props = defineProps({
  date: {
    type: String,
    default: null,
  },
  mode: {
    type: String,
    enum: ['add', 'edit'],
    default: 'add',
  },
  plannedActivityId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['confirm', 'cancel', 'delete'])

const { allActivities, plannedActivities, savedActivities, recommendedActivities } = useAppSession()
const { currentLanguage } = useI18n()
const profileCopy = computed(() => getProfileCopy(currentLanguage.value))

function translatedActivity(activity) {
  return getActivityByIdWithTranslations(activity.id, currentLanguage.value) ?? activity
}

// State
const searchQuery = ref('')
const selectedActivityId = ref(null)
const selectedTime = ref('21:00')
const selectedReminder = ref('30-min')
const isReminderOpen = ref(false)
//AÑADIDO: pestañas para que la usuaria vea de forma explícita que puede alternar entre sus actividades, recomendadas y todas.
const activeActivitySection = ref('saved')
//FIN

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
    return '30-min'
  }

  if (['none', 'no rebre notificacio', 'no rebre notificació', 'no recibir notificacion', 'no recibir notificación', 'no notification'].includes(normalized)) {
    return 'none'
  }

  return reminder
}

// For edit mode, initialize with existing data
if (props.mode === 'edit' && props.plannedActivityId) {
  const existing = plannedActivities.value.find((p) => p.id === props.plannedActivityId)
  if (existing) {
    selectedActivityId.value = existing.activityId
    selectedTime.value = existing.time || '21:00'
    selectedReminder.value = normalizeReminder(existing.reminder)
  }
}

// Computed
const translatedActivities = computed(() => allActivities.map(translatedActivity))

const filteredActivities = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return translatedActivities.value.filter(
    (activity) =>
      activity.title.toLowerCase().includes(query) ||
      activity.shortDescription?.toLowerCase().includes(query),
  )
})

const activitySections = computed(() => {
  const savedIds = new Set(savedActivities.value.map((activity) => activity.id))
  const recommendedIds = new Set(recommendedActivities.value.map((activity) => activity.id))

  const saved = []
  const recommended = []
  const others = []

  for (const activity of filteredActivities.value) {
    if (savedIds.has(activity.id)) {
      saved.push(activity)
      continue
    }

    if (recommendedIds.has(activity.id)) {
      recommended.push(activity)
      continue
    }

    others.push(activity)
  }

  return [
    {
      key: 'saved',
      title: profileCopy.value.planned.filters?.saved ?? profileCopy.value.savedActivitiesTitle,
      emptyLabel: profileCopy.value.empty.saved,
      items: saved,
    },
    {
      key: 'recommended',
      title: profileCopy.value.planned.filters?.recommended ?? profileCopy.value.recommendedTitle,
      emptyLabel: profileCopy.value.planned.noActivities,
      items: recommended,
    },
    {
      key: 'other',
      title: profileCopy.value.planned.filters?.other ?? profileCopy.value.otherActivitiesTitle,
      emptyLabel: profileCopy.value.planned.noActivities,
      //AÑADIDO: en la pestaña "Todas" se muestran todas las actividades filtradas, no solo las que no son guardadas/recomendadas.
      items: filteredActivities.value,
      //FIN
    },
  ]
})

//AÑADIDO: mostramos solo la pestaña activa para reducir scroll y evitar que parezca que las listas están escondidas.
const visibleActivitySections = computed(() =>
  activitySections.value.filter((section) => section.key === activeActivitySection.value),
)
//FIN

const selectedActivity = computed(() =>
  filteredActivities.value.find((a) => a.id === selectedActivityId.value) ||
  allActivities.map(translatedActivity).find((a) => a.id === selectedActivityId.value),
)

const reminderOptions = computed(() => profileCopy.value.planned.notificationOptions ?? [])

const selectedReminderOption = computed(() =>
  reminderOptions.value.find((option) => option.id === selectedReminder.value) ?? reminderOptions.value[0],
)

const isValid = computed(() => selectedActivityId.value && selectedTime.value)

const modalTitle = computed(() =>
  props.mode === 'edit' ? profileCopy.value.planned.modalEditTitle : profileCopy.value.planned.modalTitle,
)

function handleConfirm() {
  if (!isValid.value) return
  emit('confirm', {
    activityId: selectedActivityId.value,
    time: selectedTime.value,
    reminder: selectedReminder.value,
  })
}

function selectReminder(reminderId) {
  selectedReminder.value = reminderId
  isReminderOpen.value = false
}

function handleDelete() {
  if (props.mode !== 'edit') return
  emit('delete', props.plannedActivityId)
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop modal d-block" tabindex="-1" @click.self="handleCancel">
      <div class="modal-card modal-dialog modal-dialog-centered">
        <button class="modal-close btn" type="button" :aria-label="profileCopy.planned.cancel" @click="handleCancel">
          <X :size="18" />
        </button>

        <h2>{{ modalTitle }}</h2>

        <div class="search-container">
          <Search :size="18" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input form-control"
            :placeholder="profileCopy.planned.search"
          />
        </div>

        <!-- //AÑADIDO: selector visible de categoría de actividad. -->
        <div class="activity-section-tabs" role="tablist" :aria-label="profileCopy.planned.search">
          <button
            v-for="section in activitySections"
            :key="section.key"
            type="button"
            class="activity-section-tab btn"
            :class="{ active: activeActivitySection === section.key }"
            role="tab"
            :aria-selected="activeActivitySection === section.key"
            @click="activeActivitySection = section.key"
          >
            <span>{{ section.title }}</span>
          </button>
        </div>
        <!-- //FIN -->

        <div class="activities-list">
          <div v-for="section in visibleActivitySections" :key="section.key" class="activity-section">
            <h3 class="activity-section-title">{{ section.title }}</h3>

            <button
              v-if="section.items.length === 0"
              disabled
              class="no-activities btn"
              type="button"
            >
              {{ section.emptyLabel }}
            </button>

            <button
              v-for="activity in section.items"
              :key="activity.id"
              type="button"
              class="activity-item btn"
              :class="{ selected: selectedActivityId === activity.id }"
              @click="selectedActivityId = activity.id"
            >
              <div class="activity-thumb-wrapper">
                <component
                  :is="iconFor(activity.icon)"
                  v-if="!activity.image"
                  :size="24"
                  class="activity-thumb-icon"
                />
                <img v-else :src="activity.image" class="activity-thumb" />
              </div>

              <div class="activity-info">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-duration">
                  {{ activity.duration }} {{ profileCopy.planned.minutes }}
                </div>
              </div>
            </button>
          </div>
        </div>


        <div v-if="selectedActivity" class="selected-activity">
          <div class="activity-header">
            <component
              :is="iconFor(selectedActivity.icon)"
              v-if="!selectedActivity.image"
              :size="34"
              class="activity-thumb-icon activity-thumb-large-icon"
            />
            <img v-else :src="selectedActivity.image" class="activity-thumb-large" />
            <div>
              <h3>{{ selectedActivity.title }}</h3>
              <p class="activity-description">{{ selectedActivity.shortDescription }}</p>
            </div>
          </div>
        </div>


        <div class="time-section">
          <div class="time-input-container">
            <label for="time-input">{{ profileCopy.planned.time }}</label>
            <input
              id="time-input"
              v-model="selectedTime"
              type="time"
              class="time-input form-control"
            />
          </div>

          <div class="notification-select-container">
            <label id="notification-select-label">{{ profileCopy.planned.notification }}</label>

            <div class="notification-select">
              <button
                type="button"
                class="notification-trigger btn form-control"
                aria-haspopup="listbox"
                :aria-expanded="isReminderOpen"
                aria-labelledby="notification-select-label"
                @click="isReminderOpen = !isReminderOpen"
              >
                <span>{{ selectedReminderOption?.label ?? profileCopy.planned.notificationPlaceholder }}</span>
                <ChevronDown :size="18" class="notification-chevron" :class="{ open: isReminderOpen }" />
              </button>

              <div
                v-if="isReminderOpen"
                class="notification-options"
                role="listbox"
                aria-labelledby="notification-select-label"
              >
                <button
                  v-for="option in reminderOptions"
                  :key="option.id"
                  type="button"
                  class="notification-option btn"
                  :class="{ selected: selectedReminder === option.id }"
                  role="option"
                  :aria-selected="selectedReminder === option.id"
                  @click="selectReminder(option.id)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="selectedActivity" class="duration-display">
            <span class="duration-label">{{ profileCopy.planned.duration }}</span>
            <span class="duration-value">
              {{ selectedActivity.duration }} {{ profileCopy.planned.minutes }}
            </span>
          </div>
        </div>


        <div class="modal-actions">
          <BaseButton variant="secondary" @click="handleCancel">
            {{ profileCopy.planned.cancel }}
          </BaseButton>

          <div class="spacer"></div>

          <BaseButton
            v-if="mode === 'edit'"
            variant="danger"
            @click="handleDelete"
          >
            <Trash2 :size="16" />
            {{ profileCopy.planned.delete }}
          </BaseButton>

          <BaseButton
            :disabled="!isValid"
            @click="handleConfirm"
          >
            {{ mode === 'edit' ? profileCopy.planned.save : profileCopy.planned.add }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-backdrop);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  position: relative;
  max-width: none;
  pointer-events: auto;
  background:
    radial-gradient(circle at 12% 10%, color-mix(in srgb, var(--violet-soft) 28%, transparent), transparent 34%),
    color-mix(in srgb, var(--surface-contrast) 96%, var(--background));
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 28px;
  padding: 36px;
  width: min(720px, calc(100vw - 40px));
  display: grid;
  gap: 10px;
  box-shadow: 0 28px 80px var(--shadow-panel);
  max-height: 86vh;
  overflow-y: auto;
  color: var(--foreground);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--color-text-primary);
}

h2 {
  color: var(--violet-strong);
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0;
}

/* //AÑADIDO: pestañas compactas para elegir entre actividades propias, recomendadas o todas. */
.activity-section-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  margin-top: -2px;
}

.activity-section-tab {
  display: grid;
  place-items: center;
  min-height: 38px;
  padding: 8px 10px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-contrast) 54%, transparent);
  color: var(--muted-foreground);
  font-size: 0.78rem;
  font-weight: 850;
  line-height: 1.15;
  text-align: center;
}

.activity-section-tab.active,
.activity-section-tab:hover {
  border-color: color-mix(in srgb, var(--violet) 52%, var(--surface-stroke-strong));
  background: color-mix(in srgb, var(--violet-soft) 36%, var(--surface-contrast));
  color: var(--foreground);
}
/* //FIN */

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.activities-list {
  display: grid;
  gap: 8px;
  max-height: 230px;
  overflow-y: auto;
  margin-top: 0;
}

.activity-section {
  display: grid;
  gap: 8px;
}

.activity-section-title {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.activity-thumb-wrapper {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
}

.activity-thumb-icon {
  color: var(--color-text-primary);
}

.activity-thumb-large-icon {
  width: 80px;
  height: 80px;
  padding: 12px;
  border-radius: 10px;
  background: var(--color-bg-primary);
  box-sizing: border-box;
  flex-shrink: 0;
}

.activity-thumb-large {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
}
.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.activity-item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg, var(--color-primary) 10%  );
}

.activity-item.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-bg, var(--color-primary) 10%  );
}

.activity-info {
  text-align: left;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.activity-duration {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: 4px;
}

.no-activities {
  padding: 20px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-secondary);
  color: var(--color-text-tertiary);
  font-size: 14px;
  cursor: not-allowed;
}

.selected-activity {
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  border-left: 3px solid var(--color-primary);
}

.activity-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.activity-header h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.activity-description {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.time-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-input-container label,
.notification-select-container label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.time-input {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.time-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.time-section {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-items: flex-end;
}

.notification-select-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.notification-select {
  position: relative;
}

.notification-trigger {
  width: 100%;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-strong) 76%, transparent);
  color: var(--foreground);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
  font-size: 14px;
}

.notification-trigger:hover,
.notification-trigger:focus {
  border-color: var(--violet);
  color: var(--foreground);
}

.notification-trigger span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-chevron {
  flex-shrink: 0;
  color: var(--muted-foreground);
  transition: transform 0.2s ease;
}

.notification-chevron.open {
  transform: rotate(180deg);
}

.notification-options {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  z-index: 3;
  max-height: 150px;
  overflow-y: auto;
  display: grid;
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-contrast) 98%, var(--background));
  box-shadow: 0 18px 42px var(--shadow-panel);
}

.notification-option {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 14px;
  background: transparent;
  color: var(--foreground);
  font-size: 13px;
  font-weight: 700;
  text-align: left;
}

.notification-option:hover,
.notification-option.selected {
  border-color: color-mix(in srgb, var(--violet) 45%, var(--surface-stroke-strong));
  background: color-mix(in srgb, var(--violet-soft) 34%, transparent);
  color: var(--foreground);
}

.duration-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.duration-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.duration-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.spacer {
  flex: 1;
}

.modal-close,
.search-icon,
.activity-thumb-icon,
.duration-label {
  color: var(--muted-foreground);
}

.modal-close:hover,
.activity-title,
.activity-header h3,
.time-input-container label,
.duration-value {
  color: var(--foreground);
}

.search-input,
.time-input {
  border-color: var(--surface-stroke-strong);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-strong) 76%, transparent);
  color: var(--foreground);
}

.search-input:focus,
.time-input:focus {
  border-color: var(--violet);
}

.activity-section-title,
.activity-duration,
.activity-description {
  color: var(--muted-foreground);
}

.activity-item,
.no-activities,
.duration-display {
  border-color: var(--surface-stroke-strong);
  border-radius: 20px;
  background: color-mix(in srgb, var(--surface-contrast) 58%, transparent);
}

.activity-item:hover,
.activity-item.selected {
  border-color: color-mix(in srgb, var(--violet) 48%, var(--surface-stroke-strong));
  background: color-mix(in srgb, var(--violet-soft) 36%, var(--surface-contrast));
}

.selected-activity {
  border: 1px solid var(--surface-stroke-strong);
  border-left: 0;
  border-radius: 22px;
  background: color-mix(in srgb, var(--surface-strong) 48%, transparent);
}

.activity-thumb-large-icon {
  border-radius: 20px;
  background: color-mix(in srgb, var(--violet-soft) 44%, var(--surface-contrast));
  color: var(--violet);
}

@media (max-width: 760px) {
  .activity-section-tabs {
    grid-template-columns: 1fr;
  }

  .time-section {
    grid-template-columns: 1fr;
  }
}

</style>
