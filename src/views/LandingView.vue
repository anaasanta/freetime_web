<script setup>
import AppPanel from '@/components/ui/AppPanel.vue'
import RotatingText from '@/components/ui/RotatingText/RotatingText.vue'
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingCommentsMarquee from '@/components/landing/LandingCommentsMarquee.vue'
import LandingContactSection from '@/components/landing/LandingContactSection.vue'
import HeroLogo from '@/components/landing/Imagen2.png'
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

          <div class="landing-description" aria-label="Descripció de FreeTime">
            <p>{{ landingCopy.hero.description }}</p>
            <span class="landing-description-note">{{ landingCopy.hero.descriptionNote }}</span>
          </div>

          <!-- Buttons removed: navbar contains primary actions -->
        </div>

        <div class="landing-hero-art" aria-hidden="true">
          <img :src="HeroLogo" alt="" class="landing-hero-logo" />
        </div>
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
  grid-template-columns: minmax(760px, 1.18fr) minmax(340px, 0.62fr);
  gap: clamp(28px, 4vw, 72px);
  align-items: center;
}

.landing-copy {
  display: grid;
  gap: 24px;
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
  font-size: clamp(3.4rem, 8vw, 6.4rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  -webkit-background-clip: text;
  background-clip: text;
}

.landing-description {
  position: relative;
  display: grid;
  gap: 14px;
  max-width: 98ch;
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

.landing-hero-art {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 420px;
}

.landing-hero-logo {
  width: min(100%, 560px);
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

  .landing-description {
    max-width: 76ch;
    margin-left: 0;
  }

  .landing-hero-art {
    justify-content: flex-start;
    min-height: auto;
  }

  .landing-hero-logo {
    width: min(64vw, 360px);
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
