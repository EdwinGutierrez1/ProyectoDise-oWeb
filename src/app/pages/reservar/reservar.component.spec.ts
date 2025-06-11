// Utilidades de Angular para testing de componentes
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Componente a probar
import { ReservarComponent } from './reservar.component';

// Suite de pruebas para el componente de reservas
describe('CotizarComponent', () => {
  let component: ReservarComponent;
  let fixture: ComponentFixture<ReservarComponent>;

  // Configuración inicial antes de cada prueba
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservarComponent]  // Importación del componente standalone
    })
    .compileComponents();

    // Creación de la instancia del componente para testing
    fixture = TestBed.createComponent(ReservarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Ejecuta el ciclo de detección de cambios
  });

  // Prueba básica de creación del componente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});