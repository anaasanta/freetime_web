<script setup>
import { computed, ref } from 'vue'
import {
  Sparkles,
  UserRound,
  Search,
  CalendarDays,
  Dumbbell,
  Pencil,
  Footprints,
  Headphones,
  Moon,
  Palette,
  Plus,
  ChevronRight,
  BookOpen,
  Heart,
  LogOut,
  Settings,
} from 'lucide-vue-next'

import GradientCard from '../components/ui/GradientCard.vue'

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  savedActivities: {
    type: Array,
    default: () => [],
  },
  recommendedActivities: {
    type: Array,
    default: () => [],
  },
  allActivities: {
    type: Array,
    default: () => [],
  },
  plannedActivities: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['go-test', 'go-profile', 'open-activity', 'add-activity', 'logout'])

const searchText = ref('')

const searchableActivities = computed(() => {
  if (!searchText.value.trim()) return []

  return props.allActivities
    .filter((activity) =>
      activity.title.toLowerCase().includes(searchText.value.trim().toLowerCase()),
    )
    .slice(0, 5)
})

const nextPlannedActivity = computed(() => {
  return props.plannedActivities.length > 0 ? props.plannedActivities[0] : null
})

const nextPlannedTitle = computed(() => {
  if (!nextPlannedActivity.value) return ''

  const activity = props.allActivities.find(
    (item) => item.id === nextPlannedActivity.value.activityId,
  )

  if (!activity) return ''

  return `${activity.title} · ${nextPlannedActivity.value.day} ${nextPlannedActivity.value.time}`
})

function iconFor(activity) {
  const iconName = activity.icon

  if (iconName === 'dumbbell') return Dumbbell
  if (iconName === 'pencil') return Pencil
  if (iconName === 'footprints') return Footprints
  if (iconName === 'headphones') return Headphones
  if (iconName === 'moon') return Moon
  if (iconName === 'palette') return Palette
  if (iconName === 'book') return BookOpen
  if (iconName === 'heart') return Heart

  return Sparkles
}

const avatarModules = import.meta.glob('../assets/avatars/*', {
  eager: true,
  import: 'default',
})

const avatarSrc = computed(() => {
  const avatarFile = props.user?.avatar

  if (!avatarFile) return null

  return avatarModules[`../assets/avatars/${avatarFile}`] || null
})
</script>

<template>
  <main class="app-page home-page">
    <section class="page-container">
      <header class="home-header">
        <div class="top-search">
          <div class="search-box">
            <Search :size="20" />

            <div class="search-content">
              <input
                v-model="searchText"
                type="text"
                placeholder="Buscar hobbies per afegir..."
              />
            </div>
          </div>

          <div v-if="searchableActivities.length > 0" class="search-results">
            <div
              v-for="activity in searchableActivities"
              :key="activity.id"
              class="search-result"
              @click="emit('open-activity', activity.id)"
            >
              <component :is="iconFor(activity)" :size="20" />

              <span>{{ activity.title }}</span>

                <div class="tooltip-wrapper mini-tooltip-wrapper">
                <button
                    class="mini-add"
                    type="button"
                    @click.stop="emit('add-activity', activity.id)"
                >
                    <Plus :size="16" />
                </button>

                <span class="tooltip-bubble">Afegir a les teves activitats</span>
                </div>
            </div>
          </div>
        </div>

    <div class="header-actions">
        <div class="tooltip-wrapper">
            <button class="profile-button" type="button" @click="emit('go-profile')">
            <img
                v-if="avatarSrc"
                :src="avatarSrc"
                alt=""
                class="profile-button-avatar"
            />
            <UserRound v-else :size="20" />
            </button>

            <span class="tooltip-bubble">Veure el teu perfil i les activitats guardades</span>
            </div>

            <div class="tooltip-wrapper">
                <button class="logout-button" type="button" @click="emit('logout')">
                <LogOut :size="20" />
                </button>

                <span class="tooltip-bubble">Tancar sessió</span>
            </div>
            <div class="tooltip-wrapper">
                <button class="settings-button" type="button" @click="emit('go-settings')">
                <Settings :size="20" />
                </button>

                <span class="tooltip-bubble">Configuració</span>
            </div>
        </div>
      </header>

        <div class="hero-area">
        <div class="tooltip-wrapper">
            <button class="test-button" type="button" @click="emit('go-test')">
            <GradientCard
                container-class="test-gradient-shell"
                content-class="test-content sphere-content"
            >
                <div class="test-circle-inner">
                <Sparkles class="test-icon" :size="54" />
                <strong>Test</strong>
                </div>
            </GradientCard>
            </button>

            <span class="tooltip-bubble">
            Respon unes preguntes i t’ensenyarem activitats recomanades segons el teu estat d’ànim,
            energia i temps disponible.
            </span>
        </div>
        </div>

      <section class="home-section">
        <div class="section-heading">
          <h2>Les teves activitats</h2>

          <button class="text-button" type="button" @click="emit('go-profile')">
            Veure totes
            <ChevronRight :size="18" />
          </button>
        </div>

        <div v-if="savedActivities.length > 0" class="activity-grid saved-grid">
          <article
            v-for="activity in savedActivities"
            :key="activity.id"
            class="activity-card"
            :class="`tone-${activity.tone || 'violet'}`"
            @click="emit('open-activity', activity.id)"
          >
            <div class="activity-icon">
              <component :is="iconFor(activity)" :size="28" />
            </div>

            <div>
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.duration }}</p>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          Encara no tens activitats guardades. Pots afegir-ne des de recomanacions o fent el test.
        </div>
      </section>

      <section class="home-section">
        <div class="section-heading">
          <h2>Recomanades</h2>

          <span class="chip">Per a tu</span>
        </div>

        <div class="recommendation-row">
          <article
            v-for="activity in recommendedActivities"
            :key="activity.id"
            class="recommendation-card"
            :class="`tone-${activity.tone || 'violet'}`"
            @click="emit('open-activity', activity.id)"
          >
        <div class="tooltip-wrapper add-tooltip-wrapper">
        <button
            class="add-button"
            type="button"
            aria-label="Afegir activitat"
            @click.stop="emit('add-activity', activity.id)"
        >
            <Plus :size="18" />
        </button>

        <span class="tooltip-bubble">Afegir a les teves activitats</span>
        </div>

            <div class="activity-icon">
              <component :is="iconFor(activity)" :size="28" />
            </div>

            <h3>{{ activity.title }}</h3>

            <p>{{ activity.duration }}</p>
          </article>
        </div>
      </section>

      <section class="next-activity">
        <div class="next-icon">
          <CalendarDays :size="30" />
        </div>

        <div>
          <span>Següent activitat</span>

          <h2 v-if="nextPlannedActivity">
            {{ nextPlannedTitle }}
          </h2>

          <h2 v-else>
            Encara no tens cap activitat programada
          </h2>
        </div>

        <button class="primary-button" type="button" @click="emit('go-profile')">
          Veure
        </button>
      </section>
    </section>
  </main>
