<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="map" style="height: 100%;"></div>
      <ion-modal
      id="modal"
      :is-open="modal.open"
      @didDismiss="modal.open = false"
      :initial-breakpoint="0.25"
      :breakpoints="[0, 0.25]"
      :expand-to-scroll="false"
    >{{ JSON.stringify(modal) }}</ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonModal, onIonViewDidEnter } from '@ionic/vue';
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';	
import L from 'leaflet';


type Station = {
  station_id: string;
  name: string;
  num_bikes_available: number;
  num_docks_available: number;
  last_reported: number;
  [key: string]: any;
};


const modal = ref({
  open: false,
  name: "",
  bikes: 0,
  spots_available: 0,
  update: new Date(),
})
const stations = ref<Record<string, Station>>({});
const interval = 300000;
const markers: Record<string, L.Marker> = {};
let map: L.Map | null = null;

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

function openModal(id: string | number, name: string) {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  modal.value = {
    open: true,
    name: name,
    bikes: stations.value[id].num_bikes_available,
    spots_available: stations.value[id].num_docks_available,
    update: new Date(stations.value[id].last_reported * 1000),
  };
  refreshStation();
}

function loadMarkers(map: L.Map) {
  axios.get("https://media.ilevia.fr/opendata/station_information.json")
    .then(response => {
      response.data.data.stations.map((station: any) => {
        const marker = L.marker([station.lat, station.lon]).addTo(map);
        marker.on('click', () => {
          openModal(station.station_id, station.name);
        });
        markers[station.station_id] = marker;
        return marker;
      });
    })
    .catch(error => {
      console.error("Error loading stations:", error);
    });
}

onMounted(async () => {
  if (map) { return; }
  const position = await Geolocation.getCurrentPosition().catch(() => ({ coords: { latitude: 50.62925, longitude: 3.057256 } }));

  map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  L.marker(
    [position.coords.latitude, position.coords.longitude],
    {
      icon: L.icon({
        iconUrl: "/marker.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })
    })
    .addTo(map);
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
