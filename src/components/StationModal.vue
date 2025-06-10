<template>
  <ion-modal
    id="modal"
    :is-open="station.open"
    @didDismiss="$emit('close')"
    :initial-breakpoint="0.45"
    :breakpoints="[0, 0.45]"
    :expand-to-scroll="false"
  >
    <ion-content class="ion-padding">
      <h1 @click="toggleFav">
        {{ station.name || 'Station Details' }}
        <ion-icon :icon="fav ? star : starOutline" :color="fav ? 'warning' : ''" />
      </h1>
      <h2>{{ formatDate(station.update) }}</h2>

      <ion-card>
        <ion-card-content>
          <ion-img
            class="station-icon"
            :src="getMarkerImg(station.bikes, station.spots_available)"
            :alt="`Icône de la station (${station.bikes} vélos, ${station.spots_available} places)`"
          />
          <div class="card-text">
            <table>
              <tbody>
                <tr>
                  <td class="icon">🚲</td>
                  <td>Vélos</td>
                  <td class="number">{{ station.bikes }}</td>
                </tr>
                <tr>
                  <td class="icon">🅿️</td>
                  <td>Places</td>
                  <td class="number">{{ station.spots_available }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ion-card-content>
      </ion-card>
      <div class="btns">
        <ion-button
          :href="`http://maps.apple.com/?daddr=${station.lat},${station.lon}`"
          size="large"
          fill="outline"
        >
          <ion-icon slot="start" :icon="logoApple" />
          Plan
        </ion-button>
        <ion-button
          :href="`http://maps.google.com/?daddr=${station.lat},${station.lon}`"
          size="large"
          fill="outline"
        >
          <ion-icon slot="start" :icon="navigate" />
          Maps
        </ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onBeforeUpdate } from 'vue';
import { IonModal, IonContent, IonCard, IonCardContent, IonImg, IonButton, IonIcon } from '@ionic/vue';
import { logoApple, navigate, star, starOutline } from 'ionicons/icons';
import { StationModalType } from '@/types';

defineEmits(['close']);
const favKey = 'favorites';
const storage = getCurrentInstance()?.appContext.config.globalProperties.$ionicStorage;
const { station } = defineProps<{ station: StationModalType }>();
const fav = ref(false);

onBeforeUpdate(() => {
  fetchFav();
});

async function toggleFav() {
  if (!storage) return;
  let favorites: string[] = await storage.get(favKey) || [];
  fav.value = !fav.value;
  if (fav.value) {
    if (!favorites.includes(station.station_id)) {
      favorites.push(station.station_id);
    }
  } else {
    favorites = favorites.filter((sid) => sid !== station.station_id);
  }
  await storage.set(favKey, favorites);
}

async function fetchFav() {
  if (!storage) return;
  fav.value = (await storage.get(favKey) || []).includes(station.station_id);
}

function getMarkerImg(bikes: number, spots: number) {
  if (bikes === 0) return '/marker-empty-outline.png';
  if (spots === 0) return '/marker-full-outline.png';
  return '/marker-station-outline.png';
}

function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  if (isToday) {
    return `Aujourd'hui à ${hours}:${minutes}`;
  }
  return `${d.toLocaleDateString()} à ${hours}:${minutes}`;
}
</script>

<style scoped>
h1 {
  text-align: center;
  font-weight: bold;
  margin-bottom: 0px;
}

h2 {
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  font-family: Arial;
  color: rgb(102, 102, 102);
  text-transform: uppercase;
  margin-top: 5px;
  margin-bottom: 5px;
}

ion-img {
  width: 100%;
  height: auto;
  max-width: 64px;
  margin: auto 0;
}

ion-content {
  border-radius: 12px;
}

ion-card {
  margin: 20px 2px;
}

ion-card-content {
  display: flex;
}

.card-text {
  margin: auto;
  color: var(--ion-color-primary-primary);
  font-size: 20px;
  font-family: Arial;
  text-transform: uppercase;
}

.icon {
  font-size: 24px;
}

.number {
  font-size: 22px;
  font-weight: bold;
}

.card-text table tr td {
  padding-right: 10px;
}

.btns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.btns ion-button {
  margin: 0;
}
</style>