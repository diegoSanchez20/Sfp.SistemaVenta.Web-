import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './interceptors/header.interceptor';
import { loaderInterceptor } from './interceptors/loader.interceptor';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter,withComponentInputBinding  } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes,withComponentInputBinding()),
    provideHttpClient(withInterceptors([headerInterceptor, loaderInterceptor]))
  ]
};
