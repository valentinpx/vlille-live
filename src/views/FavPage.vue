<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>

      {{ JSON.stringify(favorites) }}
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { getCurrentInstance, ref } from 'vue';

const storage = getCurrentInstance()?.appContext.config.globalProperties.$ionicStorage;
const favorites = ref<string[]>([]);

async function fetchFavorites() {
  if (!storage) return;
  favorites.value = await storage.get('favorites') || [];
}
fetchFavorites();
</script>
