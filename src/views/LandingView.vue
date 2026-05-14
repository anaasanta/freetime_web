<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppContainer from '@/components/ui/AppContainer.vue'
import AppPanel from '@/components/ui/AppPanel.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
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
    <AppContainer class="landing-nav-wrap">
      <LandingNavbar
        :brand="displayCopy.nav.brand"
        :tagline="displayCopy.nav.tagline"
        :brand-route="displayCopy.nav.brandRoute"
        :aria-label="displayCopy.nav.ariaLabel"
        :links="displayCopy.nav.links"
        :discover-action="displayCopy.nav.discoverAction"
        :discover-route="displayCopy.nav.discoverRoute"
        :primary-action="displayCopy.nav.primaryAction"
        :primary-route="displayCopy.nav.primaryRoute"
        :secondary-action="displayCopy.nav.secondaryAction"
        :secondary-route="displayCopy.nav.secondaryRoute"
        :tooltips="displayCopy.nav.tooltips"
      />
    </AppContainer>

    <section class="landing-hero">
      <AppContainer class="landing-shell">
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

        <div class="landing-hero-art">
          <RouterLink class="landing-hero-orb" :to="displayCopy.nav.discoverRoute" :aria-label="displayCopy.hero.discoverCard">
            <span class="landing-hero-orb-face landing-hero-orb-front">
              <img :src="HeroLogo" alt="" class="landing-hero-logo" />
              <span class="landing-flip-hint">{{ displayCopy.hero.flipHint }}</span>
            </span>
            <span class="landing-hero-orb-face landing-hero-orb-back">
              <span class="orb-glow"></span>
              <span class="orb-ring ring-one"></span>
              <span class="orb-ring ring-two"></span>
              <span class="orb-ring ring-three"></span>
              <span class="orb-spark spark-one"></span>
              <span class="orb-spark spark-two"></span>
              <span class="orb-spark spark-three"></span>
              <strong>{{ displayCopy.hero.discoverCard }}</strong>
            </span>
          </RouterLink>
        </div>
      </AppContainer>
    </section>

    <section :id="displayCopy.sections.features" class="landing-features">
      <AppContainer>
        <SectionHeader
          :title="displayCopy.featuresHeader.title"
          :description="displayCopy.featuresHeader.subtitle"
          size="section"
          class="landing-section-header"
        >
          <template #title>
          <span class="landing-eyebrow">{{ displayCopy.featuresHeader.eyebrow }}</span>
          <span>{{ displayCopy.featuresHeader.title }}</span>
          </template>
        </SectionHeader>

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
      </AppContainer>
    </section>

    <section :id="displayCopy.sections.comments" class="landing-comments">
      <AppContainer>
        <LandingCommentsMarquee
          :aria-label="displayCopy.commentsHeader.ariaLabel"
          :title="displayCopy.commentsHeader.title"
          :previous-label="displayCopy.commentsHeader.previousLabel"
          :next-label="displayCopy.commentsHeader.nextLabel"
          :speed-seconds="displayCopy.commentsHeader.speedSeconds"
          :comments="displayCopy.comments"
        />
      </AppContainer>
    </section>

    <section :id="displayCopy.sections.contact" class="landing-cta">
      <AppContainer>
        <SectionHeader
          :title="displayCopy.closing.title"
          :description="displayCopy.contact.subtitle"
          size="section"
          class="landing-section-header landing-contact-header"
        >
          <template #title>
          <span class="landing-eyebrow">{{ displayCopy.closing.eyebrow }}</span>
          <span>{{ displayCopy.closing.title }}</span>
          </template>
        </SectionHeader>

        <LandingContactSection :copy="displayCopy.contact" />
      </AppContainer>
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
  box-shadow: 0 10px 24px var(--shadow-soft);
}

.landing-title {
  margin: 0;
  background: linear-gradient(90deg, var(--foreground) 0%, var(--violet-strong) 45%, var(--sky) 100%);
  color: transparent;
  font-size: clamp(3.2rem, 7.2vw, 6.2rem);
  font-weight: 900;
  line-height: 0.96;
  letter-spacing: 0;
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
  font-weight: 900;
  letter-spacing: 0;
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
  min-height: 360px;
}

