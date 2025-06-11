// Importación de configuraciones y funciones necesarias para la inicialización de la aplicación
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { routes } from './app.routes'; // Importa las rutas definidas para la app

// Configuración principal de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Mejora el rendimiento agrupando eventos
    provideRouter(routes), // Configura el enrutamiento con las rutas definidas
    CookieService // Proveedor de servicios para manejar cookies
  ]
};
