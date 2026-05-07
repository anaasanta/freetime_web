<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
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
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart,
  LogOut,
  Settings,
  FileQuestionMark,
} from 'lucide-vue-next'

import AppBrand from '@/components/layout/AppBrand.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
import ClickSpark from '@/components/ui/ClickSpark/ClickSpark.vue'
import { activityCopy, homeCopy, landingCopy, themeCopy } from '@/data/uiText'
import { logout, syncSelectedActivity, addSavedActivity, useAppSession } from '@/stores/appSession'

const router = useRouter()
const { currentUser, savedActivities, recommendedActivities, allActivities, plannedActivities } =
  useAppSession()

const searchText = ref('')
const savedRow = ref(null)
const activeAddTooltip = ref('')
const addTooltipStyle = ref({})

const searchableActivities = computed(() => {
  if (!searchText.value.trim()) return []

  return allActivities
    .filter((activity) =>
      activity.title.toLowerCase().includes(searchText.value.trim().toLowerCase()),
    )
    .slice(0, 5)
})

const nextPlannedActivity = computed(() => {
  return plannedActivities.value.length > 0 ? plannedActivities.value[0] : null
})

const nextPlannedTitle = computed(() => {
  if (!nextPlannedActivity.value) return ''

  const activity = allActivities.find(
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

function isSavedActivity(activityId) {
  return savedActivities.value.some((activity) => activity.id === activityId)
}

const avatarModules = import.meta.glob('../assets/avatars/*', {
  eager: true,
  import: 'default',
})

const avatarSrc = computed(() => {
  const avatarFile = currentUser.value?.avatar

  if (!avatarFile) return null

  return avatarModules[`../assets/avatars/${avatarFile}`] || null
})

function openActivity(activityId, source = 'normal') {
  syncSelectedActivity(activityId, source)

  const query = source === 'normal' ? {} : { source }

  router.push({
    name: 'activity',
    params: { id: activityId },
    query,
  })
}

function handleLogout() {
  logout()
  router.replace({ name: 'landing' })
}

function scrollSavedActivities(direction) {
  if (!savedRow.value) return

  savedRow.value.scrollBy({
    left: direction * 420,
    behavior: 'smooth',
  })
}

function updateAddTooltipPosition(event) {
  const target = event.currentTarget

  if (!target || typeof target.getBoundingClientRect !== 'function') return

  const rect = target.getBoundingClientRect()
  const tooltipWidth = 220
  const margin = 16
  const anchorX = rect.left + rect.width / 2
  const anchorY = rect.top

  let left = anchorX - tooltipWidth / 2

  if (left < margin) {
    left = margin
  }

  if (left + tooltipWidth > window.innerWidth - margin) {
    left = window.innerWidth - tooltipWidth - margin
  }

  activeAddTooltip.value = homeCopy.tooltips.addSaved
  addTooltipStyle.value = {
    left: `${left}px`,
    top: `${Math.max(anchorY - 58, margin)}px`,
    '--tooltip-pointer-x': `${anchorX - left}px`,
  }
}

function openAddTooltip(event) {
  updateAddTooltipPosition(event)
}

function closeAddTooltip() {
  activeAddTooltip.value = ''
}

function handleAddActivity(activityId) {
  window.setTimeout(() => {
    addSavedActivity(activityId)
  }, 420)
}
</script>

<template>
  <main class="app-page home-page">
    <section class="page-container">
      <AppNavbar class="home-header">
        <template #start>
          <AppBrand :brand="landingCopy.nav.brand" :to="{ name: 'home' }" />
        </template>

        <template #center>
          <div class="top-search">
          <div class="search-box">
            <Search :size="20" />

            <div class="search-content">
              <input
                v-model="searchText"
                type="text"
                :placeholder="homeCopy.searchPlaceholder"
              />
            </div>
          </div>

          <div v-if="searchableActivities.length > 0" class="search-results">
            <div
              v-for="activity in searchableActivities"
              :key="activity.id"
              class="search-result"
              @click="openActivity(activity.id)"
            >
              <component :is="iconFor(activity)" :size="20" />

              <span>{{ activity.title }}</span>

                <span v-if="isSavedActivity(activity.id)" class="already-saved-badge">
                  {{ homeCopy.alreadySaved }}
                </span>

                <div v-else class="tooltip-wrapper mini-tooltip-wrapper">
                <button
                    class="mini-add"
                    type="button"
                    @click.stop="handleAddActivity(activity.id)"
                    @mouseenter="openAddTooltip"
                    @mousemove="updateAddTooltipPosition"
                    @mouseleave="closeAddTooltip"
                    @focus="openAddTooltip"
                    @blur="closeAddTooltip"
                >
                  <ClickSpark
                    spark-color="#7c3aed"
                    :spark-size="9"
                    :spark-radius="22"
                    :spark-count="8"
                    :duration="440"
                  >
                    <Plus :size="16" />
                  </ClickSpark>
                </button>
                </div>
            </div>
          </div>
          </div>
        </template>

        <template #end>
    <div class="header-actions">
      <ThemeToggle :labels="themeCopy.toggle" />

        <div class="tooltip-wrapper">
            <button class="profile-button" type="button" @click="router.push({ name: 'profile' })">
            <img
                v-if="avatarSrc"
                :src="avatarSrc"
                alt=""
                class="profile-button-avatar"
            />
            <UserRound v-else :size="20" />
            </button>

            <span class="tooltip-bubble">{{ homeCopy.tooltips.profile }}</span>
            </div>

            <div class="tooltip-wrapper">
                <button class="logout-button" type="button" @click="handleLogout">
                <LogOut :size="20" />
                </button>

                <span class="tooltip-bubble">{{ homeCopy.tooltips.logout }}</span>
            </div>
            <div class="tooltip-wrapper">
                <button class="settings-button" type="button" @click="router.push({ name: 'settings' })">
                <Settings :size="20" />
                </button>

                <span class="tooltip-bubble">{{ homeCopy.tooltips.settings }}</span>
            </div>
    </div>
        </template>
      </AppNavbar>

        <div class="hero-area">
        <div class="tooltip-wrapper">
            <button class="test-button" type="button" @click="router.push({ name: 'test' })">
              <span class="test-orbit orbit-one"></span>
              <span class="test-orbit orbit-two"></span>
              <span class="test-orbit orbit-three"></span>
              <span class="test-spark spark-one"></span>
              <span class="test-spark spark-two"></span>
              <span class="test-spark spark-three"></span>
              <span class="test-spark spark-four"></span>
              <span class="test-spark spark-five"></span>
              <span class="test-spark spark-six"></span>
              <span class="test-glow"></span>
              <span class="test-content">
                <Sparkles class="test-icon" :size="70" />
                <strong>{{ homeCopy.testLabel }}</strong>
              </span>
            </button>

            <span class="tooltip-bubble">
            {{ homeCopy.testTooltip }}
            </span>
        </div>
        </div>

      <section class="home-section">
        <div class="section-heading">
          <h2>{{ homeCopy.savedActivitiesTitle }}</h2>

          <div v-if="savedActivities.length > 0" class="carousel-controls">
            <button
              class="carousel-button"
              type="button"
              :aria-label="homeCopy.aria.previousSaved"
              @click="scrollSavedActivities(-1)"
            >
              <ChevronLeft :size="20" />
            </button>

            <button
              class="carousel-button"
              type="button"
              :aria-label="homeCopy.aria.nextSaved"
              @click="scrollSavedActivities(1)"
            >
              <ChevronRight :size="20" />
            </button>
          </div>
        </div>

        <div v-if="savedActivities.length > 0" ref="savedRow" class="activity-grid saved-grid saved-row">
          <article
            v-for="activity in savedActivities"
            :key="activity.id"
            class="activity-card"
            :class="`tone-${activity.tone || 'violet'}`"
            @click="openActivity(activity.id)"
          >
            <div class="activity-icon">
              <component :is="iconFor(activity)" :size="28" />
            </div>

            <div>
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.duration }} {{ activityCopy.durationUnit }}</p>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          {{ homeCopy.savedActivitiesEmpty }}
        </div>
      </section>

      <section class="home-section">
        <div class="section-heading">
          <h2>{{ homeCopy.recommendedTitle }}</h2>

          <span class="chip">{{ homeCopy.recommendedBadge }}</span>
        </div>

        <div class="recommendation-row">
          <article
            v-for="activity in recommendedActivities"
            :key="activity.id"
            class="recommendation-card"
            :class="`tone-${activity.tone || 'violet'}`"
            @click="openActivity(activity.id)"
          >
        <div class="tooltip-wrapper add-tooltip-wrapper">
        <button
            class="add-button"
            type="button"
            :aria-label="homeCopy.aria.addActivity"
            @click.stop="handleAddActivity(activity.id)"
            @mouseenter="openAddTooltip"
            @mousemove="updateAddTooltipPosition"
            @mouseleave="closeAddTooltip"
            @focus="openAddTooltip"
            @blur="closeAddTooltip"
        >
          <ClickSpark
            spark-color="#7c3aed"
            :spark-size="10"
            :spark-radius="24"
            :spark-count="8"
            :duration="440"
          >
            <Plus :size="18" />
          </ClickSpark>
        </button>
        </div>

            <div class="activity-icon">
              <component :is="iconFor(activity)" :size="28" />
            </div>

            <h3>{{ activity.title }}</h3>

            <p>{{ activity.duration }} {{ activityCopy.durationUnit }}</p>
          </article>
        </div>
      </section>

      <section class="next-activity">
        <div class="next-icon">
          <CalendarDays :size="30" />
        </div>

        <div>
          <span>{{ homeCopy.nextActivityLabel }}</span>

          <h2 v-if="nextPlannedActivity">
            {{ nextPlannedTitle }}
          </h2>

          <h2 v-else>
            {{ homeCopy.noNextActivity }}
          </h2>
        </div>

        <button class="primary-button" type="button" @click="router.push({ name: 'profile' })">
          {{ homeCopy.viewButton }}
        </button>
      </section>

      <span
        v-if="activeAddTooltip"
        class="tooltip-bubble add-tooltip-floating"
        :style="addTooltipStyle"
      >
        {{ activeAddTooltip }}
      </span>
    </section>
  </main>
</template>

<style scoped>


.home-header {
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
  gap: 12px;
  align-items: center;
}

.profile-button,
.logout-button,
.settings-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 0;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
  box-shadow: var(--shadow-soft);
  color: var(--foreground);
  flex: 0 0 auto;
}

