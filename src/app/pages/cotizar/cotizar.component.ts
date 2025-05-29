import { Component } from '@angular/core';
import { CabanasComponent } from "./cabanas/cabanas.component";
import { FormularioComponent } from "./formulario/formulario.component";

@Component({
  selector: 'app-cotizar',
  standalone: true,
  imports: [CabanasComponent, FormularioComponent],  
  templateUrl: './cotizar.component.html',
  styleUrls: ['./cotizar.component.css']
})
export class CotizarComponent {}
