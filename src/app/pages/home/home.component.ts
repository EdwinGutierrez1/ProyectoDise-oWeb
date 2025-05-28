import { Component } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { ConocenosComponent } from '../../components/conocenos/conocenos.component';
import { GaleriaComponent } from '../../components/galeria/galeria.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, ConocenosComponent, GaleriaComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}