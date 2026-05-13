<script setup>
import { RouterLink } from 'vue-router'

import AppBrand from '@/components/layout/AppBrand.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import LandingSectionLink from '@/components/landing/LandingSectionLink.vue'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppTooltip from '@/components/ui/AppTooltip.vue'

const onSectionLinkClick = (event, href) => {
  if (!href || !href.startsWith('#')) {
    return
  }

  const section = document.querySelector(href) // Si el enlace es una ancla, buscamos la sección correspondiente
  if (!section) {
    return
  }

  event.preventDefault() // Prevenir el comportamiento predeterminado del enlace para evitar un salto brusco
  section.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const nextUrl = `${window.location.pathname}${window.location.search}${href}` // Actualizar la URL para reflejar la sección actual sin recargar la página
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

        <AppTooltip
          :label="tooltips.login"
          position="bottom"
          class="landing-tooltip-wrap"
        >
          <BaseButton
            :as="RouterLink"
            variant="secondary"
            class="landing-navbar-button"
            :to="secondaryRoute"
          >
            {{ secondaryAction }}
          </BaseButton>
        </AppTooltip>

        <AppTooltip
          :label="tooltips.register"
          position="bottom"
          class="landing-tooltip-wrap"
        >
          <BaseButton
            :as="RouterLink"
            class="landing-navbar-button"
            :to="primaryRoute"
          >
            {{ primaryAction }}
          </BaseButton>
        </AppTooltip>
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
