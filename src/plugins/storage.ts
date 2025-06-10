import { Storage } from '@ionic/storage';
import type { App } from 'vue';

interface IonicStoragePlugin {
  install: (app: App) => Promise<void>;
}


const plugin: IonicStoragePlugin = {
  install: async (app: App): Promise<void> => {
    const store = new Storage();
    const storageInstance = await store.create();
    (app.config.globalProperties as any).$ionicStorage = storageInstance;
  },
};

export default plugin;
