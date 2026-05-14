<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Dumbbell, Moon, Palette, X, Frown, Annoyed, Laugh, Meh, Smile, TimerReset, BadgeDollarSign } from 'lucide-vue-next'
import { testConfig } from '@/data/testConfig'
import { getTestCopy } from '@/data/testCopyI18n'
import AppContainer from '@/components/ui/AppContainer.vue'
import AppTooltip from '@/components/ui/AppTooltip.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { finishTest } from '@/stores/appSession'
import { useI18n } from '@/stores/i18n'

const router = useRouter()
const { currentLanguage } = useI18n()

const iconMap = { Moon, Palette, Dumbbell, X, Frown, Annoyed, Laugh, Meh, Smile, TimerReset }

const copy = computed(() => getTestCopy(currentLanguage.value))

// Estado inicial
const energyValue = ref(testConfig.energy.defaultValue)
const selectedNeed = ref(null)
const timeValue = ref(testConfig.time.defaultValue)
const budgetValue = ref(testConfig.budget.defaultValue)

// Posición barra energía (0–100%)
const energyPercent = computed(() => {
  const { min, max } = testConfig.energy
  return ((energyValue.value - min) / (max - min)) * 100
})

// Posición barra tiempo (0–100%)
const timePercent = computed(() => {
  const { min, max } = testConfig.time
  return ((timeValue.value - min) / (max - min)) * 100
})

function formatTimeLabel(minutes) {
  const { minute, hour } = copy.value.time.units
  const { min, hourMinutes } = testConfig.time
  if (minutes === min) return `${min} ${minute}`
  if (minutes < hourMinutes) return `${minutes} ${minute}`

  const hours = Math.floor(minutes / hourMinutes)
  const remainingMinutes = minutes % hourMinutes
  if (remainingMinutes === 0) return `${hours} ${hour}`
  return `${hours} ${hour} ${remainingMinutes} ${minute}`
}

const timeLabel = computed(() => formatTimeLabel(timeValue.value))

const energyFace = computed(() => {
  const value = energyMood.value?.value
  if (value === 'angry') return Frown
  if (value === 'sad') return Annoyed
  if (value === 'flat') return Meh
  if (value === 'smile') return Smile
  return Laugh
})

const energyMood = computed(() => {
  const moods = copy.value.energy.moods
  const thresholds = testConfig.energy.moodThresholds
  const index = thresholds.findIndex((limit) => energyValue.value < limit)
  return moods[index === -1 ? moods.length - 1 : index]
})

const budgetPercent = computed(() => {
  const { min, max } = testConfig.budget
  return ((budgetValue.value - min) / (max - min)) * 100
})

const budgetLabel = computed(() => {
  const index = testConfig.budget.labelMaxValues.findIndex((maxValue) => budgetValue.value <= maxValue)
  return copy.value.budget.levels[index === -1 ? copy.value.budget.levels.length - 1 : index]
})

function selectNeed(id) {
  selectedNeed.value = selectedNeed.value === id ? null : id
}

function handleFinish() {
  const selectedId = finishTest({
    energy: energyValue.value,
    need: selectedNeed.value,
    time: timeValue.value,
    budget: budgetValue.value,
  })

  if (!selectedId) {
    router.replace({ name: 'home' })
    return
  }

  router.push({
    name: 'activity',
    params: { id: selectedId },
    query: { source: 'test', from: 'test' },
  })
}
</script>

