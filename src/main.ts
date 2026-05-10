// src/main.ts
import { createApp } from 'vue'
import { Quasar, Dialog, Notify } from 'quasar' // <-- Import Dialog & Notify
import router from './router'
import { createPinia } from 'pinia'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())

app.use(router)

app.use(Quasar, {
  plugins: {
    Dialog, // <-- Aktifkan plugin Dialog
    Notify  // <-- Aktifkan plugin Notify (untuk ralat Captcha)
  }, 
})

app.mount('#app')