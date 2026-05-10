<script setup lang="ts">
import { computed } from 'vue'

// Terima state 'tab' dari DashboardPage.vue menggunakan v-model
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'open-mark-dialog'])

// Senarai tab, meniru ikon dalam gambar (Outline bila tak aktif, Solid bila aktif)
const tabs = [
  { id: 'data', icon: 'chat_bubble_outline', activeIcon: 'chat_bubble' },
  { id: 'maps', icon: 'description_outline', activeIcon: 'description' },
  { id: 'profile', icon: 'person_outline', activeIcon: 'person' }
]

// Kira kedudukan (index) untuk menggerakkan garis indikator hitam
const activeIndex = computed(() => tabs.findIndex(t => t.id === props.modelValue))

function selectTab(id: string) {
  emit('update:modelValue', id) // Tukar tab di DashboardPage
}
</script>

<template>
  <div class="bottom-bar-wrapper">
    
    <div class="tabs-box shadow-4">
      
      <div class="indicator-track">
        <div class="indicator" :style="{ transform: `translateX(${activeIndex * 100}%)` }">
          <div class="indicator-dash"></div>
        </div>
      </div>

      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: modelValue === tab.id }"
        @click="selectTab(tab.id)"
      >
        <q-icon :name="modelValue === tab.id ? tab.activeIcon : tab.icon" size="sm" class="tab-icon" />
      </div>
    </div>

    <div class="fab-box">
      <q-btn 
        round 
        color="black" 
        icon="add" 
        size="md" 
        class="shadow-4 fab-btn" 
        @click="$emit('open-mark-dialog')" 
      />
    </div>

  </div>
</template>

<style scoped>
/* Pembalut utama (Flexbox yang stabil, tiada posisi absolute melampau) */
.bottom-bar-wrapper {
  display: flex;
  align-items: flex-end; /* Pastikan semua rapat ke bawah */
  padding: 0 16px 16px 16px; /* Jarak selamat dari hujung skrin */
  gap: 16px; /* Jarak antara kotak tab dan butang marker (menghasilkan efek notch) */
  width: 100%;
  pointer-events: none; /* Benarkan klik tembus ruang kosong pada peta */
}

/* --- Kotak Tab Kiri --- */
.tabs-box {
  flex: 1; /* Ambil semua baki ruang di sebelah kiri */
  height: 60px;
  background-color: #f5f5f5; /* Kelabu pudar ikut tema B&W */
  border-radius: 24px;
  display: flex;
  position: relative;
  pointer-events: auto; /* Aktifkan klik di kawasan ini */
  overflow: hidden;
}

/* Trek dan Animasi Indikator Atas */
.indicator-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}

.indicator {
  width: 33.333%; /* 3 butang, jadi 1 bahagian = 33.333% */
  height: 100%;
  display: flex;
  justify-content: center;
  /* Animasi meluncur dengan efek 'melantun/elastik' yang lancar */
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.indicator-dash {
  width: 35%; /* Panjang garisan hitam seperti dalam gambar */
  height: 100%;
  background-color: #000;
  border-radius: 0 0 4px 4px; /* Membulat di bahagian bawah garisan */
}

/* Butang Tab */
.tab-btn {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9e9e9e; /* Warna kelabu bila tak aktif */
  cursor: pointer;
  transition: color 0.3s ease;
}

.tab-icon {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tab-btn.active {
  color: #000; /* Warna hitam legap bila aktif */
}

.tab-btn.active .tab-icon {
  transform: translateY(-2px) scale(1.15); /* Naik sikit dan membesar bila ditekan */
}

/* --- Butang FAB Kanan --- */
.fab-box {
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  margin-bottom: 2px; /* Melaraskan posisi vertikal dengan tab-box */
}

.fab-btn {
  transition: transform 0.2s ease;
}
.fab-btn:active {
  transform: scale(0.9); /* Animasi mengecut apabila butang Add ditekan */
}
</style>