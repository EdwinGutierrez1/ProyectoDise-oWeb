import { Routes } from '@angular/router';
import { CotizarComponent } from './pages/cotizar/cotizar.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'cotizar', component: CotizarComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' } // Redirigir a home por defecto
];