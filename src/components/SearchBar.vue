<template>
  <div class="searchbar">
    <div class="bar">
      <ion-searchbar
        v-model="search"
        @ion-input="runSearch"
        @ion-clear="results = []"
        :debounce="500"
        placeholder="Adresse, station"
        color="light"
        show-clear-button="focus"
        class="ion-searchbar"
      />
      <ion-button @click="$emit('locate')" size="large">
        <ion-icon slot="icon-only" :icon="locate" />
      </ion-button>
    </div>
    <ion-list v-if="isLoading || results.length" class="results" lines="full">
      <ion-item
        v-for="result in results"
        :key="`${result.class}-${result.place_id}`"
        class="result"
        @click="selectResult(result)"
      >
        <ion-icon :icon="getIcon(result.class)" slot="start" color="secondary" />
        <ion-label>
          <h2>{{ result.name }}</h2>
          <p>{{ result.display_name }}</p>
        </ion-label>
      </ion-item>
      <ion-item v-if="isLoading">
        <ion-label>Recherche</ion-label>
        <ion-spinner />
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { IonSearchbar, IonList, IonItem, IonLabel } from '@ionic/vue';
import { locate, location, storefront, subway, leaf, business, bicycle } from 'ionicons/icons';
import { defineEmits, ref } from 'vue';
import { IonButton, IonIcon, IonSpinner } from '@ionic/vue';
import { Station } from '@/types';
import axios from 'axios';


type SearchResult = {
  place_id: number | string;
  licence?: string;
  osm_type?: string;
  osm_id?: number;
  lat: number | string;
  lon: number | string;
  class: string;
  type?: string;
  place_rank?: number;
  importance?: number;
  addresstype?: string;
  name: string;
  display_name: string;
  boundingbox?: [string, string, string, string];
  station?: Station;
};


const emit = defineEmits(['locate', 'goTo', 'openStation']);
const { stations } = defineProps<{ stations: Station[] }>();
const search = ref('');
const results = ref<SearchResult[]>([]);
const isLoading = ref(false);

function getIcon(type: string): string {
  switch (type) {
    case 'address':
      return location;
    case 'poi':
      return storefront;
    case 'railway':
      return subway;
    case 'natural':
      return leaf;
    case 'station':
      return bicycle;
    default:
      return business;
  }
}

function selectResult(result: SearchResult) {
  results.value = [];
  search.value = result.display_name;
  isLoading.value = false;

  if (result.class === 'station') {
    emit('openStation', result.station);
  } else {
    emit('goTo', { lat: result.lat, lon: result.lon });
  }
}

async function runSearch() {
  results.value = [];

  if (!search.value.length) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  for (const station_id in stations) {
    const station = stations[station_id];

    if (station.name.toLowerCase().includes(search.value.toLowerCase())) {
      results.value.push({
        place_id: station.station_id,
        lat: station.lat,
        lon: station.lon,
        class: 'station',
        name: station.name,
        display_name: station.name,
        station: station,
      });
    }
  }
  await axios.get(`https://nominatim.openstreetmap.org/search?q=${search.value}&countrycodes=fr&viewbox=3.278904,50.572686,2.812420,50.678252&format=json`)
    .then(response => {
      results.value = results.value.concat(response.data);
      isLoading.value = false;
    });
}
</script>

<style>
.searchbar {
  max-width: 750px;
}

.bar {
  display: flex;
  gap: 6px;
  flex-direction: row;
  align-items: center;
}

.ion-searchbar {
  padding: 0;
}

.searchbar-input-container {
  height: 50px;
}

.results {
  margin-top: 16px;
  padding: 4px;
  border-radius: 6px;
  max-height: 400px;
  overflow-y: auto;
}

.result:hover {
  --background: var(--ion-color-light-tint);
}
</style>