import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { CotizacionService, DatosCotizacion } from '../cotizacion.service';
import { Subscription } from 'rxjs';

// Interfaz para manejar el rango de fechas seleccionado
interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

// Interfaz que define las propiedades de cada día del calendario
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isStartDate: boolean;
  isEndDate: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit, OnDestroy {
  // Emite el rango de fechas seleccionado al componente padre
  @Output() dateRangeSelected = new EventEmitter<DateRange>();

  currentDate = new Date();
  selectedRange: DateRange = { startDate: null, endDate: null };
  calendarDays: CalendarDay[] = [];
  isSelectingEndDate = false;
  showErrorModal = false;
  errorMessage = '';
  
  // Variables para integración con el servicio de cotización y cálculo de costos
  cotizacionData: DatosCotizacion | null = null;
  cotizacionSubscription: Subscription | null = null;
  costoTotalEstadia = 0;
  costoPorNoche = 0;
  cantidadNoches = 0;
  
  // Arrays para los nombres de meses y días de la semana
  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Opciones de rangos predefinidos para selección rápida
  predefinedRanges = [
    { label: '3 días', days: 3 },
    { label: '5 días', days: 5 },
    { label: '1 semana', days: 7 }
  ];

  constructor(private cotizacionService: CotizacionService) {}

  ngOnInit() {
    this.generateCalendar();
    this.suscribirACotizacion();
  }

  ngOnDestroy() {
    // Limpieza de la suscripción para evitar memory leaks
    if (this.cotizacionSubscription) {
      this.cotizacionSubscription.unsubscribe();
    }
  }

  /**
   * Se suscribe al servicio de cotización para recibir actualizaciones
   */
  private suscribirACotizacion() {
    this.cotizacionSubscription = this.cotizacionService.cotizacion$.subscribe(
      (datos: DatosCotizacion) => {
        this.cotizacionData = datos;
        this.calcularCostoEstadia();
      }
    );
  }

  /**
   * Calcula el costo total de la estadía basado en las fechas seleccionadas
   */
  private calcularCostoEstadia() {
    if (!this.selectedRange.startDate || !this.selectedRange.endDate || !this.cotizacionData?.cabana) {
      this.costoTotalEstadia = 0;
      this.costoPorNoche = 0;
      this.cantidadNoches = 0;
      return;
    }

    // Calcular cantidad de noches entre las fechas seleccionadas
    const diffTime = Math.abs(this.selectedRange.endDate.getTime() - this.selectedRange.startDate.getTime());
    this.cantidadNoches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    this.costoPorNoche = this.cotizacionData.cabana.precio;
    this.costoTotalEstadia = this.costoPorNoche * this.cantidadNoches;
  }

  // Genera la estructura del calendario para el mes actual
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calcular los días del mes anterior que se muestran para completar la primera semana
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Calcular los días del mes siguiente para completar la última semana
    const endDate = new Date(lastDay);
    const remainingDays = 6 - lastDay.getDay();
    endDate.setDate(endDate.getDate() + remainingDays);

    this.calendarDays = [];
    const currentIterDate = new Date(startDate);

    // Generar todos los días que se mostrarán en el calendario
    while (currentIterDate <= endDate) {
      const day: CalendarDay = {
        date: new Date(currentIterDate),
        isCurrentMonth: currentIterDate.getMonth() === month,
        isSelected: this.isDateSelected(currentIterDate),
        isInRange: this.isDateInRange(currentIterDate),
        isStartDate: this.isStartDate(currentIterDate),
        isEndDate: this.isEndDate(currentIterDate),
        isDisabled: this.isDateDisabled(currentIterDate)
      };
      
      this.calendarDays.push(day);
      currentIterDate.setDate(currentIterDate.getDate() + 1);
    }
  }

  // Verifica si una fecha está seleccionada (inicio o fin)
  isDateSelected(date: Date): boolean {
    if (!this.selectedRange.startDate) return false;
    
    if (this.selectedRange.endDate) {
      return this.isSameDay(date, this.selectedRange.startDate) || 
             this.isSameDay(date, this.selectedRange.endDate);
    }
    
    return this.isSameDay(date, this.selectedRange.startDate);
  }

  // Verifica si una fecha está dentro del rango seleccionado
  isDateInRange(date: Date): boolean {
    if (!this.selectedRange.startDate || !this.selectedRange.endDate) return false;
    
    return date > this.selectedRange.startDate && date < this.selectedRange.endDate;
  }

  isStartDate(date: Date): boolean {
    return this.selectedRange.startDate ? 
           this.isSameDay(date, this.selectedRange.startDate) : false;
  }

  isEndDate(date: Date): boolean {
    return this.selectedRange.endDate ? 
           this.isSameDay(date, this.selectedRange.endDate) : false;
  }

  // Deshabilita fechas anteriores al día actual
  isDateDisabled(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  // Compara si dos fechas son el mismo día
  isSameDay(date1: Date, date2: Date): boolean {
    return  date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
  }

  // Maneja la selección de fechas con validaciones de rango
  onDateClick(day: CalendarDay) {
    if (day.isDisabled) return;

    if (!this.selectedRange.startDate || this.isSelectingEndDate === false) {
      // Primera selección: fecha de inicio
      this.selectedRange = { startDate: new Date(day.date), endDate: null };
      this.isSelectingEndDate = true;
    } else {
      // Segunda selección: fecha de fin
      if (day.date >= this.selectedRange.startDate!) {
        // Calcular días de diferencia incluyendo ambos días
        const daysDiff = Math.ceil((day.date.getTime() - this.selectedRange.startDate!.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        // Validación de estadía mínima
        if (daysDiff < 2) {
          this.showError('La reserva debe ser de mínimo 2 días (1 noche).');
          return;
        }
        
        // Validación de estadía máxima
        if (daysDiff > 7) {
          this.showError('Puedes seleccionar máximo 7 días consecutivos.');
          return;
        }

        this.selectedRange.endDate = new Date(day.date);
        this.isSelectingEndDate = false;
        this.emitDateRange();
      } else {
        // Si selecciona una fecha anterior, reinicia la selección
        this.selectedRange = { startDate: new Date(day.date), endDate: null };
      }
    }

    this.generateCalendar();
    this.calcularCostoEstadia();
  }

  // Selecciona un rango predefinido desde la fecha actual
  onPredefinedRangeClick(range: { label: string; days: number }) {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);
    
    endDate.setDate(startDate.getDate() + range.days - 1);

    this.selectedRange = { startDate, endDate };
    this.isSelectingEndDate = false;
    this.generateCalendar();
    this.calcularCostoEstadia();
    this.emitDateRange();
  }

  // Navegación entre meses
  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  // Limpia toda la selección y resetea los valores
  clearSelection() {
    this.selectedRange = { startDate: null, endDate: null };
    this.isSelectingEndDate = false;
    this.costoTotalEstadia = 0;
    this.costoPorNoche = 0;
    this.cantidadNoches = 0;
    this.generateCalendar();
    this.dateRangeSelected.emit(this.selectedRange);
  }

  // Emite el rango seleccionado y actualiza el servicio de cotización
  emitDateRange() {
    this.dateRangeSelected.emit(this.selectedRange);
    this.cotizacionService.setFechaRange(this.selectedRange);
  }

  // Muestra modal de error con mensaje personalizado
  showError(message: string) {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  // Getter para mostrar el mes y año actual en el header
  get currentMonthYear(): string {
    return `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  // Calcula la cantidad total de días seleccionados
  get selectedDaysCount(): number {
    if (!this.selectedRange.startDate || !this.selectedRange.endDate) return 0;
    
    const diffTime = Math.abs(this.selectedRange.endDate.getTime() - this.selectedRange.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }

  /**
   * Verifica si hay una cabaña seleccionada en la cotización
   */
  get tieneCabanaSeleccionada(): boolean {
    return this.cotizacionData?.cabana !== null && this.cotizacionData?.cabana !== undefined;
  }

/**
 * Mapea la capacidad de la cabaña a un número identificador
 */
get nombreCabana(): string {
  if (!this.cotizacionData?.cabana) return '';
  
  // Mapeo de capacidades a números de cabaña
  switch (this.cotizacionData.cabana.capacidad) {
    case 'Parejas':
    case '2':
      return 'Cabaña #1';
    case '3-6 personas':
    case '3-6':
      return 'Cabaña #2';
    case '6-10 personas':
    case '6-10':
      return 'Cabaña #3';
    default:
      return `Cabaña #${this.cotizacionData.cabana.id}`;
  }
}

  /**
   * Obtiene la cantidad de personas de la cotización actual
   */
  get cantidadPersonas(): number {
    return this.cotizacionData?.cantidadPersonas || 0;
  }
}