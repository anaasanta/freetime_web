<script setup>
import { computed, onBeforeUnmount, ref } from 'vue' // Para manejar el ciclo de vida y reactividad
import { ChevronLeft, ChevronRight } from 'lucide-vue-next' // Iconos para los controles del carrusel
import { useAccessibility } from '@/stores/accessibility' // Para acceder a las preferencias de accesibilidad del usuario

const props = defineProps({ // Definición de las props que el componente acepta
  ariaLabel: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  previousLabel: {
    type: String,
    default: '',
  },
  nextLabel: {
    type: String,
    default: '',
  },
  speedSeconds: {
    type: Number,
    default: 42,
  },
  comments: {
    type: Array,
    default: () => [],
  },
})


const marqueeComments = computed(() => [...props.comments, ...props.comments, ...props.comments]) // Duplicamos los comentarios para crear un efecto de carrusel continuo
const manualOffset = ref(0) // Offset manual para el desplazamiento del carrusel cuando el usuario interactúa con la rueda del ratón
const isWheelScrolling = ref(false) // Estado para indicar si el usuario está desplazándose con la rueda del ratón
const commentsRow = ref(null) 
const reducedTrack = ref(null) // Referencias a los elementos del carrusel para manipular su desplazamiento y estilo
const { reducedMotion } = useAccessibility() // Accedemos a la preferencia de reducción de movimiento del usuario para adaptar el comportamiento del carrusel
const marqueeStyle = computed(() => ({ // Estilos dinámicos para el carrusel, incluyendo la velocidad de animación y el offset manual
  '--comments-speed': `${props.speedSeconds}s`,
  '--comments-offset': `${manualOffset.value}px`,
}))

let wheelResumeTimeout = null

function normalizeOffset(offset) { // Normaliza el offset para que se mantenga dentro del ciclo de comentarios y permita un desplazamiento suave incluso cuando el usuario interactúa con la rueda del ratón
  if (!commentsRow.value || props.comments.length === 0) return offset

  const cycleWidth = commentsRow.value.scrollWidth / 3
  if (!cycleWidth) return offset

  const wrappedOffset = ((offset % cycleWidth) + cycleWidth) % cycleWidth // El módulo puede dar un resultado negativo, así que lo ajustamos para que siempre sea positivo

  return wrappedOffset === 0 ? 0 : wrappedOffset - cycleWidth // Ajustamos el offset para que se mantenga dentro del ciclo de comentarios
}

function handleWheel(event) { // Maneja el evento de la rueda del ratón para desplazar el carrusel
  if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return

  event.preventDefault()
  manualOffset.value = normalizeOffset(manualOffset.value - event.deltaX)
  isWheelScrolling.value = true

  if (wheelResumeTimeout) {
    window.clearTimeout(wheelResumeTimeout)
  }

  wheelResumeTimeout = window.setTimeout(() => {
    isWheelScrolling.value = false
  }, 700)
}

function scrollComments(direction) { // Para mover los comentarios cuando el usuario tiene los movimientos reducidos activados
  if (!reducedTrack.value) return

  reducedTrack.value.scrollBy({
    left: direction * 420,
    behavior: 'smooth',
  })
}

onBeforeUnmount(() => {
  if (wheelResumeTimeout) {
    window.clearTimeout(wheelResumeTimeout)
  }
})
</script>

<template>
  <section class="comments-marquee" :aria-label="props.ariaLabel">
    <div class="comments-marquee-header">
      <h2 v-if="props.title" class="section-title">{{ props.title }}</h2>

      <div v-if="reducedMotion && props.comments.length > 0" class="carousel-controls">
        <button
          class="carousel-button"
          type="button"
          :aria-label="props.previousLabel"
          @click="scrollComments(-1)"
        >
          <ChevronLeft :size="20" />
        </button>

        <button
          class="carousel-button"
          type="button"
          :aria-label="props.nextLabel"
          @click="scrollComments(1)"
        >
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>

    <div v-if="reducedMotion" ref="reducedTrack" class="comments-track comments-track--static">
      <div class="comments-row comments-row--static">
        <article v-for="comment in props.comments" :key="comment.author" class="comment-card surface">
          <p>{{ comment.quote }}</p>
          <strong>{{ comment.author }}</strong>
          <span>{{ comment.role }}</span>
        </article>
      </div>
    </div>

    <div v-else class="comments-track" @wheel="handleWheel">
      <div
        ref="commentsRow"
        class="comments-row"
        :class="{ 'is-wheel-scrolling': isWheelScrolling }"
        :style="marqueeStyle" 
      >
        <article 
          v-for="(comment, index) in marqueeComments"
          :key="`${comment.author}-${index}`"
          class="comment-card surface"
          :aria-hidden="index >= props.comments.length"
          :tabindex="index < props.comments.length ? 0 : -1"
        >
          <p>{{ comment.quote }}</p>
          <strong>{{ comment.author }}</strong>
          <span>{{ comment.role }}</span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.comments-marquee {
  display: grid;
  gap: 18px;
}

.comments-marquee-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.comments-marquee-header .section-title {
  color: var(--violet-strong);
}

.carousel-controls {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex: 0 0 auto;
}

.carousel-button {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-contrast) 92%, transparent);
  color: var(--foreground);
  box-shadow: 0 8px 24px var(--shadow-panel);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.carousel-button:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--violet) 38%, var(--border));
  background: color-mix(in srgb, var(--violet-soft) 42%, var(--surface-contrast));
}

.comments-track {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 32px 0;
}

.comments-track--static {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x proximity;
  scroll-behavior: smooth;
  scrollbar-width: none;
  margin-top: 4px;
}

.comments-track--static::-webkit-scrollbar {
  display: none;
}

.comments-row {
  display: flex;
  gap: 20px;
  width: max-content;
  animation: comment-marquee var(--comments-speed, 42s) linear infinite;
}

.comments-row--static {
  animation: none;
  padding-inline: 16px;
}

.comments-track:focus-within .comments-row,
.comments-row.is-wheel-scrolling {
  animation-play-state: paused;
}

.comment-card {
  position: relative;
  display: grid;
  gap: 10px;
  width: min(420px, 85vw);
  min-height: 240px;
  padding: 24px;
}

.comment-card p {
  margin: 0;
  color: var(--foreground);
  font-size: 1rem;
  line-height: 1.65;
}

.comment-card strong {
  color: var(--foreground);
}

.comment-card span {
  color: var(--muted-foreground);
}

.comment-card:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--sky) 70%, white);
  outline-offset: 3px;
}

.comment-tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  transform: translateX(-50%) translateY(4px);
  width: min(320px, 68vw);
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--violet-strong) 18%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface-contrast) 90%, white);
  color: var(--foreground);
  font-size: 0.84rem;
  line-height: 1.45;
  box-shadow: 0 14px 26px var(--shadow-panel);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 4;
}

.comment-card:hover .comment-tooltip,
.comment-card:focus-visible .comment-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 760px) {
  .comments-marquee-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .carousel-controls {
    align-self: flex-end;
  }

  .carousel-button {
    width: 44px;
    height: 44px;
  }

  .comment-card {
    min-height: 200px;
    width: min(340px, 85vw);
  }
}

@keyframes comment-marquee {
  from {
    transform: translateX(var(--comments-offset, 0px));
  }
  to {
    transform: translateX(calc(-33.3333% + var(--comments-offset, 0px)));
  }
}
</style>
