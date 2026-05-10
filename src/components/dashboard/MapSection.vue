<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const $q = useQuasar()
const props = defineProps({ isActive: Boolean })

// --- Status Rangkaian (Online/Offline) ---
const isOnline = ref(navigator.onLine)
function updateOnlineStatus() { isOnline.value = navigator.onLine }

// --- GPS State ---
const trackingLocation = ref(true)
const lat = ref('Loading...')
const lng = ref('Loading...')
const altitude = ref('N/A')
const accuracy = ref('Loading...')
const accuracyValue = ref<number | null>(null) // Untuk pengiraan signal

let geoWatchId: number | null = null
let latestCoords: [number, number] | null = null

// Kira Signal Strength berdasarkan Accuracy GPS
const signalIcon = computed(() => {
  if (!trackingLocation.value || accuracyValue.value === null) return 'signal_cellular_off'
  if (accuracyValue.value <= 10) return 'signal_cellular_4_bar' // Sangat tepat (<10m)
  if (accuracyValue.value <= 50) return 'signal_cellular_3_bar' // Sederhana (<50m)
  if (accuracyValue.value <= 100) return 'signal_cellular_2_bar' // Lemah (<100m)
  return 'signal_cellular_1_bar' // Sangat lemah
})

const signalColor = computed(() => {
  if (!trackingLocation.value || accuracyValue.value === null) return 'grey-5'
  if (accuracyValue.value <= 15) return 'positive' // Hijau
  if (accuracyValue.value <= 50) return 'warning'  // Kuning
  return 'negative'                                // Merah
})

// --- Map State ---
let map: maplibregl.Map | null = null
const mapContainer = ref<HTMLElement | null>(null)
let userMarker: maplibregl.Marker | null = null

const currentStyle = ref(localStorage.getItem('mapStyle') || 'street')
const mapStyles = {
  street: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  sat: {
    version: 8,
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Esri'
      }
    },
    layers: [{ id: 'simple-tiles', type: 'raster', source: 'raster-tiles', minzoom: 0, maxzoom: 18 }]
  },
  topo: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
}

onMounted(() => {
  // Pasang listener untuk status internet
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  
  initMap()
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
  stopGPS()
  if (map) map.remove()
})

function initMap() {
  map = new maplibregl.Map({
    container: mapContainer.value!,
    style: mapStyles[currentStyle.value as keyof typeof mapStyles],
    center: [114.9317, 4.2076],
    zoom: 6,
    attributionControl: false
  })

  map.on('style.load', () => drawAccuracyCircle())
  map.on('load', () => { if (trackingLocation.value) startGPS() })
}

function switchMap(styleName: 'street' | 'sat' | 'topo') {
  if (map && currentStyle.value !== styleName) {
    currentStyle.value = styleName
    localStorage.setItem('mapStyle', styleName)
    map.setStyle(mapStyles[styleName])
    $q.notify({ message: `Switched to ${styleName.toUpperCase()}`, color: 'black', position: 'top', timeout: 1000 })
  }
}

watch(() => props.isActive, (newVal) => {
  if (newVal && map) nextTick(() => map!.resize())
})

function toggleGPS() {
  trackingLocation.value = !trackingLocation.value
  if (trackingLocation.value) {
    startGPS()
    $q.notify({ message: 'GPS Started', color: 'black', position: 'top', timeout: 1000 })
  } else {
    stopGPS()
    $q.notify({ message: 'GPS Paused', color: 'grey-8', position: 'top', timeout: 1000 })
  }
}

function startGPS() {
  if ('geolocation' in navigator) {
    geoWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, altitude: alt, accuracy: acc } = position.coords
        lat.value = latitude.toFixed(6)
        lng.value = longitude.toFixed(6)
        altitude.value = alt ? alt.toFixed(1) + ' m' : '0.0 m'
        accuracy.value = acc.toFixed(1) + ' m'
        
        accuracyValue.value = acc
        latestCoords = [longitude, latitude]

        if (map) {
          if (props.isActive) map.flyTo({ center: latestCoords, zoom: 16, speed: 0.8 })
          
          if (!userMarker) {
            userMarker = new maplibregl.Marker({ color: '#000000' }).setLngLat(latestCoords).addTo(map)
          } else {
            userMarker.setLngLat(latestCoords)
          }
          drawAccuracyCircle()
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    )
  }
}

function stopGPS() {
  if (geoWatchId !== null) {
    navigator.geolocation.clearWatch(geoWatchId)
    geoWatchId = null
    accuracyValue.value = null // Reset signal
  }
}

