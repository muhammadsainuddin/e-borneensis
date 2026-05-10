<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

// --- DUMMY DATA UNTUK BYPASS LOGIN ---
// Kotak input akan sedia terisi dengan data ini semasa aplikasi dibuka
const email = ref('tester@eborneensis.com')
const password = ref('bypass123') 

const showPassword = ref(false) 

function handleSignIn() {
  console.log('Bypass login using:', email.value)
  
  // Terus simpan data ke Pinia Store dan pergi ke Dashboard
  auth.login(email.value)
  router.push('/dashboard')
}

function handleSignUp() {
  router.push('/signup')
}
</script>

<template>
  <div class="login-container">
    
    <div class="branding-section">
      <img src="/logo/logo.png" alt="eBorneensis Logo" class="login-logo" />
    </div>

    <div class="form-section">
      <h2 class="welcome-text">Welcome back.</h2>

      <div class="input-group">
        <label class="input-label">Email address</label>
        <q-input 
          v-model="email" 
          outlined 
          dense
          placeholder="Email address" 
          class="custom-input"
        />
      </div>

      <div class="input-group">
        <label class="input-label">Password</label>
        <q-input 
          v-model="password" 
          outlined 
          dense
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password" 
          class="custom-input"
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              size="xs"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </div>

      <a href="#" class="forgot-password" @click.prevent="router.push('/forgot-password')">
        Forgot password?
      </a>

      <div class="action-buttons">
        <q-btn 
          unelevated 
          rounded 
          color="black" 
          text-color="white" 
          label="Sign in" 
          class="full-width-btn sign-in-btn"
          @click="handleSignIn"
        />
        <q-btn 
          outline 
          rounded 
          color="black" 
          label="Sign up" 
          class="full-width-btn sign-up-btn"
          @click="handleSignUp"
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  height: 100vh; 
  justify-content: space-between; 
  background-color: #ffffff;
  padding: 0 2rem 3rem 2rem; 
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}

.branding-section {
  text-align: center;
  padding-top: 12vh; 
}

.login-logo {
  max-width: 250px;
  height: auto;
  filter: brightness(0); /* Menjadikan logo PNG berwarna hitam padu */
}

.form-section {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  text-align: left; 
}

.welcome-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.2rem;
}

.input-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 6px;
  text-align: left;
}

:deep(.custom-input .q-field__control) {
  border-radius: 8px; 
}

.forgot-password {
  font-size: 0.9rem;
  font-weight: 600;
  color: #7b5ce8; 
  text-decoration: none;
  margin-bottom: 2.5rem;
  align-self: flex-start; 
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem; 
}

.full-width-btn {
  width: 100%;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 600;
  text-transform: none; 
}
</style>