// Importaciones del core de Angular y RxJS
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Definición de interfaces para el tipado fuerte del sistema

// Estructura de datos para la cabaña seleccionada
export interface CabanaSeleccionada {
id: number;
precio: number;
capacidad: string;
personas: number;
}

// Estructura para actividades con cálculo de precio por persona
export interface ActividadSeleccionada {
id: number;
nombre: string;
precio: number;
porPersona: boolean;
precioTotal: number;
}

// Estructura para comidas con tarifas variables por persona
export interface ComidaSeleccionada {
id: number;
nombre: string;
precioUnitario: number;
porPersona: boolean;
precioTotal: number;
}

// Estructura principal que contiene toda la información de la cotización
export interface DatosCotizacion {
cabana: CabanaSeleccionada | null;
actividades: ActividadSeleccionada[];
comidas: ComidaSeleccionada[];
cantidadPersonas: number;
subtotalCabana: number;
subtotalActividades: number;
subtotalComidas: number;
total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

// Estado inicial limpio para resetear la cotización
private datosCotizacionIniciales: DatosCotizacion = {
    cabana: null,
    actividades: [],
    comidas: [],
    cantidadPersonas: 0,
    subtotalCabana: 0,
    subtotalActividades: 0,
    subtotalComidas: 0,
    total: 0
};

// Subject para manejar el estado reactivo de la cotización
private cotizacionSubject = new BehaviorSubject<DatosCotizacion>(this.datosCotizacionIniciales);

// Observable público para que los componentes se suscriban a cambios
public cotizacion$ = this.cotizacionSubject.asObservable();

// Copia privada de los datos actuales para trabajar internamente
private datosCotizacion: DatosCotizacion = { ...this.datosCotizacionIniciales };

/**
 * Actualiza la información de la cabaña seleccionada
 * Maneja la lógica de limpiar actividades/comidas cuando cambia el tipo de cabaña
 */
constructor(private cookieService: CookieService) {
    // Cargar datos guardados si existen cookies aceptadas
    if (this.cookieService.get('cookie-consentimiento') === 'aceptado') {
        this.cargarDatosDeCookies();
    }
}

public guardarEnCookies(): void {
    if (this.cookieService.get('cookie-consentimiento') === 'aceptado') {
        this.cookieService.set('datos-cotizacion', JSON.stringify(this.datosCotizacion), 365);
    }
}

public cargarDatosDeCookies(): void {
    const datosGuardados = this.cookieService.get('datos-cotizacion');
    if (datosGuardados) {
        try {
            const datos = JSON.parse(datosGuardados);
            this.datosCotizacion = datos;
            this.emitirCambios();
        } catch (error) {
            console.error('Error al cargar datos de cookies:', error);
        }
    }
}

// Modificar los métodos existentes para guardar después de cada cambio
actualizarCabana(cabana: CabanaSeleccionada, cantidadPersonas: number): void {
    // Detecta si cambió el tipo de cabaña para limpiar selecciones previas
    const cabanaAnterior = this.datosCotizacion.cabana;
    const haCambiadoCabana = !cabanaAnterior || cabanaAnterior.id !== cabana.id;
    
    // Limpia actividades y comidas si cambió el tipo de cabaña
    if (haCambiadoCabana) {
    console.log('Cabaña cambió, limpiando actividades y comidas anteriores');
    this.datosCotizacion.actividades = [];
    this.datosCotizacion.comidas = [];
    this.datosCotizacion.subtotalActividades = 0;
    this.datosCotizacion.subtotalComidas = 0;
    this.guardarEnCookies();
    }
    
    // Actualiza la información base de la cabaña
    this.datosCotizacion.cabana = cabana;
    this.datosCotizacion.cantidadPersonas = cantidadPersonas;
    this.datosCotizacion.subtotalCabana = cabana.precio;
    
    // Recalcula precios si solo cambió la cantidad de personas
    if (!haCambiadoCabana && (this.datosCotizacion.actividades.length > 0 || this.datosCotizacion.comidas.length > 0)) {
    console.log('Recalculando actividades y comidas por cambio en cantidad de personas');
    this.recalcularActividadesConPersonas();
    this.recalcularComidasConPersonas();
    }
    
    this.calcularTotal();
    this.emitirCambios();
    this.guardarEnCookies();
    }

