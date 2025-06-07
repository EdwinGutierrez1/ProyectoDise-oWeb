// Importación de módulos y componentes necesarios para el funcionamiento del componente principal
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root', // Selector del componente raíz de la app
  standalone: true, // No depende de un módulo
  imports: [RouterOutlet, NavbarComponent, FooterComponent], // Componentes y funcionalidades que se usan en la plantilla
  templateUrl: './app.component.html', // HTML asociado
  styleUrl: './app.component.css' // CSS asociado
})
export class AppComponent {
  title = 'parcial-diseno-web'; // Título de la aplicación
}
