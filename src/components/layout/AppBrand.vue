<script setup>
import { RouterLink } from 'vue-router'

import LogoImg from '@/components/landing/Imagen2.png'

defineProps({
  brand: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    default: '',
  },
  to: {
    type: [String, Object],
    default: '/',
  },
})
</script>

<template>
  <RouterLink class="app-brand" :to="to">
    <img :src="LogoImg" alt="Logo de FreeTime" class="app-brand__mark" />

    <div class="app-brand__copy">
      <strong>{{ brand }}</strong>
      <span v-if="tagline">{{ tagline }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.app-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
}

.app-brand__mark {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
  display: block;
}

.app-brand__copy {
  display: grid;
  gap: 2px;
}

.app-brand__copy strong {
  display: block;
  background: linear-gradient(90deg, var(--violet-strong), var(--sky));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.app-brand__copy span {
  color: var(--muted-foreground);
  font-size: 0.86rem;
  line-height: 1.2;
}
</style>
