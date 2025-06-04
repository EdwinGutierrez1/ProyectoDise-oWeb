import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CotizacionService, DatosCotizacion } from '../cotizacion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit, OnDestroy {
  // Datos de la cotización actual
  datosCotizacion: DatosCotizacion = {
    cabana: null,
    actividades: [],
    comidas: [],
    cantidadPersonas: 0,
    subtotalCabana: 0,
    subtotalActividades: 0,
    subtotalComidas: 0,
    total: 0,
  };

  // Eliminar estas propiedades duplicadas ya que están definidas como getters abajo
  // tieneCabana: boolean = false;
  // tieneActividades: boolean = false;
  // tieneComidas: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private cotizacionService: CotizacionService) {}

  comidasSeleccionadas: any[] = [];
  totalComidas: number = 0;

  ngOnInit(): void {
    this.subscription.add(
      this.cotizacionService.cotizacion$.subscribe((cotizacion) => {
        this.datosCotizacion = cotizacion;
        this.comidasSeleccionadas = cotizacion.comidas;
        this.totalComidas = cotizacion.subtotalComidas;
        
        // Eliminar estas asignaciones ya que usaremos los getters
        // this.tieneCabana = cotizacion.cabana !== null;
        // this.tieneActividades = cotizacion.actividades.length > 0;
        // this.tieneComidas = cotizacion.comidas.length > 0;
        
        this.actualizarResumenDOM();
      })
    );
    // Obtener datos iniciales
    this.datosCotizacion = this.cotizacionService.obtenerDatosCotizacion();
    this.comidasSeleccionadas = this.datosCotizacion.comidas;
    this.totalComidas = this.datosCotizacion.subtotalComidas;
    
    // Eliminar estas asignaciones ya que usaremos los getters
    // this.tieneCabana = this.datosCotizacion.cabana !== null;
    // this.tieneActividades = this.datosCotizacion.actividades.length > 0;
    // this.tieneComidas = this.datosCotizacion.comidas.length > 0;
    
    this.actualizarResumenDOM();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Actualiza el resumen en el DOM usando los elementos existentes
   */
  private actualizarResumenDOM(): void {
    const resumenContainer = document.getElementById('resumen-reserva');
    const totalElement = document.getElementById('total-final');

    if (resumenContainer) {
      resumenContainer.innerHTML = this.generarHTMLResumen();
    }

    if (totalElement) {
      totalElement.textContent = this.formatearPrecio(
        this.datosCotizacion.total
      );
    }
  }

  /**
   * Genera el HTML para el resumen de la reserva
   */
  private generarHTMLResumen(): string {
    let html = '';

    // Mostrar cabaña seleccionada
    if (this.datosCotizacion.cabana) {
      html += `
        <li class="resumen-item">
          <div class="item-info">
            <strong>🏠 Cabaña seleccionada</strong>
            <span class="item-detalles">
              ${this.datosCotizacion.cabana.capacidad} - 
              ${this.datosCotizacion.cantidadPersonas} 
              ${
                this.datosCotizacion.cantidadPersonas === 1
                  ? 'persona'
                  : 'personas'
              }
            </span>
          </div>
          <span class="item-precio">$${this.formatearPrecio(
            this.datosCotizacion.cabana.precio
          )}</span>
        </li>
      `;
    }

    // Mostrar actividades seleccionadas
    if (this.datosCotizacion.actividades.length > 0) {
      html += `
        <li class="resumen-categoria">
          <strong>🎯 Actividades seleccionadas:</strong>
        </li>
      `;

      this.datosCotizacion.actividades.forEach((actividad) => {
        const precioInfo = actividad.porPersona
          ? `$${this.formatearPrecio(actividad.precio)} x ${
              this.datosCotizacion.cantidadPersonas
            } personas`
          : `Precio fijo`;

        html += `
          <li class="resumen-item actividad">
            <div class="item-info">
              <span class="actividad-nombre">${actividad.nombre}</span>
              <span class="item-detalles">${precioInfo}</span>
            </div>
            <span class="item-precio">$${this.formatearPrecio(
              actividad.precioTotal
            )}</span>
          </li>
        `;
      });
    }

    // Mostrar comidas seleccionadas
    if (this.datosCotizacion.comidas.length > 0) {
      html += `
        <li class="resumen-categoria">
          <strong>🍽️ Comidas seleccionadas:</strong>
        </li>
      `;

      this.datosCotizacion.comidas.forEach((comida) => {
        const precioInfo = comida.porPersona
          ? `$${this.formatearPrecio(comida.precioUnitario)} x ${
              this.datosCotizacion.cantidadPersonas
            } personas`
          : `Precio fijo`;

        html += `
          <li class="resumen-item comida">
            <div class="item-info">
              <span class="comida-nombre">${comida.nombre}</span>
              <span class="item-detalles">${precioInfo}</span>
            </div>
            <span class="item-precio">$${this.formatearPrecio(
              comida.precioTotal
            )}</span>
          </li>
        `;
      });

      // Mostrar subtotal de comidas
      html += `
        <li class="resumen-subtotal">
          <div class="item-info">
            <span>Subtotal comidas</span>
          </div>
          <span class="item-precio">$${this.formatearPrecio(
            this.datosCotizacion.subtotalComidas
          )}</span>
        </li>
      `;
    }

    // Mostrar subtotales y total
    if (this.tieneCabana || this.tieneActividades || this.tieneComidas) {
      // Subtotal general
      const subtotal = this.datosCotizacion.subtotalCabana + 
                      this.datosCotizacion.subtotalActividades + 
                      this.datosCotizacion.subtotalComidas;
      
      // Calcular IVA (19%)
      const iva = subtotal * 0.19;
      
      html += `
        <li class="resumen-subtotal total">
          <div class="item-info">
            <span>Subtotal</span>
          </div>
          <span class="item-precio">$${this.formatearPrecio(subtotal)}</span>
        </li>
        <li class="resumen-iva">
          <div class="item-info">
            <span>IVA (19%)</span>
          </div>
          <span class="item-precio">$${this.formatearPrecio(iva)}</span>
        </li>
      `;
    }

    // Si no hay nada seleccionado
    if (
      !this.tieneCabana &&
      !this.tieneActividades &&
      !this.tieneComidas
    ) {
      html = `
        <li class="resumen-vacio">
          <div class="mensaje-vacio">
            <i class="fas fa-info-circle"></i>
            <p>Selecciona una cabaña, actividades o comidas para ver tu resumen</p>
          </div>
        </li>
      `;
    }

    return html;
  }

  /**
   * Formatea un precio para mostrar sin decimales
   */
  private formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO').format(precio);
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Crear objeto con todos los datos
    const solicitudCompleta = {
      datosPersonales: {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        fecha: formData.get('fecha'),
        comentarios: formData.get('comentarios'),
      },
      cotizacion: this.datosCotizacion,
      fechaSolicitud: new Date().toISOString(),
    };

    console.log('Solicitud completa:', solicitudCompleta);

    // Aquí enviarías los datos al servidor
    this.enviarSolicitud(solicitudCompleta);
  }

  /**
   * Simula el envío de la solicitud
   */
  private enviarSolicitud(datos: any): void {
    // Aquí harías la llamada HTTP real
    console.log('Enviando solicitud...', datos);

    // Simulación
    setTimeout(() => {
      alert('¡Solicitud enviada exitosamente! Te contactaremos pronto.');
      this.limpiarFormulario();
    }, 1000);
  }

  /**
   * Limpia el formulario y reinicia la cotización
   */
  private limpiarFormulario(): void {
    const form = document.getElementById('cotizar-form') as HTMLFormElement;
    if (form) {
      form.reset();
    }

    this.cotizacionService.reiniciarCotizacion();
  }

  /**
   * Maneja el botón volver
   */
  onVolver(): void {
    // Aquí podrías navegar a la sección anterior o cambiar pestañas
    console.log('Volviendo a los servicios...');

    // Si usas tabs o navegación, aquí harías el cambio
    // Por ejemplo: this.activeTab = 'actividades';
  }

  /**
   * Getters para usar en el template
   */
  get tieneCabana(): boolean {
    return this.datosCotizacion.cabana !== null;
  }

  get tieneActividades(): boolean {
    return this.datosCotizacion.actividades.length > 0;
  }
  
  // Añadir este getter que falta
  get tieneComidas(): boolean {
    return this.datosCotizacion.comidas.length > 0;
  }

  get totalFormateado(): string {
    return this.formatearPrecio(this.datosCotizacion.total);
  }

  get resumenTexto(): string {
    const items = [];

    if (this.datosCotizacion.cabana) {
      items.push(
        `Cabaña para ${this.datosCotizacion.cantidadPersonas} personas`
      );
    }

    if (this.datosCotizacion.actividades.length > 0) {
      items.push(`${this.datosCotizacion.actividades.length} actividades`);
    }

    return items.join(' + ') || 'Sin selecciones';
  }
}