</template>

<style scoped>


.home-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}

.header-chip {
  gap: 8px;
}

h1 {
  max-width: 760px;
  margin: 18px 0 10px;
  color: var(--foreground);
  font-size: clamp(2.3rem, 5vw, 4.4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
}

.home-header p {
  max-width: 620px;
  margin: 0;
  color: var(--muted-foreground);
  font-size: 1.1rem;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.profile-button,
.logout-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 2px solid white;
  border-radius: 999px;
  padding: 13px 18px;
  background: white;
  box-shadow: var(--shadow-soft);
  color: var(--foreground);
  font-weight: 800;
}

.settings-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 2px solid white;
  border-radius: 999px;
  padding: 13px 18px;
  background: white;
  box-shadow: var(--shadow-soft);
  color: var(--foreground);
  font-weight: 800;
}

.logout-button {
  width: 50px;
  height: 50px;
  justify-content: center;
  padding: 0;
}

.settings-button {
  width: 50px;
  height: 50px;
  justify-content: center;
  padding: 0;
}

.home-card {
  position: relative;
  min-height: 760px;
  padding: 28px 0 64px;
}

.top-search {
  position: relative;
  z-index: 4;
  display: flex;
  width: min(100%, 860px);
  margin: 0 auto;
  gap: 12px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 8px 24px rgba(90, 110, 140, 0.08);
}

.search-box svg {
  color: var(--muted-foreground);
}

.search-content {
  flex: 1;
  display: grid;
  gap: 2px;
}

.search-content span {
  color: var(--muted-foreground);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.search-content input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--foreground);
  font-size: 0.95rem;
}

.search-results {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  z-index: 10;
  display: grid;
  gap: 8px;
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 10px;
  background: white;
  box-shadow: var(--shadow-soft);
}

.search-result {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 16px;
  padding: 12px 14px;
  background: var(--muted);
  color: var(--foreground);
  font-weight: 700;
  text-align: left;
}

.search-result span {
  flex: 1;
}

.mini-add {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: white;
}

.hero-area {
  display: grid;
  place-items: center;
  padding: 56px 0 42px;
}

.test-button {
  width: 220px;
  aspect-ratio: 1 / 1;
  border: 0;
  padding: 0;
  background: transparent;
  border-radius: 50%;
  overflow: visible;
  transition:
    transform 0.25s ease,
    filter 0.25s ease;
}

.test-button:hover {
  transform: scale(1.04);
}