.profile-button:hover,
.logout-button:hover,
.settings-button:hover {
  transform: translateY(-1px);
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
  width: 100%;
  min-width: 0;
  padding-inline: 14px;
  gap: 12px;
}

.search-box {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 10px 14px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
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
  min-width: 0;
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
  background: var(--surface-contrast);
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

.already-saved-badge {
  flex: 0 0 auto !important;
  justify-self: end;
  border: 1px solid color-mix(in srgb, var(--emerald) 28%, transparent);
  border-radius: 999px;
  padding: 5px 9px;
  background: color-mix(in srgb, var(--emerald-soft) 70%, transparent);
  color: color-mix(in srgb, var(--emerald) 62%, var(--foreground));
  font-size: 0.72rem;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
}

.mini-add {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-contrast);
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
  background: color-mix(in srgb, var(--surface-contrast) 88%, transparent);
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
  background: color-mix(in srgb, var(--surface-contrast) 86%, transparent);
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
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 30px;
  padding: 18px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--violet-soft) 84%, transparent),
    color-mix(in srgb, var(--sky-soft) 84%, transparent),
    color-mix(in srgb, var(--emerald-soft) 84%, transparent)
  );
  box-shadow: 0 8px 24px rgba(90, 110, 140, 0.08);
}

.next-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
  border-radius: 20px;
  background: color-mix(in srgb, var(--surface-contrast) 82%, transparent);
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
  .top-search {
    width: 100%;
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
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
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
  border-color: color-mix(in srgb, var(--surface-contrast) 92%, transparent) transparent transparent transparent;
}

