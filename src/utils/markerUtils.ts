import { Station } from '@/types';
import { getColorForAvailability, DEFAULT_SIZES } from './stationConfig';

export interface MarkerStyleConfig {
  diameter: number;
  fontSize: number;
  smallFontSize: number;
  backgroundColor: string;
}

/**
 * Génère la configuration de style pour un marqueur de station
 */
export function getMarkerStyleConfig(
  station: Pick<Station, 'num_bikes_available'>, 
  size: 'small' | 'medium' | 'large' = 'medium'
): MarkerStyleConfig {
  const sizeConfig = DEFAULT_SIZES[size];
  const backgroundColor = getColorForAvailability(station.num_bikes_available, 'active');
  
  return {
    diameter: sizeConfig.diameter,
    fontSize: sizeConfig.fontSize,
    smallFontSize: sizeConfig.smallFontSize,
    backgroundColor
  };
}

/**
 * Génère le CSS inline pour les DivIcon de Leaflet
 */
export function generateMarkerInlineCSS(config: MarkerStyleConfig): string {
  return `
    width: ${config.diameter}px;
    height: ${config.diameter}px;
    background-color: ${config.backgroundColor};
    border: 2px solid #FFFFFF;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 600;
    color: #FFFFFF;
    transition: all 0.2s ease;
    cursor: pointer;
    flex-shrink: 0;
  `.trim();
}

/**
 * Génère le HTML interne du marqueur
 */
export function generateMarkerContentHTML(
  station: Pick<Station, 'num_bikes_available' | 'num_docks_available'>,
  config: MarkerStyleConfig
): string {
  return `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      line-height: 1;
    ">
      <div style="
        font-size: ${config.fontSize}px;
        font-weight: 700;
      ">${station.num_bikes_available}</div>
      <div style="
        font-size: ${config.smallFontSize}px;
        font-weight: 500;
        opacity: 0.9;
      ">${station.num_docks_available}</div>
    </div>
  `.trim();
}

/**
 * Génère le HTML complet du marqueur (style + contenu)
 * Utilisé pour une réutilisation facile dans les composants Vue
 */
export function generateCompleteMarkerHTML(
  station: Pick<Station, 'num_bikes_available' | 'num_docks_available'>,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  const config = getMarkerStyleConfig(station, size);
  const css = generateMarkerInlineCSS(config);
  const contentHTML = generateMarkerContentHTML(station, config);
  
  return `<div style="${css}">${contentHTML}</div>`;
}