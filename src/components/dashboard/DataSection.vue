<script setup lang="ts">
import { ref } from 'vue'

// Tab kawalan untuk bahagian statistik
const currentTab = ref('observations')

// Data statistik (Kini ditetapkan kepada 0 seperti dalam gambar)
const observationsCount = ref(0)
const speciesCount = ref(0)
const identificationsCount = ref(0)

// Emit event supaya DashboardPage.vue boleh buka dialog form bila butang ditekan
const emit = defineEmits(['open-mark-dialog'])

function makeObservation() {
  // Beritahu parent component untuk buka borang (Mark Location)
  emit('open-mark-dialog')
}
</script>

<template>
  <div class="data-section-container column full-width">
    
    <q-tabs
      v-model="currentTab"
      dense
      class="bg-white text-grey-6 shadow-1"
      active-color="positive"
      indicator-color="positive"
      align="justify"
      narrow-indicator
    >
      <q-tab name="observations" class="stat-tab">
        <div class="stat-number" :class="{ 'text-positive': currentTab === 'observations', 'text-black': currentTab !== 'observations' }">
          {{ observationsCount }}
        </div>
        <div class="stat-label">OBSERVATIONS</div>
      </q-tab>
      
      <q-tab name="species" class="stat-tab">
        <div class="stat-number" :class="{ 'text-positive': currentTab === 'species', 'text-black': currentTab !== 'species' }">
          {{ speciesCount }}
        </div>
        <div class="stat-label">SPECIES</div>
      </q-tab>
      
      <q-tab name="identifications" class="stat-tab">
        <div class="stat-number" :class="{ 'text-positive': currentTab === 'identifications', 'text-black': currentTab !== 'identifications' }">
          {{ identificationsCount }}
        </div>
        <div class="stat-label">IDENTIFICATIONS</div>
      </q-tab>
    </q-tabs>

    <div class="empty-state-container col flex flex-center column text-center">
      
      <svg viewBox="0 0 24 24" width="90" height="90" fill="#9e9e9e" class="q-mb-md">
        <path d="M11,19H4A2,2 0 0,1 2,17V9A2,2 0 0,1 4,7H5V5.5C5,4.12 6.12,3 7.5,3C8.75,3 9.79,3.92 9.97,5.13L11,10.65M13,19H20A2,2 0 0,0 22,17V9A2,2 0 0,0 20,7H19V5.5C19,4.12 17.88,3 16.5,3C15.25,3 14.21,3.92 14.03,5.13L13,10.65M11,19V13H13V19Z" />
      </svg>

      <p class="empty-text">
        Observations are records of your encounters with individual organisms at particular times and locations.
      </p>
    </div>

    <div class="fab-container">
      <q-btn
        round
        color="positive"
        icon="add"
        size="lg"
        class="shadow-4"
        @click="makeObservation"
      />
    </div>

  </div>
</template>

<style scoped>
/* Memastikan kontena memenuhi ruang yang disediakan oleh DashboardPage */
.data-section-container {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fafafa; /* Latar belakang kelabu sangat cerah seperti gambar */
}

/* Gaya untuk Nombor dan Label di Tab */
.stat-tab {
  padding: 10px 0;
}

.stat-number {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.65rem;
  letter-spacing: 0.5px;
}

/* Gaya Empty State (Teropong & Teks) */
.empty-state-container {
  padding: 0 2rem;
}

.empty-text {
  font-size: 1.1rem;
  line-height: 1.4;
  color: #757575;
  max-width: 320px;
}

/* Gaya untuk butang terapung (FAB) dan teks petunjuk */
.fab-container {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 10;
}

.fab-hint {
  font-size: 1.1rem;
  font-weight: 400;
  color: #6da235; /* Warna hijau 'positive' khas Quasar */
}

/* Menggantikan warna 'positive' default Quasar kepada hijau yang lebih sepadan jika perlu */
.bg-positive { background-color: #7cb342 !important; }
.text-positive { color: #7cb342 !important; }
</style>