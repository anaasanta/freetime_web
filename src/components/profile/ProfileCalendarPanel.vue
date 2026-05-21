<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import SectionHeader from '@/components/ui/SectionHeader.vue'

defineProps({
  copy: {
    type: Object,
    required: true,
  },
  monthLabel: {
    type: String,
    required: true,
  },
  calendarCells: {
    type: Array,
    default: () => [],
  },
  selectedDay: {
    type: Object,
    default: null,
  },
  tooltipForDay: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['previous-month', 'next-month', 'current-month', 'select-day'])
</script>

<template>
  <section class="glass-panel calendar-panel">
    <SectionHeader :title="copy.title" size="section" />

    <div class="calendar-controls">
      <button class="calendar-nav-button btn" type="button" @click="emit('previous-month')">
        <ChevronLeft :size="18" />
      </button>

      <button class="calendar-month-button btn" type="button" @click="emit('current-month')">
        {{ monthLabel }}
      </button>

      <button class="calendar-nav-button btn" type="button" @click="emit('next-month')">
        <ChevronRight :size="18" />
      </button>
    </div>

    <div class="calendar-weekdays">
      <span v-for="weekday in copy.weekdays" :key="weekday">
        {{ weekday }}
      </span>
    </div>

    <div class="calendar-grid">
      <div
        v-for="day in calendarCells"
        :key="day.id"
        class="day-wrapper"
        :class="{ empty: day.empty }"
      >
        <button
          v-if="!day.empty"
          class="day-cell btn"
          :class="{
            today: day.isToday,
            planned: day.planned.length > 0,
            completed: day.completed.length > 0,
            mixed: day.planned.length > 0 && day.completed.length > 0,
            selected: selectedDay && day.number === selectedDay.number,
          }"
          type="button"
          :aria-label="tooltipForDay(day) || `${copy.dayAria} ${day.number}`"
          @click.stop="emit('select-day', day)"
        >
          {{ day.number }}
        </button>

        <div v-if="!day.empty && tooltipForDay(day)" class="day-tooltip">
          <span class="day-tooltip-text">
            {{ tooltipForDay(day) }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
