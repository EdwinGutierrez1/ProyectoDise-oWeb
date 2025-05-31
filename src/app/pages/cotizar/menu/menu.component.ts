// comidas.component.ts - ACTUALIZADO
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CotizacionService, DatosCotizacion } from '../cotizacion.service';

interface OpcionComida {
  nombre: string;
  descripcion: string;
  imagen: string;
}

interface Comida {
  id: number;
  nombre: string;
  precio: string;
  precioNumerico: number;
  imagen: string;
  opciones: OpcionComida[];
  incluido?: boolean; // Nueva propiedad para marcar si está incluido
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  selectedComidas: number[] = [];
  showModal: boolean = false;
  selectedComidaId: number | null = null;
  selectedComidaData: Comida | null = null;
  
  // Datos de la cotización actual
  cantidadPersonas: number = 0;
  datosCotizacion: DatosCotizacion | null = null;
  
  // Suscripción para cleanup
  private subscription: Subscription = new Subscription();

  // Iconos para cada comida
  private comidaIcons: { [key: number]: string } = {
    1: '🍳', // Desayuno
    2: '🍽️', // Almuerzo
    3: '🌙'  // Cena
  };

  // Datos de las comidas
  private comidas: Comida[] = [
    {
      id: 1,
      nombre: 'Desayuno',
      precio: 'Incluido',
      precioNumerico: 0, // El desayuno no tiene costo adicional
      imagen: '/desayuno.jpg',
      incluido: true, // Marcamos que está incluido
      opciones: [
        {
          nombre: 'Desayuno Campestre',
          descripcion: 'Huevos pericos con cebollín, arepa de maíz, queso fresco, aguacate, mermelada casera y café de finca.',
          imagen: '/desayuno-campestre.jpg'
        },
        {
          nombre: 'Desayuno Energético',
          descripcion: 'Bowl de granola casera con yogurt natural, frutas frescas de temporada, miel de abejas y frutos secos.',
          imagen: '/desayuno-energetico.jpg'
        },
        {
          nombre: 'Desayuno Internacional',
          descripcion: 'Pancakes de avena con miel, frutas frescas, huevos revueltos, tocineta y jugo natural de naranja.',
          imagen: '/desayuno-internacional.jpg'
        }
      ]
    },
    {
      id: 2,
      nombre: 'Almuerzo',
      precio: '$45.000',
      precioNumerico: 45000,
      imagen: '/almuerzo.jpg',
      incluido: false,
      opciones: [
        {
          nombre: 'Trucha a la Plancha',
          descripcion: 'Trucha fresca de río con arroz de coco, patacones, ensalada fresca y ají casero. Incluye limonada natural.',
          imagen: '/trucha.jpg'
        },
        {
          nombre: 'Pollo al Horno con Hierbas',
          descripcion: 'Pechuga de pollo marinada con hierbas finas, acompañada de papas al romero, vegetales salteados y salsa BBQ.',
          imagen: '/pollo.jpg'
        },
        {
          nombre: 'Sancocho de Gallina',
          descripcion: 'Tradicional sancocho con gallina criolla, yuca, plátano, mazorca y cilantro. Servido con arroz blanco y aguacate.',
          imagen: '/sancocho.jpg'
        }
      ]
    },
    {
      id: 3,
      nombre: 'Cena',
      precio: '$40.000',
      precioNumerico: 40000,
      imagen: '/cena.jpg',
      incluido: false,
      opciones: [
        {
          nombre: 'Lomo de Cerdo en Salsa de Tamarindo',
          descripcion: 'Lomo de cerdo jugoso bañado en salsa agridulce de tamarindo, puré de yuca y vegetales grillados.',
          imagen: '/lomo-tamarindo.jpg'
        },
        {
          nombre: 'Pescado en Hoja de Plátano',
          descripcion: 'Filete de pescado envuelto en hoja de plátano con especias locales, arroz con coco y ensalada tropical.',
          imagen: '/pescado-platano.jpg'
        },
        {
          nombre: 'Parrillada Mixta',
          descripcion: 'Selección de carnes a la parrilla: pollo, res y chorizo, acompañada de arepa, yuca cocida y chimichurri casero.',
          imagen: '/parrillada-mixta.jpg'
        }
      ]
    }
  ];

