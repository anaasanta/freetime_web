<script setup>
import { UserRound } from 'lucide-vue-next'

defineProps({
  user: {
    type: Object,
    default: null,
  },
  avatarSrc: {
    type: String,
    default: null,
  },
  copy: {
    type: Object,
    required: true,
  },
  tags: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="glass-panel profile-panel">
    <div class="avatar-shell">
      <img
        v-if="avatarSrc"
        :src="avatarSrc"
        :alt="copy.avatarAlt"
        class="profile-avatar-image"
      />

      <div v-else class="profile-avatar-fallback">
        <UserRound :size="38" />
      </div>
    </div>

    <div class="profile-copy">
      <h1>{{ user?.name }}</h1>
      <p>{{ user?.handle }} {{ copy.separator }} {{ user?.age }} {{ copy.ageUnit }}</p>

      <div class="tag-list">
        <span v-for="tag in tags" :key="tag" class="chip">
          {{ tag }}
        </span>
      </div>
    </div>
  </section>
</template>
