/**
 * Configuration centralisée pour les marqueurs de stations VLille
 */

export interface StationThresholds {
  /** Seuil pour considérer qu'une station a une bonne disponibilité */
  good: number;
  /** Seuil pour considérer qu'une station a une disponibilité moyenne */
  medium: number;
  /** Seuil pour considérer qu'une station a une faible disponibilité */
  low: number;
}

export interface StationColors {
  /** Couleur pour bonne disponibilité */
  good: string;
  /** Couleur pour disponibilité moyenne */
  medium: string;
  /** Couleur pour faible disponibilité */
  low: string;
  /** Couleur pour aucune disponibilité */
  empty: string;
  /** Couleur pour station inactive */
  inactive: string;
}

export interface MarkerSizeConfig {
  diameter: number;
  fontSize: number;
  smallFontSize: number;
  padding?: number;
}

export interface MarkerSizes {
  small: MarkerSizeConfig;
  medium: MarkerSizeConfig;
  large: MarkerSizeConfig;
}

/**
 * Configuration par défaut des seuils de disponibilité
 */
export const DEFAULT_THRESHOLDS: StationThresholds = {
  good: 5,     // > 5 vélos = vert
  medium: 3,   // 3-5 vélos = jaune
  low: 1       // 1-2 vélos = orange, 0 = rouge
};

/**
 * Configuration par défaut des couleurs
 */
export const DEFAULT_COLORS: StationColors = {
  good: '#22C55E',      // Vert - Tailwind green-500
  medium: '#EAB308',    // Jaune - Tailwind yellow-500
  low: '#F97316',       // Orange - Tailwind orange-500
  empty: '#EF4444',     // Rouge - Tailwind red-500
  inactive: '#9CA3AF'   // Gris - Tailwind gray-400
};

/**
 * Configuration par défaut des tailles de marqueurs
 */
export const DEFAULT_SIZES: MarkerSizes = {
  small: {
    diameter: 32,
    fontSize: 12,
    smallFontSize: 8,
    padding: 4
  },
  medium: {
    diameter: 40,
    fontSize: 14,
    smallFontSize: 9,
    padding: 6
  },
  large: {
    diameter: 48,
    fontSize: 16,
    smallFontSize: 10,
    padding: 8
  }
};

/**
 * Détermine le niveau de disponibilité d'une station
 */
export function getAvailabilityLevel(
  availableBikes: number, 
  thresholds: StationThresholds = DEFAULT_THRESHOLDS
): 'good' | 'medium' | 'low' | 'empty' {
  if (availableBikes === 0) return 'empty';
  if (availableBikes <= thresholds.low) return 'low';
  if (availableBikes <= thresholds.medium) return 'medium';
  return 'good';
}

/**
 * Obtient la couleur correspondant au niveau de disponibilité
 */
export function getColorForAvailability(
  availableBikes: number,
  status: 'active' | 'inactive' = 'active',
  colors: StationColors = DEFAULT_COLORS,
  thresholds: StationThresholds = DEFAULT_THRESHOLDS
): string {
  if (status !== 'active') return colors.inactive;
  
  const level = getAvailabilityLevel(availableBikes, thresholds);
  return colors[level];
}

/**
 * Génère un message descriptif pour l'accessibilité
 */
export function getAccessibilityLabel(
  availableBikes: number,
  availableSpots: number,
  stationName?: string
): string {
  const level = getAvailabilityLevel(availableBikes);
  const levelText = {
    good: 'Bonne disponibilité',
    medium: 'Disponibilité moyenne',
    low: 'Faible disponibilité',
    empty: 'Aucun vélo disponible'
  }[level];

  const base = stationName ? `Station ${stationName}. ` : '';
  return `${base}${levelText}. ${availableBikes} vélo${availableBikes > 1 ? 's' : ''} et ${availableSpots} place${availableSpots > 1 ? 's' : ''} disponible${availableSpots > 1 ? 's' : ''}.`;
}

/**
 * Configuration responsive pour les marqueurs selon la résolution
 */
export function getResponsiveSize(): 'small' | 'medium' | 'large' {
  if (typeof window === 'undefined') return 'medium';
  
  const width = window.innerWidth;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Écrans haute résolution et grands
  if (width >= 1200 && pixelRatio >= 2) return 'large';
  
  // Écrans moyens
  if (width >= 768) return 'medium';
  
  // Écrans mobiles
  return 'small';
}

/**
 * Valide qu'un objet Station a les propriétés requises
 */
export function isValidStation(station: any): boolean {
  return station &&
    typeof station.station_id === 'string' &&
    typeof station.lat === 'number' &&
    typeof station.lon === 'number' &&
    typeof station.num_bikes_available === 'number' &&
    typeof station.num_docks_available === 'number';
}

/**
 * Applique des seuils personnalisés en gardant les valeurs par défaut
 */
export function mergeThresholds(custom: Partial<StationThresholds>): StationThresholds {
  return { ...DEFAULT_THRESHOLDS, ...custom };
}

/**
 * Applique des couleurs personnalisées en gardant les valeurs par défaut
 */
export function mergeColors(custom: Partial<StationColors>): StationColors {
  return { ...DEFAULT_COLORS, ...custom };
}

/**
 * Applique des tailles personnalisées en gardant les valeurs par défaut
 */
export function mergeSizes(custom: Partial<MarkerSizes>): MarkerSizes {
  return {
    small: { ...DEFAULT_SIZES.small, ...custom.small },
    medium: { ...DEFAULT_SIZES.medium, ...custom.medium },
    large: { ...DEFAULT_SIZES.large, ...custom.large }
  };
}