.tooltip-wrapper:hover .tooltip-bubble {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.add-tooltip-floating {
  position: fixed;
  bottom: auto;
  width: 220px;
  min-width: 0;
  opacity: 1;
  visibility: visible;
  transform: none;
  z-index: 1000;
}

.add-tooltip-floating::after {
  left: clamp(18px, var(--tooltip-pointer-x), calc(100% - 18px));
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
  border: 2px solid var(--surface-stroke-strong);
  border-radius: 999px;
  padding: 13px 18px;
  background: color-mix(in srgb, var(--surface-contrast) 82%, transparent);
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
  background: color-mix(in srgb, var(--surface-contrast) 86%, transparent);
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
  background: color-mix(in srgb, var(--surface-contrast) 86%, transparent);
  color: var(--foreground);
}

/* para que los tooltips de las cards no queden cortados */
.recommendation-card {
  overflow: visible;
}

.profile-button {
  overflow: hidden;
}

.profile-button-avatar {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  object-fit: cover;
  display: block;
}

/* ===== HOME REFINEMENTS ===== */

.hero-area {
  padding: 50px 0 52px;
}

.test-button {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(220px, 18vw, 270px);
  height: clamp(220px, 18vw, 270px);
  border: 1px solid color-mix(in srgb, var(--violet) 34%, var(--border));
  background:
    radial-gradient(circle at 34% 24%, color-mix(in srgb, var(--surface-contrast) 96%, transparent), transparent 34%),
    radial-gradient(circle at 66% 72%, color-mix(in srgb, var(--sky-soft) 78%, transparent), transparent 42%),
    color-mix(in srgb, var(--surface-contrast) 84%, transparent);
  box-shadow:
    0 28px 70px color-mix(in srgb, var(--violet) 18%, transparent),
    inset 0 1px 0 var(--surface-inset-highlight);
  color: var(--foreground);
}

.test-button:hover {
  transform: translateY(-3px) scale(1.03);
  border-color: color-mix(in srgb, var(--violet) 58%, var(--border));
  box-shadow:
    0 36px 90px color-mix(in srgb, var(--violet) 28%, transparent),
    inset 0 1px 0 var(--surface-inset-highlight);
}

.test-glow,
.test-orbit,
.test-satellite,
.test-spark {
  position: absolute;
  pointer-events: none;
}

.test-glow {
  inset: 18%;
  border-radius: 50%;
  background:
    radial-gradient(circle, color-mix(in srgb, var(--violet) 20%, transparent), transparent 62%),
    radial-gradient(circle at 65% 35%, color-mix(in srgb, var(--sky) 18%, transparent), transparent 46%);
  filter: blur(10px);
}

.test-orbit {
  inset: -12px;
  border: 1px solid color-mix(in srgb, var(--violet) 26%, transparent);
  border-radius: 46% 54% 52% 48%;
  transform: rotate(-16deg);
}

.orbit-two {
  inset: 10px;
  border-color: color-mix(in srgb, var(--sky) 28%, transparent);
  border-radius: 54% 46% 48% 52%;
  transform: rotate(28deg);
}

.orbit-three {
  inset: -30px;
  border-color: color-mix(in srgb, var(--emerald) 18%, transparent);
  border-radius: 51% 49% 46% 54%;
  transform: rotate(58deg);
}

.test-satellite {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 1px solid color-mix(in srgb, var(--violet) 24%, var(--border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 88%, transparent);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--violet) 16%, transparent);
}