<template>
  <main class="app-page test-page">
    <AppContainer as="section">
      <!-- Botón cerrar fijo arriba a la derecha -->
      <div class="test-top">
        <AppTooltip :label="copy.tooltips.close" position="bottom" class="close-tooltip-wrapper">
          <button class="close-button btn" type="button" :aria-label="copy.closeLabel" @click="router.push({ name: 'home' })">
            <X :size="20" />
          </button>
        </AppTooltip>
      </div>

      <div class="test-card">
        <!-- Intro -->
        <div class="intro">
          <h1>{{ copy.intro.title }}</h1>
          <p>{{ copy.intro.description }}</p>
        </div>

        <!-- Pregunta 1: Nivel de energía -->
        <section class="question">
          <div class="question-heading">
            <h2>{{ copy.energy.title }}</h2>
          </div>

          <div class="slider-card energy-card">
            <!-- Stage con caritas de fondo y carita animada -->
            <div class="energy-mood-stage" :style="{ '--energy-percent': energyPercent + '%' }">
              <div class="energy-mood-track">
                <Frown class="mood-icon mood-icon-start" :size="28" />
                <Laugh class="mood-icon mood-icon-end" :size="28" />
              </div>
              <div class="energy-mood-current">
                <component :is="energyFace" :size="38" />
              </div>
            </div>

            <div class="slider-wrapper">
              <input
                v-model.number="energyValue"
                type="range"
                :min="testConfig.energy.min"
                :max="testConfig.energy.max"
                :step="testConfig.energy.step"
                class="range-input form-range"
              />
              <div class="range-track energy-track" :style="{ '--percent': energyPercent + '%' }"></div>
            </div>

            <div class="slider-label-center">
              <span class="mood-label">{{ energyMood.label }}</span>
            </div>
          </div>
        </section>

        <!-- Pregunta 2: ¿Qué necesitas hoy? (2x2 grid) -->
        <section class="question">
          <h2>{{ copy.needs.title }}</h2>

          <div class="needs-grid">
            <button
              v-for="option in copy.needs.options"
              :key="option.id"
              class="need-option btn"
              :class="{ selected: selectedNeed === option.id }"
              type="button"
              @click="selectNeed(option.id)"
            >
              <component :is="iconMap[option.icon]" :size="32" />
              <strong>{{ option.label }}</strong>
              <span>{{ option.description }}</span>
            </button>
          </div>
        </section>

        <!-- Pregunta 3: Presupuesto -->
        <section class="question">
          <div class="question-heading">
            <h2>{{ copy.budget.title }}</h2>
          </div>

          <div class="slider-card budget-card">
            <div class="slider-mood-stage" :style="{ '--slider-percent': budgetPercent + '%' }">
              <div class="slider-mood-track money-scale" aria-hidden="true">
                <span class="money-mark money-mark-start">{{ copy.budget.scale.low }}</span>
                <span class="money-mark money-mark-end">{{ copy.budget.scale.high }}</span>
              </div>
              <div
                class="slider-mood-current budget-current"
                :style="{ '--budget-percent': budgetPercent + '%' }"
                :aria-label="budgetLabel"
              >
                <BadgeDollarSign class="budget-icon-base" :size="38" />
                <span class="budget-icon-fill" aria-hidden="true">
                  <BadgeDollarSign :size="38" />
                </span>
              </div>
            </div>

            <div class="slider-wrapper">
              <input
                v-model.number="budgetValue"
                type="range"
                :min="testConfig.budget.min"
                :max="testConfig.budget.max"
                :step="testConfig.budget.step"
                class="range-input form-range"
              />
              <div class="range-track" :style="{ '--percent': budgetPercent + '%' }"></div>
            </div>

            <div class="slider-label-center">
              <span class="mood-label budget-label">{{ budgetLabel }}</span>
            </div>
          </div>
        </section>

        <!-- Pregunta 4: Tiempo disponible -->
        <section class="question">
          <div class="question-heading">
            <h2>{{ copy.time.title }}</h2>
            <span class="time-chip">{{ timeLabel }}</span>
          </div>

          <div class="slider-card time-card">
            <div class="time-visual" :style="{ '--time-percent': timePercent + '%' }">
              <span class="time-ring" aria-hidden="true">
                <TimerReset :size="30" />
              </span>
              <div class="time-summary">
                <strong>{{ timeLabel }}</strong>
                <span>{{ copy.time.hint }}</span>
              </div>
            </div>

            <div class="slider-wrapper">
              <input
                v-model.number="timeValue"
                type="range"
                :min="testConfig.time.min"
                :max="testConfig.time.max"
                :step="testConfig.time.step"
                class="range-input form-range"
              />
              <div class="range-track" :style="{ '--percent': timePercent + '%' }"></div>
            </div>

            <div class="slider-label-center">
              <span class="mood-label time-label">{{ timeLabel }}</span>
            </div>
          </div>
        </section>

        <!-- Botón finalizar -->
        <AppTooltip :label="copy.tooltips.finish" position="top" align="end" class="finish-tooltip-wrapper">
          <BaseButton
            class="finish-button"
            :aria-label="copy.tooltips.finish"
            @click="handleFinish"
          >
            {{ copy.finishButton }}
          </BaseButton>
        </AppTooltip>
      </div>
    </AppContainer>
  </main>
