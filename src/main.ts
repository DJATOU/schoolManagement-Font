import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

// Add HttpClientModule to the providers in appConfig
appConfig.providers.push(importProvidersFrom(HttpClientModule));

// Bootstrap the application with AppComponent and appConfig
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
