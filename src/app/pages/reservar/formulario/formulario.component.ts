import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CotizacionService, DatosCotizacion } from '../cotizacion.service';
import { Subscription } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit, OnDestroy {
  @ViewChild('cotizarForm', { static: false }) cotizarForm!: NgForm;

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
  mostrarPopup = false;
  private subscription = new Subscription();

  // Propiedades del formulario
  fechaLlegada: string = '';
  fechaSalida: string = '';
  nombre: string = '';
  email: string = '';
  telefono: string = '';
  comentarios: string = '';

  constructor(private cotizacionService: CotizacionService) {}

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

  // Getter para verificar si el formulario es válido
  get formularioValido(): boolean {
    return this.cotizarForm?.valid ?? false;
  }

  // Propiedades para mostrar mensaje de validación general
  mostrarMensajeValidacion: boolean = false;

  // Método para verificar si un campo específico es inválido y ha sido tocado
  esCampoInvalido(campo: string): boolean {
    if (!this.cotizarForm) return false;
    const control = this.cotizarForm.controls[campo];
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  // Método para verificar si un campo es válido y ha sido tocado
  esCampoValido(campo: string): boolean {
    if (!this.cotizarForm) return false;
    const control = this.cotizarForm.controls[campo];
    return control ? (control.valid && (control.dirty || control.touched)) : false;
  }

  // Método para obtener las clases CSS del campo
  obtenerClasesCampo(campo: string): string {
    if (!this.cotizarForm) return '';
    const control = this.cotizarForm.controls[campo];
    
    if (!control || (!control.dirty && !control.touched)) return '';
    
    if (control.invalid) return 'is-invalid';
    if (control.valid) return 'is-valid';
    
    return '';
  }

  // Método para obtener las clases CSS del grupo
  obtenerClasesGrupo(campo: string): string {
    if (!this.cotizarForm) return '';
    const control = this.cotizarForm.controls[campo];
    
    if (!control || (!control.dirty && !control.touched)) return '';
    
    if (control.invalid) return 'is-invalid';
    if (control.valid) return 'is-valid';
    
    return '';
  }

  // Método para mostrar errores específicos de cada campo
  obtenerErrorCampo(campo: string): string {
    if (!this.cotizarForm) return '';
    const control = this.cotizarForm.controls[campo];
    
    if (!control || !control.errors) return '';
    
    if (control.errors?.['required']) {
      switch (campo) {
        case 'nombre': return 'El nombre es obligatorio.';
        case 'email': return 'El correo es obligatorio.';
        case 'telefono': return 'El teléfono es obligatorio.';
        case 'fecha': return 'La fecha es obligatoria.';
        default: return 'Este campo es obligatorio.';
      }
    }
    
    if (control.errors?.['pattern']) {
      switch (campo) {
        case 'email': return 'Correo no válido.';
        case 'telefono': return 'Solo números (7-15 dígitos).';
        default: return 'Formato no válido.';
      }
    }
    
    if (control.errors?.['minlength']) {
      return 'Debe ingresar al menos 1 carácter.';
    }
    
    return '';
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
    if (!this.cotizarForm.valid) {
      this.mostrarMensajeValidacion = true;
      Object.keys(this.cotizarForm.controls).forEach(key => {
        this.cotizarForm.controls[key].markAsTouched();
      });
      setTimeout(() => {
        this.mostrarMensajeValidacion = false;
      }, 5000);
      return;
    }
    this.mostrarMensajeValidacion = false;
    this.mensajeEnviado = true; // Mostrar mensaje de éxito
    const solicitudCompleta = {
      datosPersonales: {
        nombre: this.nombre,
        email: this.email,
        telefono: this.telefono,
        fecha: this.fechaLlegada,
        comentarios: this.comentarios,
      },
      cotizacion: this.datosCotizacion,
      fechaSolicitud: new Date().toISOString(),
    };
    this.enviarSolicitud(solicitudCompleta);
  }

  private enviarSolicitud(datos: any): void {
    this.reiniciarFormulario();
  }

  cerrarPopup(): void {
    this.mostrarPopup = false;
  }

  private reiniciarFormulario(): void {
    this.cotizacionService.reiniciarCotizacion();
    
    // Limpiar todas las propiedades del formulario
    this.nombre = '';
    this.email = '';
    this.telefono = '';
    this.fechaLlegada = '';
    this.comentarios = '';
    
    // Ocultar mensajes
    this.mostrarMensajeValidacion = false;
    this.mensajeEnviado = false;
    
    // Reset del formulario
    if (this.cotizarForm) {
      this.cotizarForm.resetForm();
    }
  }

  onVolver(): void {
    console.log('Volver a los servicios...');
  }

  cotizar() {
    this.mensajeEnviado = true;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Método helper para validación en tiempo real
  validarCampo(campo: string): void {
    if (this.cotizarForm && this.cotizarForm.controls[campo]) {
      this.cotizarForm.controls[campo].markAsTouched();
    }
  }
}