</template>

<style scoped>
.test-page {
  min-height: 100dvh;
  padding: clamp(16px, 4vw, 40px);
  background:
    radial-gradient(circle at 12% 14%, color-mix(in srgb, var(--sky-soft) 52%, transparent), transparent 32%),
    radial-gradient(circle at 88% 12%, color-mix(in srgb, var(--emerald-soft) 48%, transparent), transparent 30%),
    radial-gradient(circle at 72% 78%, color-mix(in srgb, var(--pink-soft) 44%, transparent), transparent 30%),
    radial-gradient(circle at 18% 86%, color-mix(in srgb, var(--violet-soft) 42%, transparent), transparent 28%),
    linear-gradient(180deg, var(--background), color-mix(in srgb, var(--background) 84%, var(--sky-soft)));
}

.page-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* ── Top bar con X a la derecha ── */
.test-top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.close-tooltip-wrapper {
  position: relative;
}

.close-button {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 999px;
  background: var(--card);
  color: var(--foreground);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(14px);
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}

.close-button:hover {
  transform: translateY(-2px);
  background: var(--surface-strong);
  box-shadow: var(--shadow-panel-strong);
}

/* ── Tooltips ── */
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip-bubble {
  position: absolute;
  left: 50%;
  top: calc(100% + 12px);
  transform: translateX(-50%) translateY(-8px);
  min-width: 160px;
  max-width: 260px;
  padding: 10px 14px;
  border: 1px solid color-mix(in srgb, var(--border) 82%, var(--surface-stroke-strong));
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
  backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--violet) 14%, transparent);
  color: var(--foreground);
  font-size: 0.82rem;
  line-height: 1.4;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.22s ease, transform 0.22s ease;
  z-index: 30;
}

.tooltip-bubble::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 100%;
  width: 12px;
  height: 12px;
  transform: translateX(-50%) translateY(50%) rotate(45deg);
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--border) 82%, var(--surface-stroke-strong));
  border-left: 1px solid color-mix(in srgb, var(--border) 82%, var(--surface-stroke-strong));
  border-radius: 2px;
}

.tooltip-bubble-up {
  top: auto;
  bottom: calc(100% + 12px);
  transform: translateX(-50%) translateY(8px);
}

.tooltip-bubble-up::before {
  top: 100%;
  bottom: auto;
  transform: translate(-50%, -50%) rotate(45deg);
  border-top: none;
  border-left: none;
  border-right: 1px solid color-mix(in srgb, var(--border) 82%, var(--surface-stroke-strong));
  border-bottom: 1px solid color-mix(in srgb, var(--border) 82%, var(--surface-stroke-strong));
}

.tooltip-wrapper:hover .tooltip-bubble,
.tooltip-wrapper:focus-within .tooltip-bubble {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* ── Card principal ── */
.test-card {
  display: grid;
  gap: clamp(32px, 5vw, 56px);
  padding: clamp(8px, 2vw, 24px) 0 clamp(24px, 4vw, 48px);
}

.intro h1 {
  margin: 0 0 12px;
  color: var(--violet-strong);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  letter-spacing: 0;
}

.intro p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.6;
}

/* ── Preguntas ── */
.question {
  display: grid;
  gap: 20px;
}

.question h2 {
  margin: 0;
  color: var(--violet-strong);
  font-size: clamp(1.3rem, 2.5vw, 1.7rem);
  font-weight: 900;
  letter-spacing: 0;
}

.question-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* ── Slider cards (homogéneos) ── */
.slider-card {
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 24px;
  background: color-mix(in srgb, var(--surface-contrast) 90%, transparent);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--primary) 8%, transparent);
}

.energy-card {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--violet-soft) 62%, transparent), transparent 42%),
    color-mix(in srgb, var(--surface-contrast) 88%, transparent);
}

.budget-card {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--emerald-soft) 72%, transparent), transparent 44%),
    color-mix(in srgb, var(--surface-contrast) 88%, transparent);
}

.time-card {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--sky-soft) 74%, transparent), transparent 44%),
    color-mix(in srgb, var(--surface-contrast) 88%, transparent);
}

