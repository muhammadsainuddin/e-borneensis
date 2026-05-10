<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

const props = defineProps<{ 
  show: boolean,
  currentLocation: [number, number] | null,
  editData: any | null // Prop baharu untuk mod Edit
}>()

const emit = defineEmits(['close', 'saved'])

const categories = ['Bird', 'Mammal', 'Reptile', 'Amfibhian', 'Insect', 'Plant', 'Unidentified']

const form = reactive({
  id: null as number | null,
  category: '',
  species: '',
  notes: '',
  hasPhoto: 'no',
  photoUri: '', 
  date: new Date().toLocaleDateString(),
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  lat: null as number | null,
  lng: null as number | null,
  syncStatus: 'pending'
})

// Pantau jika ada data edit yang masuk
watch(() => props.editData, (newData) => {
  if (newData) {
    form.id = newData.id
    form.category = newData.category
    form.species = newData.species
    form.notes = newData.notes
    form.hasPhoto = newData.hasPhoto
    form.photoUri = newData.photoUri
    form.date = newData.date
    form.time = newData.time
    form.lat = newData.lat
    form.lng = newData.lng
    form.syncStatus = newData.syncStatus
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.id = null
  form.category = ''
  form.species = ''
  form.notes = ''
  form.hasPhoto = 'no'
  form.photoUri = ''
  form.date = new Date().toLocaleDateString()
  form.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  form.lat = null
  form.lng = null
  form.syncStatus = 'pending'
}

function closeDialog() {
  emit('close')
  setTimeout(() => resetForm(), 300) 
}

async function handleWithPhoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false, // Set false untuk kestabilan lebih baik di PWA
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt, // Ini akan memaparkan pilihan Kamera atau Galeri
    });

    if (image.webPath) {
      form.photoUri = image.webPath;
      form.hasPhoto = 'yes';
    }
  } catch (error) {
    console.error('Kamera dibatalkan atau bermasalah:', error);
  }
}

function handleNoPhoto() {
  form.hasPhoto = 'no'
  form.photoUri = ''
}

function submitObservation() {
  if (!form.category || !form.species) {
    alert('Sila pilih kategori dan masukkan nama spesies.')
    return
  }

  if (!form.id && !props.currentLocation) {
    alert('Sistem sedang mendapatkan lokasi GPS anda. Sila tunggu sebentar.')
    return
  }

  const existingRecords = JSON.parse(localStorage.getItem('encounters') || '[]')

  if (form.id) {
    const index = existingRecords.findIndex((r: any) => r.id === form.id)
    if (index > -1) {
      existingRecords[index] = { ...form, status: existingRecords[index].status || 'pending' }
      alert('Rekod berjaya dikemaskini!')
    }
  } else {
    const newRecord = {
      ...form,
      lng: props.currentLocation![0],
      lat: props.currentLocation![1],
      id: Date.now(),
      status: 'pending' // Tambah baris ini (Rekod baru akan sentiasa mula dengan status pending)
    }
    existingRecords.push(newRecord)
    alert('Rekod berjaya disimpan secara offline!')
  }

  localStorage.setItem('encounters', JSON.stringify(existingRecords))
  
  emit('saved') 
  closeDialog()
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans text-left">
      <div @click="closeDialog" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <Transition
        enter-active-class="transition duration-300 ease-out translate-y-full"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-200 ease-in translate-y-0"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div v-if="show" class="relative bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 class="text-lg font-bold text-black flex items-center gap-2 uppercase tracking-wide">
              {{ form.id ? 'Edit Encounter' : 'Submit an encounter' }}
            </h3>
            <button @click="closeDialog" class="p-2 hover:bg-gray-200 rounded-full text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto space-y-6">
            <div>
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-3">Encounter Type</label>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <button @click="handleWithPhoto" :class="['py-3 border-2 rounded-xl font-bold text-xs transition-all', form.hasPhoto === 'yes' ? 'border-green-800 bg-green-50 text-green-900' : 'border-gray-200 text-gray-400']">WITH PHOTO</button>
                <button @click="handleNoPhoto" :class="['py-3 border-2 rounded-xl font-bold text-xs transition-all', form.hasPhoto === 'no' ? 'border-green-800 bg-green-50 text-green-900' : 'border-gray-200 text-gray-400']">NO PHOTO</button>
              </div>

              <div v-if="form.photoUri" class="relative w-full h-40 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <img :src="form.photoUri" class="w-full h-full object-cover" alt="Captured Photo" />
                <button @click="handleWithPhoto" class="absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded-full backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2">Category</label>
              <select v-model="form.category" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-800/20 focus:border-green-800 font-medium outline-none">
                <option value="" disabled>Choose Category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-1">Species Name</label>
              <input v-model="form.species" type="text" placeholder="Enter species name" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-green-800 outline-none font-medium text-black" />
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-1">Notes</label>
              <textarea v-model="form.notes" rows="2" placeholder="Additional details..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-green-800 outline-none font-medium text-black"></textarea>
            </div>
          </div>

          <div class="p-6 pt-2 border-t border-gray-50 flex gap-3">
            <button @click="closeDialog" class="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">CANCEL</button>
            <button @click="submitObservation" class="flex-1 py-3 text-sm font-bold text-white bg-green-900 rounded-xl shadow-lg active:scale-95 transition-all">
              {{ form.id ? 'UPDATE RECORD' : 'SAVE RECORD' }}
            </button>
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>