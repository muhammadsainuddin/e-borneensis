<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')

function handleReset(e: Event) {
  e.preventDefault()
  alert(`A password reset link has been sent to ${email.value}. Please check your inbox.`)
  router.push('/login')
}
</script>

<template>
  <div class="flex flex-col h-screen bg-white px-6 pb-8 text-left font-sans box-border">
    
    <div class="flex items-center mt-[8vh] mb-8">
      <button @click="router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h2 class="text-3xl font-bold m-0 ml-2 text-black">Forgot Password</h2>
    </div>

    <form @submit="handleReset" class="flex flex-col grow justify-between w-full max-w-[400px] mx-auto">
      
      <div>
        <p class="text-base text-gray-600 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <div class="mb-4">
          <label class="block text-sm font-semibold text-black mb-1">Email address *</label>
          <input 
            v-model="email" 
            type="email" 
            required
            placeholder="name@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div>
        <button type="submit" class="w-full py-3 text-base font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition duration-300 shadow-md">
          Send Reset Link
        </button>
      </div>
      
    </form>
  </div>
</template>