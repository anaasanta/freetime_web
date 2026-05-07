<script setup>
import { computed } from 'vue'

const props = defineProps({
  ariaLabel: {
    type: String,
    default: 'Comentaris destacats',
  },
  title: {
    type: String,
    default: '',
  },
  comments: {
    type: Array,
    default: () => [],
  },
})

// Triple list allows a seamless loop without empty gaps.
const marqueeComments = computed(() => [...props.comments, ...props.comments, ...props.comments])
</script>

<template>
  <section class="comments-marquee" :aria-label="props.ariaLabel">
    <div class="comments-marquee-header">
      <h2 v-if="props.title" class="section-title">{{ props.title }}</h2>
    </div>

    <div class="comments-track">
      <div class="comments-row">
        <article
          v-for="(comment, index) in marqueeComments"
          :key="`${comment.author}-${index}`"
          class="comment-card surface"
          tabindex="0"
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
  display: grid;
  gap: 8px;
  max-width: 640px;
}

.comments-marquee-header .section-title {
  color: var(--violet-strong);
}

.comments-track {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 32px 0;
}

.comments-row {
  display: flex;
  gap: 20px;
  width: max-content;
  animation: comment-marquee 60s linear infinite;
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
  box-shadow: 0 14px 26px rgba(30, 41, 59, 0.1);
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

@keyframes comment-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-33.3333%);
  }
}

@media (max-width: 760px) {
  .comment-card {
    min-height: 200px;
    width: min(340px, 85vw);
  }
}
</style>
