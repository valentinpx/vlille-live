export interface Station {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
  num_bikes_available: number;
  num_docks_available: number;
  last_reported: number;
}

export interface StationModalType {
  station_id: string;
  open: boolean;
  name: string;
  bikes: number;
  spots_available: number;
  update: Date;
  lat: number;
  lon: number;
}

export interface LocationSearchResult {
  place_id: number | string;
  licence?: string;
  osm_type?: string;
  osm_id?: number;
  lat: number | string;
  lon: number | string;
  class: string;
  type?: string;
  place_rank?: number;
  importance?: number;
  addresstype?: string;
  name: string;
  display_name: string;
  boundingbox?: [string, string, string, string];
  station?: Station;
}

export interface VLilleApiResponse<T> {
  data: {
    stations: T[];
  };
}