    /**
     * Agrega una actividad a la cotización
     * Calcula automáticamente el precio total según si es por persona o fija
     */
    agregarActividad(actividad: {
    id: number;
    nombre: string;
    precioUnitario: number;
    porPersona: boolean;
    }): void {
    // Evita duplicados en la selección
    const existe = this.datosCotizacion.actividades.find(a => a.id === actividad.id);
    if (existe) {
    console.log('Actividad ya seleccionada:', actividad.nombre);
    return;
    }

    // Calcula el precio total considerando si es por persona o tarifa fija
    const precioTotal = actividad.porPersona 
    ? actividad.precioUnitario * this.datosCotizacion.cantidadPersonas
    : actividad.precioUnitario;

    const nuevaActividad: ActividadSeleccionada = {
    id: actividad.id,
    nombre: actividad.nombre,
    precio: actividad.precioUnitario,
    porPersona: actividad.porPersona,
    precioTotal: precioTotal
    };

    this.datosCotizacion.actividades.push(nuevaActividad);
    this.calcularTotal();
    this.emitirCambios();
    this.guardarEnCookies();
    
    console.log('Actividad agregada:', nuevaActividad);
    }

    /**
     * Remueve una actividad específica de la cotización
     */
    quitarActividad(actividadId: number): void {
    this.datosCotizacion.actividades = this.datosCotizacion.actividades.filter(
    a => a.id !== actividadId
    );
    
    this.calcularTotal();
    this.emitirCambios();
    this.guardarEnCookies();
    console.log('Actividad removida, ID:', actividadId);
    }

    /**
     * Agrega una comida a la cotización
     * Maneja el cálculo automático de precios por persona vs precio fijo
     */
    agregarComida(comida: {
    id: number;
    nombre: string;
    precioUnitario: number;
    porPersona: boolean;
    }): void {
    // Previene la selección duplicada de comidas
    const existe = this.datosCotizacion.comidas.find(c => c.id === comida.id);
    if (existe) {
    console.log('Comida ya seleccionada:', comida.nombre);
    return;
    }

    // Calcula precio total según el tipo de tarifa
    const precioTotal = comida.porPersona 
    ? comida.precioUnitario * this.datosCotizacion.cantidadPersonas
    : comida.precioUnitario;

    const nuevaComida: ComidaSeleccionada = {
    id: comida.id,
    nombre: comida.nombre,
    precioUnitario: comida.precioUnitario,
    porPersona: comida.porPersona,
    precioTotal: precioTotal
    };

    this.datosCotizacion.comidas.push(nuevaComida);
    this.calcularTotal();
    this.emitirCambios();
    this.guardarEnCookies(); // Agregar esta línea
    }

    /**
     * Elimina una comida específica de la selección
     */
    quitarComida(comidaId: number): void {
    this.datosCotizacion.comidas = this.datosCotizacion.comidas.filter(
    c => c.id !== comidaId
    );
    
    this.calcularTotal();
    this.emitirCambios();
    this.guardarEnCookies();
    
    console.log('Comida removida, ID:', comidaId);
    }

    /**
     * Vacía completamente la lista de actividades seleccionadas
     */
    limpiarActividades(): void {
    this.datosCotizacion.actividades = [];
    this.datosCotizacion.subtotalActividades = 0;
    this.calcularTotal();
    this.emitirCambios();
    this.guardarEnCookies();
    
    console.log('Todas las actividades han sido limpiadas');
    }

    /**
     * Vacía completamente la lista de comidas seleccionadas
     */
    limpiarComidas(): void {
    this.datosCotizacion.comidas = [];
    this.datosCotizacion.subtotalComidas = 0;
    this.calcularTotal();
    this.emitirCambios();
    this.guardarEnCookies();
    
    console.log('Todas las comidas han sido limpiadas');
    }

    /**
     * Recalcula precios de actividades cuando cambia la cantidad de personas
     * Solo afecta actividades con tarifa por persona
     */
    private recalcularActividadesConPersonas(): void {
    this.datosCotizacion.actividades = this.datosCotizacion.actividades.map(actividad => ({
    ...actividad,
    precioTotal: actividad.porPersona 
        ? actividad.precio * this.datosCotizacion.cantidadPersonas
        : actividad.precio
    }));
    }

