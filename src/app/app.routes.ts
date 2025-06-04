import { Routes } from '@angular/router';
import { ReservarComponent } from './pages/reservar/reservar.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'reservar', component: ReservarComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' } // Redirigir a home por defecto
];