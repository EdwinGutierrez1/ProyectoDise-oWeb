import { Component, OnInit } from '@angular/core';
import { CabanasComponent } from "./cabanas/cabanas.component";
import { FormularioComponent } from "./formulario/formulario.component";
import { ActividadesComponent } from "./actividades/actividades.component";
import { CotizacionService } from './cotizacion.service';
import { MenuComponent } from "./menu/menu.component";
import { CalendarioComponent } from './calendario/calendario.component';

@Component({
  selector: 'app-cotizar',
  standalone: true,
  imports: [CabanasComponent, FormularioComponent, ActividadesComponent, MenuComponent, CalendarioComponent],  
  templateUrl: './cotizar.component.html',
  styleUrls: ['./cotizar.component.css']
})

export class CotizarComponent implements OnInit {
  
  constructor(private cotizacionService: CotizacionService) { }

  ngOnInit(): void {
    // Reiniciar cotización al iniciar
    this.cotizacionService.reiniciarCotizacion();
    
    // Suscribirse a cambios para debug (opcional)
    this.cotizacionService.cotizacion$.subscribe(cotizacion => {
      console.log('Estado actual de cotización:', cotizacion);
    });
  }
}