<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { dummyData } from '../../data/dummyData'

const props = defineProps<{ refreshTrigger: number }>()
const emit = defineEmits(['edit-record', 'refresh-needed'])

const currentTab = ref('observations')
const records = ref<any[]>([])
const searchQuery = ref('') 

// State untuk Modal Butiran (View Details)
const selectedRecord = ref<any | null>(null)

function loadRecords() {
  let savedData = JSON.parse(localStorage.getItem('encounters') || '[]')
  
  if (savedData.length === 0) {
    localStorage.setItem('encounters', JSON.stringify(dummyData))
    savedData = dummyData
  }

  records.value = savedData
  records.value.sort((a, b) => b.id - a.id)
}

onMounted(() => {
  loadRecords()
})

watch(() => props.refreshTrigger, () => {
  loadRecords()
})

// --- Computed Properties ---
const filteredRecords = computed(() => {
  if (!searchQuery.value) return records.value
  const q = searchQuery.value.toLowerCase()
  return records.value.filter(r => 
    r.species?.toLowerCase().includes(q) || 
    r.category?.toLowerCase().includes(q) ||
    (r.notes && r.notes.toLowerCase().includes(q))
  )
})

const observationsCount = computed(() => filteredRecords.value.length)

const speciesList = computed(() => {
  const speciesMap = new Map()
  filteredRecords.value.forEach(r => {
    if (!speciesMap.has(r.species)) {
      speciesMap.set(r.species, { category: r.category, count: 0 })
    }
    speciesMap.get(r.species).count++
  })
  return Array.from(speciesMap, ([name, data]) => ({ name, ...data }))
})
const speciesCount = computed(() => speciesList.value.length)

const identifiedRecords = computed(() => filteredRecords.value.filter(r => r.status === 'identified'))
const identificationsCount = computed(() => identifiedRecords.value.length)

// --- Actions ---
function deleteRecord(id: number) {
  if (confirm('Are you sure you want to delete this record?')) {
    records.value = records.value.filter(r => r.id !== id)
    localStorage.setItem('encounters', JSON.stringify(records.value))
    emit('refresh-needed') 
  }
}

function syncRecord(id: number) {
  const index = records.value.findIndex(r => r.id === id)
  if (index > -1) {
    if (!navigator.onLine) {
      alert('No internet connection for syncing.')
      return
    }
    records.value[index].syncStatus = 'synced'
    localStorage.setItem('encounters', JSON.stringify(records.value))
    alert('Record successfully synced with the server!')
    emit('refresh-needed')
  }
}

function editRecord(record: any) {
  emit('edit-record', record)
}

function openDetails(record: any) {
  selectedRecord.value = record
}

function closeDetails() {
  selectedRecord.value = null
}
</script>

