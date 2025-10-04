<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Paramètres</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Paramètres</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="settings-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Stockage</ion-card-title>
            <ion-card-subtitle>Gérer les données de l'application</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label>
                <h3>Vider le cache</h3>
                <p>Supprime tous les favoris et données stockées localement</p>
              </ion-label>
            </ion-item>
            <ion-button 
              fill="outline" 
              color="danger" 
              expand="block" 
              @click="confirmClearStorage"
            >
              <ion-icon :icon="trashOutline" slot="start"></ion-icon>
              Vider le stockage
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonButton, 
  IonIcon,
  alertController,
  toastController
} from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import { getCurrentInstance } from 'vue';

const storage = getCurrentInstance()?.appContext.config.globalProperties.$ionicStorage;

async function confirmClearStorage() {
  const alert = await alertController.create({
    header: 'Confirmer la suppression',
    message: 'Êtes-vous sûr de vouloir supprimer toutes les données stockées ? Cette action supprimera tous vos favoris et ne peut pas être annulée.',
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
      },
      {
        text: 'Confirmer',
        handler: () => {
          clearStorage();
        },
      },
    ],
  });

  await alert.present();
}

async function clearStorage() {
  try {
    if (!storage) {
      throw new Error('Le stockage n\'est pas disponible');
    }

    // Vider complètement le stockage
    await storage.clear();

    // Afficher un message de confirmation
    const toast = await toastController.create({
      message: 'Le stockage a été vidé avec succès',
      duration: 3000,
      color: 'success',
      position: 'bottom',
    });

    await toast.present();
  } catch (error) {
    console.error('Erreur lors du vidage du stockage:', error);
    
    // Afficher un message d'erreur
    const toast = await toastController.create({
      message: 'Erreur lors du vidage du stockage',
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });

    await toast.present();
  }
}
</script>

<style scoped>
.settings-container {
  padding: 16px;
}

ion-card {
  margin-bottom: 16px;
}

ion-button {
  margin-top: 16px;
}
</style>
