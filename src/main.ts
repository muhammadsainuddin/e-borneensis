// src/main.ts
import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'

// Import fail CSS utama (yang kini mempunyai Tailwind)
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')