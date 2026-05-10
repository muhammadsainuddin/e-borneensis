<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// Form Data
const email = ref('')
const name = ref('')
const ageGroup = ref('')
const gender = ref('')
const password = ref('')
const confirmPassword = ref('')

// UI Controls
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const captchaVerified = ref(false)

// Dropdown Options
const ageOptions = ['Under 18', '18 - 24', '25 - 34', '35 - 44', '45 and above']
const genderOptions = ['Male', 'Female', 'Prefer not to say']

function promptConfirmation() {
  if (!captchaVerified.value) {
    $q.notify({
      color: 'negative',
      message: 'Please verify that you are not a robot.',
      icon: 'warning',
      position: 'top'
    })
    return
  }

  $q.dialog({
    title: 'Registration Confirmation',
    message: 'Are you sure all the entered information is correct?',
    cancel: 'Review',
    ok: 'Yes, Register',
    persistent: true
  }).onOk(() => {
    executeSignUp()
  })
}

function executeSignUp() {
  const payload = {
    email: email.value,
    name: name.value,
    ageGroup: ageGroup.value,
    gender: gender.value,
    password: password.value
  }
  
  console.log('Data successfully sent to API:', payload)
  
  $q.notify({
    color: 'positive',
    message: 'Account successfully registered!',
    icon: 'check_circle',
    position: 'top'
  })

  router.push('/login')
}

function goBackToLogin() {
  router.back() 
}
</script>

<template>
  <div class="signup-container">
    
    <div class="header-section">
      <q-btn 
        flat 
        round 
        dense 
        icon="arrow_back" 
        color="black"
        class="back-btn"
        @click="goBackToLogin" 
      />
      <h2 class="welcome-text">Create Account</h2>
    </div>

    <q-form @submit="promptConfirmation" class="form-wrapper">
      
      <div class="scrollable-fields">
        <div class="input-group">
          <label class="input-label">Email address *</label>
          <q-input 
            v-model="email" 
            outlined 
            dense 
            placeholder="name@example.com" 
            class="custom-input"
            lazy-rules
            :rules="[
              val => !!val || 'Email is required',
              val => /.+@.+\..+/.test(val) || 'Invalid email format'
            ]"
          />
        </div>

        <div class="input-group">
          <label class="input-label">Full Name *</label>
          <q-input 
            v-model="name" 
            outlined 
            dense 
            placeholder="John Doe" 
            class="custom-input"
            lazy-rules
            :rules="[val => !!val || 'Full name is required']"
          />
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-6 input-group">
            <label class="input-label">Age Group *</label>
            <q-select 
              v-model="ageGroup" 
              :options="ageOptions" 
              outlined 
              dense 
              class="custom-input"
              lazy-rules
              :rules="[val => !!val || 'Selection is required']"
            />
          </div>
          <div class="col-6 input-group">
            <label class="input-label">Gender *</label>
            <q-select 
              v-model="gender" 
              :options="genderOptions" 
              outlined 
              dense 
              class="custom-input"
              lazy-rules
              :rules="[val => !!val || 'Selection is required']"
            />
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">Password *</label>
          <q-input 
            v-model="password" 
            outlined 
            dense
            :type="showPassword ? 'text' : 'password'"
            placeholder="Create a password" 
            class="custom-input"
            lazy-rules
            :rules="[
              val => !!val || 'Password is required',
              val => val.length >= 6 || 'Please enter at least 6 characters'
            ]"
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

        <div class="input-group">
          <label class="input-label">Confirm Password *</label>
          <q-input 
            v-model="confirmPassword" 
            outlined 
            dense
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Re-type password" 
            class="custom-input"
            lazy-rules
            :rules="[
              val => !!val || 'Confirmation is required',
              val => val === password || 'Passwords do not match!'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                size="xs"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>
        </div>

        <div class="captcha-box">
          <q-checkbox v-model="captchaVerified" label="I'm not a robot" color="teal" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/RecaptchaLogo.svg/1200px-RecaptchaLogo.svg.png" alt="Recaptcha" class="captcha-logo" />
        </div>
      </div>

      <div class="action-buttons">
        <q-btn 
          type="submit"
          unelevated 
          rounded 
          color="black" 
          text-color="white" 
          label="Sign up" 
          class="full-width-btn sign-in-btn"
        />
        <div class="login-link-container">
          <span class="sub-text">Already have an account? </span>
          <a href="#" class="login-link" @click.prevent="goBackToLogin">Sign in</a>
        </div>
      </div>
      
    </q-form>

  </div>
</template>

<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  padding: 0 1.5rem 1.5rem 1.5rem;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  text-align: left; /* Ensuring everything defaults to left alignment */
}

/* --- Header Section --- */
.header-section {
  display: flex;
  align-items: center;
  margin-top: 8vh;
  margin-bottom: 1.5rem;
  justify-content: flex-start; /* Aligned strictly to left */
}

.back-btn {
  margin-right: 10px;
  margin-left: -10px;
}

.welcome-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* --- Form Wrapper --- */
.form-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

/* --- Scrollable Fields --- */
.scrollable-fields {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 5px;
  padding-bottom: 1rem;
}

.scrollable-fields::-webkit-scrollbar {
  width: 4px;
}
.scrollable-fields::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 4px;
}

.input-group {
  margin-bottom: 2px;
}

.input-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
  text-align: left; /* Explicitly align label left */
}

:deep(.custom-input .q-field__control) {
  border-radius: 8px;
}

.captcha-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #d3d3d3;
  border-radius: 6px;
  padding: 8px 12px;
  background-color: #fafafa;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.captcha-logo {
  height: 25px;
  opacity: 0.8;
}

/* --- Action Buttons --- */
.action-buttons {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding-top: 1rem;
  background-color: #fff;
}

.full-width-btn {
  width: 100%;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 600;
  text-transform: none;
}

.login-link-container {
  text-align: left; /* Aligned left to match the rest of the form */
  font-size: 0.9rem;
}

.sub-text {
  color: #666666;
}

.login-link {
  font-weight: 600;
  color: #000000;
  text-decoration: none;
}
</style>