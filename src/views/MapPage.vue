<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <SearchBar
        class="search-bar"
        :stations="baseStations"
        @locate="refreshLocation"
        @goTo="openLocation"
        @openStation="openModal"
      />
      <div id="map" />
      <StationModal :station="station_modal" @close="closeModal" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref, inject, watch } from 'vue';
import { IonPage, IonContent, onIonViewDidEnter } from '@ionic/vue';
import { useRoute } from 'vue-router';
import { Geolocation } from '@capacitor/geolocation';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Station, StationModalType } from '@/types';
import type { VLilleApiService } from '@/plugins/api';
import SearchBar from '@/components/SearchBar.vue';
import StationModal from '@/components/StationModal.vue';
import { useStationMarkers } from '@/composables/useStationMarkers';


const interval = 300000;
const defaultPos = { latitude: 50.62925, longitude: 3.057256 };
const vlilleApi = inject<VLilleApiService>('vlilleApi')!;
const route = useRoute();
const { createStationMarker, createUserLocationIcon, createHereMarker, updateMarkerIcon } = useStationMarkers();
const station_modal = ref<StationModalType>({
  station_id: "",
  open: false,
  name: "",
  bikes: 0,
  spots_available: 0,
  update: new Date(),
  lat: defaultPos.latitude,
  lon: defaultPos.longitude,
});
const stations = ref<Record<string, Station>>({});
const markers: Record<string, L.Marker> = {};
const baseStations = ref<Station[]>([]);
let here_marker: L.Marker | null = null;
let self_marker: L.Marker | null = null;
let map: L.Map | null = null;
let markerCluster: L.MarkerClusterGroup;


function openLocation(location: { lat: number, lon: number }) {
  map?.setView([location.lat, location.lon], 16);
  if (self_marker) {
        self_marker.setLatLng([location.lat, location.lon]);
    } else {
      self_marker = L.marker(
        [location.lat, location.lon],
        { icon: createUserLocationIcon() }
      ).addTo(map!);
    }
}

function refreshLocation() {
  Geolocation.getCurrentPosition().catch(() => ({ coords: defaultPos })).then(position => {
    openLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
  });
}

async function refreshStation() {
  try {
    stations.value = await vlilleApi.getStationStatus();
    
    Object.values(stations.value).forEach(station => {
      if (markers[station.station_id]) {
        updateMarkerIcon(markers[station.station_id], station, 'medium');
      }
    });
  } catch (error) {
    console.error("Erreur lors du rafraîchissement des stations:", error);
  }
}

function closeModal() {
  here_marker?.setZIndexOffset(-1000);
  here_marker?.setOpacity(0);
  station_modal.value.open = false;
  map?.setZoom(16);
}

function openModal(station: Station) {
  const s = stations.value[station.station_id];

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  map?.setView([station.lat, station.lon], 17);
  refreshStation().then(() => {
    if (here_marker) {
      here_marker.setLatLng([station.lat, station.lon]);
      here_marker.setOpacity(1);
      here_marker.setZIndexOffset(1000);
    } else {
      here_marker = L.marker([station.lat, station.lon], {
        icon: createHereMarker()
      }).addTo(map!);
    }
  });
  station_modal.value = {
    station_id: station.station_id,
    open: true,
    name: station.name || `Station ${station.station_id}`,
    bikes: s.num_bikes_available,
    spots_available: s.num_docks_available,
    update: new Date(s.last_reported * 1000),
    lat: station.lat,
    lon: station.lon,
  };
}

async function loadMarkers(map: L.Map) {
  try {
    markerCluster = L.markerClusterGroup({
      chunkedLoading: true,
      chunkInterval: 200,
      chunkDelay: 50,

      iconCreateFunction: function(cluster) {
        const childCount = cluster.getChildCount();
        let c = ' marker-cluster-';
        if (childCount < 10) {
          c += 'small';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }
        
        return new L.DivIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster' + c,
          iconSize: new L.Point(40, 40)
        });
      }
    });
    
    baseStations.value = await vlilleApi.getStationInformation();
    
    baseStations.value.forEach((station: Station) => {
      const tempStation = {
        ...station,
        num_bikes_available: 0,
        num_docks_available: 0,
        last_reported: Date.now() / 1000
      };
      
      const marker = createStationMarker(tempStation, 'medium');
      marker.on('click', () => {
        openModal(station);
      });
      markers[station.station_id] = marker;
      markerCluster.addLayer(marker);
    });
    
    map.addLayer(markerCluster);
  } catch (error) {
    console.error("Erreur lors du chargement des marqueurs:", error);
  }
}

onMounted(async () => {
  if (map) { return; }

  map = L.map('map');
  refreshLocation();
  map.removeControl(map.zoomControl);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' OpenStreetMap'
  }).addTo(map);

  loadMarkers(map).then(() => {
    refreshStation();
    setInterval(refreshStation, interval);
  });
});

function openStationById(stationId: string) {
  setTimeout(() => {
    const station = baseStations.value.find(s => s.station_id === stationId);
    if (station) {
      openModal(station);
    }
  }, 500);
}

watch(() => route.query.station, (stationId) => {
  if (stationId && typeof stationId === 'string' && baseStations.value.length > 0) {
    openStationById(stationId);
  }
}, { immediate: true });

onIonViewDidEnter(() => {
  setTimeout(() => {
    if (!map) { return }
    map.invalidateSize();

    const stationId = route.query.station;
    if (stationId && typeof stationId === 'string' && baseStations.value.length > 0) {
      openStationById(stationId);
    }
  }, 100);
});
</script>

<style>
.search-bar {
  position: absolute;
  z-index: 500;
  top: 62px;
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
}

#map {
  height: 100%;
}

.leaflet-control-attribution {
  bottom: 20px;
  padding-right: 15px;
}

/* Styles pour les clusters de marqueurs */
.marker-cluster-small {
  background-color: rgba(110, 231, 183, 0.6);
}
.marker-cluster-small div {
  background-color: rgba(110, 231, 183, 0.6);
}

.marker-cluster-medium {
  background-color: rgba(241, 211, 87, 0.6);
}
.marker-cluster-medium div {
  background-color: rgba(241, 211, 87, 0.6);
}

.marker-cluster-large {
  background-color: rgba(253, 156, 115, 0.6);
}
.marker-cluster-large div {
  background-color: rgba(253, 156, 115, 0.6);
}

.marker-cluster {
  background-clip: padding-box;
  border-radius: 20px;
}
.marker-cluster div {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  margin-top: 5px;
  text-align: center;
  border-radius: 15px;
  font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;
}
.marker-cluster span {
  line-height: 30px;
  font-weight: bold;
  color: #fff;
}

/* Styles pour améliorer l'apparence des DivIcon sur mobile */
@media (max-width: 768px) {
  .vlille-station-marker {
    /* Amélioration de la lisibilité sur mobile */
    font-size: 14px !important;
  }
}
</style>
