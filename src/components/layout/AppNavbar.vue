<script setup>
defineProps({
  sticky: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <header class="app-navbar surface navbar navbar-expand-lg" :class="{ 'app-navbar--sticky': sticky }">
    <div class="app-navbar__start">
      <slot name="start" />
    </div>

    <div class="app-navbar__center">
      <slot name="center" />
    </div>

    <div class="app-navbar__end">
      <slot name="end" />
    </div>
  </header>
</template>

<style scoped>
.app-navbar {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  margin: 0 auto 20px;
  padding: 10px;
  backdrop-filter: blur(20px);
}

.app-navbar--sticky {
  position: sticky;
  top: 16px;
  z-index: 20;
}

.app-navbar__start,
.app-navbar__center,
.app-navbar__end {
  min-width: 0;
}

.app-navbar__center {
  display: flex;
  justify-content: center;
  width: 100%;
}

.app-navbar__end {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 920px) {
  .app-navbar {
    grid-template-columns: 1fr;
  }

  .app-navbar__center,
  .app-navbar__end {
    justify-content: stretch;
  }
}
</style>
