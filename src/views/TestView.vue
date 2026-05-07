<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Dumbbell, Moon, Palette, X, Frown, Annoyed, Laugh } from 'lucide-vue-next'
import { testConfig } from '@/data/testConfig'
import { finishTest } from '@/stores/appSession'

const router = useRouter()

// Mapa de iconos por nombre (para poder usarlos dinámicamente desde el config)
const iconMap = { Moon, Palette, Dumbbell, X, Frown, Annoyed, Laugh}

// Estat iniial
const energyValue   = ref(testConfig.energy.defaultValue)
const selectedNeed  = ref(null)
const timeValue     = ref(testConfig.time.defaultValue)

// Posició barra energia (0–100%)
const energyPercent = computed(() => {
  const { min, max } = testConfig.energy
  return ((energyValue.value - min) / (max - min)) * 100
})

// Posició barra temps (0–100%)
const timePercent = computed(() => {
  const { min, max } = testConfig.time
  return ((timeValue.value - min) / (max - min)) * 100
})

const timeLabel = computed(() => testConfig.time.formatLabel(timeValue.value))

function selectNeed(id) {
  selectedNeed.value = selectedNeed.value === id ? null : id
}

function handleFinish() {
  const selectedId = finishTest({
    energy: energyValue.value,
    need: selectedNeed.value,
    time: timeValue.value,
  })

  if (!selectedId) {
    router.replace({ name: 'home' })
    return
  }

  router.push({
    name: 'activity',
    params: { id: selectedId },
    query: { source: 'test' },
  })
}
</script>

<template>
  <main class="app-page">
    <section class="page-container">
      <div class="test-top">
        <span class="chip">{{ testConfig.chipLabel }}</span>
        <button class="close-button" type="button" @click="router.push({ name: 'home' })">
          <X :size="20" />
        </button>
      </div>

      <div class="card test-card">

        <!-- Intro -->
        <div class="intro">
          <h1>{{ testConfig.intro.title }}</h1>
          <p>{{ testConfig.intro.description }}</p>
        </div>

        <!-- Pregunta 1: Nivell d'energia -->
        <section class="question">
          <div class="question-heading">
            <h2>{{ testConfig.energy.title }}</h2>
            <span>{{ testConfig.energy.subtitle }}</span>
          </div>

          <div class="slider-card">
            <div class="emoji-row">
              <component
                v-for="icon in testConfig.energy.emojis"
                :key="icon"
                :is="iconMap[icon]"
                :size="32"
              />
            </div>

            <div class="slider-wrapper">
              <input
                v-model.number="energyValue"
                type="range"
                :min="testConfig.energy.min"
                :max="testConfig.energy.max"
                class="range-input"
              />
              <div
                class="range-track"
                :style="{ '--percent': energyPercent + '%' }"
              ></div>
            </div>

            <div class="slider-labels">
              <span>{{ testConfig.energy.labelMin }}</span>
              <span>{{ testConfig.energy.labelMax }}</span>
            </div>
          </div>
        </section>

        <!-- Pregunta 2: Què necessites avui? -->
        <section class="question">
          <h2>{{ testConfig.needs.title }}</h2>

          <div class="needs-grid">
            <button
              v-for="option in testConfig.needs.options"
              :key="option.id"
              class="need-option"
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

        <!-- Pregunta 3: Temps disponible -->
        <section class="question">
          <div class="question-heading">
            <h2>{{ testConfig.time.title }}</h2>
            <span class="time-chip">{{ timeLabel }}</span>
          </div>

          <div class="slider-wrapper">
            <input
              v-model.number="timeValue"
              type="range"
              :min="testConfig.time.min"
              :max="testConfig.time.max"
              step="5"
              class="range-input"
            />
            <div
              class="range-track"
              :style="{ '--percent': timePercent + '%' }"
            ></div>
          </div>

          <div class="slider-labels">
            <span v-for="label in testConfig.time.labels" :key="label">{{ label }}</span>
          </div>
        </section>

        <button
          class="primary-button finish-button"
          type="button"
          @click="handleFinish"
        >
          {{ testConfig.finishButton }}
        </button>

      </div>
    </section>
  </main>
</template>

<style scoped>
.test-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.close-button {
  position: absolute;
  top: clamp(20px, 3vw, 34px);
  right: clamp(20px, 3vw, 34px);
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 999px;
  background: var(--card);
  color: var(--foreground);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(14px);
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}

.close-button:hover {
  transform: translateY(-1px);
  background: var(--surface-strong);
  box-shadow: var(--shadow-panel-strong);
}

.test-card {
  display: grid;
  gap: 34px;
  max-width: 980px;
  margin: 0 auto;
}

.intro h1 {
  margin: 0 0 10px;
  color: var(--foreground);
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  letter-spacing: -0.04em;
}

.intro p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.7;
}

.question {
  display: grid;
  gap: 16px;
}

.question h2 {
  margin: 0;
  color: var(--foreground);
}

.question-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.question-heading span {
  color: var(--muted-foreground);
  font-weight: 700;
}

.slider-card {
  border: 1px solid var(--border);
  border-radius: 26px;
  padding: 22px;
  background: #f8fafc;
}

.emoji-row {
  display: flex;
  justify-content: space-between;
  padding: 0 4px 12px;
  font-size: 2rem;
}

/* ── Slider personalizado ── */
.slider-wrapper {
  position: relative;
  height: 30px;
  display: flex;
  align-items: center;
}

.range-track {
  position: absolute;
  left: 0;
  right: 0;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #cfd7ff, #c7efe2, #ffe3b8);
  pointer-events: none;
}

.range-input {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 12px;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
  margin: 0;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  border: 5px solid var(--violet);
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition: transform 0.1s;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.range-input::-moz-range-thumb {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  border: 5px solid var(--violet);
  box-shadow: var(--shadow-soft);
  cursor: pointer;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: var(--muted-foreground);
  font-size: 0.9rem;
}

.emoji-row svg {
  color: var(--violet);
}

.needs-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.need-option {
  display: grid;
  gap: 8px;
  min-height: 150px;
  border: 1px solid var(--border);
  border-radius: 26px;
  padding: 20px;
  background: white;
  color: var(--foreground);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
}

.need-option:hover {
  border-color: var(--violet);
  transform: translateY(-2px);
}

.need-option svg {
  color: var(--violet);
}

.need-option span {
  color: var(--muted-foreground);
}

.need-option.selected {
  border: 2px solid var(--violet);
  background: var(--violet-soft);
}

.time-chip {
  border-radius: 999px;
  padding: 6px 12px;
  background: #fff7ed;
  color: #c2410c !important;
  font-weight: 700;
  transition: all 0.2s;
}

.finish-button {
  justify-self: start;
}

@media (max-width: 820px) {
  .needs-grid {
    grid-template-columns: 1fr;
  }

  .finish-button {
    width: 100%;
  }
}
</style>
