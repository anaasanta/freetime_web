<script setup>
import { computed } from 'vue'
import AppPanel from '@/components/ui/AppPanel.vue'
import RotatingText from '@/components/ui/RotatingText/RotatingText.vue'
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingCommentsMarquee from '@/components/landing/LandingCommentsMarquee.vue'
import LandingContactSection from '@/components/landing/LandingContactSection.vue'
import HeroLogo from '@/components/landing/Imagen2.png'
import { getLandingCopy } from '@/data/landingCopyI18n'
import { useI18n } from '@/stores/i18n'

const { currentLanguage } = useI18n()
const displayCopy = computed(() => getLandingCopy(currentLanguage.value))
</script>

<template>
  <main class="app-page landing-page">
    <div class="page-container landing-nav-wrap">
      <LandingNavbar
        :brand="displayCopy.nav.brand"
        :tagline="displayCopy.nav.tagline"
        :brand-route="displayCopy.nav.brandRoute"
        :aria-label="displayCopy.nav.ariaLabel"
        :links="displayCopy.nav.links"
        :primary-action="displayCopy.nav.primaryAction"
        :primary-route="displayCopy.nav.primaryRoute"
        :secondary-action="displayCopy.nav.secondaryAction"
        :secondary-route="displayCopy.nav.secondaryRoute"
        :tooltips="displayCopy.nav.tooltips"
      />
    </div>

    <section class="landing-hero">
      <div class="page-container landing-shell">
        <div class="landing-copy">
          <div class="landing-chip-row">
            <span v-for="chip in displayCopy.hero.chips" :key="chip" class="landing-chip">
              {{ chip }}
            </span>
          </div>
          <h1 class="landing-title">{{ displayCopy.hero.titleFull }}</h1>

          <h2 class="landing-rotating-line">
            <span class="landing-rotating-prefix">{{ displayCopy.hero.rotatingPrefix }}</span>
            <RotatingText
              :texts="displayCopy.hero.rotatingWords"
              :rotation-interval="displayCopy.hero.rotatingConfig.interval"
              :stagger-duration="displayCopy.hero.rotatingConfig.staggerDuration"
              :split-by="displayCopy.hero.rotatingConfig.splitBy"
              :main-class-name="displayCopy.hero.rotatingConfig.mainClassName"
              :split-level-class-name="displayCopy.hero.rotatingConfig.splitLevelClassName"
              :element-level-class-name="displayCopy.hero.rotatingConfig.elementLevelClassName"
            />
          </h2>

          <div class="landing-description" :aria-label="displayCopy.accessibility.heroDescriptionLabel">
            <p>{{ displayCopy.hero.description }}</p>
            <span class="landing-description-note">{{ displayCopy.hero.descriptionNote }}</span>
          </div>
        </div>

        <div class="landing-hero-art" aria-hidden="true">
          <img :src="HeroLogo" alt="" class="landing-hero-logo" />
        </div>
      </div>
    </section>

    <section :id="displayCopy.sections.features" class="landing-features">
      <div class="page-container">
        <div class="landing-section-header">
          <span class="landing-eyebrow">{{ displayCopy.featuresHeader.eyebrow }}</span>
          <h2 class="section-title">{{ displayCopy.featuresHeader.title }}</h2>
          <p class="page-description">
            {{ displayCopy.featuresHeader.subtitle }}
          </p>
        </div>

        <div class="feature-grid">
          <AppPanel
            v-for="feature in displayCopy.features"
            :key="feature.title"
            as="article"
            panel-class="feature-panel"
          >
            <strong>{{ feature.title }}</strong>
            <p>{{ feature.text }}</p>
          </AppPanel>
        </div>
      </div>
    </section>

    <section :id="displayCopy.sections.comments" class="landing-comments">
      <div class="page-container">
        <LandingCommentsMarquee
          :aria-label="displayCopy.commentsHeader.ariaLabel"
          :title="displayCopy.commentsHeader.title"
          :previous-label="displayCopy.commentsHeader.previousLabel"
          :next-label="displayCopy.commentsHeader.nextLabel"
          :speed-seconds="displayCopy.commentsHeader.speedSeconds"
          :comments="displayCopy.comments"
        />
      </div>
    </section>

    <section :id="displayCopy.sections.contact" class="landing-cta">
      <div class="page-container">
        <div class="landing-section-header landing-contact-header">
          <span class="landing-eyebrow">{{ displayCopy.closing.eyebrow }}</span>
          <h2 class="section-title">{{ displayCopy.closing.title }}</h2>
          <p class="page-description">
            {{ displayCopy.contact.subtitle }}
          </p>
        </div>

        <LandingContactSection :copy="displayCopy.contact" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  overflow-x: clip;
}