.test-gradient-shell {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.test-content,
.sphere-content {
  width: 100%;
  height: 100%;
  border-radius: 50% !important;
  overflow: hidden;
  position: relative;
}

.test-circle-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.test-icon {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  color: var(--violet);
}

.test-content strong {
  position: absolute;
  left: 50%;
  top: 57%;
  transform: translate(-50%, -50%);
  margin: 0;
  color: var(--foreground);
  font-size: 3rem;
  line-height: 1;
  text-align: center;
}

.test-content small {
  display: none;
}

.home-section {
  margin-top: 34px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.section-heading h2 {
  margin: 0;
  color: var(--foreground);
  font-size: 1.45rem;
}

.text-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
  background: transparent;
  color: var(--violet);
  font-weight: 800;
}

.activity-grid {
  display: grid;
  gap: 14px;
}

.saved-grid {
  grid-template-columns: repeat(3, minmax(260px, 1fr));
}

.activity-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 16px;
  background: white;
  box-shadow: 0 8px 24px rgba(90, 110, 140, 0.06);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.activity-card:hover,
.recommendation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(90, 110, 140, 0.12);
}

.activity-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
  border-radius: 20px;
  color: var(--foreground);
}

.activity-card h3,
.recommendation-card h3 {
  margin: 0;
  color: var(--foreground);
  font-size: 1rem;
}

.activity-card p,
.recommendation-card p {
  margin: 4px 0 0;
  color: var(--muted-foreground);
  font-size: 0.9rem;
}

.recommendation-row {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.recommendation-card {
  position: relative;
  min-width: 180px;
  border: 1px solid var(--border);
  border-radius: 26px;
  padding: 20px 16px;
  background: white;
  text-align: center;
  box-shadow: 0 8px 24px rgba(90, 110, 140, 0.06);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.recommendation-card .activity-icon {
  margin: 8px auto 12px;
}

.add-button {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--muted);
  color: var(--foreground);
}

.next-activity {
  display: flex;
  align-items: center;
  gap: 18px;
  max-width: 760px;
  margin: 44px auto 0;
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 30px;
  padding: 18px;
  background: linear-gradient(90deg, #ede9fe, #f0f9ff, #ecfdf5);
  box-shadow: 0 8px 24px rgba(90, 110, 140, 0.08);
}

.next-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.84);
  color: var(--violet);
}

.next-activity div:nth-child(2) {
  flex: 1;
}

.next-activity span {
  color: var(--violet);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.next-activity h2 {
  margin: 4px 0 0;
  color: var(--foreground);
  font-size: 1.2rem;
}

.next-activity .primary-button {
  margin: 0;
}

@media (max-width: 820px) {
  .home-header {
    flex-direction: column;
  }

  .top-search {
    flex-direction: column;
  }

  .saved-grid {
    grid-template-columns: 1fr;
  }

  .next-activity {
    align-items: stretch;
    flex-direction: column;
  }

  .next-activity .primary-button {
    width: 100%;
  }
}


/* ===== TOOLTIP ===== */

.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip-bubble {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 12px);
  transform: translateX(-50%) translateY(8px);
  min-width: 180px;
  max-width: 280px;
  padding: 10px 12px;
  border: 1px solid rgba(180, 190, 220, 0.35);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(80, 100, 140, 0.12);
  color: var(--foreground);
  font-size: 0.82rem;
  line-height: 1.4;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.22s ease,
    transform 0.22s ease,
    visibility 0.22s ease;
  z-index: 30;
}

.tooltip-bubble::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  border-width: 7px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.92) transparent transparent transparent;
}

.tooltip-wrapper:hover .tooltip-bubble {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* ===== TEST ESFERA ===== */

.hero-area {
  display: grid;
  place-items: center;
  padding: 56px 0 42px;
}

.test-button {
  width: 230px;
  height: 230px;
  border: 0;
  padding: 0;
  background: transparent;
  border-radius: 50%;
  transition:
    transform 0.25s ease,
    filter 0.25s ease;
}

.test-button:hover {
  transform: scale(1.04);
}

.sphere-content,
.test-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 999px;
  text-align: center;
  padding: 0;
}

.test-icon {
  color: var(--violet);
}

.test-content strong {
  color: var(--foreground);
  font-size: 2.4rem;
  line-height: 1;
}

/* quitamos la descripción dentro del botón */
.test-content small {
  display: none;
}

/* ===== WRAPPERS ESPECÍFICOS ===== */

.add-tooltip-wrapper,
.mini-tooltip-wrapper {
  position: absolute;
  z-index: 3;
}

.add-tooltip-wrapper {
  top: 12px;
  right: 12px;
}

.mini-tooltip-wrapper {
  position: relative;
}

/* ===== BOTONES ===== */


.logout-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  padding: 13px 18px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 24px rgba(90, 110, 140, 0.08);
  color: var(--foreground);
  font-weight: 800;
}

.logout-button {
  width: 50px;
  height: 50px;
  justify-content: center;
  padding: 0;
}

.add-button {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(10px);
  color: var(--foreground);
}

.mini-add {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.86);
  color: var(--foreground);
}

/* para que los tooltips de las cards no queden cortados */
.recommendation-card {
  overflow: visible;
}

.profile-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 18px 0 8px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10px 24px rgba(80, 100, 140, 0.12);
  font-weight: 800;
  color: var(--foreground);
}

.profile-button-avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  display: block;
}
</style>