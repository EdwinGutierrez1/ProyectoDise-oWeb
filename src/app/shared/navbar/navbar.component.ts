import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

declare const bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class NavbarComponent implements OnInit, AfterViewInit {
  logoPath: string = '';

  ngOnInit(): void {
    const hour = new Date().getHours();
    this.logoPath = hour >= 6 && hour < 18 ? 'logoDia.png' : 'logoNoche.png';
  }

  ngAfterViewInit(): void {
    // Sincroniza el ícono (3 rayas / X) con el estado REAL del menú de Bootstrap,
    // sin importar qué tan rápido o seguido se le dé clic al botón
    const menu = document.getElementById('navbarSupportedContent');
    const checkbox = document.getElementById('toggle-menu') as HTMLInputElement;

    if (menu && checkbox) {
      menu.addEventListener('shown.bs.collapse', () => checkbox.checked = true);
      menu.addEventListener('hidden.bs.collapse', () => checkbox.checked = false);
    }
  }

  cerrarMenu(): void {
    const menu = document.getElementById('navbarSupportedContent');
    if (menu && menu.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(menu);
      bsCollapse.hide();
    }
  }
}