<script setup lang="ts">
import { ref } from 'vue'

import MapSection from './dashboard/MapSection.vue'
import DataSection from './dashboard/DataSection.vue'
import ProfileSection from './dashboard/ProfileSection.vue'

// Kawal tab yang aktif
const tab = ref('maps')

// Kawal paparan dialog borang (Mark Location)
const showMarkDialog = ref(false)
</script>

<template>
  <q-layout view="hHh lpR fFf">
    
    <q-header elevated class="bg-black text-white">
      <q-toolbar class="header-toolbar">
        <img src="/logo/logo.png" alt="Logo" class="header-logo" />
        <q-toolbar-title class="header-title">{{ tab.toUpperCase() }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-white">
      <q-page class="page-container relative-position">
        
        <MapSection v-show="tab === 'maps'" :is-active="tab === 'maps'" />
        <DataSection v-if="tab === 'data'" />
        <ProfileSection v-if="tab === 'profile'" />

        <q-page-sticky 
          position="bottom-right" 
          :offset="[18, 18]" 
          v-if="tab !== 'profile'"
        >
          <q-btn 
            round 
            color="black" 
            icon="add" 
            size="lg" 
            class="shadow-4" 
            @click="showMarkDialog = true" 
          />
        </q-page-sticky>

      </q-page>
    </q-page-container>

    <q-footer bordered class="bg-white text-black">
      <q-tabs 
        v-model="tab" 
        no-caps 
        active-color="black" 
        indicator-color="black" 
        class="text-grey-5 full-width"
        align="justify"
      >
        <q-tab name="maps" icon="map" label="Maps" />
        <q-tab name="data" icon="chat_bubble" label="Data" />
        <q-tab name="profile" icon="person" label="Profile" />
      </q-tabs>
    </q-footer>

  </q-layout>
</template>

<style scoped>
.page-container {
  height: calc(100vh - 100px); /* Ketinggian skrin ditolak saiz header dan footer */
  width: 100vw;
  overflow: hidden;
}

.header-toolbar { min-height: 45px; }
.header-logo { height: 24px; filter: brightness(0) invert(1); margin-right: 10px; }
.header-title { font-size: 0.9rem; letter-spacing: 1.5px; font-weight: 400; }
</style>