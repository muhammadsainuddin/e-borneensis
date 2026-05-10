<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const email = ref('')

function handleReset() {
  $q.dialog({
    title: 'Reset Link Sent',
    message: `A password reset link has been sent to ${email.value}. Please check your inbox.`,
    ok: 'Back to Login'
  }).onOk(() => {
    router.push('/login')
  })
}
</script>

<template>
  <div class="forgot-container">
    <div class="header-section">
      <q-btn flat round icon="arrow_back" color="black" @click="router.back()" />
      <h2 class="welcome-text">Forgot Password</h2>
    </div>

    <q-form @submit="handleReset" class="form-wrapper">
      <div class="content-section">
        <p class="instruction-text">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <div class="input-group">
          <label class="input-label">Email address *</label>
          <q-input 
            v-model="email" 
            outlined 
            dense 
            placeholder="name@example.com"
            lazy-rules
            :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']"
          />
        </div>
      </div>

      <div class="action-buttons">
        <q-btn type="submit" unelevated rounded color="black" text-color="white" label="Send Reset Link" class="full-width-btn" />
      </div>
    </q-form>
  </div>
</template>

<style scoped>
.forgot-container {
  display: flex; flex-direction: column; height: 100vh;
  background-color: #fff; padding: 0 1.5rem 2rem 1.5rem; text-align: left;
}
.header-section { display: flex; align-items: center; margin-top: 8vh; margin-bottom: 2rem; }
.welcome-text { font-size: 1.8rem; font-weight: 700; margin: 0; margin-left: 10px; }
.form-wrapper { display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; }
.instruction-text { font-size: 1rem; color: #666; margin-bottom: 2rem; }
.input-label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; }
.full-width-btn { width: 100%; padding: 12px 0; text-transform: none; font-weight: 600; }
</style>