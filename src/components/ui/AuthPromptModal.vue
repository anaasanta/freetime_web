<script setup>
import { RouterLink } from 'vue-router'
import { Sparkles, X } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'

// componente de modal que se muestra para invitar a los usuarios a iniciar sesión cuando intentan acceder a funciones que requieren autenticación. 


defineProps({
  copy: {
    type: Object,
    required: true,
  },
  loginRoute: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="auth-prompt-modal" role="presentation">
    <section class="auth-prompt-dialog" role="dialog" aria-modal="true" :aria-label="copy.title">
      <button class="auth-prompt-close btn" type="button" :aria-label="copy.cancel" @click="emit('close')">
        <X :size="18" />
      </button>

      <Sparkles class="auth-prompt-icon" :size="30" />
      <h3>{{ copy.title }}</h3>
      <p>{{ copy.description }}</p>

      <div class="auth-prompt-actions">
        <BaseButton variant="secondary" @click="emit('close')">
          {{ copy.cancel }}
        </BaseButton>
        <BaseButton :as="RouterLink" :to="loginRoute" class="auth-prompt-login">
          {{ copy.login }}
        </BaseButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.auth-prompt-modal {
  position: fixed;
  inset: 0;
  z-index: 1400;
  display: grid;
  place-items: center;
  padding: 24px;
  background: color-mix(in srgb, var(--background) 78%, transparent);
  backdrop-filter: blur(18px);
}

.auth-prompt-dialog {
  position: relative;
  display: grid;
  gap: 14px;
  width: min(100%, 520px);
  padding: 32px;
  border: 1px solid var(--surface-stroke-strong);
  border-radius: 28px;
  background:
    radial-gradient(circle at 10% 0%, color-mix(in srgb, var(--violet-soft) 48%, transparent), transparent 36%),
    color-mix(in srgb, var(--surface-contrast) 94%, transparent);
  box-shadow: var(--shadow-panel-strong);
  color: var(--foreground);
}

.auth-prompt-close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--violet);
}

.auth-prompt-icon {
  color: var(--violet);
}

.auth-prompt-dialog h3,
.auth-prompt-dialog p {
  margin: 0;
}

.auth-prompt-dialog h3 {
  max-width: 12ch;
  color: var(--violet-strong);
  font-size: clamp(1.8rem, 4vw, 2.3rem);
  font-weight: 900;
  line-height: 1;
}

.auth-prompt-dialog p {
  color: var(--muted-foreground);
  line-height: 1.6;
}

.auth-prompt-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.auth-prompt-login.primary-button {
  border: 0;
  background: linear-gradient(90deg, var(--violet-strong), var(--sky));
  color: var(--primary-foreground);
  box-shadow: var(--shadow-glow);
}

@media (max-width: 560px) {
  .auth-prompt-actions {
    flex-direction: column;
  }

  .auth-prompt-actions > * {
    width: 100%;
  }
}
</style>
