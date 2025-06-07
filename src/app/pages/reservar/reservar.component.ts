// Importaciones del core de Angular
import { Component, OnInit } from '@angular/core';

// Componentes hijos que conforman el flujo de reservas
import { CabanasComponent } from "./cabanas/cabanas.component";
import { FormularioComponent } from "./formulario/formulario.component";
import { ActividadesComponent } from "./actividades/actividades.component";
import { MenuComponent } from "./menu/menu.component";
import { CalendarioComponent } from './calendario/calendario.component';

// Servicio para manejar el estado de la cotización
import { CotizacionService } from './cotizacion.service';

// Componente principal para el módulo de reservas
// Orquesta todos los subcomponentes necesarios para el proceso de cotización
@Component({
  selector: 'app-cotizar',
  standalone: true,
  imports: [CabanasComponent, FormularioComponent, ActividadesComponent, MenuComponent, CalendarioComponent],  
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.css']
})

export class ReservarComponent implements OnInit {
  
  constructor(private cotizacionService: CotizacionService) { }

  ngOnInit(): void {
    // Limpia cualquier cotización anterior para empezar desde cero
    this.cotizacionService.reiniciarCotizacion();
    
    // Monitorea los cambios en tiempo real para debugging
    this.cotizacionService.cotizacion$.subscribe(cotizacion => {
      console.log('Estado actual de cotización:', cotizacion);
    });
  }
}