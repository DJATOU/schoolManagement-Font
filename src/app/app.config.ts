import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

/**
 * Configuration globale de l'application
 * Utilise environment.ts (dev) ou environment.prod.ts (production)
 */
export const API_BASE_URL = environment.apiUrl;

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations()]
};