/* ── Stage de carita animada (energía) ── */
.energy-mood-stage,
.slider-mood-stage {
  position: relative;
  height: 58px;
  margin-bottom: 6px;
}

.energy-mood-track,
.slider-mood-track {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 12px 0;
}

.mood-icon {
  color: var(--muted-foreground);
  opacity: 0.35;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.mood-icon-start { opacity: 0.5; }
.mood-icon-mid { opacity: 0.3; }
.mood-icon-end { opacity: 0.5; }

.energy-mood-track .mood-icon {
  transform: translateY(4px);
}

.energy-mood-current,
.slider-mood-current {
  position: absolute;
  left: calc(clamp(28px, var(--energy-percent, var(--slider-percent)), calc(100% - 28px)));
  top: 50%;
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border: 2px solid color-mix(in srgb, var(--violet) 50%, var(--border));
  border-radius: 999px;
  background: var(--card);
  color: var(--violet);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--violet) 24%, transparent);
  transform: translate(-50%, -50%);
  transition: box-shadow 0.2s ease;
  animation: mood-pulse 2s ease-in-out infinite;
}

.slider-mood-current {
  left: calc(clamp(28px, var(--slider-percent), calc(100% - 28px)));
}

.energy-mood-current {
  left: clamp(28px, calc(var(--energy-percent) + 6px), calc(100% - 28px));
}

.money-scale {
  color: color-mix(in srgb, var(--emerald) 78%, var(--muted-foreground));
  font-weight: 800;
  line-height: 1;
}

.money-mark-start {
  font-size: 1.15rem;
}

.money-mark-end {
  font-size: 1rem;
  letter-spacing: 0.08em;
}

.budget-current {
  overflow: hidden;
  color: var(--emerald);
  border-color: color-mix(in srgb, var(--emerald) 50%, var(--border));
  box-shadow: 0 8px 24px color-mix(in srgb, var(--emerald) 24%, transparent);
}

.budget-icon-base {
  color: var(--muted-foreground);
  opacity: 0.42;
}

.budget-icon-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--budget-percent);
  overflow: hidden;
  color: var(--emerald);
  transition: none;
}

.budget-icon-fill svg {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translate(-50%, -50%);
}

.time-visual {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 72px;
  margin-bottom: 12px;
}

.time-ring {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 999px;
  color: var(--sky);
  background:
    radial-gradient(circle, var(--surface-contrast) 58%, transparent 60%),
    conic-gradient(var(--sky) var(--time-percent), color-mix(in srgb, var(--sky-soft) 52%, var(--surface-strong)) 0);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--sky) 20%, transparent);
}

.time-summary {
  display: grid;
  gap: 2px;
}

.time-summary strong {
  color: var(--foreground);
  font-size: 1.2rem;
}

.time-summary span {
  color: var(--muted-foreground);
  font-size: 0.9rem;
}

@keyframes mood-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.06); }
}

/* ── Sliders ── */
.slider-wrapper {
  position: relative;
  height: 48px;
  display: flex;
  align-items: center;
}

.range-track {
  position: absolute;
  left: 0;
  right: 0;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--violet) 30%, var(--surface-strong)) 0%,
    var(--violet) var(--percent, 50%),
    var(--surface-strong) var(--percent, 50%),
    var(--surface-strong) 100%
  );
  pointer-events: none;
}

.budget-card .range-track {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--emerald) 24%, var(--surface-strong)) 0%,
    var(--emerald) var(--percent, 50%),
    var(--surface-strong) var(--percent, 50%),
    var(--surface-strong) 100%
  );
}

.time-card .range-track {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--sky) 26%, var(--surface-strong)) 0%,
    var(--sky) var(--percent, 50%),
    var(--surface-strong) var(--percent, 50%),
    var(--surface-strong) 100%
  );
}

.energy-track {
  background: linear-gradient(
    90deg,
    var(--violet-soft) 0%,
    var(--violet) 32%,
    var(--sky) 68%,
    var(--emerald) 100%
  );
}

.range-input {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 10px;
  appearance: none;
  background: transparent;
  cursor: pointer;
  margin: 0;
}

.range-input.form-range {
  padding: 0;
  background: transparent;
}

