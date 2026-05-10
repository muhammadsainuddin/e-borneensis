<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const slide = ref(1)
const totalSlides = 3

function nextSlide() {
  if (slide.value < totalSlides) {
    slide.value++
  }
}

function skipSplash() {
  router.push('/login')
}
</script>

<template>
  <div class="fixed inset-0 w-full h-full z-[9999] bg-black text-white font-sans">
    
    <div class="absolute top-[10%] left-0 w-full text-center z-10">
      <img src="/logo/logo.png" alt="eBorneensis Logo" class="max-w-[80%] h-auto drop-shadow-lg mx-auto" />
    </div>

    <div class="relative w-full h-full overflow-hidden">
      <div v-show="slide === 1" class="absolute inset-0 w-full h-full transition-opacity duration-500">
        <img src="/splash/1.jpeg" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 to-black/95 z-0"></div>
        <div class="absolute bottom-[20%] left-0 w-full px-8 text-center z-10">
          <h2 class="text-3xl font-bold mb-2 drop-shadow-md">Discover Species</h2>
          <p class="text-lg opacity-95 drop-shadow-sm">Explore the rich biodiversity of Borneo with our comprehensive database.</p>
        </div>
      </div>

      <div v-show="slide === 2" class="absolute inset-0 w-full h-full transition-opacity duration-500">
        <img src="/splash/2.jpeg" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 to-black/95 z-0"></div>
        <div class="absolute bottom-[20%] left-0 w-full px-8 text-center z-10">
          <h2 class="text-3xl font-bold mb-2 drop-shadow-md">Record Sightings</h2>
          <p class="text-lg opacity-95 drop-shadow-sm">Help us monitor wildlife populations by reporting your encounters.</p>
        </div>
      </div>

      <div v-show="slide === 3" class="absolute inset-0 w-full h-full transition-opacity duration-500">
        <img src="/splash/3.jpeg" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 to-black/95 z-0"></div>
        <div class="absolute bottom-[20%] left-0 w-full px-8 text-center z-10">
          <h2 class="text-3xl font-bold mb-2 drop-shadow-md">Interactive Map</h2>
          <p class="text-lg opacity-95 drop-shadow-sm">View habitat distributions and track animal locations in real-time.</p>
        </div>
      </div>
    </div>

    <div class="absolute bottom-[6%] left-0 w-full flex justify-center items-center gap-4 z-20">
      <button 
        v-if="slide < 3" 
        @click="skipSplash" 
        class="text-base px-6 py-2 bg-white/10 backdrop-blur-md rounded-full drop-shadow-md hover:bg-white/20 transition duration-300"
      >
        Skip
      </button>
      <button 
        v-if="slide < 3" 
        @click="nextSlide" 
        class="text-base px-8 py-2 bg-white/20 backdrop-blur-md rounded-full drop-shadow-md hover:bg-white/30 transition duration-300"
      >
        Next
      </button>
      <button 
        v-if="slide === 3" 
        @click="skipSplash" 
        class="text-lg px-10 py-3 font-bold bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Get Started
      </button>
    </div>
  </div>
</template>