  constructor(private cotizacionService: CotizacionService) {}

  ngOnInit(): void {
    // Suscribirse a cambios en la cotización
    this.subscription.add(
      this.cotizacionService.cotizacion$.subscribe(cotizacion => {
        this.datosCotizacion = cotizacion;
        this.cantidadPersonas = cotizacion.cantidadPersonas;
        
        // Actualizar selectedComidas basado en las comidas del servicio
        this.selectedComidas = cotizacion.comidas.map(c => c.id);
        
        // Asegurar que el desayuno esté siempre incluido si hay una cabaña seleccionada
        if (cotizacion.cabana && !this.selectedComidas.includes(1)) {
          this.selectedComidas.push(1);
        }
        
        console.log('Datos de cotización actualizados:', cotizacion);
        console.log('Cantidad de personas:', this.cantidadPersonas);
      })
    );

    // Listener para cerrar modal con Escape
    const escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.showModal) {
        this.closeModal();
      }
    };
    
    document.addEventListener('keydown', escapeListener);
    
    // Guardar referencia para poder remover el listener
    this.subscription.add(() => {
      document.removeEventListener('keydown', escapeListener);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Calcula el precio total de una comida
   * @param comidaId - ID de la comida
   * @returns Precio total calculado
   */
  calcularPrecioTotal(comidaId: number): number {
    const comida = this.comidas.find(c => c.id === comidaId);
    if (!comida || comida.incluido) return 0; // Si está incluido, no suma al total

    return comida.precioNumerico * this.cantidadPersonas;
  }

  

  /**
   * Obtiene el precio formateado para mostrar
   * @param comidaId - ID de la comida
   * @returns String con el precio formateado
   */
  getPrecioMostrar(comidaId: number): string {
    const comida = this.comidas.find(c => c.id === comidaId);
    if (!comida) return '$0';

    // Si está incluido, mostrar "Incluido"
    if (comida.incluido) {
      return 'Incluido';
    }

    if (this.cantidadPersonas > 0) {
      const precioTotal = this.calcularPrecioTotal(comidaId);
      return `$${precioTotal.toLocaleString()} (${comida.precio} x${this.cantidadPersonas})`;
    }
    
    return comida.precio;
  }

  /**
   * Abre el modal con la información de la comida seleccionada
   * @param comidaId - ID de la comida
   */
  openModal(comidaId: number): void {
    this.selectedComidaId = comidaId;
    this.selectedComidaData = this.comidas.find(c => c.id === comidaId) || null;
    this.showModal = true;
    
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedComidaId = null;
    this.selectedComidaData = null;
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }

  /**
   * Alterna la selección de una comida (agregar o quitar)
   * No permite quitar el desayuno ya que está incluido
   */
  seleccionarComida(): void {
    if (this.selectedComidaId) {
      const comida = this.comidas.find(c => c.id === this.selectedComidaId);
      if (!comida) return;

      // Si es el desayuno (incluido), no hacer nada ya que siempre está seleccionado
      if (comida.incluido) {
        this.closeModal();
        return;
      }

      if (this.isComidaSelected(this.selectedComidaId)) {
        // Quitar comida del servicio
        this.cotizacionService.quitarComida(this.selectedComidaId);
      } else {
        // Agregar comida al servicio
        this.cotizacionService.agregarComida({
          id: comida.id,
          nombre: comida.nombre,
          precioUnitario: comida.precioNumerico,
          porPersona: true // Todas las comidas son por persona
        });
      }
      
      this.closeModal();
    }
  }

  /**
   * Verifica si una comida está seleccionada
   * El desayuno siempre está seleccionado si hay cabaña
   * @param comidaId - ID de la comida
   * @returns true si la comida está seleccionada
   */
  isComidaSelected(comidaId: number): boolean {
    // Si es el desayuno y hay cabaña seleccionada, siempre está seleccionado
    if (comidaId === 1 && this.tieneCabanaSeleccionada()) {
      return true;
    }
    
    // Para otras comidas, verificar en el servicio
    return this.cotizacionService.isComidaSeleccionada(comidaId);
  }

  /**
   * Obtiene la lista de comidas seleccionadas con su información completa
   * @returns Array de comidas seleccionadas
   */
  getComidasSeleccionadas(): Comida[] {
    const comidasDelServicio = this.cotizacionService.obtenerComidasSeleccionadas();
    const comidasSeleccionadas = this.comidas.filter(comida => 
      comidasDelServicio.some(c => c.id === comida.id)
    );

    // Siempre incluir el desayuno si hay cabaña seleccionada
    if (this.tieneCabanaSeleccionada() && !comidasSeleccionadas.some(c => c.id === 1)) {
      const desayuno = this.comidas.find(c => c.id === 1);
      if (desayuno) {
        comidasSeleccionadas.unshift(desayuno); // Agregar al inicio
      }
    }

    return comidasSeleccionadas;
  }

  /**
   * Obtiene el icono correspondiente a una comida
   * @param comidaId - ID de la comida
   * @returns Emoji del icono o string vacío si no existe
   */
  getComidaIcon(comidaId: number): string {
    return this.comidaIcons[comidaId] || '';
  }

  /**
   * Obtiene el total de comidas seleccionadas (sin contar incluidas)
   * @returns Número de comidas seleccionadas que tienen costo
   */
  getTotalComidasSeleccionadas(): number {
    return this.selectedComidas.filter(id => {
      const comida = this.comidas.find(c => c.id === id);
      return comida && !comida.incluido;
    }).length;
  }

  /**
   * Limpia todas las selecciones (excepto las incluidas)
   */
  limpiarSelecciones(): void {
    // Usar el método del servicio para limpiar todas las comidas
    this.cotizacionService.limpiarComidas();
    
    // Mantener solo las comidas incluidas
    this.selectedComidas = this.selectedComidas.filter(id => {
      const comida = this.comidas.find(c => c.id === id);
      return comida && comida.incluido;
    });
    
    console.log('Selecciones de comidas limpiadas (manteniendo incluidas)');
  }

  /**
   * Obtiene información resumida de la selección actual
   * @returns Objeto con información de las comidas seleccionadas
   */
  getResumenSeleccion(): {
    cantidad: number;
    comidas: string[];
    isValid: boolean;
    subtotal: number;
  } {
    const comidasSeleccionadas = this.getComidasSeleccionadas();
    const subtotal = this.datosCotizacion?.subtotalComidas || 0;
    
    return {
      cantidad: comidasSeleccionadas.length,
      comidas: comidasSeleccionadas.map(c => c.nombre),
      isValid: comidasSeleccionadas.length > 0,
      subtotal: subtotal
    };
  }

  /**
   * Verifica si hay al menos una comida seleccionada
   * @returns true si hay selecciones válidas
   */
  hasValidSelection(): boolean {
    return this.selectedComidas.length > 0;
  }

  /**
   * Obtiene una comida por su ID
   * @param id - ID de la comida
   * @returns Comida encontrada o null
   */
  getComidaById(id: number): Comida | null {
    return this.comidas.find(comida => comida.id === id) || null;
  }

  /**
   * Maneja el cierre del modal con la tecla Escape
   * @param event - Evento del teclado
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showModal) {
      this.closeModal();
    }
  }

  /**
   * Verifica si se puede mostrar información de comidas (hay personas seleccionadas)
   * @returns true si hay personas seleccionadas en cabañas
   */
  canShowComidas(): boolean {
    return this.cantidadPersonas > 0;
  }

  /**
   * Obtiene mensaje de advertencia si no hay personas seleccionadas
   * @returns Mensaje para mostrar al usuario
   */
  getMensajeAdvertencia(): string {
    if (this.cantidadPersonas === 0) {
      return 'Primero selecciona una cabaña y la cantidad de personas para ver los precios de las comidas.';
    }
    return '';
  }

  /**
   * Obtiene el subtotal de comidas formateado
   * @returns String con el subtotal formateado
   */
  getSubtotalFormateado(): string {
    const subtotal = this.datosCotizacion?.subtotalComidas || 0;
    return `$${subtotal.toLocaleString()}`;
  }

  /**
   * Verifica si hay una cabaña seleccionada
   * @returns true si hay cabaña seleccionada
   */
  tieneCabanaSeleccionada(): boolean {
    return this.datosCotizacion?.cabana !== null;
  }

  /**
   * Verifica si se puede seleccionar una comida
   * @param comidaId - ID de la comida
   * @returns true si se puede seleccionar
   */
  canSelectComida(comidaId: number): boolean {
    // No se puede seleccionar si no hay cabaña
    return this.tieneCabanaSeleccionada();
  }

  /**
   * Obtiene información de comidas seleccionadas
   * @returns Objeto con estadísticas de comidas
   */
  getEstadisticasComidas(): {
    desayunos: number;
    almuerzos: number;
    cenas: number;
    total: number;
  } {
    const desayunos = this.isComidaSelected(1) ? 1 : 0;
    const almuerzos = this.isComidaSelected(2) ? 1 : 0;
    const cenas = this.isComidaSelected(3) ? 1 : 0;

    return {
      desayunos,
      almuerzos,
      cenas,
      total: desayunos + almuerzos + cenas
    };
  }

  /**
   * Obtiene el precio unitario de una comida
   * @param comidaId - ID de la comida
   * @returns Precio unitario
   */
  getPrecioUnitario(comidaId: number): number {
    const comida = this.comidas.find(c => c.id === comidaId);
    return comida?.precioNumerico || 0;
  }

  /**
   * Verifica si el modal está visible
   * @returns true si el modal está abierto
   */
  isModalOpen(): boolean {
    return this.showModal;
  }

  /**
   * Obtiene la comida actualmente seleccionada en el modal
   * @returns Comida seleccionada o null
   */
  getSelectedComida(): Comida | null {
    return this.selectedComidaData;
  }

  /**
   * Obtiene todas las comidas disponibles
   * @returns Array de todas las comidas
   */
  getTodasLasComidas(): Comida[] {
    return this.comidas;
  }

  /**
   * Obtiene el texto del botón del modal según el estado de la comida
   * @returns Texto para mostrar en el botón
   */
/**
 * Obtiene el texto del botón del modal según el estado de la comida
 * @returns Texto para mostrar en el botón
 */
  getBotonTexto(): string {
    if (!this.selectedComidaId) return 'Seleccionar';

    const comida = this.comidas.find(c => c.id === this.selectedComidaId);
    
    // Si es una comida incluida (desayuno), no debería mostrar botón
    if (comida && comida.incluido) {
      return '';
    }

    // Si la comida está seleccionada, mostrar "Quitar"
    if (this.isComidaSelected(this.selectedComidaId)) {
      return 'Quitar del menú';
    }

    // Si no está seleccionada, mostrar "Seleccionar"
    return 'Agregar al menú';
  }

  /**
   * Verifica si una comida está incluida
   * @param comidaId - ID de la comida
   * @returns true si la comida está incluida
   */
  isComidaIncluida(comidaId: number): boolean {
    const comida = this.comidas.find(c => c.id === comidaId);
    return comida?.incluido || false;
  }

  /**
   * Obtiene el texto del precio para mostrar en el modal
   * @returns Texto del precio formateado
   */
  getModalPrecioTexto(): string {
    if (!this.selectedComidaData) return '';

    if (this.selectedComidaData.incluido) {
      return 'Incluido';
    }

    return this.selectedComidaData.precio;
  }

  /**
   * Obtiene el texto descriptivo para mostrar debajo del precio en el modal
   * @returns Texto descriptivo
   */
  getModalPrecioDescripcion(): string {
    if (!this.selectedComidaData) return '';

    if (this.selectedComidaData.incluido) {
      return 'en tu estadía';
    }

    return 'por persona';
  }
}