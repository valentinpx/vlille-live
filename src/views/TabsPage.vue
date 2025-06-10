<template>
  <ion-page class="ion-page">
    <ion-tabs>
      <ion-router-outlet />
      <div>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="fav" href="/tabs/fav">
            <ion-icon aria-hidden="true" :icon="star" />
            <ion-label>Favoris</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="map" href="/tabs/map">
            <ion-icon aria-hidden="true" :icon="bicycle" />
            <ion-label>Carte</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="settings" href="/tabs/settings">
            <ion-icon aria-hidden="true" :icon="settings" />
            <ion-label>Paramètres</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </div>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { bicycle, settings, star } from 'ionicons/icons';
</script>

<style scoped>
.ion-page {
  height: 100vh;
}

div {
  position: absolute;
  bottom: 50px;
  width: 100%;
}

ion-tab-bar {
  margin: auto;
  border-radius: 12px;
  height: 64px;
  width: 90%;
  max-width: 750px;
  --background: var(-ion-color-primary-contrast);
}
</style>
