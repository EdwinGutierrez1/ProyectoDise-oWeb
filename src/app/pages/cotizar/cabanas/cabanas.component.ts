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

  // Precios base por tipo de cabaña
  private preciosBase = {
    1: 150000, // Cabaña #1 - 2 personas (1 pareja)
    2: 300000, // Cabaña #2 - 3-4 personas (precio base)
    3: 500000  // Cabaña #3 - 6-8 personas (precio base)
  };

  // Rangos de personas por cabaña
  private rangosPersonas = {
    1: { min: 2, max: 2 }, // Cabaña #1: exactamente 2 personas (1 pareja)
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
   * Obtiene el precio de la cabaña seleccionada con lógica variable
   * @returns Precio de la cabaña seleccionada según cantidad de personas
   */
  getPrecio(): number {
    if (!this.selectedCabana || !this.preciosBase[this.selectedCabana as keyof typeof this.preciosBase]) {
      return 0;
    }

    const precioBase = this.preciosBase[this.selectedCabana as keyof typeof this.preciosBase];

    // Lógica de precios variables según cantidad de personas
    switch (this.selectedCabana) {
      case 1:
        // Cabaña #1: precio fijo
        return precioBase;
      
      case 2:
        // Cabaña #2: 
        // - 3-4 personas: precio base (300,000)
        // - 5-6 personas: 350,000
        if (this.cantidadPersonas >= 5 && this.cantidadPersonas <= 6) {
          return 350000;
        }
        return precioBase;
      
      case 3:
        // Cabaña #3:
        // - 6-8 personas: precio base (500,000)
        // - 9-10 personas: 600,000
        if (this.cantidadPersonas >= 9 && this.cantidadPersonas <= 10) {
          return 600000;
        }
        return precioBase;
      
      default:
        return precioBase;
    }
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
      1: '1 Pareja',
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
      1: '1 Pareja',
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

  /**
   * Obtiene información de precios según la cantidad de personas
   * @returns String con información de precios
   */
  getPrecioInfo(): string {
    if (!this.selectedCabana) return '';

    switch (this.selectedCabana) {
      case 1:
        return 'Precio fijo para pareja';
      case 2:
        return this.cantidadPersonas >= 5 ? 
          'Precio para 5-6 personas' : 
          'Precio para 3-4 personas';
      case 3:
        return this.cantidadPersonas >= 9 ? 
          'Precio para 9-10 personas' : 
          'Precio para 6-8 personas';
      default:
        return '';
    }
  }
}