<script setup>
import { CheckCircle2, ChevronLeft, Edit2, Plus } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

defineProps({
  isSchedulingMode: {
    type: Boolean,
    default: false,
  },
  savedActivities: {
    type: Array,
    default: () => [],
  },
  dayActivities: {
    type: Array,
    default: () => [],
  },
  selectedDayLabel: {
    type: String,
    default: '',
  },
  profileCopy: {
    type: Object,
    required: true,
  },
  homeCopy: {
    type: Object,
    required: true,
  },
  iconFor: {
    type: Function,
    required: true,
  },
  isStartedActivity: {
    type: Function,
    required: true,
  },
  isTriedActivity: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits([
  'add-schedule',
  'edit-schedule',
  'exit-scheduling',
  'finish-activity',
  'open-activity',
])
</script>

<template>
  <section class="glass-panel right-panel">
    <template v-if="!isSchedulingMode">
      <div class="panel-block saved-block">
        <SectionHeader :title="profileCopy.savedActivitiesTitle" size="section">
          <template #actions>
            <span class="section-counter">{{ savedActivities.length }} {{ profileCopy.counters.saved }}</span>
          </template>
        </SectionHeader>

        <div v-if="savedActivities.length > 0" class="scroll-area">
          <article
            v-for="activity in savedActivities"
            :key="activity.id"
            class="activity-row compact"
            :class="`tone-${activity.tone || 'violet'}`"
            @click="emit('open-activity', activity.id)"
          >
            <span v-if="!isTriedActivity(activity.id)" class="new-activity-badge">
              {{ homeCopy.newBadge }}
            </span>

            <div class="activity-icon">
              <img v-if="activity.image" :src="activity.image" alt="" class="activity-image" />
              <component v-else :is="iconFor(activity.icon)" :size="28" />
            </div>

            <div class="activity-copy">
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.shortDescription }}</p>
            </div>

            <button
              v-if="isStartedActivity(activity.id)"
              type="button"
              class="finish-activity-button btn"
              :aria-label="`Acabar actividad: ${activity.title}`"
              @click.stop="emit('finish-activity', activity)"
            >
              <CheckCircle2 :size="16" />
              <span>Acabar</span>
            </button>
          </article>
        </div>

        <EmptyState v-else>
          {{ profileCopy.empty.saved }}
        </EmptyState>
      </div>
    </template>

    <template v-else>
      <div class="scheduling-header">
        <button class="back-to-activities btn" type="button" @click="emit('exit-scheduling')">
          <ChevronLeft :size="18" />
          <span>{{ profileCopy.calendar.back }}</span>
        </button>
        <div class="scheduling-title">
          <p class="scheduling-date">{{ selectedDayLabel }}</p>
        </div>
      </div>

      <div class="day-activities-section">
        <h3>{{ profileCopy.plannedActivitiesTitle }}</h3>

        <div v-if="dayActivities.length > 0" class="activity-list">
          <article
            v-for="activity in dayActivities"
            :key="activity.id"
            class="activity-row scheduling"
            :class="`tone-${activity.tone || 'violet'}`"
          >
            <div class="activity-icon">
              <img v-if="activity.image" :src="activity.image" alt="" class="activity-image" />
              <component v-else :is="iconFor(activity.icon)" :size="24" />
            </div>

            <div class="activity-copy">
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.time }}</p>
            </div>

            <button
              class="edit-schedule-button btn"
              type="button"
              :aria-label="`${profileCopy.calendar.editActivityAria}: ${activity.title}`"
              @click="emit('edit-schedule', activity.id)"
            >
              <Edit2 :size="22" :stroke-width="2.5" />
            </button>
          </article>
        </div>

        <EmptyState v-else>
          {{ profileCopy.calendar.noActivitiesForDay }}
        </EmptyState>

        <BaseButton block class="add-schedule-button" @click="emit('add-schedule')">
          <Plus :size="18" />
          <span>{{ profileCopy.calendar.addActivityShort }}</span>
        </BaseButton>
      </div>
    </template>
  </section>
</template>