<template>
  <div class="absolute inset-0 flex flex-col w-full h-full bg-[#f4f6f8]">
    
    <div class="flex justify-between bg-white shadow-sm text-gray-500 z-10 shrink-0 border-b border-gray-100">
      <button @click="currentTab = 'observations'" :class="['flex-1 py-3 border-b-2 transition-colors', currentTab === 'observations' ? 'border-green-800 text-green-800' : 'border-transparent']">
        <div :class="['text-xl font-bold leading-none mb-1', currentTab === 'observations' ? 'text-green-800' : 'text-black']">{{ observationsCount }}</div>
        <div class="text-[10px] tracking-wide font-bold">OBSERVATIONS</div>
      </button>
      <button @click="currentTab = 'species'" :class="['flex-1 py-3 border-b-2 transition-colors', currentTab === 'species' ? 'border-green-800 text-green-800' : 'border-transparent']">
        <div :class="['text-xl font-bold leading-none mb-1', currentTab === 'species' ? 'text-green-800' : 'text-black']">{{ speciesCount }}</div>
        <div class="text-[10px] tracking-wide font-bold">SPECIES</div>
      </button>
      <button @click="currentTab = 'identifications'" :class="['flex-1 py-3 border-b-2 transition-colors', currentTab === 'identifications' ? 'border-green-800 text-green-800' : 'border-transparent']">
        <div :class="['text-xl font-bold leading-none mb-1', currentTab === 'identifications' ? 'text-green-800' : 'text-black']">{{ identificationsCount }}</div>
        <div class="text-[10px] tracking-wide font-bold">IDENTIFIED</div>
      </button>
    </div>

    <div class="px-4 py-3 bg-[#f4f6f8] shrink-0 z-10">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search species, category or notes..." 
          class="w-full pl-12 pr-4 py-3 bg-white rounded-full text-sm shadow-sm focus:ring-2 focus:ring-green-800/30 border border-transparent outline-none transition-all placeholder:text-gray-400 font-medium text-black"
        />
      </div>
    </div>

    <div class="flex-grow overflow-y-auto px-4 pb-24">
      
      <div v-if="currentTab === 'observations'">
        <div v-if="filteredRecords.length === 0" class="h-40 flex flex-col items-center justify-center text-center opacity-70">
          <p class="text-sm font-medium text-gray-500">No records found.</p>
        </div>

        <div v-else v-for="record in filteredRecords" :key="record.id" class="bg-white rounded-[24px] shadow-sm border border-gray-100 p-4 mb-4 flex flex-col gap-3 transition-transform active:scale-[0.98]">
          <div class="flex gap-4 cursor-pointer" @click="openDetails(record)">
            <img v-if="record.hasPhoto === 'yes' && record.photoUri" :src="record.photoUri" class="w-[84px] h-[84px] rounded-[16px] object-cover bg-gray-100 shrink-0" />
            <div v-else class="w-[84px] h-[84px] rounded-[16px] bg-[#f0f4f8] flex items-center justify-center shrink-0">
              <span class="text-[9px] text-gray-400 font-bold tracking-widest uppercase">No Photo</span>
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <p class="text-[10px] uppercase font-bold text-green-700 tracking-wider mb-0.5">{{ record.category }}</p>
              <h4 class="font-extrabold text-black text-lg leading-tight truncate mb-1">{{ record.species }}</h4>
              
              <div class="flex items-center gap-2 mb-1.5">
                <span v-if="record.syncStatus === 'pending'" class="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[9px] font-bold rounded-md">PENDING</span>
                <span v-else class="px-2 py-0.5 bg-green-100 text-green-800 text-[9px] font-bold rounded-md">SYNCED</span>
                <span v-if="record.status === 'identified'" class="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded-md">VERIFIED</span>
              </div>
              
              <p class="text-[10px] font-semibold text-gray-500">{{ record.date }} &bull; {{ record.time }}</p>
            </div>
          </div>
          
          <div class="flex gap-2 pt-2">
            <button @click="openDetails(record)" class="flex-1 py-2 text-xs font-bold text-green-900 bg-green-50 rounded-full hover:bg-green-100 transition-colors">DETAILS</button>
            <button @click="editRecord(record)" class="flex-1 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">EDIT</button>
            <button @click="syncRecord(record.id)" :disabled="record.syncStatus === 'synced'" class="flex-1 py-2 text-xs font-bold text-blue-900 bg-blue-50 rounded-full disabled:opacity-40 transition-colors">SYNC</button>
            <button @click="deleteRecord(record.id)" class="px-4 py-2 text-xs font-bold text-red-900 bg-red-50 rounded-full hover:bg-red-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'species'">
        <div v-for="sp in speciesList" :key="sp.name" class="bg-white rounded-[20px] shadow-sm border border-gray-100 p-4 mb-3 flex justify-between items-center">
          <div>
            <h4 class="font-extrabold text-black text-[17px]">{{ sp.name }}</h4>
            <p class="text-[10px] uppercase font-bold text-green-700 tracking-wider mt-0.5">{{ sp.category }}</p>
          </div>
          <div class="bg-green-50 text-green-900 font-bold px-4 py-2 rounded-full text-sm">
            {{ sp.count }}
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'identifications'">
        <div v-if="identifiedRecords.length === 0" class="h-40 flex flex-col items-center justify-center text-center opacity-70">
          <p class="text-sm font-medium text-gray-500">No verified records found.</p>
        </div>

        <div v-else v-for="record in identifiedRecords" :key="'id-'+record.id" @click="openDetails(record)" class="bg-white rounded-[24px] shadow-sm border border-gray-100 p-4 mb-4 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform">
          <div class="absolute top-0 right-0 bg-blue-100 text-blue-900 text-[9px] font-bold px-4 py-1.5 rounded-bl-xl tracking-widest">
            VERIFIED
          </div>

          <div class="flex gap-4 mb-3 pt-2">
            <img v-if="record.hasPhoto === 'yes' && record.photoUri" :src="record.photoUri" class="w-[84px] h-[84px] rounded-[16px] object-cover bg-gray-100 shrink-0" />
            <div class="flex-1 min-w-0">
              <h4 class="font-extrabold text-black text-xl truncate mb-1">{{ record.species }}</h4>
              <p class="text-[10px] uppercase font-bold text-green-700 tracking-wider mb-2">{{ record.category }}</p>
              <p class="text-[10px] font-bold text-gray-500 flex items-center gap-1">{{ record.date }} &bull; {{ record.time }}</p>
            </div>
          </div>
          
          <div class="mt-3 p-3 bg-blue-50/50 rounded-xl">
             <div class="flex items-center gap-1.5 mb-1">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-700" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
               <p class="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Admin Note</p>
             </div>
             <p class="text-[11px] leading-relaxed text-blue-900 font-medium">{{ record.adminNotes }}</p>
          </div>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="selectedRecord" class="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:p-4">
        
        <div @click="closeDetails" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <Transition
          enter-active-class="transition duration-300 ease-out translate-y-full"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="transition duration-200 ease-in translate-y-0"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <div v-if="selectedRecord" class="relative bg-[#f4f6f8] w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col h-[88vh]">
            
            <div class="w-full flex justify-center pt-3 pb-1 shrink-0 bg-white rounded-t-[32px]" @click="closeDetails">
              <div class="w-10 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div class="bg-white px-6 pb-4 shrink-0 shadow-sm z-10 flex justify-between items-start">
              <div>
                <p class="text-[10px] uppercase font-bold text-green-700 tracking-wider mb-1">{{ selectedRecord.category }}</p>
                <h2 class="text-2xl font-black text-black leading-tight">{{ selectedRecord.species }}</h2>
              </div>
              <button @click="closeDetails" class="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div class="p-4 overflow-y-auto flex-grow space-y-4">
              
              <div v-if="selectedRecord.hasPhoto === 'yes' && selectedRecord.photoUri" class="bg-white rounded-[24px] p-2 shadow-sm">
                <img :src="selectedRecord.photoUri" class="w-full h-56 object-cover rounded-[16px]" />
                <div v-if="selectedRecord.additionalImages && selectedRecord.additionalImages.length > 0" class="flex gap-2 mt-2 overflow-x-auto pb-1">
                  <img v-for="(img, i) in selectedRecord.additionalImages" :key="i" :src="img" class="w-16 h-16 object-cover rounded-xl" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="bg-white p-4 rounded-[20px] shadow-sm">
                  <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date & Time</span>
                  <span class="text-sm font-bold text-gray-800">{{ selectedRecord.date }}<br/>{{ selectedRecord.time }}</span>
                </div>
                <div class="bg-white p-4 rounded-[20px] shadow-sm">
                  <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Location GPS</span>
                  <span v-if="selectedRecord.lat && selectedRecord.lng" class="text-sm font-bold text-gray-800">
                    {{ selectedRecord.lat }}<br/>{{ selectedRecord.lng }}
                  </span>
                  <span v-else class="text-sm font-bold text-gray-800">Not recorded</span>
                </div>
              </div>

              <div class="bg-white p-4 rounded-[20px] shadow-sm space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase">Recorded By</span>
                    <span class="text-sm font-bold text-black">{{ selectedRecord.recordedBy || 'User' }}</span>
                  </div>
                </div>

                <div v-if="selectedRecord.status === 'identified'" class="flex items-center gap-3 border-t border-gray-100 pt-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase">Verified By</span>
                    <span class="text-sm font-bold text-black">{{ selectedRecord.verifiedBy }}</span>
                  </div>
                </div>
              </div>

               <div v-if="selectedRecord.status === 'identified' && selectedRecord.adminNotes" class="bg-blue-50/50 p-4 rounded-[20px] border border-blue-100">
                <span class="block text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1.5">Verification Notes</span>
                <p class="text-sm text-blue-900 leading-relaxed font-medium">{{ selectedRecord.adminNotes }}</p>
              </div>

              <div class="bg-white p-4 rounded-[20px] shadow-sm">
                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Observer Notes</span>
                <p class="text-sm text-gray-800 leading-relaxed italic border-l-2 border-gray-200 pl-3 mb-4">"{{ selectedRecord.notes || 'No notes provided.' }}"</p>
                
                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Species Description</span>
                <p class="text-sm text-gray-700 leading-relaxed">{{ selectedRecord.description || 'No description available in the database yet.' }}</p>
              </div>

            </div>

          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>