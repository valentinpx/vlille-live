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
