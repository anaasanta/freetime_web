<script setup>
import { useRoute, useRouter } from 'vue-router'
import { CircleHelp, Plus, Trash2, X } from 'lucide-vue-next'
import AuthPromptModal from '@/components/ui/AuthPromptModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FeedbackModal from '@/components/ui/FeedbackModal.vue'
import { useActivityHeroAnimation } from '@/composables/activity-result/useActivityHeroAnimation'
import { useActivityResult } from '@/composables/activity-result/useActivityResult'
import { useI18n } from '@/stores/i18n'
import { iconFor } from '@/utils/activityIcons'

const route = useRoute()
const router = useRouter()
const { currentLanguage } = useI18n()
const activityImageModules = import.meta.glob('../data/activity_images/*.png', {
  eager: true,
  import: 'default',
})

const {
  selectedActivity,
  activityCopy,
  activityResultCopy,
  translatedActivity,
  activityImageSrc,
  loginRoute,
  rejectionOptions,
  selectedRejectReason,
  showRejectModal,
  showAuthPrompt,
  showFinishModal,
  isSaved,
  isStarted,
  canRejectActivity,
  handleSaveToggle,
  handleStart,
  openAiConsult,
  openFinishModal,
  closeFinishModal,
  closeDetail,
  confirmFinish,
  openRejectModal,
  closeRejectModal,
  closeAuthPrompt,
  confirmReject,
  skipRejectQuestion,
} = useActivityResult({ route, router, currentLanguage, activityImageModules })

const { detailVisualRef, detailIconRef } = useActivityHeroAnimation(selectedActivity)
</script>

