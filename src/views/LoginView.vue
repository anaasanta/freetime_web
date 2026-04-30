<script setup>
import { ref } from 'vue'

defineProps({
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['login'])

const username = ref('laura')
const password = ref('12345')

function submitLogin() {
  emit('login', {
    username: username.value.trim(),
    password: password.value,
  })
}
</script>

<template>
  <main class="app-page login-page">
    <section class="page-container login-container">
      <div class="card login-card">
        <h1>Benvinguda a FreeTime</h1>

        <p>
          Organitza el teu temps lliure i descobreix activitats adaptades al teu moment.
        </p>

        <form class="login-form" @submit.prevent="submitLogin">
          <label>
            Usuari
            <input v-model="username" type="text" placeholder="Ex: laura" />
          </label>

          <label>
            Contrasenya
            <input v-model="password" type="password" placeholder="Ex: 12345" />
          </label>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>

          <button class="primary-button" type="submit">
            Entrar
          </button>
        </form>

        <div class="login-help">
          <strong>Usuaris de prova:</strong>
          <span>laura / 12345</span>
          <span>nou / 12345</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
}
.login-container {
    display: flex;
    justify-content: center;

}

.login-card {
  width: min(100%, 720px);
  max-width: 720px;
}

h1 {
  margin: 20px 0 10px;
  color: var(--foreground);
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

p {
  color: var(--muted-foreground);
  line-height: 1.6;
}

.login-form {
  display: grid;
  gap: 18px;
  margin-top: 28px;
}

label {
  display: grid;
  gap: 8px;
  color: var(--foreground);
  font-weight: 800;
}

input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px 16px;
  background: white;
  color: var(--foreground);
}

.error-message {
  margin: 0;
  border: 1px solid #fecdd3;
  border-radius: 16px;
  padding: 12px 14px;
  background: #fff1f2;
  color: #e11d48;
  font-weight: 700;
}

.login-help {
  display: grid;
  gap: 4px;
  margin-top: 22px;
  color: var(--muted-foreground);
  font-size: 0.9rem;
}
</style>