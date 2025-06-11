// Importación de módulos necesarios para la definición del componente en Angular
import { Component } from '@angular/core';

// Decorador que define el componente Angular
@Component({
  selector: 'app-conocenos', // Selector del componente, usado en HTML para llamarlo
  imports: [], // Lista de módulos importados (vacío en este caso, pero puede incluir módulos adicionales)
  templateUrl: './conocenos.component.html', // Archivo de plantilla HTML asociado al componente
  styleUrl: './conocenos.component.css' // Archivo de estilos CSS aplicado al componente
})
export class ConocenosComponent {
  // Clase del componente "ConocenosComponent"
  // Actualmente no tiene lógica, pero puede incluir métodos y propiedades para manejar la funcionalidad
}