.test-satellite::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--violet);
}

.satellite-one {
  top: 18px;
  right: 34px;
}

.satellite-two {
  left: 8px;
  bottom: 58px;
  width: 18px;
  height: 18px;
}

.satellite-two::after {
  width: 6px;
  height: 6px;
  background: var(--sky);
}

.satellite-three {
  right: 20px;
  bottom: 12px;
  width: 16px;
  height: 16px;
}

.satellite-three::after {
  width: 5px;
  height: 5px;
  background: var(--emerald);
}

.test-spark {
  width: 12px;
  height: 12px;
  color: var(--violet);
}

.test-spark::before,
.test-spark::after {
  content: '';
  position: absolute;
  inset: 5px 0;
  border-radius: 999px;
  background: currentColor;
}

.test-spark::after {
  transform: rotate(90deg);
}

.spark-one {
  top: 54px;
  left: 26px;
}

.spark-two {
  right: 52px;
  top: -2px;
  color: var(--sky);
  transform: scale(0.8);
}

.spark-three {
  left: 60px;
  bottom: 8px;
  color: var(--emerald);
  transform: scale(0.65);
}

.test-content {
  position: relative;
  z-index: 1;
  display: grid;
  width: auto;
  height: auto;
  justify-items: center;
  gap: 14px;
  overflow: visible;
  color: var(--foreground);
}

.test-icon {
  position: static;
  transform: none;
  color: var(--violet);
  filter: drop-shadow(0 12px 22px color-mix(in srgb, var(--violet) 24%, transparent));
}

.test-content strong {
  position: static;
  transform: none;
  color: var(--foreground);
  font-size: 2.7rem;
  font-weight: 900;
  letter-spacing: 0;
}

.carousel-controls {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.carousel-button {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-contrast) 88%, transparent);
  color: var(--foreground);
  box-shadow: 0 8px 24px rgba(90, 110, 140, 0.06);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.carousel-button:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--violet) 38%, var(--border));
  background: color-mix(in srgb, var(--violet-soft) 42%, var(--surface-contrast));
}

.saved-grid {
  display: flex;
  grid-template-columns: none;
  gap: 16px;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
  padding: 2px 2px 10px;
  scrollbar-width: none;
}

.saved-grid::-webkit-scrollbar {
  display: none;
}

.saved-row .activity-card {
  min-width: min(430px, calc(100vw - 48px));
  flex: 0 0 min(430px, calc(100vw - 48px));
  scroll-snap-align: start;
}
</style>