<template>
  <main class="app-page detail-page">
    <div v-if="selectedActivity && translatedActivity" class="detail-card">
      <div class="detail-actions">
        <button
          class="close-detail-button btn"
          type="button"
          :aria-label="activityCopy.closeLabel"
          :title="activityCopy.closeLabel"
          @click="closeDetail"
        >
          <X :size="22" />
        </button>
      </div>

      <section ref="detailVisualRef" class="detail-visual" :class="`tone-${selectedActivity.tone}`">
        <div ref="detailIconRef" :key="selectedActivity.id" class="detail-icon detail-icon-docked activity-icon">
          <component :is="iconFor(selectedActivity.icon)" :size="78" />
        </div>

        <div class="detail-hero-media">
          <img
            v-if="activityImageSrc"
            :src="activityImageSrc"
            :alt="translatedActivity.title"
            class="detail-activity-image"
          />
          <div v-else class="detail-image-fallback activity-icon">
            <component :is="iconFor(selectedActivity.icon)" :size="72" />
          </div>
        </div>

        <div class="detail-visual-copy">
          <h1>{{ translatedActivity.title }}</h1>
          <p>{{ translatedActivity.shortDescription }}</p>
        </div>
      </section>

      <section class="detail-content">
        <div class="info-grid">
          <div>
            <span>{{ activityResultCopy.labels.duration }}</span>
            <strong>{{ selectedActivity.duration }} {{ activityCopy.durationUnit }}</strong>
          </div>
          <div>
            <span>{{ activityResultCopy.labels.difficulty }}</span>
            <strong>{{ selectedActivity.difficulty }}</strong>
          </div>
          <div>
            <span>{{ activityResultCopy.labels.materials }}</span>
            <strong>{{ translatedActivity.materials }}</strong>
          </div>
          <div>
            <span>{{ activityResultCopy.labels.price }}</span>
            <strong>{{ selectedActivity.price }}</strong>
          </div>
          <div>
            <span>{{ activityResultCopy.labels.energy }}</span>
            <strong>{{ selectedActivity.energy }}</strong>
          </div>
        </div>

        <section class="text-section">
          <h2>{{ activityResultCopy.sections.description }}</h2>
          <p>{{ translatedActivity.description }}</p>
        </section>

        <section class="text-section">
          <h2>{{ activityResultCopy.sections.howToStart }}</h2>
          <ol class="steps-list">
            <li v-for="step in translatedActivity.steps" :key="step">
              {{ step }}
            </li>
          </ol>
        </section>

        <section class="benefit-box">
          <strong>{{ activityResultCopy.sections.benefit }}</strong>
          <p>{{ translatedActivity.benefits }}</p>
        </section>

        <section class="ai-consult-strip">
          <div class="ai-consult-copy">
            <CircleHelp :size="18" />
            <span>{{ activityCopy.aiConsult.question }}</span>
          </div>

          <BaseButton
            variant="secondary"
            class="ai-consult-button"
            @click="openAiConsult"
          >
            {{ activityCopy.aiConsult.button }}
          </BaseButton>
        </section>

        <div class="actions">
          <button
            v-if="isStarted"
            class="primary-button btn btn-primary finish-button"
            type="button"
            @click="openFinishModal"
          >
            {{ activityResultCopy.buttons.finish }}
          </button>

          <button v-else class="primary-button btn btn-primary" type="button" @click="handleStart">
            {{ activityResultCopy.buttons.start }}
          </button>

          <button class="list-button btn btn-outline-secondary" :class="{ saved: isSaved }" type="button" @click="handleSaveToggle">
            <Trash2 v-if="isSaved" :size="18" />
            <Plus v-else :size="18" />
            {{ isSaved ? activityResultCopy.buttons.removeFromList : activityResultCopy.buttons.addToList }}
          </button>

          <BaseButton
            v-if="canRejectActivity"
            variant="danger"
            @click="openRejectModal"
          >
            {{ activityResultCopy.buttons.reject }}
          </BaseButton>

        </div>
      </section>
    </div>

    <EmptyState v-else class="empty-detail" :title="activityResultCopy.buttons.notFound">
      <BaseButton @click="router.push({ name: 'home' })">
        {{ activityResultCopy.buttons.backToHome }}
      </BaseButton>
    </EmptyState>

    <div v-if="showRejectModal" class="reject-modal" @click.self="closeRejectModal">
      <div
        class="reject-dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="activityResultCopy.rejectModal.closeLabel"
      >
        <button
          class="reject-close btn"
          type="button"
          :aria-label="activityResultCopy.rejectModal.closeLabel"
          :title="activityResultCopy.rejectModal.closeLabel"
          @click="closeRejectModal"
        >
          <X :size="18" />
        </button>
        <h3>{{ activityResultCopy.rejectModal.title }}</h3>
        <p>{{ activityResultCopy.rejectModal.subtitle }}</p>

        <div class="reject-options">
          <button
            v-for="[reason, label] in rejectionOptions"
            :key="reason"
            type="button"
            class="reject-option btn"
            :class="{ selected: selectedRejectReason === reason }"
            @click="selectedRejectReason = reason"
          >
            {{ label }}
          </button>
        </div>

        <div class="reject-actions">
          <BaseButton variant="secondary" @click="skipRejectQuestion">
            {{ activityResultCopy.rejectModal.skipQuestion }}
          </BaseButton>
          <BaseButton @click="confirmReject">
            {{ activityResultCopy.rejectModal.confirm }}
          </BaseButton>
        </div>
      </div>
    </div>

    <AuthPromptModal
      v-if="showAuthPrompt"
      :copy="activityResultCopy.authRequired"
      :login-route="loginRoute"
      @close="closeAuthPrompt"
    />

    <FeedbackModal
      v-if="showFinishModal"
      :copy="activityResultCopy.finishModal"
      title-id="finish-modal-title"
      @cancel="closeFinishModal"
      @confirm="confirmFinish"
    />
  </main>
</template>

<style scoped>
.detail-page {
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  padding: 0;
  background:
    radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--violet-soft) 26%, transparent), transparent 28%),
    radial-gradient(circle at 82% 20%, color-mix(in srgb, var(--sky-soft) 22%, transparent), transparent 28%),
    linear-gradient(180deg, var(--background), color-mix(in srgb, var(--background) 82%, var(--violet-soft)));
}

.detail-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.1fr);
  width: 100%;
  min-width: 0;
}

.detail-visual {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: flex-start;
  gap: clamp(18px, 3vw, 28px);
  padding: clamp(32px, 5vw, 72px);
}

