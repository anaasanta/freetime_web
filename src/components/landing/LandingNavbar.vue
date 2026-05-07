<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import AppBrand from '@/components/layout/AppBrand.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import LandingSectionLink from '@/components/landing/LandingSectionLink.vue'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
import { themeCopy } from '@/data/uiText'

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

const activeTooltip = ref('')
const tooltipStyle = ref({})

function resolveAnchorPosition(event) {
  if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
    return { x: event.clientX, y: event.clientY }
  }

  const target = event.currentTarget

  if (!target || typeof target.getBoundingClientRect !== 'function') {
    return { x: window.innerWidth / 2, y: 80 }
  }

  const rect = target.getBoundingClientRect()

  return {
    x: rect.left + rect.width / 2,
    y: rect.top,
  }
}

function updateTooltipPosition(event, text) {
  if (!text) return

  const tooltipWidth = 220
  const margin = 16
  const viewportWidth = window.innerWidth
  const anchor = resolveAnchorPosition(event)

  let left = anchor.x - tooltipWidth / 2

  if (left < margin) {
    left = margin
  }

  if (left + tooltipWidth > viewportWidth - margin) {
    left = viewportWidth - tooltipWidth - margin
  }

  const top = Math.max(anchor.y - 62, margin)

  activeTooltip.value = text
  tooltipStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    '--tooltip-pointer-x': `${anchor.x - left}px`,
  }
}

function openTooltip(event, text) {
  updateTooltipPosition(event, text)
}

function closeTooltip() {
  activeTooltip.value = ''
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
      <AppBrand :brand="brand" :tagline="tagline" :to="{ name: 'landing' }" />
    </template>

    <template #center>
      <nav class="landing-links" aria-label="Navegacion principal">
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
        <ThemeToggle :labels="themeCopy.toggle" />

        <div class="landing-tooltip-wrap">
          <RouterLink
            class="secondary-button landing-navbar-button"
            :to="secondaryRoute"
            @mouseenter="openTooltip($event, tooltips.login)"
            @mousemove="updateTooltipPosition($event, tooltips.login)"
            @mouseleave="closeTooltip"
            @focus="openTooltip($event, tooltips.login)"
            @blur="closeTooltip"
          >
            {{ secondaryAction }}
          </RouterLink>
        </div>

        <div class="landing-tooltip-wrap">
          <RouterLink
            class="primary-button landing-navbar-button"
            :to="primaryRoute"
            @mouseenter="openTooltip($event, tooltips.register)"
            @mousemove="updateTooltipPosition($event, tooltips.register)"
            @mouseleave="closeTooltip"
            @focus="openTooltip($event, tooltips.register)"
            @blur="closeTooltip"
          >
            {{ primaryAction }}
          </RouterLink>
        </div>
      </div>
    </template>

    <span
      v-if="activeTooltip"
      class="landing-tooltip-bubble landing-tooltip-bubble--floating"
      :style="tooltipStyle"
    >
      {{ activeTooltip }}
    </span>
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
}

.landing-navbar-button {
  min-height: 42px;
  padding-inline: 16px;
}

.landing-tooltip-bubble {
  position: absolute;
  width: 220px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--violet-strong) 18%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, white);
  color: var(--foreground);
  font-size: 0.82rem;
  line-height: 1.45;
  text-align: center;
  box-shadow: 0 12px 28px rgba(30, 41, 59, 0.1);
  pointer-events: none;
  z-index: 6;
}

.landing-tooltip-bubble--floating {
  position: fixed;
}

.landing-tooltip-bubble--floating::after {
  content: '';
  position: absolute;
  left: clamp(18px, var(--tooltip-pointer-x), calc(100% - 18px));
  top: calc(100% - 1px);
  width: 12px;
  height: 12px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, white);
  border-left: 1px solid color-mix(in srgb, var(--violet-strong) 18%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--violet-strong) 18%, transparent);
  transform: translateX(-50%) rotate(-45deg);
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
