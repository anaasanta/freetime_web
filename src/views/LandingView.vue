<script setup>
import AppPanel from '@/components/ui/AppPanel.vue'
import BorderGlow from '@/components/ui/BorderGlow.vue'
import RotatingText from '@/components/ui/RotatingText/RotatingText.vue'
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingPreviewCard from '@/components/landing/LandingPreviewCard.vue'
import LandingCommentsMarquee from '@/components/landing/LandingCommentsMarquee.vue'
import LandingContactSection from '@/components/landing/LandingContactSection.vue'
import { landingCopy } from '@/data/uiText'
</script>

<template>
  <main class="app-page landing-page">
    <!-- Navbar reutilizable -->
    <div class="page-container landing-nav-wrap">
      <LandingNavbar
        :brand="landingCopy.nav.brand"
        :tagline="landingCopy.nav.tagline"
        :links="landingCopy.nav.links"
        :primary-action="landingCopy.nav.primaryAction"
        :primary-route="landingCopy.nav.primaryRoute"
        :secondary-action="landingCopy.nav.secondaryAction"
        :secondary-route="landingCopy.nav.secondaryRoute"
        :tooltips="landingCopy.nav.tooltips"
      />
    </div>

    <!-- Hero principal -->
    <section class="landing-hero">
      <div class="page-container landing-shell">
        <div class="landing-copy">
          <div class="landing-chip-row">
            <span v-for="chip in landingCopy.hero.chips" :key="chip" class="landing-chip">
              {{ chip }}
            </span>
          </div>
          <h1 class="landing-title">{{ landingCopy.hero.titleFull }}</h1>

          <h2 class="landing-rotating-line">
            <span class="landing-rotating-prefix">{{ landingCopy.hero.rotatingPrefix }}</span>
            <RotatingText
              :texts="landingCopy.hero.rotatingWords"
              :rotation-interval="2300"
              :stagger-duration="0.02"
              split-by="characters"
              main-class-name="landing-rotating-shell"
              split-level-class-name="landing-rotating-word-group"
              element-level-class-name="landing-rotating-word"
            />
          </h2>

          <p class="landing-description">
            {{ landingCopy.hero.description }}
          </p>

          <!-- Buttons removed: navbar contains primary actions -->

          <div class="landing-stats">
            <BorderGlow
              v-for="stat in landingCopy.hero.stats"
              :key="stat.label"
              class-name="landing-stat landing-stat--highlight"
              background-color="rgba(255, 255, 255, 0.94)"
              glow-color="252 72 86"
              :colors="['#a78bfa', '#7dd3fc', '#6ee7b7']"
            >
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </BorderGlow>
          </div>
        </div>

        <!-- Vista previa compacta de la app -->
        <LandingPreviewCard
          :eyebrow="landingCopy.preview.eyebrow"
          :title="landingCopy.preview.title"
          :subtitle="landingCopy.preview.subtitle"
          :search-label="landingCopy.preview.searchLabel"
          :test-label="landingCopy.preview.testLabel"
          :cards="landingCopy.preview.cards"
          :recommendations="landingCopy.preview.recommendations"
          :summary-label="landingCopy.preview.summaryLabel"
          :summary-text="landingCopy.preview.summaryText"
          :summary-button="landingCopy.preview.summaryButton"
        />
      </div>
    </section>

    <!-- Beneficios en bloques pequeños -->
    <section id="features" class="landing-features">
      <div class="page-container">
        <div class="landing-section-header">
          <span class="landing-eyebrow">{{ landingCopy.featuresHeader.eyebrow }}</span>
          <h2 class="section-title">{{ landingCopy.featuresHeader.title }}</h2>
          <p class="page-description">
            {{ landingCopy.featuresHeader.subtitle }}
          </p>
        </div>

        <div class="feature-grid">
          <AppPanel
            v-for="feature in landingCopy.features"
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

    <!-- Cinta de comentarios -->
    <section id="comments" class="landing-comments">
      <div class="page-container">
        <LandingCommentsMarquee
          :aria-label="landingCopy.commentsHeader.ariaLabel"
          :title="landingCopy.commentsHeader.title"
          :comments="landingCopy.comments"
        />
      </div>
    </section>

    <!-- Contacte -->
    <section id="contact" class="landing-cta">
      <div class="page-container">
        <div class="landing-section-header landing-contact-header">
          <span class="landing-eyebrow">{{ landingCopy.closing.eyebrow }}</span>
          <h2 class="section-title">{{ landingCopy.closing.title }}</h2>
          <p class="page-description">
            {{ landingCopy.contact.subtitle }}
          </p>
        </div>

        <LandingContactSection :copy="landingCopy.contact" />
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
  grid-template-columns: minmax(0, 0.95fr) minmax(520px, 0.95fr);
  gap: 42px;
  align-items: stretch;
}

.landing-copy {
  display: grid;
  gap: 26px;
  max-width: 820px;
  min-height: 100%;
  padding-top: 18px;
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
  font-size: clamp(3.4rem, 8vw, 6.4rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  -webkit-background-clip: text;
  background-clip: text;
}

.landing-description {
  margin: 0;
  max-width: 58ch;
  color: var(--muted-foreground);
  font-size: 1.1rem;
  line-height: 1.75;
}

.landing-rotating-line {
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  margin: -10px 0 0;
  color: var(--foreground-soft);
  font-size: clamp(3.2rem, 7vw, 6.2rem);
  line-height: 1.4;
  font-weight: 800;
  letter-spacing: -0.045em;
}

.landing-rotating-prefix {
  color: var(--foreground-soft);
}

.landing-rotating-line :deep(.landing-rotating-shell) {
  display: inline-flex;
  align-items: baseline;
  min-width: 7.6ch;
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

.landing-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: auto;
  padding-top: 28px;
}

.landing-stat {
  display: grid;
  gap: 4px;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--surface-contrast) 78%, transparent);
  border-radius: 22px;
  background: color-mix(in srgb, var(--surface-contrast) 72%, transparent);
  box-shadow: 0 12px 26px rgba(90, 110, 140, 0.07);
}

.landing-stat--highlight {
  min-height: 100%;
  padding: 24px 22px;
  border-radius: 26px;
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,243,255,0.95));
  box-shadow: 0 20px 50px rgba(109, 40, 217, 0.08), 0 6px 18px rgba(125,211,252,0.06);
  border: 1px solid rgba(139,92,246,0.12);
  transform: translateY(-2px);
}

.landing-stat--highlight strong {
  color: var(--violet-strong);
  font-size: 1.3rem;
}

.landing-stat strong {
  font-size: 1.18rem;
}

.landing-stat span {
  color: var(--muted-foreground);
  line-height: 1.5;
}

.landing-visual {
  display: grid;
  align-items: start;
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

/* When the hero content is very large (huge headings), allow the hero
   section to scroll instead of overlapping following sections. This
   keeps the small cards below in place while the hero can be scrolled. */
.landing-hero {
  min-height: 64vh;
  overflow-y: auto;
}

@media (max-width: 1100px) {
  .landing-shell {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 760px) {
  .landing-chip-row {
    gap: 8px;
  }

  .landing-chip {
    font-size: 0.84rem;
  }

  .landing-stats,
  .feature-grid {
    grid-template-columns: 1fr;
  }

}
</style>
