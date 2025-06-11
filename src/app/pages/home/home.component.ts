// Importación de Angular y de los componentes que conforman la página de inicio
import { Component } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { ConocenosComponent } from '../../components/conocenos/conocenos.component';
import { GaleriaComponent } from '../../components/galeria/galeria.component';

@Component({
  selector: 'app-home', // Selector del componente para usarlo en plantillas
  standalone: true, // Define que este componente no depende de un módulo
  imports: [CarouselComponent, ConocenosComponent, GaleriaComponent], // Componentes utilizados en la vista
  templateUrl: './home.component.html', // Archivo HTML asociado
  styleUrls: ['./home.component.css'] // Archivo CSS asociado
})
export class HomeComponent {}
