<template>
  <div class="gradient-card" :class="containerClass">
    <div class="gradient-blur"></div>
    <div class="gradient-stroke"></div>
    <div class="gradient-content" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  contentClass: {
    type: String,
    default: '',
  },
  containerClass: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.gradient-card {
  position: relative;
  width: 100%;
  height: 100%;
}

.gradient-blur,
.gradient-stroke {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(circle at 20% 20%, rgba(168, 230, 255, 0.9), transparent 35%),
    radial-gradient(circle at 80% 25%, rgba(196, 181, 253, 0.85), transparent 35%),
    radial-gradient(circle at 70% 80%, rgba(220, 240, 255, 0.9), transparent 35%),
    radial-gradient(circle at 25% 75%, rgba(209, 250, 229, 0.75), transparent 35%),
    rgba(255, 255, 255, 0.72);
  background-size: 220% 220%;
  animation: gradient-shift 10s ease-in-out infinite alternate;
}

.gradient-blur {
  filter: blur(18px);
  opacity: 0.55;
  transform: scale(1.04);
}

.gradient-stroke {
  border: 1px solid rgba(170, 190, 255, 0.5);
}

.gradient-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px);
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>