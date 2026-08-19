import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
declare const bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class NavbarComponent implements OnInit {
  logoPath: string = '';

  ngOnInit(): void {
    const hour = new Date().getHours();
    this.logoPath = hour >= 6 && hour < 18 ? 'logoDia.png' : 'logoNoche.png';
  }

  // Cierra el menú hamburguesa manualmente al hacer clic en cualquier link
  cerrarMenu(): void {
    const menu = document.getElementById('navbarSupportedContent');
    if (menu && menu.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(menu);
      bsCollapse.hide();
    }

    // También reinicia el ícono animado de las 3 rayitas a su estado cerrado
    const checkbox = document.getElementById('toggle-menu') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  }
}