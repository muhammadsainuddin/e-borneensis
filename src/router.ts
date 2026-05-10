// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'
import SplashPage from './components/SplashPage.vue'
import LoginPage from './components/LoginPage.vue'
import SignUpPage from './components/SignUpPage.vue'
import ForgotPasswordPage from './components/ForgotPasswordPage.vue'
import DashboardPage from './components/DashboardPage.vue'

const routes = [
    { path: '/', component: SplashPage },
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignUpPage },
  // Tambah import ForgotPasswordPage
    { path: '/forgot-password', component: ForgotPasswordPage },
    { path: '/dashboard', component: DashboardPage },
  // Nanti kita akan tambah route untuk dashboard di sini
]

const router = createRouter({
  // Untuk CapacitorJS, jika anda menghadapi masalah skrin putih (white screen) 
  // pada peranti fizikal, anda boleh tukar ini kepada createWebHashHistory()
  history: createWebHistory(), 
  routes,
})

export default router