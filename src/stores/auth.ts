// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null)
  const user = ref<any>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions (Dummy Data)
  function login(email: string) {
    // Simulasi penerimaan JWT token
    token.value = 'dummy-jwt-token-12345'
    user.value = {
      email: email,
      name: 'John Doe',
      ageGroup: '25 - 34',
      gender: 'Male'
    }
    console.log('User logged in with dummy data:', user.value)
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return { token, user, isLoggedIn, login, logout }
})