function createGeoJSONCircle(center: [number, number], radiusInMeters: number, points = 64) {
  const km = radiusInMeters / 1000
  const ret = []
  const distanceX = km / (111.320 * Math.cos(center[1] * Math.PI / 180))
  const distanceY = km / 110.574
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI)
    const x = distanceX * Math.cos(theta)
    const y = distanceY * Math.sin(theta)
    ret.push([center[0] + x, center[1] + y])
  }
  ret.push(ret[0])
  return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [ret] } }
}

function drawAccuracyCircle() {
  if (!map || !map.isStyleLoaded() || !latestCoords || accuracyValue.value === null) return

  const circleFeature = createGeoJSONCircle(latestCoords, accuracyValue.value)
  const source = map.getSource('accuracy-source') as maplibregl.GeoJSONSource

  if (source) {
    source.setData(circleFeature as any)
  } else {
    map.addSource('accuracy-source', { type: 'geojson', data: circleFeature as any })
    map.addLayer({
      id: 'accuracy-fill', type: 'fill', source: 'accuracy-source',
      paint: { 'fill-color': '#000000', 'fill-opacity': 0.1 }
    })
    map.addLayer({
      id: 'accuracy-stroke', type: 'line', source: 'accuracy-source',
      paint: { 'line-color': '#000000', 'line-width': 1 }
    })
  }
}
</script>

<template>
  <div class="full-height-content relative-position">
    
    <div ref="mapContainer" class="map-container"></div>
    
    <q-card class="absolute-top-left q-ma-sm shadow-4 bg-white" style="z-index: 10; min-width: 200px; border-radius: 12px;">
      
      <q-card-section class="q-pa-sm bg-grey-2 row items-center justify-between" style="border-radius: 12px 12px 0 0;">
        <div class="row items-center q-gutter-xs">
          <q-icon name="gps_fixed" size="xs" color="black" />
          <span class="text-caption text-weight-bold text-black">GPS STATUS</span>
        </div>
        <div class="row q-gutter-xs">
          <q-icon :name="isOnline ? 'wifi' : 'wifi_off'" :color="isOnline ? 'black' : 'negative'" size="sm" />
          <q-icon :name="signalIcon" :color="signalColor" size="sm" />
        </div>
      </q-card-section>
      
      <q-separator />
      
      <q-card-section class="q-pa-sm">
        <div class="row text-caption" style="font-family: monospace; font-size: 0.85rem;">
          <div class="col-3 text-grey-7 text-weight-bold">LAT</div>
          <div class="col-9 text-right text-black text-weight-bold">{{ lat }}</div>
          
          <div class="col-3 text-grey-7 text-weight-bold">LNG</div>
          <div class="col-9 text-right text-black text-weight-bold">{{ lng }}</div>
          
          <div class="col-3 text-grey-7 text-weight-bold">ALT</div>
          <div class="col-9 text-right text-black text-weight-bold">{{ altitude }}</div>
          
          <div class="col-3 text-grey-7 text-weight-bold">ACC</div>
          <div class="col-9 text-right text-black text-weight-bold">{{ accuracy }}</div>
        </div>
      </q-card-section>

    </q-card>

    <q-btn-group rounded class="absolute-bottom-left q-ma-md shadow-4 bg-white" style="z-index: 10;">
      <q-btn 
        flat size="sm" class="q-px-sm text-weight-bold"
        :color="currentStyle === 'street' ? 'black' : 'grey-7'" 
        label="Street" @click="switchMap('street')" 
      />
      <q-btn 
        flat size="sm" class="q-px-sm text-weight-bold"
        :color="currentStyle === 'sat' ? 'black' : 'grey-7'" 
        label="Sat" @click="switchMap('sat')" 
      />
      <q-btn 
        flat size="sm" class="q-px-sm text-weight-bold"
        :color="currentStyle === 'topo' ? 'black' : 'grey-7'" 
        label="Topo" @click="switchMap('topo')" 
      />
    </q-btn-group>

    <q-btn 
      class="absolute-bottom-right shadow-4" 
      style="z-index: 10; margin-bottom: 90px; margin-right: 18px;" 
      round 
      :color="trackingLocation ? 'white' : 'grey-3'" 
      :text-color="trackingLocation ? 'black' : 'grey-6'" 
      :icon="trackingLocation ? 'my_location' : 'location_disabled'" 
      @click="toggleGPS" 
    />

  </div>
</template>

<style scoped>
/* CSS kini sangat nipis, hanya untuk layout asas peta */
.full-height-content {
  height: 100%;
  width: 100%;
}
.map-container {
  width: 100%;
  height: 100%;
}
</style>