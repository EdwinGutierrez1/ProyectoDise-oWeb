// cabanas.component.ts - COMPLETO CON TODAS LAS FUNCIONALIDADES
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CotizacionService, CabanaSeleccionada } from '../cotizacion.service';

@Component({
  selector: 'app-cabanas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabanas.component.html',
  styleUrls: ['./cabanas.component.css']
})
export class CabanasComponent implements OnInit, OnDestroy {
  selectedCabana: number | null = null;
  cantidadPersonas: number = 0;
  
  // Variables para el modal
  modalAbierto: boolean = false;
  cabanaModalActual: number | null = null;
  imagenActualIndex: number = 0;
  
  // Suscripción para cleanup
  private subscription: Subscription = new Subscription();

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

  // Imágenes por cabaña
  private imagenesCabanas = {
    1: [
      '/cabañapequeña1.jpg',
      '/cabañapequeña2.jpg',
      '/cabañapequeña3.jpg',
      '/cabañapequeña5.jpg'
    ],
    2: [
      '/cabañamediana1.jpg',
      '/cabañamediana2.jpg',
      '/cabañamediana3.jpg',
      '/cabañamediana4.jpg',
      '/cabañamediana5.jpg'
    ],
    3: [
      '/cabañagrande1.jpg',
      '/cabañagrande2.jpg',
      '/cabañagrande3.jpg',
      '/cabañagrande4.jpg',
      '/cabañagrande5.jpg'
    ]
  };

  // Información detallada de cada cabaña
  private informacionCabanas = {
    1: {
      nombre: 'Cabaña Romántica',
      capacidad: 'Pareja (2 personas)',
      descripcion: 'Perfecta para escapadas románticas. Cuenta con cama king size, jacuzzi privado, chimenea y vista panorámica. Ideal para celebrar aniversarios o lunas de miel.'
    },
    2: {
      nombre: 'Cabaña Familiar',
      capacidad: '3-6 personas',
      descripcion: 'Espaciosa cabaña ideal para familias. Incluye 3 habitaciones, sala de estar, cocina equipada, terraza con parrilla y área de juegos para niños.'
    },
    3: {
      nombre: 'Cabaña Grupal',
      capacidad: '6-10 personas',
      descripcion: 'La cabaña más grande, perfecta para grupos y reuniones. Cuenta con 5 habitaciones, 3 baños, amplia sala, cocina completa, terraza grande y área de fogata.'
    }
  };

  // Características de cada cabaña (habitaciones y baños) - LÓGICA COHERENTE
  private caracteristicasCabanas = {
    1: {
      habitaciones: 1,
      banos: 1
    },
    2: {
      habitaciones: 3,
      banos: 2
    },
    3: {
      habitaciones: 5,
      banos: 3
    }
  };

  constructor(private cotizacionService: CotizacionService) {}

