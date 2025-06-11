// Importación de herramientas de enrutamiento y componentes asociados a rutas
import { Routes } from '@angular/router';
import { ReservarComponent } from './pages/reservar/reservar.component';
import { HomeComponent } from './pages/home/home.component';

// Definición de rutas de la aplicación
export const routes: Routes = [
    { path: 'home', component: HomeComponent }, // Ruta para la página de inicio
    { path: 'reservar', component: ReservarComponent }, // Ruta para la página para reservar
    { path: '', redirectTo: 'home', pathMatch: 'full' } // Ruta por defecto redirige a 'home'
];
