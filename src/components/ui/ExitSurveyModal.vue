<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits(['confirm', 'cancel'])

// Configuración del modal: textos, botones y opciones.
const config = {
  title:       'Per què vols sortir?',
  description: 'La teva resposta ens ajuda a millorar les recomanacions.',
  buttons: {
    cancel:  'Tornar',
    confirm: 'Enviar i sortir',
  },
  options: [
    { id: 'no-options',  label: "No m'han agradat les opcions" },
    { id: 'no-time',     label: 'Ja no tinc temps' },
    { id: 'too-tired',   label: 'Estic massa cansat/ada' },
    { id: 'without-app', label: "Ja ho faig sense l'app" },
  ],
}

// Opción seleccionada por la usuaria.
const selected = ref(null)

function confirm() {
  // Enviamos la opción marcada al componente padre.
  emit('confirm', selected.value)
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop modal d-block" tabindex="-1" @click.self="emit('cancel')">
      <div class="modal-card modal-dialog modal-dialog-centered">

        <button class="modal-close btn" type="button" :aria-label="config.buttons.cancel" @click="emit('cancel')">
          <X :size="18" />
        </button>

        <h2>{{ config.title }}</h2>
        <p>{{ config.description }}</p>

        <div class="options-list">
          <button
            v-for="option in config.options"
            :key="option.id"
            class="option-btn btn"
            :class="{ selected: selected === option.id }"
            type="button"
            @click="selected = option.id"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="modal-actions">
          <BaseButton variant="secondary" @click="emit('cancel')">
            {{ config.buttons.cancel }}
          </BaseButton>
          <BaseButton
            :disabled="!selected"
            @click="confirm"
          >
            {{ config.buttons.confirm }}
          </BaseButton>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--background) 80%, transparent);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-card {
  position: relative;
  max-width: none;
  pointer-events: auto;
  background: var(--surface);
  border-radius: 28px;
  padding: 36px;
  width: min(480px, calc(100vw - 40px));
  display: grid;
  gap: 20px;
  box-shadow: 0 20px 60px var(--shadow-panel);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: white;
  color: var(--foreground);
  cursor: pointer;
}

.modal-card h2 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--foreground);
}

.modal-card p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.options-list {
  display: grid;
  gap: 10px;
}

.option-btn {
  padding: 14px 18px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: white;
  color: var(--foreground);
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  transition: border-color 0.15s, background 0.15s;
}

.option-btn:hover {
  border-color: var(--violet);
}

.option-btn.selected {
  border: 2px solid var(--violet);
  background: var(--violet-soft);
  font-weight: 600;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
}

</style>
