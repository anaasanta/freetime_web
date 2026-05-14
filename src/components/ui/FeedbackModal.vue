<script setup>
import { computed, ref } from 'vue'
import { Heart, Star, X } from 'lucide-vue-next'

const props = defineProps({
  copy: {
    type: Object,
    required: true,
  },
  titleId: {
    type: String,
    default: 'feedback-modal-title',
  },
})

const emit = defineEmits(['cancel', 'confirm'])

const ratingStars = ref(0)
const moodStars = ref(0)
const hoveredRating = ref(0)
const hoveredMood = ref(0)
const note = ref('')

const canConfirm = computed(() => ratingStars.value > 0 && moodStars.value > 0)

function scaleLabel(value) {
  const unit = value === 1 ? props.copy.starSingular : props.copy.starPlural
  return `${value} ${unit}`
}

function handleConfirm() {
  if (!canConfirm.value) return

  emit('confirm', {
    rating: ratingStars.value,
    moodImprovement: moodStars.value,
    note: note.value.trim(),
  })
}
</script>

<template>
  <div class="feedback-modal" role="presentation">
    <div class="feedback-dialog" role="dialog" :aria-labelledby="titleId">
      <button
        class="feedback-close btn"
        type="button"
        :aria-label="copy.closeLabel"
        :title="copy.closeLabel"
        @click="emit('cancel')"
      >
        <X :size="18" />
      </button>

      <h3 :id="titleId">
        {{ copy.title }}
      </h3>
      <p>
        {{ copy.subtitle }}
      </p>

      <div class="feedback-question">
        <label class="feedback-label">
          {{ copy.ratingLabel }}
        </label>

        <div class="feedback-star-row" role="radiogroup" :aria-label="copy.ratingAria">
          <button
            v-for="n in 5"
            :key="`rating-${n}`"
            type="button"
            class="feedback-star-button btn"
            :class="{ active: (hoveredRating || ratingStars) >= n }"
            :aria-label="scaleLabel(n)"
            role="radio"
            :aria-checked="ratingStars === n"
            @click="ratingStars = n"
            @mouseenter="hoveredRating = n"
            @mouseleave="hoveredRating = 0"
            @focus="hoveredRating = n"
            @blur="hoveredRating = 0"
          >
            <Star
              :size="30"
              :fill="(hoveredRating || ratingStars) >= n ? 'currentColor' : 'none'"
            />
          </button>
        </div>
      </div>

      <div class="feedback-question">
        <label class="feedback-label">
          {{ copy.moodLabel }}
        </label>

        <div class="feedback-star-row" role="radiogroup" :aria-label="copy.moodAria">
          <button
            v-for="n in 5"
            :key="`mood-${n}`"
            type="button"
            class="feedback-star-button btn mood"
            :class="{ active: (hoveredMood || moodStars) >= n }"
            :aria-label="scaleLabel(n)"
            role="radio"
            :aria-checked="moodStars === n"
            @click="moodStars = n"
            @mouseenter="hoveredMood = n"
            @mouseleave="hoveredMood = 0"
            @focus="hoveredMood = n"
            @blur="hoveredMood = 0"
          >
            <Heart
              :size="30"
              :fill="(hoveredMood || moodStars) >= n ? 'currentColor' : 'none'"
            />
          </button>
        </div>
      </div>

      <div class="feedback-question">
        <label class="feedback-label" for="feedback-note">
          {{ copy.noteLabel }}
        </label>
        <textarea
          id="feedback-note"
          v-model="note"
          class="feedback-textarea form-control"
          rows="3"
          :placeholder="copy.notePlaceholder"
        ></textarea>
      </div>

      <div class="feedback-actions">
        <button class="secondary-button btn btn-outline-secondary" type="button" @click="emit('cancel')">
          {{ copy.cancel }}
        </button>
        <button
          class="primary-button btn btn-primary"
          type="button"
          :disabled="!canConfirm"
          @click="handleConfirm"
        >
          {{ copy.confirm }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feedback-modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--background);
  z-index: 1200;
}

.feedback-dialog {
  position: relative;
  width: min(100%, 520px);
  padding: 22px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 28px;
  background: var(--surface-contrast);
  color: var(--foreground);
  box-shadow: 0 30px 80px color-mix(in srgb, var(--violet) 24%, transparent);
}

.feedback-dialog h3 {
  margin: 0 0 8px;
  font-size: 1.4rem;
  font-weight: 900;
}

.feedback-dialog p {
  margin: 0 0 18px;
  color: var(--muted-foreground);
}

.feedback-close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  font-size: 1.5rem;
}

.feedback-question {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}

.feedback-label {
  display: block;
  color: var(--foreground);
  font-weight: 800;
  font-size: 0.98rem;
}

.feedback-star-row {
  display: inline-flex;
  gap: 8px;
}

.feedback-star-button {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--card);
  color: var(--muted-foreground);
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.feedback-star-button:hover,
.feedback-star-button:focus-visible {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--violet) 42%, var(--border));
  outline: none;
}

.feedback-star-button.active {
  background: color-mix(in srgb, var(--violet-soft) 70%, var(--card) 30%);
  border-color: var(--violet-strong);
  color: var(--violet-strong);
}

.feedback-star-button.mood.active {
  background: color-mix(in srgb, var(--rose-soft) 70%, var(--card) 30%);
  border-color: var(--rose);
  color: var(--rose);
}

.feedback-textarea {
  width: 100%;
  resize: vertical;
  min-height: 80px;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 12px 14px;
  background: var(--card);
  color: var(--foreground);
  font-family: inherit;
  font-size: 0.98rem;
  line-height: 1.5;
}

.feedback-textarea:focus-visible {
  outline: none;
  border-color: var(--violet-strong);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--violet) 22%, transparent);
}

.feedback-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.feedback-actions .primary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 760px) {
  .feedback-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .feedback-actions > * {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feedback-star-button {
    transition: none;
  }

  .feedback-star-button:hover,
  .feedback-star-button:focus-visible {
    transform: none;
  }
}
</style>
