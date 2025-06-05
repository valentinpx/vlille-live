<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="map" style="height: 100%;"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, onIonViewDidEnter } from '@ionic/vue';
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';	
import L from 'leaflet';

let map: L.Map | null = null;

function loadMarkers(map: L.Map) {
  axios.get("https://media.ilevia.fr/opendata/station_information.json")
    .then(response => {
      response.data.data.stations.map((station: any) => {
        const marker = L.marker([station.lat, station.lon]).addTo(map);
        marker.bindPopup(station.name);
        return marker;
      });
    })
    .catch(error => {
      console.error("Error loading markers:", error);
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
});

onIonViewDidEnter(() => {
  setTimeout(() => {
    if (!map) { return }
    map.invalidateSize();
  }, 100);
});
</script>
