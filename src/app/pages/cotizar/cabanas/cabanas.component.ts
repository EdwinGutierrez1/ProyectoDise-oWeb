// cabanas.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cabanas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabanas.component.html',
  styleUrls: ['./cabanas.component.css']
})
export class CabanasComponent {
  selectedCabana: number | null = null;

  // Precios por tipo de cabaña
  private precios = {
    1: 150000, // Cabaña #1 - 2 parejas
    2: 300000, // Cabaña #2 - 3-6 personas
    3: 500000  // Cabaña #3 - 6-10 personas
  };

  /**
   * Selecciona una cabaña
   * @param cabanaId - ID de la cabaña (1, 2 o 3)
   */
  selectCabana(cabanaId: number): void {
    this.selectedCabana = cabanaId;
    console.log(`Cabaña seleccionada: ${cabanaId}`);
  }

  /**
   * Obtiene el precio de la cabaña seleccionada
   * @returns Precio de la cabaña seleccionada
   */
  getPrecio(): number {
    if (this.selectedCabana && this.precios[this.selectedCabana as keyof typeof this.precios]) {
      return this.precios[this.selectedCabana as keyof typeof this.precios];
    }
    return 0;
  }

  /**
   * Verifica si una cabaña está seleccionada
   * @param cabanaId - ID de la cabaña
   * @returns true si la cabaña está seleccionada
   */
  isCabanaSelected(cabanaId: number): boolean {
    return this.selectedCabana === cabanaId;
  }

  /**
   * Obtiene información de la cabaña seleccionada
   * @returns Objeto con información de la cabaña
   */
  getSelectedCabanaInfo(): { id: number; precio: number; capacidad: string } | null {
    if (!this.selectedCabana) return null;

    const capacidades = {
      1: '2 Parejas',
      2: '3-6 personas',
      3: '6-10 personas'
    };

    return {
      id: this.selectedCabana,
      precio: this.getPrecio(),
      capacidad: capacidades[this.selectedCabana as keyof typeof capacidades]
    };
  }
}