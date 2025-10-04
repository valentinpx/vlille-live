import axios from 'axios';
import type { App } from 'vue';
import type { Station, VLilleApiResponse, LocationSearchResult } from '@/types';

interface VLilleApiService {
  getStationInformation(): Promise<Station[]>;
  getStationStatus(): Promise<Record<string, Station>>;
  searchLocation(query: string): Promise<LocationSearchResult[]>;
}

class VLilleApi implements VLilleApiService {
  private readonly baseUrl = 'https://media.ilevia.fr/opendata';

  async getStationInformation(): Promise<Station[]> {
    try {
      const response = await axios.get<VLilleApiResponse<Station>>(`${this.baseUrl}/station_information.json`);
      return response.data.data.stations;
    } catch (error) {
      console.error('Erreur lors du chargement des informations des stations:', error);
      throw error;
    }
  }

  async getStationStatus(): Promise<Record<string, Station>> {
    try {
      const response = await axios.get<VLilleApiResponse<Station>>(`${this.baseUrl}/station_status.json`);
      return response.data.data.stations.reduce((dict: Record<string, Station>, station: Station) => {
        dict[station.station_id] = station;
        return dict;
      }, {});
    } catch (error) {
      console.error('Erreur lors du chargement du statut des stations:', error);
      throw error;
    }
  }

  async searchLocation(query: string): Promise<LocationSearchResult[]> {
    try {
      const response = await axios.get<LocationSearchResult[]>(
        `https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=fr&viewbox=3.278904,50.572686,2.812420,50.678252&format=json`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de localisation:', error);
      throw error;
    }
  }
}

interface VLilleApiPlugin {
  install: (app: App) => void;
}

const plugin: VLilleApiPlugin = {
  install: (app: App): void => {
    const apiService = new VLilleApi();
    app.config.globalProperties.$vlilleApi = apiService;
    app.provide('vlilleApi', apiService);
  },
};

export default plugin;
export type { VLilleApiService };