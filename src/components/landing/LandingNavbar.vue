<script setup>
import { RouterLink } from 'vue-router'

import AppBrand from '@/components/layout/AppBrand.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import LandingSectionLink from '@/components/landing/LandingSectionLink.vue'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'

const onSectionLinkClick = (event, href) => {
  if (!href || !href.startsWith('#')) {
    return
  }

  const section = document.querySelector(href)
  if (!section) {
    return
  }

  event.preventDefault()
  section.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const nextUrl = `${window.location.pathname}${window.location.search}${href}`
  window.history.replaceState(null, '', nextUrl)
}

defineProps({
  brand: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    default: '',
  },
  brandRoute: {
    type: [String, Object],
    default: '/',
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  links: {
    type: Array,
    default: () => [],
  },
  primaryAction: {
    type: String,
    required: true,
  },
  primaryRoute: {
    type: Object,
    required: true,
  },
  secondaryAction: {
    type: String,
    required: true,
  },
  secondaryRoute: {
    type: Object,
    required: true,
  },
  tooltips: {
    type: Object,
    default: () => ({
      login: '',
      register: '',
    }),
  },
})
</script>

<template>
  <AppNavbar class="landing-navbar">
    <template #start>
      <AppBrand :brand="brand" :tagline="tagline" :to="brandRoute" />
    </template>

    <template #center>
      <nav class="landing-links" :aria-label="ariaLabel">
        <LandingSectionLink
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          :label="link.label"
          @navigate="onSectionLinkClick($event, link.href)"
        />
      </nav>
    </template>

    <template #end>
      <div class="landing-navbar-actions">
        <ThemeToggle />

        <div class="landing-tooltip-wrap">
          <RouterLink
            class="secondary-button landing-navbar-button"
            :to="secondaryRoute"
            aria-describedby="landing-login-tooltip"
          >
            {{ secondaryAction }}
          </RouterLink>

          <span id="landing-login-tooltip" class="landing-tooltip-bubble" role="tooltip">
            {{ tooltips.login }}
          </span>
        </div>

        <div class="landing-tooltip-wrap">
          <RouterLink
            class="primary-button landing-navbar-button"
            :to="primaryRoute"
            aria-describedby="landing-register-tooltip"
          >
            {{ primaryAction }}
          </RouterLink>

          <span id="landing-register-tooltip" class="landing-tooltip-bubble" role="tooltip">
            {{ tooltips.register }}
          </span>
        </div>
      </div>
    </template>
  </AppNavbar>
</template>

<style scoped>
.landing-navbar {
  margin-bottom: 20px;
}

.landing-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 0.7fr));
  align-items: center;
  gap: 10px;
  width: 100%;
}

.landing-navbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.landing-tooltip-wrap {
  position: relative;
  display: inline-flex;
  justify-content: center;
}

.landing-navbar-button {
  min-height: 42px;
  padding-inline: 16px;
}

.landing-navbar-button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--sky) 70%, white);
  outline-offset: 3px;
}

.landing-tooltip-bubble {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  width: max-content;
  max-width: min(180px, 80vw);
  padding: 8px 10px;
  border: 1px solid color-mix(in srgb, var(--violet-strong) 18%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, white);
  color: var(--foreground);
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  box-shadow: 0 12px 28px rgba(30, 41, 59, 0.1);
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(-4px);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
  z-index: 30;
}

.landing-tooltip-bubble::after {
  position: absolute;
  top: -6px;
  left: 50%;
  width: 10px;
  height: 10px;
  border-top: 1px solid color-mix(in srgb, var(--violet-strong) 18%, transparent);
  border-left: 1px solid color-mix(in srgb, var(--violet-strong) 18%, transparent);
  background: color-mix(in srgb, var(--surface-contrast) 92%, white);
  content: '';
  transform: translateX(-50%) rotate(45deg);
}

.landing-tooltip-wrap:hover .landing-tooltip-bubble,
.landing-tooltip-wrap:focus-within .landing-tooltip-bubble {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.landing-navbar .primary-button {
  background: linear-gradient(90deg, var(--violet-strong), var(--sky));
  color: white;
  border: none;
  box-shadow: var(--shadow-glow);
}

.landing-navbar .secondary-button {
  background: transparent;
  border: 1px solid var(--surface-stroke-strong);
  color: var(--foreground);
}

@media (max-width: 920px) {
  .landing-links {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

@media (max-width: 640px) {
  .landing-navbar-actions {
    width: 100%;
    flex-direction: column;
  }

  .landing-tooltip-wrap {
    width: 100%;
  }

  .landing-navbar-button {
    width: 100%;
  }
}
</style>
