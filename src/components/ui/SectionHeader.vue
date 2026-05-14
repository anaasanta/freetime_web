<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  titleAs: {
    type: String,
    default: 'h2',
  },
  size: {
    type: String,
    default: 'compact',
    validator: (value) => ['compact', 'section', 'page'].includes(value),
  },
})
</script>

<template>
  <header class="section-header d-flex" :class="`section-header--${size}`">
    <div class="section-header__copy">
      <component :is="titleAs" class="section-header__title">
        <slot name="title">{{ title }}</slot>
      </component>

      <p v-if="description" class="section-header__description">
        <slot name="description">{{ description }}</slot>
      </p>
    </div>

    <div v-if="$slots.actions" class="section-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.section-header__copy {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.section-header__title {
  margin: 0;
  color: var(--foreground);
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.2;
}

.section-header--section .section-header__title {
  color: var(--violet-strong);
  font-size: clamp(1.6rem, 3vw, 2rem);
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.section-header--page .section-header__title {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
}

.section-header__description {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.95rem;
  line-height: 1.6;
}

.section-header__actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

@media (max-width: 640px) {
  .section-header {
    display: grid;
  }
}
</style>
