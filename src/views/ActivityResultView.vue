<script setup>
import {
  BookOpen,
  Dumbbell,
  Footprints,
  Headphones,
  Heart,
  Palette,
  Pencil,
  Sparkles,
  Trash2,
  Plus,
} from 'lucide-vue-next'
import { activityResultConfig as c } from '@/data/activityResultConfig'

const props = defineProps({
  activity: {
    type: Object,
    default: null,
  },
  source: {
    type: String,
    default: 'normal',
  },
  isSaved: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['reject', 'start', 'save', 'remove', 'go-home', 'go-profile', 'feedback'])

function iconFor(iconName) {
  if (iconName === 'book') return BookOpen
  if (iconName === 'dumbbell') return Dumbbell
  if (iconName === 'footprints') return Footprints
  if (iconName === 'headphones') return Headphones
  if (iconName === 'palette') return Palette
  if (iconName === 'pencil') return Pencil
  if (iconName === 'heart') return Heart
  return Sparkles
}

function sourceLabel() {
  return c.sourceLabels[props.source] ?? c.sourceLabels['normal']
}

function toggleSaved() {
  if (!props.activity) return
  if (props.isSaved) {
    emit('remove', props.activity.id)
  } else {
    emit('save', props.activity.id)
  }
}
</script>

<template>
  <main class="app-page detail-page">
    <div v-if="activity" class="detail-card">
      <section class="detail-visual" :class="`tone-${activity.tone}`">
        <div class="detail-icon activity-icon">
          <component :is="iconFor(activity.icon)" :size="78" />
        </div>

        <span class="chip detail-chip">
          {{ sourceLabel() }}
        </span>

        <h1>{{ activity.title }}</h1>
        <p>{{ activity.shortDescription }}</p>
      </section>

      <section class="detail-content">
        <div class="info-grid">
          <div>
            <span>{{ c.infoGrid.duration }}</span>
            <strong>{{ activity.duration }}</strong>
          </div>
          <div>
            <span>{{ c.infoGrid.difficulty }}</span>
            <strong>{{ activity.difficulty }}</strong>
          </div>
          <div>
            <span>{{ c.infoGrid.materials }}</span>
            <strong>{{ activity.materials }}</strong>
          </div>
          <div>
            <span>{{ c.infoGrid.price }}</span>
            <strong>{{ activity.price }}</strong>
          </div>
          <div>
            <span>{{ c.infoGrid.energy }}</span>
            <strong>{{ activity.energy }}</strong>
          </div>
        </div>

        <section class="text-section">
          <h2>{{ c.sections.description }}</h2>
          <p>{{ activity.description }}</p>
        </section>

        <section class="text-section">
          <h2>{{ c.sections.howToStart }}</h2>
          <ol class="steps-list">
            <li v-for="step in activity.steps" :key="step">
              {{ step }}
            </li>
          </ol>
        </section>

        <section class="benefit-box">
          <strong>{{ c.sections.benefit }}</strong>
          <p>{{ activity.benefits }}</p>
        </section>

        <div class="actions">
          <button class="primary-button" type="button" @click="emit('start', activity.id)">
            {{ c.buttons.start }}
          </button>

          <button
            class="list-button"
            :class="{ saved: isSaved }"
            type="button"
            @click="toggleSaved"
          >
            <Trash2 v-if="isSaved" :size="18" />
            <Plus v-else :size="18" />
            {{ isSaved ? c.buttons.removeFromList : c.buttons.addToList }}
          </button>

          <button
            v-if="source === 'test'"
            class="danger-button"
            type="button"
            @click="emit('reject')"
          >
            {{ c.buttons.reject }}
          </button>

          <button class="secondary-button" type="button" @click="emit('feedback')">
            {{ c.buttons.backToHome }}
          </button>
        </div>
      </section>
    </div>

    <div v-else class="empty-detail">
      <h1>{{ c.empty.title }}</h1>
      <button class="primary-button" type="button" @click="emit('go-home')">
        {{ c.buttons.backToHome }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  display: flex;
  align-items: stretch;
  padding: 0;
}

.detail-card {
  display: grid;
  grid-template-columns: minmax(420px, 0.9fr) minmax(560px, 1.1fr);
  width: 100%;
  min-height: 100vh;
}

.detail-visual {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(42px, 6vw, 96px);
  background:
    radial-gradient(circle at 20% 20%, rgba(196, 181, 253, 0.22), transparent 34%),
    radial-gradient(circle at 80% 30%, rgba(191, 219, 254, 0.28), transparent 36%),
    radial-gradient(circle at 70% 80%, rgba(220, 252, 231, 0.22), transparent 34%),
    rgba(255, 255, 255, 0.2);
}

.detail-icon {
  display: grid;
  place-items: center;
  width: clamp(150px, 14vw, 210px);
  height: clamp(150px, 14vw, 210px);
  margin-bottom: 32px;
  border-radius: 48px;
  color: var(--foreground);
  box-shadow: var(--shadow-soft);
}

.detail-chip {
  width: fit-content;
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(12px);
}

.detail-visual h1 {
  max-width: 620px;
  margin: 24px 0 16px;
  color: var(--foreground);
  font-size: clamp(4rem, 6vw, 7rem);
  line-height: 0.92;
  letter-spacing: -0.07em;
}

.detail-visual p {
  max-width: 560px;
  margin: 0;
  color: var(--muted-foreground);
  font-size: 1.18rem;
  line-height: 1.65;
}

.detail-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 26px;
  padding: clamp(42px, 5vw, 84px);
  background: rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(12px);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.info-grid div {
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 22px;
  padding: 18px 14px;
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(14px);
  text-align: center;
  box-shadow: 0 10px 26px rgba(90, 110, 140, 0.05);
}

.info-grid span {
  display: block;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 900;
}

.info-grid strong {
  display: block;
  margin-top: 7px;
  color: var(--foreground);
}

.text-section h2 {
  margin: 0 0 12px;
  color: var(--foreground);
  font-size: 1.75rem;
}

.text-section p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.8;
  font-size: 1.02rem;
}

