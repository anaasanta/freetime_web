<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Redirect to profile - this view is no longer used
router.replace({ name: 'profile' })
</script>

<template>
  <div></div>
</template>
