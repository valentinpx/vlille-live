<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/fav">
          <ion-icon aria-hidden="true" :icon="star" />
          <ion-label>Favoris</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/map">
          <ion-icon aria-hidden="true" :icon="bicycle" />
          <ion-label>Carte</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/settings">
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
