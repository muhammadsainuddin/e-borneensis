// src/main.ts
import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'

// Import registerSW dari vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register'

// IMPORT PWA ELEMENTS UNTUK KAMERA
import { defineCustomElements } from '@ionic/pwa-elements/loader'

import './style.css'
import App from './App.vue'

// Pendaftaran PWA (Service Worker)
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Kandungan baharu telah dikemaskini. Muat semula aplikasi?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('Aplikasi sedia untuk digunakan secara offline!')
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Aktifkan elemen UI Kamera untuk PWA
defineCustomElements(window)

app.mount('#app')