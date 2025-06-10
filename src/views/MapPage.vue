<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <SearchBar class="search-bar" @locate="refreshLocation" @goTo="openLocation" />
      <div id="map" />
      <StationModal :station="station_modal" @close="closeModal" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonPage, IonContent, onIonViewDidEnter } from '@ionic/vue';
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';	
import L from 'leaflet';
import 'leaflet.markercluster';
import { Station, StationModalType } from '@/types';
import SearchBar from '@/components/SearchBar.vue';
import StationModal from '@/components/StationModal.vue';


const interval = 300000;
const defaultPos = { latitude: 50.62925, longitude: 3.057256 };
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
        {
          icon: L.icon({
            iconUrl: "/marker.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          })
        }).addTo(map!);
    }
}

function refreshLocation() {
  Geolocation.getCurrentPosition().catch(() => ({ coords: defaultPos })).then(position => {
    openLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
  });
}

async function refreshStation() {
  stations.value = await axios.get("https://media.ilevia.fr/opendata/station_status.json")
    .then(response => {
      return response.data.data.stations.reduce((dict: { [x: string]: Station; }, station: Station) => {
        const newIcon = L.icon({
          iconUrl: station.num_bikes_available === 0 ? "/marker-empty.png" :
                   station.num_docks_available == 0 ? "/marker-full.png" :
                   "/marker-station.png",
          iconSize: [64, 64],
          iconAnchor: [32, 64],
          popupAnchor: [0, -64]
        });

        dict[station.station_id] = station;
        markers[station.station_id].setIcon(newIcon);
        return dict;
      }, {});  
    })
    .catch(error => {
      console.error("Error loading stations:", error);
    });
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
        icon: L.icon({
          iconUrl: "/marker-here.png",
          iconSize: [64, 64],
          iconAnchor: [32, 64],
          popupAnchor: [0, -64]
        })
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

function loadMarkers(map: L.Map) {
  markerCluster = L.markerClusterGroup();
  axios.get("https://media.ilevia.fr/opendata/station_information.json")
    .then(response => {
      response.data.data.stations.map((station: any) => {
        const marker = L.marker([station.lat, station.lon]);
        marker.on('click', () => {
          openModal(station);
        });
        markers[station.station_id] = marker;
        markerCluster.addLayer(marker);
        return marker;
      });
      map.addLayer(markerCluster);
    })
    .catch(error => {
      console.error("Error loading stations:", error);
    });
}

onMounted(async () => {
  if (map) { return; }

  map = L.map('map');
  refreshLocation();
  map.removeControl(map.zoomControl);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' OpenStreetMap'
  }).addTo(map);

  loadMarkers(map);

  refreshStation();
  setInterval(refreshStation, interval);
});

onIonViewDidEnter(() => {
  setTimeout(() => {
    if (!map) { return }
    map.invalidateSize();
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
</style>
