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
  cantidadPersonas: number = 0;

  // Precios por tipo de cabaña
  private precios = {
    1: 150000, // Cabaña #1 - 2 parejas (4 personas fijas)
    2: 300000, // Cabaña #2 - 3-6 personas
    3: 500000  // Cabaña #3 - 6-10 personas
  };

  // Rangos de personas por cabaña
  private rangosPersonas = {
    1: { min: 2, max: 2 }, // Cabaña #1: exactamente 4 personas (2 parejas)
    2: { min: 3, max: 6 }, // Cabaña #2: 3-6 personas
    3: { min: 6, max: 10 } // Cabaña #3: 6-10 personas
  };

  /**
   * Selecciona una cabaña y ajusta la cantidad de personas según el rango
   * @param cabanaId - ID de la cabaña (1, 2 o 3)
   */
  selectCabana(cabanaId: number): void {
    this.selectedCabana = cabanaId;
    
    // Establecer la cantidad mínima de personas según la cabaña
    const rango = this.rangosPersonas[cabanaId as keyof typeof this.rangosPersonas];
    this.cantidadPersonas = rango.min;
    
    console.log(`Cabaña seleccionada: ${cabanaId}, Personas: ${this.cantidadPersonas}`);
  }

  /**
   * Incrementa la cantidad de personas respetando el límite de la cabaña
   */
  incrementarPersonas(): void {
    if (this.selectedCabana && this.canIncrement()) {
      this.cantidadPersonas++;
    }
  }

  /**
   * Decrementa la cantidad de personas respetando el mínimo de la cabaña
   */
  decrementarPersonas(): void {
    if (this.selectedCabana && this.canDecrement()) {
      this.cantidadPersonas--;
    }
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
   * Verifica si el contador puede incrementar según el rango de la cabaña
   * @returns true si se puede incrementar
   */
  canIncrement(): boolean {
    if (!this.selectedCabana) return false;
    
    const rango = this.rangosPersonas[this.selectedCabana as keyof typeof this.rangosPersonas];
    return this.cantidadPersonas < rango.max;
  }

  /**
   * Verifica si el contador puede decrementar según el rango de la cabaña
   * @returns true si se puede decrementar
   */
  canDecrement(): boolean {
    if (!this.selectedCabana) return false;
    
    const rango = this.rangosPersonas[this.selectedCabana as keyof typeof this.rangosPersonas];
    return this.cantidadPersonas > rango.min;
  }

  /**
   * Verifica si la cabaña seleccionada tiene contador fijo (cabaña 1)
   * @returns true si es la cabaña 1 (contador deshabilitado)
   */
  isContadorFijo(): boolean {
    return this.selectedCabana === 1;
  }

  /**
   * Obtiene información completa de la reserva
   * @returns Objeto con información de la cabaña y personas
   */
  getReservaInfo(): { 
    cabana: number; 
    precio: number; 
    capacidad: string; 
    personas: number;
    isValid: boolean;
  } | null {
    if (!this.selectedCabana) return null;

    const capacidades = {
      1: '2 Parejas',
      2: '3-6 personas',
      3: '6-10 personas'
    };

    const rango = this.rangosPersonas[this.selectedCabana as keyof typeof this.rangosPersonas];

    return {
      cabana: this.selectedCabana,
      precio: this.getPrecio(),
      capacidad: capacidades[this.selectedCabana as keyof typeof capacidades],
      personas: this.cantidadPersonas,
      isValid: this.cantidadPersonas >= rango.min && this.cantidadPersonas <= rango.max
    };
  }

  /**
   * Verifica si la reserva está completa y válida
   * @returns true si se puede proceder con la reserva
   */
  isReservaValida(): boolean {
    const reserva = this.getReservaInfo();
    return reserva?.isValid || false;
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

  /**
   * Obtiene el rango de personas para la cabaña seleccionada
   * @returns Objeto con min y max de personas
   */
  getRangoPersonas(): { min: number; max: number } | null {
    if (!this.selectedCabana) return null;
    return this.rangosPersonas[this.selectedCabana as keyof typeof this.rangosPersonas];
  }
}