.detail-icon {
  display: grid;
  place-items: center;
  width: clamp(92px, 8vw, 112px);
  height: clamp(92px, 8vw, 112px);
  border-radius: 30px;
  box-shadow: var(--shadow-soft);
  color: var(--foreground);
}

.detail-icon svg {
  width: clamp(58px, 5.2vw, 76px);
  height: clamp(58px, 5.2vw, 76px);
}

.detail-icon-docked {
  align-self: start;
  animation: dock-icon 1300ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.detail-hero-media {
  display: grid;
  align-self: center;
  width: min(100%, 520px);
  animation: reveal-activity-image 1200ms ease 520ms both;
}

.detail-activity-image,
.detail-image-fallback {
  width: min(100%, 460px);
  aspect-ratio: 1 / 1;
  border-radius: 32px;
  object-fit: cover;
  object-position: center;
  box-shadow:
    0 28px 70px color-mix(in srgb, var(--violet) 20%, transparent),
    inset 0 1px 0 var(--surface-inset-highlight);
}

.detail-image-fallback {
  display: grid;
  place-items: center;
}

.detail-visual-copy {
  display: grid;
  gap: 12px;
  justify-items: start;
  animation: reveal-activity-copy 980ms ease 760ms both;
}

.detail-visual h1 { 
  margin: 0;
  color: var(--foreground);
  font-size: clamp(2.4rem, 5vw, 4.6rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;
}

.detail-visual p {
  max-width: 44ch;
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.7;
}

@keyframes dock-icon {
  from {
    opacity: 0;
    transform: translate(var(--dock-start-x, 42px), var(--dock-start-y, 72px)) scale(1.42);
  }

  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes reveal-activity-image {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes reveal-activity-copy {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-content {
  position: relative;
  display: grid;
  gap: 24px;
  align-content: start;
  min-width: 0;
  padding: clamp(34px, 4.5vw, 74px);
  background: color-mix(in srgb, var(--surface-strong) 94%, transparent);
  backdrop-filter: blur(14px);
}

.detail-actions {
  position: absolute;
  top: clamp(18px, 3vw, 30px);
  right: clamp(18px, 3vw, 30px);
  z-index: 8;
  display: flex;
  justify-content: flex-end;
}

.close-detail-button {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 999px;
  background: var(--card);
  color: var(--foreground);
  box-shadow: var(--shadow-panel);
  pointer-events: auto;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  gap: 12px;
  padding-right: 72px;
}

.info-grid div,
.steps-list li,
.benefit-box,
.ai-consult-strip {
  border: 1px solid var(--surface-stroke-strong);
  background: var(--card);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(14px);
}

.info-grid div {
  display: grid;
  align-content: center;
  min-height: 128px;
  padding: 20px 12px;
  border-radius: 22px;
  text-align: center;
}

.info-grid span {
  color: var(--muted-foreground);
  font-size: clamp(0.64rem, 0.72vw, 0.72rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.info-grid strong {
  margin-top: 8px;
  color: var(--foreground);
  overflow-wrap: anywhere;
  line-height: 1.18;
  font-size: clamp(0.88rem, 0.95vw, 1.05rem);
  font-weight: 850;
}

.text-section h2 {
  margin: 0 0 12px;
  color: var(--foreground);
  font-size: clamp(1.35rem, 2vw, 1.6rem);
  font-weight: 850;
}

.text-section {
  min-width: 0;
}

.text-section p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.75;
  overflow-wrap: anywhere;
}

.steps-list {
  display: grid;
  gap: 12px;
  max-height: 280px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
}

.steps-list li {
  border-radius: 20px;
  padding: 14px 16px;
  color: var(--card-foreground);
}

.benefit-box {
  border-radius: 24px;
  padding: 18px 20px;
}

.benefit-box strong {
  color: var(--violet-strong);
}

.benefit-box p {
  margin: 6px 0 0;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.ai-consult-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-radius: 24px;
  padding: 14px 16px;
}

.ai-consult-copy {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: var(--foreground);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.actions > .primary-button,
.actions > .list-button,
.actions > .base-button {
  min-height: 54px;
  border-radius: var(--radius-control);
  padding: 12px 22px;
  font-size: 0.98rem;
  font-weight: 850;
  box-shadow: var(--shadow-panel);
}

.list-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
  padding: 12px 20px;
  background: var(--card-solid);
  color: var(--card-foreground);
  font-weight: 900;
  box-shadow: var(--shadow-panel);
}

.list-button.saved {
  border-color: var(--border-focus);
  background: linear-gradient(135deg, color-mix(in srgb, var(--violet-soft) 78%, var(--card-solid) 22%), color-mix(in srgb, var(--violet) 24%, var(--card) 76%));
  color: var(--violet-strong);
}

.empty-detail {
  width: min(100%, 900px);
  margin: auto;
  padding: 40px;
  border-radius: 32px;
  background: var(--card);
}

.reject-modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: color-mix(in srgb, var(--background) 38%, transparent);
  backdrop-filter: blur(12px) saturate(1.08);
  z-index: 1200;
}

.reject-dialog {
  position: relative;
  width: min(100%, 460px);
  max-width: none;
  pointer-events: auto;
  padding: 22px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 28px;
  background: var(--surface-contrast);
  color: var(--foreground);
  box-shadow: 0 30px 80px color-mix(in srgb, var(--violet) 24%, transparent);
}

.reject-dialog h3 {
  margin: 0 0 8px;
  font-size: 1.4rem;
}

.reject-dialog p {
  margin: 0 0 18px;
  color: var(--muted-foreground);
}

.reject-close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  font-size: 1.5rem;
}

.reject-options {
  display: grid;
  gap: 10px;
}

.reject-option {
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 12px 14px;
  background: var(--card);
  color: var(--foreground);
  text-align: left;
}

.reject-option.selected {
  border-color: var(--violet-strong);
  background: color-mix(in srgb, var(--violet-soft) 76%, var(--card) 24%);
}

.reject-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

@media (max-width: 1100px) {
  .detail-card {
    grid-template-columns: 1fr;
  }

  .detail-visual {
    min-height: 78vh;
  }

  .detail-actions {
    top: clamp(18px, 4vw, 32px);
    right: clamp(18px, 4vw, 32px);
  }

  .info-grid {
    padding-right: 0;
  }
}

@media (max-width: 1280px) and (min-width: 1101px) {
  .detail-content {
    padding-inline: clamp(28px, 3vw, 46px);
  }

  .info-grid {
    padding-right: 58px;
  }
}

@media (max-width: 760px) {
  .detail-visual,
  .detail-content {
    padding: 24px;
  }

  .detail-activity-image,
  .detail-image-fallback {
    width: min(100%, 360px);
  }

  .detail-icon {
    width: 88px;
    height: 88px;
    border-radius: 28px;
  }

  .detail-icon svg {
    width: 58px;
    height: 58px;
  }

  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ai-consult-strip,
  .reject-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .ai-consult-strip .secondary-button,
  .reject-actions > * {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .detail-icon-docked,
  .detail-hero-media,
  .detail-visual-copy {
    animation: none;
  }
}

.finish-dialog {
  width: min(100%, 520px);
}

.finish-question {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}

.finish-label {
  display: block;
  color: var(--foreground);
  font-weight: 800;
  font-size: 0.98rem;
}

.star-row {
  display: inline-flex;
  gap: 8px;
}

.star-button {
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

.star-button:hover,
.star-button:focus-visible {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--violet) 42%, var(--border));
  outline: none;
}

.star-button.active {
  background: color-mix(in srgb, var(--violet-soft) 70%, var(--card) 30%);
  border-color: var(--violet-strong);
  color: var(--violet-strong);
}

.star-button.mood.active {
  background: color-mix(in srgb, var(--rose-soft) 70%, var(--card) 30%);
  border-color: var(--rose);
  color: var(--rose);
}

.finish-textarea {
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

.finish-textarea:focus-visible {
  outline: none;
  border-color: var(--violet-strong);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--violet) 22%, transparent);
}

.primary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.finish-button {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--emerald) 84%, var(--surface-contrast)),
    var(--emerald)
  );
}

@media (prefers-reduced-motion: reduce) {
  .star-button {
    transition: none;
  }
  .star-button:hover,
  .star-button:focus-visible {
    transform: none;
  }
}
</style>
