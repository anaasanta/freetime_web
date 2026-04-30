<script setup>
import { Dumbbell, Moon, Palette, X } from 'lucide-vue-next'

const emit = defineEmits(['finish-test', 'close'])
</script>

<template>
  <main class="app-page">
    <section class="page-container">
      <div class="test-top">
        <span class="chip">FreeTime</span>

        <button class="close-button" type="button" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>

      <div class="card test-card">
        <div class="intro">
          <h1>Com et sents ara mateix?</h1>
          <p>
            Respon unes preguntes ràpides i et proposarem una activitat que encaixi amb el teu moment.
          </p>
        </div>

        <section class="question">
          <div class="question-heading">
            <h2>Nivell d’energia</h2>
            <span>Baixa → Alta</span>
          </div>

          <div class="slider-card">
            <div class="emoji-row">
              <span>🫠</span>
              <span>😌</span>
              <span>✨</span>
            </div>

            <div class="fake-slider">
              <div class="fake-slider-thumb"></div>
            </div>

            <div class="slider-labels">
              <span>Molt poca energia</span>
              <span>Molta energia</span>
            </div>
          </div>
        </section>

        <section class="question">
          <h2>Què necessites avui?</h2>

          <div class="needs-grid">
            <button class="need-option selected" type="button">
              <Moon :size="32" />
              <strong>Desconnectar</strong>
              <span>Baixar revolucions</span>
            </button>

            <button class="need-option" type="button">
              <Palette :size="32" />
              <strong>Fer alguna cosa creativa</strong>
              <span>Sense gaire esforç</span>
            </button>

            <button class="need-option" type="button">
              <Dumbbell :size="32" />
              <strong>Activar-me</strong>
              <span>Moure una mica el cos</span>
            </button>
          </div>
        </section>

        <section class="question">
          <div class="question-heading">
            <h2>Temps disponible</h2>
            <span class="time-chip">45 min</span>
          </div>

          <div class="time-bar">
            <div></div>
          </div>

          <div class="slider-labels">
            <span>10 min</span>
            <span>1 h</span>
            <span>2 h</span>
          </div>
        </section>

        <button class="primary-button finish-button" type="button" @click="emit('finish-test')">
          Acabar test
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
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: white;
  color: var(--foreground);
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

.fake-slider {
  position: relative;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #cfd7ff, #c7efe2, #ffe3b8);
}

.fake-slider-thumb {
  position: absolute;
  top: 50%;
  left: 24%;
  width: 30px;
  height: 30px;
  border: 5px solid var(--violet);
  border-radius: 50%;
  background: white;
  transform: translateY(-50%);
  box-shadow: var(--shadow-soft);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: var(--muted-foreground);
  font-size: 0.9rem;
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
}

.time-bar {
  height: 12px;
  border-radius: 999px;
  background: var(--muted);
}

.time-bar div {
  width: 35%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #a9c7ff, #9ee0ce);
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