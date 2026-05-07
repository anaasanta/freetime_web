<script setup>
import AppPanel from '@/components/ui/AppPanel.vue'
import BaseField from '@/components/ui/BaseField.vue'

defineProps({
  copy: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="contact-layout">
    <AppPanel as="div" panel-class="contact-form-panel">
      <div class="panel-header">
        <h3 class="contact-panel-title">{{ copy.form.title }}</h3>
      </div>

      <div class="contact-form-grid">
        <BaseField
          :id="copy.form.fields.name.id"
          :label="copy.form.fields.name.label"
          :placeholder="copy.form.fields.name.placeholder"
          autocomplete="name"
        />

        <BaseField
          :id="copy.form.fields.email.id"
          :label="copy.form.fields.email.label"
          :placeholder="copy.form.fields.email.placeholder"
          autocomplete="email"
          type="email"
        />

        <label class="field-label contact-message-field" :for="copy.form.fields.message.id">
          <span class="field-label-text">{{ copy.form.fields.message.label }}</span>
          <textarea
            :id="copy.form.fields.message.id"
            class="field-input contact-textarea"
            :placeholder="copy.form.fields.message.placeholder"
            rows="5"
          />
        </label>
      </div>

      <button type="button" class="primary-button contact-submit" disabled aria-disabled="true">
        {{ copy.form.submitLabel }}
      </button>
    </AppPanel>

    <AppPanel panel-class="contact-info-panel">
      <div class="panel-header">
        <h3 class="contact-panel-title">{{ copy.info.title }}</h3>
        <p v-if="copy.info.description" class="panel-description">
          {{ copy.info.description }}
        </p>
      </div>

      <div class="contact-info-cards">
        <article v-for="item in copy.info.channels" :key="item.label" class="contact-info-card">
          <span class="contact-info-label">{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>
    </AppPanel>
  </div>
</template>

<style scoped>
.contact-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.85fr);
  gap: 20px;
  align-items: stretch;
}

.contact-form-panel,
.contact-info-panel {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 18px;
}

.panel-header {
  display: grid;
  gap: 8px;
}

.contact-panel-title {
  margin: 0;
  color: var(--foreground);
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.panel-description {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.95rem;
  line-height: 1.6;
}

.contact-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.contact-message-field {
  grid-column: 1 / -1;
  gap: 10px;
}

.contact-textarea {
  min-height: 112px;
  resize: vertical;
}

.contact-submit {
  justify-self: start;
}

.contact-info-cards {
  display: grid;
  gap: 12px;
  align-content: start;
}

.contact-info-card {
  display: grid;
  gap: 4px;
  border: 1px solid color-mix(in srgb, var(--surface-stroke-strong) 85%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-contrast) 88%, transparent);
  padding: 14px 16px;
}

.contact-info-label {
  color: var(--muted-foreground);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 800;
}

.contact-info-card strong {
  color: var(--foreground);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }

  .contact-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