.range-input::-webkit-slider-runnable-track {
  height: 10px;
  border: 0;
  background: transparent;
}

.range-input::-moz-range-track {
  height: 10px;
  border: 0;
  background: transparent;
}

.range-input::-moz-range-progress {
  height: 10px;
  border: 0;
  background: transparent;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 38px;
  height: 24px;
  border-radius: 999px;
  background: var(--surface-contrast);
  border: 4px solid var(--violet);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--violet) 32%, transparent);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--violet) 42%, transparent);
}

.range-input::-moz-range-thumb {
  width: 38px;
  height: 24px;
  border-radius: 999px;
  background: var(--surface-contrast);
  border: 4px solid var(--violet);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--violet) 32%, transparent);
  cursor: pointer;
}

.slider-label-center {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.mood-label {
  padding: 6px 16px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--violet-soft) 60%, var(--surface-contrast));
  color: var(--violet-strong);
  font-weight: 600;
  font-size: 0.9rem;
}

.budget-label {
  background: color-mix(in srgb, var(--emerald-soft) 68%, var(--surface-contrast));
  color: color-mix(in srgb, var(--emerald) 72%, var(--foreground));
}

.time-label {
  background: color-mix(in srgb, var(--sky-soft) 70%, var(--surface-contrast));
  color: var(--sky);
}

/* ── Needs grid (2x2) ── */
.needs-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.need-option {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 20px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: color-mix(in srgb, var(--surface-contrast) 88%, transparent);
  color: var(--foreground);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s, transform 0.12s, box-shadow 0.18s;
}

.need-option:hover {
  border-color: var(--violet);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--violet) 14%, transparent);
}

.need-option svg {
  color: var(--violet);
}

.need-option:nth-child(2) svg {
  color: var(--pink);
}

.need-option:nth-child(3) svg {
  color: var(--sky);
}

.need-option:nth-child(4) svg {
  color: var(--emerald);
}

.need-option strong {
  font-size: 1.05rem;
}

.need-option span {
  color: var(--muted-foreground);
  font-size: 0.9rem;
  line-height: 1.4;
}

.need-option.selected {
  border: 2px solid var(--violet);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--violet-soft) 76%, transparent), transparent 72%),
    color-mix(in srgb, var(--surface-contrast) 88%, transparent);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--violet) 18%, transparent);
}

.need-option:nth-child(2).selected {
  border-color: var(--pink);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--pink-soft) 76%, transparent), transparent 72%),
    color-mix(in srgb, var(--surface-contrast) 88%, transparent);
}

.need-option:nth-child(3).selected {
  border-color: var(--sky);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--sky-soft) 76%, transparent), transparent 72%),
    color-mix(in srgb, var(--surface-contrast) 88%, transparent);
}

.need-option:nth-child(4).selected {
  border-color: var(--emerald);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--emerald-soft) 76%, transparent), transparent 72%),
    color-mix(in srgb, var(--surface-contrast) 88%, transparent);
}

/* ── Time chip ── */
.time-chip {
  padding: 6px 14px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--sky-soft) 70%, var(--surface-contrast));
  color: var(--sky);
  font-weight: 700;
  font-size: 0.9rem;
}

/* ── Finish button ── */
.finish-tooltip-wrapper {
  justify-self: end;
  width: fit-content;
  margin-left: auto;
}

.finish-button {
  padding: 14px 32px;
  border-radius: 999px;
  font-weight: 600;
  box-shadow: var(--shadow-panel-strong);
}

.finish-tooltip-wrapper .tooltip-bubble {
  left: auto;
  right: 0;
  transform: translateY(-8px);
}

.finish-tooltip-wrapper .tooltip-bubble::before {
  left: auto;
  right: 18px;
  transform: translateX(50%) translateY(50%) rotate(45deg);
}

.finish-tooltip-wrapper:hover .tooltip-bubble {
  transform: translateY(0);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .test-card {
    gap: 28px;
    padding: 20px;
  }

  .needs-grid {
    grid-template-columns: 1fr;
  }

  .finish-button {
    width: 100%;
  }

  .energy-mood-current,
  .slider-mood-current {
    width: 50px;
    height: 50px;
  }

  .energy-mood-current svg,
  .slider-mood-current svg {
    width: 30px;
    height: 30px;
  }
}
</style>