    /**
     * Recalcula precios de comidas cuando cambia la cantidad de personas
     * Solo afecta comidas con tarifa por persona
     */
    private recalcularComidasConPersonas(): void {
    this.datosCotizacion.comidas = this.datosCotizacion.comidas.map(comida => ({
    ...comida,
    precioTotal: comida.porPersona 
        ? comida.precioUnitario * this.datosCotizacion.cantidadPersonas
        : comida.precioUnitario
    }));
    }

    /**
     * Calcula todos los subtotales y el total general de la cotización
     */
    private calcularTotal(): void {
    // Suma todos los precios totales de actividades
    this.datosCotizacion.subtotalActividades = this.datosCotizacion.actividades.reduce(
    (total, actividad) => total + actividad.precioTotal, 0
    );

    // Suma todos los precios totales de comidas
    this.datosCotizacion.subtotalComidas = this.datosCotizacion.comidas.reduce(
    (total, comida) => total + comida.precioTotal, 0
    );

    // Calcula el gran total sumando todos los subtotales
    this.datosCotizacion.total = this.datosCotizacion.subtotalCabana + 
                                this.datosCotizacion.subtotalActividades + 
                                this.datosCotizacion.subtotalComidas;
    }

    /**
     * Notifica a todos los componentes suscritos sobre cambios en la cotización
     */
    private emitirCambios(): void {
    this.cotizacionSubject.next({ ...this.datosCotizacion });
    }

    /**
     * Getter para la cantidad actual de personas en la reserva
     */
    obtenerCantidadPersonas(): number {
    return this.datosCotizacion.cantidadPersonas;
    }

    /**
     * Devuelve una copia completa de los datos actuales de cotización
     */
    obtenerDatosCotizacion(): DatosCotizacion {
    return { ...this.datosCotizacion };
    }

    /**
     * Verifica si una actividad específica ya está seleccionada
     */
    isActividadSeleccionada(actividadId: number): boolean {
    return this.datosCotizacion.actividades.some(a => a.id === actividadId);
    }

    /**
     * Verifica si una comida específica ya está seleccionada
     */
    isComidaSeleccionada(comidaId: number): boolean {
    return this.datosCotizacion.comidas.some(c => c.id === comidaId);
    }

    /**
     * Getter simple para el total actual de la cotización
     */
    obtenerTotal(): number {
    return this.datosCotizacion.total;
    }

    /**
     * Genera un resumen compacto del estado actual de la cotización
     * Útil para mostrar información rápida en la interfaz
     */
    obtenerResumen(): {
    tieneCabana: boolean;
    tieneActividades: boolean;
    tieneComidas: boolean;
    totalActividades: number;
    totalComidas: number;
    personas: number;
    total: number;
    } {
    return {
    tieneCabana: this.datosCotizacion.cabana !== null,
    tieneActividades: this.datosCotizacion.actividades.length > 0,
    tieneComidas: this.datosCotizacion.comidas.length > 0,
    totalActividades: this.datosCotizacion.actividades.length,
    totalComidas: this.datosCotizacion.comidas.length,
    personas: this.datosCotizacion.cantidadPersonas,
    total: this.datosCotizacion.total
    };
    }

    /**
     * Resetea completamente la cotización al estado inicial
     */
    reiniciarCotizacion(): void {
    this.datosCotizacion = { ...this.datosCotizacionIniciales };
    this.emitirCambios();
    this.guardarEnCookies();
    console.log('Cotización reiniciada');
    }

    /**
     * Devuelve una copia de las actividades actualmente seleccionadas
     */
    obtenerActividadesSeleccionadas(): ActividadSeleccionada[] {
    return [...this.datosCotizacion.actividades];
    }

    /**
     * Devuelve una copia de las comidas actualmente seleccionadas
     */
    obtenerComidasSeleccionadas(): ComidaSeleccionada[] {
    return [...this.datosCotizacion.comidas];
    }
    
    // Subject separado para manejar el rango de fechas de la reserva
    private fechaRangeSubject = new BehaviorSubject<{startDate: Date|null, endDate: Date|null}>({startDate: null, endDate: null});
    fechaRange$ = this.fechaRangeSubject.asObservable();

    /**
     * Actualiza el rango de fechas seleccionado para la reserva
     */
    setFechaRange(range: {startDate: Date|null, endDate: Date|null}) {
    this.fechaRangeSubject.next(range);
    this.guardarEnCookies();
    }
    }