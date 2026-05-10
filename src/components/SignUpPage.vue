<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

function promptConfirmation(e: Event) {
  e.preventDefault() // Halang muat semula halaman apabila submit

  if (!captchaVerified.value) {
    alert('Please verify that you are not a robot.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }

  const isConfirmed = confirm('Are you sure all the entered information is correct?')
  if (isConfirmed) {
    executeSignUp()
  }
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
  alert('Account successfully registered!')
  router.push('/login')
}

function goBackToLogin() {
  router.back() 
}
</script>

<template>
  <div class="flex flex-col h-screen bg-white px-6 pb-6 font-sans box-border text-left">
    
    <div class="flex items-center mt-[8vh] mb-6">
      <button @click="goBackToLogin" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h2 class="text-3xl font-bold text-black m-0 ml-2">Create Account</h2>
    </div>

    <form @submit="promptConfirmation" class="flex flex-col grow overflow-hidden w-full max-w-[400px] mx-auto">
      
      <div class="flex-grow overflow-y-auto overflow-x-hidden pr-1 pb-4 space-y-4">
        
        <div>
          <label class="block text-sm font-semibold text-black mb-1">Email address *</label>
          <input v-model="email" type="email" placeholder="name@example.com" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-black mb-1">Full Name *</label>
          <input v-model="name" type="text" placeholder="John Doe" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
        </div>

        <div class="flex gap-3">
          <div class="w-1/2">
            <label class="block text-sm font-semibold text-black mb-1">Age Group *</label>
            <select v-model="ageGroup" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white">
              <option disabled value="">Select...</option>
              <option v-for="opt in ageOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="w-1/2">
            <label class="block text-sm font-semibold text-black mb-1">Gender *</label>
            <select v-model="gender" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white">
              <option disabled value="">Select...</option>
              <option v-for="opt in genderOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-black mb-1">Password *</label>
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Create a password" required minlength="6" class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-black">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-black mb-1">Confirm Password *</label>
          <div class="relative">
            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Re-type password" required minlength="6" class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-black">
              <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50 my-2">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input v-model="captchaVerified" type="checkbox" class="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300" />
            <span class="text-sm font-medium">I'm not a robot</span>
          </label>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/RecaptchaLogo.svg/1200px-RecaptchaLogo.svg.png" alt="Recaptcha" class="h-6 opacity-80" />
        </div>
      </div>

      <div class="flex-shrink-0 flex flex-col gap-4 pt-4 bg-white">
        <button type="submit" class="w-full py-3 text-base font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition duration-300 shadow-md">
          Sign up
        </button>
        <div class="text-sm text-left">
          <span class="text-gray-500">Already have an account? </span>
          <a href="#" class="font-semibold text-black hover:underline" @click.prevent="goBackToLogin">Sign in</a>
        </div>
      </div>
      
    </form>
  </div>
</template>