<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()



const emit = defineEmits(['loading-finished'])

// Variable to control current slide
const slide = ref(1)

// Function to notify App.vue to hide this screen
function skipSplash() {
  router.push('/login')
}
</script>

<template>
  <div class="splash-container">
    
    <div class="app-branding">
      <img src="/logo/logo.png" alt="eBorneensis Logo" class="main-logo" />
    </div>

    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      navigation
      control-color="white"
      class="full-screen-carousel"
    >
      <q-carousel-slide :name="1" img-src="/splash/1.jpeg">
        <div class="overlay"></div>
        <div class="slide-content">
          <h2 class="slide-title">Discover Species</h2>
          <p class="slide-desc">Explore the rich biodiversity of Borneo with our comprehensive database.</p>
        </div>
      </q-carousel-slide>

      <q-carousel-slide :name="2" img-src="/splash/2.jpeg">
        <div class="overlay"></div>
        <div class="slide-content">
          <h2 class="slide-title">Record Sightings</h2>
          <p class="slide-desc">Help us monitor wildlife populations by reporting your encounters.</p>
        </div>
      </q-carousel-slide>

      <q-carousel-slide :name="3" img-src="/splash/3.jpeg">
        <div class="overlay"></div>
        <div class="slide-content">
          <h2 class="slide-title">Interactive Map</h2>
          <p class="slide-desc">View habitat distributions and track animal locations in real-time.</p>
        </div>
      </q-carousel-slide>
    </q-carousel>

    <div class="actions-container">
      <q-btn 
        v-if="slide < 3"
        flat 
        rounded 
        color="white" 
        label="Skip" 
        class="skip-btn"
        @click="skipSplash"
      />
      <q-btn 
        v-else
        unelevated 
        rounded 
        color="primary" 
        text-color="white"
        label="Get Started" 
        class="start-btn"
        @click="skipSplash"
      />
    </div>
  </div>
</template>

<style scoped>
.splash-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: #000;
}

.app-branding {
  position: absolute;
  top: 10%; 
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 10; 
}

.main-logo {
  max-width: 80%; /* Laraskan saiz mengikut kesesuaian logo anda */
  height: auto;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.5)); /* Tambah bayang supaya nampak jelas atas gambar */
}

.splash-title {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-size: 2.8rem;
  font-weight: 300;
  color: #F8D3D6; 
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8), 0px 0px 4px rgba(0, 0, 0, 0.5); 
}

.splash-subtitle {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #FFFFFF;
  letter-spacing: 3px;
  margin-top: 0px;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.9);
}

.full-screen-carousel {
  height: 100vh;
  width: 100vw;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.95) 100%);
  z-index: 1;
}

.slide-content {
  position: absolute;
  bottom: 20%; 
  left: 0;
  width: 100%;
  padding: 0 2rem;
  text-align: center;
  z-index: 2;
  color: white;
}

.slide-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  text-shadow: 2px 2px 6px rgba(250, 248, 248, 0.9);
}

.slide-desc {
  font-size: 1.1rem;
  opacity: 0.95;
  margin: 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.9);
}

.actions-container {
  position: absolute;
  bottom: 6%; 
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 3;
}

.skip-btn {
  font-size: 1rem;
  padding: 8px 32px;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.start-btn {
  font-size: 1.1rem;
  padding: 10px 36px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
</style>