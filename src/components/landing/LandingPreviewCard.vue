<script setup>
import GradientCard from '@/components/ui/GradientCard.vue'
import Screenshot from '@/components/landing/Imagen2.png'
import { landingCopy } from '@/data/uiText'
</script>

<template>
  <section class="preview-shell" :aria-label="landingCopy.preview.ariaLabel">
    <GradientCard container-class="preview-card-shell" content-class="preview-card-content">
      <img :src="Screenshot" :alt="landingCopy.preview.imageAlt" class="preview-screenshot" />
    </GradientCard>
  </section>
</template>

<style scoped>
.preview-shell {
  display: grid;
  justify-items: end;
}

.preview-card-shell {
  overflow: hidden;
  border-radius: 38px;
  width: 100%;
  max-width: 900px;
}

.preview-card-content {
  padding: 20px;
  border-radius: 38px !important;
}

.preview-screenshot {
  width: 100%;
  border-radius: 18px;
  object-fit: contain;
  height: auto;
}
</style>
