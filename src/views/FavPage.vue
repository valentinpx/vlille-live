<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Favoris</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Favoris</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="favoriteStations.length === 0" class="empty-state">
        <ion-icon :icon="heartOutline" size="large"></ion-icon>
        <h2>Aucune station favorite</h2>
        <p>Ajoutez des stations à vos favoris depuis la carte pour les retrouver ici.</p>
      </div>

      <ion-list v-else>
        <ion-item 
          v-for="station in favoriteStations" 
          :key="station.station_id"
          @click="openStation(station)"
        >
          <StationMarkerDisplay 
            :station="station" 
            size="medium" 
            slot="start"
          />
          <ion-label>
            <h2>{{ station.name }}</h2>
            <p>{{ station.num_bikes_available }} vélos • {{ station.num_docks_available }} places</p>
            <p class="last-update">Mis à jour {{ formatTime(station.last_reported) }}</p>
          </ion-label>
          <div slot="end">
            <ShareStationButton
              :station="station"
              icon-only
              size="default"
              fill="clear"
              @click.stop
            />
            <ion-button fill="clear" color="medium" @click.stop="toggleFavorite(station)">
              <ion-icon slot="icon-only" :icon="star" color="warning" />
            </ion-button>
            <ion-button fill="clear" color="medium">
              <ion-icon slot="icon-only" :icon="chevronForward" />
            </ion-button>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage,
  IonHeader,
  IonButton,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  onIonViewWillEnter
} from '@ionic/vue';
import { heartOutline, chevronForward, star } from 'ionicons/icons';
import { getCurrentInstance, ref, onMounted, computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import StationMarkerDisplay from '@/components/StationMarkerDisplay.vue';
import ShareStationButton from '@/components/ShareStationButton.vue';
import type { Station } from '@/types';
import type { VLilleApiService } from '@/plugins/api';

const storage = getCurrentInstance()?.appContext.config.globalProperties.$ionicStorage;
const vlilleApi = inject<VLilleApiService>('vlilleApi')!;
const router = useRouter();

const favorites = ref<string[]>([]);
const stations = ref<Record<string, Station>>({});
const stationInfo = ref<Record<string, Station>>({});

const favoriteStations = computed(() => {
  return favorites.value
    .map(stationId => {
      const info = stationInfo.value[stationId];
      const status = stations.value[stationId];
      if (info && status) {
        return {
          ...info,
          ...status
        };
      }
      return null;
    })
    .filter(Boolean) as Station[];
});

async function fetchFavorites() {
  if (!storage) return;
  favorites.value = await storage.get('favorites') || [];
}

async function loadStationData() {
  try {
    const [stationStatusData, stationInfoData] = await Promise.all([
      vlilleApi.getStationStatus(),
      vlilleApi.getStationInformation()
    ]);
    
    stations.value = stationStatusData;
    
    // Convertir le tableau en objet indexé par station_id
    stationInfo.value = stationInfoData.reduce((acc, station) => {
      acc[station.station_id] = station;
      return acc;
    }, {} as Record<string, Station>);
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'à l\'instant';
  if (minutes < 60) return `il y a ${minutes}min`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  
  return date.toLocaleDateString();
}

function openStation(station: Station) {
  // Naviguer vers la carte et ouvrir la station
  router.push({
    path: '/tabs/map',
    query: { station: station.station_id }
  });
}

async function toggleFavorite(station: Station) {
  if (!storage) return;
  
  let favoritesList: string[] = await storage.get('favorites') || [];

  favoritesList = favoritesList.filter(stationId => stationId !== station.station_id);  
  await storage.set('favorites', favoritesList);
  loadFavoritePage();
}

async function loadFavoritePage() {
  await fetchFavorites();
  await loadStationData();
}

onMounted(async () => {
  await loadFavoritePage();
});

// Recharger les favoris à chaque fois que l'utilisateur navigue vers cette page
onIonViewWillEnter(async () => {
  await loadFavoritePage();
});
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 50vh;
}

.empty-state ion-icon {
  color: var(--ion-color-medium);
  margin-bottom: 1rem;
}

.empty-state h2 {
  color: var(--ion-color-dark);
  margin: 0.5rem 0;
}

.empty-state p {
  color: var(--ion-color-medium);
  max-width: 300px;
  line-height: 1.4;
}

.last-update {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}

ion-item {
  --inner-padding-end: 16px;
}

ion-label h2 {
  font-weight: 600;
  margin-bottom: 4px;
}

ion-label p {
  margin: 2px 0;
}
</style>
