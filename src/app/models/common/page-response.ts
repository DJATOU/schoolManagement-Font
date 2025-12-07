/**
 * Modèle générique pour les réponses paginées du backend
 *
 * Correspond au PageResponse.java du backend (Phase 2)
 * Utilisé par tous les endpoints paginés
 */
export interface PageResponse<T> {
  content: T[];
  metadata: PageMetadata;
}

/**
 * Métadonnées de pagination
 * Fournit toutes les informations nécessaires pour naviguer entre les pages
 */
export interface PageMetadata {
  page: number;           // Numéro de la page actuelle (commence à 0)
  size: number;           // Nombre d'éléments par page
  totalElements: number;  // Nombre total d'éléments
  totalPages: number;     // Nombre total de pages
  first: boolean;         // Est la première page?
  last: boolean;          // Est la dernière page?
  empty: boolean;         // La page est vide?
  hasNext: boolean;       // Y a-t-il une page suivante?
  hasPrevious: boolean;   // Y a-t-il une page précédente?
}

/**
 * Paramètres de requête pour la pagination
 * À utiliser lors des appels API paginés
 */
export interface PageRequest {
  page: number;
  size: number;
  sort?: string[];  // ex: ['lastName,asc', 'firstName,desc']
}

/**
 * Constantes de pagination
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 0,
  SIZE: 20,
  MAX_SIZE: 100
};
