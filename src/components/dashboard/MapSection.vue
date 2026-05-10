<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import maplibregl, { type StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
// Import data dummy
import { dummyData } from '../../data/dummyData'

const props = defineProps<{ 
  isActive: boolean,
  refreshTrigger: number 
}>()

const emit = defineEmits(['location-update'])

// --- Status Rangkaian (Online/Offline) ---
const isOnline = ref(navigator.onLine)
function updateOnlineStatus() { isOnline.value = navigator.onLine }

// --- GPS State ---
const trackingLocation = ref(true)
const lat = ref('Loading...')
const lng = ref('Loading...')
const altitude = ref('N/A')
const accuracy = ref('Loading...')
const accuracyValue = ref<number | null>(null)

let geoWatchId: number | null = null
let latestCoords: [number, number] | null = null

const signalColorClass = computed(() => {
  if (!trackingLocation.value || accuracyValue.value === null) return 'text-gray-400'
  if (accuracyValue.value <= 15) return 'text-green-500' 
  if (accuracyValue.value <= 50) return 'text-yellow-500' 
  return 'text-red-500'                             
})

// --- Map State ---
let map: maplibregl.Map | null = null
const mapContainer = ref<HTMLElement | null>(null)
let userMarker: maplibregl.Marker | null = null
let encounterMarkers: maplibregl.Marker[] = [] 

const currentStyle = ref(localStorage.getItem('mapStyle') || 'street')
const mapStyles: Record<string, string | StyleSpecification> = {
  street: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  sat: {
    version: 8,
    sources: {
      'raster-tiles': { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, attribution: 'Esri' }
    },
    layers: [{ id: 'simple-tiles', type: 'raster', source: 'raster-tiles', minzoom: 0, maxzoom: 18 }]
  } as StyleSpecification, // <--- TAMBAH 'as StyleSpecification' DI SINI
  topo: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
}

onMounted(() => {
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
  map.on('load', () => { 
    if (trackingLocation.value) startGPS() 
    loadEncounters() 
  })
}

// Fungsi untuk memuatkan rekod dan melukis marker
function loadEncounters() {
  if (!map) return

  encounterMarkers.forEach(m => m.remove())
  encounterMarkers = []

  let records = JSON.parse(localStorage.getItem('encounters') || '[]')

  // MASUKKAN DATA DUMMY JIKA LOCALSTORAGE KOSONG (First Time Load)
  if (records.length === 0) {
    localStorage.setItem('encounters', JSON.stringify(dummyData))
    records = dummyData
  }
  
  records.forEach((record: any) => {
    if (!record.lat || !record.lng) return

    const imgHtml = record.hasPhoto === 'yes' && record.photoUri
      ? `<img src="${record.photoUri}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px; margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);" />`
      : `<div style="width: 100%; height: 80px; background: #f3f4f6; border-radius: 8px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 11px; font-weight: bold; letter-spacing: 1px;">NO PHOTO</div>`

    const popupHtml = `
      <div style="font-family: ui-sans-serif, system-ui, sans-serif; color: #000; min-width: 180px; padding: 2px;">
        ${imgHtml}
        <h4 style="margin: 0 0 2px 0; font-weight: 800; font-size: 16px; color: #14532d;">${record.species}</h4>
        <p style="margin: 0 0 8px 0; font-size: 10px; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">${record.category}</p>
        <p style="margin: 0 0 10px 0; font-size: 13px; line-height: 1.4; color: #374151;">${record.notes || 'Tiada deskripsi tambahan.'}</p>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 8px; font-size: 10px; color: #9ca3af; display: flex; justify-content: space-between;">
          <span>${record.date}</span>
          <span>${record.time}</span>
        </div>
      </div>
    `

    const popup = new maplibregl.Popup({ offset: [0, -15], closeButton: true, maxWidth: '280px' })
      .setHTML(popupHtml)

    const el = document.createElement('div')
    el.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#14532d" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.4)); cursor: pointer;">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
      </svg>
    `

    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([record.lng, record.lat])
      .setPopup(popup)
      .addTo(map!)
    
    encounterMarkers.push(marker)
  })
}

watch(() => props.refreshTrigger, () => {
  loadEncounters()
})

function switchMap(styleName: 'street' | 'sat' | 'topo') {
  if (map && currentStyle.value !== styleName) {
    currentStyle.value = styleName
    localStorage.setItem('mapStyle', styleName)
    map.setStyle(mapStyles[styleName])
  }
}

watch(() => props.isActive, (newVal) => {
  if (newVal && map) nextTick(() => map!.resize())
})

function toggleGPS() {
  trackingLocation.value = !trackingLocation.value
  if (trackingLocation.value) startGPS()
  else stopGPS()
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

        emit('location-update', latestCoords)

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
    accuracyValue.value = null 
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
  <div class="h-full w-full relative">
    
    <div ref="mapContainer" class="w-full h-full"></div>
    
    <div class="absolute top-4 left-4 right-4 shadow-lg bg-white/60 backdrop-blur-md border border-white/50 rounded-xl z-10 overflow-hidden">
      
      <div class="py-1 px-3 bg-white/40 flex items-center justify-between border-b border-white/60">
        <div class="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span class="text-[10px] font-bold text-black tracking-wider">GPS STATUS</span>
        </div>
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="isOnline ? 'text-black' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.906 14.142 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="[signalColorClass, trackingLocation && accuracyValue !== null ? 'animate-pulse' : '']" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 22h20V2L2 22z" />
          </svg>
        </div>
      </div>
      
      <div class="py-1.5 px-3">
        <div class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] font-mono">
          <div class="flex justify-between items-center">
            <span class="text-gray-700 font-bold uppercase text-[9px]">Latitude</span>
            <span class="text-black font-bold">{{ lat }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-700 font-bold uppercase text-[9px]">Altitude</span>
            <span class="text-black font-bold">{{ altitude }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-700 font-bold uppercase text-[9px]">Longitude</span>
            <span class="text-black font-bold">{{ lng }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-700 font-bold uppercase text-[9px]">Accuracy</span>
            <span class="text-black font-bold">{{ accuracy }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-6 left-4 flex shadow-md bg-white rounded-full overflow-hidden border border-gray-200 z-10">
      <button @click="switchMap('street')" :class="['px-3 py-1.5 text-xs font-bold transition-colors', currentStyle === 'street' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50']">Street</button>
      <button @click="switchMap('sat')" :class="['px-3 py-1.5 text-xs font-bold border-l border-r border-gray-200 transition-colors', currentStyle === 'sat' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50']">Sat</button>
      <button @click="switchMap('topo')" :class="['px-3 py-1.5 text-xs font-bold transition-colors', currentStyle === 'topo' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50']">Topo</button>
    </div>

    <button 
      @click="toggleGPS" 
      :class="['absolute bottom-[100px] right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors z-10', trackingLocation ? 'bg-white text-black' : 'bg-gray-200 text-gray-500']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>

  </div>
</template>

<style>
.maplibregl-popup-content {
  border-radius: 16px !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #f3f4f6 !important;
  padding: 12px !important;
}
.maplibregl-popup-close-button {
  font-size: 20px;
  color: #9ca3af;
  right: 8px !important;
  top: 6px !important;
}
.maplibregl-popup-close-button:hover {
  background-color: transparent !important;
  color: #000 !important;
}
</style>