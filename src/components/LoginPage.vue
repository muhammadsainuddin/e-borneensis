<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('tester@eborneensis.com')
const password = ref('bypass123') 
const showPassword = ref(false) 

function handleSignIn() {
  console.log('Bypass login using:', email.value)
  auth.login(email.value)
  router.push('/dashboard')
}

function handleSignUp() {
  router.push('/signup')
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between bg-white px-8 pb-12 font-sans box-border">
    
    <div class="text-center pt-[12vh]">
      <img src="/logo/logo.png" alt="eBorneensis Logo" class="max-w-[250px] h-auto mx-auto brightness-0" />
    </div>

    <div class="flex flex-col w-full max-w-[400px] mx-auto text-left">
      <h2 class="text-2xl font-bold text-black mb-8">Welcome back.</h2>

      <div class="mb-5">
        <label class="block text-sm font-semibold text-black mb-1.5">Email address</label>
        <input 
          v-model="email" 
          type="email"
          placeholder="Email address" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div class="mb-5 relative">
        <label class="block text-sm font-semibold text-black mb-1.5">Password</label>
        <div class="relative">
          <input 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password" 
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <button 
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-black"
          >
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
      </div>

      <a href="#" class="text-sm font-semibold text-purple-600 hover:underline mb-10 self-start" @click.prevent="router.push('/forgot-password')">
        Forgot password?
      </a>

      <div class="flex flex-col gap-4">
        <button 
          @click="handleSignIn"
          class="w-full py-3 text-base font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition duration-300"
        >
          Sign in
        </button>
        <button 
          @click="handleSignUp"
          class="w-full py-3 text-base font-semibold text-black bg-transparent border-2 border-black rounded-full hover:bg-gray-100 transition duration-300"
        >
          Sign up
        </button>
      </div>
    </div>
  </div>
</template>