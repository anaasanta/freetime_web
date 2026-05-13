<script setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'bottom'].includes(value),
  },
  align: {
    type: String,
    default: 'center',
    validator: (value) => ['start', 'center', 'end'].includes(value),
  },
  size: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'small', 'medium', 'wide'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <span class="app-tooltip" :class="[`app-tooltip--${position}`, `app-tooltip--${align}`, `app-tooltip--${size}`]">
    <slot />
    <span v-if="label && !disabled" class="app-tooltip__bubble" role="tooltip">
      {{ label }}
    </span>
  </span>
</template>

<style scoped>
.app-tooltip {
  position: relative;
  display: inline-flex;
  justify-content: center;
}

.app-tooltip__bubble {
  position: absolute;
  width: max-content;
  max-width: min(280px, 80vw);
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow-panel);
  color: var(--foreground);
  font-size: 0.82rem;
  line-height: 1.4;
  text-align: center;
  white-space: normal;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.22s ease,
    transform 0.22s ease,
    visibility 0.22s ease;
  z-index: 500;
}

.app-tooltip__bubble::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
}

.app-tooltip:hover .app-tooltip__bubble,
.app-tooltip:focus-within .app-tooltip__bubble {
  opacity: 1;
  visibility: visible;
}

.app-tooltip--small .app-tooltip__bubble {
  max-width: min(180px, 80vw);
}

.app-tooltip--medium .app-tooltip__bubble {
  max-width: min(280px, 80vw);
}

.app-tooltip--wide .app-tooltip__bubble {
  max-width: min(360px, 86vw);
}

.app-tooltip--center .app-tooltip__bubble {
  left: 50%;
}

.app-tooltip--start .app-tooltip__bubble {
  left: 0;
}

.app-tooltip--end .app-tooltip__bubble {
  right: 0;
}

.app-tooltip--bottom .app-tooltip__bubble {
  top: calc(100% + 12px);
}

.app-tooltip--top .app-tooltip__bubble {
  bottom: calc(100% + 12px);
}

.app-tooltip--bottom.app-tooltip--center .app-tooltip__bubble {
  transform: translateX(-50%) translateY(-8px);
}

.app-tooltip--top.app-tooltip--center .app-tooltip__bubble {
  transform: translateX(-50%) translateY(8px);
}

.app-tooltip--bottom.app-tooltip--start .app-tooltip__bubble,
.app-tooltip--bottom.app-tooltip--end .app-tooltip__bubble {
  transform: translateY(-8px);
}

.app-tooltip--top.app-tooltip--start .app-tooltip__bubble,
.app-tooltip--top.app-tooltip--end .app-tooltip__bubble {
  transform: translateY(8px);
}

.app-tooltip--bottom:hover .app-tooltip__bubble,
.app-tooltip--bottom:focus-within .app-tooltip__bubble {
  transform: translateX(-50%) translateY(0);
}

.app-tooltip--bottom.app-tooltip--start:hover .app-tooltip__bubble,
.app-tooltip--bottom.app-tooltip--start:focus-within .app-tooltip__bubble,
.app-tooltip--bottom.app-tooltip--end:hover .app-tooltip__bubble,
.app-tooltip--bottom.app-tooltip--end:focus-within .app-tooltip__bubble {
  transform: translateY(0);
}

.app-tooltip--top:hover .app-tooltip__bubble,
.app-tooltip--top:focus-within .app-tooltip__bubble {
  transform: translateX(-50%) translateY(0);
}

.app-tooltip--top.app-tooltip--start:hover .app-tooltip__bubble,
.app-tooltip--top.app-tooltip--start:focus-within .app-tooltip__bubble,
.app-tooltip--top.app-tooltip--end:hover .app-tooltip__bubble,
.app-tooltip--top.app-tooltip--end:focus-within .app-tooltip__bubble {
  transform: translateY(0);
}

.app-tooltip--bottom .app-tooltip__bubble::before {
  left: 50%;
  bottom: 100%;
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--border);
  transform: translateX(-50%) translateY(50%) rotate(45deg);
}

.app-tooltip--top .app-tooltip__bubble::before {
  left: 50%;
  top: 100%;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  transform: translateX(-50%) translateY(-50%) rotate(45deg);
}

.app-tooltip--start .app-tooltip__bubble::before {
  left: 18px;
}

.app-tooltip--end .app-tooltip__bubble::before {
  left: auto;
  right: 18px;
  transform: translateY(50%) rotate(45deg);
}

.app-tooltip--top.app-tooltip--end .app-tooltip__bubble::before {
  transform: translateY(-50%) rotate(45deg);
}
</style>
