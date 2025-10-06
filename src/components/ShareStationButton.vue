<template>
  <ion-button
    v-if="shareIsBtn"
    :class="buttonClass"
    :size="size"
    :fill="fill"
    @click="shareStation"
  >
    <ion-icon 
      :slot="iconOnly ? 'icon-only' : 'start'" 
      :icon="shareSocial" 
    />
    <span v-if="!iconOnly">{{ buttonText }}</span>
  </ion-button>
  <div
    v-else
    :class="linkClass"
  >
    <ion-icon slot="start" :icon="shareSocial" />
    <a :href="`/tabs/map?station=${station.station_id}`">{{ linkText }}</a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { shareSocial } from 'ionicons/icons';
import { Share } from '@capacitor/share';

interface Station {
  station_id: string;
  name: string;
  bikes?: number;
  spots_available?: number;
  num_bikes_available?: number;
  num_docks_available?: number;
  update?: Date;
  last_reported?: number;
}

interface Props {
  station: Station;
  iconOnly?: boolean;
  size?: 'small' | 'default' | 'large';
  fill?: 'clear' | 'outline' | 'solid';
  buttonText?: string;
  linkText?: string;
  buttonClass?: string;
  linkClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  iconOnly: false,
  size: 'default',
  fill: 'outline',
  buttonText: 'Partager',
  linkText: 'Lien de partage',
  buttonClass: '',
  linkClass: 'share-link'
});

const shareIsBtn = ref(true);

onMounted(() => {
  Share.canShare().then((r) => {
    if (!r.value) { 
      shareIsBtn.value = false;
    }
  });
});

function formatDate(date: Date | string | number): string {
  let d: Date;
  
  if (typeof date === 'number') {
    // Si c'est un timestamp unix
    d = new Date(date * 1000);
  } else if (typeof date === 'string') {
    d = new Date(date);
  } else {
    d = date;
  }
  
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

function shareStation() {
  const shareUrl = `https://vlille.live/tabs/map?station=${props.station.station_id}`
  
  // Gérer les différents formats de données de station
  const bikesAvailable = props.station.bikes || props.station.num_bikes_available || 0
  const spotsAvailable = props.station.spots_available || props.station.num_docks_available || 0
  const lastUpdate = props.station.update || (props.station.last_reported ? new Date(props.station.last_reported * 1000) : new Date())
  
  const shareText = `🚲 V'Lille - ${props.station.name}\n\n` +
    `📍 ${bikesAvailable} vélos disponibles\n` +
    `🅿️ ${spotsAvailable} places libres\n\n` +
    `Dernière mise à jour: ${formatDate(lastUpdate)}`

  Share.share({
    title: `V'Lille - ${props.station.name}`,
    text: shareText,
    url: shareUrl,
    dialogTitle: "Partager cette station V'Lille"
  }).then((result) => {
    (window as any).umami.track('station-share', {
      data: {
        station_name: props.station.name,
        station_id: props.station.station_id,
        shared_to_app: result.activityType || 'unknown',
      }
    })
  }).catch((e) => {
    if (e.name !== "AbortError") {
      shareIsBtn.value = false
    }
  });
}
</script>

<style scoped>
.share-link {
  width: 100%;
  margin-top: 20px;
  text-align: center;
  color: rgb(77, 141, 255);
}

.share-link a {
  margin-top: 10px;
  margin-left: 5px;
  text-decoration: none;
}
</style>