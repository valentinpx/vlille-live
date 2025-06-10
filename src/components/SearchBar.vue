<template>
  <div>
    <ion-searchbar placeholder="Adresse, station" color="light" show-clear-button="focus" />
    <ion-button size="large" @click="$emit('locate')">
      <ion-icon slot="icon-only" :icon="locate" />
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonSearchbar } from '@ionic/vue';
import { locate } from 'ionicons/icons';
import { defineEmits } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';

defineEmits(['locate']);
</script>

<style scoped>
div {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

ion-button {
  margin-right: 12px;
}
</style>