.landing-nav-wrap {
  padding-top: 0;
}

.landing-hero,
.landing-features,
.landing-comments,
.landing-cta {
  padding: 24px 0;
  scroll-margin-top: 110px;
}

.landing-shell {
  display: grid;
  grid-template-columns: minmax(720px, 1fr) minmax(420px, 0.9fr);
  gap: clamp(28px, 4vw, 72px);
  align-items: center;
}

.landing-copy {
  display: grid;
  gap: 24px;
  min-width: 0;
  max-width: 990px;
  padding: 46px 0 34px;
}

.landing-eyebrow {
  color: var(--violet-strong);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.landing-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.landing-chip {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--surface-contrast) 78%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 80%, transparent);
  color: var(--foreground);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 10px 24px rgba(90, 110, 140, 0.06);
}

.landing-title {
  margin: 0;
  background: linear-gradient(90deg, var(--foreground) 0%, var(--violet-strong) 45%, var(--sky) 100%);
  color: transparent;
  font-size: clamp(3.2rem, 7.2vw, 6.2rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  -webkit-background-clip: text;
  background-clip: text;
}

.landing-description {
  position: relative;
  display: grid;
  gap: 14px;
  max-width: 104ch;
  margin-top: 12px;
  margin-left: clamp(10px, 1.1vw, 54px);
  padding: 0 0 0 28px;
  color: color-mix(in srgb, var(--foreground) 72%, var(--muted-foreground));
}

.landing-description::before {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  width: 5px;
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--violet-strong) 82%, white),
    color-mix(in srgb, var(--sky) 72%, white),
    color-mix(in srgb, var(--emerald) 64%, white)
  );
  content: '';
}

.landing-description p {
  margin: 0;
  color: color-mix(in srgb, var(--foreground) 82%, var(--muted-foreground));
  font-size: clamp(1.08rem, 1.28vw, 1.22rem);
  line-height: 1.55;
}

.landing-description-note {
  color: color-mix(in srgb, var(--muted-foreground) 88%, var(--foreground));
  font-size: clamp(1rem, 1.35vw, 1.12rem);
  font-weight: 650;
  line-height: 1.55;
}

.landing-rotating-line {
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  margin: -10px 0 0;
  color: var(--foreground-soft);
  font-size: clamp(3.2rem, 7vw, 6.2rem);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.045em;
}

.landing-rotating-prefix {
  color: var(--foreground-soft);
}

.landing-rotating-line :deep(.landing-rotating-shell) {
  display: inline-flex;
  align-items: baseline;
  flex: 0 0 auto;
  min-width: 9.6ch;
  width: max-content;
  white-space: nowrap;
}

.landing-rotating-line :deep(.landing-rotating-word-group) {
  display: inline-flex;
}

.landing-rotating-line :deep(.landing-rotating-word) {
  background: linear-gradient(
    110deg,
    color-mix(in srgb, var(--violet-strong) 78%, white) 0%,
    color-mix(in srgb, var(--violet) 72%, white) 34%,
    color-mix(in srgb, var(--sky) 68%, white) 70%,
    color-mix(in srgb, var(--emerald) 58%, white) 100%
  );
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
}

@media (max-width: 760px) {
  .landing-rotating-line {
    gap: 8px;
    margin-top: -6px;
  }
}

.landing-hero-art {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 420px;
}

.landing-hero-logo {
  width: min(100%, 620px);
  max-height: 62vh;
  border-radius: 50%;
  image-rendering: auto;
  filter: none;
  object-fit: contain;
}

.landing-section-header {
  display: grid;
  gap: 10px;
  max-width: 720px;
  margin-bottom: 18px;
}

.landing-section-header .section-title {
  color: var(--violet-strong);
}

.landing-contact-header {
  max-width: 720px;
  margin-bottom: 16px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 18px;
}

.feature-panel {
  display: grid;
  align-content: start;
  gap: 12px;
  min-height: 100%;
  height: 100%;
  padding: 22px;
}

.feature-panel p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.65;
}

.landing-comments {
  padding-top: 68px;
  padding-bottom: 20px;
}

.landing-cta {
  padding-top: 28px;
}

.landing-hero {
  min-height: 64vh;
  overflow-y: auto;
}

@media (max-width: 1100px) {
  .landing-shell {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .landing-description {
    max-width: 76ch;
    margin-left: 0;
  }

  .landing-hero-art {
    justify-content: flex-start;
    min-height: auto;
  }

  .landing-hero-logo {
    width: min(72vw, 420px);
  }
}

@media (max-width: 760px) {
  .landing-chip-row {
    gap: 8px;
  }

  .landing-chip {
    font-size: 0.84rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
