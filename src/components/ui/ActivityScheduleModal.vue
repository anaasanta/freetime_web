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
} from 'lucide-vue-next'
import { useAppSession } from '@/stores/appSession'
import { getProfileCopy } from '@/data/homeCopyI18n'
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

const { allActivities, plannedActivities, savedActivities } = useAppSession()
const { currentLanguage } = useI18n()
const profileCopy = computed(() => getProfileCopy(currentLanguage.value))

// State
const searchQuery = ref('')
const selectedActivityId = ref(null)
const selectedTime = ref('21:00')

// For edit mode, initialize with existing data
if (props.mode === 'edit' && props.plannedActivityId) {
  const existing = plannedActivities.value.find((p) => p.id === props.plannedActivityId)
  if (existing) {
    selectedActivityId.value = existing.activityId
    selectedTime.value = existing.time || '21:00'
  }
}

// Computed
const filteredActivities = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return allActivities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(query) ||
      activity.shortDescription?.toLowerCase().includes(query),
  )
})

const myActivities = computed(() =>
  filteredActivities.value.filter((activity) =>
    savedActivities.value.some((savedActivity) => savedActivity.id === activity.id),
  ),
)

const selectedActivity = computed(() =>
  allActivities.find((a) => a.id === selectedActivityId.value),
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
  })
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
    <div class="modal-backdrop" @click.self="handleCancel">
      <div class="modal-card">
        <button class="modal-close" type="button" @click="handleCancel">
          <X :size="18" />
        </button>

        <h2>{{ modalTitle }}</h2>

        <!-- Search -->
        <div class="search-container">
          <Search :size="18" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="profileCopy.planned.search"
          />
        </div>

        <!-- Activities List -->
        <div class="activities-list">
          <div class="activity-section">
            <h3 class="activity-section-title">{{ profileCopy.savedActivitiesTitle }}</h3>

            <button
              v-if="myActivities.length === 0"
              disabled
              class="no-activities"
              type="button"
            >
              {{ profileCopy.empty.saved }}
            </button>

            <button
              v-for="activity in myActivities"
              :key="activity.id"
              type="button"
              class="activity-item"
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

        <!-- Selected Activity Details -->
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

        <!-- Time Input -->
        <div class="time-section">
          <div class="time-input-container">
            <label for="time-input">{{ profileCopy.planned.time }}</label>
            <input
              id="time-input"
              v-model="selectedTime"
              type="time"
              class="time-input"
            />
          </div>

          <div v-if="selectedActivity" class="duration-display">
            <span class="duration-label">{{ profileCopy.planned.duration }}</span>
            <span class="duration-value">
              {{ selectedActivity.duration }} {{ profileCopy.planned.minutes }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button class="btn-secondary" type="button" @click="handleCancel">
            {{ profileCopy.planned.cancel }}
          </button>

          <div class="spacer"></div>

          <button
            v-if="mode === 'edit'"
            type="button"
            class="btn-delete"
            @click="handleDelete"
          >
            <Trash2 :size="16" />
            {{ profileCopy.planned.delete }}
          </button>

          <button
            type="button"
            class="btn-primary"
            :disabled="!isValid"
            @click="handleConfirm"
          >
            {{ mode === 'edit' ? profileCopy.planned.save : profileCopy.planned.add }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  position: relative;
  background: white;
  border-radius: 28px;
  padding: 36px;
  width: min(520px, calc(100vw - 40px));
  display: grid;
  gap: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-height: 80vh;
  overflow-y: auto;
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
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
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
  max-height: 300px;
  overflow-y: auto;
}

.activity-section {
  display: grid;
  gap: 8px;
}

.activity-section-title {
  margin: 8px 0 0;
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
  background: var(--color-primary-bg, rgba(255, 184, 0, 0.05));
}

.activity-item.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-bg, rgba(255, 184, 0, 0.1));
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

.time-input-container label {
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
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: flex-end;
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

.btn-primary,
.btn-secondary,
.btn-delete {
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.btn-primary {
  background: #000000;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #333333;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-border);
}

.btn-delete {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.btn-delete:hover {
  background: rgba(220, 38, 38, 0.2);
}
</style>
