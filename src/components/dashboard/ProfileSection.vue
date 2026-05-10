<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

// State untuk kawal paparan modal (Bottom Sheets)
const showEditProfile = ref(false)
const showSettings = ref(false)
const showAbout = ref(false)

// State untuk borang Edit Profile
const editForm = ref({
  name: auth.user?.name || 'Guest User',
  email: auth.user?.email || 'No email provided'
})

// Simulasi tetapan
const settings = ref({
  notifications: true,
  locationTracking: true,
  darkMode: false
})

function saveProfile() {
  // Kemaskini store auth (simulasi)
  if (auth.user) {
    auth.user.name = editForm.value.name
    auth.user.email = editForm.value.email
  }
  alert('Profile successfully updated!')
  showEditProfile.value = false
}

function logout() {
  if (confirm('Are you sure you want to log out?')) {
    auth.logout()
    router.push('/login')
  }
}
</script>

<template>
  <div class="absolute inset-0 w-full h-full overflow-y-auto bg-[#f4f6f8] px-4 pt-8 pb-24 font-sans text-left">
    
    <div class="flex flex-col items-center mb-8">
      <div class="w-28 h-28 bg-green-900 rounded-[32px] text-white flex items-center justify-center shadow-lg mb-4 transform rotate-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 class="text-2xl font-black text-black">{{ editForm.name }}</h2>
      <p class="text-sm font-medium text-gray-500 mt-1">{{ editForm.email }}</p>
    </div>

    <div class="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden mb-5">
      
      <button @click="showEditProfile = true" class="w-full flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
        <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 mr-4 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        </div>
        <div class="flex-grow text-left">
          <span class="block text-sm font-bold text-gray-900">Edit Profile</span>
          <span class="block text-[11px] font-medium text-gray-400">Change name and email</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>

      <button @click="showSettings = true" class="w-full flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
        <div class="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-700 mr-4 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <div class="flex-grow text-left">
          <span class="block text-sm font-bold text-gray-900">App Settings</span>
          <span class="block text-[11px] font-medium text-gray-400">Notifications, GPS, Theme</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>

      <button @click="showAbout = true" class="w-full flex items-center p-4 hover:bg-gray-50 transition-colors">
        <div class="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-700 mr-4 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div class="flex-grow text-left">
          <span class="block text-sm font-bold text-gray-900">About eBorneensis</span>
          <span class="block text-[11px] font-medium text-gray-400">App info & partners</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>

    <button @click="logout" class="w-full bg-white rounded-[24px] shadow-sm border border-red-50 p-4 flex items-center justify-center hover:bg-red-50 transition-colors active:scale-95">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      <span class="text-sm font-bold text-red-600 tracking-wide">LOG OUT</span>
    </button>

    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showEditProfile" class="fixed inset-0 z-[100] flex items-end justify-center">
        <div @click="showEditProfile = false" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <Transition enter-active-class="transition duration-300 ease-out translate-y-full" enter-from-class="translate-y-full" enter-to-class="translate-y-0" leave-active-class="transition duration-200 ease-in translate-y-0" leave-from-class="translate-y-0" leave-to-class="translate-y-full">
          <div v-if="showEditProfile" class="relative bg-white w-full max-w-lg rounded-t-[32px] shadow-2xl flex flex-col p-6">
            <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <h3 class="text-2xl font-black text-black mb-6">Edit Profile</h3>
            
            <div class="space-y-4 mb-8">
              <div>
                <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5">Full Name</label>
                <input v-model="editForm.name" type="text" class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-green-800/20 focus:border-green-800 font-bold text-black outline-none transition-all" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5">Email Address</label>
                <input v-model="editForm.email" type="email" class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-green-800/20 focus:border-green-800 font-bold text-black outline-none transition-all" />
              </div>
            </div>

            <button @click="saveProfile" class="w-full py-4 text-sm font-bold text-white bg-green-900 rounded-[16px] shadow-lg active:scale-95 transition-all">
              SAVE CHANGES
            </button>
          </div>
        </Transition>
      </div>
    </Transition>

    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showSettings" class="fixed inset-0 z-[100] flex items-end justify-center">
        <div @click="showSettings = false" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <Transition enter-active-class="transition duration-300 ease-out translate-y-full" enter-from-class="translate-y-full" enter-to-class="translate-y-0" leave-active-class="transition duration-200 ease-in translate-y-0" leave-from-class="translate-y-0" leave-to-class="translate-y-full">
          <div v-if="showSettings" class="relative bg-[#f4f6f8] w-full max-w-lg rounded-t-[32px] shadow-2xl flex flex-col p-6">
            <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <h3 class="text-2xl font-black text-black mb-6">App Settings</h3>
            
            <div class="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mb-6">
              
              <div class="flex items-center justify-between p-5 border-b border-gray-50">
                <div>
                  <span class="block text-sm font-bold text-gray-900">Push Notifications</span>
                  <span class="block text-[11px] font-medium text-gray-400">Receive alerts on new updates</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.notifications" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-5 border-b border-gray-50">
                <div>
                  <span class="block text-sm font-bold text-gray-900">Background GPS</span>
                  <span class="block text-[11px] font-medium text-gray-400">Enhance map accuracy</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.locationTracking" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-5">
                <div>
                  <span class="block text-sm font-bold text-gray-900">Dark Mode</span>
                  <span class="block text-[11px] font-medium text-gray-400">Easy on the eyes</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.darkMode" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

            </div>

            <button @click="showSettings = false" class="w-full py-4 text-sm font-bold text-gray-700 bg-gray-200 rounded-[16px] active:scale-95 transition-all">
              CLOSE
            </button>
          </div>
        </Transition>
      </div>
    </Transition>

    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showAbout" class="fixed inset-0 z-[100] flex items-end justify-center">
        <div @click="showAbout = false" class="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
        <Transition enter-active-class="transition duration-300 ease-out translate-y-full" enter-from-class="translate-y-full" enter-to-class="translate-y-0" leave-active-class="transition duration-200 ease-in translate-y-0" leave-from-class="translate-y-0" leave-to-class="translate-y-full">
          <div v-if="showAbout" class="relative bg-white w-full max-w-lg rounded-t-[32px] shadow-2xl flex flex-col p-8 text-center items-center">
            
            <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-8"></div>
            
            <img src="/logo/logo.png" alt="eBorneensis Logo" class="w-48 mb-4 brightness-0" />
            <span class="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded-full tracking-widest mb-6">VERSION 1.0.0</span>
            
            <p class="text-sm text-gray-600 font-medium leading-relaxed mb-8 px-4">
              eBorneensis is a comprehensive biodiversity monitoring platform dedicated to exploring and preserving the rich flora and fauna of Borneo.
            </p>

            <div class="w-full border-t border-gray-100 pt-6 flex flex-col items-center">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Powered By</span>
              <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter">
                AiGeo
              </h2>
            </div>

            <button @click="showAbout = false" class="w-full mt-10 py-4 text-sm font-bold text-white bg-black rounded-[16px] shadow-lg active:scale-95 transition-all">
              AWESOME
            </button>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>