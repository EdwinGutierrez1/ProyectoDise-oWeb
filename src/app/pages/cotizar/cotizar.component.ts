import { Component } from '@angular/core';
import { CabanasComponent } from "./cabanas/cabanas.component";

@Component({
  selector: 'app-cotizar',
  standalone: true,
  imports: [CabanasComponent],  // <-- Aquí importas navbar para poder usarlo
  templateUrl: './cotizar.component.html',
  styleUrls: ['./cotizar.component.css']
})
export class CotizarComponent {}
