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

  mensajeEnviado: boolean = false;
  mostrarPopup = false; // Para mostrar el popup
  private subscription = new Subscription();

  constructor(private cotizacionService: CotizacionService) {}

  fechaLlegada: string = '';
  fechaSalida: string = '';

  ngOnInit(): void {
    this.subscription.add(
      this.cotizacionService.fechaRange$.subscribe((range) => {
        this.fechaLlegada = range.startDate ? this.formatDate(range.startDate) : '';
        this.fechaSalida = range.endDate ? this.formatDate(range.endDate) : '';
      })
    );
    this.subscription.add(
      this.cotizacionService.cotizacion$.subscribe((cotizacion) => {
        this.datosCotizacion = cotizacion;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get tieneCabana(): boolean {
    return this.datosCotizacion.cabana !== null;
  }

  get tieneActividades(): boolean {
    return this.datosCotizacion.actividades.length > 0;
  }

  get tieneComidas(): boolean {
    return this.datosCotizacion.comidas.length > 0;
  }

  get subtotalGeneral(): number {
    return this.datosCotizacion.subtotalCabana +
           this.datosCotizacion.subtotalActividades +
           this.datosCotizacion.subtotalComidas;
  }

  get iva(): number {
    return this.subtotalGeneral * 0.19;
  }

  get total(): number {
    return this.subtotalGeneral + this.iva;
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO').format(precio);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

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

    // Mostrar popup en vez de alert
    this.mostrarPopup = true;

    this.enviarSolicitud(solicitudCompleta);
  }

  private enviarSolicitud(datos: any): void {
    console.log('Enviando solicitud...', datos);
    setTimeout(() => {
      this.reiniciarFormulario();
      // No cerramos popup automáticamente para que el usuario lo cierre
    }, 1000);
  }

  cerrarPopup(): void {
    this.mostrarPopup = false;
  }

  private reiniciarFormulario(): void {
    this.cotizacionService.reiniciarCotizacion();
    const form = document.getElementById('cotizar-form') as HTMLFormElement;
    form?.reset();
  }

  onVolver(): void {
    console.log('Volver a los servicios...');
  }

  cotizar() {
    this.mensajeEnviado = true;
  }

  formatDate(date: Date): string {
    // Formato yyyy-MM-dd para input type="date"
    return date.toISOString().split('T')[0];
  }
}
