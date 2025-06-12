import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { CotizacionService } from '../../pages/reservar/cotizacion.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.css']
})
export class CookieBannerComponent implements OnInit {
  mostrarBanner = true;

  constructor(
    private cookieService: CookieService,
    private cotizacionService: CotizacionService
  ) {}

  ngOnInit() {
    // Verificar si el usuario ya ha tomado una decisión sobre las cookies
    const cookieConsentido = this.cookieService.get('cookie-consentimiento');
    this.mostrarBanner = !cookieConsentido;
  }

  aceptarCookies() {
    this.cookieService.set('cookie-consentimiento', 'aceptado', { expires: 365 });
    this.mostrarBanner = false;
    // Guardar el estado actual antes de cargar datos antiguos
    this.cotizacionService.guardarEnCookies(); 
    // Cargar datos guardados si existen
    this.cotizacionService.cargarDatosDeCookies();
  }

  rechazarCookies() {
    this.cookieService.set('cookie-consentimiento', 'rechazado', { expires: 365 });
    this.mostrarBanner = false;
    // Limpiar cualquier dato guardado
    this.cookieService.delete('datos-cotizacion');
  }
}