  ngOnInit(): void {
    // Suscribirse a cambios en la cotización para mantener sincronización
    this.subscription.add(
      this.cotizacionService.cotizacion$.subscribe(cotizacion => {
        if (cotizacion.cabana) {
          this.selectedCabana = cotizacion.cabana.id;
          this.cantidadPersonas = cotizacion.cantidadPersonas;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // MÉTODOS DEL MODAL

  /**
   * Abre el modal de galería para una cabaña específica
   * @param cabanaId - ID de la cabaña (1, 2 o 3)
   */
  abrirModal(cabanaId: number): void {
    this.cabanaModalActual = cabanaId;
    this.imagenActualIndex = 0;
    this.modalAbierto = true;
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal de galería
   */
  cerrarModal(): void {
    this.modalAbierto = false;
    this.cabanaModalActual = null;
    this.imagenActualIndex = 0;
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }

  /**
   * Navega a la imagen anterior en la galería
   */
  imagenAnterior(): void {
    if (this.imagenActualIndex > 0) {
      this.imagenActualIndex--;
    }
  }

  /**
   * Navega a la imagen siguiente en la galería
   */
  imagenSiguiente(): void {
    const imagenes = this.getImagenesCabana();
    if (this.imagenActualIndex < imagenes.length - 1) {
      this.imagenActualIndex++;
    }
  }

  /**
   * Navega directamente a una imagen específica
   * @param index - Índice de la imagen
   */
  irAImagen(index: number): void {
    const imagenes = this.getImagenesCabana();
    if (index >= 0 && index < imagenes.length) {
      this.imagenActualIndex = index;
    }
  }

  /**
   * Obtiene la URL de la imagen actual
   * @returns URL de la imagen actual
   */
  getImagenActual(): string {
    const imagenes = this.getImagenesCabana();
    return imagenes[this.imagenActualIndex] || '';
  }

  /**
   * Obtiene el array de imágenes de la cabaña actual del modal
   * @returns Array de URLs de imágenes
   */
  getImagenesCabana(): string[] {
    if (!this.cabanaModalActual) return [];
    return this.imagenesCabanas[this.cabanaModalActual as keyof typeof this.imagenesCabanas] || [];
  }

  /**
   * Obtiene el nombre de la cabaña actual del modal
   * @returns Nombre de la cabaña
   */
  getNombreCabana(): string {
    if (!this.cabanaModalActual) return '';
    return this.informacionCabanas[this.cabanaModalActual as keyof typeof this.informacionCabanas]?.nombre || '';
  }

  /**
   * Obtiene la capacidad de la cabaña actual del modal
   * @returns Capacidad de la cabaña
   */
  getCapacidadCabana(): string {
    if (!this.cabanaModalActual) return '';
    return this.informacionCabanas[this.cabanaModalActual as keyof typeof this.informacionCabanas]?.capacidad || '';
  }

  /**
   * Obtiene la descripción de la cabaña actual del modal
   * @returns Descripción de la cabaña
   */
  getDescripcionCabana(): string {
    if (!this.cabanaModalActual) return '';
    return this.informacionCabanas[this.cabanaModalActual as keyof typeof this.informacionCabanas]?.descripcion || '';
  }

  /**
   * Obtiene el número de habitaciones de la cabaña actual del modal
   * @returns Número de habitaciones
   */
  getHabitacionesCabana(): number {
    if (!this.cabanaModalActual || !this.caracteristicasCabanas[this.cabanaModalActual as keyof typeof this.caracteristicasCabanas]) {
      return 0;
    }
    return this.caracteristicasCabanas[this.cabanaModalActual as keyof typeof this.caracteristicasCabanas].habitaciones;
  }

  /**
   * Obtiene el número de baños de la cabaña actual del modal
   * @returns Número de baños
   */
  getBanosCabana(): number {
    if (!this.cabanaModalActual || !this.caracteristicasCabanas[this.cabanaModalActual as keyof typeof this.caracteristicasCabanas]) {
      return 0;
    }
    return this.caracteristicasCabanas[this.cabanaModalActual as keyof typeof this.caracteristicasCabanas].banos;
  }

  /**
   * Elige la cabaña actual del modal y cierra el modal
   */
  elegirCabana(): void {
    if (this.cabanaModalActual) {
      this.selectCabana(this.cabanaModalActual);
      this.cerrarModal();
    }
  }

  // MÉTODOS ORIGINALES DEL COMPONENTE

  /**
   * Selecciona una cabaña y ajusta la cantidad de personas según el rango
   * @param cabanaId - ID de la cabaña (1, 2 o 3)
   */
  selectCabana(cabanaId: number): void {
    this.selectedCabana = cabanaId;
    
    // Establecer la cantidad mínima de personas según la cabaña
    const rango = this.rangosPersonas[cabanaId as keyof typeof this.rangosPersonas];
    this.cantidadPersonas = rango.min;
    
    // Actualizar el servicio de cotización
    this.actualizarCotizacion();
    
    console.log(`Cabaña seleccionada: ${cabanaId}, Personas: ${this.cantidadPersonas}`);
  }

  /**
   * Incrementa la cantidad de personas respetando el límite de la cabaña
   */
  incrementarPersonas(): void {
    if (this.selectedCabana && this.canIncrement()) {
      this.cantidadPersonas++;
      this.actualizarCotizacion();
    }
  }

  /**
   * Decrementa la cantidad de personas respetando el mínimo de la cabaña
   */
  decrementarPersonas(): void {
    if (this.selectedCabana && this.canDecrement()) {
      this.cantidadPersonas--;
      this.actualizarCotizacion();
    }
  }

  /**
   * Actualiza la cotización en el servicio
   */
  private actualizarCotizacion(): void {
    if (!this.selectedCabana) return;

    const capacidades = {
      1: '1 Pareja',
      2: '3-6 personas',
      3: '6-10 personas'
    };

    const cabanaData: CabanaSeleccionada = {
      id: this.selectedCabana,
      precio: this.getPrecio(),
      capacidad: capacidades[this.selectedCabana as keyof typeof capacidades],
      personas: this.cantidadPersonas
    };

    this.cotizacionService.actualizarCabana(cabanaData, this.cantidadPersonas);
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