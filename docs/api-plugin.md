# Plugin API VLille

Ce plugin fournit une interface unifiée pour accéder aux données VLille et aux services de géolocalisation.

## Installation

Le plugin est automatiquement installé dans `src/main.ts` :

```typescript
import vlilleApi from './plugins/api';

const app = createApp(App)
  .use(vlilleApi);
```

## Utilisation

### Dans les composants Vue 3 avec Composition API

```typescript
import { inject } from 'vue';
import type { VLilleApiService } from '@/plugins/api';

export default {
  setup() {
    const vlilleApi = inject<VLilleApiService>('vlilleApi')!;
    
    // Utilisation du service
    const loadStations = async () => {
      try {
        const stations = await vlilleApi.getStationInformation();
        console.log('Stations:', stations);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    
    return { loadStations };
  }
}
```

### Avec script setup

```typescript
<script setup lang="ts">
import { inject } from 'vue';
import type { VLilleApiService } from '@/plugins/api';

const vlilleApi = inject<VLilleApiService>('vlilleApi')!;

// Utilisation directe
const stations = await vlilleApi.getStationInformation();
</script>
```

## Méthodes disponibles

### `getStationInformation(): Promise<Station[]>`

Récupère la liste de toutes les stations VLille avec leurs informations de base (nom, position, etc.).

```typescript
const stations = await vlilleApi.getStationInformation();
```

### `getStationStatus(): Promise<Record<string, Station>>`

Récupère le statut en temps réel de toutes les stations (vélos disponibles, emplacements libres, etc.).

```typescript
const stationsStatus = await vlilleApi.getStationStatus();
const station = stationsStatus['station_id'];
console.log(`Vélos disponibles: ${station.num_bikes_available}`);
```

### `searchLocation(query: string): Promise<LocationSearchResult[]>`

Recherche des lieux via l'API Nominatim d'OpenStreetMap.

```typescript
const locations = await vlilleApi.searchLocation('Place de la République Lille');
```

## Types TypeScript

### `Station`

```typescript
interface Station {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
  num_bikes_available: number;
  num_docks_available: number;
  last_reported: number;
}
```

### `LocationSearchResult`

```typescript
interface LocationSearchResult {
  place_id: number | string;
  lat: number | string;
  lon: number | string;
  class: string;
  name: string;
  display_name: string;
  // ... autres propriétés optionnelles
}
```

## Gestion des erreurs

Toutes les méthodes peuvent lever des exceptions. Il est recommandé d'utiliser des blocs try-catch :

```typescript
try {
  const stations = await vlilleApi.getStationInformation();
  // Traitement des données
} catch (error) {
  console.error('Erreur lors du chargement des stations:', error);
  // Gestion de l'erreur (affichage d'un message, valeurs par défaut, etc.)
}
```

## Exemple d'utilisation complète

```typescript
<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import type { VLilleApiService } from '@/plugins/api';
import type { Station } from '@/types';

const vlilleApi = inject<VLilleApiService>('vlilleApi')!;
const stations = ref<Station[]>([]);
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    // Charger les informations des stations
    stations.value = await vlilleApi.getStationInformation();
    
    // Charger le statut des stations
    const stationsStatus = await vlilleApi.getStationStatus();
    
    // Fusionner les données
    stations.value = stations.value.map(station => ({
      ...station,
      ...stationsStatus[station.station_id]
    }));
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>
```