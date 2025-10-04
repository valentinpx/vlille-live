import L from 'leaflet';
import { Station } from '@/types';
import { getMarkerStyleConfig, generateMarkerInlineCSS, generateMarkerContentHTML } from '@/utils/markerUtils';

export function useStationMarkers() {

  /**
   * Crée un DivIcon pour une station en utilisant les utilitaires partagés
   */
  function createStationDivIcon(station: Station, size: 'small' | 'medium' | 'large' = 'medium'): L.DivIcon {
    const config = getMarkerStyleConfig(station, size);
    
    // Configuration des dimensions pour Leaflet
    const iconSize = [config.diameter, config.diameter] as [number, number];
    const iconAnchor = [config.diameter / 2, config.diameter / 2] as [number, number];

    // Générer le CSS et HTML
    const css = generateMarkerInlineCSS(config);
    const contentHTML = generateMarkerContentHTML(station, config);

    const html = `<div style="${css}">${contentHTML}</div>`;

    return L.divIcon({
      html: html,
      className: 'vlille-station-marker',
      iconSize,
      iconAnchor,
      popupAnchor: [0, -iconAnchor[1]]
    });
  }

  /**
   * Crée un marqueur spécial pour la position actuelle de l'utilisateur
   */
  function createUserLocationIcon(): L.DivIcon {
    const css = `
      width: 20px;
      height: 20px;
      background-color: #3B82F6;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      position: relative;
    `;

    const html = `
      <div style="${css}"></div>
    `;

    return L.divIcon({
      html: html,
      className: 'user-location-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  }

  /**
   * Crée un marqueur de sélection (ici/here marker)
   */
  function createHereMarker(): L.DivIcon {
    const css = `
      width: 60px;
      height: 60px;
      background-color: #EC4899;
      border: 4px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #FFFFFF;
      font-weight: bold;
      position: relative;
      animation: bounce 0.6s ease-in-out;
    `;

    const html = `
      <div style="${css}">📍</div>
      <style>
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      </style>
    `;

    return L.divIcon({
      html: html,
      className: 'here-marker',
      iconSize: [60, 60],
      iconAnchor: [30, 30]
    });
  }

  /**
   * Met à jour un marqueur existant avec de nouvelles données
   */
  function updateMarkerIcon(marker: L.Marker, station: Station, size: 'small' | 'medium' | 'large' = 'medium'): void {
    const newIcon = createStationDivIcon(station, size);
    marker.setIcon(newIcon);
  }

  /**
   * Crée un marqueur Leaflet complet avec le DivIcon
   */
  function createStationMarker(station: Station, size: 'small' | 'medium' | 'large' = 'medium'): L.Marker {
    const icon = createStationDivIcon(station, size);
    const marker = L.marker([station.lat, station.lon], { icon });

    return marker;
  }

  return {
    createStationDivIcon,
    createStationMarker,
    createUserLocationIcon,
    createHereMarker,
    updateMarkerIcon
  };
}