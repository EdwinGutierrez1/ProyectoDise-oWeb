    // cotizacion.service.ts
    // Ubicación: src/app/pages/cotizar/cotizacion.service.ts

    import { Injectable } from '@angular/core';
    import { BehaviorSubject } from 'rxjs';

    // Interfaces para tipado
    export interface CabanaSeleccionada {
    id: number;
    precio: number;
    capacidad: string;
    personas: number;
    }

    export interface ActividadSeleccionada {
    id: number;
    nombre: string;
    precio: number;
    porPersona: boolean;
    precioTotal: number;
    }

    export interface DatosCotizacion {
    cabana: CabanaSeleccionada | null;
    actividades: ActividadSeleccionada[];
    cantidadPersonas: number;
    subtotalCabana: number;
    subtotalActividades: number;
    total: number;
    }

    @Injectable({
    providedIn: 'root'
    })
    export class CotizacionService {
    
    // Estado inicial de la cotización
    private datosCotizacionIniciales: DatosCotizacion = {
        cabana: null,
        actividades: [],
        cantidadPersonas: 0,
        subtotalCabana: 0,
        subtotalActividades: 0,
        total: 0
    };

    // BehaviorSubject para mantener el estado y notificar cambios
    private cotizacionSubject = new BehaviorSubject<DatosCotizacion>(this.datosCotizacionIniciales);
    
    // Observable público para que los componentes se suscriban
    public cotizacion$ = this.cotizacionSubject.asObservable();

    // Datos privados actuales
    private datosCotizacion: DatosCotizacion = { ...this.datosCotizacionIniciales };

    /**
     * Actualiza la información de la cabaña seleccionada
     * @param cabana - Información de la cabaña seleccionada
     * @param cantidadPersonas - Cantidad de personas
     */
    actualizarCabana(cabana: CabanaSeleccionada, cantidadPersonas: number): void {
        // Verificar si ha cambiado la cabaña
        const cabanaAnterior = this.datosCotizacion.cabana;
        const haCambiadoCabana = !cabanaAnterior || cabanaAnterior.id !== cabana.id;
        
        // Si cambió la cabaña, limpiar actividades
        if (haCambiadoCabana) {
        console.log('Cabaña cambió, limpiando actividades anteriores');
        this.datosCotizacion.actividades = [];
        this.datosCotizacion.subtotalActividades = 0;
        }
        
        // Actualizar información de la cabaña
        this.datosCotizacion.cabana = cabana;
        this.datosCotizacion.cantidadPersonas = cantidadPersonas;
        this.datosCotizacion.subtotalCabana = cabana.precio;
        
        // Si no cambió la cabaña pero cambió la cantidad de personas, recalcular actividades
        if (!haCambiadoCabana && this.datosCotizacion.actividades.length > 0) {
        console.log('Recalculando actividades por cambio en cantidad de personas');
        this.recalcularActividadesConPersonas();
        }
        
        this.calcularTotal();
        this.emitirCambios();
        
        console.log('Cabaña actualizada:', cabana, 'Personas:', cantidadPersonas);
        console.log('Actividades después del cambio:', this.datosCotizacion.actividades);
    }

    /**
     * Agrega una actividad a la cotización
     * @param actividad - Datos de la actividad
     */
    agregarActividad(actividad: {
        id: number;
        nombre: string;
        precioUnitario: number;
        porPersona: boolean;
    }): void {
        // Verificar si ya existe la actividad
        const existe = this.datosCotizacion.actividades.find(a => a.id === actividad.id);
        if (existe) {
        console.log('Actividad ya seleccionada:', actividad.nombre);
        return;
        }

        // Calcular precio total según si es por persona o no
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
        
        console.log('Actividad agregada:', nuevaActividad);
    }

    /**
     * Quita una actividad de la cotización
     * @param actividadId - ID de la actividad a quitar
     */
    quitarActividad(actividadId: number): void {
        this.datosCotizacion.actividades = this.datosCotizacion.actividades.filter(
        a => a.id !== actividadId
        );
        
        this.calcularTotal();
        this.emitirCambios();
        
        console.log('Actividad removida, ID:', actividadId);
    }

    /**
     * Limpia todas las actividades seleccionadas
     */
    limpiarActividades(): void {
        this.datosCotizacion.actividades = [];
        this.datosCotizacion.subtotalActividades = 0;
        this.calcularTotal();
        this.emitirCambios();
        
        console.log('Todas las actividades han sido limpiadas');
    }

    /**
     * Recalcula los precios de las actividades cuando cambia la cantidad de personas
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
     * Calcula los totales de la cotización
     */
    private calcularTotal(): void {
        // Subtotal de actividades
        this.datosCotizacion.subtotalActividades = this.datosCotizacion.actividades.reduce(
        (total, actividad) => total + actividad.precioTotal, 0
        );

        // Total general
        this.datosCotizacion.total = this.datosCotizacion.subtotalCabana + this.datosCotizacion.subtotalActividades;
    }

    /**
     * Emite los cambios a todos los suscriptores
     */
    private emitirCambios(): void {
        this.cotizacionSubject.next({ ...this.datosCotizacion });
    }

    /**
     * Obtiene la cantidad actual de personas
     * @returns Número de personas
     */
    obtenerCantidadPersonas(): number {
        return this.datosCotizacion.cantidadPersonas;
    }

    /**
     * Obtiene los datos actuales de la cotización
     * @returns Datos completos de la cotización
     */
    obtenerDatosCotizacion(): DatosCotizacion {
        return { ...this.datosCotizacion };
    }

    /**
     * Verifica si una actividad está seleccionada
     * @param actividadId - ID de la actividad
     * @returns true si está seleccionada
     */
    isActividadSeleccionada(actividadId: number): boolean {
        return this.datosCotizacion.actividades.some(a => a.id === actividadId);
    }

    /**
     * Obtiene el total de la cotización
     * @returns Precio total
     */
    obtenerTotal(): number {
        return this.datosCotizacion.total;
    }

    /**
     * Obtiene información resumida para mostrar
     * @returns Resumen de la cotización
     */
    obtenerResumen(): {
        tieneCabana: boolean;
        tieneActividades: boolean;
        totalActividades: number;
        personas: number;
        total: number;
    } {
        return {
        tieneCabana: this.datosCotizacion.cabana !== null,
        tieneActividades: this.datosCotizacion.actividades.length > 0,
        totalActividades: this.datosCotizacion.actividades.length,
        personas: this.datosCotizacion.cantidadPersonas,
        total: this.datosCotizacion.total
        };
    }

    /**
     * Reinicia la cotización
     */
    reiniciarCotizacion(): void {
        this.datosCotizacion = { ...this.datosCotizacionIniciales };
        this.emitirCambios();
        console.log('Cotización reiniciada');
    }

    /**
     * Obtiene las actividades seleccionadas
     * @returns Array de actividades seleccionadas
     */
    obtenerActividadesSeleccionadas(): ActividadSeleccionada[] {
        return [...this.datosCotizacion.actividades];
    }
}