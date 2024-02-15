import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

export const API_BASE_URL = 'http://localhost:8080';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations()]
};
