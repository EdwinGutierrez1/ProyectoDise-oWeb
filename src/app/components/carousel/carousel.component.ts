// Importación de módulos necesarios para la funcionalidad del componente en Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Decorador que define el componente Angular
@Component({
  selector: 'app-carousel', // Selector del componente para su uso en plantillas HTML
  imports: [], // Lista de módulos importados (vacío en este caso)
  templateUrl: './carousel.component.html', // Archivo de plantilla HTML del componente
  styleUrl: './carousel.component.css' // Archivo de estilos CSS del componente
})
export class CarouselComponent {
  // Constructor con inyección de dependencias para Router
  constructor(private router: Router) {}

  // Método para redirigir a la página de reservas cuando se hace clic en el botón
  goToReservar() {
    this.router.navigate(['/reservar']); // Navega hacia la ruta '/reservar'
  }
}