.steps-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.steps-list li {
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 20px;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.48);
  backdrop-filter: blur(14px);
  color: var(--foreground);
}

.benefit-box {
  border: 1px solid rgba(110, 231, 183, 0.38);
  border-radius: 24px;
  padding: 18px 20px;
  background: rgba(236, 253, 245, 0.68);
  backdrop-filter: blur(14px);
}

.benefit-box strong {
  color: #047857;
}

.benefit-box p {
  margin: 6px 0 0;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
}

.list-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  border: 1px solid rgba(196, 181, 253, 0.8);
  border-radius: var(--radius-control);
  padding: 12px 20px;
  background: rgba(245, 243, 255, 0.82);
  color: #6d28d9;
  font-weight: 900;
  box-shadow: 0 10px 24px rgba(124, 58, 237, 0.08);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.list-button:hover {
  transform: translateY(-1px);
  background: rgba(237, 233, 254, 0.95);
  box-shadow: 0 14px 30px rgba(124, 58, 237, 0.13);
}

.list-button.saved {
  border-color: rgba(167, 139, 250, 0.9);
  background: linear-gradient(135deg, rgba(237, 233, 254, 0.95), rgba(224, 231, 255, 0.9));
  color: #5b21b6;
}

.empty-detail {
  width: min(100%, 900px);
  margin: auto;
  padding: 40px;
}

@media (max-width: 1100px) {
  .detail-card {
    grid-template-columns: 1fr;
  }

  .detail-visual {
    min-height: 58vh;
  }

  .detail-content {
    justify-content: flex-start;
  }
}

@media (max-width: 760px) {
  .detail-page {
    padding: 0;
  }

  .detail-visual,
  .detail-content {
    padding: 28px;
  }

  .detail-visual h1 {
    font-size: clamp(3rem, 16vw, 4.6rem);
  }

  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .actions > * {
    width: 100%;
  }
}
</style>
