import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { CotizacionService, DatosCotizacion } from '../cotizacion.service';
import { Subscription } from 'rxjs';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

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
  @Output() dateRangeSelected = new EventEmitter<DateRange>();

  currentDate = new Date();
  selectedRange: DateRange = { startDate: null, endDate: null };
  calendarDays: CalendarDay[] = [];
  isSelectingEndDate = false;
  showErrorModal = false;
  errorMessage = '';
  
  // Variables para la integración con el servicio de cotización
  cotizacionData: DatosCotizacion | null = null;
  cotizacionSubscription: Subscription | null = null;
  costoTotalEstadia = 0;
  costoPorNoche = 0;
  cantidadNoches = 0;
  
  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Rangos predefinidos actualizados: 3 días, 5 días y una semana
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

    // Calcular cantidad de noches
    const diffTime = Math.abs(this.selectedRange.endDate.getTime() - this.selectedRange.startDate.getTime());
    this.cantidadNoches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Precio por noche de la cabaña
    this.costoPorNoche = this.cotizacionData.cabana.precio;

    // Costo total de la estadía (solo hospedaje)
    this.costoTotalEstadia = this.costoPorNoche * this.cantidadNoches;
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    // Días para mostrar del mes anterior
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Días para mostrar del mes siguiente
    const endDate = new Date(lastDay);
    const remainingDays = 6 - lastDay.getDay();
    endDate.setDate(endDate.getDate() + remainingDays);

    this.calendarDays = [];
    const currentIterDate = new Date(startDate);

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

  isDateSelected(date: Date): boolean {
    if (!this.selectedRange.startDate) return false;
    
    if (this.selectedRange.endDate) {
      return this.isSameDay(date, this.selectedRange.startDate) || 
             this.isSameDay(date, this.selectedRange.endDate);
    }
    
    return this.isSameDay(date, this.selectedRange.startDate);
  }

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

  isDateDisabled(date: Date): boolean {
    // Deshabilitar fechas pasadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return  date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
  }

  onDateClick(day: CalendarDay) {
    if (day.isDisabled) return;

    if (!this.selectedRange.startDate || this.isSelectingEndDate === false) {
      // Seleccionar fecha de inicio
      this.selectedRange = { startDate: new Date(day.date), endDate: null };
      this.isSelectingEndDate = true;
    } else {
      // Seleccionar fecha de fin
      if (day.date >= this.selectedRange.startDate!) {
        // Calcular días de diferencia
        const daysDiff = Math.ceil((day.date.getTime() - this.selectedRange.startDate!.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        // Validar mínimo 2 días (1 noche)
        if (daysDiff < 2) {
          this.showError('La reserva debe ser de mínimo 2 días (1 noche).');
          return;
        }
        
        // Validar que no exceda una semana (7 días)
        if (daysDiff > 7) {
          this.showError('Puedes seleccionar máximo 7 días consecutivos.');
          return;
        }

        this.selectedRange.endDate = new Date(day.date);
        this.isSelectingEndDate = false;
        this.emitDateRange();
      } else {
        // Si la fecha seleccionada es anterior, reiniciar
        this.selectedRange = { startDate: new Date(day.date), endDate: null };
      }
    }

    this.generateCalendar();
    this.calcularCostoEstadia(); // Recalcular costo cuando cambian las fechas
  }

  onPredefinedRangeClick(range: { label: string; days: number }) {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);
    
    // Calcular fecha de fin basada en los días del rango
    endDate.setDate(startDate.getDate() + range.days - 1);

    this.selectedRange = { startDate, endDate };
    this.isSelectingEndDate = false;
    this.generateCalendar();
    this.calcularCostoEstadia(); // Recalcular costo
    this.emitDateRange();
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  clearSelection() {
    this.selectedRange = { startDate: null, endDate: null };
    this.isSelectingEndDate = false;
    this.costoTotalEstadia = 0;
    this.costoPorNoche = 0;
    this.cantidadNoches = 0;
    this.generateCalendar();
    this.dateRangeSelected.emit(this.selectedRange);
  }

  emitDateRange() {
    this.dateRangeSelected.emit(this.selectedRange);
    this.cotizacionService.setFechaRange(this.selectedRange); // <-- Añade esta línea
  }

  showError(message: string) {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  get currentMonthYear(): string {
    return `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  get selectedDaysCount(): number {
    if (!this.selectedRange.startDate || !this.selectedRange.endDate) return 0;
    
    const diffTime = Math.abs(this.selectedRange.endDate.getTime() - this.selectedRange.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }

  /**
   * Getter para verificar si hay una cabaña seleccionada
   */
  get tieneCabanaSeleccionada(): boolean {
    return this.cotizacionData?.cabana !== null && this.cotizacionData?.cabana !== undefined;
  }

/**
 * Getter para obtener el nombre de la cabaña seleccionada
 */
get nombreCabana(): string {
  if (!this.cotizacionData?.cabana) return '';
  
  // Mapear según la capacidad a números de cabaña
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
   * Getter para obtener la cantidad de personas
   */
  get cantidadPersonas(): number {
    return this.cotizacionData?.cantidadPersonas || 0;
  }
}