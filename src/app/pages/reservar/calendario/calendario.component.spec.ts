import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarioComponent } from './calendario.component';

describe('CalendarioComponent', () => {
  let component: CalendarioComponent;
  let fixture: ComponentFixture<CalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current date', () => {
    expect(component.currentDate).toBeDefined();
    expect(component.selectedRange).toEqual({ startDate: null, endDate: null });
  });

  it('should generate calendar days', () => {
    component.generateCalendar();
    expect(component.calendarDays.length).toBeGreaterThan(0);
    expect(component.calendarDays.length).toBeLessThanOrEqual(42); // máximo 6 semanas
  });

  it('should handle date selection', () => {
    const mockDay = {
      date: new Date(),
      isCurrentMonth: true,
      isSelected: false,
      isInRange: false,
      isStartDate: false,
      isEndDate: false,
      isDisabled: false
    };

    component.onDateClick(mockDay);
    expect(component.selectedRange.startDate).toEqual(mockDay.date);
    expect(component.isSelectingEndDate).toBe(true);
  });

  it('should not select disabled dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const mockDisabledDay = {
      date: yesterday,
      isCurrentMonth: true,
      isSelected: false,
      isInRange: false,
      isStartDate: false,
      isEndDate: false,
      isDisabled: true
    };

    component.onDateClick(mockDisabledDay);
    expect(component.selectedRange.startDate).toBeNull();
  });

  it('should handle predefined range selection', () => {
    const range = { label: '3 días', days: 3 };
    component.onPredefinedRangeClick(range);
    
    expect(component.selectedRange.startDate).toBeDefined();
    expect(component.selectedRange.endDate).toBeDefined();
    expect(component.isSelectingEndDate).toBe(false);
  });

  it('should clear selection', () => {
    // Primero establecer una selección
    component.selectedRange = { 
      startDate: new Date(), 
      endDate: new Date() 
    };
    
    component.clearSelection();
    
    expect(component.selectedRange.startDate).toBeNull();
    expect(component.selectedRange.endDate).toBeNull();
    expect(component.isSelectingEndDate).toBe(false);
  });

  it('should navigate months', () => {
    const currentMonth = component.currentDate.getMonth();
    
    component.nextMonth();
    expect(component.currentDate.getMonth()).toBe((currentMonth + 1) % 12);
    
    component.previousMonth();
    expect(component.currentDate.getMonth()).toBe(currentMonth);
  });

  it('should calculate selected days count correctly', () => {
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date(2025, 0, 3);
    
    component.selectedRange = { startDate, endDate };
    
    expect(component.selectedDaysCount).toBe(3);
  });

  it('should check if dates are the same day', () => {
    const date1 = new Date(2025, 0, 1);
    const date2 = new Date(2025, 0, 1);
    const date3 = new Date(2025, 0, 2);
    
    expect(component.isSameDay(date1, date2)).toBe(true);
    expect(component.isSameDay(date1, date3)).toBe(false);
  });

  it('should disable past dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    expect(component.isDateDisabled(yesterday)).toBe(true);
  });
});