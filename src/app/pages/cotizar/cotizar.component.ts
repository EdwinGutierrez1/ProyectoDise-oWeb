import { Component } from '@angular/core';
import { CabanasComponent } from "./cabanas/cabanas.component";
import { FormularioComponent } from "./formulario/formulario.component";
import { ActividadesComponent } from "./actividades/actividades.component";
import { MenuComponent } from "./menu/menu.component";

@Component({
  selector: 'app-cotizar',
  standalone: true,
  imports: [CabanasComponent, FormularioComponent, ActividadesComponent, MenuComponent],  
  templateUrl: './cotizar.component.html',
  styleUrls: ['./cotizar.component.css']
})
export class CotizarComponent {}