.landing-hero-orb {
  position: relative;
  display: block;
  width: clamp(260px, 25vw, 360px);
  max-width: min(100%, 360px);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  color: var(--foreground);
  text-decoration: none;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.landing-hero-orb-face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  backface-visibility: hidden;
  transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.landing-hero-orb-front {
  transform: rotateY(0deg);
}

.landing-flip-hint {
  position: absolute;
  right: -8%;
  top: 12%;
  z-index: 2;
  padding: 12px 18px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
  color: var(--violet-strong);
  box-shadow: var(--shadow-panel);
  font-size: 1.05rem;
  font-weight: 900;
  line-height: 1;
  transform: rotate(5deg);
}

.landing-flip-hint::after {
  position: absolute;
  right: 24px;
  bottom: -6px;
  width: 12px;
  height: 12px;
  border-right: 1px solid var(--surface-stroke-strong);
  border-bottom: 1px solid var(--surface-stroke-strong);
  background: inherit;
  content: '';
  transform: rotate(45deg);
}

.landing-hero-orb-back {
  overflow: hidden;
  padding: 14%;
  background:
    radial-gradient(circle at 30% 22%, color-mix(in srgb, var(--emerald-soft) 82%, transparent), transparent 34%),
    radial-gradient(circle at 70% 78%, color-mix(in srgb, var(--violet-soft) 78%, transparent), transparent 36%),
    linear-gradient(145deg, color-mix(in srgb, var(--surface-contrast) 92%, transparent), color-mix(in srgb, var(--sky-soft) 58%, transparent));
  box-shadow:
    0 22px 70px color-mix(in srgb, var(--violet) 16%, transparent),
    inset 0 1px 0 var(--surface-inset-highlight);
  color: var(--foreground);
  transform: rotateY(180deg);
}

.landing-hero-orb-back strong {
  position: relative;
  z-index: 3;
  max-width: 8.8ch;
  color: var(--violet-strong);
  font-size: clamp(1.45rem, 2.5vw, 2.25rem);
  font-weight: 900;
  line-height: 1;
  text-align: center;
}

.orb-glow,
.orb-ring,
.orb-spark {
  position: absolute;
  pointer-events: none;
}

.orb-glow {
  inset: 18%;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--surface-contrast) 76%, transparent), transparent 70%);
  filter: blur(2px);
}

.orb-ring {
  inset: 13%;
  border: 2px solid color-mix(in srgb, var(--violet) 22%, transparent);
  border-radius: 44% 56% 52% 48%;
}

.ring-one {
  transform: rotate(18deg);
}

.ring-two {
  inset: 21%;
  border-color: color-mix(in srgb, var(--sky) 20%, transparent);
  border-radius: 56% 44% 48% 52%;
  transform: rotate(68deg);
}

.ring-three {
  inset: 7%;
  border-color: color-mix(in srgb, var(--emerald) 18%, transparent);
  border-radius: 52% 48% 42% 58%;
  transform: rotate(-34deg);
}

.orb-spark {
  width: 14px;
  height: 14px;
  color: var(--violet);
}

.orb-spark::before,
.orb-spark::after {
  position: absolute;
  inset: 6px 0;
  border-radius: 999px;
  background: currentColor;
  content: '';
}

.orb-spark::after {
  transform: rotate(90deg);
}

.orb-spark.spark-one {
  top: 24%;
  left: 22%;
}

.orb-spark.spark-two {
  right: 28%;
  bottom: 27%;
  color: var(--emerald);
  transform: scale(0.78);
}

.orb-spark.spark-three {
  left: 26%;
  bottom: 18%;
  color: var(--sky);
  transform: scale(0.62);
}

.landing-hero-orb:hover .landing-hero-orb-front,
.landing-hero-orb:focus-visible .landing-hero-orb-front {
  transform: rotateY(180deg);
}

.landing-hero-orb:hover .landing-hero-orb-back,
.landing-hero-orb:focus-visible .landing-hero-orb-back {
  transform: rotateY(360deg);
}

.landing-hero-orb:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--emerald) 70%, var(--surface-contrast));
  outline-offset: 8px;
}

.landing-hero-logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  image-rendering: auto;
  filter: none;
  object-fit: contain;
  transform: scale(1.3);
}

.landing-section-header {
  display: grid;
  gap: 10px;
  max-width: 720px;
  margin-bottom: 18px;
}

.landing-section-header :deep(.section-header__title) {
  color: var(--violet-strong);
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;
}

.landing-contact-header {
  max-width: 920px;
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

.feature-panel strong {
  color: var(--violet-strong);
  font-weight: 900;
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

  .landing-hero-orb {
    width: min(72vw, 340px);
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
