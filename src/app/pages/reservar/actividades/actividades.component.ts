// actividades.component.ts - ACTUALIZADO
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CotizacionService, DatosCotizacion } from '../cotizacion.service';

interface Actividad {
  id: number;
  nombre: string;
  precio: string;
  precioNumerico: number; // Nuevo campo para cálculos
  imagen: string;
  descripcion: string;
  incluye: string[];
  duracion: string;
}

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit, OnDestroy {
  selectedActividades: number[] = [];
  showModal: boolean = false;
  selectedActivityId: number | null = null;
  selectedActivityData: Actividad | null = null;
  
  // Datos de la cotización actual
  cantidadPersonas: number = 0;
  datosCotizacion: DatosCotizacion | null = null;
  
  // Suscripción para cleanup
  private subscription: Subscription = new Subscription();

  // IDs de actividades que son "por persona"
  private actividadesPorPersona: number[] = [3, 4, 5, 6]; // Kayak, Bici, Senderismo, Escalada

  // Iconos para cada actividad
  private activityIcons: { [key: number]: string } = {
    1: '🧘‍♀️', // Spa en pareja
    2: '🍎',   // Picnic gourmet
    3: '🛶',   // Kayak
    4: '🚵‍♂️', // Bici de montaña
    5: '🥾',   // Senderismo
    6: '⛰️ '    // Escalada en roca
  };

  // Datos de las actividades (actualizados con precios numéricos)
  private actividades: Actividad[] = [
    {
      id: 1,
      nombre: 'Spa en pareja',
      precio: '$150.000',
      precioNumerico: 150000,
      imagen: '/fotospa2.jpg',
      descripcion: 'Disfruta de una experiencia relajante y romántica en nuestro spa especializado para parejas. Un momento perfecto para conectar y relajarse juntos.',
      incluye: [
        '✔️ Masaje relajante para ambos',
        '✔️ Acceso a sauna y jacuzzi privado',
        '✔️ Aromaterapia personalizada',
        '✔️ Dos copas de champaña',
        '✔️ Toallas y batas de spa'
      ],
      duracion: '2 horas'
    },  
    {
      id: 2,
      nombre: 'Picnic gourmet en la naturaleza',
      precio: '$100.000',
      precioNumerico: 100000,
      imagen: '/fotopicnic2.jpeg',
      descripcion: 'Una experiencia culinaria única en medio de la naturaleza, con productos locales y orgánicos preparados por nuestro chef especializado.',
      incluye: [
        '✔️ Cesta de picnic con mantel y utensilios',
        '✔️ Selección de quesos artesanales locales',
        '✔️ Frutas frescas de temporada',
        '✔️ Sándwiches gourmet variados',
        '✔️ Bebidas naturales y vino',
        '✔️ Postre especial de la casa'
      ],
      duracion: '3 horas'
    },
    {
      id: 3,
      nombre: 'Kayak en río',
      precio: '$50.000',
      precioNumerico: 50000,
      imagen: '/fotokayak2.jpg',
      descripcion: 'Aventura acuática perfecta para explorar los hermosos paisajes naturales desde una perspectiva única. Ideal para principiantes y expertos.',
      incluye: [
        '✔️ Kayak individual o doble',
        '✔️ Chaleco salvavidas y casco',
        '✔️ Remo y kit de seguridad',
        '✔️ Guía experto certificado',
        '✔️ Instrucción básica de kayak',
        '✔️ Botella de agua'
      ],
      duracion: '2 horas'
    },
    {
      id: 4,
      nombre: 'Ruta en bici de montaña',
      precio: '$45.000',
      precioNumerico: 45000,
      imagen: '/fotobici2.jpg',
      descripcion: 'Recorre senderos naturales y disfruta de paisajes espectaculares en esta emocionante aventura sobre dos ruedas por terrenos montañosos.',
      incluye: [
        '✔️ Bicicleta de montaña de alta calidad',
        '✔️ Casco de seguridad',
        '✔️ Kit de reparación básico',
        '✔️ Guía especializado',
        '✔️ Mapa de rutas',
        '✔️ Hidratación durante el recorrido'
      ],
      duracion: '3 horas'
    },
    {
      id: 5,
      nombre: 'Senderismo a cascada natural',
      precio: '$60.000',
      precioNumerico: 60000,
      imagen: '/fotocascada2.jpg',
      descripcion: 'Descubre una cascada secreta a través de senderos naturales. Una caminata moderada que te llevará a uno de los lugares más hermosos de la región.',
      incluye: [
        '✔️ Guía naturalista experto',
        '✔️ Bastones de senderismo',
        '✔️ Kit de primeros auxilios',
        '✔️ Snack energético',
        '✔️ Botella de agua reutilizable',
        '✔️ Información sobre flora y fauna local'
      ],
      duracion: '4 horas'
    },
    {
      id: 6,
      nombre: 'Escalada en roca',
      precio: '$70.000',
      precioNumerico: 70000,
      imagen: '/fotoescalada2.jpg',
      descripcion: 'Desafía tus límites con esta emocionante actividad de escalada en formaciones rocosas naturales, con total seguridad y supervisión profesional.',
      incluye: [
        '✔️ Equipo completo de escalada',
        '✔️ Arnés y casco de seguridad',
        '✔️ Cuerdas y sistema de aseguramiento',
        '✔️ Instructor certificado',
        '✔️ Clase básica de técnicas',
        '✔️ Seguro de actividad'
      ],
      duracion: '3 horas'
    }
  ];

  constructor(private cotizacionService: CotizacionService) {}

  ngOnInit(): void {
    // Suscribirse a cambios en la cotización
    this.subscription.add(
      this.cotizacionService.cotizacion$.subscribe(cotizacion => {
        this.datosCotizacion = cotizacion;
        this.cantidadPersonas = cotizacion.cantidadPersonas;
        
        // Actualizar selectedActividades basado en las actividades del servicio
        this.selectedActividades = cotizacion.actividades.map(a => a.id);
        
        console.log('Datos de cotización actualizados:', cotizacion);
        console.log('Cantidad de personas:', this.cantidadPersonas);
      })
    );

    // Listener para cerrar modal con Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.showModal) {
        this.closeModal();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Verifica si una actividad es "por persona"
   * @param actividadId - ID de la actividad
   * @returns true si la actividad es por persona
   */
  isPorPersona(actividadId: number): boolean {
    return this.actividadesPorPersona.includes(actividadId);
  }

  /**
   * Calcula el precio total de una actividad según si es por persona o no
   * @param actividadId - ID de la actividad
   * @returns Precio total calculado
   */
  calcularPrecioTotal(actividadId: number): number {
    const actividad = this.actividades.find(a => a.id === actividadId);
    if (!actividad) return 0;

    if (this.isPorPersona(actividadId)) {
      return actividad.precioNumerico * this.cantidadPersonas;
    }
    
    return actividad.precioNumerico;
  }

  /**
   * Obtiene el precio formateado para mostrar
   * @param actividadId - ID de la actividad
   * @returns String con el precio formateado
   */
  getPrecioMostrar(actividadId: number): string {
    const actividad = this.actividades.find(a => a.id === actividadId);
    if (!actividad) return '$0';

    if (this.isPorPersona(actividadId) && this.cantidadPersonas > 0) {
      const precioTotal = this.calcularPrecioTotal(actividadId);
      return `$${precioTotal.toLocaleString()} (${actividad.precio} x${this.cantidadPersonas})`;
    }
    
    return actividad.precio;
  }

  /**
   * Abre el modal con la información de la actividad seleccionada
   * @param actividadId - ID de la actividad
   */
  openModal(actividadId: number): void {
    this.selectedActivityId = actividadId;
    this.selectedActivityData = this.actividades.find(a => a.id === actividadId) || null;
    this.showModal = true;
    
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedActivityId = null;
    this.selectedActivityData = null;
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }

  /**
   * Alterna la selección de una actividad (agregar o quitar)
   */
  elegirActividad(): void {
    if (this.selectedActivityId) {
      const actividad = this.actividades.find(a => a.id === this.selectedActivityId);
      if (!actividad) return;

      if (this.isActividadSelected(this.selectedActivityId)) {
        // Quitar actividad del servicio
        this.cotizacionService.quitarActividad(this.selectedActivityId);
      } else {
        // Agregar actividad al servicio
        this.cotizacionService.agregarActividad({
          id: actividad.id,
          nombre: actividad.nombre,
          precioUnitario: actividad.precioNumerico,
          porPersona: this.isPorPersona(actividad.id)
        });
      }
      
      this.closeModal();
    }
  }

  /**
   * Verifica si una actividad está seleccionada
   * @param actividadId - ID de la actividad
   * @returns true si la actividad está seleccionada
   */
  isActividadSelected(actividadId: number): boolean {
    return this.cotizacionService.isActividadSeleccionada(actividadId);
  }

  /**
   * Verifica si el título es largo para mobile
   * @param actividadId - ID de la actividad
   * @returns true si tiene título largo
   */
  hasLongTitleForMobile(actividadId: number): boolean {
    const actividadesConTituloLargo = [2, 5]; // Picnic gourmet y Senderismo
    return actividadesConTituloLargo.includes(actividadId);
  }

  /**
   * Obtiene la lista de actividades seleccionadas con su información completa
   * @returns Array de actividades seleccionadas
   */
  getActividadesSeleccionadas(): Actividad[] {
    const actividadesDelServicio = this.cotizacionService.obtenerActividadesSeleccionadas();
    return this.actividades.filter(actividad => 
      actividadesDelServicio.some(a => a.id === actividad.id)
    );
  }

  /**
   * Obtiene el icono correspondiente a una actividad
   * @param activityId - ID de la actividad
   * @returns Emoji del icono o string vacío si no existe
   */
  getActivityIcon(activityId: number): string {
    return this.activityIcons[activityId] || '';
  }

  /**
   * Obtiene el total de actividades seleccionadas
   * @returns Número de actividades seleccionadas
   */
  getTotalActividadesSeleccionadas(): number {
    return this.selectedActividades.length;
  }

  /**
   * Limpia todas las selecciones
   */
  limpiarSelecciones(): void {
    // Remover todas las actividades del servicio
    this.selectedActividades.forEach(actividadId => {
      this.cotizacionService.quitarActividad(actividadId);
    });
    
    console.log('Selecciones limpiadas');
  }

  /**
   * Obtiene información resumida de la selección actual
   * @returns Objeto con información de las actividades seleccionadas
   */
  getResumenSeleccion(): {
    cantidad: number;
    actividades: string[];
    isValid: boolean;
    subtotal: number;
  } {
    const actividadesSeleccionadas = this.getActividadesSeleccionadas();
    const subtotal = this.datosCotizacion?.subtotalActividades || 0;
    
    return {
      cantidad: actividadesSeleccionadas.length,
      actividades: actividadesSeleccionadas.map(a => a.nombre),
      isValid: actividadesSeleccionadas.length > 0,
      subtotal: subtotal
    };
  }

  /**
   * Verifica si hay al menos una actividad seleccionada
   * @returns true si hay selecciones válidas
   */
  hasValidSelection(): boolean {
    return this.selectedActividades.length > 0;
  }

  /**
   * Obtiene una actividad por su ID
   * @param id - ID de la actividad
   * @returns Actividad encontrada o null
   */
  getActividadById(id: number): Actividad | null {
    return this.actividades.find(actividad => actividad.id === id) || null;
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
   * Verifica si se puede mostrar información de actividades (hay personas seleccionadas)
   * @returns true si hay personas seleccionadas en cabañas
   */
  canShowActividades(): boolean {
    return this.cantidadPersonas > 0;
  }

  /**
   * Obtiene mensaje de advertencia si no hay personas seleccionadas
   * @returns Mensaje para mostrar al usuario
   */
  getMensajeAdvertencia(): string {
    if (this.cantidadPersonas === 0) {
      return 'Primero selecciona una cabaña y la cantidad de personas para ver los precios de las actividades.';
    }
    return '';
  }

  /**
   * Obtiene el subtotal de actividades formateado
   * @returns String con el subtotal formateado
   */
  getSubtotalFormateado(): string {
    const subtotal = this.datosCotizacion?.subtotalActividades || 0;
    return `${subtotal.toLocaleString()}`;
  }

  /**
   * Verifica si hay una cabaña seleccionada
   * @returns true si hay cabaña seleccionada
   */
  tieneCabanaSeleccionada(): boolean {
    return this.datosCotizacion?.cabana !== null;
  }

    /**
   * Verifica si la cabaña seleccionada es para parejas (ID 1)
   * @returns true si es cabaña para parejas
   */
  esCabanaPareja(): boolean {
    return this.datosCotizacion?.cabana?.id === 1;
  }


  /**
   * Verifica si una actividad de pareja está deshabilitada por no tener cabaña de pareja
   * @param actividadId - ID de la actividad
   * @returns true si está deshabilitada
   */
  isActividadParejaDeshabilitada(actividadId: number): boolean {
    return this.tieneCabanaSeleccionada() && !this.esCabanaPareja() && [1, 2].includes(actividadId);
  }

  
    /**
   * Verifica si se puede seleccionar una actividad
   * @param actividadId - ID de la actividad
   * @returns true si se puede seleccionar
   */

    canSelectActivity(actividadId: number): boolean {
      // No se puede seleccionar si no hay cabaña
      if (!this.tieneCabanaSeleccionada()) {
        return false;
      }
      
      // Si NO es cabaña para parejas y es actividad de pareja (1 o 2), no se puede seleccionar
      if (!this.esCabanaPareja() && [1, 2].includes(actividadId)) {
        return false;
      }
      
      return true;
    }


  /**
   * Obtiene información de actividades por persona vs fijas
   * @returns Objeto con conteos de actividades
   */
  getEstadisticasActividades(): {
    porPersona: number;
    fijas: number;
    total: number;
  } {
    const seleccionadas = this.getActividadesSeleccionadas();
    const porPersona = seleccionadas.filter(a => this.isPorPersona(a.id)).length;
    const fijas = seleccionadas.length - porPersona;

    return {
      porPersona,
      fijas,
      total: seleccionadas.length
    };
  }
}