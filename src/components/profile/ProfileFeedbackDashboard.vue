<script setup>
import EmptyState from '@/components/ui/EmptyState.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

defineProps({
  profileCopy: {
    type: Object,
    required: true,
  },
  activityOptions: {
    type: Array,
    default: () => [],
  },
  selectedActivityId: {
    type: String,
    default: '',
  },
  selectedActivity: {
    type: Object,
    default: null,
  },
  lineSeries: {
    type: Array,
    default: () => [],
  },
  iconFor: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update:selectedActivityId'])
</script>

<template>
  <section class="glass-panel stats-panel feedback-panel">
    <SectionHeader
      :title="profileCopy.stats.dashboardTitle"
      class="feedback-panel-header"
      size="section"
    />

    <div v-if="activityOptions.length > 0" class="feedback-shell">
      <aside class="feedback-side">
        <div class="feedback-selector-column" :aria-label="profileCopy.stats.selectorLabel">
          <button
            v-for="activity in activityOptions"
            :key="activity.activityId"
            class="feedback-tab btn"
            :class="{ active: activity.activityId === selectedActivityId }"
            type="button"
            @click="emit('update:selectedActivityId', activity.activityId)"
          >
            <span class="feedback-tab-icon" :class="`tone-${activity.tone || 'violet'}`">
              <component :is="iconFor(activity.icon)" :size="18" />
            </span>
            <span>{{ activity.title }}</span>
            <small>{{ activity.sessions }} {{ profileCopy.stats.metrics.sessions }}</small>
          </button>
        </div>
      </aside>

      <article class="feedback-main-chart">
        <div class="feedback-chart-head">
          <div>
            <h3>{{ selectedActivity?.title }}</h3>
          </div>

          <div class="feedback-line-legend" aria-hidden="true">
            <span v-for="series in lineSeries" :key="series.key" :class="`line-${series.key}`">
              {{ series.label }}
            </span>
          </div>
        </div>

        <div class="feedback-line-chart">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Feedback chart">
            <line x1="0" y1="25" x2="100" y2="25" class="chart-grid-line" />
            <line x1="0" y1="50" x2="100" y2="50" class="chart-grid-line" />
            <line x1="0" y1="75" x2="100" y2="75" class="chart-grid-line" />

            <g v-for="series in lineSeries" :key="series.key" :class="`feedback-series line-${series.key}`">
              <path :d="series.path" class="feedback-line-path" />
              <circle
                v-for="point in series.points"
                :key="point.id"
                :cx="point.x"
                :cy="point.y"
                r="2.7"
                class="feedback-line-dot"
              />
            </g>
          </svg>

          <template v-for="series in lineSeries" :key="`${series.key}-tooltips`">
            <button
              v-for="point in series.points"
              :key="`${point.id}-tooltip`"
              class="feedback-line-hotspot btn"
              :class="`line-${series.key}`"
              type="button"
              :style="{ left: `${point.x}%`, top: `${point.y}%` }"
              :aria-label="`${series.label}: ${point.value}`"
            >
              <span class="feedback-line-tooltip">
                <strong>{{ series.label }} · {{ point.value }}</strong>
                <small>{{ point.dateLabel }}</small>
                <small v-if="point.moodBefore">{{ point.moodBefore }} -> {{ point.moodAfter }}</small>
              </span>
            </button>
          </template>
        </div>
      </article>
    </div>

    <EmptyState v-else :title="profileCopy.stats.emptyTitle" :text="profileCopy.stats.emptyText" />
  </section>
</template>
