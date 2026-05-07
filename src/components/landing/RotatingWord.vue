<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  words: {
    type: Array,
    default: () => [],
  },
  intervalMs: {
    type: Number,
    default: 2200,
  },
})

const activeIndex = ref(0)

const activeWord = computed(() => props.words[activeIndex.value] || '')

let intervalId = null

onMounted(() => {
  if (props.words.length < 2) return

  intervalId = window.setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % props.words.length
  }, props.intervalMs)
})

onBeforeUnmount(() => {
  if (intervalId) {
    window.clearInterval(intervalId)
  }
})
</script>

<template>
  <span class="rotating-word-shell">
    <Transition name="word-fade" mode="out-in">
      <span :key="activeWord" class="rotating-word">{{ activeWord }}</span>
    </Transition>
  </span>
</template>

<style scoped>
.rotating-word-shell {
  display: inline-grid;
  min-width: 6ch;
}

.rotating-word {
  color: var(--violet-strong);
}

.word-fade-enter-active,
.word-fade-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}

.word-fade-enter-from,
.word-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
