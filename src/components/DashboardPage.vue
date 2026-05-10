<script setup lang="ts">
import { ref } from 'vue'
import MapSection from './dashboard/MapSection.vue'
import DataSection from './dashboard/DataSection.vue'
import ProfileSection from './dashboard/ProfileSection.vue'
import ObservationForm from './dashboard/ObservationForm.vue'

const tab = ref('data') // Letak 'data' sebagai default sempena pengujian kita
const showMarkDialog = ref(false)

const refreshDataTrigger = ref(0) 
const currentLocation = ref<[number, number] | null>(null)

// State khas untuk Edit
const recordToEdit = ref<any | null>(null)

// Fungsi buka form untuk rekod BARU
function openNewForm() {
  recordToEdit.value = null
  showMarkDialog.value = true
}

// Fungsi buka form untuk EDIT rekod lama
function handleEditRecord(record: any) {
  recordToEdit.value = record
  showMarkDialog.value = true
}

// Apabila form ditutup
function handleCloseDialog() {
  showMarkDialog.value = false
  setTimeout(() => recordToEdit.value = null, 300) // Reset selepas animasi tamat
}

// Trigger render semula (Untuk Map & Data)
function triggerRefresh() {
  refreshDataTrigger.value++
}
</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden bg-white font-sans text-left">
    
    <header class="bg-black text-white h-[45px] flex justify-between items-center px-4 shrink-0 shadow-md z-20">
      <img src="/logo/logo.png" alt="Logo" class="h-6 brightness-0 invert" />
      <h1 class="text-sm font-semibold tracking-[1.5px] uppercase m-0">{{ tab }}</h1>
    </header>

    <main class="flex-grow relative bg-white overflow-hidden z-0">
      <MapSection 
        v-show="tab === 'maps'" 
        :is-active="tab === 'maps'" 
        :refresh-trigger="refreshDataTrigger"
        @location-update="currentLocation = $event" 
      />
      
      <DataSection 
        v-if="tab === 'data'" 
        :refresh-trigger="refreshDataTrigger"
        @edit-record="handleEditRecord"
        @refresh-needed="triggerRefresh"
      />
      
      <ProfileSection v-if="tab === 'profile'" />

      <button 
        v-if="tab !== 'profile'"
        @click="openNewForm"
        class="absolute bottom-6 right-6 w-14 h-14 bg-green-900 text-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
      </button>
    </main>

    <footer class="bg-white border-t border-gray-200 shrink-0 z-20 pb-safe">
      <nav class="flex justify-around items-center h-16 text-gray-400">
        <button @click="tab = 'maps'" :class="['flex flex-col items-center w-full py-2 transition-colors', tab === 'maps' ? 'text-black' : 'hover:text-gray-600']">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" :fill="tab === 'maps' ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          <span class="text-[10px] font-bold uppercase tracking-wider">Maps</span>
        </button>

        <button @click="tab = 'data'" :class="['flex flex-col items-center w-full py-2 transition-colors', tab === 'data' ? 'text-black' : 'hover:text-gray-600']">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" :fill="tab === 'data' ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span class="text-[10px] font-bold uppercase tracking-wider">Data</span>
        </button>

        <button @click="tab = 'profile'" :class="['flex flex-col items-center w-full py-2 transition-colors', tab === 'profile' ? 'text-black' : 'hover:text-gray-600']">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" :fill="tab === 'profile' ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span class="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </button>
      </nav>
    </footer>

    <ObservationForm 
      :show="showMarkDialog" 
      :current-location="currentLocation"
      :edit-data="recordToEdit"
      @close="handleCloseDialog" 
      @saved="triggerRefresh" 
    />

  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
</style>