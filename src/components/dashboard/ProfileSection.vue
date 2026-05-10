<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="q-pa-md full-width scroll" style="height: 100%;">
    
    <div class="text-center q-py-xl">
      <q-avatar size="100px" color="black" text-color="white" icon="person" class="q-mb-md shadow-2" />
      <div class="text-h6 text-weight-bold text-black">{{ auth.user?.name || 'Guest User' }}</div>
      <div class="text-subtitle2 text-grey-7">{{ auth.user?.email || 'No email provided' }}</div>
    </div>

    <q-list bordered separator class="rounded-borders bg-white q-mb-md">
      
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="person_outline" color="black" />
        </q-item-section>
        <q-item-section class="text-black">Edit Profile</q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" color="grey-5" />
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="settings" color="black" />
        </q-item-section>
        <q-item-section class="text-black">App Settings</q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" color="grey-5" />
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="info_outline" color="black" />
        </q-item-section>
        <q-item-section class="text-black">About eBorneensis</q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" color="grey-5" />
        </q-item-section>
      </q-item>

    </q-list>

    <q-list bordered class="rounded-borders bg-white">
      <q-item clickable v-ripple @click="logout">
        <q-item-section avatar>
          <q-icon name="logout" color="black" />
        </q-item-section>
        <q-item-section class="text-weight-bold text-black">Log Out</q-item-section>
      </q-item>
    </q-list>

    <div class="q-pb-xl q-mb-xl"></div>

  </div>
</template>

<style scoped>
/* Tiada lagi CSS tersuai (custom) yang panjang. Semuanya dikawal oleh class Quasar! */
</style>