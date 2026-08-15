// actividades.component.ts - ACTUALIZADO
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CotizacionService, DatosCotizacion } from '../cotizacion.service';

interface Actividad {
  id: number;
  nombre: string;
  precio: string;
  precioNumerico: number; // Para hacer cálculos matemáticos sin formato
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
  
  // Variables que mantienen el estado actual de la cotización
  cantidadPersonas: number = 0;
  datosCotizacion: DatosCotizacion | null = null;
  
  // Para limpiar suscripciones y evitar memory leaks
  private subscription: Subscription = new Subscription();

  // Actividades que se cobran por cada persona (no son precio fijo)
  private actividadesPorPersona: number[] = [3, 4, 5, 6]; // Kayak, Bici, Senderismo, Escalada

  // Emojis para mejorar la interfaz visual
  private activityIcons: { [key: number]: string } = {
    1: '🧘‍♀️', // Spa en pareja
    2: '🍎',   // Picnic gourmet
    3: '🛶',   // Kayak
    4: '🚵‍♂️', // Bici de montaña
    5: '🥾',   // Senderismo
    6: '⛰️ '    // Escalada en roca
  };

  // Base de datos local de todas las actividades disponibles
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
      imagen: '/fotocascada2.png',
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
    // Mantener el componente sincronizado con los cambios del servicio de cotización
    this.subscription.add(
      this.cotizacionService.cotizacion$.subscribe(cotizacion => {
        this.datosCotizacion = cotizacion;
        this.cantidadPersonas = cotizacion.cantidadPersonas;
        
        // Sincronizar las actividades seleccionadas localmente
        this.selectedActividades = cotizacion.actividades.map(a => a.id);
        
        console.log('Datos de cotización actualizados:', cotizacion);
        console.log('Cantidad de personas:', this.cantidadPersonas);
      })
    );

    // Funcionalidad para cerrar modal con tecla Escape
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
   * Determina si una actividad tiene precio variable según personas
   */
  isPorPersona(actividadId: number): boolean {
    return this.actividadesPorPersona.includes(actividadId);
  }

  /**
   * Calcula el precio final considerando si es por persona o precio fijo
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
   * Genera el texto de precio para mostrar en la interfaz
   */
  getPrecioMostrar(actividadId: number): string {
    const actividad = this.actividades.find(a => a.id === actividadId);
    if (!actividad) return '$0';

    // Para actividades por persona, mostrar cálculo detallado
    if (this.isPorPersona(actividadId) && this.cantidadPersonas > 0) {
      const precioTotal = this.calcularPrecioTotal(actividadId);
      return `$${precioTotal.toLocaleString()} (${actividad.precio} x${this.cantidadPersonas})`;
    }
    
    return actividad.precio;
  }

  /**
   * Abrir modal con información detallada de la actividad
   */
  openModal(actividadId: number): void {
    this.selectedActivityId = actividadId;
    this.selectedActivityData = this.actividades.find(a => a.id === actividadId) || null;
    this.showModal = true;
    
    // Bloquear scroll del fondo mientras el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cerrar modal y limpiar datos relacionados
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedActivityId = null;
    this.selectedActivityData = null;
    
    // Restaurar scroll normal
    document.body.style.overflow = 'auto';
  }

  /**
   * Maneja la selección/deselección de actividades desde el modal
   */
  elegirActividad(): void {
    if (this.selectedActivityId) {
      const actividad = this.actividades.find(a => a.id === this.selectedActivityId);
      if (!actividad) return;

      if (this.isActividadSelected(this.selectedActivityId)) {
        // Remover de la cotización
        this.cotizacionService.quitarActividad(this.selectedActivityId);
      } else {
        // Agregar a la cotización con la información necesaria
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
   * Consulta el estado de selección de una actividad desde el servicio
   */
  isActividadSelected(actividadId: number): boolean {
    return this.cotizacionService.isActividadSeleccionada(actividadId);
  }

  /**
   * Identifica actividades con nombres largos para ajustar el diseño móvil
   */
  hasLongTitleForMobile(actividadId: number): boolean {
    const actividadesConTituloLargo = [2, 5]; // Picnic gourmet y Senderismo
    return actividadesConTituloLargo.includes(actividadId);
  }

  /**
   * Obtiene las actividades seleccionadas con información completa
   */
  getActividadesSeleccionadas(): Actividad[] {
    const actividadesDelServicio = this.cotizacionService.obtenerActividadesSeleccionadas();
    return this.actividades.filter(actividad => 
      actividadesDelServicio.some(a => a.id === actividad.id)
    );
  }

  /**
   * Obtiene el icono correspondiente a una actividad
   */
  getActivityIcon(activityId: number): string {
    return this.activityIcons[activityId] || '';
  }

  /**
   * Obtiene el total de actividades seleccionadas
   */
  getTotalActividadesSeleccionadas(): number {
    return this.selectedActividades.length;
  }

  /**
   * Limpia todas las actividades seleccionadas
   */
  limpiarSelecciones(): void {
    // Remover todas las actividades del servicio
    this.selectedActividades.forEach(actividadId => {
      this.cotizacionService.quitarActividad(actividadId);
    });
    
    console.log('Selecciones limpiadas');
  }

  /**
   * Genera un resumen de la selección actual para mostrar en la interfaz
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
   */
  hasValidSelection(): boolean {
    return this.selectedActividades.length > 0;
  }

  /**
   * Obtiene una actividad por su ID
   */
  getActividadById(id: number): Actividad | null {
    return this.actividades.find(actividad => actividad.id === id) || null;
  }

  /**
   * Maneja el cierre del modal con la tecla Escape
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showModal) {
      this.closeModal();
    }
  }

  /**
   * Verifica si se puede mostrar las actividades (necesita tener personas)
   */
  canShowActividades(): boolean {
    return this.cantidadPersonas > 0;
  }

  /**
   * Obtiene mensaje de advertencia si no hay personas seleccionadas
   */
  getMensajeAdvertencia(): string {
    if (this.cantidadPersonas === 0) {
      return 'Primero selecciona una cabaña y la cantidad de personas para ver los precios de las actividades.';
    }
    return '';
  }

  /**
   * Obtiene el subtotal de actividades formateado
   */
  getSubtotalFormateado(): string {
    const subtotal = this.datosCotizacion?.subtotalActividades || 0;
    return `${subtotal.toLocaleString()}`;
  }

  /**
   * Verifica si hay una cabaña seleccionada
   */
  tieneCabanaSeleccionada(): boolean {
    return this.datosCotizacion?.cabana !== null;
  }

  /**
   * Verifica si la cabaña seleccionada es la romántica para parejas
   */
  esCabanaPareja(): boolean {
    return this.datosCotizacion?.cabana?.id === 1;
  }

  /**
   * Determina si actividades de pareja están deshabilitadas por tipo de cabaña
   */
  isActividadParejaDeshabilitada(actividadId: number): boolean {
    return this.tieneCabanaSeleccionada() && !this.esCabanaPareja() && [1, 2].includes(actividadId);
  }

  /**
   * Lógica de negocio para determinar si una actividad se puede seleccionar
   */
  canSelectActivity(actividadId: number): boolean {
    // Primero debe haber una cabaña seleccionada
    if (!this.tieneCabanaSeleccionada()) {
      return false;
    }
    
    // Las actividades de pareja solo para cabañas de pareja
    if (!this.esCabanaPareja() && [1, 2].includes(actividadId)) {
      return false;
    }
    
    return true;
  }

  /**
   * Estadísticas de actividades para informes o análisis
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