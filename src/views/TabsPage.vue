<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
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
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { bicycle, settings, star } from 'ionicons/icons';
</script>

<style scoped>
ion-tab-bar {
  bottom: 50px;
  position: relative;
  border-radius: 16px;
  height: 64px;
  width: 90%;
  margin: 0 auto;
  padding: 0;
  --background: var(-ion-color-primary-contrast);
}
</style>
